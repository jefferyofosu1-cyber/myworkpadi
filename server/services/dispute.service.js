import { supabase } from '../config/supabase.js';
import { NotificationService } from './notification.service.js';
import { RefundService } from './refund.service.js';

export class DisputeService {
  /**
   * Raises a new dispute for a booking.
   * Enforces 24-hour window from job completion/confirmation.
   */
  static async raiseDispute(bookingId, userId, category, reason, evidenceUrls = []) {
    // 1. Fetch Booking and verify 24h window
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('*, profiles!bookings_customer_id_fkey(full_name)')
      .eq('id', bookingId)
      .single();

    if (bErr || !booking) throw new Error('Booking not found');

    const confirmedAt = new Date(booking.updated_at);
    const now = new Date();
    const hoursSinceCompletion = (now - confirmedAt) / (1000 * 60 * 60);

    if (booking.status !== 'confirmed' && booking.status !== 'completed') {
        throw new Error('Disputes can only be raised for completed or confirmed jobs.');
    }

    if (hoursSinceCompletion > 24) {
        throw new Error('Dispute window expired. Disputes must be raised within 24 hours of job completion.');
    }

    // 2. Create Dispute Record
    const slaExpiresAt = new Date(now.getTime() + 4 * 60 * 60 * 1000); // +4 Hours

    const { data: dispute, error: dErr } = await supabase
      .from('disputes')
      .insert({
        booking_id: bookingId,
        raised_by: userId,
        category,
        reason,
        evidence_urls: evidenceUrls,
        status: 'open',
        sla_expires_at: slaExpiresAt.toISOString()
      })
      .select()
      .single();

    if (dErr) throw new Error(`Dispute creation failed: ${dErr.message}`);

    // High Priority Safety Escalation
    if (category === 'SAFETY') {
        console.error(`[CRITICAL] Safety Incident reported by ${booking.profiles?.full_name} for Booking ${bookingId}`);
        await NotificationService.sendSMS('SUPPORT_LEAD_PHONE', `CRITICAL SAFETY INCIDENT: Booking ${bookingId}. Investigate immediately.`);
    }

    // 3. Transition Booking status
    const { BookingService } = await import('./booking.service.js');
    await BookingService.transitionStatus(bookingId, 'disputed');

    // 4. Freeze Escrow (Process 5 - Audit Trail)
    // Insert a record into escrow_ledger to mark the funds as "frozen" or "held" in dispute
    await supabase.from('escrow_ledger').insert({
        booking_id: bookingId,
        amount_ghs: booking.quoted_price || 0,
        e_type: 'held', // Implicitly frozen by being in 'disputed' state
        note: `Escrow Frozen: Dispute ${dispute.id} raised by ${userId}`
    });

    // 5. Notify Admin Queue
    const adminMsg = `🚨 NEW DISPUTE: Booking ${bookingId}\nCategory: ${category}\nReason: ${reason}\nSLA: 4 hours`;
    await NotificationService.sendWhatsApp('ADMIN_LEAD_PHONE', adminMsg);
    
    await NotificationService.sendPush(booking.customer_id, 'Dispute Raised', 'Our team will review your dispute within 4 hours.');

    return dispute;
  }

