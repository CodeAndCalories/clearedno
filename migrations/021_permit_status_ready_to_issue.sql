-- Migration 021 — add 'READY_TO_ISSUE' to permits.status
--
-- NOT YET APPLIED. Run in:
-- https://supabase.com/dashboard/project/<project>/sql/new
--
-- APPLY THIS BEFORE THE NEXT SCRAPER RUN after the READY_TO_ISSUE remap in
-- lib/permit-status deploys. Until the constraint is widened, the scraper's
-- status update for any permit that resolves to READY_TO_ISSUE fails with
-- 23514, the status is not persisted and the alert does not send. Nothing is
-- lost: the update is retried on every run and succeeds once this is applied.
-- Two tracked permits resolve to READY_TO_ISSUE today (checked 2026-10-04):
-- Detroit BLD2026-01450 ("Plans Approved") and Seattle 7083427-CN ("Ready for
-- Issuance").
--
-- ── Why a new status ─────────────────────────────────────────────────────
-- "Plans approved, permit not yet issued" used to map to PENDING, the same
-- status as a fresh application in the intake queue. So when review finished,
-- a permit went UNDER_REVIEW → PENDING and the alert said "PERMIT PENDING".
-- That happened to Detroit BLD2026-01450 on 2026-10-03: the best news before
-- issuance read like a step backwards. APPROVED is not an option either,
-- because APPROVED means issued and work may legally start. READY_TO_ISSUE
-- sits between them: review is done, and issuance is the next step.
--
-- Mapped to it (live vocabularies re-enumerated 2026-10-04):
--   Detroit       Plans Approved              23,810
--   Seattle       Ready for Issuance             665
--   Philadelphia  Amendment Ready For Issue       92
--   Philadelphia  Ready For Issue                  1
--   Pittsburgh    Ready For Issue                  0  (10 on 2026-09-04; kept)
--
-- ── Live constraint, verified 2026-10-04 ─────────────────────────────────
-- Inserts against production, each with a nonexistent user_id so that nothing
-- could persist (CHECK is evaluated before the FK):
--
--   status = 'ACTION_REQUIRED'  →  23503 permits_user_id_fkey   (CHECK passed)
--   status = 'READY_TO_ISSUE'   →  23514 permits_status_check   (CHECK failed)
--
-- So migration 020 is applied, and the constraint is still named as 002/020
-- declared it. The DO block below RAISEs the real definition into the output
-- before touching it, as 020 did, so the record is completed at apply time.
--
-- ── Why discover by column, not by name ──────────────────────────────────
-- Same pattern as migrations 016 and 020. The constraint is found as the
-- single-column CHECK whose conkey is permits.status, not by the name we
-- expect it to have. Dropping by name would either silently drop nothing (if
-- the name differs) or, worse, could never be told apart from dropping a
-- different constraint that happened to share the name. Matching on conkey
-- cannot hit the CHECK on any other column.
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
-- not the table scan — matching migrations 012, 016 and 020.
alter table permits
  add constraint permits_status_check
    check (status in (
      'PENDING',
      'APPROVED',
      'CLEARED',
      'UNDER_REVIEW',
      'ACTION_REQUIRED',
      'READY_TO_ISSUE',
      'REJECTED',
      'EXPIRED',
      'UNKNOWN'
    ))
    not valid;

-- Every existing row already satisfies the narrower set, so it satisfies this
-- wider one; validation cannot fail.
alter table permits validate constraint permits_status_check;

-- alerts.new_status is free text with no CHECK (see migration 002), so no
-- change is needed there. No backfill: existing PENDING rows are re-resolved
-- on their next scheduled check, and the change is recorded in status_history
-- like any other transition. That check also sends the alert.

-- Verify with:
--   select pg_get_constraintdef(oid)
--     from pg_constraint
--    where conrelid = 'public.permits'::regclass and conname = 'permits_status_check';
