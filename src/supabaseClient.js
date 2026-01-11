import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // or process.env.REACT_APP_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
