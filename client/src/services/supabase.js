import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mniuklnrgfcpusuijuyz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uaXVrbG5yZ2ZjcHVzdWlqdXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzQxMjMsImV4cCI6MjA5MDQ1MDEyM30.rWI8l9QqH4HP9QsS4qvNeXLc8yd7bQFoTrqcR1Ei7EU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
