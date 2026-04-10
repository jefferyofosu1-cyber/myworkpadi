import { PaymentService } from '../services/payment.service.js';

export const initiatePayment = async (req, res, next) => {
  try {
    const { bookingId, amount_ghs, phone, provider, payment_type } = req.body;
    
    // In production, req.user comes from JWT middleware
    const userId = req.user ? req.user.userId : req.body.userId; 

    if (!bookingId || !amount_ghs || !provider || !payment_type) {
      return res.status(400).json({ success: false, message: 'Missing required MoMo initiation parameters' });
    }

    const payload = { amount_ghs, phone, provider, payment_type };
    const response = await PaymentService.initiateMoMoCharge(bookingId, userId, payload);

    res.status(200).json({
      success: true,
      message: 'MoMo Prompt initiated to user phone',
      data: response
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const paystackWebhook = async (req, res, next) => {
  try {
    // Paystack signature comes in headers
    const signature = req.headers['x-paystack-signature'];
    const payload = req.body; // Ensure express is NOT modifying the raw JSON string if you use crypto strictly, or use the parsed body with JSON.stringify() carefully.
    
    // It's critical to respond 200 OK to Paystack immediately so they don't retry.
    // The spec demands this before deep processing if processing takes > 2 secs.
    
    const wasHandled = await PaymentService.handleWebhook(signature, payload);
    
    // We return 200 regardless so Paystack knows we received it.
    res.status(200).json({ success: true, message: 'Webhook received', handled: wasHandled });
    
  } catch (err) {
    console.error('[Paystack Webhook Security Error]:', err.message);
    res.status(401).json({ success: false, message: 'Webhook Signature Invalid' });
  }
};
