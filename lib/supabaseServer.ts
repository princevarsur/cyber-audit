import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client for reads inside React Server Components.
// No auth session is needed — the demo uses public (anon) read access.
export function getServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
