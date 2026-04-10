import express from 'express';
import { DisputeService } from '../services/dispute.service.js';

const router = express.Router();

/**
 * @desc Raise a new dispute
 * @route POST /api/disputes
 */
router.post('/', async (req, res) => {
  const { bookingId, reason, evidenceUrls } = req.body;
  const userId = req.headers['x-user-id'] || 'mock-user-123';

  try {
    const dispute = await DisputeService.raiseDispute(bookingId, userId, reason, evidenceUrls);
    res.status(201).json({ message: 'Dispute raised successfully', dispute });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @desc Resolve a dispute (Admin only)
 * @route PATCH /api/disputes/:id/resolve
 */
router.patch('/:id/resolve', async (req, res) => {
  const { decision, refundAmount } = req.body;
  try {
    const result = await DisputeService.resolveDispute(req.params.id, decision, refundAmount);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
