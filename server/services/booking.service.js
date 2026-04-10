import { MatchingService } from './matching.service.js';
import { PayoutService } from './payout.service.js';
import { RefundService } from './refund.service.js';
import { supabase } from '../config/supabase.js';

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
        service_id: payload.service_id, // Ensure service_id is passed if available
        b_type,
        status: 'requested', 
        location_address,
        location_lat,
        location_lng,
        problem_description,
        scheduled_at,
        assessment_fee_ghs: 100.00,
        tasker_id: payload.tasker_id || null, // Direct request target
        is_manual_selection: !!payload.tasker_id
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
      'requested':    ['assessment', 'assigned', 'cancelled', 'matching_failed'],
      'assessment':   ['quoted', 'cancelled'],
      'quoted':       ['deposit_paid', 'cancelled'],
      'deposit_paid': ['assigned', 'cancelled', 'matching_failed'],
      'assigned':     ['arrived', 'cancelled', 'disputed'],
      'arrived':      ['in_progress', 'disputed'],
      'in_progress':  ['completed', 'disputed'],
      'completed':    ['confirmed', 'disputed'],
      'confirmed':    ['payout_ready', 'paid', 'disputed'], 
      'payout_ready': ['paid'],
      'disputed':     ['resolved', 'refunded'],
      'matching_failed': ['requested', 'refunded', 'cancelled'], // Can reschedule or refund
      'cancelled':    [], // Terminal state
      'refunded':     [], // Terminal state
      'paid':         [], // Final terminal state
    };

    const allowedNext = validTransitions[currentStatus] || [];
    if (!allowedNext.includes(targetStatus) && targetStatus !== currentStatus) {
        throw new Error(`Invalid state transition: Cannot move from ${currentStatus} to ${targetStatus}`);
    }

    // Enforce receipt upload gate for Assessment jobs (Process 2 Step 7)
    if (targetStatus === 'in_progress' && booking.b_type === 'assessment' && !booking.materials_receipt_url) {
        throw new Error('Materials receipt photo must be uploaded before starting work.');
    }

    // Apply state change
    const { data: updatedBooking, error: updateErr } = await supabase
      .from('bookings')
      .update({ status: targetStatus, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateErr) throw new Error(`Status update failed: ${updateErr.message}`);
    
    // Process 3 Payout Triggers (Financial Release)
    if (targetStatus === 'in_progress') {
        // Released by: Customer confirms start
        PayoutService.releaseAssessmentFee(bookingId).catch(e => console.error("Assessment Payout Error:", e));
    }
    
    if (targetStatus === 'confirmed') {
        // Released by: Customer confirms job done
        PayoutService.releaseFinalPayout(bookingId).catch(e => console.error("Final Payout Error:", e));
    }

    // Process 4 Trigger: Broadcast or Direct Offer
    if (targetStatus === 'deposit_paid' || (targetStatus === 'assessment' && currentStatus === 'requested')) {
        if (updatedBooking.is_manual_selection && updatedBooking.tasker_id) {
            // Step 1: Direct Offer (10min window)
            MatchingService.sendDirectOffer(updatedBooking.id, updatedBooking.tasker_id)
                .catch(e => console.error("Direct Offer Trigger Error:", e));
        } else {
            // Step 2: Automated Algorithm
            MatchingService.broadcastJob(
               updatedBooking.id, 
               updatedBooking.location_lat, 
               updatedBooking.location_lng, 
               updatedBooking.category_id
            ).catch(e => console.error("Matching Trigger Error:", e));
        }
    }
    
    return updatedBooking;
  }

  /**
   * Cancels a booking and initiates appropriate refunds based on timing/status.
   */
  static async cancelBooking(bookingId, reason = 'Customer Cancellation') {
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchErr || !booking) throw new Error('Booking not found');
    if (['cancelled', 'refunded', 'paid'].includes(booking.status)) {
        throw new Error('Booking is already in a terminal state.');
    }

    let refundAmount = 0;
    const now = new Date();
    const scheduledAt = new Date(booking.scheduled_at);
    const hoursUntilStart = (scheduledAt - now) / (1000 * 60 * 60);

    // 1. Calculate Refund Logic
    if (!booking.tasker_id || booking.status === 'requested') {
        // Scenario 1 & 2: Before Tasker accepts or Matching failure
        // 100% Refund (Assessment fee was held, now released back)
        refundAmount = booking.assessment_fee_ghs || 100.00;
        console.log(`[Cancel] Full refund for ${bookingId} (No Tasker assigned)`);
    } else {
        // Scenario 5: After Tasker accepts
        if (hoursUntilStart < 2) {
            // Cancel within 2hr: Assessment fee kept by platform/tasker fallback
            refundAmount = 0; 
            console.log(`[Cancel] Late cancellation (<2hr). Fee non-refundable.`);
        } else {
            // Cancel > 2hr: 100% Refund
            refundAmount = booking.assessment_fee_ghs || 100.00;
            console.log(`[Cancel] Pre-work cancellation (>2hr). Full refund.`);
        }
    }

    // 2. Initiate Refund
    if (refundAmount > 0) {
        await RefundService.processRefund(bookingId, refundAmount, reason);
    }

    // 3. Update Status
    const terminalStatus = refundAmount > 0 ? 'refunded' : 'cancelled';
    await this.transitionStatus(bookingId, terminalStatus);

    // 4. Record reason
    await supabase.from('bookings').update({ cancellation_reason: reason }).eq('id', bookingId);
    
    return { success: true, refundAmount };
  }

  /**
   * Handles quote decline (Scenario 4)
   */
  static async declineQuote(bookingId) {
      console.log(`[Quote] Customer declined quote for ${bookingId}. Assessment fee kept.`);
      return await this.cancelBooking(bookingId, 'Customer declined service quote');
  }

  /**
   * Reschedules a failed booking for a new time.
   */
  static async rescheduleBooking(bookingId, newTime) {
      console.log(`[Reschedule] Resetting Booking ${bookingId} for ${newTime}`);
      
      const { error: resetErr } = await supabase
        .from('bookings')
        .update({ 
            scheduled_at: newTime, 
            matching_rounds: 0,
            status: 'requested' 
        })
        .eq('id', bookingId);

      if (resetErr) throw new Error('Reschedule failed');

      // Re-trigger matching for the new time
      const { data: updated } = await supabase.from('bookings').select('*').eq('id', bookingId).single();
      MatchingService.broadcastJob(updated.id, updated.location_lat, updated.location_lng, updated.category_id);

      return { success: true, newTime };
  }
}
