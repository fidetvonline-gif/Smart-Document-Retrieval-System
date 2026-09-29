import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('SUPABASE_URL') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('SUPABASE_ANON_KEY') : null;

  const url = envUrl || localUrl || '';
  const key = envKey || localKey || '';

  return { url, key };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

