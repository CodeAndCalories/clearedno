export type CityData = {
  name: string;
  state: string;
  stateAbbr: string;
  stateSlug: string; // e.g. "tx", "oh"
  slug: string;      // e.g. "austin", "grand-rapids"
  buildingDeptName: string;
  buildingDeptPhone: string;
  buildingDeptAddress: string;
  buildingDeptUrl: string;
  /** One-line description used on the /locations hub cards. */
  summary: string;
  timelines: { type: string; time: string }[];
  neighbors: string[]; // "/locations/state/city" paths for internal linking
};

export const cities: CityData[] = [
  // ── Texas ────────────────────────────────────────────────────────────────
  {
    name: "Austin",
    state: "Texas",
    stateAbbr: "TX",
    stateSlug: "tx",
    slug: "austin",
    buildingDeptName: "Austin Development Services Department",
    buildingDeptPhone: "(512) 974-2800",
    buildingDeptAddress: "6310 Wilhelmina Delco Dr, Austin, TX 78752",
    buildingDeptUrl: "https://abc.austintexas.gov",
    summary:
      "Austin runs permits through the AB+C portal. Residential remodels clear fastest; new builds and commercial work carry the longest review queues in Central Texas.",
    timelines: [
      { type: "Simple remodel / repair", time: "1–3 weeks" },
      { type: "New residential build", time: "6–12 weeks" },
      { type: "Commercial tenant improvement", time: "4–8 weeks" },
      { type: "New commercial construction", time: "8–16 weeks" },
    ],
    neighbors: [
      "/locations/tx/dallas",
      "/locations/tx/houston",
      "/locations/tx/san-antonio",
    ],
  },
  {
    name: "Dallas",
    state: "Texas",
    stateAbbr: "TX",
    stateSlug: "tx",
    slug: "dallas",
    buildingDeptName: "Dallas Planning and Development Department",
    buildingDeptPhone: "(214) 948-4480",
    buildingDeptAddress: "Permit Service Center, Oak Cliff Municipal Center, 320 E. Jefferson Blvd., Room 118, Dallas, TX 75203",
    buildingDeptUrl: "https://dallascityhall.com/departments/planning-and-development",
    summary:
      "Dallas Planning and Development handles permits for the city proper. New commercial construction carries the longest review window of any Texas metro we track.",
    timelines: [
      { type: "Residential addition / remodel", time: "2–4 weeks" },
      { type: "New single-family build", time: "4–8 weeks" },
      { type: "Commercial build-out", time: "6–10 weeks" },
      { type: "New commercial construction", time: "10–20 weeks" },
    ],
    neighbors: [
      "/locations/tx/austin",
      "/locations/tx/houston",
      "/locations/tx/san-antonio",
    ],
  },
  {
    name: "Houston",
    state: "Texas",
    stateAbbr: "TX",
    stateSlug: "tx",
    slug: "houston",
    buildingDeptName: "Houston Permitting Center",
    buildingDeptPhone: "(832) 394-9000",
    buildingDeptAddress: "1002 Washington Avenue, Houston, TX 77002",
    buildingDeptUrl: "https://www.houstonpermittingcenter.org",
    summary:
      "Houston has no citywide zoning, but permits are still required for structural work. Verify whether your address falls under the city or unincorporated Harris County before applying.",
    timelines: [
      { type: "Residential repair / addition", time: "1–3 weeks" },
      { type: "New residential build", time: "4–8 weeks" },
      { type: "Commercial tenant improvement", time: "4–10 weeks" },
      { type: "New commercial construction", time: "8–18 weeks" },
    ],
    neighbors: [
      "/locations/tx/austin",
      "/locations/tx/dallas",
      "/locations/tx/san-antonio",
    ],
  },
  {
    name: "San Antonio",
    state: "Texas",
    stateAbbr: "TX",
    stateSlug: "tx",
    slug: "san-antonio",
    buildingDeptName: "San Antonio Development Services Department",
    buildingDeptPhone: "(210) 207-1111",
    buildingDeptAddress: "1901 S Alamo St, San Antonio, TX 78204",
    buildingDeptUrl: "https://www.sanantonio.gov/DSD",
    summary:
      "San Antonio Development Services turns around residential repairs faster than most large Texas cities. Historic district projects add a design review step.",
    timelines: [
      { type: "Residential repair / addition", time: "1–2 weeks" },
      { type: "New residential build", time: "4–8 weeks" },
      { type: "Commercial build-out", time: "4–8 weeks" },
      { type: "New commercial construction", time: "8–14 weeks" },
    ],
    neighbors: [
      "/locations/tx/austin",
      "/locations/tx/dallas",
      "/locations/tx/houston",
    ],
  },

  // ── Ohio ─────────────────────────────────────────────────────────────────
  {
    name: "Columbus",
    state: "Ohio",
    stateAbbr: "OH",
    stateSlug: "oh",
    slug: "columbus",
    buildingDeptName: "Columbus Department of Building and Zoning Services (BZS)",
    // UNVERIFIED: neither (614) 645-7433 nor the inspection line (614) 645-5731
    // used in the blog posts could be confirmed against an official columbus.gov
    // source. Address, department name, and columbus.gov/bzs are verified.
    buildingDeptPhone: "(614) 645-7433",
    buildingDeptAddress: "111 N Front Street, Columbus, OH 43215",
    buildingDeptUrl: "https://www.columbus.gov/bzs",
    summary:
      "Columbus Building and Zoning Services (BZS) covers Ohio's largest permit market. Residential additions typically clear in a few weeks; commercial work runs considerably longer.",
    timelines: [
      { type: "Residential repair / addition", time: "2–4 weeks" },
      { type: "New residential build", time: "6–10 weeks" },
      { type: "Commercial tenant improvement", time: "4–8 weeks" },
      { type: "New commercial construction", time: "8–16 weeks" },
    ],
    neighbors: [
      "/locations/oh/cleveland",
      "/locations/oh/cincinnati",
      "/locations/pa/pittsburgh",
      "/locations/pa/philadelphia",
    ],
  },
  {
    name: "Cleveland",
    state: "Ohio",
    stateAbbr: "OH",
    stateSlug: "oh",
    slug: "cleveland",
    buildingDeptName: "Cleveland Department of Building & Housing",
    buildingDeptPhone: "(216) 664-2282",
    buildingDeptAddress: "601 Lakeside Ave E, Cleveland, OH 44114",
    buildingDeptUrl: "https://www.clevelandohio.gov/CityofCleveland/Home/Government/CityAgencies/BuildingAndHousing",
    summary:
      "Cleveland's Department of Building & Housing reviews everything from storm-driven roof replacements to full commercial builds, with some of Ohio's longest new-construction timelines.",
    timelines: [
      { type: "Residential repair / addition", time: "2–5 weeks" },
      { type: "New residential build", time: "6–12 weeks" },
      { type: "Commercial build-out", time: "4–10 weeks" },
      { type: "New commercial construction", time: "10–18 weeks" },
    ],
    neighbors: [
      "/locations/oh/columbus",
      "/locations/oh/cincinnati",
      "/locations/mi/detroit",
      "/locations/pa/pittsburgh",
    ],
  },
  {
    name: "Cincinnati",
    state: "Ohio",
    stateAbbr: "OH",
    stateSlug: "oh",
    slug: "cincinnati",
    buildingDeptName: "Cincinnati Department of Buildings & Inspections (B&I)",
    buildingDeptPhone: "(513) 352-3271",
    buildingDeptAddress: "Permit Center, 805 Central Avenue, Suite 500, II Centennial Plaza, Cincinnati, OH 45202",
    buildingDeptUrl: "https://www.cincinnati-oh.gov/buildings/",
    summary:
      "Cincinnati's Department of Buildings & Inspections posts the quickest residential turnaround of the three Ohio metros we track, with tenant improvements moving faster than regional averages.",
    timelines: [
      { type: "Residential repair / addition", time: "1–3 weeks" },
      { type: "New residential build", time: "5–10 weeks" },
      { type: "Commercial tenant improvement", time: "3–8 weeks" },
      { type: "New commercial construction", time: "8–16 weeks" },
    ],
    neighbors: [
      "/locations/oh/columbus",
      "/locations/oh/cleveland",
      "/locations/pa/pittsburgh",
    ],
  },

  // ── Michigan ─────────────────────────────────────────────────────────────
  {
    name: "Grand Rapids",
    state: "Michigan",
    stateAbbr: "MI",
    stateSlug: "mi",
    slug: "grand-rapids",
    buildingDeptName: "Grand Rapids Building Safety and Services",
    buildingDeptPhone: "(616) 456-3000",
    buildingDeptAddress: "1120 Monroe Ave NW, Grand Rapids, MI 49503",
    buildingDeptUrl: "https://www.grandrapidsmi.gov/Government/Departments/Planning-and-Development/Building-Safety-and-Services",
    summary:
      "Grand Rapids Building Safety and Services moves faster than Detroit across every project category, making it the quicker of Michigan's two major permit markets.",
    timelines: [
      { type: "Residential repair / addition", time: "1–3 weeks" },
      { type: "New residential build", time: "4–8 weeks" },
      { type: "Commercial tenant improvement", time: "3–7 weeks" },
      { type: "New commercial construction", time: "8–14 weeks" },
    ],
    neighbors: [
      "/locations/mi/detroit",
      "/locations/oh/columbus",
      "/locations/oh/cleveland",
    ],
  },
  {
    name: "Detroit",
    state: "Michigan",
    stateAbbr: "MI",
    stateSlug: "mi",
    slug: "detroit",
    buildingDeptName: "Detroit Buildings, Safety Engineering and Environmental Department (BSEED)",
    buildingDeptPhone: "(313) 224-2372",
    buildingDeptAddress: "Coleman A Young Municipal Center, 2 Woodward Avenue, 4th Floor, Suite 434, Detroit, MI 48226",
    buildingDeptUrl: "https://detroitmi.gov/bseed",
    summary:
      "Detroit's BSEED handles a heavy mix of rehab and new construction. New commercial projects carry the longest review window of any city we monitor.",
    timelines: [
      { type: "Residential repair / addition", time: "2–5 weeks" },
      { type: "New residential build", time: "6–12 weeks" },
      { type: "Commercial build-out", time: "4–10 weeks" },
      { type: "New commercial construction", time: "10–20 weeks" },
    ],
    neighbors: [
      "/locations/mi/grand-rapids",
      "/locations/oh/cleveland",
      "/locations/oh/columbus",
    ],
  },

  // ── Pennsylvania ─────────────────────────────────────────────────────────
  {
    name: "Philadelphia",
    state: "Pennsylvania",
    stateAbbr: "PA",
    stateSlug: "pa",
    slug: "philadelphia",
    buildingDeptName: "Philadelphia Department of Licenses and Inspections (L&I)",
    buildingDeptPhone: "(215) 686-8686",
    buildingDeptAddress: "Municipal Services Building, 1401 John F. Kennedy Blvd, 11th Floor, Philadelphia, PA 19102",
    buildingDeptUrl: "https://www.phila.gov/li",
    summary:
      "Philadelphia's Department of Licenses and Inspections is the busiest permit office in Pennsylvania, with new residential and commercial builds both running long.",
    timelines: [
      { type: "Residential repair / addition", time: "2–4 weeks" },
      { type: "New residential build", time: "6–12 weeks" },
      { type: "Commercial build-out", time: "5–10 weeks" },
      { type: "New commercial construction", time: "10–20 weeks" },
    ],
    neighbors: [
      "/locations/pa/pittsburgh",
      "/locations/oh/columbus",
      "/locations/oh/cleveland",
    ],
  },
  {
    name: "Pittsburgh",
    state: "Pennsylvania",
    stateAbbr: "PA",
    stateSlug: "pa",
    slug: "pittsburgh",
    buildingDeptName: "Pittsburgh Bureau of Building Inspection",
    buildingDeptPhone: "(412) 255-2175",
    buildingDeptAddress: "200 Ross St, Pittsburgh, PA 15219",
    buildingDeptUrl: "https://pittsburghpa.gov/bbi",
    summary:
      "Pittsburgh's Bureau of Building Inspection clears commercial build-outs faster than Philadelphia, with residential timelines broadly similar across the state.",
    timelines: [
      { type: "Residential repair / addition", time: "2–4 weeks" },
      { type: "New residential build", time: "5–10 weeks" },
      { type: "Commercial build-out", time: "4–8 weeks" },
      { type: "New commercial construction", time: "8–16 weeks" },
    ],
    neighbors: [
      "/locations/pa/philadelphia",
      "/locations/oh/columbus",
      "/locations/oh/cleveland",
      "/locations/oh/cincinnati",
    ],
  },

  // ── Washington ───────────────────────────────────────────────────────────
  {
    name: "Seattle",
    state: "Washington",
    stateAbbr: "WA",
    stateSlug: "wa",
    slug: "seattle",
    buildingDeptName: "Seattle Department of Construction and Inspections (SDCI)",
    buildingDeptPhone: "(206) 684-8600",
    buildingDeptAddress: "Seattle Municipal Tower, 700 5th Ave, Suite 2000, Seattle, WA 98104",
    buildingDeptUrl: "https://www.seattle.gov/sdci",
    summary:
      "Seattle's SDCI publishes the most detailed permit workflow of any city we track — intake, review, corrections and issuance are all visible. Reviews run long, and correction cycles are where most projects stall.",
    timelines: [
      { type: "Simple remodel / repair", time: "2–6 weeks" },
      { type: "New residential build", time: "8–16 weeks" },
      { type: "Commercial tenant improvement", time: "6–12 weeks" },
      { type: "New commercial construction", time: "12–24 weeks" },
    ],
    // Seattle is our only West Coast city, so its "nearby" links point at the
    // other live-tracking markets rather than at geography.
    neighbors: [
      "/locations/tx/austin",
      "/locations/oh/columbus",
      "/locations/pa/philadelphia",
    ],
  },
];

