-- Migration 018 — free tier: default 'free', backfill abandoned signups
--
-- APPLIED to production 2026-08-26, via the Supabase SQL editor, after
-- migration 016 (which added 'free' to the CHECK). profiles.subscription_status
-- now defaults to 'free'. Do not re-run: this file is kept as the record of the
-- change, not as pending work.
--
-- ── Why the default changes ──────────────────────────────────────────────
-- schema.sql defaults subscription_status to 'trialing', which is a claim the
-- database is in no position to make: at INSERT time the profile trigger has
-- only just fired for a brand-new auth user, and no Stripe subscription exists
-- yet. A trial is something Stripe creates at checkout, and the webhook writes
-- 'trialing' when it does.
--
-- The consequence of defaulting to 'trialing' is that anyone who signs up and
-- never completes checkout looks like a live trialist forever — nothing ever
-- moves them off it, because no Stripe subscription means no webhook will ever
-- fire for them. They kept unlimited permit tracking indefinitely while the
-- dashboard told them (from day 15, via the orphaned trial_ends_at clock) that
-- their trial had ended.
--
-- 'free' is the honest starting state: signed up, not paying, entitled to the
-- free allowance of one permit plus any slots bought outright.
--
-- ── What this does NOT do ────────────────────────────────────────────────
-- trial_ends_at keeps its now() + 14 days default. With subscription_status
-- defaulting to 'free', that column is simply never consulted for these users:
-- app/dashboard/page.tsx gates every trial_ends_at read behind
-- `isTrialing`, which is false for 'free'. The column now only carries meaning
-- when the Stripe webhook has written a real trial_end into it. Retiring the
-- 14-day default is a separate change.

-- ── 1. New signups start free ────────────────────────────────────────────
alter table profiles
  alter column subscription_status set default 'free';

-- ── 2. Backfill abandoned signups ────────────────────────────────────────
-- Only rows that are 'trialing' with NO stripe_subscription_id: those are
-- signups that never reached Stripe, so their 'trialing' is the column default
-- rather than a fact about a subscription.
--
-- A row holding a stripe_subscription_id is a real Stripe trial and is left
-- alone — its status is maintained by the webhook, which will move it to
-- 'active' or 'canceled' on its own.
--
-- As of 2026-08-25 this affects 0 rows in production (one profile, 'active',
-- with a subscription). It is written to be correct rather than to be a no-op,
-- because it may run first against a database that has drifted.
do $$
declare
  affected int;
begin
  select count(*) into affected
    from profiles
   where subscription_status = 'trialing'
     and stripe_subscription_id is null;

  raise notice 'Backfilling % row(s): trialing with no Stripe subscription -> free', affected;

  update profiles
     set subscription_status = 'free'
   where subscription_status = 'trialing'
     and stripe_subscription_id is null;
end
$$;

-- Verify with:
--   select subscription_status,
--          count(*) filter (where stripe_subscription_id is null) as no_stripe_sub,
--          count(*) filter (where stripe_subscription_id is not null) as has_stripe_sub
--     from profiles
--    group by subscription_status
--    order by subscription_status;
-- After this runs, no row should be 'trialing' with a null stripe_subscription_id.
