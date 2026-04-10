import express from 'express';
import { AdminService } from '../services/admin.service.js';

const router = express.Router();

/**
 * @desc Get platform dashboard stats
 * @route GET /api/admin/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await AdminService.getPlatformStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @desc Vet a Tasker (Approve/Reject)
 * @route POST /api/admin/vet-tasker
 */
router.post('/vet-tasker', async (req, res) => {
  const { taskerId, status } = req.body;
  try {
    const profile = await AdminService.vetTasker(taskerId, status);
    res.json({ message: `Tasker vetting status: ${status}`, profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @desc Manually trigger payout release
 * @route POST /api/admin/release-payout
 */
router.post('/release-payout', async (req, res) => {
  const { bookingId } = req.body;
  try {
    const result = await AdminService.triggerPayout(bookingId);
    res.json(result);
/**
 * @desc Resolve a dispute
 * @route PATCH /api/admin/disputes/:id/resolve
 */
router.patch('/disputes/:id/resolve', async (req, res) => {
  const { outcome, adminNotes, partialRefundAmount } = req.body;
  try {
    const { DisputeService } = await import('../services/dispute.service.js');
    const result = await DisputeService.resolveDispute(req.params.id, outcome, adminNotes, partialRefundAmount);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
