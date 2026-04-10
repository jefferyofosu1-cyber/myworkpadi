import { supabase } from './config/supabase.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env explicitly for the script
dotenv.config();

async function verify() {
  console.log('🔍 Starting TaskGH Verification...\n');

  // 1. Check for .env file
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file found');
  } else {
    console.error('❌ ERROR: .env file not found');
  }

  // 2. Check Environment Variables
  const required = [
    'SUPABASE_URL', 
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY', 
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];
  
  console.log('\n--- Environment Check ---');
  let missing = 0;
  required.forEach(key => {
    const val = process.env[key];
    if (val && !val.includes('your_')) {
      const display = val.length > 8 ? val.substring(0, 4) + '...' + val.substring(val.length - 4) : '****';
      console.log(`✅ ${key} is loaded: ${display}`);
    } else {
      console.error(`❌ ${key} is missing or placeholder`);
      missing++;
    }
  });

  if (missing > 0) {
    console.log('\n⚠️  Please fix the missing environment variables before continuing.');
  }

  console.log('\n--- Connectivity Tests ---');

  // 3. Test Supabase
  try {
    console.log('⏳ Testing Supabase connection...');
    // Try to select from a common table
    const { data, error } = await supabase.from('bookings').select('id', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        console.warn('⚠️  Supabase connected! But "bookings" table not found. (Check your schema)');
      } else {
        console.error('❌ Supabase Error:', error.message);
      }
    } else {
      console.log('✅ Supabase connection successful.');
    }
  } catch (err) {
    console.error('❌ Supabase Connection Failed:', err.message);
  }

  setTimeout(() => {
    console.log('\n🏁 Verification Complete.');
    process.exit(0);
  }, 1000);
}

verify();
