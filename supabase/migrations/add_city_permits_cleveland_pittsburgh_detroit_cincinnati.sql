-- Permit Encyclopedia: add 4 cities
-- cleveland-oh · pittsburgh-pa · detroit-mi · cincinnati-oh
-- 4 cities × 7 project types = 28 new rows

INSERT INTO city_permits
  (city_slug, city_name, state, project_type_slug, project_type_label,
   base_fee, avg_approval_days, requirements_summary, official_url)
VALUES

-- ── CLEVELAND OH ─────────────────────────────────────────────
('cleveland-oh','Cleveland','OH','deck-permit','Deck Permit',185,10,
  ARRAY[
    'Site plan drawn to scale showing deck location and dimensions',
    'Structural drawings per Ohio Building Code Chapter 36',
    'Cleveland Building & Housing permit application',
    'Licensed contractor registration with the City of Cleveland',
    'HOA approval if applicable'
  ]::text[],
  'https://etrakit.clevelandohio.gov'),

('cleveland-oh','Cleveland','OH','roof-permit','Roof Permit',115,5,
  ARRAY[
    'Licensed contractor registration with City of Cleveland',
    'Material specifications and scope of work',
    'Ohio Residential Code compliance documentation',
    'Property address and valuation verification'
  ]::text[],
  'https://etrakit.clevelandohio.gov'),

('cleveland-oh','Cleveland','OH','fence-permit','Fence Permit',70,3,
  ARRAY[
    'Site plan showing fence alignment and height',
    'Cleveland Zoning Code compliance (max 6 ft in residential zones)',
    'Property plat or survey',
    'Material type and color specification'
  ]::text[],
  'https://etrakit.clevelandohio.gov'),

('cleveland-oh','Cleveland','OH','addition-permit','Addition Permit',620,14,
  ARRAY[
    'Architectural drawings to 1/4" scale',
    'Site plan with setbacks per Cleveland zoning ordinance',
    'Ohio Energy Code compliance (IECC)',
    'Structural engineer letter if modifying load-bearing elements',
    'Licensed contractor registration with City of Cleveland',
    'Zoning clearance from Cleveland City Planning'
  ]::text[],
  'https://etrakit.clevelandohio.gov'),

('cleveland-oh','Cleveland','OH','new-construction','New Construction',1350,28,
  ARRAY[
    'Complete architectural and structural plans',
    'Civil site plan with drainage and grading',
    'Ohio Energy Code compliance documentation',
    'Cleveland Division of Water and utility approvals',
    'Contractor license and liability insurance',
    'Zoning approval from Cleveland City Planning Commission'
  ]::text[],
  'https://etrakit.clevelandohio.gov'),

('cleveland-oh','Cleveland','OH','electrical-permit','Electrical Permit',115,7,
  ARRAY[
    'Ohio licensed electrician information',
    'Scope of electrical work',
    'Panel layout (if upgrading service)',
    'NEC compliance documentation'
  ]::text[],
  'https://etrakit.clevelandohio.gov'),

('cleveland-oh','Cleveland','OH','plumbing-permit','Plumbing Permit',130,7,
  ARRAY[
    'Ohio licensed plumber information',
    'Scope of plumbing work',
    'Fixture and drain schedule',
    'Cleveland Division of Water approval (if adding new connection)'
  ]::text[],
  'https://etrakit.clevelandohio.gov'),

-- ── PITTSBURGH PA ────────────────────────────────────────────
('pittsburgh-pa','Pittsburgh','PA','deck-permit','Deck Permit',395,16,
  ARRAY[
    'Site plan showing deck dimensions and setbacks',
    'Structural drawings (engineer-stamped if over 200 sq ft)',
    'Pittsburgh DCP zoning review',
    'Pennsylvania Home Improvement Contractor (HIC) registration',
    'Proof of property ownership'
  ]::text[],
  'https://pittsburghpa.gov/dcp/permit'),

