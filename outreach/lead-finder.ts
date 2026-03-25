// Lead finder — discovers general contractor businesses via Google Maps API.
// Outputs a list of leads to pass to the email-writer.
//
// Google Maps Places API docs:
// https://developers.google.com/maps/documentation/places/web-service/search-text

import axios from "axios";

export interface Lead {
  name: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  googleMapsUrl?: string;
  rating?: number;
  reviewCount?: number;
}

interface PlaceResult {
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  url?: string;
  rating?: number;
  user_ratings_total?: number;
}

// ── Configuration ────────────────────────────────────────────────────────────

// Target cities to search. Add more as you expand.
const TARGET_CITIES: Array<{ city: string; state: string }> = [
  { city: "Austin", state: "TX" },
  { city: "Houston", state: "TX" },
  { city: "Dallas", state: "TX" },
  { city: "Denver", state: "CO" },
  { city: "Phoenix", state: "AZ" },
];

const SEARCH_QUERIES = [
  "general contractor",
  "building contractor",
  "construction company",
  "custom home builder",
];

// ── Main ─────────────────────────────────────────────────────────────────────

/**
 * Finds contractor leads in target cities.
 * Returns a de-duplicated list of leads sorted by review count.
 */
export async function findLeads(maxPerCity = 20): Promise<Lead[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is not set");

  const allLeads: Lead[] = [];
  const seen = new Set<string>();

  for (const { city, state } of TARGET_CITIES) {
    for (const query of SEARCH_QUERIES) {
      const leads = await searchCity(apiKey, query, city, state, maxPerCity);

      for (const lead of leads) {
        // Deduplicate by name + city
        const key = `${lead.name.toLowerCase()}|${city.toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          allLeads.push(lead);
        }
      }
    }

    // Respect Google's rate limit
    await sleep(200);
  }

  // Sort by review count descending — more established businesses first
  return allLeads.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
}

async function searchCity(
  apiKey: string,
  query: string,
  city: string,
  state: string,
  max: number
): Promise<Lead[]> {
  try {
    // Use Text Search to find businesses
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: `${query} in ${city} ${state}`,
          key: apiKey,
          type: "general_contractor",
        },
      }
    );

    const results: PlaceResult[] = response.data.results ?? [];

    return results.slice(0, max).map((r) => {
      const parts = r.formatted_address?.split(",") ?? [];
      return {
        name: r.name,
        address: parts[0]?.trim() ?? "",
        city: parts[1]?.trim() ?? city,
        state: state,
        phone: r.formatted_phone_number,
        website: r.website,
        googleMapsUrl: r.url,
        rating: r.rating,
        reviewCount: r.user_ratings_total,
      };
    });
  } catch (err) {
    console.error(`[LeadFinder] Error searching ${city}, ${state} for "${query}":`, err);
    return [];
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
