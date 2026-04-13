/**
 * server/schemas/auth.schema.js
 * Zod schemas for authentication endpoints.
 */

import { z } from 'zod';

// Normalizes Ghana phone numbers to +233XXXXXXXXX format
const ghanaPhone = z
  .string()
  .trim()
  .transform((val) => {
    // Strip all non-digits
    const digits = val.replace(/\D/g, '');
    // Handle 0XXXXXXXXX → +233XXXXXXXXX
    if (digits.startsWith('0') && digits.length === 10) {
      return `+233${digits.slice(1)}`;
    }
    // Handle 233XXXXXXXXX → +233XXXXXXXXX
    if (digits.startsWith('233') && digits.length === 12) {
      return `+${digits}`;
    }
    // Already +233XXXXXXXXX
    if (digits.length === 12 && digits.startsWith('233')) {
      return `+${digits}`;
    }
    return val; // Return as-is, validation will catch it
  })
  .refine(
    (val) => /^\+233\d{9}$/.test(val),
    { message: 'Invalid Ghana phone number. Use format: 054XXXXXXX or 0244XXXXXX' }
  );

export const requestOtpSchema = z.object({
  phone: ghanaPhone,
  is_tasker: z.boolean().optional().default(false),
});

export const verifyOtpSchema = z.object({
  phone: ghanaPhone,
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
  is_tasker: z.boolean().optional().default(false),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(10, 'Invalid refresh token'),
});

export const updateFcmTokenSchema = z.object({
  fcm_token: z.string().min(10, 'Invalid FCM token'),
});
