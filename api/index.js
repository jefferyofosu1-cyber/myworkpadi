import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import * as Sentry from '@sentry/node';

// Middleware & Utilities
import { globalErrorHandler, notFoundHandler } from '../server/middleware/errorHandler.js';
import { generalLimiter, authLimiter } from '../server/middleware/rateLimiter.js';
import { setupSocket } from '../server/realtime/socket.js';

// Workers & Queues
import '../server/workers/notificationWorker.js';
import '../server/workers/quoteExpiryWorker.js';
import '../server/workers/payoutRetryWorker.js';
import { scheduleCronJobs } from '../server/workers/cronWorker.js';

// Routes
import authRoutes from '../server/routes/auth.routes.js';
import bookingsRoutes from '../server/routes/bookings.routes.js';
import paymentsRoutes from '../server/routes/payments.routes.js';
import adminRoutes from '../server/routes/admin.routes.js';
import disputesRoutes from '../server/routes/disputes.routes.js';
import profileRoutes from '../server/routes/profile.routes.js';
import matchingRoutes from '../server/routes/matching.routes.js';
import quotesRoutes from '../server/routes/quotes.routes.js';
import reviewsRoutes from '../server/routes/reviews.routes.js';
import notificationRoutes from '../server/routes/notification.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Sentry
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  app.use(Sentry.Handlers.requestHandler());
}

// 1. Security & Optimization Middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(compression()); // Gzip compression
app.use(morgan('dev')); // Logging
app.use(generalLimiter); // Global rate limiting

// 2. Body Parsers
// NOTE: For Paystack webhooks, you might need raw body for HMAC verification.
// If needed, add a specific raw route before this.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Initialize Socket.io
setupSocket(httpServer);

// 4. Initialize Cron Jobs
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRONS === 'true') {
  scheduleCronJobs().catch(err => console.error('[Cron] Setup failed:', err));
}

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
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/disputes', disputesRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/notifications', notificationRoutes);

// 7. Error Handling
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    console.log(`🚀 TaskGH Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.io ready & BullMQ workers active`);
  });
}

export default app;
