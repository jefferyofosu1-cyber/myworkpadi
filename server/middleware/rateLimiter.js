/**
 * server/middleware/rateLimiter.js
 * Per-endpoint and global rate limiters for TaskGH API.
 */

import rateLimit from 'express-rate-limit';

const createLimiter = (options) =>
  rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please slow down and try again.',
        retryAfter: Math.ceil(options.windowMs / 1000),
      });
    },
    ...options,
  });

// Auth endpoints: OTP requests and verification
// 10 requests per 15 minutes per IP
export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts. Try again in 15 minutes.',
});

// Stricter OTP limiter: 5 OTP requests per hour per IP
export const otpLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many OTP requests. Try again in 1 hour.',
});

// Payment endpoints: 20 requests per minute per IP
export const paymentLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 20,
});

// Booking creation: 30 per hour to prevent spam
export const bookingLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 30,
});

// General API: 200 requests per minute per IP
export const generalLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 200,
});

// Webhook endpoint: allow high volume from Paystack IPs
export const webhookLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 500,
});
