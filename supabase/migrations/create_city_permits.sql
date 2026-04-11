-- Permit Encyclopedia: city_permits table
-- 7 cities × 7 project types = 49 rows

CREATE TABLE IF NOT EXISTS city_permits (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_slug            text NOT NULL,
  city_name            text NOT NULL,
  state                text NOT NULL,
  project_type_slug    text NOT NULL,
  project_type_label   text NOT NULL,
  base_fee             integer,
  avg_approval_days    integer,
  requirements_summary text[],
  official_url         text,
  created_at           timestamptz DEFAULT now(),
  CONSTRAINT city_permits_unique UNIQUE (city_slug, project_type_slug)
);

CREATE INDEX IF NOT EXISTS city_permits_city_slug_idx         ON city_permits (city_slug);
CREATE INDEX IF NOT EXISTS city_permits_project_type_slug_idx ON city_permits (project_type_slug);

-- ─────────────────────────────────────────────────────────────
-- Seed data
-- ─────────────────────────────────────────────────────────────
INSERT INTO city_permits
  (city_slug, city_name, state, project_type_slug, project_type_label,
   base_fee, avg_approval_days, requirements_summary, official_url)
VALUES

-- ── AUSTIN TX ────────────────────────────────────────────────
('austin-tx','Austin','TX','deck-permit','Deck Permit',285,14,
  ARRAY[
    'Site plan showing deck location and dimensions',
    'Structural drawings with footing specifications',
    'Property survey or certified plat',
    'Proof of licensed contractor',
    'HOA approval letter (if applicable)'
  ]::text[],
  'https://abc.austintexas.gov'),

('austin-tx','Austin','TX','roof-permit','Roof Permit',150,7,
  ARRAY[
    'Proof of contractor license (TDLR)',
    'Scope of work description and coverage area',
    'Product data sheets for roofing materials',
    'Property address verification'
  ]::text[],
  'https://abc.austintexas.gov'),

('austin-tx','Austin','TX','fence-permit','Fence Permit',120,5,
  ARRAY[
    'Site plan showing fence location and height',
    'Property survey or plat',
    'Material and height specification',
    'HOA approval if in a deed-restricted community'
  ]::text[],
  'https://abc.austintexas.gov'),

('austin-tx','Austin','TX','addition-permit','Addition Permit',850,21,
  ARRAY[
    'Architectural floor plans and elevations',
    'Site plan showing setbacks from property lines',
    'Energy code compliance documentation (Manual J or equivalent)',
    'Structural engineer letter if load-bearing walls are modified',
    'Zoning clearance confirmation',
    'Proof of licensed contractor'
  ]::text[],
  'https://abc.austintexas.gov'),

('austin-tx','Austin','TX','new-construction','New Construction',2200,45,
  ARRAY[
    'Full architectural and structural stamped plans',
    'Geotechnical or soil study report',
    'Site plan with grading and drainage plan',
    'Energy code compliance (IECC)',
    'Utility connection approvals (water, sewer, electric)',
    'Zoning approval letter',
    'Proof of contractor license'
  ]::text[],
  'https://abc.austintexas.gov'),

('austin-tx','Austin','TX','electrical-permit','Electrical Permit',175,10,
  ARRAY[
    'Scope of electrical work description',
    'Panel specifications (if upgrading service)',
    'Proof of licensed electrician (TDLR license)',
    'Load calculation sheet (if adding circuits or subpanel)'
  ]::text[],
  'https://abc.austintexas.gov'),

('austin-tx','Austin','TX','plumbing-permit','Plumbing Permit',195,10,
  ARRAY[
    'Scope of plumbing work description',
    'Plumbing diagram or isometric drawing',
    'Proof of licensed plumber',
    'Water/sewer connection details (if adding new fixtures)'
  ]::text[],
  'https://abc.austintexas.gov'),

