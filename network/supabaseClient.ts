import { createClient } from '@supabase/supabase-js';

/**
 * Initialise the Supabase client using credentials from the environment.
 * Ensure that `.env.local` defines `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
 */
const supabaseUrl = (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL) || '';
const supabaseAnonKey = (typeof process !== 'undefined' && process.env && process.env.SUPABASE_ANON_KEY) || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
