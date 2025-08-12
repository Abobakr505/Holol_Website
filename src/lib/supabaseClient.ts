import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project URL and anon key
const supabaseUrl = 'https://mazjnttdnendismnxhkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hempudHRkbmVuZGlzbW54aGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzgyNDEsImV4cCI6MjA2NDA1NDI0MX0.J-thIXi3apCvtxop6Zfo8Ahf2l3Xm-6JtpEQZdeTYRo';

export const supabase = createClient(supabaseUrl, supabaseKey);