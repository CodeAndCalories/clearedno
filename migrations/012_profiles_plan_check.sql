-- Migration 012 — CHECK constraint on profiles.plan
--
-- Migration 011 created the column but no CHECK, leaving `plan` the only
-- status-like column on profiles without one (subscription_status and
-- leads_subscription_status both have theirs). Nothing at the database level
-- rejected a misspelled value; a typo would silently break
-- /api/founding-spots, which counts rows matching 'founding' exactly.
--
-- Allowed values are exhaustive as of 2026-08-09, confirmed by grep:
--   'founding'  written only by app/api/stripe/webhook/route.ts (FOUNDING49
--               checkouts), read by app/api/founding-spots/route.ts
--   'standard'  the column default from migration 011; never written explicitly
-- No other value appears in any route, script, migration, or type.
--
-- Adding a plan tier later means a new migration to widen this constraint —
-- that is the intended tradeoff, matching how the sibling columns behave.
--
-- Safe to run multiple times: the ADD is guarded, and VALIDATE on an
-- already-valid constraint is a no-op.
-- Run in: https://supabase.com/dashboard/project/<project>/sql/new

-- Added NOT VALID first so the exclusive lock is only held for the catalog
-- update, not for the table scan. (With one row today this is a formality, but
-- it is the right shape if profiles grows before this runs.)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_plan_check'
  ) then
    alter table profiles
      add constraint profiles_plan_check
        check (plan in ('standard', 'founding')) not valid;
  end if;
end
$$;

-- Validate as a separate step: takes a weaker lock and scans existing rows.
-- Nothing can fail — as of 2026-08-09 profiles holds 1 row, plan = 'standard'.
alter table profiles validate constraint profiles_plan_check;
