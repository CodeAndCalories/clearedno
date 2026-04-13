# Roofing Leads Scraper — NOAA Hail Data

Pulls hail storm events for **Ohio** from the NOAA Climate Data Online (CDO)
API and upserts them into the `roofing_leads` Supabase table.  
Runs independently — it does not touch any existing scrapers.

---

## Files

| File | Purpose |
|---|---|
| `noaa-hail.ts` | Fetches hail events from NOAA CDO for the last 90 days (Ohio, FIPS:39). Returns `HailEvent[]` with county, date, magnitude (inches), and lat/lng. |
| `save-leads.ts` | Upserts `HailEvent[]` into the Supabase `roofing_leads` table. Scores each lead as `"hot"` (≥ 1.0 inch) or `"warm"` (< 1.0 inch). |
| `index.ts` | Entry point. Chains the two steps above and logs how many leads were saved. |

---

## Setup

### 1. Get a free NOAA CDO API token

Visit https://www.ncdc.noaa.gov/cdo-web/token and enter your email.
The token arrives within minutes.

### 2. Add environment variables to `.env`

```env
# NOAA Climate Data Online token
NOAA_CDO_TOKEN=your_token_here

# Supabase — already set if the app is running
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # preferred
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...               # fallback
```

### 3. Create the `roofing_leads` table in Supabase

Run the SQL below in the Supabase SQL Editor (**do not run automatically**):

```sql
CREATE TABLE IF NOT EXISTS public.roofing_leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address     text,
  county      text        NOT NULL,
  event_type  text        NOT NULL,          -- e.g. 'hail'
  event_date  date        NOT NULL,
  source      text        NOT NULL,          -- e.g. 'noaa-cdo'
  lead_score  text        NOT NULL           -- 'hot' | 'warm'
    CHECK (lead_score IN ('hot', 'warm')),
  created_at  timestamptz NOT NULL DEFAULT now(),

  -- Prevent duplicate rows from repeated scraper runs
  CONSTRAINT roofing_leads_county_date_source_key
    UNIQUE (county, event_date, source)
);

-- Optional: index for common query patterns
CREATE INDEX IF NOT EXISTS roofing_leads_event_date_idx
  ON public.roofing_leads (event_date DESC);

CREATE INDEX IF NOT EXISTS roofing_leads_lead_score_idx
  ON public.roofing_leads (lead_score);
```

---

## Running manually

```bash
# From the project root
ts-node --project tsconfig.scripts.json scrapers/roofing-leads/index.ts
```

Expected output:

```
[roofing-leads] Starting roofing leads scraper...
[noaa-hail] Fetching Ohio hail events from 2024-01-10 to 2024-04-10
[noaa-hail] Raw records returned: 42
[noaa-hail] Mapped 42 hail events
[roofing-leads] Events fetched: 42 total (12 hot >= 1", 30 warm < 1")
[save-leads] ...
[roofing-leads] Done. 42 lead(s) saved/updated in 3.2s.
```

---

## Lead scoring

| Score | Condition | Interpretation |
|---|---|---|
| `hot` | Hail diameter ≥ 1.0 inch | High probability of roof damage — call immediately |
| `warm` | Hail diameter < 1.0 inch | Minor damage possible — worth canvassing |

---

## Data source notes

- **Dataset**: GHCND (Global Historical Climatology Network Daily)
- **Datatype**: `HAIL` — hail size observation in tenths of millimetres, converted to inches
- **Location filter**: `FIPS:39` (Ohio state FIPS code)
- **Window**: last 90 days, re-fetched on every run
- **Rate limit**: NOAA CDO allows 1,000 requests/day on the free tier; the scraper paginates with a 250 ms pause between pages
- NOAA CDO API reference: https://www.ncdc.noaa.gov/cdo-web/webservices/v2
