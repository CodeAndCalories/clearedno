-- Migration 007: add auto_replied flag to outreach_leads
-- Set to true after the first auto-reply is sent.
-- Prevents repeat auto-replies to the same lead — any further
-- messages are forwarded to the admin for manual handling.

ALTER TABLE outreach_leads
  ADD COLUMN IF NOT EXISTS auto_replied boolean DEFAULT false;
