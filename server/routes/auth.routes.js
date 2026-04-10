import express from 'express';
import { AuthService } from '../services/auth.service.js';

const router = express.Router();

/**
 * @desc Generate OTP for Email or Phone
 * @route POST /api/auth/trigger-otp
 */
router.post('/trigger-otp', async (req, res) => {
  const { identifier } = req.body; 

  if (!identifier) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Note: identifier here is assumed to be phone for the core TaskGH flow
    const result = await AuthService.requestOTP(identifier);
    res.json({ message: `OTP sent to ${identifier}`, data: result });
  } catch (err) {
    console.error('Auth Service Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @desc Verify OTP
 * @route POST /api/auth/verify-otp
 */
router.post('/verify-otp', async (req, res) => {
  const { identifier, token } = req.body;

  if (!identifier || !token) {
    return res.status(400).json({ error: 'Identifier and token are required' });
  }

  try {
    const result = await AuthService.verifyOTP(identifier, token);
    res.json({ 
      message: 'Authentication successful', 
      token: result.token,
      refreshToken: result.refreshToken,
      user: result.user 
    });
  } catch (err) {
    console.error('Verification Error:', err.message);
    res.status(401).json({ error: err.message });
  }
});

export default router;
