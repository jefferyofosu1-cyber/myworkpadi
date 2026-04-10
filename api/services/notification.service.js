import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class NotificationService {
  static TERMII_URL = 'https://api.ng.termii.com/api/sms/send';
  static API_KEY = process.env.TERMII_API_KEY;
  static SENDER_ID = process.env.TERMII_SENDER_ID || 'TaskGH';

  /**
   * General SMS sender using Termii
   */
  static async sendSMS(to, message) {
    if (!this.API_KEY) {
      console.warn('[Notification] TERMII_API_KEY missing. Skipping SMS.');
      return;
    }

    try {
      // Basic number formatting (ensuring it has 233 etc)
      let formattedTo = to;
      if (to.startsWith('0')) {
        formattedTo = '233' + to.substring(1);
      }

      const payload = {
        to: formattedTo,
        from: this.SENDER_ID,
        sms: message,
        type: 'plain',
        channel: 'generic',
        api_key: this.API_KEY,
      };

      const response = await axios.post(this.TERMII_URL, payload);
      console.log(`[Notification] SMS sent to ${formattedTo}. Response:`, response.data);
      return response.data;
    } catch (err) {
      console.error('[Notification Error]:', err.response?.data || err.message);
    }
  }

  /**
   * Templates and Channel Management (Process 6)
   */
  static async notifyBookingUpdate(userId, type, data) {
    const templates = {
      'booking_confirmed': `Your booking for ${data.serviceName} is confirmed! Tasker ${data.taskerName} is assigned.`,
      'escrow_held': `Payment of GHS ${data.amount} for Job #${data.bookingId} is now held in escrow. Work can begin.`,
      'job_arrived': `Tasker ${data.taskerName} has arrived at your location.`,
      'job_completed': `Tasker has marked your job as completed. Please confirm to release funds.`,
      'dispute_raised': `A dispute has been raised for Job #${data.bookingId}. Our team will review it within 24h.`,
    };

    const message = templates[type];
    if (!message) return;

    // Send via multiple channels based on user preferences (Stubbed)
    await this.sendSMS(data.phone, message);
    
    // Future: Add WhatsApp and Push triggers here
    // await this.sendWhatsApp(data.phone, message);
    // await this.sendPush(userId, message);
  }

  /**
   * Broadcasts a new job alert to a set of matched taskers
   */
  static async broadcastJobAlert(phoneNumbers, booking) {
    const message = `[TaskGH] New Job Alert! Location: ${booking.location_address}. Task: ${booking.categories?.name}. View: https://myworkpadi.vercel.app/jobs/${booking.id}`;
    
    const smsPromises = phoneNumbers.map(to => this.sendSMS(to, message));
    return Promise.allSettled(smsPromises);
  }
}
