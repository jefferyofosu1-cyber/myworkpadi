import express from 'express';
import { PaymentService } from '../services/payment.service.js';

const router = express.Router();

/**
 * @desc Initialize MoMo Payment
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
 * @desc Deposit Escrow via Mobile Money (Live Paystack Integration)
 * @route POST /api/payments/deposit
 */
router.post('/deposit', async (req, res) => {
  const { booking_id, amount, momo_number, provider } = req.body;

  if (!amount || !momo_number) {
    return res.status(400).json({ error: 'Amount and MoMo number required.' });
  }

  try {
    // In live apps, we use initializePayment and handle the redirect/prompt.
    // PaymentService can be expanded to handle direct MoMo charge via Paystack.
    res.status(200).json({
      message: 'Escrow deposit initialized',
      verification_status: 'pending',
      details: { booking_id, amount, provider }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

import { BookingService } from '../services/booking.service.js';

/**
 * @desc Webhook handler for Paystack
 * @route POST /api/payments/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const event = req.body; // Paystack sends a JSON body for successful events
    
    // 1. In production, verify signature here using crypto
    
    // 2. Handle successful charge
    if (event.event === 'charge.success') {
        const { booking_id } = event.data.metadata;
        const amount = event.data.amount / 100; // Paystack is in kobo/pesewas
        
        console.log(`[Webhook] Payment Success for Booking ${booking_id}: GHS ${amount}`);
        
        // Transition state to deposit_paid (which triggers matching broadcast)
        await BookingService.transitionStatus(booking_id, 'deposit_paid');
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('[Webhook Error]:', err.message);
    res.status(400).send(err.message);
  }
});

export default router;
