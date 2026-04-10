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
 * @desc Cancel a booking (Triggers Refund Policy)
 * @route POST /api/bookings/:id/cancel
 */
router.post('/:id/cancel', async (req, res) => {
    const { reason } = req.body;
    try {
        const result = await BookingService.cancelBooking(req.params.id, reason);
        res.json({ message: 'Booking cancelled successfully', ...result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @desc Reschedule a booking (Triggers new Matching cycle)
 * @route PATCH /api/bookings/:id/reschedule
 */
/**
 * @desc Raise a dispute for a booking
 * @route POST /api/bookings/:id/dispute
 */
router.post('/:id/dispute', async (req, res) => {
    const { reason, evidence_urls } = req.body;
    // In production, user_id comes from auth middleware
    const user_id = req.headers['x-user-id'] || 'fake-user-id'; 
    try {
        const { DisputeService } = await import('../services/dispute.service.js');
        const dispute = await DisputeService.raiseDispute(req.params.id, user_id, reason, evidence_urls);
        res.status(201).json({ message: 'Dispute raised successfully', dispute });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @desc Report a Tasker No-Show (Happiness Guarantee Trigger)
 * @route POST /api/bookings/:id/report-no-show
 */
router.post('/:id/report-no-show', async (req, res) => {
    const user_id = req.headers['x-user-id'] || 'fake-user-id';
    try {
        const { DisputeService } = await import('../services/dispute.service.js');
        const result = await DisputeService.reportNoShow(req.params.id, user_id);
        res.json({ message: 'No-show reported. Refund processed and Tasker penalized.', ...result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.patch('/:id/reschedule', async (req, res) => {
    const { scheduled_at } = req.body;
    try {
        const result = await BookingService.rescheduleBooking(req.params.id, scheduled_at);
        res.json({ message: 'Booking rescheduled successfully', ...result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
