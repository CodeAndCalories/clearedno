-- City suggestions: contractors request cities they want monitored.
-- Duplicate city+state rows increment votes instead of creating new rows.

CREATE TABLE IF NOT EXISTS city_suggestions (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  city       text        NOT NULL,
  state      text        NOT NULL,
  email      text,
  votes      integer     DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,

  -- Enforce uniqueness on city+state (case-insensitive) so duplicates → vote
  CONSTRAINT city_suggestions_city_state_unique UNIQUE (
    lower(city),
    lower(state)
  )
);

-- Index for admin dashboard ordering by votes
CREATE INDEX IF NOT EXISTS city_suggestions_votes_idx ON city_suggestions (votes DESC);

-- RLS: anyone can insert, nobody can read/update/delete via client
ALTER TABLE city_suggestions ENABLE ROW LEVEL SECURITY;

-- Inserts are allowed (anonymous or authenticated — city request form is public)
CREATE POLICY "Allow public inserts" ON city_suggestions
  FOR INSERT WITH CHECK (true);

-- Only service role (server) reads — no client-side reads
-- (no SELECT policy = only service_role can read)