/**
 * Cities with a live permit-lookup integration behind /api/check-permit.
 * Everything else renders the checker's honest "coming soon" state, so any
 * copy wrapped around the tool must not promise an instant status result.
 *
 * Membership here means ONE thing: the city resolves a permit number to a
 * status through a public, unauthenticated API — no browser automation. Every
 * entry below is verified end-to-end against the live endpoint:
 *
 *   austin        Socrata      data.austintexas.gov/resource/3syk-w9eu
 *   columbus      ArcGIS FS    services1.arcgis.com/9yy6msODkIBzkUXU/…/Building_Permits/0
 *   cleveland     ArcGIS FS    services3.arcgis.com/dty2kHktVXHrqO8i/…/Building_Permits/0
 *   cincinnati    Socrata      data.cincinnati-oh.gov/resource/uhjb-xac9
 *   philadelphia  Carto SQL    phl.carto.com/api/v2/sql (table `permits`)
 *   pittsburgh    CKAN         data.wprdc.org datastore, resource f4d1177a…
 *   seattle       Socrata      data.seattle.gov/resource/76t5-zqzr
 *   detroit       ArcGIS FS    services2.arcgis.com/qvkbeam7Wirps6zC/…/bseed_building_permit_plan_reviews/0
 *                              + …/bseed_building_permits/0 (two layers, see scraper)
 *
 * Adding a city here requires BOTH a scraper in scrapers/cities/ (registered in
 * scrapers/index.ts) AND an entry in CITY_CHECKERS in app/api/check-permit.
 * Without the latter the route rejects the city rather than falling through to
 * another city's dataset.
 *
 * Do NOT add a city whose scraper depends on Playwright. Browser scrapers here
 * were reporting UNKNOWN on every run while the UI advertised them as live —
 * users waited for alerts that could never fire. If a city can't be served by
 * an API, it belongs on the waitlist, not in this set. Houston and Grand Rapids
 * publish no per-permit API at all; Dallas and San Antonio publish permits but
 * no status field. Detroit was in that last group until 2026-09-04: its
 * building-permits layer really has no status, but a second plan-reviews layer
 * carries the pre-issuance workflow, so it is now tracked.
 */
