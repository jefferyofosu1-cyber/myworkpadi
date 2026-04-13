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
    // 1. Fetch Tasker MoMo details & Provider
    const { data: booking, error: bkErr } = await supabase
      .from('bookings')
      .select('tasker_id, tasker_profiles(id, profiles(phone_number, momo_number, momo_provider))')
      .eq('id', bookingId)
      .single();

    if (bkErr || !booking || !booking.tasker_id) {
      throw new Error('Tasker details not found for payout');
    }

    const taskerData = booking.tasker_profiles.profiles;
    const taskerMomo = taskerData.momo_number || taskerData.phone_number;
    const provider = taskerData.momo_provider || 'MTN'; // Default to MTN or look up from phone prefix
    
    const { net, commission } = this.calculatePayout(amount, type);

    console.log(`[Payout] Processing ${type} payout for Booking ${bookingId}: Gross: ${amount}, Net: ${net}, Comm: ${commission}`);

    // 2. Record in Ledger (Idempotent tracking of the release intent)
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

    if (ledgerErr) {
        console.error('[Ledger Error]', ledgerErr.message);
        // We continue anyway to ensure tasker gets paid,ledger can be synced.
    }

    // 3. Trigger Real Paystack Transfer
    if (PAYSTACK_SECRET_KEY && PAYSTACK_SECRET_KEY !== 'sk_test_...') {
      try {
        const { enqueuePayoutRetry } = await import('../queues/queues.js');
        const axios = (await import('axios')).default;

        // Step A: Create or Get Transfer Recipient
        // In a real high-scale app, we would cache recipient_codes in tasker_profiles
        const recipientRes = await axios.post(
          'https://api.paystack.co/transferrecipient',
          {
            type: 'mobile_money',
            name: `Tasker_${booking.tasker_id.slice(0, 8)}`,
            account_number: taskerMomo,
            bank_code: provider, // 'MTN', 'VOD', 'TGO'
            currency: 'GHS'
          },
          { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
        );

        if (!recipientRes.data.status) {
           throw new Error(`Recipient creation failed: ${recipientRes.data.message}`);
        }

        const recipientCode = recipientRes.data.data.recipient_code;

        // Step B: Initiate Transfer
        const transferRes = await axios.post(
          'https://api.paystack.co/transfer',
          {
            source: 'balance',
            amount: Math.round(net * 100),
            recipient: recipientCode,
            reason: `TaskGH ${type} payout: #${bookingId.slice(0, 8)}`,
            currency: 'GHS'
          },
          { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
        );

        if (!transferRes.data.status) {
          throw new Error(`Transfer initiation failed: ${transferRes.data.message}`);
        }

        console.log(`[Payout Success] Transfer initiated: ${transferRes.data.data.transfer_code}`);
        
      } catch (err) {
        console.error('[Payout API Failure] Enqueueing retry:', err.message);
        
        // 4. Fallback: Queue for retry with BullMQ
        const { enqueuePayoutRetry } = await import('../queues/queues.js');
        await enqueuePayoutRetry({
            bookingId,
            taskerId: booking.tasker_id,
            amountGhs: net,
            taskerMomo,
            provider,
            note: `Retry: ${type} payout for ${bookingId}`,
            payoutType: type
        }).catch(qErr => console.error('[Queue Error] Failed to enqueue retry:', qErr.message));
      }
    } else {
      console.log(`[Live Mock] Payout of GHS ${net} simulated to ${taskerMomo} (${provider})`);
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
    const { data: booking } = await supabase.from('bookings').select('quoted_price, b_type').eq('id', bookingId).single();
    if (!booking || !booking.quoted_price) return;

    let payoutAmount = booking.quoted_price;
    
    if (booking.b_type === 'assessment') {
       const { data: quote } = await supabase.from('quotes').select('labor_cost').eq('booking_id', bookingId).eq('status', 'approved').single();
       if (quote) {
         payoutAmount = quote.labor_cost;
       }
    }

    const { BookingService } = await import('./booking.service.js');
    const result = await this.initiatePayout(bookingId, payoutAmount, 'labor', 'Final Completion Release');
    
    if (result.success) {
        await BookingService.transitionStatus(bookingId, 'paid').catch(e => console.error("Final Status Error:", e));
    }
    return result;
  }
}
