-- Migration 016 — add 'free' to profiles.subscription_status
--
-- The three-tier model needs a status meaning "signed up, not paying, using
-- the free allowance". Today every non-paying account sits at 'trialing'
-- forever: it is the column default from schema.sql and nothing ever moves a
-- user off it. That makes a genuine free-tier user indistinguishable from
-- someone mid-trial, and both lib/entitlements.ts and the scraper's
-- entitlement filter treat 'trialing' as unlimited.
--
-- NOT YET APPLIED. Run in:
-- https://supabase.com/dashboard/project/<project>/sql/new
--
-- ── Why this widens rather than replaces ─────────────────────────────────
-- The constraint is looked up from the catalog instead of being assumed by
-- name. schema.sql and migration 001 both declare it as
--
--   check (subscription_status in ('trialing','active','past_due','canceled'))
--
-- which Postgres would auto-name profiles_subscription_status_check — but that
-- was never verified against the live database, and dropping the wrong
-- constraint by name (or silently dropping nothing) is exactly the blind
-- replacement to avoid. The DO block below finds the single-column CHECK on
-- subscription_status, RAISEs its current definition into the output so it is
-- recorded, and only then replaces it.
--
-- Matching by conkey rather than by text is deliberate: the substring
-- 'subscription_status' also appears in leads_subscription_status, whose own
-- CHECK must not be touched.
--
-- Safe to run multiple times: re-running finds the already-widened constraint,
-- prints it, and rewrites it to the same definition.

do $$
declare
  existing_name text;
  existing_def  text;
  target_attnum smallint;
begin
  select attnum into strict target_attnum
    from pg_attribute
   where attrelid = 'public.profiles'::regclass
     and attname  = 'subscription_status'
     and not attisdropped;

  select conname, pg_get_constraintdef(oid)
    into existing_name, existing_def
    from pg_constraint
   where conrelid = 'public.profiles'::regclass
     and contype  = 'c'
     and conkey   = array[target_attnum]::smallint[];

  if existing_name is null then
    raise notice 'No single-column CHECK found on profiles.subscription_status — adding one.';
  else
    raise notice 'Existing constraint % : %', existing_name, existing_def;
    execute format('alter table profiles drop constraint %I', existing_name);
  end if;
end
$$;

-- Added NOT VALID first so the exclusive lock covers only the catalog update,
-- not the table scan — matching migration 012's shape.
alter table profiles
  add constraint profiles_subscription_status_check
    check (subscription_status in ('free', 'trialing', 'active', 'past_due', 'canceled'))
    not valid;

-- Every existing row already satisfies the narrower set, so it satisfies this
-- wider one; validation cannot fail.
alter table profiles validate constraint profiles_subscription_status_check;

-- No backfill and no change to the column default.
--
-- Moving existing 'trialing' rows to 'free' is a product decision, not a
-- schema one: it would immediately revoke unlimited tracking from anyone whose
-- trial is genuinely live. The default stays 'trialing' until the signup and
-- trial-expiry paths are updated to write 'free' deliberately.
