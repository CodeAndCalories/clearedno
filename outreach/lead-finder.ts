// Lead finder — discovers contractor businesses via Google Maps Places API.
// Saves discovered leads to Supabase outreach_leads table.
// Deduplicates by email (unique constraint in DB).

import axios from "axios";
import { supabaseAdmin } from "../lib/supabase/admin";

export interface Lead {
  id?: string;            // Supabase row ID (set after upsert)
  name: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  googleMapsUrl?: string;
  rating?: number;
  reviewCount?: number;
  contractorType: string;
  email?: string;
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

// ── Configuration ─────────────────────────────────────────────────────────────

const TARGET_CITIES: Array<{ city: string; state: string }> = [
  { city: "Austin",  state: "TX" },
  { city: "Dallas",  state: "TX" },
  { city: "Houston", state: "TX" },
];

// Each query = one Google Maps text search
const SEARCH_QUERIES: Array<{ query: string; contractorType: string }> = [
  { query: "general contractor",   contractorType: "general"  },
  { query: "roofing contractor",   contractorType: "roofing"  },
  { query: "plumbing contractor",  contractorType: "plumbing" },
  { query: "HVAC contractor",      contractorType: "hvac"     },
];

// ── Main ──────────────────────────────────────────────────────────────────────

/**
 * Finds contractor leads across target cities, derives emails from websites,
 * saves them to Supabase outreach_leads, and returns the newly inserted rows.
 */
export async function findAndSaveLeads(maxPerQuery = 10): Promise<Lead[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is not set");

  const allLeads: Lead[] = [];
  const seenNames = new Set<string>();

  for (const { city, state } of TARGET_CITIES) {
    for (const { query, contractorType } of SEARCH_QUERIES) {
      const leads = await searchCity(apiKey, query, contractorType, city, state, maxPerQuery);

      for (const lead of leads) {
        const key = `${lead.name.toLowerCase()}|${city.toLowerCase()}`;
        if (seenNames.has(key)) continue;
        seenNames.add(key);

        // Derive email from website domain
        lead.email = deriveEmail(lead.website);
        allLeads.push(lead);
      }

      await sleep(200); // Respect Google rate limit
    }
  }

  // Save to Supabase — skip rows where email already exists (unique constraint)
  const saved = await saveLeads(allLeads);
  return saved;
}

/** Legacy export used by index.ts — same as findAndSaveLeads */
export async function findLeads(maxPerQuery = 10): Promise<Lead[]> {
  return findAndSaveLeads(maxPerQuery);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function searchCity(
  apiKey: string,
  query: string,
  contractorType: string,
  city: string,
  state: string,
  max: number
): Promise<Lead[]> {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: `${query} in ${city} ${state}`,
          key:   apiKey,
          type:  "general_contractor",
        },
      }
    );

    const results: PlaceResult[] = response.data.results ?? [];

    return results.slice(0, max).map((r) => {
      const parts = r.formatted_address?.split(",") ?? [];
      return {
        name:           r.name,
        address:        parts[0]?.trim() ?? "",
        city:           parts[1]?.trim() ?? city,
        state,
        phone:          r.formatted_phone_number,
        website:        r.website,
        googleMapsUrl:  r.url,
        rating:         r.rating,
        reviewCount:    r.user_ratings_total,
        contractorType,
      };
    });
  } catch (err) {
    console.error(`[LeadFinder] Error searching ${city}, ${state} for "${query}":`, err);
    return [];
  }
}

function deriveEmail(website?: string): string | undefined {
  if (!website) return undefined;
  try {
    const domain = new URL(
      website.startsWith("http") ? website : `https://${website}`
    ).hostname.replace(/^www\./, "");
    return `info@${domain}`;
  } catch {
    return undefined;
  }
}

async function saveLeads(leads: Lead[]): Promise<Lead[]> {
  const saved: Lead[] = [];

  for (const lead of leads) {
    if (!lead.email) continue; // Skip leads with no email — nothing to send to

    const { data, error } = await supabaseAdmin
      .from("outreach_leads")
      .insert({
        business_name:   lead.name,
        email:           lead.email,
        phone:           lead.phone ?? null,
        city:            lead.city,
        state:           lead.state,
        contractor_type: lead.contractorType,
        website:         lead.website ?? null,
        source:          "google_maps",
        status:          "new",
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint — email already in table, skip silently
        continue;
      }
      console.error(`[LeadFinder] DB insert failed for ${lead.name}:`, error.message);
      continue;
    }

    saved.push({ ...lead, id: data.id });
  }

  return saved;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
