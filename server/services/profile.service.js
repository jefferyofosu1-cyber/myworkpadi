import { supabase } from '../config/supabase.js';

export class ProfileService {
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
}
