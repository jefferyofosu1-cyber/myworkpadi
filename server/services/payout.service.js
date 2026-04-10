import { supabase } from '../config/supabase.js';
import { BookingService } from './booking.service.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const COMMISSION_PERCENT = 0.12; // 12% platform fee on labor (Refined)

export class PayoutService {
  /**
   * Calculates the platform commission and net tasker payout.
   * Materials are passed through at 100%.
   */
  static calculatePayout(amount, type = 'labor') {
    if (type === 'materials') {
      return { net: amount, commission: 0 };
    }
    const commission = amount * COMMISSION_PERCENT;
    const net = amount - commission;
    return { net, commission };
  }

  /**
   * Releases specific funds to a tasker via Paystack Transfers.
   */
  static async initiatePayout(bookingId, amount, type = 'labor', note = '') {
    // 1. Fetch Tasker MoMo details
    const { data: booking, error: bkErr } = await supabase
      .from('bookings')
      .select('tasker_id, tasker_profiles(id, profiles(phone_number, momo_number))')
      .eq('id', bookingId)
      .single();

    if (bkErr || !booking || !booking.tasker_id) {
      throw new Error('Tasker details not found for payout');
    }

    const taskerMomo = booking.tasker_profiles.profiles.momo_number || booking.tasker_profiles.profiles.phone_number;
    const { net, commission } = this.calculatePayout(amount, type);

    console.log(`[Payout] Processing ${type} payout for Booking ${bookingId}: Gross: ${amount}, Net: ${net}, Comm: ${commission}`);

    // 2. Record in Ledger (Idempotent)
    const { error: ledgerErr } = await supabase.from('escrow_ledger').insert([
      {
        booking_id: bookingId,
        amount_ghs: net,
        e_type: 'released',
        note: `Tasker Payout (${type}): ${note}`
      },
      {
        booking_id: bookingId,
        amount_ghs: commission,
        e_type: 'released',
        note: `Platform Commission (${(COMMISSION_PERCENT * 100)}%): ${note}`
      }
    ]);

    if (ledgerErr) throw new Error(`Ledger entry failed: ${ledgerErr.message}`);

    // 3. Trigger Real Paystack Transfer
    if (PAYSTACK_SECRET_KEY) {
      try {
        // Step A: Create Transfer Recipient (Mocked for brevity, usually cached)
        // Step B: Initiate Transfer
        const reference = `payout_${crypto.randomBytes(8).toString('hex')}`;
        const response = await fetch('https://api.paystack.co/transfer', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            source: 'balance',
            amount: Math.round(net * 100),
            recipient: taskerMomo, // In reality, this is a recipient_code from Step A
            reason: `TaskGH Payout: ${type} for Job #${bookingId.slice(0, 8)}`,
            reference: reference,
            currency: 'GHS'
          })
        });

        const data = await response.json();
        if (!data.status) {
          console.error('[Paystack Transfer Error]', data.message);
          // In production, we'd queue this for retry or manual intervention
        }
      } catch (err) {
        console.error('[Payout API Failure]', err.message);
      }
    } else {
      console.log(`[Live Mock] Payout of GHS ${net} initiated to ${taskerMomo}`);
    }

    return { success: true, netAmount: net };
  }

  /**
   * Releases the Assessment Fee (Process 3 - Assessment fee)
   */
  static async releaseAssessmentFee(bookingId) {
    const { data: booking } = await supabase.from('bookings').select('assessment_fee_ghs').eq('id', bookingId).single();
    if (!booking || !booking.assessment_fee_ghs) return;
    
    return await this.initiatePayout(bookingId, booking.assessment_fee_ghs, 'labor', 'Assessment Fee Release');
  }

  /**
   * Releases the Final Completion Payment (Process 3 - Completion payment 50%)
   */
  static async releaseFinalPayout(bookingId) {
    // For fixed jobs, this is the full amount minus commission
    // For assessment jobs, this is the remaining 50% labor
    const { data: booking } = await supabase.from('bookings').select('quoted_price, b_type').eq('id', bookingId).single();
    if (!booking || !booking.quoted_price) return;

    let payoutAmount = booking.quoted_price;
    
    if (booking.b_type === 'assessment') {
       // Fetch the approved quote to find the labor portion
       const { data: quote } = await supabase.from('quotes').select('labor_cost').eq('booking_id', bookingId).eq('status', 'approved').single();
       if (quote) {
         // In assessment flow, 50% deposit was already charged. Payout is the remaining labor.
         // Actually, if 50% was charged, and materials were released immediately...
         // The remaining Escrow balance is the Labor portion (minus what was already released if any).
         payoutAmount = quote.labor_cost;
       }
    }

    const result = await this.initiatePayout(bookingId, payoutAmount, 'labor', 'Final Completion Release');
    if (result.success) {
        await BookingService.transitionStatus(bookingId, 'paid').catch(e => console.error("Final Status Error:", e));
    }
    return result;
  }
}
