import { AuthService } from '../services/auth.service.js';

export const requestOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const response = await AuthService.requestOTP(phone);
    res.status(200).json({ success: true, message: 'OTP explicitly requested.', data: response });
  } catch (err) {
    next(err);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const session = await AuthService.verifyOTP(phone, otp);
    
    // In strict production, the JWT might be set in an HTTP-only cookie here.
    // For MVP frontend ingestion, returning it in payload is acceptable.
    res.status(200).json({
      success: true,
      message: 'Authenticated successfully',
      session,
    });
  } catch (err) {
    // If it's auth/unauthorized, 401 is better, but this hits global error handler.
    err.status = 401; 
    next(err);
  }
};
