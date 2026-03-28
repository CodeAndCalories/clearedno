// Lead finder — discovers contractor businesses via Google Maps Places API,
// scrapes their websites for real contact emails, and saves to Supabase.
//
// Pipeline per lead:
//   1. Text Search → place_id list
//   2. Place Details API → website + phone per place
//   3. Website scrape → extract real email from homepage + /contact + /about
//   4. Save to outreach_leads (skip if no email found)

import axios from "axios";
import { supabaseAdmin } from "../lib/supabase/admin";

export interface Lead {
  id?:            string;
  name:           string;
  address:        string;
  city:           string;
  state:          string;
  phone?:         string;
  website?:       string;
  contractorType: string;
  email?:         string;
}

// ── Configuration ─────────────────────────────────────────────────────────────

const TARGET_CITIES: Array<{ city: string; state: string }> = [
  { city: "Austin",      state: "TX" },
  { city: "Dallas",      state: "TX" },
  { city: "Houston",     state: "TX" },
  { city: "San Antonio", state: "TX" },
  { city: "Fort Worth",  state: "TX" },
];

const SEARCH_QUERIES: Array<{ query: string; contractorType: string }> = [
  { query: "general contractor",    contractorType: "general"    },
  { query: "roofing contractor",    contractorType: "roofing"    },
  { query: "plumbing contractor",   contractorType: "plumbing"   },
  { query: "electrical contractor", contractorType: "electrical" },
  { query: "HVAC contractor",       contractorType: "hvac"       },
  { query: "remodeling contractor", contractorType: "remodeling" },
];

// Pages to check on each website for contact emails
const CONTACT_PATHS = ["/contact", "/contact-us", "/about", "/about-us"];

// Emails to discard even if they match the regex
const EMAIL_BLOCKLIST = [
  "noreply", "no-reply", "donotreply",
  "wordpress", "woocommerce", "sentry",
  "example.com", "test.com", "w3.org", "schema.org",
  "yoursite", "yourdomain", "domain.com",
  "privacy@", "legal@", "abuse@", "postmaster@",
  "webmaster@",
];

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

// ── Main ──────────────────────────────────────────────────────────────────────

export async function findAndSaveLeads(maxPerQuery = 10): Promise<Lead[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is not set");

  let totalFound = 0;
  let totalWithEmail = 0;
  const seenNames = new Set<string>();
  const allLeads: Lead[] = [];

  for (const { city, state } of TARGET_CITIES) {
    for (const { query, contractorType } of SEARCH_QUERIES) {
      const placeIds = await textSearch(apiKey, query, city, state, maxPerQuery);
      console.log(`[LeadFinder] ${city} / ${query} → ${placeIds.length} places`);

      for (const { placeId, name, address } of placeIds) {
        const key = `${name.toLowerCase()}|${city.toLowerCase()}`;
        if (seenNames.has(key)) continue;
        seenNames.add(key);
        totalFound++;

        // Step 1: Enrich with Place Details (website + phone)
        const details = await getPlaceDetails(placeId, apiKey);
        await sleep(150); // Respect Places API rate limit

        const lead: Lead = {
          name,
          address,
          city,
          state,
          phone:          details.phone,
          website:        details.website,
          contractorType,
        };

        // Step 2: Try to find a real email from their website
        if (details.website) {
          const email = await extractEmailFromWebsite(details.website);
          if (email) {
            lead.email = email;
          } else {
            console.log(`[LeadFinder] No email found for ${name} (${details.website}) — skipping`);
          }
          await sleep(1_000); // Be polite between website visits
        } else {
          console.log(`[LeadFinder] No website for ${name} — skipping`);
        }

        if (lead.email) {
          totalWithEmail++;
          allLeads.push(lead);
        }
      }
    }
  }

  console.log(`[LeadFinder] Found: ${totalFound} total, ${totalWithEmail} with emails`);
  const saved = await saveLeads(allLeads);
  console.log(`[LeadFinder] Saved ${saved.length} new leads to DB`);
  return saved;
}

/** Legacy alias used by index.ts */
export async function findLeads(maxPerQuery = 10): Promise<Lead[]> {
  return findAndSaveLeads(maxPerQuery);
}

// ── Google Maps API ────────────────────────────────────────────────────────────

