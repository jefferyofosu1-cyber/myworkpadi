import { supabase } from '../config/supabase.js';
import { BookingService } from './booking.service.js';
import { PayoutService } from './payout.service.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export class PaymentService {
  /**
   * Hits the Paystack /charge API to request a MoMo prompt on user's phone.
   */
  static async initiateMoMoCharge(bookingId, userId, payload) {
    const { amount_ghs, phone, provider, payment_type } = payload;
    
    if (!PAYSTACK_SECRET_KEY) {
      console.warn('[Live Mock] No Paystack key found. Simulating charge initiation.');
    }

    const reference = `taskgh_${crypto.randomBytes(8).toString('hex')}`;
    
    // 1. Create our internal pending tracking record immediately
    const { data: paymentRecord, error: insertErr } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        payer_id: userId,
        p_type: payment_type, // 'assessment' or 'deposit'
        amount_ghs: amount_ghs,
        momo_reference: reference, // Tie paystack response to this
        momo_provider: provider,
        status: 'pending'
      })
      .select()
      .single();

    if (insertErr) throw new Error(`Payment db error: ${insertErr.message}`);

    const metadata = {
      booking_id: bookingId,
      payment_type: payment_type,
      user_id: userId,
      custom_reference: reference
    };

    // 2. Make real Paystack HTTP call
    if (PAYSTACK_SECRET_KEY) {
      const response = await fetch('https://api.paystack.co/charge', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(amount_ghs * 100), // Paystack requires pesewas/kobo
          email: `${userId}@taskgh.user`, // Paystack demands email, we auto-generate
          currency: 'GHS',
          mobile_money: {
            phone: phone,
            provider: provider // 'mtn', 'vod', etc.
          },
          reference: reference,
          metadata: metadata
        })
      });

      const data = await response.json();
      if (!data.status) {
        throw new Error(data.message || 'Paystack initial charge failed');
      }

      return { record: paymentRecord, paystack_response: data };
    } else {
      return { 
        record: paymentRecord, 
        mock_response: "Simulated charge initiation. Provide PAYSTACK_SECRET_KEY in .env" 
      };
    }
  }

  /**
   * Validates Paystack Webhooks and safely interacts with the Escrow Ledger.
   */
  static async handleWebhook(signature, payloadBody) {
    // 1. Verify Trust
    if (PAYSTACK_SECRET_KEY) {
      const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
                         .update(JSON.stringify(payloadBody))
                         .digest('hex');
                         
      if (hash !== signature) {
        throw new Error('Invalid Paystack Webhook Signature. Unauthorized request.');
      }
    }

    const event = payloadBody.event;
    const data = payloadBody.data;

    if (event === 'charge.success') {
      const reference = data.reference;
      const meta = data.metadata || {};

      // 2. Mark our internal payment as success
      const { data: updatedPayment, error: upErr } = await supabase
        .from('payments')
        .update({ status: 'success', paid_at: new Date() })
        .eq('momo_reference', reference)
        .select()
        .single();
        
      if (upErr) {
         console.error('Webhook matched an unknown reference:', reference);
         return false;
      }
      
      const bookingId = meta.booking_id || updatedPayment.booking_id;

      // 3. Insert securely into Escrow Ledger
      // Bypasses RLS since this runs on backend with Service Role.
      await supabase.from('escrow_ledger').insert({
        booking_id: bookingId,
        amount_ghs: updatedPayment.amount_ghs,
        e_type: 'hold',
        triggered_by: meta.user_id,
        note: `Paystack webhook charge.success (Ref: ${reference})`
      });

      // 4. Trigger the Booking State Machine and handling the Split (Process 2)
      if (meta.payment_type === 'deposit') {
        const { data: quote } = await supabase
          .from('quotes')
          .select('materials_cost, labor_cost')
          .eq('booking_id', bookingId)
          .eq('status', 'approved')
          .single();

        if (quote) {
          // Release Materials immediately (Process 2 Step 6) - 100% pass-through
          PayoutService.initiatePayout(
            bookingId, 
            quote.materials_cost, 
            'materials', 
            'Immediate materials release upon deposit approved'
          ).catch(e => console.error("Materials Payout Error:", e));
        }

        await BookingService.transitionStatus(bookingId, 'deposit_paid');
      } else if (meta.payment_type === 'assessment') {
        // Assessment fees are now GHS 100
        await BookingService.transitionStatus(bookingId, 'assessment');
      }

      return true;
    }

    return false; // Ignored other events
  }
}
