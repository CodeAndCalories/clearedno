-- permit_alerts: email captures from /permits/[city]/[project-type] detail pages.
-- Top-of-funnel leads for the $79 permit tracker upsell.

CREATE TABLE IF NOT EXISTS permit_alerts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text        NOT NULL,
  city         text,
  project_type text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  notified     boolean     NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS permit_alerts_email_idx    ON permit_alerts (email);
CREATE INDEX IF NOT EXISTS permit_alerts_notified_idx ON permit_alerts (notified) WHERE notified = false;

-- Holds email addresses (PII). Enable RLS with no policies so anon/authenticated
-- clients cannot read it; only the service-role key (used by the API route,
-- which bypasses RLS) can read or write.
ALTER TABLE permit_alerts ENABLE ROW LEVEL SECURITY;