-- ── DALLAS TX ────────────────────────────────────────────────
('dallas-tx','Dallas','TX','deck-permit','Deck Permit',310,12,
  ARRAY[
    'Site plan drawn to scale showing deck placement',
    'Structural details including beam sizes and footing depth',
    'Property survey',
    'Licensed contractor registration with City of Dallas',
    'Setback compliance with Dallas zoning code'
  ]::text[],
  'https://eservices.dallascityhall.com'),

('dallas-tx','Dallas','TX','roof-permit','Roof Permit',165,6,
  ARRAY[
    'Contractor license verification (TDLR)',
    'Scope of work and materials list',
    'Manufacturer product specifications',
    'Valuation of work (used to calculate permit fees)'
  ]::text[],
  'https://eservices.dallascityhall.com'),

('dallas-tx','Dallas','TX','fence-permit','Fence Permit',100,4,
  ARRAY[
    'Site plan showing proposed fence line',
    'Fence height and material specification',
    'Compliance with Dallas fence ordinance (max 6 ft residential)',
    'Property plat or survey'
  ]::text[],
  'https://eservices.dallascityhall.com'),

('dallas-tx','Dallas','TX','addition-permit','Addition Permit',920,18,
  ARRAY[
    'Architectural drawings (floor plan, elevations, sections)',
    'Site plan with dimensions and setbacks',
    'Energy compliance report',
    'Licensed contractor documentation',
    'Inspection fee schedule'
  ]::text[],
  'https://eservices.dallascityhall.com'),

('dallas-tx','Dallas','TX','new-construction','New Construction',1800,40,
  ARRAY[
    'Stamped architectural and structural plans',
    'Civil site plan with drainage',
    'Energy code compliance documentation',
    'Utility release letters',
    'Contractor license and liability insurance',
    'Zoning verification letter'
  ]::text[],
  'https://eservices.dallascityhall.com'),

('dallas-tx','Dallas','TX','electrical-permit','Electrical Permit',160,8,
  ARRAY[
    'Licensed master electrician information',
    'Detailed scope of electrical work',
    'One-line diagram (for service upgrades)',
    'Load calculations (if adding significant load)'
  ]::text[],
  'https://eservices.dallascityhall.com'),

('dallas-tx','Dallas','TX','plumbing-permit','Plumbing Permit',180,8,
  ARRAY[
    'Licensed master plumber information',
    'Scope of plumbing work',
    'Fixture schedule',
    'Backflow prevention documentation (if required)'
  ]::text[],
  'https://eservices.dallascityhall.com'),

-- ── HOUSTON TX ───────────────────────────────────────────────
('houston-tx','Houston','TX','deck-permit','Deck Permit',250,10,
  ARRAY[
    'Plot plan showing deck size and location',
    'Construction drawings with materials list',
    'Proof of property ownership',
    'Licensed contractor information',
    'Hurricane tie-down details per Houston wind code'
  ]::text[],
  'https://www.houstonpermittingcenter.org'),

('houston-tx','Houston','TX','roof-permit','Roof Permit',140,5,
  ARRAY[
    'Contractor license verification',
    'Description of work and roofing materials',
    'Wind resistance rating documentation (required for Houston)',
    'Completed permit application form'
  ]::text[],
  'https://www.houstonpermittingcenter.org'),

('houston-tx','Houston','TX','fence-permit','Fence Permit',95,4,
  ARRAY[
    'Site plan showing fence alignment',
    'Fence height and material description',
    'Compliance with Chapter 10 of Houston Code of Ordinances',
    'Survey or plat if near property line'
  ]::text[],
  'https://www.houstonpermittingcenter.org'),

('houston-tx','Houston','TX','addition-permit','Addition Permit',780,16,
  ARRAY[
    'Architectural plans (minimum 1/8" scale)',
    'Site plan with setbacks marked',
    'Flood zone compliance documentation (if in FEMA zone)',
    'Energy efficiency compliance',
    'Contractor license'
  ]::text[],
  'https://www.houstonpermittingcenter.org'),

