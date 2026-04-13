/**
 * server/schemas/quote.schema.js
 * Zod schemas for quote endpoints.
 */

import { z } from 'zod';

export const createQuoteSchema = z.object({
  booking_id: z.string().uuid('Invalid booking ID'),
  labor_cost: z
    .number()
    .positive('Labor cost must be positive')
    .max(10000, 'Labor cost exceeds maximum'),
  materials_cost: z
    .number()
    .min(0, 'Materials cost cannot be negative')
    .max(10000, 'Materials cost exceeds maximum')
    .default(0),
  notes: z.string().max(500).optional(),
});

export const reviseQuoteSchema = z.object({
  labor_cost: z
    .number()
    .positive('Labor cost must be positive')
    .max(10000),
  materials_cost: z
    .number()
    .min(0)
    .max(10000)
    .default(0),
  revision_reason: z
    .string()
    .min(10, 'Please explain the reason for revision')
    .max(300),
});
