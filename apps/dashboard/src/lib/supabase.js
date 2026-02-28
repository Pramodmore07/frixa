import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes("your-project-ref")) {
    console.warn(
        "⚠️  Supabase is not configured. Open .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "");
