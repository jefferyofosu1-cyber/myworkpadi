/**
 * server/workers/cronWorker.js
 * BullMQ scheduled (repeating) jobs for platform maintenance.
 * - Every 5min: stale booking detection
 * - Every 1hr: no-show detection + auto-cancel
 * - Every day 8am GMT: daily revenue report to admin
 */

import pkg from 'bullmq';
const { Worker, QueueScheduler } = pkg;
import { cronQueue } from '../queues/queues.js';
import { redis } from '../config/redisClient.js';
import { supabase } from '../config/supabase.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const ADMIN_ALERT_PHONE = process.env.ADMIN_ALERT_PHONE;

// ─── Admin WhatsApp notification ──────────────────────────────────────────────
async function sendAdminWhatsApp(message) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID || !ADMIN_ALERT_PHONE) {
    console.log('[Cron Admin Alert]', message);
    return;
  }
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: ADMIN_ALERT_PHONE.replace('+', ''),
        type: 'text',
        text: { body: message },
      },
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
    );
  } catch (err) {
    console.error('[Cron WhatsApp failed]', err.message);
  }
}

// ─── Job Handlers ─────────────────────────────────────────────────────────────

async function handleStaleBookingCheck() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  // Find bookings where tasker is assigned but hasn't arrived 30+ min after scheduled_at
  const { data: staleBookings } = await supabase
    .from('bookings')
    .select('id, customer_id, tasker_id, location_address, scheduled_at')
    .eq('status', 'assigned')
    .lt('scheduled_at', thirtyMinutesAgo);

  if (!staleBookings || staleBookings.length === 0) return { processed: 0 };

  for (const booking of staleBookings) {
    console.log(`[Cron] Stale booking detected: ${booking.id}`);
    await sendAdminWhatsApp(
      `⚠️ STALE BOOKING ALERT\nBooking: ${booking.id}\nAddress: ${booking.location_address}\nScheduled: ${booking.scheduled_at}\nTasker has not marked arrival 30+ minutes after scheduled time.`
    );
  }

  return { processed: staleBookings.length };
}

async function handleNoShowDetection() {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const { data: noShowBookings } = await supabase
    .from('bookings')
    .select('id, customer_id, tasker_id, assessment_fee_ghs')
    .eq('status', 'assigned')
    .lt('scheduled_at', twoHoursAgo);

  if (!noShowBookings || noShowBookings.length === 0) return { processed: 0 };

  for (const booking of noShowBookings) {
    console.log(`[Cron] Auto-cancelling no-show booking: ${booking.id}`);

    // Cancel booking and issue full refund
    await supabase
      .from('bookings')
      .update({
        status: 'refunded',
        cancellation_reason: 'Auto-cancelled: Tasker did not arrive within 2 hours of scheduled time',
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking.id);

    // Record refund in escrow ledger
    if (booking.assessment_fee_ghs > 0) {
      await supabase.from('escrow_ledger').insert({
        booking_id: booking.id,
        amount_ghs: booking.assessment_fee_ghs,
        e_type: 'refunded',
        note: 'Auto-refund: Tasker no-show (2hr threshold)',
      });
    }

    // Alert admin of the no-show
    await sendAdminWhatsApp(
      `🔴 NO-SHOW AUTO-CANCEL\nBooking: ${booking.id}\nTasker: ${booking.tasker_id}\nRefund issued: GHS ${booking.assessment_fee_ghs}\n\nConsider applying a strike to this tasker.`
    );
  }

  return { processed: noShowBookings.length };
}

async function handleDailyRevenueReport() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const start = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString();

  // Total payouts released yesterday
  const { data: ledger } = await supabase
    .from('escrow_ledger')
    .select('amount_ghs, e_type')
    .gte('created_at', start)
    .lte('created_at', end);

  const totalHeld = (ledger || []).filter(r => r.e_type === 'held').reduce((s, r) => s + r.amount_ghs, 0);
  const totalReleased = (ledger || []).filter(r => r.e_type === 'released').reduce((s, r) => s + r.amount_ghs, 0);
  const totalRefunded = (ledger || []).filter(r => r.e_type === 'refunded').reduce((s, r) => s + r.amount_ghs, 0);

  // New bookings yesterday
  const { count: newBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', start)
    .lte('created_at', end);

  // Paid-out bookings yesterday
  const { count: completedJobs } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'paid')
    .gte('updated_at', start)
    .lte('updated_at', end);

  const dateStr = new Date(start).toLocaleDateString('en-GH', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });

  await sendAdminWhatsApp(
    `📊 TASKGH DAILY REPORT — ${dateStr}\n\n` +
    `New Bookings: ${newBookings || 0}\n` +
    `Jobs Completed: ${completedJobs || 0}\n\n` +
    `💰 FINANCIALS\n` +
    `Funds Received (Escrow): GHS ${totalHeld.toFixed(2)}\n` +
    `Funds Released (Payouts): GHS ${totalReleased.toFixed(2)}\n` +
    `Funds Refunded: GHS ${totalRefunded.toFixed(2)}\n` +
    `Platform Revenue (12%): GHS ${(totalReleased * 0.12).toFixed(2)}`
  );

  return { totalHeld, totalReleased, totalRefunded, newBookings, completedJobs };
}

// ─── Worker ───────────────────────────────────────────────────────────────────
export const cronWorker = new Worker(
  'cron-tasks',
  async (job) => {
    job.log(`[Cron] Running job: ${job.name}`);

    switch (job.name) {
      case 'staleBookingCheck':
        return await handleStaleBookingCheck();
      case 'noShowDetection':
        return await handleNoShowDetection();
      case 'dailyRevenueReport':
        return await handleDailyRevenueReport();
      default:
        throw new Error(`Unknown cron job: ${job.name}`);
    }
  },
  { connection: redis, concurrency: 1 }
);

// ─── Schedule Recurring Jobs ──────────────────────────────────────────────────
export async function scheduleCronJobs() {
  // Run every 5 minutes
  await cronQueue.add(
    'staleBookingCheck',
    {},
    { repeat: { pattern: '*/5 * * * *' }, jobId: 'stale-booking-check' }
  );

  // Run every hour
  await cronQueue.add(
    'noShowDetection',
    {},
    { repeat: { pattern: '0 * * * *' }, jobId: 'no-show-detection' }
  );

  // Run daily at 8:00 AM GMT (no DST issues for Ghana)
  await cronQueue.add(
    'dailyRevenueReport',
    {},
    { repeat: { pattern: '0 8 * * *' }, jobId: 'daily-revenue-report' }
  );

  console.log('[Cron] Scheduled: staleBookingCheck (5min), noShowDetection (1hr), dailyRevenueReport (8am)');
}

cronWorker.on('completed', (job, result) => {
  console.log(`[CronWorker] ${job.name} completed:`, result);
});

cronWorker.on('failed', (job, err) => {
  console.error(`[CronWorker] ${job?.name} failed:`, err.message);
});

export default cronWorker;