('houston-tx','Houston','TX','new-construction','New Construction',1650,35,
  ARRAY[
    'Full architectural and structural drawings',
    'Civil plans with drainage and grading',
    'Elevation certificate (if in flood zone)',
    'Energy code compliance',
    'Utility approvals (MUD or City)',
    'Contractor license and insurance'
  ]::text[],
  'https://www.houstonpermittingcenter.org'),

('houston-tx','Houston','TX','electrical-permit','Electrical Permit',145,7,
  ARRAY[
    'Licensed master electrician registration',
    'Scope of electrical work',
    'Service entrance details (for panel upgrades)',
    'NEC code compliance confirmation'
  ]::text[],
  'https://www.houstonpermittingcenter.org'),

('houston-tx','Houston','TX','plumbing-permit','Plumbing Permit',165,7,
  ARRAY[
    'Licensed plumber registration',
    'Scope of plumbing work',
    'Fixture count and type list',
    'Connection to Houston public sewer details (if applicable)'
  ]::text[],
  'https://www.houstonpermittingcenter.org'),

-- ── SAN ANTONIO TX ───────────────────────────────────────────
('san-antonio-tx','San Antonio','TX','deck-permit','Deck Permit',265,13,
  ARRAY[
    'Site plan showing deck dimensions and location',
    'Structural drawings including ledger attachment detail',
    'Property survey',
    'Licensed contractor with City of San Antonio registration',
    'HOA approval if required'
  ]::text[],
  'https://saepermits.sanantonio.gov'),

('san-antonio-tx','San Antonio','TX','roof-permit','Roof Permit',145,6,
  ARRAY[
    'Licensed roofing contractor registration',
    'Material specifications and product data sheet',
    'Scope of work and square footage',
    'Completed San Antonio DSD application'
  ]::text[],
  'https://saepermits.sanantonio.gov'),

('san-antonio-tx','San Antonio','TX','fence-permit','Fence Permit',90,4,
  ARRAY[
    'Site plan showing fence location',
    'Fence height, material, and design description',
    'San Antonio zoning compliance confirmation',
    'Survey or property plat'
  ]::text[],
  'https://saepermits.sanantonio.gov'),

('san-antonio-tx','San Antonio','TX','addition-permit','Addition Permit',810,17,
  ARRAY[
    'Architectural plans with dimensions',
    'Site plan showing setbacks',
    'HVAC/energy compliance documentation',
    'Structural details (if modifying load-bearing elements)',
    'Licensed contractor registration'
  ]::text[],
  'https://saepermits.sanantonio.gov'),

('san-antonio-tx','San Antonio','TX','new-construction','New Construction',1700,38,
  ARRAY[
    'Complete stamped architectural and structural plans',
    'Site plan with drainage and utility layout',
    'Energy compliance documentation',
    'Zoning clearance',
    'Contractor license and insurance',
    'CPS Energy release (for electrical connection)'
  ]::text[],
  'https://saepermits.sanantonio.gov'),

('san-antonio-tx','San Antonio','TX','electrical-permit','Electrical Permit',155,8,
  ARRAY[
    'Licensed electrician information',
    'Scope of electrical work',
    'Panel schedule (for service work)',
    'TDLR license number'
  ]::text[],
  'https://saepermits.sanantonio.gov'),

('san-antonio-tx','San Antonio','TX','plumbing-permit','Plumbing Permit',170,8,
  ARRAY[
    'Licensed plumber information',
    'Scope of plumbing work',
    'Fixture schedule',
    'San Antonio Water System (SAWS) approval for new connections'
  ]::text[],
  'https://saepermits.sanantonio.gov'),

-- ── COLUMBUS OH ──────────────────────────────────────────────
('columbus-oh','Columbus','OH','deck-permit','Deck Permit',195,10,
  ARRAY[
    'Site plan drawn to scale',
    'Structural drawings with post, beam, and footing details',
    'Ohio Building Code compliance documentation',
    'Contractor registration with City of Columbus',
    'HOA approval if applicable'
  ]::text[],
  'https://permits.columbus.gov'),

