import express from 'express';
import { MatchingService } from '../services/matching.service.js';

const router = express.Router();

/**
 * @desc Tasker accepts a job offer
 * @route POST /api/matching/accept
 */
router.post('/accept', async (req, res) => {
    const { booking_id, tasker_id } = req.body;
    try {
        const result = await MatchingService.acceptJob(booking_id, tasker_id);
        res.json({ message: 'Job accepted and assigned successfully', booking: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @desc Tasker declines a direct manual request (Triggers immediate fallback)
 * @route POST /api/matching/decline
 */
router.post('/decline', async (req, res) => {
    const { booking_id, tasker_id } = req.body;
    try {
        await MatchingService.declineDirectOffer(booking_id, tasker_id);
        res.json({ message: 'Offer declined. System is finding other matching taskers.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
