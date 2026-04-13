/**
 * server/middleware/validate.js
 * Zod-based request validation middleware factory.
 * Usage: router.post('/route', validate(schema), handler)
 */

import { ZodError } from 'zod';

/**
 * Validates req.body against a Zod schema.
 * On success, replaces req.body with the parsed (and coerced) data.
 * On failure, passes a ZodError to the global error handler.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (result.success) {
    req.body = result.data; // Use coerced/transformed data
    return next();
  }
  // Pass ZodError to globalErrorHandler
  const err = new ZodError(result.error.errors);
  return next(err);
};

/**
 * Validates req.query against a Zod schema.
 */
export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (result.success) {
    req.query = result.data;
    return next();
  }
  const err = new ZodError(result.error.errors);
  return next(err);
};

/**
 * Validates req.params against a Zod schema.
 */
export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (result.success) {
    req.params = result.data;
    return next();
  }
  const err = new ZodError(result.error.errors);
  return next(err);
};
