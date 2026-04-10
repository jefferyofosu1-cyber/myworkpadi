import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'mock-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key';

if (!supabaseUrl) {
  console.warn('⚠️ SUPABASE_URL is missing from environment variables.');
}

// Client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for administrative backend operations (bypassing RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
