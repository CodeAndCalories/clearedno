-- 003_referrals.sql
-- Adds referral tracking: referral_code on profiles, referrals table.

-- Add referral_code (unique 8-char code) and referred_by_code to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS referral_code VARCHAR(8) UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by_code VARCHAR(8);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status           VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(referred_user_id)  -- each user can only be referred once
);

-- Index so we can quickly count how many people a referrer has brought in
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_user_id);

-- RLS: users can read their own referrals (as referrer)
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can read own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_user_id);
