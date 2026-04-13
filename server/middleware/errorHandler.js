/**
 * server/middleware/errorHandler.js
 * Centralized error handling for TaskGH API.
 * Distinguishes operational errors (AppError) from programmer errors.
 */

import * as Sentry from '@sentry/node';

// ─── Custom Error Class ───────────────────────────────────────────────────────
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class AuthError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'AuthError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

// ─── Async Wrapper ────────────────────────────────────────────────────────────
// Eliminates try/catch boilerplate in route handlers
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ─── Global Error Handler Middleware ─────────────────────────────────────────
export const globalErrorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || undefined;

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log non-operational errors to Sentry (programmer errors)
  if (!err.isOperational || statusCode >= 500) {
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(err);
    }
    console.error('[UNHANDLED ERROR]', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      url: req.originalUrl,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// ─── 404 Handler ─────────────────────────────────────────────────────────────
export const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl}`));
};
