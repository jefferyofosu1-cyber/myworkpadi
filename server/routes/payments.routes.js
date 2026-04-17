import express from 'express';
import { PaymentService } from '../services/payment.service.js';
import { BookingService } from '../services/booking.service.js';

const router = express.Router();

/**
 * @desc Initialize MoMo Payment (Legacy)
 * @route POST /api/payments/initialize
 */
router.post('/initialize', async (req, res) => {
  const { email, amount, metadata } = req.body;
  try {
    const data = await PaymentService.initializePayment(email, amount, metadata);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @desc Initialize MoMo Escrow Payment
 * @route POST /api/payments/initiate
 */
router.post('/initiate', async (req, res) => {
  const { bookingId, amount_ghs, phone, provider, payment_type } = req.body;
  const userId = req.user?.userId || 'guest';
  try {
    const result = await PaymentService.initiateMoMoCharge(bookingId, userId, {
      amount_ghs, phone, provider, payment_type
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @desc Webhook handler for Paystack (Escrow Management)
 * @route POST /api/payments/webhook
 */
router.post('/webhook', express.json(), async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  try {
    const success = await PaymentService.handleWebhook(signature, req.body);
    if (success) console.log('[Webhook] Successfully processed Paystack event');
    res.sendStatus(200);
  } catch (err) {
    console.error('[Webhook Error]:', err.message);
    res.status(400).send(err.message);
  }
});

export default router;
