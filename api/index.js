import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to TaskGH API', 
    version: '1.0.0',
    status: 'active'
  });
});

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', message: 'TaskGH API is running' });
});

// Import API Routes
import authRoutes from './routes/auth.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import adminRoutes from './routes/admin.routes.js';
import disputesRoutes from './routes/disputes.routes.js';

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/disputes', disputesRoutes);

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