  /**
   * Moves a dispute to 'investigating' state.
   */
  static async investigateDispute(disputeId, adminId, notes) {
    const { data: dispute, error } = await supabase
      .from('disputes')
      .update({ 
          status: 'investigating', 
          admin_notes: notes,
          updated_at: new Date().toISOString()
      })
      .eq('id', disputeId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update dispute: ${error.message}`);
    
    return dispute;
  }

  /**
   * Resolves a dispute with an admin decision.
   * Leverages 5-branch resolution engine.
   */
  static async resolveDispute(disputeId, outcome, adminNotes, partialRefundAmount = 0) {
    const { data: dispute, error: fetchErr } = await supabase
      .from('disputes')
      .select('*, bookings(*)')
      .eq('id', disputeId)
      .single();

    if (fetchErr || !dispute) throw new Error('Dispute not found');

    const bookingId = dispute.booking_id;
    const taskerId = dispute.bookings.tasker_id;
    let strikeApplied = false;

    console.log(`[Dispute] Resolving ${disputeId} with outcome: ${outcome}`);

    // 1. Process Financial & Status Logic
    const { PayoutService } = await import('./payout.service.js');
    const { BookingService } = await import('./booking.service.js');

    switch (outcome) {
        case 'FULL_REFUND':
            // 100% Refund to customer
            const totalToRefund = dispute.bookings.quoted_price || 0;
            await RefundService.processRefund(bookingId, totalToRefund, `Dispute Resolved: FULL_REFUND`);
            await BookingService.transitionStatus(bookingId, 'refunded');
            strikeApplied = true;
            break;

        case 'PARTIAL_REFUND':
            // Split based on admin input
            if (partialRefundAmount > 0) {
                await RefundService.processRefund(bookingId, partialRefundAmount, `Dispute Resolved: PARTIAL_REFUND`);
            }
            // Release remaining to Tasker
            const remaining = (dispute.bookings.quoted_price || 0) - partialRefundAmount;
            if (remaining > 0) {
                await PayoutService.initiatePayout(bookingId, remaining, 'labor', 'Partial Dispute Settlement');
            }
            await BookingService.transitionStatus(bookingId, 'resolved');
            break;

        case 'FULL_RELEASE':
            // Admin favors Tasker - release everything
            await PayoutService.releaseFinalPayout(bookingId);
            await BookingService.transitionStatus(bookingId, 'paid');
            break;

        case 'RELEASE_WITH_STRIKE':
            // Tasker gets paid but also warned
            await PayoutService.releaseFinalPayout(bookingId);
            await BookingService.transitionStatus(bookingId, 'paid');
            strikeApplied = true;
            break;

        case 'REWORK_ASSIGNED':
            // Send back to Tasker to fix
            await BookingService.transitionStatus(bookingId, 'assigned');
            break;

        case 'REASSIGN_FREE':
            // Happiness Guarantee: Platform pays for a second Tasker
            await BookingService.transitionStatus(bookingId, 'refunded'); // Refund original (internal accounting)
            
            // Create Clone Booking with is_rework = true
            const { data: reworkBk, error: reworkErr } = await supabase
                .from('bookings')
                .insert({
                    customer_id: dispute.bookings.customer_id,
                    category_id: dispute.bookings.category_id,
                    type: dispute.bookings.type,
                    status: 'requested',
                    description: `[REWORK] ${dispute.bookings.description}`,
                    location_address: dispute.bookings.location_address,
                    location_coords: dispute.bookings.location_coords,
                    scheduled_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                    assessment_fee_ghs: 0, // Free for customer
                    is_rework: true
                })
                .select()
                .single();

            if (!reworkErr) {
                console.log(`[Guarantee] Rework booking created: ${reworkBk.id}`);
            }
            break;

        default:
            throw new Error(`Invalid resolution outcome: ${outcome}`);
    }

    // 2. Handle Tasker Strike System
    if (strikeApplied && taskerId) {
        // Increment strikes
        const { data: profile } = await supabase
            .from('tasker_profiles')
            .select('strikes')
            .eq('id', taskerId)
            .single();
        
        const newStrikes = (profile?.strikes || 0) + 1;
        
        const updateData = { strikes: newStrikes };
        
        // Automated deactivation threshold (3 strikes)
        if (newStrikes >= 3) {
            updateData.is_verified = false;
            updateData.is_available = false;
            console.warn(`[Dispute] Tasker ${taskerId} DEACTIVATED due to 3 strikes.`);
        }

        await supabase.from('tasker_profiles').update(updateData).eq('id', taskerId);
    }

    // 3. Update Dispute Record
    await supabase
      .from('disputes')
      .update({
        status: 'resolved',
        outcome,
        admin_notes: adminNotes,
        strike_applied: strikeApplied,
        resolved_at: new Date().toISOString()
      })
      .eq('id', disputeId);

    // 4. Notify Parties
    await NotificationService.sendPush(dispute.bookings.customer_id, 'Dispute Resolved', `Action taken: ${outcome.replace('_', ' ')}`);
    if (taskerId) {
        await NotificationService.sendPush(taskerId, 'Dispute Resolved', strikeApplied ? 'Warning: You have received a strike.' : 'The dispute has been settled.');
    }

    return { message: 'Dispute closed successfully', outcome, strikeApplied };
  }

  /**
   * Fast-track for Tasker No-Show.
   * 100% Refund + Tasker Strike + Status Update.
   */
  static async reportNoShow(bookingId, userId) {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) throw new Error('Booking not found');
    if (booking.customer_id !== userId) throw new Error('Unauthorized');

    console.log(`[Guarantee] No-Show reported for Booking ${bookingId}`);

    // auto-resolve as NO_SHOW dispute
    const { data: dispute } = await supabase.from('disputes').insert({
        booking_id: bookingId,
        raised_by: userId,
        category: 'NO_SHOW',
        reason: 'Tasker did not show up for the scheduled time.',
        status: 'resolved',
        outcome: 'FULL_REFUND',
        admin_notes: 'System Auto-Resolved: Customer reported No-Show',
        resolved_at: new Date().toISOString()
    }).select().single();

    // Trigger Resolution Logic (Full Refund + Strike)
    return await this.resolveDispute(dispute.id, 'FULL_REFUND', 'System Auto-Resolved: No-Show');
  }
}
