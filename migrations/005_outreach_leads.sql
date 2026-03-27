-- Migration 005 — Outreach leads table
--
-- Tracks contractor leads discovered via Google Maps.
-- Statuses: new → contacted → replied → converted (or do_not_contact)

CREATE TABLE IF NOT EXISTS outreach_leads (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name     text        NOT NULL,
  email             text,
  phone             text,
  city              text,
  state             text,
  contractor_type   text,
  website           text,
  source            text        DEFAULT 'google_maps',
  status            text        DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'replied', 'converted', 'do_not_contact')),
  last_contacted_at timestamptz,
  reply_received    boolean     DEFAULT false,
  converted         boolean     DEFAULT false,
  created_at        timestamptz DEFAULT now() NOT NULL,

  -- Prevent duplicate emails in the table
  CONSTRAINT outreach_leads_email_unique UNIQUE (email)
);

-- Index for daily send quota queries
CREATE INDEX IF NOT EXISTS outreach_leads_last_contacted_idx
  ON outreach_leads (last_contacted_at);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS outreach_leads_status_idx
  ON outreach_leads (status);

-- RLS: service role only (outreach never touches the client)
ALTER TABLE outreach_leads ENABLE ROW LEVEL SECURITY;
-- No client policies — only service_role key (used by outreach scripts) can access
