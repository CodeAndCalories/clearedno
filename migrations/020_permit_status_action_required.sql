-- Migration 020 — add 'ACTION_REQUIRED' to permits.status
--
-- NOT YET APPLIED. Run in:
-- https://supabase.com/dashboard/project/<project>/sql/new
--
-- APPLY THIS BEFORE DEPLOYING the ACTION_REQUIRED remap in lib/permit-status.
-- Until the constraint is widened, the scraper's status update for any permit
-- that resolves to ACTION_REQUIRED fails with 23514, the status is never
-- persisted, and the alert never sends — silently, for exactly the permits
-- this status exists to surface.
--
-- ── Why a new status ─────────────────────────────────────────────────────
-- Several cities publish states that mean "the APPLICANT must act" — Seattle's
-- Corrections Required / Additional Info Requested / Awaiting Information,
-- Pittsburgh's Applicant Revisions, Columbus's Corrections Required. Those
-- were flattened into UNDER_REVIEW alongside states that mean "the city is
-- working, wait" (Reviews In Process). A contractor whose permit needs
-- corrections and does not know it is the failure this product exists to
-- prevent, so the two now get different statuses, different badge colours,
-- and a different alert.
--
-- ── Live constraint, verified 2026-09-04 ─────────────────────────────────
-- An insert with status = 'ACTION_REQUIRED' against production was rejected
-- with:
--
--   23514  new row for relation "permits" violates check constraint
--          "permits_status_check"
--
-- so the constraint exists and is named as migration 002 declared it. Its
-- definition could not be read from the catalog remotely; migration 002 wrote
--
--   check (status in ('PENDING','APPROVED','CLEARED','UNDER_REVIEW',
--                     'REJECTED','EXPIRED','UNKNOWN'))
--
-- and the DO block below RAISEs the real definition into the output before
-- touching it, so the record is completed at apply time.
--
-- ── Why discover by column, not by name ──────────────────────────────────
-- Same pattern as migration 016. The constraint is found as the single-column
-- CHECK whose conkey is permits.status, not by the name we expect it to have.
-- Dropping by name would either silently drop nothing (if the name differs)
-- or, worse, could never be told apart from dropping a different constraint
-- that happened to share the name. Matching on conkey cannot hit the CHECK on
-- any other column.
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
   where attrelid = 'public.permits'::regclass
     and attname  = 'status'
     and not attisdropped;

  select conname, pg_get_constraintdef(oid)
    into existing_name, existing_def
    from pg_constraint
   where conrelid = 'public.permits'::regclass
     and contype  = 'c'
     and conkey   = array[target_attnum]::smallint[];

  if existing_name is null then
    raise notice 'No single-column CHECK found on permits.status — adding one.';
  else
    raise notice 'Existing constraint % : %', existing_name, existing_def;
    execute format('alter table permits drop constraint %I', existing_name);
  end if;
end
$$;

-- Added NOT VALID first so the exclusive lock covers only the catalog update,
-- not the table scan — matching migrations 012 and 016.
alter table permits
  add constraint permits_status_check
    check (status in (
      'PENDING',
      'APPROVED',
      'CLEARED',
      'UNDER_REVIEW',
      'ACTION_REQUIRED',
      'REJECTED',
      'EXPIRED',
      'UNKNOWN'
    ))
    not valid;

-- Every existing row already satisfies the narrower set, so it satisfies this
-- wider one; validation cannot fail.
alter table permits validate constraint permits_status_check;

-- alerts.new_status is free text with no CHECK (see migration 002), so no
-- change is needed there. No backfill: existing UNDER_REVIEW rows are
-- re-resolved on their next scheduled check, and the change is recorded in
-- status_history like any other transition.

-- Verify with:
--   select pg_get_constraintdef(oid)
--     from pg_constraint
--    where conrelid = 'public.permits'::regclass and conname = 'permits_status_check';
