-- Migration 003 — Referral system + push subscriptions
--
-- Adds:
--   1. referral_code column to profiles (8-char unique code per user)
--   2. referred_by_code column to profiles (code used when signing up)
--   3. referrals table (tracks who referred whom and free months awarded)
--   4. push_subscription column on profiles (web push subscription JSON)
--
-- Run in the Supabase SQL editor:
-- https://supabase.com/dashboard/project/<project>/sql/new

-- ── 1. Add referral_code to profiles ─────────────────────────────────────────
-- Each user gets a unique 8-char code they can share.
-- Generated on first request via /api/referral/generate

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by_code text;

-- Index for fast lookups by referral code (used when new user signs up)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_referral_code
  ON profiles (referral_code)
  WHERE referral_code IS NOT NULL;

-- Index for finding users who share the same referrer
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_code
  ON profiles (referred_by_code)
  WHERE referred_by_code IS NOT NULL;

-- ── 2. Referrals table ────────────────────────────────────────────────────────
-- One row per successful referral. Created when a referred user completes signup.
-- free_months_awarded tracks how many months were granted to the referrer.

CREATE TABLE IF NOT EXISTS referrals (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,

  -- The user who shared their referral link
  referrer_user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,

  -- The user who signed up via the referral link
  referred_user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,

  -- pending   = referred user signed up but hasn't started paying yet
  -- completed = referred user has paid; free month awarded to referrer
  status              text DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed')),

  -- How many free months have been awarded to the referrer for this referral
  -- Incremented from 0 → 1 when the referred user converts to paid
  free_months_awarded integer DEFAULT 0,

  created_at          timestamptz DEFAULT now()
);

-- Prevent duplicate referral rows for the same pair
CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_pair
  ON referrals (referrer_user_id, referred_user_id);

-- Fast lookup: "how many people did this user refer?"
CREATE INDEX IF NOT EXISTS idx_referrals_referrer
  ON referrals (referrer_user_id);

-- ── 3. Row level security for referrals ──────────────────────────────────────
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Users can see referrals where they are the referrer (to see their referral count)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'referrals' AND policyname = 'Users can view own referrals'
  ) THEN
    CREATE POLICY "Users can view own referrals"
      ON referrals FOR SELECT
      USING (
        referrer_user_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END
$$;

-- ── 4. Push subscription column ───────────────────────────────────────────────
-- Stores the browser's PushSubscription JSON object (endpoint + keys).
-- Null if the user has not granted push notification permission.
-- Structure: { endpoint: string, keys: { p256dh: string, auth: string } }

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS push_subscription jsonb;
