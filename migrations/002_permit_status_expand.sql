-- Migration 002 — Expand permit status check constraint
-- Adds UNDER_REVIEW and EXPIRED to the allowed values in permits.status.
--
-- Run in: https://supabase.com/dashboard/project/<project>/sql/new
--
-- Safe to re-run: the drop is IF EXISTS and the add checks current state.

-- Step 1: Drop the existing status check constraint.
-- The auto-generated name from schema.sql is permits_status_check.
-- If yours differs, run this first to find it:
--   SELECT conname FROM pg_constraint WHERE conrelid = 'permits'::regclass;
alter table permits
  drop constraint if exists permits_status_check;

-- Step 2: Re-add the constraint with the two new values included.
alter table permits
  add constraint permits_status_check
    check (status in (
      'PENDING',
      'APPROVED',
      'CLEARED',
      'UNDER_REVIEW',
      'REJECTED',
      'EXPIRED',
      'UNKNOWN'
    ));

-- Step 3: Same expansion for the alerts.new_status column (nullable FK-ish field).
-- No check constraint existed there originally, so nothing to drop.
-- This is informational — no SQL needed for alerts since new_status is free text.
