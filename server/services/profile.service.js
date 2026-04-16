import { supabase } from '../config/supabase.js';

/**
 * ProfileService - Production Version 1.0.2
 * Refactored to ensure strict ES6 class compliance and clear method boundaries
 * to resolve Railway Node.js v18.20 parser issues.
 */
class ProfileService {
  /**
   * Updates basic profile information (Process 1 - Customer Step 4)
   */
  static async updateMyProfile(userId, { fullName, momoNumber, residentialArea }) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        momo_number: momoNumber,
        residential_area: residentialArea,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Profile update failed: ${error.message}`);
    return data;
  }

  /**
   * Updates tasker-specific details (Process 1 - Tasker Step 6)
   */
  static async updateTaskerBusiness(userId, { hourlyRate, workingHours, isAvailable }) {
    const { data, error } = await supabase
      .from('tasker_profiles')
      .update({
        hourly_rate: hourlyRate,
        working_hours: workingHours,
        is_available: isAvailable,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Tasker business update failed: ${error.message}`);
    return data;
  }

  /**
   * Links ID card URLs after Cloudinary upload (Process 1 - Tasker Step 3)
   */
  static async linkIdentityCards(userId, frontUrl, backUrl) {
    const { data, error } = await supabase
      .from('tasker_profiles')
      .update({
        ghana_card_front_url: frontUrl,
        ghana_card_back_url: backUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Identity card link failed: ${error.message}`);
    return data;
  }

  /**
   * Updates tasker skill categories.
   */
  static async updateTaskerSkills(userId, skillIds) {
    const { data, error } = await supabase
      .from('tasker_profiles')
      .update({
        skills: skillIds,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Skill update failed: ${error.message}`);
    return data;
  }

  /**
   * Finalizes onboarding and submits for admin vetting.
   */
  static async submitForVetting(userId) {
    const { data, error } = await supabase
      .from('tasker_profiles')
      .update({
        onboarding_status: 'in_review',
        agreed_to_terms_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Onboarding submission failed: ${error.message}`);
    
    // Logic to notify admin could go here
    console.log(`[Admin Notification] Tasker ${userId} is ready for vetting.`);
    return data;
  }

  /**
   * Fetches a full profile by ID.
   */
  static async getProfileById(userId) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new Error(`Fetch failed: ${error.message}`);
    return profile;
  }

  /**
   * Fetches all active, verified taskers for discovery.
   */
  static async getActiveTaskers() {
    const { data: taskers, error } = await supabase
      .from('tasker_profiles')
      .select(`
        id,
        hourly_rate,
        is_verified,
        onboarding_status,
        is_available,
        skills,
        profiles!inner (
          full_name,
          residential_area,
          phone_number
        )
      `)
      .eq('is_verified', true)
      .eq('onboarding_status', 'active')
      .eq('is_available', true);

    if (error) throw new Error(`Fetch taskers failed: ${error.message}`);
    
    return taskers.map(t => ({
      id: t.id,
      fullName: t.profiles.full_name,
      residentialArea: t.profiles.residential_area,
      hourlyRate: t.hourly_rate,
      skills: t.skills || [],
      rating: 4.9, // Mock rating until we have review logic
      totalJobs: 124 // Mock jobs until we have booking count logic
    }));
  }
}

export { ProfileService };
