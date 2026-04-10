import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

/**
 * @desc Deposit Escrow via Mobile Money (Mock Paystack Simulation)
 * @route POST /api/payments/deposit
 */
router.post('/deposit', async (req, res) => {
  const { booking_id, amount, momo_number, provider } = req.body;

  if (!amount || !momo_number) {
    return res.status(400).json({ error: 'Amount and MoMo number required.' });
  }

  try {
    // Escrow Business Logic:
    // 1. In real app, call Paystack API to trigger MoMo Prompt on user's phone.
    // 2. We wait for Webhook (or mock success immediately here).
    
    // Create an Escrow record in status 'pending'
    const newTransaction = {
      booking_id: booking_id || 'mock-b-ID',
      amount: parseFloat(amount),
      momo_number,
      network_provider: provider || 'MTN',
      status: 'held_in_escrow', // We fast-forward to success for the mock
      paystack_reference: `TGH-${Date.now()}`
    };

    // Simulate Paystack interaction delay
    setTimeout(() => {
      res.status(200).json({
        message: 'Escrow deposit successful',
        verification_status: 'success',
        transaction: newTransaction
      });
    }, 2000);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @desc Webhook handler for Paystack (to update Escrow status if prompt takes time)
 * @route POST /api/payments/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // Handle Paystack signature validation and event parsing here
  res.sendStatus(200);
});

export default router;
