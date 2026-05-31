import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * ADMIN CLIENT (SERVICE ROLE)
 * WARNING: NEVER use this on the client-side. Use only in secure server environments.
 * Bypasses Row Level Security (RLS) entirely. Useful for backend-only admin tasks.
 */
export const createAdminClient = () => {
  if (!supabaseServiceKey) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
  }
  
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
