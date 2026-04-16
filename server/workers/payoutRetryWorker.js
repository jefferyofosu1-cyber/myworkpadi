/**
 * server/workers/payoutRetryWorker.js
 * BullMQ worker that retries failed Paystack Transfer payouts.
 * Exponential backoff: 1min → 5min → 15min
 * After 3 failures: admin alert via WhatsApp.
 */

import pkg from 'bullmq';
const { Worker } = pkg;
import { redis } from '../config/redisClient.js';
import { supabase } from '../config/supabase.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const ADMIN_ALERT_PHONE = process.env.ADMIN_ALERT_PHONE; // Admin's WhatsApp number

// ─── Paystack Transfer Initiator ──────────────────────────────────────────────
async function initiatePaystackTransfer({ bookingId, taskerId, amountGhs, taskerMomo, provider, note }) {
  if (!PAYSTACK_SECRET_KEY) {
    console.log(`[Payout Mock] Would transfer GHS ${amountGhs} to ${taskerMomo}`);
    return { success: true, mock: true };
  }

  const amountKobo = Math.round(amountGhs * 100);

  // Step 1: Create transfer recipient (idempotent — cached by Paystack)
  const recipientRes = await axios.post(
    'https://api.paystack.co/transferrecipient',
    {
      type: 'mobile_money',
      name: `TaskGH Tasker ${taskerId}`,
      account_number: taskerMomo,
      bank_code: provider, // 'MTN', 'VOD', etc.
      currency: 'GHS',
    },
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
  );

  if (!recipientRes.data.status) {
    throw new Error(`Recipient creation failed: ${recipientRes.data.message}`);
  }

  const recipientCode = recipientRes.data.data.recipient_code;

  // Step 2: Initiate transfer
  const transferRes = await axios.post(
    'https://api.paystack.co/transfer',
    {
      source: 'balance',
      amount: amountKobo,
      recipient: recipientCode,
      reason: note || `TaskGH Payout — Booking ${bookingId}`,
      currency: 'GHS',
    },
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
  );

  if (!transferRes.data.status) {
    throw new Error(`Transfer failed: ${transferRes.data.message}`);
  }

  return { success: true, transferData: transferRes.data.data };
}

// ─── Admin Alert ──────────────────────────────────────────────────────────────
async function alertAdmin(message) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID || !ADMIN_ALERT_PHONE) {
    console.error('[ADMIN ALERT]', message);
    return;
  }
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: ADMIN_ALERT_PHONE.replace('+', ''),
        type: 'text',
        text: { body: `🔴 TASKGH PAYOUT ALERT:\n${message}` },
      },
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
    );
  } catch (err) {
    console.error('[Admin WhatsApp alert failed]', err.message);
  }
}

// ─── Worker ───────────────────────────────────────────────────────────────────
export const payoutRetryWorker = new Worker(
  'payout-retry',
  async (job) => {
    const { bookingId, taskerId, amountGhs, taskerMomo, provider, note, payoutType } = job.data;
    job.log(`Retrying payout for booking ${bookingId}, amount GHS ${amountGhs} (attempt ${job.attemptsMade + 1})`);

    // Execute payout via Paystack
    const result = await initiatePaystackTransfer({
      bookingId, taskerId, amountGhs, taskerMomo, provider, note,
    });

    if (result.success) {
      // Record in escrow ledger
      await supabase.from('escrow_ledger').insert({
        booking_id: bookingId,
        amount_ghs: amountGhs,
        e_type: 'released',
        note: `${payoutType || 'Payout'} via retry worker (attempt ${job.attemptsMade + 1})`,
      });

      job.log(`Payout successful for booking ${bookingId}`);
    }

    return result;
  },
  {
    connection: redis,
    concurrency: 3,
  }
);

// Alert admin after all retries exhausted
payoutRetryWorker.on('failed', async (job, err) => {
  console.error(`[PayoutRetryWorker] Job ${job?.id} permanently failed:`, err.message);

  if (job && job.attemptsMade >= (job.opts?.attempts || 3)) {
    const { bookingId, amountGhs, taskerId } = job.data;
    await alertAdmin(
      `Payout permanently failed after 3 retries.\nBooking: ${bookingId}\nTasker: ${taskerId}\nAmount: GHS ${amountGhs}\nError: ${err.message}\n\nManual intervention required.`
    );
  }
});

payoutRetryWorker.on('completed', (job) => {
  console.log(`[PayoutRetryWorker] Job ${job.id} completed successfully`);
});

export default payoutRetryWorker;
