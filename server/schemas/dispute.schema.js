/**
 * server/schemas/dispute.schema.js
 * Zod schemas for dispute endpoints.
 */

import { z } from 'zod';

const DISPUTE_CATEGORIES = ['QUALITY', 'NO_SHOW', 'MATERIALS', 'SAFETY'];

const RESOLUTION_OUTCOMES = [
  'FULL_REFUND',
  'PARTIAL_REFUND',
  'FULL_RELEASE',
  'RELEASE_WITH_STRIKE',
  'REWORK_ASSIGNED',
  'REASSIGN_FREE',
];

export const raiseDisputeSchema = z.object({
  booking_id: z.string().uuid('Invalid booking ID'),
  category: z.enum(DISPUTE_CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${DISPUTE_CATEGORIES.join(', ')}` }),
  }),
  reason: z
    .string()
    .min(20, 'Please provide more detail about the issue (minimum 20 characters)')
    .max(1000),
  evidence_urls: z.array(z.string().url('Invalid evidence URL')).max(5).optional().default([]),
});

export const resolveDisputeSchema = z.object({
  outcome: z.enum(RESOLUTION_OUTCOMES, {
    errorMap: () => ({ message: `Outcome must be one of: ${RESOLUTION_OUTCOMES.join(', ')}` }),
  }),
  admin_notes: z
    .string()
    .min(10, 'Admin notes required (minimum 10 characters)')
    .max(2000),
  refund_amount_ghs: z
    .number()
    .min(0)
    .optional(),
  release_amount_ghs: z
    .number()
    .min(0)
    .optional(),
});

export const updateDisputeStatusSchema = z.object({
  status: z.enum(['investigating', 'resolved']),
  admin_notes: z.string().max(2000).optional(),
});
