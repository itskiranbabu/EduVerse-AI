import { createClient } from '@supabase/supabase-js';

// Helper to safely get environment variables from Vite or Process
const getEnv = (key: string) => {
  // 1. Try Vite import.meta.env
  try {
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  // 2. Try process.env
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      // @ts-ignore
      return process.env[key];
    }
  } catch (e) {}

  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

// Fallback to avoid crash, DataService will handle connection errors by using Mock Data
const validUrl = supabaseUrl || 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(validUrl, validKey);