('pittsburgh-pa','Pittsburgh','PA','roof-permit','Roof Permit',195,8,
  ARRAY[
    'Pittsburgh Bureau of Building Inspection permit application',
    'Licensed contractor with PA HIC number',
    'Material specifications and scope of work',
    'Certificate of insurance'
  ]::text[],
  'https://pittsburghpa.gov/dcp/permit'),

('pittsburgh-pa','Pittsburgh','PA','fence-permit','Fence Permit',130,5,
  ARRAY[
    'Zoning permit application via Pittsburgh DCP',
    'Site plan showing fence height and location',
    'Pittsburgh Zoning Code compliance (height limits vary by zone)',
    'Property deed or survey'
  ]::text[],
  'https://pittsburghpa.gov/dcp/permit'),

('pittsburgh-pa','Pittsburgh','PA','addition-permit','Addition Permit',875,25,
  ARRAY[
    'Architectural drawings (scaled for residential, stamped for commercial)',
    'Zoning permit (separate from building permit)',
    'Site plan with setbacks and lot coverage',
    'Pennsylvania UCC compliance documentation',
    'Licensed contractor',
    'Pittsburgh DCP plan review submission'
  ]::text[],
  'https://pittsburghpa.gov/dcp/permit'),

('pittsburgh-pa','Pittsburgh','PA','new-construction','New Construction',2200,42,
  ARRAY[
    'Full architect- and engineer-stamped plans',
    'Zoning approval or variance',
    'Site plan with grading and drainage',
    'Pennsylvania UCC compliance',
    'Stormwater management plan (PWSA approval)',
    'Contractor license and insurance',
    'Pittsburgh DCP plan review'
  ]::text[],
  'https://pittsburghpa.gov/dcp/permit'),

('pittsburgh-pa','Pittsburgh','PA','electrical-permit','Electrical Permit',210,11,
  ARRAY[
    'Pennsylvania licensed master electrician',
    'Scope of electrical work',
    'One-line diagram for service upgrades',
    'NEC compliance documentation',
    'Pittsburgh Bureau of Building Inspection application'
  ]::text[],
  'https://pittsburghpa.gov/dcp/permit'),

('pittsburgh-pa','Pittsburgh','PA','plumbing-permit','Plumbing Permit',225,11,
  ARRAY[
    'Pennsylvania licensed master plumber',
    'Scope of plumbing work',
    'Fixture schedule',
    'PWSA approval for new sewer connections',
    'Pittsburgh Bureau of Building Inspection application'
  ]::text[],
  'https://pittsburghpa.gov/dcp/permit'),

-- ── DETROIT MI ───────────────────────────────────────────────
('detroit-mi','Detroit','MI','deck-permit','Deck Permit',155,9,
  ARRAY[
    'Site plan showing deck size and location',
    'Construction drawings with footing and framing details',
    'Michigan Residential Code compliance',
    'Detroit BSEED permit application',
    'Licensed contractor (or owner-builder declaration)'
  ]::text[],
  'https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department'),

('detroit-mi','Detroit','MI','roof-permit','Roof Permit',105,4,
  ARRAY[
    'Licensed contractor information (or owner-builder)',
    'Material specifications and type',
    'Michigan Residential Code compliance',
    'Detroit BSEED permit application'
  ]::text[],
  'https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department'),

('detroit-mi','Detroit','MI','fence-permit','Fence Permit',70,3,
  ARRAY[
    'Site plan showing fence location relative to property lines',
    'Fence height and material description',
    'Detroit Zoning Ordinance compliance',
    'Survey or plat map'
  ]::text[],
  'https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department'),

('detroit-mi','Detroit','MI','addition-permit','Addition Permit',545,12,
  ARRAY[
    'Architectural plans (floor plan, elevations)',
    'Site plan with setbacks',
    'Michigan Energy Code compliance',
    'Structural details',
    'Licensed contractor or owner-builder affidavit',
    'Detroit BSEED plan review'
  ]::text[],
  'https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department'),

