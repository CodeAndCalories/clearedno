-- Permit Encyclopedia: add Seattle
-- seattle-wa · 1 city × 7 project types = 7 new rows
--
-- STATUS: NOT APPLIED. Written 2026-10-04, held for review of the values below.
--
-- ── THESE ARE ESTIMATES ──────────────────────────────────────────────────
-- base_fee and avg_approval_days are estimates, like every other city's rows.
-- The pages present them that way ("Fees and timelines are estimates…"), and
-- base_fee is shown as the minimum the fee calculator builds on. They are not
-- quotes from the city.
--
-- What they are anchored to (checked 2026-10-04):
--   * SDCI 2026 fee flyer: base hourly rate $292; construction permit fees
--     +18% for 2026. Example plan review + permit fee for a 1,500 sq ft
--     single-family house valued at $308,307 is $6,853. For a 500 sq ft DADU
--     valued at $93,145 it is $3,453. Fees come from the project's valuation
--     plus plan review; STFI permits pay 40% of the plan review fee.
--   * SDCI re-roof permit: flat fee of half the base hourly rate, plus the
--     state surcharge and the technology fee. Issued the same day online.
--   * SDCI Construction Permit Performance (as of 2025-10-01), in calendar days
--     in City control, 75th percentile: SF addition/alteration 64 (goal 30),
--     middle housing including single-family 117 (goal 60). SDCI says the
--     total time an applicant experiences is about twice the City-controlled
--     time.
--   * Plumbing permits in Seattle are issued by Public Health – Seattle &
--     King County, not SDCI, so that row links to King County. The plumbing
--     and electrical fees are the least certain values in this file; neither
--     fee schedule could be read.
--
-- Seattle comes out well above the other cities. That reflects SDCI's
-- valuation-based fees, and the other cities' figures are not anchored
-- to published examples.
--
-- After applying: /permits/seattle-wa and its children revalidate within 24h
-- (revalidate = 86400). The sitemap is built at deploy time, so Seattle joins
-- it on the next deploy (app/sitemap.ts reads city_permits).

INSERT INTO city_permits
  (city_slug, city_name, state, project_type_slug, project_type_label,
   base_fee, avg_approval_days, requirements_summary, official_url)
VALUES

-- ── SEATTLE WA ───────────────────────────────────────────────
('seattle-wa','Seattle','WA','deck-permit','Deck Permit',600,21,
  ARRAY[
    'Permit required for decks more than 18 inches above grade, roof decks, or decks in an Environmentally Critical Area',
    'Most decks qualify for a Subject-to-Field-Inspection (STFI) permit with no plan review',
    'Full plan review if over 8 ft above grade, over 750 sq ft, a roof deck, beams 14 ft or longer, or solid-surface flooring',
    'Site plan showing deck location, dimensions, and setbacks',
    'Framing, footing, and ledger attachment details'
  ]::text[],
  'https://services.seattle.gov/Portal'),

('seattle-wa','Seattle','WA','roof-permit','Roof Permit',160,1,
  ARRAY[
    'SDCI Re-Roof Permit: flat fee of half the SDCI base hourly rate plus state surcharge and technology fee',
    'Issued the same day when you apply online through the Seattle Services Portal',
    'Required when replacing roofing on commercial and multifamily buildings or repairing more than 500 sq ft; confirm with SDCI for one- and two-family homes',
    'No on-site inspection: close the permit by submitting the Roof Replacement Affidavit'
  ]::text[],
  'https://services.seattle.gov/Portal'),

('seattle-wa','Seattle','WA','fence-permit','Fence Permit',300,14,
  ARRAY[
    'No permit needed for fences 8 ft or less in total height without masonry or concrete elements over 6 ft',
    'Seattle Land Use Code (SMC Title 23) height limits in required yards apply with or without a permit',
    'Site plan showing fence location, height, and property lines',
    'Environmentally Critical Area review if the fence is on a steep slope or other ECA'
  ]::text[],
  'https://services.seattle.gov/Portal'),

('seattle-wa','Seattle','WA','addition-permit','Addition Permit',2700,75,
  ARRAY[
    'Addition/Alteration construction permit with full SDCI plan review',
    'Architectural plans: floor plans, elevations, and sections',
    'Site plan with setbacks, lot coverage, and tree locations',
    'Washington State Energy Code (WSEC) compliance documentation',
    'Structural calculations if load-bearing elements are altered',
    'Drainage and side sewer review where impervious surface or sewer connections change'
  ]::text[],
  'https://services.seattle.gov/Portal'),

('seattle-wa','Seattle','WA','new-construction','New Construction',6850,120,
  ARRAY[
    'Construction permit with full SDCI plan review, including zoning review',
    'Complete architectural and structural plans',
    'Site plan with drainage, grading, and tree protection',
    'Washington State Energy Code (WSEC) compliance documentation',
    'Seattle Public Utilities water availability certificate and side sewer permit',
    'Geotechnical report if the site is in an Environmentally Critical Area'
  ]::text[],
  'https://services.seattle.gov/Portal'),

('seattle-wa','Seattle','WA','electrical-permit','Electrical Permit',200,3,
  ARRAY[
    'Issued by SDCI: Seattle runs its own electrical permit program, not WA Labor & Industries',
    'Washington-licensed electrical contractor information',
    'Scope of electrical work; most residential permits are purchased online',
    'Load calculation for service upgrades',
    'Seattle Electrical Code (NEC with local amendments) compliance'
  ]::text[],
  'https://services.seattle.gov/Portal'),

('seattle-wa','Seattle','WA','plumbing-permit','Plumbing Permit',225,3,
  ARRAY[
    'Issued by Public Health – Seattle & King County, not SDCI',
    'Apply through the Public Health Permit Center',
    'Washington-certified plumber, or a homeowner permit for work on your own home',
    'Fixture count and scope of work; plan review only for certain occupancies',
    'Side sewer permit from SDCI for new or repaired sewer connections'
  ]::text[],
  'https://kingcounty.gov/en/dept/dph/health-safety/environmental-health/plumbing-gas-piping/applications-and-permits')

ON CONFLICT (city_slug, project_type_slug) DO NOTHING;