/** Returns place IDs + names from a text search query. */
async function textSearch(
  apiKey: string,
  query: string,
  city: string,
  state: string,
  max: number
): Promise<Array<{ placeId: string; name: string; address: string }>> {
  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: `${query} in ${city} ${state}`,
          key:   apiKey,
        },
      }
    );

    return (res.data.results ?? []).slice(0, max).map((r: any) => ({
      placeId: r.place_id as string,
      name:    r.name    as string,
      address: (r.formatted_address as string | undefined)?.split(",")[0]?.trim() ?? "",
    }));
  } catch (err) {
    console.error(`[LeadFinder] Text search failed (${city} / ${query}):`, (err as Error).message);
    return [];
  }
}

/** Calls Place Details API to get website + phone for a given place_id. */
async function getPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<{ website?: string; phone?: string }> {
  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          fields:   "website,formatted_phone_number",
          key:      apiKey,
        },
      }
    );
    const r = res.data.result ?? {};
    return {
      website: r.website,
      phone:   r.formatted_phone_number,
    };
  } catch (err) {
    console.error(`[LeadFinder] Place Details failed for ${placeId}:`, (err as Error).message);
    return {};
  }
}

// ── Website email extraction ───────────────────────────────────────────────────

/**
 * Scrapes a contractor website and attempts to find a contact email.
 * Checks homepage first, then common contact pages.
 * Returns the first valid email found, or null.
 * Never throws — always returns null on any error.
 */
export async function extractEmailFromWebsite(websiteUrl: string): Promise<string | null> {
  const base = normalizeUrl(websiteUrl);
  if (!base) return null;

  // Pages to try in order — homepage first, then contact pages
  const pagesToTry = [base, ...CONTACT_PATHS.map((p) => base.replace(/\/$/, "") + p)];

  for (const pageUrl of pagesToTry) {
    const html = await fetchWithTimeout(pageUrl, 5_000);
    if (!html) continue;

    const email = pickBestEmail(extractEmails(html));
    if (email) return email;
  }

  return null;
}

/** Fetches a URL and returns the HTML body as a string. Returns null on timeout or error. */
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ClearedNo/1.0; +https://clearedno.com)",
        "Accept":     "text/html",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text")) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Extracts all email-shaped strings from raw HTML. */
function extractEmails(html: string): string[] {
  // Strip HTML tags first so we don't match tag attributes we don't want
  const text   = html.replace(/<[^>]+>/g, " ");
  const emails = new Set<string>();

  for (const match of text.matchAll(new RegExp(EMAIL_REGEX.source, "g"))) {
    emails.add(match[0].toLowerCase());
  }

  // Also look for mailto: links which are a reliable source
  for (const match of html.matchAll(/mailto:([^"'\s>?]+)/gi)) {
    emails.add(match[1].toLowerCase().split("?")[0]); // strip ?subject= etc.
  }

  return Array.from(emails);
}

/** Filters and scores candidate emails, returns the best one or null. */
function pickBestEmail(emails: string[]): string | null {
  const valid = emails.filter((e) => {
    if (!e.includes("@")) return false;
    const lower = e.toLowerCase();
    if (EMAIL_BLOCKLIST.some((blocked) => lower.includes(blocked))) return false;
    // Must have a real TLD (2-6 chars after last dot)
    const parts = e.split(".");
    const tld   = parts[parts.length - 1];
    if (!tld || tld.length < 2 || tld.length > 6) return false;
    return true;
  });

  if (valid.length === 0) return null;

  // Prefer owner-sounding addresses: first name or business emails
  const preferred = valid.find((e) =>
    /^(info|contact|hello|hey|admin|office|team)@/.test(e)
  );
  return preferred ?? valid[0];
}

function normalizeUrl(raw: string): string | null {
  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return u.origin; // e.g. https://example.com (no trailing path)
  } catch {
    return null;
  }
}

// ── Supabase ──────────────────────────────────────────────────────────────────

async function saveLeads(leads: Lead[]): Promise<Lead[]> {
  const saved: Lead[] = [];

  for (const lead of leads) {
    if (!lead.email) continue;

    const { data, error } = await supabaseAdmin
      .from("outreach_leads")
      .insert({
        business_name:   lead.name,
        email:           lead.email,
        phone:           lead.phone   ?? null,
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
      if (error.code === "23505") continue; // Duplicate email — skip silently
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
