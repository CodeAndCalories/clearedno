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
    buildingDeptName: "Houston Permits & Inspections Division",
    buildingDeptPhone: "(832) 394-8800",
    buildingDeptAddress: "1002 Washington Ave, Houston, TX 77002",
    buildingDeptUrl: "https://www.houstontx.gov/permits",
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
    buildingDeptAddress: "401 CAYMC, Detroit, MI 48226",
    buildingDeptUrl: "https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department",
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

/** Look up a city by state slug + city slug */
export function getCityData(
  stateSlug: string,
  citySlug: string
): CityData | undefined {
  return cities.find(
    (c) => c.stateSlug === stateSlug && c.slug === citySlug
  );
}

/** Get the display name for a /locations/state/city path */
export function getCityDisplayName(path: string): string {
  const parts = path.replace("/locations/", "").split("/");
  const city = cities.find((c) => c.stateSlug === parts[0] && c.slug === parts[1]);
  return city ? `${city.name}, ${city.stateAbbr}` : path;
}
