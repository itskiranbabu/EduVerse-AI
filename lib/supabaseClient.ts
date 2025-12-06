
import { createClient } from '@supabase/supabase-js';

// Helper to safely get environment variables from Vite or Process
const getEnv = (key: string) => {
  let val = '';
  
  // 1. Try Vite import.meta.env
  try {
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      val = import.meta.env[key];
    }
  } catch (e) {}

  if (val) return val;

  // 2. Try process.env
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      // @ts-ignore
      val = process.env[key];
    }
  } catch (e) {}

  return val;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Fallback to avoid crash on load. DataService will handle connection errors.
const validUrl = supabaseUrl || 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(validUrl, validKey);
