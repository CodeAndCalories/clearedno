-- Migration 019 — permit_slot_purchases: record refunds instead of deleting
--
-- NOT YET APPLIED. Run in:
-- https://supabase.com/dashboard/project/<project>/sql/new
--
-- APPLY THIS BEFORE DEPLOYING the charge.refunded handler. Without these
-- columns the webhook's revoke path fails and returns 500, so Stripe retries
-- the refund event for three days and the slot is never revoked.
--
-- ── Why a column and not a DELETE ────────────────────────────────────────
-- The obvious way to revoke a slot is to delete its ledger row. That is wrong
-- here, and the reason is the idempotency design in migration 015: the UNIQUE
-- constraint on stripe_checkout_session_id is the only thing stopping a
-- replayed checkout.session.completed from granting a second slot. Stripe
-- retries that event for up to three days, and lib/slot-fulfillment is
-- deliberately called from two places (the webhook and the buyer's return from
-- Checkout).
--
-- Delete the row and that guard disappears with it: the next replay — or the
-- buyer reloading /dashboard/add?session_id=... after being refunded — inserts
-- cleanly and silently re-grants the slot they were just refunded for. A
-- refund that undoes itself is worse than no refund handling at all.
--
-- Marking the row keeps the constraint intact, keeps the audit trail a 14-day
-- refund promise needs in a chargeback, and keeps the ledger reconcilable
-- against Stripe. Nothing about a refund is a reason to forget the purchase
-- happened.
--
-- Safe to run multiple times: every statement is guarded.

alter table permit_slot_purchases
  add column if not exists refunded_at      timestamptz,
  add column if not exists stripe_refund_id text;

comment on column permit_slot_purchases.refunded_at is
  'Set when the purchase was fully refunded. A non-null value means the slot no
   longer counts toward the entitlement. Never delete the row — see migration
   019 for why.';

-- lib/entitlements.ts sums only unrefunded rows, on every /dashboard/add
-- render and every lapsed-user dashboard load. The partial index keeps that
-- the cheap path; the full index from migration 015 stays for reconciliation
-- queries that do want refunded rows.
create index if not exists idx_permit_slot_purchases_unrefunded
  on permit_slot_purchases (user_id)
  where refunded_at is null;

-- Verify with:
--   select count(*) filter (where refunded_at is null)     as active_slots,
--          count(*) filter (where refunded_at is not null) as refunded_slots
--     from permit_slot_purchases;