('columbus-oh','Columbus','OH','roof-permit','Roof Permit',125,5,
  ARRAY[
    'Licensed contractor information',
    'Description of materials and scope',
    'Ohio residential building code compliance',
    'Manufacturer installation guidelines for chosen product'
  ]::text[],
  'https://permits.columbus.gov'),

('columbus-oh','Columbus','OH','fence-permit','Fence Permit',75,3,
  ARRAY[
    'Site plan showing fence alignment and height',
    'Compliance with Columbus Zoning Code Chapter 3332',
    'Plat or survey if near property line',
    'Material type specification'
  ]::text[],
  'https://permits.columbus.gov'),

('columbus-oh','Columbus','OH','addition-permit','Addition Permit',650,15,
  ARRAY[
    'Architectural drawings to 1/4" scale',
    'Site plan with setbacks',
    'Ohio Energy Code compliance (IECC)',
    'Structural details',
    'Licensed contractor registration',
    'Zoning clearance from Columbus Planning'
  ]::text[],
  'https://permits.columbus.gov'),

('columbus-oh','Columbus','OH','new-construction','New Construction',1400,30,
  ARRAY[
    'Complete architectural and structural plans',
    'Civil site plan',
    'Ohio Energy Code compliance documentation',
    'Utility service approvals',
    'Contractor license and liability insurance',
    'Zoning approval'
  ]::text[],
  'https://permits.columbus.gov'),

('columbus-oh','Columbus','OH','electrical-permit','Electrical Permit',120,7,
  ARRAY[
    'Ohio licensed electrician information',
    'Scope of electrical work',
    'Panel layout (if upgrading)',
    'NEC compliance documentation'
  ]::text[],
  'https://permits.columbus.gov'),

('columbus-oh','Columbus','OH','plumbing-permit','Plumbing Permit',135,7,
  ARRAY[
    'Ohio licensed plumber information',
    'Scope of plumbing work',
    'Fixture and drain schedule',
    'Connection to Columbus Division of Sewerage (if new tie-in)'
  ]::text[],
  'https://permits.columbus.gov'),

-- ── PHILADELPHIA PA ──────────────────────────────────────────
('philadelphia-pa','Philadelphia','PA','deck-permit','Deck Permit',425,18,
  ARRAY[
    'Site plan showing deck dimensions and setbacks',
    'Structural drawings (engineered if over 30" above grade)',
    'Philadelphia L&I zoning review',
    'Proof of ownership',
    'Home Improvement Contractor (HIC) registration'
  ]::text[],
  'https://li.phila.gov'),

('philadelphia-pa','Philadelphia','PA','roof-permit','Roof Permit',210,9,
  ARRAY[
    'Philadelphia L&I permit application (via eCLIPSE)',
    'Licensed contractor with PA Home Improvement Contractor number',
    'Scope of work and material specifications',
    'Certificate of insurance'
  ]::text[],
  'https://li.phila.gov'),

('philadelphia-pa','Philadelphia','PA','fence-permit','Fence Permit',150,6,
  ARRAY[
    'Zoning permit application (via eCLIPSE)',
    'Site plan showing fence height and location',
    'Philadelphia Zoning Code compliance (height limits vary by zone)',
    'Property deed or survey'
  ]::text[],
  'https://li.phila.gov'),

('philadelphia-pa','Philadelphia','PA','addition-permit','Addition Permit',950,28,
  ARRAY[
    'Architectural drawings (stamped for commercial, scaled for residential)',
    'Zoning permit (separate from building permit)',
    'Site plan with lot coverage calculations',
    'PA UCC compliance documentation',
    'Licensed contractor',
    'L&I plan review submission via eCLIPSE'
  ]::text[],
  'https://li.phila.gov'),

('philadelphia-pa','Philadelphia','PA','new-construction','New Construction',2500,45,
  ARRAY[
    'Full architect- and engineer-stamped plans',
    'Zoning approval or variance',
    'Site plan with impervious surface calculations',
    'Pennsylvania UCC compliance',
    'Stormwater management plan (PWD approval)',
    'Contractor license and insurance',
    'L&I plan review via eCLIPSE'
  ]::text[],
  'https://li.phila.gov'),

