import express from 'express';
import { QuoteService } from '../services/quote.service.js';

const router = express.Router();

/**
 * @desc Get quotes for a booking
 * @route GET /api/quotes/:bookingId
 */
router.get('/:bookingId', async (req, res) => {
    // Fetch logic placeholder
    res.json({ message: 'Quotes data placeholder' });
});

/**
 * @desc Submit labor + materials breakdown (Step 4 - Assessment)
 * @route POST /api/quotes
 */
router.post('/', async (req, res) => {
  const { bookingId, taskerId, laborCost, materialsCost } = req.body;
  try {
    const quote = await QuoteService.submitQuote(bookingId, taskerId, { laborCost, materialsCost });
    res.json({ message: 'Quote submitted successfully', quote });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @desc Approve quote (Step 5 - Assessment)
 * @route PATCH /api/quotes/:id/approve
 */
router.patch('/:id/approve', async (req, res) => {
  const { bookingId } = req.body;
  try {
    const result = await QuoteService.approveQuote(bookingId, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
