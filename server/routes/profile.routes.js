import express from 'express';
import { ProfileService } from '../services/profile.service.js';

const router = express.Router();

/**
 * @desc Get current profile
 * @route GET /api/profiles/me
 */
router.get('/me', async (req, res) => {
    // Logic to fetch from Supabase based on userId in header/token
    res.json({ message: 'Profile data placeholder' });
});

/**
 * @desc Complete Customer Profile (Step 4)
 * @route PATCH /api/profiles/me
 */
router.patch('/me', async (req, res) => {
  const userId = req.headers['x-user-id']; // Mock middleware placeholder
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
router.patch('/tasker-business', async (req, res) => {
  const userId = req.headers['x-user-id'];
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
router.post('/identity-cards', async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { frontUrl, backUrl } = req.body;
  try {
    const profile = await ProfileService.linkIdentityCards(userId, frontUrl, backUrl);
    res.json({ message: 'Identity cards linked', profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
