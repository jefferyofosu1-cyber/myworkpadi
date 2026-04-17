import { supabase } from '../config/supabase.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const FLASHSMS_API_KEY = process.env.FLASHSMS_API_KEY;
const FLASHSMS_SENDER_ID = process.env.FLASHSMS_SENDER_ID || 'TaskGH';

export class AuthService {
  /**
   * Generates a 6 digit OTP, stores it in Supabase otps table (10m expiration),
   * and simulates sending it via SMS.
   */
  static async requestOTP(identifier) {
    // Note: Rate limiting is delegated to Vercel/Redis-less solutions or API Gateway.

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();
    
    // Store in Supabase 'otps' table
    // (Using the legacy 'phone' column to store either email or phone natively)
    const { error } = await supabase.from('otps').upsert({ 
      phone: identifier, 
      otp: otp, 
      expires_at: expiresAt 
    });

    if (error) {
      throw new Error(`Failed to store OTP: ${error.message}`);
    }

    const message = `Your TaskGH verification code is ${otp}. It expires in 10 minutes.`;

    const isEmail = identifier.includes('@');

    if (isEmail) {
      // Simulate Email Delivery via Console Log (Integrate Resend here in future)
      console.log(`[EMAIL MOCK] To: ${identifier} | Subject: Login Code | Body: ${otp}`);
      return { message: 'OTP sent to email successfully' };
    } else {
      // Send OTP via FlashSMS
      if (FLASHSMS_API_KEY) {
        try {
          await axios.post('https://app.flashsms.africa/api/v1/sms/send', {
            recipients: [identifier],
            senderId: FLASHSMS_SENDER_ID,
            message: message,
            isFlash: false 
          }, {
            headers: { 'Authorization': `Bearer ${FLASHSMS_API_KEY}` }
          });
          console.log(`[FlashSMS] Sent OTP to ${identifier}`);
          return { message: `OTP sent successfully` };
        } catch (err) {
          console.error('[FlashSMS Error]', err.response?.data || err.message);
          throw new Error('Failed to send OTP via SMS');
        }
      } else {
        console.log(`[SMS MOCK] Sent SMS to ${identifier}: ${message}`);
        return { message: 'OTP logged to console (FlashSMS disabled - Missing API Key)' };
      }
    }
  }

  /**
   * Verifies the OTP, provisions a new Supabase user if not exists, 
   * and generates a JWT session.
   */
  static async verifyOTP(identifier, otp, isTasker = false) {
    // Fetch OTP from Supabase 'otps' table
    const { data: otpRecord, error: otpError } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', identifier)
      .single();
    
    if (otpError || !otpRecord) {
      throw new Error('OTP expired or not requested');
    }
    
    if (new Date() > new Date(otpRecord.expires_at)) {
      await supabase.from('otps').delete().eq('phone', identifier);
      throw new Error('OTP expired');
    }

    if (otpRecord.otp !== otp) {
      throw new Error('Invalid OTP code');
    }

    // OTP is valid! Remove it.
    await supabase.from('otps').delete().eq('phone', identifier);

    const isEmail = identifier.includes('@');

    // Check if user exists in Supabase DB (Table is 'profiles')
    let query = supabase.from('profiles').select('id, is_tasker, is_admin');
    if (isEmail) {
      query = query.eq('email', identifier);
    } else {
      query = query.eq('phone_number', identifier);
    }

    let { data: user, error: fetchError } = await query.single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create via Supabase Admin API
      const authPayload = isEmail 
        ? { email: identifier, email_confirm: true } 
        : { phone: identifier, phone_confirm: true };

      const { data: authData, error: authError } = await supabase.auth.admin.createUser(authPayload);

      if (authError) throw new Error('Failed to provision user: ' + authError.message);
      
      const newUserId = authData.user.id;
      
      // 1. Create base profile record
      const profilePayload = isEmail
        ? { id: newUserId, email: identifier, is_tasker: isTasker }
        : { id: newUserId, phone_number: identifier, is_tasker: isTasker };

      const { data: newUser, error: insertError } = await supabase
        .from('profiles')
        .insert(profilePayload)
        .select('id, is_tasker, is_admin')
        .single();
        
      if (insertError) throw new Error(`Failed to create user profile: ${insertError.message}`);
      user = newUser;

      // 2. If Tasker, initialize the tasker-specific profile
      if (isTasker) {
        await supabase.from('tasker_profiles').insert({ id: newUserId, is_verified: false });
      }
    } else if (fetchError) {
      throw new Error('Database error fetching user profile');
    }

    return this.generateSession(user, identifier);
  }

  /**
   * Generates a pair of Access and Refresh tokens.
   */
  static async generateSession(user, identifier) {
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
      { userId: user.id, role: userRole, adminRole, identifier },
      process.env.JWT_SECRET || 'fallback-secret-here',
      { expiresIn: '1h' } // 1 hour access token
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-token-secret',
      { expiresIn: '7d' } // 7 day refresh token
    );
    
    // Store refresh token securely in Supabase for rotation/revocation
    await supabase.from('refresh_tokens').upsert({ 
      user_id: user.id, 
      token: refreshToken 
    });

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

      // Verify token exists in Supabase (revocation check)
      const { data: storedTokenRecord } = await supabase
        .from('refresh_tokens')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!storedTokenRecord || storedTokenRecord.token !== rToken) {
        throw new Error('Refresh token revoked or invalid');
      }

      // Fetch user profile to get latest roles
      const { data: user, error } = await supabase
        .from('profiles')
        .select('id, is_tasker, is_admin, phone_number, email')
        .eq('id', userId)
        .single();

      if (error || !user) throw new Error('User no longer exists');

      // Generate new session (Rotation)
      return this.generateSession(user, user.email || user.phone_number);
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Revokes user session by deleting refresh token from Supabase.
   */
  static async logout(userId) {
    await supabase.from('refresh_tokens').delete().eq('user_id', userId);
    return { message: 'Logged out successfully' };
  }
}
