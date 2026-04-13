import { supabaseAdmin } from './config/supabase.js';

async function seedNotifications() {
  console.log('Seeding notifications...');
  
  // 1. Get a test user (Sandra A. or anyone)
  const { data: user } = await supabaseAdmin.from('profiles').select('id').limit(1).single();
  
  if (!user) {
    console.error('No users found to seed notifications for.');
    return;
  }

  const notifications = [
    {
      user_id: user.id,
      type: 'payment',
      title: 'Payment released to Emmanuel',
      body: 'GHS 312.40 has been sent to Emmanuel K.\'s MTN MoMo for AC Repair job BK-7841.',
      is_read: false
    },
    {
      user_id: user.id,
      type: 'job',
      title: 'Job confirmed complete',
      body: 'You confirmed Emmanuel\'s AC Repair job is done. Would you like to leave a review?',
      is_read: false
    },
    {
      user_id: user.id,
      type: 'alert',
      title: 'Emmanuel arrived at your location',
      body: 'Your Tasker has arrived at 42 Okponglo Close, East Legon. Tap to confirm work start.',
      is_read: true
    }
  ];

  const { error } = await supabaseAdmin.from('notifications').insert(notifications);

  if (error) {
    console.error('Error seeding notifications:', error.message);
  } else {
    console.log('Successfully seeded 3 notifications.');
  }
}

seedNotifications();
