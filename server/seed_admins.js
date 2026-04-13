import { supabaseAdmin } from './config/supabase.js';
import { AdminService } from './services/admin.service.js';
import dotenv from 'dotenv';

dotenv.config();

const INITIAL_ADMINS = [
  { name: 'Kwame A.', phone: '+233000000001', role: 'SUPER_ADMIN' },
  { name: 'Adwoa M.', phone: '+233000000002', role: 'OPERATIONS_ADMIN' },
  { name: 'Kofi B.',  phone: '+233000000003', role: 'SUPPORT_ADMIN' },
];

async function seed() {
  console.log('[SEED] Starting Admin Provisioning...\n');

  for (const admin of INITIAL_ADMINS) {
    try {
      console.log(`[PROCESS] Provisioning ${admin.name} (${admin.role})...`);

      // 1. Create Auth User
      const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
        phone: admin.phone,
        phone_confirm: true,
      });

      if (authErr) {
        if (authErr.message.includes('already exists') || authErr.message.includes('already registered')) {
          console.log(`[INFO] Auth user already exists for ${admin.phone}. Proceeding to profile promotion.`);
        } else {
          throw authErr;
        }
      }

      // 2. Resolve User ID
      let userId = authData?.user?.id;
      
      const cleanPhone = admin.phone.replace(/\D/g, ''); // Remove '+' and anything else
      
      if (!userId) {
        // Fetch from Auth by phone if createUser didn't return it
        const { data: listData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
        if (listErr) throw listErr;
        
        // Match both with and without leading '+'
        const existingAuthUser = listData.users.find(u => 
          u.phone === cleanPhone || u.phone === `+${cleanPhone}`
        );
        userId = existingAuthUser?.id;
      }

      if (!userId) {
        // Fallback: Check profiles table
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .filter('phone_number', 'ilike', `%${cleanPhone}%`)
          .limit(1)
          .maybeSingle();
        userId = existingProfile?.id;
      }

      if (!userId) {
        throw new Error(`Could not resolve ID for ${admin.name}`);
      }

      // 3. Create/Update Profile with Name
      const { error: profileErr } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          phone_number: admin.phone,
          full_name: admin.name,
          is_admin: true,
          updated_at: new Date().toISOString()
        });

      if (profileErr) throw profileErr;

      // 4. Create Admin Profile entry
      await AdminService.createAdminProfile(userId, admin.role);

      console.log(`[OK] ${admin.name} is now a live Admin.\n`);
    } catch (err) {
      console.error(`[ERR] Failed to seed ${admin.name}:`, err.message);
    }
  }

  console.log('[DONE] Admin seeding complete.');
  process.exit(0);
}

seed();