export const LIVE_CHECKER_CITIES = new Set<string>([
  "austin",
  "columbus",
  "cleveland",
  "cincinnati",
  "philadelphia",
  "pittsburgh",
  "seattle",
  "detroit",
]);

/**
 * The CityData records for every live-checker city, in declaration order.
 * Marketing copy must derive its city list from here (or one of the helpers
 * below) rather than hardcoding names — hardcoded lists are what let the site
 * advertise Houston, Dallas and San Antonio long after we knew we couldn't
 * track them.
 */
export const liveCheckerCities: CityData[] = cities.filter((c) =>
  LIVE_CHECKER_CITIES.has(c.slug)
);

/** True when the city slug has a working permit-status checker. */
export function isLiveCheckerCity(slug: string): boolean {
  return LIVE_CHECKER_CITIES.has(slug);
}

/**
 * Human-readable list of the cities we actually monitor.
 *
 * @param separator  joined between entries — " · " for footers, ", " for prose
 * @param format     "abbr" → "Austin TX", "comma" → "Austin, TX", "city" → "Austin"
 * @param conjunction  when set (e.g. "and"), the last entry is joined with it
 *                     instead of the separator, for sentence-shaped copy
 */
export function liveCityList(
  {
    separator = " · ",
    format = "comma",
    conjunction,
  }: {
    separator?: string;
    format?: "abbr" | "comma" | "city";
    conjunction?: string;
  } = {}
): string {
  const names = liveCheckerCities.map((c) =>
    format === "city"
      ? c.name
      : format === "abbr"
        ? `${c.name} ${c.stateAbbr}`
        : `${c.name}, ${c.stateAbbr}`
  );

  if (conjunction && names.length > 1) {
    const last = names[names.length - 1];
    return `${names.slice(0, -1).join(separator)}${separator}${conjunction} ${last}`;
  }

  return names.join(separator);
}

