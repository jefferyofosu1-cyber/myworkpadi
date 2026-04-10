import { supabase } from '../config/supabase.js';
import { NotificationService } from './notification.service.js';

export class DisputeService {
  /**
   * Raises a new dispute for a booking.
   */
  static async raiseDispute(bookingId, userId, reason, evidenceUrls = []) {
    // 1. Verify booking exists and belongs to the user (or assigned tasker)
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('id, status, customer_id, tasker_id')
      .eq('id', bookingId)
      .single();

    if (fetchErr || !booking) throw new Error('Booking not found');
    
    if (booking.customer_id !== userId && booking.tasker_id !== userId) {
        throw new Error('Unauthorized to raise dispute on this booking');
    }

    // 2. Create Dispute Record
    const { data: dispute, error: disputeErr } = await supabase
      .from('disputes')
      .insert({
        booking_id: bookingId,
        raised_by: userId,
        reason,
        evidence_urls: evidenceUrls,
        status: 'open'
      })
      .select()
      .single();

    if (disputeErr) throw new Error('Failed to create dispute record');

    // 3. Update Booking Status to 'disputed'
    const { error: updateErr } = await supabase
      .from('bookings')
      .update({ status: 'disputed' })
      .eq('id', bookingId);

    if (updateErr) throw new Error('Failed to update booking status');

    // 4. Notify Admin
    console.log(`[Dispute] New dispute raised for booking ${bookingId} by ${userId}`);
    // NotificationService.sendAdminAlert('New Dispute Raised', { bookingId, reason });

    return dispute;
  }

  /**
   * Resolves a dispute with an admin decision.
   */
  static async resolveDispute(disputeId, decision, refundAmount = 0) {
    const { data: dispute, error: fetchErr } = await supabase
      .from('disputes')
      .select('*, bookings(status, customer_id, tasker_id)')
      .eq('id', disputeId)
      .single();

    if (fetchErr || !dispute) throw new Error('Dispute not found');

    // Apply Decision logic
    const { error: updateErr } = await supabase
      .from('disputes')
      .update({
        status: 'resolved',
        admin_decision: decision,
        resolved_at: new Date().toISOString()
      })
      .eq('id', disputeId);

    if (updateErr) throw new Error('Failed to update dispute status');

    // If decision is a refund, trigger refund logic
    if (decision === 'refund_customer' && refundAmount > 0) {
        // PaymentService.triggerRefund(dispute.booking_id, refundAmount);
        await supabase.from('bookings').update({ status: 'refunded' }).eq('id', dispute.booking_id);
    } else {
        await supabase.from('bookings').update({ status: 'completed' }).eq('id', dispute.booking_id);
    }

    return { message: 'Dispute resolved successfully', decision };
  }
}