('philadelphia-pa','Philadelphia','PA','electrical-permit','Electrical Permit',225,12,
  ARRAY[
    'Pennsylvania licensed master electrician',
    'Scope of electrical work',
    'One-line diagram for service upgrades',
    'NEC compliance documentation',
    'L&I electrical permit application'
  ]::text[],
  'https://li.phila.gov'),

('philadelphia-pa','Philadelphia','PA','plumbing-permit','Plumbing Permit',245,12,
  ARRAY[
    'Pennsylvania licensed master plumber',
    'Scope of plumbing work',
    'Fixture schedule',
    'Philadelphia Water Department approval (for new sewer taps)',
    'L&I plumbing permit application'
  ]::text[],
  'https://li.phila.gov'),

-- ── GRAND RAPIDS MI ──────────────────────────────────────────
('grand-rapids-mi','Grand Rapids','MI','deck-permit','Deck Permit',175,8,
  ARRAY[
    'Site plan showing deck size and location',
    'Construction drawings with footing and framing details',
    'Michigan Residential Code compliance',
    'Licensed contractor (or owner-builder declaration)',
    'HOA approval if applicable'
  ]::text[],
  'https://www.grandrapidsmi.gov/Government/Departments/Community-Development/Building-Safety'),

('grand-rapids-mi','Grand Rapids','MI','roof-permit','Roof Permit',110,4,
  ARRAY[
    'Licensed contractor information (or owner-builder)',
    'Material specifications and type',
    'Michigan Residential Code compliance',
    'Permit application submitted via Grand Rapids BS&E portal'
  ]::text[],
  'https://www.grandrapidsmi.gov/Government/Departments/Community-Development/Building-Safety'),

('grand-rapids-mi','Grand Rapids','MI','fence-permit','Fence Permit',75,3,
  ARRAY[
    'Site plan showing fence location relative to property lines',
    'Fence height and material description',
    'Grand Rapids Zoning Ordinance compliance',
    'Survey or plat map'
  ]::text[],
  'https://www.grandrapidsmi.gov/Government/Departments/Community-Development/Building-Safety'),

('grand-rapids-mi','Grand Rapids','MI','addition-permit','Addition Permit',580,12,
  ARRAY[
    'Architectural plans (floor plan, elevations)',
    'Site plan with setbacks',
    'Michigan Energy Code compliance',
    'Structural details',
    'Licensed contractor or owner-builder affidavit',
    'Zoning compliance confirmation'
  ]::text[],
  'https://www.grandrapidsmi.gov/Government/Departments/Community-Development/Building-Safety'),

('grand-rapids-mi','Grand Rapids','MI','new-construction','New Construction',1200,25,
  ARRAY[
    'Complete architectural and structural drawings',
    'Site plan with grading and drainage',
    'Michigan Energy Code compliance documentation',
    'Utility service approvals',
    'Licensed contractor with MI builder license',
    'Zoning approval'
  ]::text[],
  'https://www.grandrapidsmi.gov/Government/Departments/Community-Development/Building-Safety'),

('grand-rapids-mi','Grand Rapids','MI','electrical-permit','Electrical Permit',105,5,
  ARRAY[
    'Michigan licensed master electrician',
    'Scope of electrical work',
    'Panel diagram (for service work)',
    'NEC compliance documentation'
  ]::text[],
  'https://www.grandrapidsmi.gov/Government/Departments/Community-Development/Building-Safety'),

('grand-rapids-mi','Grand Rapids','MI','plumbing-permit','Plumbing Permit',115,5,
  ARRAY[
    'Michigan licensed master plumber',
    'Scope of plumbing work',
    'Fixture count and locations',
    'Grand Rapids DPW approval (for new sewer connections)'
  ]::text[],
  'https://www.grandrapidsmi.gov/Government/Departments/Community-Development/Building-Safety')

ON CONFLICT (city_slug, project_type_slug) DO NOTHING;
