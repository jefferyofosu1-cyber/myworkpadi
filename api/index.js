import dotenv from 'dotenv';
// 1. Load environment variables IMMEDIATELY
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import * as Sentry from '@sentry/node';

// Middleware & Utilities
import { globalErrorHandler, notFoundHandler } from '../server/middleware/errorHandler.js';
import { generalLimiter, authLimiter } from '../server/middleware/rateLimiter.js';
// Removed Workers & Queues as per Vercel serverless migration


// Routes
import authRoutes from '../server/routes/auth.routes.js';
import bookingsRoutes from '../server/routes/bookings.routes.js';
import adminRoutes from '../server/routes/admin.routes.js';
import disputesRoutes from '../server/routes/disputes.routes.js';
import profileRoutes from '../server/routes/profile.routes.js';
import matchingRoutes from '../server/routes/matching.routes.js';
import quotesRoutes from '../server/routes/quotes.routes.js';
import reviewsRoutes from '../server/routes/reviews.routes.js';
import notificationRoutes from '../server/routes/notification.routes.js';


const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Sentry (Only if DSN is valid to prevent boot hangs)
if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your-sentry-dsn') {
  try {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    app.use(Sentry.Handlers.requestHandler());
  } catch (e) {
    console.warn('[WARN] Sentry initialization failed. Skipping...');
  }
}

// 0. HIGH-RESILIENCE DYNAMIC CORS (Must be at the top)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://myworkpadi.vercel.app',
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow if it matches whitelist or is a vercel.app subdomain or is localhost
  const isAllowed = !origin || 
                    allowedOrigins.includes(origin) || 
                    origin.endsWith('.vercel.app') || 
                    origin.includes('localhost') ||
                    origin.includes('127.0.0.1');

  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept, Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // Handle Preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(helmet()); // Basic security, removed restrictive cross-origin policy
app.use(compression()); // Gzip compression
app.use(morgan('dev')); // Logging
app.use(generalLimiter); // Global rate limiting

// 2. Body Parsers
// NOTE: For Paystack webhooks, you might need raw body for HMAC verification.
// If needed, add a specific raw route before this.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Removed Socket.io setup (not natively supported on Vercel Serverless)

// Removed Cron Jobs (Use Vercel Cron instead)

// 5. API Core Routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to TaskGH API', 
    version: '1.0.0',
    status: 'active'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'active', message: 'TaskGH API is running' });
});

// 6. Mount Feature Routes
app.use('/api/auth', authLimiter, authRoutes); // Stricter limit on auth
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/disputes', disputesRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/notifications', notificationRoutes);

if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your-sentry-dsn') {
  app.use(Sentry.Handlers.errorHandler());
}
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server (Used for local dev; Vercel uses the exported app)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 TaskGH Server running locally on port ${PORT}`);
  });
}

export default app;
