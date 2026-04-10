import { supabase } from '../config/supabase.js';
import { MatchingService } from './matching.service.js';

export class BookingService {
  /**
   * Creates a new booking in the 'pending' state.
   */
  static async createBooking(customer_id, payload) {
    const { category_id, b_type, location_address, location_lat, location_lng, problem_description, scheduled_at } = payload;
    
    // Validate Category exists and grab its base pricing
    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('assessment_fee_ghs, booking_type')
      .eq('id', category_id)
      .single();

    if (catError || !category) throw new Error('Invalid specialized category');

    // Insert Booking
    const { data: newBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id,
        category_id,
        b_type,
        status: 'pending',
        location_address,
        location_lat,
        location_lng,
        problem_description,
        scheduled_at,
        assessment_fee_ghs: category.assessment_fee_ghs,
      })
      .select()
      .single();

    if (bookingError) throw new Error(`Booking creation failed: ${bookingError.message}`);
    return newBooking;
  }

  /**
   * Centralized State Machine for TaskGH
   * Enforces logic across all 12 job statuses.
   */
  static async transitionStatus(bookingId, targetStatus) {
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('status, b_type, assessment_fee_ghs, customer_id')
      .eq('id', bookingId)
      .single();

    if (fetchErr || !booking) throw new Error('Booking not found');

    const currentStatus = booking.status;

    // Define the valid transitions for the 12-state flow
    const validTransitions = {
      'requested':    ['assessment', 'assigned', 'cancelled'],
      'assessment':   ['quoted', 'cancelled'],
      'quoted':       ['deposit_paid', 'cancelled'],
      'deposit_paid': ['assigned', 'cancelled'],
      'assigned':     ['arrived', 'cancelled', 'disputed'],
      'arrived':      ['in_progress', 'disputed'],
      'in_progress':  ['completed', 'disputed'],
      'completed':    ['confirmed', 'disputed'],
      'confirmed':    ['payout_ready'], 
      'disputed':     ['resolved', 'refunded'],
      'cancelled':    [], // Terminal state
      'refunded':     [], // Terminal state
    };

    const allowedNext = validTransitions[currentStatus] || [];
    if (!allowedNext.includes(targetStatus) && targetStatus !== currentStatus) {
        throw new Error(`Invalid state transition: Cannot move from ${currentStatus} to ${targetStatus}`);
    }

    // Apply state change
    const { data: updatedBooking, error: updateErr } = await supabase
      .from('bookings')
      .update({ status: targetStatus, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateErr) throw new Error(`Status update failed: ${updateErr.message}`);
    
    // Process 4 Trigger: Broadcast if job is ready for matching
    // Logic: If it's a fixed job (b_type='fixed') and moved to 'deposit_paid', OR
    // If it's an assessment job and moved from 'requested' to 'assessment'
    if (targetStatus === 'deposit_paid' || (targetStatus === 'assessment' && currentStatus === 'requested')) {
        MatchingService.broadcastJob(
           updatedBooking.id, 
           updatedBooking.location_lat, 
           updatedBooking.location_lng, 
           updatedBooking.category_id
        ).catch(e => console.error("Matching Trigger Error:", e));
    }
    
    return updatedBooking;
  }
}