/**
 * Cities keyed by the "<city>-<state>" slug the /contractors and /permits
 * routes use in their URLs (e.g. "san-antonio-tx"). Those routes used to keep
 * their own copies of this table, which is how they kept advertising tracking
 * in cities the checker never supported.
 */
export const citiesByHyphenSlug: Record<string, CityData> = Object.fromEntries(
  cities.map((c) => [`${c.slug}-${c.stateSlug}`, c])
);

export type RouteCityMeta = {
  /** Canonical city slug, e.g. "san-antonio". */
  slug: string;
  name: string;
  /** Two-letter abbreviation, e.g. "TX". */
  state: string;
  /** Full state name, e.g. "Texas". */
  stateFull: string;
  /** Whether the city has a working permit-status checker. Gate every
   *  "we track this for you" claim on this — never on the city being listed. */
  trackingLive: boolean;
};

/**
 * Display metadata for the "<city>-<state>" route slugs, shared by /permits and
 * /contractors. Each of those routes previously kept its own copy of this
 * table with no notion of which cities were actually tracked.
 */
export const routeCityMeta: Record<string, RouteCityMeta> = Object.fromEntries(
  Object.entries(citiesByHyphenSlug).map(([key, c]) => [
    key,
    {
      slug: c.slug,
      name: c.name,
      state: c.stateAbbr,
      stateFull: c.state,
      trackingLive: LIVE_CHECKER_CITIES.has(c.slug),
    },
  ])
);

