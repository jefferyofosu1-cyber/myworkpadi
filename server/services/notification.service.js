import { supabase } from '../config/supabase.js';
import { messaging } from '../config/firebase.js';
import { notificationQueue } from '../queues/queues.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FLASHSMS_API_KEY = process.env.FLASHSMS_API_KEY;
const FLASHSMS_SENDER_ID = process.env.FLASHSMS_SENDER_ID || 'TaskGH';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

export class NotificationService {
  /**
   * Sends a high-delivery SMS via Flash SMS Africa.
   */
  static async sendSMS(phoneNumber, message) {
    if (!FLASHSMS_API_KEY) {
      console.log(`[FlashSMS Mock] To: ${phoneNumber}, Msg: ${message}`);
      return { message: 'Mock sent' };
    }

    try {
      const response = await axios.post('https://app.flashsms.africa/api/v1/sms/send', {
        recipients: [phoneNumber],
        senderId: FLASHSMS_SENDER_ID,
        message: message,
        isFlash: true 
      }, {
        headers: { 'Authorization': `Bearer ${FLASHSMS_API_KEY}` }
      });
      return response.data;
    } catch (err) {
      console.error('[FlashSMS Error]', err.response?.data || err.message);
      throw err;
    }
  }

  /**
   * Sends a WhatsApp message via Meta Cloud API.
   */
  static async sendWhatsApp(phone, message) {
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
      console.log(`[WhatsApp Mock] To: ${phone}, Msg: ${message}`);
      return { message: 'Mock sent' };
    }

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phone.replace('+', ''),
          type: 'text',
          text: { body: message }
        },
        { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
      );
      return response.data;
    } catch (err) {
      console.error('[WhatsApp Error]', err.response?.data || err.message);
      throw err;
    }
  }

  /**
   * Sends an in-app push notification via Firebase FCM.
   */
  static async sendPush(userId, title, body, data = {}) {
    const { data: user } = await supabase.from('profiles').select('fcm_token').eq('id', userId).single();
    
    if (!user?.fcm_token || !messaging) {
      console.log(`[Push Mock] User: ${userId}, Title: ${title}, Body: ${body}`);
      return;
    }

    try {
      await messaging.send({
        token: user.fcm_token,
        notification: { title, body },
        data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]))
      });
      console.log(`[Push Success] User: ${userId}`);
    } catch (err) {
      console.error('[FCM Error]', err.message);
    }
  }

  /**
   * Persists a notification to the database for historical tracking.
   */
  static async persistNotification(userId, payload) {
    const { data, error } = await supabase.from('notifications').insert({
      user_id: userId,
      title: payload.title,
      body: payload.body,
      type: payload.type || 'general',
      data: payload.data || {},
      is_read: false
    });
    
    if (error) console.error('[DB Persist Error]', error.message);
    return data;
  }

  /**
   * Enqueues a notification for asynchronous delivery via BullMQ.
   */
  static async enqueueNotification(userId, payload) {
    // 1. Immediately persist to DB so it shows up in user inbox
    await this.persistNotification(userId, payload);

    // 2. Add to BullMQ for background delivery (FCM -> WA -> SMS)
    await notificationQueue.add('send', { userId, payload }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 }
    });
  }

  /**
   * Unified delivery entry point.
   */
  static async sendUnified(userId, payload) {
    // Use the queue for reliable background delivery
    await this.enqueueNotification(userId, payload);
  }

  /**
   * Specific Alerts
   */
  static async notifySafetyIncident(phoneNumber, bookingId) {
    const message = `CRITICAL SAFETY INCIDENT: Booking ${bookingId}. Investigate immediately.`;
    // For critical safety, we send immediately and bypass queue
    return await this.sendSMS(phoneNumber, message);
  }
}
