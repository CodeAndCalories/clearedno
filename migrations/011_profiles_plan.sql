-- Migration 011 — profiles.plan
--
-- The webhook writes plan = 'founding' for checkouts that used the FOUNDING49
-- discount, and /api/founding-spots counts those rows to show "N spots left".
-- Before this migration the column did not exist, so the read failed (caught
-- and reported as null) and the write was rejected.
--
-- Safe to run multiple times: IF NOT EXISTS.
-- Run in: https://supabase.com/dashboard/project/<project>/sql/new
--
-- APPLIED to production 2026-08-09. This file records exactly what was run.
-- Note: no CHECK constraint on `plan` was applied here, unlike its sibling
-- columns subscription_status and leads_subscription_status.
-- See migration 012, which adds it.

alter table profiles
  add column if not exists plan text not null default 'standard';

-- Counting founding members is the only query against this column.
-- Name matches the existing idx_profiles_* convention on this table; note that
-- IF NOT EXISTS matches on index NAME, so renaming this would create a
-- duplicate index rather than being a no-op.
create index if not exists idx_profiles_plan on profiles (plan);

-- No backfill included: as of 2026-08-09 the FOUNDING49 coupon and both of its
-- promotion codes report times_redeemed = 0, so no existing row qualifies.
-- Verify with: npx ts-node scripts/audit-founding-members.ts
