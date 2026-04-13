/**
 * server/workers/quoteExpiryWorker.js
 * BullMQ worker that handles quote expiry after the 2-hour window.
 * Called via delayed job scheduled when a quote is created.
 */

import { Worker } from 'bullmq';
import { redis } from '../config/redisClient.js';
import { supabase } from '../config/supabase.js';
import { enqueueNotification } from '../queues/queues.js';

export const quoteExpiryWorker = new Worker(
  'quote-expiry',
  async (job) => {
    const { quoteId, bookingId } = job.data;
    job.log(`Checking expiry for quote ${quoteId}`);

    // 1. Check if quote is still pending (customer might have already approved/declined)
    const { data: quote, error } = await supabase
      .from('quotes')
      .select('id, status, booking_id, tasker_id')
      .eq('id', quoteId)
      .single();

    if (error || !quote) {
      job.log(`Quote ${quoteId} not found — may have been deleted. Skipping.`);
      return { skipped: true };
    }

    if (quote.status !== 'pending') {
      job.log(`Quote ${quoteId} is already in status "${quote.status}". No action required.`);
      return { skipped: true, status: quote.status };
    }

    // 2. Quote has expired — mark it
    await supabase
      .from('quotes')
      .update({ status: 'expired' })
      .eq('id', quoteId);

    // 3. Fetch booking to find customer_id
    const { data: booking } = await supabase
      .from('bookings')
      .select('customer_id, tasker_id, status')
      .eq('id', bookingId)
      .single();

    if (!booking) return { skipped: true };

    // 4. Cancel the booking (assessment fee kept — customer didn't respond)
    if (!['cancelled', 'refunded', 'paid'].includes(booking.status)) {
      await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: 'Quote expired — customer did not respond within 2 hours',
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      job.log(`Booking ${bookingId} cancelled due to quote expiry`);
    }

    // 5. Notify customer
    if (booking.customer_id) {
      await enqueueNotification(booking.customer_id, {
        title: 'Quote Expired',
        body: 'Your quote has expired as no response was received within 2 hours. The booking has been cancelled.',
        type: 'info',
        data: { bookingId },
      });
    }

    // 6. Notify tasker
    if (booking.tasker_id) {
      await enqueueNotification(booking.tasker_id, {
        title: 'Quote Expired',
        body: 'Your quote was not responded to within 2 hours. The booking has been cancelled.',
        type: 'info',
        data: { bookingId },
      });
    }

    return { expired: true, quoteId, bookingId };
  },
  { connection: redis, concurrency: 10 }
);

quoteExpiryWorker.on('completed', (job) => {
  console.log(`[QuoteExpiryWorker] Job ${job.id} completed`);
});

quoteExpiryWorker.on('failed', (job, err) => {
  console.error(`[QuoteExpiryWorker] Job ${job?.id} failed:`, err.message);
});

export default quoteExpiryWorker;
