
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use the Supabase project URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://srpxfzpxiqcewtjdpdyx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycHhmenB4aXFjZXd0amRwZHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTg1NzIsImV4cCI6MjA1ODU5NDU3Mn0.m-DinVAmHyzfgoX7d_kTx8NBdjeEjNxuujmiU-axLIo';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
