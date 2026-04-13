import express from 'express';
import { AdminService } from '../services/admin.service.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @desc Get platform dashboard stats
 * @route GET /api/admin/stats
 */
router.get('/stats', authenticate, authorizeAdmin, async (req, res) => {
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
router.post('/vet-tasker', authenticate, authorizeAdmin, async (req, res) => {
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
router.post('/release-payout', authenticate, authorizeAdmin, async (req, res) => {
  const { bookingId } = req.body;
  try {
    const result = await AdminService.triggerPayout(bookingId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @desc Resolve a dispute
 * @route PATCH /api/admin/disputes/:id/resolve
 */
router.patch('/disputes/:id/resolve', authenticate, authorizeAdmin, async (req, res) => {
  const { outcome, adminNotes, partialRefundAmount } = req.body;
  try {
    const { DisputeService } = await import('../services/dispute.service.js');
    const result = await DisputeService.resolveDispute(req.params.id, outcome, adminNotes, partialRefundAmount);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @desc List all admin profiles
 * @route GET /api/admin/profiles
 */
router.get('/profiles', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const profiles = await AdminService.getAdminProfiles();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @desc Create/Promote an admin profile
 * @route POST /api/admin/profiles
 */
router.post('/profiles', authenticate, authorizeAdmin, async (req, res) => {
  const { userId, role } = req.body;
  try {
    const profile = await AdminService.createAdminProfile(userId, role);
    res.json({ message: 'Admin profile created/updated', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @desc Update admin account status (Active/Inactive)
 * @route PATCH /api/admin/profiles/:id
 */
router.patch('/profiles/:id', authenticate, authorizeAdmin, async (req, res) => {
  const { isActive } = req.body;
  try {
    const profile = await AdminService.updateAdminStatus(req.params.id, isActive);
    res.json({ message: 'Admin status updated', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
