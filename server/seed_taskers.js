import { supabaseAdmin } from './config/supabase.js';

const MOCK_TASKERS = [
  {
    phone: '233111222333',
    fullName: 'Kwame Mensah',
    location: 'East Legon, Accra',
    rate: 45,
    skills: ['AC Repair', 'Electrical'],
    role: 'ELITE'
  },
  {
    phone: '233222333444',
    fullName: 'Abena Osei',
    location: 'Osu, Accra',
    rate: 35,
    skills: ['Cleaning', 'Organization'],
    role: 'ELITE'
  },
  {
    phone: '233333444555',
    fullName: 'Kofi Badu',
    location: 'Cantonments, Accra',
    rate: 60,
    skills: ['Plumbing', 'Painting'],
    role: 'ELITE'
  }
];

async function seedTaskers() {
  console.log('[SEED] Starting Tasker Seeding...');

  for (const tasker of MOCK_TASKERS) {
    try {
      console.log(`\n[PROCESS] Provisioning ${tasker.fullName}...`);

      // 1. Create/Auth User
      const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
        phone: tasker.phone,
        phone_confirm: true,
        user_metadata: { full_name: tasker.fullName }
      });

      let userId;
      if (authErr) {
        if (authErr.message.includes('already exists') || authErr.message.includes('already registered')) {
          console.log(`[INFO] Auth user exists for ${tasker.phone}. Finding ID...`);
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
          const existing = listData.users.find(u => u.phone.includes(tasker.phone));
          userId = existing?.id;
        } else {
          throw authErr;
        }
      } else {
        userId = authData.user.id;
      }

      if (!userId) {
        console.error(`[ERR] Could not resolve ID for ${tasker.fullName}`);
        continue;
      }

      // 2. Base Profile
      await supabaseAdmin.from('profiles').upsert({
        id: userId,
        full_name: tasker.fullName,
        phone_number: tasker.phone,
        residential_area: tasker.location,
        is_tasker: true,
        is_admin: false
      });

      // 3. Tasker Business Profile
      await supabaseAdmin.from('tasker_profiles').upsert({
        id: userId,
        hourly_rate: tasker.rate,
        skills: tasker.skills,
        is_verified: true,
        onboarding_status: 'active',
        is_available: true,
        updated_at: new Date().toISOString()
      });

      console.log(`[OK] ${tasker.fullName} is now a live Tasker.`);
    } catch (err) {
      console.error(`[ERR] Failed to seed ${tasker.fullName}:`, err.message);
    }
  }

  console.log('\n[DONE] Tasker seeding complete.');
  process.exit(0);
}

seedTaskers();
