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
   * Includes rate limit guard: max 5 requests per hour.
   */
  static async requestOTP(phone) {
    const rateLimitKey = `otp:attempts:${phone}`;
    const attempts = await redis.get(rateLimitKey);
    
    if (attempts && parseInt(attempts) >= 5) {
      throw new Error('Too many OTP requests. Please try again in an hour.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in Redis with TTL of 600s (10 min)
    await redis.set(`otp:${phone}`, otp, 'EX', 600);

    // Increment rate limit attempts
    if (!attempts) {
      await redis.set(rateLimitKey, 1, 'EX', 3600);
    } else {
      await redis.incr(rateLimitKey);
    }

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
  static async verifyOTP(phone, otp, isTasker = false) {
    const cachedOtp = await redis.get(`otp:${phone}`);
    
    if (!cachedOtp) {
      throw new Error('OTP expired or not requested');
    }
    
    if (cachedOtp !== otp) {
      throw new Error('Invalid OTP code');
    }

    // OTP is valid! Remove it.
    await redis.del(`otp:${phone}`);
    // Also reset rate limit on success
    await redis.del(`otp:attempts:${phone}`);

    // Check if user exists in Supabase DB (Table is 'profiles')
    let { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select('id, is_tasker, is_admin')
      .eq('phone_number', phone)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create via Supabase Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        phone: phone,
        phone_confirm: true, 
      });

      if (authError) throw new Error('Failed to provision user: ' + authError.message);
      
      const newUserId = authData.user.id;
      
      // 1. Create base profile record
      const { data: newUser, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: newUserId, phone_number: phone, is_tasker: isTasker })
        .select('id, is_tasker, is_admin')
        .single();
        
      if (insertError) throw new Error('Failed to create user profile');
      user = newUser;

      // 2. If Tasker, initialize the tasker-specific profile
      if (isTasker) {
        await supabase.from('tasker_profiles').insert({ id: newUserId, is_verified: false });
      }
    } else if (fetchError) {
      throw new Error('Database error fetching user profile');
    }

    return this.generateSession(user, phone);
  }

  /**
   * Generates a pair of Access and Refresh tokens.
   */
  static async generateSession(user, phone) {
    // Determine JWT Role
    let userRole = user.is_tasker ? 'tasker' : 'customer';
    let adminRole = null;

    if (user.is_admin) {
      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        userRole = 'admin';
        adminRole = profile.role;
      }
    }

    // Generate JWTs
    const token = jwt.sign(
      { userId: user.id, role: userRole, adminRole, phone },
      process.env.JWT_SECRET || 'fallback-secret-here',
      { expiresIn: '1h' } // 1 hour access token
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-token-secret',
      { expiresIn: '7d' } // 7 day refresh token
    );
    
    // Store refresh token securely in redis for rotation/revocation
    await redis.set(`refresh:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

    return { token, refreshToken, user: { ...user, role: userRole, adminRole } };
  }

  /**
   * Refreshes an expired access token using a valid refresh token.
   * Implements token rotation logic.
   */
  static async refreshToken(rToken) {
    try {
      const decoded = jwt.verify(rToken, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-token-secret');
      const userId = decoded.userId;

      // Verify token exists in Redis (revocation check)
      const storedToken = await redis.get(`refresh:${userId}`);
      if (!storedToken || storedToken !== rToken) {
        throw new Error('Refresh token revoked or invalid');
      }

      // Fetch user profile to get latest roles
      const { data: user, error } = await supabase
        .from('profiles')
        .select('id, is_tasker, is_admin, phone_number')
        .eq('id', userId)
        .single();

      if (error || !user) throw new Error('User no longer exists');

      // Generate new session (Rotation)
      return this.generateSession(user, user.phone_number);
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Revokes user session by deleting refresh token from Redis.
   */
  static async logout(userId) {
    await redis.del(`refresh:${userId}`);
    return { message: 'Logged out successfully' };
  }
}
