import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isMisconfigured =
    !supabaseUrl || supabaseUrl.includes("your-project-ref") || !supabaseKey;

if (isMisconfigured) {
    if (import.meta.env.DEV) {
        console.warn(
            "⚠️  Supabase is not configured. Open .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
        );
    } else {
        // In production an unconfigured Supabase client is a hard failure
        throw new Error("Application is not configured correctly. Contact the administrator.");
    }
}

// In dev without credentials, use placeholder values so createClient() doesn't throw
// (an empty string URL fails URL validation and crashes the entire module chain).
// All API calls will fail gracefully until real credentials are configured.
const effectiveUrl = supabaseUrl || "https://placeholder-not-configured.supabase.co";
const effectiveKey = supabaseKey || "placeholder-anon-key";

export const supabase = createClient(effectiveUrl, effectiveKey);
