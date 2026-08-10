-- Migration 011 — profiles.plan
--
-- The webhook writes plan = 'founding' for checkouts that used the FOUNDING49
-- discount, and /api/founding-spots counts those rows to show "N spots left".
-- Neither works today: the column was never created, so the read fails (caught
-- and reported as null) and the write is rejected.
--
-- Safe to run multiple times: IF NOT EXISTS / guarded constraint.
-- Run in: https://supabase.com/dashboard/project/<project>/sql/new

alter table profiles
  add column if not exists plan text not null default 'standard';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_plan_check'
  ) then
    alter table profiles add constraint profiles_plan_check
      check (plan in ('standard', 'founding'));
  end if;
end
$$;

-- Counting founding members is the only query against this column.
create index if not exists profiles_plan_idx on profiles (plan);

-- No backfill included: as of 2026-08-09 the FOUNDING49 coupon and both of its
-- promotion codes report times_redeemed = 0, so no existing row qualifies.
-- Verify with: npx ts-node scripts/audit-founding-members.ts
