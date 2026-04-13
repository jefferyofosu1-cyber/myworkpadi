import { supabase, supabaseAdmin } from '../config/supabase.js';

export class AdminService {
  /**
   * Vets a Tasker - Approves or Rejects based on ID verification results.
   */
  static async vetTasker(taskerId, status) {
    const isVerified = status === 'approved';
    const onboardingStatus = isVerified ? 'active' : 'pending';
    
    // 1. Update verification status and onboarding lifecycle in tasker_profiles
    const { data: profile, error: profileErr } = await supabaseAdmin
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
    const { data: booking, error: fetchErr } = await supabaseAdmin
      .from('bookings')
      .select('*, escrow_transactions(*)')
      .eq('id', bookingId)
      .single();

    if (fetchErr || !booking) throw new Error('Booking not found');
    if (booking.status !== 'confirmed') {
        throw new Error('Payout can only be released for "confirmed" jobs.');
    }

    // 1. Update Escrow status to 'released'
    const { error: escrowErr } = await supabaseAdmin
      .from('escrow_transactions')
      .update({ status: 'released' })
      .eq('booking_id', bookingId);

    if (escrowErr) throw new Error('Failed to update escrow status');

    // 2. Finalize Booking status to 'payout_ready'
    const { error: bookingErr } = await supabaseAdmin
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
    const { count: jobCount } = await supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true });
    
    // 2. Volume in Escrow (Sum of held_in_escrow)
    const { data: escrowVolume } = await supabaseAdmin
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

  /**
   * Fetches all admin staff profiles for the dashboard management view.
   */
  static async getAdminProfiles() {
    const { data, error } = await supabaseAdmin
      .from('admin_profiles')
      .select(`
        id,
        role,
        is_active,
        created_at,
        profiles!inner (
          full_name,
          phone_number
        )
      `);
    
    if (error) throw new Error('Failed to fetch admin profiles');
    return data.map(admin => ({
      id: admin.id,
      role: admin.role,
      isActive: admin.is_active,
      fullName: admin.profiles.full_name,
      phoneNumber: admin.profiles.phone_number,
      createdAt: admin.created_at
    }));
  }

  /**
   * Promotes a user to admin and initializes their role.
   */
  static async createAdminProfile(userId, role) {
    // 1. Mark as admin in profiles
    const { error: profileErr } = await supabaseAdmin
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId);
    
    if (profileErr) throw new Error('Failed to update profile to admin');

    // 2. Insert into admin_profiles
    const { data, error: adminErr } = await supabaseAdmin
      .from('admin_profiles')
      .upsert({
        id: userId,
        role: role,
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (adminErr) throw new Error('Failed to create admin profile record');
    return data;
  }

  /**
   * Deactivates or Reactivates an admin account.
   */
  static async updateAdminStatus(userId, isActive) {
    const { data, error } = await supabaseAdmin
      .from('admin_profiles')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error('Failed to update admin status');
    return data;
  }
}
