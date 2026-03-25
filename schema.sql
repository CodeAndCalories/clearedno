-- ClearedNo Database Schema
-- Run this in the Supabase SQL editor at:
-- https://supabase.com/dashboard/project/<project>/sql/new

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- Extended user data beyond Supabase auth.users
-- ============================================================
create table profiles (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  full_name    text,
  company_name text,
  phone        text,
  -- Subscription state (managed by Stripe webhook)
  subscription_status text not null default 'trialing'
    check (subscription_status in ('trialing', 'active', 'past_due', 'canceled')),
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  trial_ends_at           timestamptz default (now() + interval '14 days'),
  created_at   timestamptz not null default now(),
  unique (user_id)
);

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- PERMITS
-- Each permit a user wants to track
-- ============================================================
create table permits (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  permit_number  text not null,
  address        text not null,
  city           text not null,
  state          text not null,
  -- Current status (updated by scrapers)
  status         text not null default 'PENDING'
    check (status in ('PENDING', 'APPROVED', 'CLEARED', 'REJECTED', 'UNKNOWN')),
  last_checked   timestamptz,
  -- Full audit trail of every status change as JSONB array:
  -- [{ "status": "PENDING", "timestamp": "2024-01-01T00:00:00Z", "raw": "..." }]
  status_history jsonb not null default '[]'::jsonb,
  -- URL used to scrape this permit (cached per city)
  scrape_url     text,
  -- Soft delete: stop monitoring without deleting record
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- Index for fast per-user permit lookups
create index idx_permits_user_id on permits(user_id);
-- Index for the scraper: only active permits need checking
create index idx_permits_active on permits(is_active) where is_active = true;

-- ============================================================
-- ALERTS
-- Record of every notification sent (dedup + audit)
-- ============================================================
create table alerts (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  permit_id  uuid not null references permits(id) on delete cascade,
  -- Alert type: status_change | weekly_summary | trial_expiring
  type       text not null,
  -- The new status that triggered this alert (nullable for non-status alerts)
  new_status text,
  sent_at    timestamptz not null default now()
);

create index idx_alerts_permit_id on alerts(permit_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- Users can only see their own data
-- ============================================================
alter table profiles enable row level security;
alter table permits  enable row level security;
alter table alerts   enable row level security;

-- Profiles: own row only
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = user_id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = user_id);

-- Permits: own rows only
create policy "Users can view own permits"
  on permits for select using (auth.uid() = user_id);
create policy "Users can insert own permits"
  on permits for insert with check (auth.uid() = user_id);
create policy "Users can update own permits"
  on permits for update using (auth.uid() = user_id);
create policy "Users can delete own permits"
  on permits for delete using (auth.uid() = user_id);

-- Alerts: own rows only
create policy "Users can view own alerts"
  on alerts for select using (auth.uid() = user_id);
