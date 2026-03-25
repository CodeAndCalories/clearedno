// Admin Supabase client (uses service role key — bypasses RLS)
// ONLY import this in server-side code: API routes, scrapers, outreach agent.
// NEVER expose to the browser.
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
