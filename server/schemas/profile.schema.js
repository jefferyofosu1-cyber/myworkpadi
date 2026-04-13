/**
 * server/schemas/profile.schema.js
 * Zod schemas for profile update endpoints.
 */

import { z } from 'zod';

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100)
    .optional(),
  momo_number: z
    .string()
    .regex(/^\+233\d{9}$|^0\d{9}$/, 'Invalid Ghana phone number')
    .optional()
    .nullable(),
  residential_area: z.string().max(100).optional(),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
  fcm_token: z.string().optional().nullable(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' }
);

export const updateTaskerProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  hourly_rate: z
    .number()
    .positive()
    .max(500, 'Hourly rate cannot exceed GHS 500')
    .optional(),
  service_radius_meters: z
    .number()
    .int()
    .min(1000, 'Minimum radius is 1km')
    .max(50000, 'Maximum radius is 50km')
    .optional(),
  is_available: z.boolean().optional(),
  working_hours: z
    .record(
      z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
      z.object({
        start: z.string().regex(/^\d{2}:\d{2}$/),
        end: z.string().regex(/^\d{2}:\d{2}$/),
        available: z.boolean(),
      })
    )
    .optional(),
});

export const submitTaskerApplicationSchema = z.object({
  skills: z
    .array(z.string().uuid('Invalid skill/service ID'))
    .min(1, 'At least one skill required')
    .max(10, 'Maximum 10 skills'),
  ghana_card_front_url: z.string().url('Invalid image URL'),
  ghana_card_back_url: z.string().url('Invalid image URL'),
  bio: z.string().min(20, 'Please provide a bio of at least 20 characters').max(500),
  hourly_rate: z.number().positive().max(500),
  service_radius_meters: z.number().int().min(1000).max(50000).default(10000),
  agreed_to_terms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
  }),
});
