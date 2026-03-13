import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Supabase credentials missing in Admin Panel.");
}

// Use placeholder values when unconfigured so createClient() doesn't throw a
// "TypeError: Invalid URL" that crashes the entire module chain before React mounts.
// All API calls will fail gracefully until real credentials are configured.
const effectiveUrl = supabaseUrl || "https://placeholder-not-configured.supabase.co";
const effectiveKey = supabaseKey || "placeholder-anon-key";

export const supabase = createClient(effectiveUrl, effectiveKey);
