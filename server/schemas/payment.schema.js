/**
 * server/schemas/payment.schema.js
 * Zod schemas for payment endpoints.
 */

import { z } from 'zod';

const MOMO_PROVIDERS = ['mtn', 'vod', 'tgo', 'telecel', 'at'];

export const initiateChargeSchema = z.object({
  booking_id: z.string().uuid('Invalid booking ID'),
  amount_ghs: z
    .number()
    .positive('Amount must be positive')
    .max(50000, 'Amount exceeds maximum single transaction limit'),
  phone: z
    .string()
    .regex(/^\+233\d{9}$|^0\d{9}$/, 'Invalid Ghana phone number'),
  provider: z
    .string()
    .toLowerCase()
    .refine(
      (val) => MOMO_PROVIDERS.includes(val),
      { message: `Provider must be one of: ${MOMO_PROVIDERS.join(', ')}` }
    ),
  payment_type: z.enum(['assessment', 'deposit'], {
    errorMap: () => ({ message: 'payment_type must be "assessment" or "deposit"' }),
  }),
});

export const verifyPaymentSchema = z.object({
  reference: z.string().min(5, 'Invalid payment reference'),
});
