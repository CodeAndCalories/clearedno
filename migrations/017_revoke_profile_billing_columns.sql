-- Migration 017 — revoke UPDATE on billing columns of profiles
--
-- ALREADY APPLIED to production 2026-08-25, directly against the database
-- rather than through this directory. This file exists so the migration
-- history matches reality — do NOT run it as a change. It is idempotent, so
-- re-running is harmless if you need to reproduce the state elsewhere.
--
-- ── What this closes ─────────────────────────────────────────────────────
-- profiles carries a single blanket update policy from schema.sql:
--
--   create policy "Users can update own profile"
--     on profiles for update using (auth.uid() = user_id);
--
-- It restricts WHICH ROW a user may update, and says nothing about WHICH
-- COLUMNS. Under Supabase's default grants the `authenticated` role holds
-- UPDATE on every column, so a signed-in user could PATCH their own profile
-- row through PostgREST and set subscription_status = 'active' — granting
-- themselves unlimited permit tracking, and (after the scraper's entitlement
-- filter landed) unlimited scraping too, in one request with their own JWT.
--
-- RLS was never the wrong tool here; column privileges are simply a different
-- axis, and only the second one bounds what a permitted row-update may touch.
--
-- The profile columns a user legitimately edits — full_name, company_name,
-- phone, digest_opted_out, push_subscription — are deliberately NOT revoked.
-- The policy still governs which row; this bounds which columns within it.
--
-- Only `authenticated` is revoked: `anon` has no auth.uid(), so the row policy
-- already denies it every update. service_role bypasses both and continues to
-- be how the Stripe webhook writes billing state.

revoke update (
  subscription_status,
  trial_ends_at,
  stripe_customer_id,
  stripe_subscription_id,
  leads_subscription_status,
  leads_subscription_id,
  plan
) on profiles from authenticated;

-- Verify with:
--   select grantee, privilege_type, column_name
--     from information_schema.column_privileges
--    where table_name = 'profiles'
--      and privilege_type = 'UPDATE'
--      and grantee = 'authenticated'
--    order by column_name;
-- The seven columns above must be absent from that result.
