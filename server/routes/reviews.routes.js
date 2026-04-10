import express from 'express';
import { ReviewService } from '../services/review.service.js';

const router = express.Router();

/**
 * @desc Get reviews for a profile
 * @route GET /api/reviews/:profileId
 */
router.get('/:profileId', async (req, res) => {
    // Fetch logic placeholder
    res.json({ message: 'Reviews data placeholder' });
});

/**
 * @desc Submit rating and feedback (Final Step)
 * @route POST /api/reviews
 */
router.post('/', async (req, res) => {
  const { bookingId, reviewerId, rating, comment } = req.body;
  try {
    const review = await ReviewService.submitReview(bookingId, reviewerId, { rating, comment });
    res.json({ message: 'Review submitted successfully', review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
