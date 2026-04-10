import { supabase } from '../config/supabase.js';

export class AdminService {
  /**
   * Vets a Tasker - Approves or Rejects based on ID verification results.
   */
  static async vetTasker(taskerId, status) {
    const isVerified = status === 'approved';
    const onboardingStatus = isVerified ? 'active' : 'pending';
    
    // 1. Update verification status and onboarding lifecycle in tasker_profiles
    const { data: profile, error: profileErr } = await supabase
      .from('tasker_profiles')
      .update({ 
          is_verified: isVerified,
          onboarding_status: onboardingStatus,
          is_available: isVerified // Only make available if verified
      })
      .eq('id', taskerId)
      .select()
      .single();

    if (profileErr) throw new Error('Failed to update tasker verification status');

    // 2. Log Admin Action (Stub)
    console.log(`[Admin] Tasker ${taskerId} vetting status updated to: ${status}`);

    return profile;
  }

  /**
   * Manually triggers a payout release (Process 7).
   */
  static async triggerPayout(bookingId) {
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('*, escrow_transactions(*)')
      .eq('id', bookingId)
      .single();

    if (fetchErr || !booking) throw new Error('Booking not found');
    if (booking.status !== 'confirmed') {
        throw new Error('Payout can only be released for "confirmed" jobs.');
    }

    // 1. Update Escrow status to 'released'
    const { error: escrowErr } = await supabase
      .from('escrow_transactions')
      .update({ status: 'released' })
      .eq('booking_id', bookingId);

    if (escrowErr) throw new Error('Failed to update escrow status');

    // 2. Finalize Booking status to 'payout_ready'
    const { error: bookingErr } = await supabase
      .from('bookings')
      .update({ status: 'payout_ready' })
      .eq('id', bookingId);
      
    if (bookingErr) throw new Error('Failed to finalize booking status');

    return { message: 'Funds released to Tasker successfully' };
  }

  /**
   * Returns high-level platform analytics (Process 7).
   */
  static async getPlatformStats() {
    // 1. Total Jobs Count
    const { count: jobCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
    
    // 2. Volume in Escrow (Sum of held_in_escrow)
    const { data: escrowVolume } = await supabase
        .from('escrow_transactions')
        .select('amount')
        .eq('status', 'held_in_escrow');
    
    const totalEscrow = (escrowVolume || []).reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    return {
      totalJobs: jobCount || 0,
      volumeInEscrow: totalEscrow,
      activeDisputes: 0 // Mock for now
    };
  }
}
