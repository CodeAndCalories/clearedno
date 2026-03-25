-- Migration 001 — Subscription columns on profiles
-- Run this ONLY if your profiles table was created before these columns existed.
-- If you ran schema.sql from scratch, these columns are already present — skip this file.
--
-- Safe to run multiple times: all statements use IF NOT EXISTS / DO $$ guards.
-- Run in: https://supabase.com/dashboard/project/<project>/sql/new

-- 1. Add subscription_status with a default of 'trialing'
alter table profiles
  add column if not exists subscription_status text
    not null default 'trialing'
    check (subscription_status in ('trialing', 'active', 'past_due', 'canceled'));

-- 2. Add Stripe customer ID (unique — one customer per account)
alter table profiles
  add column if not exists stripe_customer_id text;

-- Add the unique constraint only if it doesn't already exist
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_stripe_customer_id_key'
  ) then
    alter table profiles add constraint profiles_stripe_customer_id_key
      unique (stripe_customer_id);
  end if;
end
$$;

-- 3. Add Stripe subscription ID (unique — one active subscription per account)
alter table profiles
  add column if not exists stripe_subscription_id text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_stripe_subscription_id_key'
  ) then
    alter table profiles add constraint profiles_stripe_subscription_id_key
      unique (stripe_subscription_id);
  end if;
end
$$;

-- 4. Add trial end timestamp (14 days from account creation)
alter table profiles
  add column if not exists trial_ends_at timestamptz
    default (now() + interval '14 days');

-- Backfill trial_ends_at for any existing rows that have null
update profiles
set trial_ends_at = created_at + interval '14 days'
where trial_ends_at is null;
