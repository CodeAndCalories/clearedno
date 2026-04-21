-- Add outreach tracking columns to outreach_leads

ALTER TABLE outreach_leads
  ADD COLUMN IF NOT EXISTS outreach_sent            boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS outreach_sent_at         timestamptz          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS outreach_followup_sent   boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS outreach_followup_sent_at timestamptz         DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS unsubscribed             boolean     NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS outreach_leads_outreach_sent_idx
  ON outreach_leads (outreach_sent)
  WHERE outreach_sent = false;

CREATE INDEX IF NOT EXISTS outreach_leads_followup_idx
  ON outreach_leads (outreach_sent_at)
  WHERE outreach_sent = true AND outreach_followup_sent = false;
