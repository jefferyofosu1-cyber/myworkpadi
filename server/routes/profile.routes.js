import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { ProfileService } from '../services/profile.service.js';

const router = express.Router();

/**
 * @desc Get current profile
 * @route GET /api/profiles/me
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        const profile = await ProfileService.getProfileById(req.user.userId);
        res.json({ user: profile });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @desc Get all active taskers for discovery
 * @route GET /api/profiles/taskers
 */
router.get('/taskers', async (req, res) => {
    try {
        const taskers = await ProfileService.getActiveTaskers();
        res.json({ taskers });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @desc Complete Customer Profile (Step 4)
 * @route PATCH /api/profiles/me
 */
router.patch('/me', authenticate, async (req, res) => {
  const userId = req.user.userId;
  try {
    const profile = await ProfileService.updateMyProfile(userId, req.body);
    res.json({ message: 'Profile updated successfully', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @desc Update Tasker Business Details (Step 6)
 * @route PATCH /api/profiles/tasker-business
 */
router.patch('/tasker-business', authenticate, async (req, res) => {
  const userId = req.user.userId;
  try {
    const profile = await ProfileService.updateTaskerBusiness(userId, req.body);
    res.json({ message: 'Tasker business updated', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @desc Link Identity Cards after Upload (Step 3)
 * @route POST /api/profiles/identity-cards
 */
router.post('/identity-cards', authenticate, async (req, res) => {
  const userId = req.user.userId;
  const { frontUrl, backUrl } = req.body;
  try {
    const profile = await ProfileService.linkIdentityCards(userId, frontUrl, backUrl);
    res.json({ message: 'Identity cards linked', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @desc Update Tasker Skills
 * @route PATCH /api/profiles/skills
 */
router.patch('/skills', authenticate, async (req, res) => {
  const userId = req.user.userId;
  const { skillIds } = req.body;
  try {
    const profile = await ProfileService.updateTaskerSkills(userId, skillIds);
    res.json({ message: 'Skills updated', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @desc Submit for Admin Vetting
 * @route POST /api/profiles/submit-vetting
 */
router.post('/submit-vetting', authenticate, async (req, res) => {
  const userId = req.user.userId;
  try {
    const profile = await ProfileService.submitForVetting(userId);
    res.json({ message: 'Submitted for vetting', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