('detroit-mi','Detroit','MI','new-construction','New Construction',1150,22,
  ARRAY[
    'Complete architectural and structural drawings',
    'Site plan with grading and drainage',
    'Michigan Energy Code compliance documentation',
    'Detroit Water & Sewerage Department (DWSD) approval',
    'Licensed contractor with MI builder license',
    'Zoning approval from Detroit Planning & Development'
  ]::text[],
  'https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department'),

('detroit-mi','Detroit','MI','electrical-permit','Electrical Permit',100,5,
  ARRAY[
    'Michigan licensed master electrician',
    'Scope of electrical work',
    'Panel diagram (for service work)',
    'Detroit BSEED electrical permit application'
  ]::text[],
  'https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department'),

('detroit-mi','Detroit','MI','plumbing-permit','Plumbing Permit',110,5,
  ARRAY[
    'Michigan licensed master plumber',
    'Scope of plumbing work',
    'Fixture count and locations',
    'DWSD approval for new sewer connections'
  ]::text[],
  'https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department'),

-- ── CINCINNATI OH ────────────────────────────────────────────
('cincinnati-oh','Cincinnati','OH','deck-permit','Deck Permit',175,9,
  ARRAY[
    'Site plan drawn to scale showing deck location',
    'Structural drawings with footing and beam details',
    'Ohio Building Code compliance',
    'Licensed contractor registration with City of Cincinnati',
    'HOA approval if applicable'
  ]::text[],
  'https://www.cincinnati-oh.gov/buildings/permits'),

('cincinnati-oh','Cincinnati','OH','roof-permit','Roof Permit',110,4,
  ARRAY[
    'Licensed contractor registration with City of Cincinnati',
    'Material specifications and product data sheet',
    'Ohio Residential Code compliance',
    'Cincinnati Buildings & Inspections permit application'
  ]::text[],
  'https://www.cincinnati-oh.gov/buildings/permits'),

('cincinnati-oh','Cincinnati','OH','fence-permit','Fence Permit',65,3,
  ARRAY[
    'Site plan showing fence alignment and height',
    'Cincinnati Zoning Code compliance',
    'Property survey or plat',
    'Material type specification'
  ]::text[],
  'https://www.cincinnati-oh.gov/buildings/permits'),

('cincinnati-oh','Cincinnati','OH','addition-permit','Addition Permit',590,13,
  ARRAY[
    'Architectural drawings to scale',
    'Site plan with setbacks',
    'Ohio Energy Code compliance (IECC)',
    'Structural details',
    'Licensed contractor registration',
    'Cincinnati Zoning clearance'
  ]::text[],
  'https://www.cincinnati-oh.gov/buildings/permits'),

('cincinnati-oh','Cincinnati','OH','new-construction','New Construction',1300,27,
  ARRAY[
    'Complete architectural and structural plans',
    'Civil site plan',
    'Ohio Energy Code compliance documentation',
    'Metropolitan Sewer District (MSD) approval',
    'Contractor license and liability insurance',
    'Zoning approval from Cincinnati Planning Commission'
  ]::text[],
  'https://www.cincinnati-oh.gov/buildings/permits'),

('cincinnati-oh','Cincinnati','OH','electrical-permit','Electrical Permit',110,6,
  ARRAY[
    'Ohio licensed electrician information',
    'Scope of electrical work',
    'Panel layout (if upgrading service)',
    'NEC compliance documentation'
  ]::text[],
  'https://www.cincinnati-oh.gov/buildings/permits'),

('cincinnati-oh','Cincinnati','OH','plumbing-permit','Plumbing Permit',125,6,
  ARRAY[
    'Ohio licensed plumber information',
    'Scope of plumbing work',
    'Fixture and drain schedule',
    'MSD (Metropolitan Sewer District) approval for new sewer connections'
  ]::text[],
  'https://www.cincinnati-oh.gov/buildings/permits')

ON CONFLICT (city_slug, project_type_slug) DO NOTHING;
