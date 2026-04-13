/**
 * server/queues/queues.js
 * BullMQ queue instances for TaskGH background processing.
 * All queues share the same Redis connection.
 */

import { Queue } from 'bullmq';
import { redis } from '../config/redisClient.js';

const connection = redis;

// ─── Queue: Notifications ─────────────────────────────────────────────────────
// Handles async delivery of SMS, WhatsApp, and FCM push notifications.
export const notificationQueue = new Queue('notifications', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
  },
});

// ─── Queue: Quote Expiry ──────────────────────────────────────────────────────
// Delayed jobs that fire after 2 hours if a quote hasn't been approved.
export const quoteExpiryQueue = new Queue('quote-expiry', {
  connection,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: { count: 50 },
  },
});

// ─── Queue: Payout Retry ──────────────────────────────────────────────────────
// Retries failed Paystack Transfer API calls with exponential backoff.
export const payoutRetryQueue = new Queue('payout-retry', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 60000 }, // Start at 1 min
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 100 },
  },
});

// ─── Queue: Scheduled Jobs (Cron) ────────────────────────────────────────────
// Recurring platform maintenance tasks.
export const cronQueue = new Queue('cron-tasks', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    removeOnComplete: { count: 20 },
    removeOnFail: { count: 50 },
  },
});

// ─── Helper: Enqueue notification ────────────────────────────────────────────
export const enqueueNotification = async (userId, payload, options = {}) => {
  return notificationQueue.add('send', { userId, payload }, options);
};

// ─── Helper: Schedule quote expiry ───────────────────────────────────────────
export const scheduleQuoteExpiry = async (quoteId, bookingId, delayMs = 2 * 60 * 60 * 1000) => {
  return quoteExpiryQueue.add(
    'expire',
    { quoteId, bookingId },
    { delay: delayMs, jobId: `quote-expire-${quoteId}` }
  );
};

// ─── Helper: Enqueue payout retry ────────────────────────────────────────────
export const enqueuePayoutRetry = async (payload) => {
  return payoutRetryQueue.add('retry', payload);
};
