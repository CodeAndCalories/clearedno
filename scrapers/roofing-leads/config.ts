/**
 * config.ts — State configuration for the roofing leads scraper.
 */

export interface StateConfig {
  name: string;         // Full name as it appears in NOAA Storm Events (e.g. "Ohio")
  abbreviation: string; // 2-letter postal code (e.g. "OH")
  fips: string;         // FIPS numeric code (e.g. "39")
}

export const STATES: StateConfig[] = [
  { name: "Ohio",         abbreviation: "OH", fips: "39" },
  { name: "Indiana",      abbreviation: "IN", fips: "18" },
  { name: "Michigan",     abbreviation: "MI", fips: "26" },
  { name: "Kentucky",     abbreviation: "KY", fips: "21" },
  { name: "Illinois",     abbreviation: "IL", fips: "17" },
  { name: "Pennsylvania", abbreviation: "PA", fips: "42" },
];
