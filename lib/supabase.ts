import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Environment variables for Supabase connection
// These should be set in Netlify dashboard or .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Running in offline mode with local data.'
  );
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

export default supabase;
