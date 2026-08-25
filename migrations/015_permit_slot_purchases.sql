-- Migration 015 — permit_slot_purchases
--
-- Ledger of one-time permit-slot purchases ($9.99 each). One row per completed
-- Stripe Checkout Session. Read by lib/entitlements.ts, written only by the
-- Stripe webhook.
--
-- NOT YET APPLIED. Run in:
-- https://supabase.com/dashboard/project/<project>/sql/new
--
-- ── Why the unique key is the Checkout Session id, not the PaymentIntent ──
-- Stripe's fulfillment guide keys idempotency on the Checkout Session ID:
-- "Correctly handle being called multiple times with the same Checkout Session
-- ID." Both checkout.session.completed and checkout.session.async_payment_
-- succeeded carry it, and it is present on every session.
--
-- checkout_session.payment_intent, by contrast, is nullable in the Stripe API
-- (`string | PaymentIntent | null`): it is null while the session is open, and
-- a 100%-off promotion code may mean no PaymentIntent is ever created. Keying
-- on it would leave a purchase either unrecordable or double-creditable.
-- It is kept here as a nullable, non-unique reference for refunds and
-- reconciliation only.
--
-- The unique constraint IS the webhook's idempotency guard: a retried or
-- duplicated event conflicts on insert rather than granting a second slot.
--
-- Safe to run multiple times: every statement is guarded.

create table if not exists permit_slot_purchases (
  id                         uuid primary key default uuid_generate_v4(),
  user_id                    uuid not null references auth.users(id) on delete cascade,
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id   text,
  quantity                   int not null default 1 check (quantity > 0),
  created_at                 timestamptz not null default now()
);

-- Entitlement sums quantity per user on every /dashboard/add render.
-- Name matches the existing idx_* convention; note that IF NOT EXISTS matches
-- on index NAME, so renaming this would create a duplicate rather than no-op.
create index if not exists idx_permit_slot_purchases_user_id
  on permit_slot_purchases (user_id);

alter table permit_slot_purchases enable row level security;

-- Users may read their own purchases (the dashboard shows the slot count).
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'permit_slot_purchases'
      and policyname = 'Users can view own slot purchases'
  ) then
    create policy "Users can view own slot purchases"
      on permit_slot_purchases for select
      using (auth.uid() = user_id);
  end if;
end
$$;

-- NO insert/update/delete policy — deliberately.
--
-- With RLS enabled and no permissive policy for a command, that command is
-- denied for `anon` and `authenticated`. service_role holds BYPASSRLS, so the
-- Stripe webhook can still write. Slots are granted by a completed payment,
-- never by the account that benefits from them.
--
-- The REVOKE below is defence in depth: it survives someone later adding a
-- permissive policy by accident. This is the mistake profiles already has —
-- its UPDATE policy carries no column restriction, so a signed-in user can
-- PATCH their own subscription_status. Do not repeat it here.
revoke insert, update, delete on permit_slot_purchases from anon, authenticated;
