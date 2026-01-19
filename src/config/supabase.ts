import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const SUPABASE_URL = 'https://ypzbnmeeaonswhkyiwhv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwemJubWVlYW9uc3doa3lpd2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTE1MzcsImV4cCI6MjA4NDM2NzUzN30.brFKq9898NqPHbRLo76IGHqPdUX-RS0SdMPg5WR3s4Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return (
    SUPABASE_ANON_KEY !== 'PASTE_YOUR_ANON_KEY_HERE' &&
    SUPABASE_URL.includes('supabase.co')
  );
};