/** The "<city>-<state>" slugs, for generateStaticParams. */
export const routeCitySlugs = Object.keys(routeCityMeta);

/** Number of cities with live tracking — for "N cities" copy. */
export const LIVE_CITY_COUNT = liveCheckerCities.length;

/**
 * States represented by the live cities, deduped in declaration order.
 * e.g. "Texas, Ohio, and Pennsylvania".
 */
export function liveStateList(conjunction = "and"): string {
  const states = [...new Set(liveCheckerCities.map((c) => c.state))];
  if (states.length < 2) return states.join("");
  return `${states.slice(0, -1).join(", ")}, ${conjunction} ${states[states.length - 1]}`;
}

/** Look up a city by state slug + city slug */
export function getCityData(
  stateSlug: string,
  citySlug: string
): CityData | undefined {
  return cities.find(
    (c) => c.stateSlug === stateSlug && c.slug === citySlug
  );
}

/**
 * Cities grouped by state, preserving the declaration order above so the
 * /locations hub renders Texas → Ohio → Michigan → Pennsylvania → Washington.
 */
export function getCitiesByState(): { state: string; stateAbbr: string; cities: CityData[] }[] {
  const groups: { state: string; stateAbbr: string; cities: CityData[] }[] = [];

  for (const city of cities) {
    const existing = groups.find((g) => g.state === city.state);
    if (existing) {
      existing.cities.push(city);
    } else {
      groups.push({ state: city.state, stateAbbr: city.stateAbbr, cities: [city] });
    }
  }

  return groups;
}

/** Get the display name for a /locations/state/city path */
export function getCityDisplayName(path: string): string {
  const parts = path.replace("/locations/", "").split("/");
  const city = cities.find((c) => c.stateSlug === parts[0] && c.slug === parts[1]);
  return city ? `${city.name}, ${city.stateAbbr}` : path;
}
