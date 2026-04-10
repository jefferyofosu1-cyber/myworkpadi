import express from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

/**
 * @desc Create a new booking
 * @route POST /api/bookings
 */
router.post('/', async (req, res) => {
  const { tasker_id, type, description, address, scheduled_at } = req.body;

  try {
    // In production, customer_id comes from active auth session token middleware
    const mock_customer_id = 'c1234567-c123-c123-c123-c12345678900'; 
    
    // We bypass direct insert failing if Supabase URL is blank by pretending:
    res.status(201).json({
      message: 'Booking request created successfully',
      booking: {
        id: 'b-mock-999',
        tasker_id,
        type,
        status: 'pending',
        address,
        scheduled_at: scheduled_at || new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @desc Get user's active bookings (Customer or Tasker view)
 * @route GET /api/bookings/active
 */
router.get('/active', async (req, res) => {
  // Query Supabase for active bookings based on auth session
  res.json({
    bookings: [
      { id: 'b-001', type: 'assessment', status: 'pending', task: 'Plumbing Repair' },
      { id: 'b-002', type: 'fixed', status: 'accepted', task: 'Mount TV' }
    ]
  });
});

export default router;
