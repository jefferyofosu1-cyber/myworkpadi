import { redis } from '../config/redisClient.js';
import { supabase } from '../config/supabase.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TERMII_API_KEY = process.env.TERMII_API_KEY;
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'TaskGH';
const TERMII_URL = 'https://api.ng.termii.com/api/sms/send';

export class AuthService {
  /**
   * Generates a 6 digit OTP, stores it in Redis (10m expiration),
   * and sends it to the provided phone number via Termii endpoint.
   */
  static async requestOTP(phone) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in Redis with TTL of 600s (10 min)
    await redis.set(`otp:${phone}`, otp, 'EX', 600);

    const message = `Your TaskGH verification code is ${otp}. It expires in 10 minutes.`;

    // Live Integration with Termii
    if (TERMII_API_KEY) {
      const response = await fetch(TERMII_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          from: TERMII_SENDER_ID,
          sms: message,
          type: 'plain',
          channel: 'generic',
          api_key: TERMII_API_KEY,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Termii SMS failed: ${data.message || 'Unknown error'}`);
      }
      return data;
    } else {
      // Fallback for local testing if API key isn't provided yet
      console.log(`[LIVE MOCK - No Termii API Key] Sent SMS to ${phone}: ${message}`);
      return { message: 'OTP logged to console (missing Termii Key)' };
    }
  }

  /**
   * Verifies the OTP, provisions a new Supabase user if not exists, 
   * and generates a JWT session.
   */
  static async verifyOTP(phone, otp) {
    const cachedOtp = await redis.get(`otp:${phone}`);
    
    if (!cachedOtp) {
      throw new Error('OTP expired or not requested');
    }
    
    if (cachedOtp !== otp) {
      throw new Error('Invalid OTP code');
    }

    // OTP is valid! Remove it.
    await redis.del(`otp:${phone}`);

    // Check if user exists in Supabase DB
    let { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, role')
      .eq('phone', phone)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create via Supabase Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        phone: phone,
        phone_confirm: true, // Auto-confirm since we just verified OTP
      });

      if (authError) throw new Error('Failed to provision user: ' + authError.message);
      
      const newUserId = authData.user.id;
      
      // Create user record in our tracking table
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({ id: newUserId, phone: phone, role: 'customer' })
        .select('id, role')
        .single();
        
      if (insertError) throw new Error('Failed to create user record');
      user = newUser;
    } else if (fetchError) {
      throw new Error('Database error fetching user');
    }

    // Generate JWTs
    const token = jwt.sign(
      { userId: user.id, role: user.role, phone },
      process.env.JWT_SECRET || 'fallback-secret-here',
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      { expiresIn: '7d' }
    );
    
    // Store refresh token config securely in redis
    await redis.set(`refresh:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

    return { token, refreshToken, user };
  }
}
