"use client";

import { createClient } from "@supabase/supabase-js";

// Browser Supabase client used by client components for CRUD mutations.
// Uses the public (publishable) key — safe to ship to the browser.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
