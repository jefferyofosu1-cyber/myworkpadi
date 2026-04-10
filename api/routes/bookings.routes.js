import express from 'express';
import { BookingService } from '../services/booking.service.js';

const router = express.Router();

/**
 * @desc Create a new booking
 * @route POST /api/bookings
 */
router.post('/', async (req, res) => {
  try {
    // In production, customer_id comes from active auth session token middleware
    const mock_customer_id = req.headers['x-user-id'] || 'c1234567-c123-c123-c123-c12345678900'; 
    const booking = await BookingService.createBooking(mock_customer_id, req.body);
    
    res.status(201).json({
      message: 'Booking request created successfully',
      booking
    });
  } catch (err) {
    console.error('Booking Route Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @desc Transition booking status
 * @route PATCH /api/bookings/:id/status
 */
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const updated = await BookingService.transitionStatus(req.params.id, status);
        res.json({ message: `Status updated to ${status}`, booking: updated });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @desc Get user's active bookings (Customer or Tasker view)
 * @route GET /api/bookings/active
 */
router.get('/active', async (req, res) => {
  // Logic to fetch from DB via service or direct Supabase if simple
  res.json({
    bookings: [
      { id: 'b-001', type: 'assessment', status: 'pending', task: 'Plumbing Repair' },
      { id: 'b-002', type: 'fixed', status: 'accepted', task: 'Mount TV' }
    ]
  });
});

export default router;
