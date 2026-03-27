// Admin Supabase client (uses service role key — bypasses RLS)
// ONLY import this in server-side code: API routes, scrapers, outreach agent.
// NEVER expose to the browser.
//
// Uses lazy initialization so the build succeeds even without env vars.
// The client is created on first property access; if the env vars are missing
// at runtime the individual Supabase call will throw a clear error.

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. " +
      "Add them to .env.local or your deployment environment."
    );
  }

  _client = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  });

  return _client;
}

// Proxy so callers can write `supabaseAdmin.from(...)` as before.
// The actual client is created on first property access (lazy).
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    return getAdminClient()[prop as keyof SupabaseClient];
  },
});
