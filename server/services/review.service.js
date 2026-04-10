import { supabase } from '../config/supabase.js';

export class ReviewService {
  /**
   * Submits a rating and comment for a finished booking (Process 2 - Final Step)
   */
  static async submitReview(bookingId, reviewerId, { rating, comment }) {
    // 1. Verify job is completed
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('status, customer_id, tasker_id')
      .eq('id', bookingId)
      .single();

    if (fetchErr || !booking) throw new Error('Booking not found');
    
    // Safety check: can only review if job is confirmed/completed
    if (!['completed', 'confirmed', 'payout_ready'].includes(booking.status)) {
        throw new Error('Can only review completed bookings.');
    }

    // Determine reviewee
    const revieweeId = (reviewerId === booking.customer_id) ? booking.tasker_id : booking.customer_id;

    // 2. Insert Review
    const { data: review, error: reviewErr } = await supabase
      .from('reviews')
      .insert({
        booking_id: bookingId,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating,
        comment
      })
      .select()
      .single();

    if (reviewErr) throw new Error(`Review failed: ${reviewErr.message}`);

    // 3. Update Average Rating in profiles (Stub)
    // In production, trigger a background task to recalculate avg_rating.
    
    return review;
  }
}
