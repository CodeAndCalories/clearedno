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
    buildingDeptName: "Dallas Development Services Department",
    buildingDeptPhone: "(214) 948-4480",
    buildingDeptAddress: "320 E Jefferson Blvd, Dallas, TX 75203",
    buildingDeptUrl: "https://dallascityhall.com/departments/sustainabledevelopment/developmentservices",
    summary:
      "Dallas Development Services handles permits for the city proper. New commercial construction carries the longest review window of any Texas metro we track.",
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
    buildingDeptName: "Columbus Building and Zoning Services",
    buildingDeptPhone: "(614) 645-7433",
    buildingDeptAddress: "111 N Front St, Columbus, OH 43215",
    buildingDeptUrl: "https://www.columbus.gov/bzs",
    summary:
      "Columbus Building and Zoning Services covers Ohio's largest permit market. Residential additions typically clear in a few weeks; commercial work runs considerably longer.",
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
    buildingDeptName: "Cincinnati Development Services",
    buildingDeptPhone: "(513) 352-3271",
    buildingDeptAddress: "805 Central Ave, Cincinnati, OH 45202",
    buildingDeptUrl: "https://www.cincinnati-oh.gov/psa/permits-inspections",
    summary:
      "Cincinnati Development Services posts the quickest residential turnaround of the three Ohio metros we track, with tenant improvements moving faster than regional averages.",
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
    buildingDeptName: "Detroit Buildings, Safety Engineering and Environmental Department",
    buildingDeptPhone: "(313) 224-3160",
    buildingDeptAddress: "Coleman A. Young Municipal Center, 2 Woodward Avenue, Suite 401, Detroit, MI 48226",
    buildingDeptUrl: "https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department",
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
    buildingDeptName: "Philadelphia Department of Licenses and Inspections",
    buildingDeptPhone: "(215) 686-2400",
    buildingDeptAddress: "1401 JFK Blvd, Philadelphia, PA 19102",
    buildingDeptUrl: "https://www.phila.gov/departments/department-of-licenses-and-inspections",
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
];

/**
 * Cities with a live permit-lookup integration behind /api/check-permit.
 * Everything else renders the checker's honest "coming soon" state, so any
 * copy wrapped around the tool must not promise an instant status result.
 */
export const LIVE_CHECKER_CITIES = new Set<string>(["austin"]);

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
 * /locations hub renders Texas → Ohio → Michigan → Pennsylvania.
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
