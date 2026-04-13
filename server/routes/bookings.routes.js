import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { BookingService } from '../services/booking.service.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

/**
 * @desc Get my bookings (Customer)
 * @route GET /api/bookings/me
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select(`
                *,
                categories(name),
                tasker:tasker_id(profiles(full_name))
            `)
            .eq('customer_id', req.user.userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ data: bookings });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @desc Create a new booking
 * @route POST /api/bookings
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const booking = await BookingService.createBooking(req.user.userId, req.body);
    
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
router.patch('/:id/status', authenticate, async (req, res) => {
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
router.post('/:id/cancel', authenticate, async (req, res) => {
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
router.post('/:id/dispute', authenticate, async (req, res) => {
    const { reason, evidence_urls } = req.body;
    const user_id = req.user.userId; 
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
router.post('/:id/report-no-show', authenticate, async (req, res) => {
    const user_id = req.user.userId;
    try {
        const { DisputeService } = await import('../services/dispute.service.js');
        const result = await DisputeService.reportNoShow(req.params.id, user_id);
        res.json({ message: 'No-show reported. Refund processed and Tasker penalized.', ...result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.patch('/:id/reschedule', authenticate, async (req, res) => {
    const { scheduled_at } = req.body;
    try {
        const result = await BookingService.rescheduleBooking(req.params.id, scheduled_at);
        res.json({ message: 'Booking rescheduled successfully', ...result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @desc Get available jobs for board
 * @route GET /api/bookings/available
 */
router.get('/available', authenticate, async (req, res) => {
    try {
        const jobs = await BookingService.getAvailableJobs();
        res.json({ data: jobs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @desc Get tasker dashboard stats
 * @route GET /api/bookings/stats/:taskerId
 */
router.get('/stats/:taskerId', authenticate, async (req, res) => {
    try {
        const stats = await BookingService.getTaskerStats(req.params.taskerId);
        res.json({ data: stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
