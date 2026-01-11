import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nywcfhmcjgciqwfcasdr.supabase.co'; // Replace with YOUR project URL
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55d2NmaG1jamdjaXF3ZmNhc2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMDE4MTksImV4cCI6MjA4MzY3NzgxOX0.TwY7m4gK_o1Ts_FniyJZHtE7hb6S76fturORjPrgSKs'; // Replace with YOUR anon/public key

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
    global: {
        headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
        },
    },
});
