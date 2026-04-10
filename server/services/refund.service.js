import { supabase } from '../config/supabase.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export class RefundService {
  /**
   * Initiates a refund for a booking.
   * Since native MoMo reversal is often restricted, we use Paystack Transfer back to the customer.
   */
  static async processRefund(bookingId, amount, reason = 'Customer Cancellation') {
    if (amount <= 0) {
      console.log(`[Refund] Skipping zero-amount refund for Booking ${bookingId}`);
      return { success: true, amount: 0 };
    }

    // 1. Fetch Customer Info
    const { data: booking, error: bkErr } = await supabase
      .from('bookings')
      .select('customer_id, profiles(phone_number, momo_number)')
      .eq('id', bookingId)
      .single();

    if (bkErr || !booking) throw new Error('Customer details not found for refund');

    const customerMomo = booking.profiles.momo_number || booking.profiles.phone_number;

    console.log(`[Refund] Processing GHS ${amount} refund for Booking ${bookingId} to ${customerMomo}. Reason: ${reason}`);

    // 2. Insert Refund Entry in Ledger
    const { error: ledgerErr } = await supabase.from('escrow_ledger').insert({
      booking_id: bookingId,
      amount_ghs: amount,
      e_type: 'refunded',
      note: `Refund: ${reason}`
    });

    if (ledgerErr) throw new Error(`Ledger refund entry failed: ${ledgerErr.message}`);

    // 3. Trigger Paystack Transfer back to Customer
    if (PAYSTACK_SECRET_KEY) {
      try {
        const reference = `refund_${crypto.randomBytes(8).toString('hex')}`;
        const response = await fetch('https://api.paystack.co/transfer', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            source: 'balance',
            amount: Math.round(amount * 100),
            recipient: customerMomo, 
            reason: `TaskGH Refund: ${reason} (#${bookingId.slice(0, 8)})`,
            reference: reference,
            currency: 'GHS'
          })
        });

        const data = await response.json();
        if (!data.status) {
          console.error('[Refund API Error]', data.message);
        }
      } catch (err) {
        console.error('[Refund API Failure]', err.message);
      }
    } else {
      console.log(`[Live Mock] Refund of GHS ${amount} initiated to ${customerMomo}`);
    }

    return { success: true, amount };
  }
}
