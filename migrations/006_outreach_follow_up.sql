-- Migration 006: add follow_up_after column to outreach_leads
-- Populated by reply-handler when an out-of-office reply is received.
-- The outreach agent can use this to re-queue the lead after the date passes.

ALTER TABLE outreach_leads
  ADD COLUMN IF NOT EXISTS follow_up_after timestamptz;
