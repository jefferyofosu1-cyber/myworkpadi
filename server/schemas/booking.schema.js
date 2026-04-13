/**
 * server/schemas/booking.schema.js
 * Zod schemas for booking endpoints.
 */

import { z } from 'zod';

const VALID_STATUSES = [
  'requested', 'assessment', 'quoted', 'deposit_paid',
  'assigned', 'arrived', 'in_progress', 'completed',
  'confirmed', 'disputed', 'resolved', 'refunded', 'paid',
  'matching_failed', 'cancelled',
];

export const createBookingSchema = z.object({
  category_id: z.string().uuid('Invalid category ID'),
  b_type: z.enum(['fixed', 'assessment']),
  location_address: z.string().min(5, 'Address too short').max(300),
  location_lat: z.number().min(-90).max(90),
  location_lng: z.number().min(-180).max(180),
  problem_description: z.string().min(10, 'Please describe the problem in more detail').max(1000),
  scheduled_at: z
    .string()
    .datetime({ message: 'Invalid datetime format. Use ISO 8601.' })
    .refine(
      (val) => new Date(val) > new Date(),
      { message: 'Scheduled time must be in the future' }
    ),
  tasker_id: z.string().uuid('Invalid tasker ID').optional().nullable(),
});

export const transitionBookingSchema = z.object({
  target_status: z.enum(VALID_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` }),
  }),
  reason: z.string().max(500).optional(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().min(3).max(500).optional().default('Customer cancellation'),
});

export const rescheduleBookingSchema = z.object({
  new_scheduled_at: z
    .string()
    .datetime()
    .refine(
      (val) => new Date(val) > new Date(),
      { message: 'New scheduled time must be in the future' }
    ),
});
