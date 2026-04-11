import { supabase } from '../config/supabase.js';
import { messaging } from '../config/firebase.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FLASHSMS_API_KEY = process.env.FLASHSMS_API_KEY;
const FLASHSMS_SENDER_ID = process.env.FLASHSMS_SENDER_ID || 'TaskGH';

export class NotificationService {
  /**
   * Sends a high-delivery SMS via Flash SMS Africa. (Process 6 - Flash SMS)
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
            isFlash: true // Ensures Class 0 delivery for OTPs
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
   * Sends an in-app push notification via Firebase FCM. (Process 6 - Firebase FCM)
   */
  static async sendPush(userId, title, body, data = {}) {
    // 1. Fetch User FCM Token
    const { data: user } = await supabase.from('profiles').select('fcm_token').eq('id', userId).single();
    
    if (!user?.fcm_token || !messaging) {
      console.log(`[Push Mock] User: ${userId}, Title: ${title}, Body: ${body}`);
      return;
    }

    try {
      await messaging.send({
        token: user.fcm_token,
        notification: { title, body },
        data: data
      });
      console.log(`[Push Success] User: ${userId}`);
    } catch (err) {
      console.error('[FCM Error]', err.message);
    }
  }

  /**
   * Simplified Unified delivery: Push -> SMS.
   */
  static async sendUnified(userId, payload) {
    const { data: profile } = await supabase.from('profiles').select('phone_number, fcm_token').eq('id', userId).single();
    if (!profile) return;

    // 1. Priority: Push (If user active)
    if (profile.fcm_token) {
        await this.sendPush(userId, payload.title, payload.body, payload.data);
    }

    // 2. Absolute Requirement: SMS (Backup or Concurrent)
    await this.sendSMS(profile.phone_number, payload.body);
  }

  /**
   * Specific Alerts
   */
  static async notifySafetyIncident(phoneNumber, bookingId) {
      return await this.sendSMS(phoneNumber, `CRITICAL SAFETY INCIDENT: Booking ${bookingId}. Investigate immediately.`);
  }
}
