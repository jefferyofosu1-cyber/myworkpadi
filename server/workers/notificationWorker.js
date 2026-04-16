/**
 * server/workers/notificationWorker.js
 * BullMQ worker for async notification delivery.
 * Pipeline: FCM Push → WhatsApp → SMS (priority fallback)
 * Concurrency: 5 parallel jobs
 */

import pkg from 'bullmq';
const { Worker } = pkg;
import { redis } from '../config/redisClient.js';
import { supabase } from '../config/supabase.js';
import { messaging } from '../config/firebase.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const FLASHSMS_API_KEY = process.env.FLASHSMS_API_KEY;
const TERMII_API_KEY = process.env.TERMII_API_KEY;

// ─── Delivery Functions ───────────────────────────────────────────────────────

async function sendFCM(fcmToken, title, body, data = {}) {
  if (!messaging || !fcmToken) return false;
  try {
    await messaging.send({
      token: fcmToken,
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ),
      android: { priority: 'high' },
      apns: { payload: { aps: { contentAvailable: true } } },
    });
    return true;
  } catch (err) {
    console.warn('[FCM] Delivery failed:', err.message);
    return false;
  }
}

async function sendWhatsApp(phone, message) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.log(`[WhatsApp Mock] To: ${phone}, Msg: ${message}`);
    return false;
  }
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phone.replace('+', ''),
        type: 'text',
        text: { body: message },
      },
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
    );
    return true;
  } catch (err) {
    console.warn('[WhatsApp] Delivery failed:', err.response?.data?.error?.message || err.message);
    return false;
  }
}

async function sendSMS(phone, message) {
  if (FLASHSMS_API_KEY) {
    try {
      await axios.post(
        'https://app.flashsms.africa/api/v1/sms/send',
        {
          recipients: [phone],
          senderId: process.env.FLASHSMS_SENDER_ID || 'TaskGH',
          message,
          isFlash: false,
        },
        { headers: { Authorization: `Bearer ${FLASHSMS_API_KEY}` } }
      );
      return true;
    } catch (err) {
      console.warn('[FlashSMS] Failed:', err.message);
    }
  }

  if (TERMII_API_KEY) {
    try {
      await axios.post('https://api.ng.termii.com/api/sms/send', {
        to: phone,
        from: process.env.TERMII_SENDER_ID || 'TaskGH',
        sms: message,
        type: 'plain',
        channel: 'generic',
        api_key: TERMII_API_KEY,
      });
      return true;
    } catch (err) {
      console.warn('[Termii] Failed:', err.message);
    }
  }

  // No provider configured — log for dev
  console.log(`[SMS Mock] To: ${phone}, Msg: ${message}`);
  return false;
}

// ─── Store notification in DB for inbox UI ────────────────────────────────────
async function persistNotification(userId, payload) {
  await supabase.from('notifications').insert({
    user_id: userId,
    title: payload.title,
    body: payload.body,
    type: payload.type || 'general',
    data: payload.data || {},
    is_read: false,
  }).select();
}

// ─── Worker Process ───────────────────────────────────────────────────────────
export const notificationWorker = new Worker(
  'notifications',
  async (job) => {
    const { userId, payload } = job.data;
    job.log(`Processing notification for user ${userId}: ${payload.title}`);

    // 1. Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone_number, fcm_token')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error(`User ${userId} not found — cannot deliver notification`);
    }

    // 2. Persist to DB regardless of delivery method
    await persistNotification(userId, payload);

    // 3. Delivery pipeline: FCM → WhatsApp → SMS
    const pushSent = await sendFCM(profile.fcm_token, payload.title, payload.body, payload.data);
    if (!pushSent) {
      // Fallback: WhatsApp for important notifications
      const waSent = await sendWhatsApp(profile.phone_number, `${payload.title}: ${payload.body}`);
      if (!waSent) {
        // Final fallback: SMS
        await sendSMS(profile.phone_number, `${payload.title}: ${payload.body}`);
      }
    }

    return { userId, delivered: true };
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

notificationWorker.on('completed', (job) => {
  console.log(`[NotificationWorker] Job ${job.id} completed for user ${job.data.userId}`);
});

notificationWorker.on('failed', (job, err) => {
  console.error(`[NotificationWorker] Job ${job?.id} failed:`, err.message);
});

export default notificationWorker;
