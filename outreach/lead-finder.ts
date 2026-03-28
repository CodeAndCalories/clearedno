// Lead finder — discovers contractor businesses via Google Maps Places API,
// scrapes their websites for real contact emails, and saves to Supabase.
//
// Pipeline per lead:
//   1. Text Search → place_id list
//   2. Place Details API → website + phone per place
//   3. Website scrape → multi-method email extraction
//   4. Save to outreach_leads (with email OR phone — not "no contact info")

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

// Expanded contact page paths to check in order
const CONTACT_PATHS = [
  "/contact",
  "/contact-us",
  "/about",
  "/about-us",
  "/get-in-touch",
  "/reach-us",
  "/hire-us",
  "/estimate",
  "/free-estimate",
  "/request-quote",
  "/quote",
];

// Strings that disqualify an email even if it matches the regex
const EMAIL_BLOCKLIST = [
  "noreply", "no-reply", "donotreply",
  "wordpress", "woocommerce", "sentry",
  "example.com", "test.com", "w3.org", "schema.org",
  "yoursite", "yourdomain", "domain.com",
  "privacy@", "legal@", "abuse@", "postmaster@",
  "webmaster@", "support@squarespace", "support@wix",
  "@sentry.io", "@rollbar.com", "@bugsnag.com",
];

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

// Realistic browser UA — some contractor sites block non-browser UAs
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// ── Main ──────────────────────────────────────────────────────────────────────

export async function findAndSaveLeads(maxPerQuery = 10): Promise<Lead[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is not set");

  let totalFound      = 0;
  let totalWithEmail  = 0;
  let totalPhoneOnly  = 0;
  let totalSkipped    = 0;
  const seenNames     = new Set<string>();
  const allLeads:  Lead[] = [];

  for (const { city, state } of TARGET_CITIES) {
    for (const { query, contractorType } of SEARCH_QUERIES) {
      const placeIds = await textSearch(apiKey, query, city, state, maxPerQuery);
      console.log(`[LeadFinder] ${city} / ${query} → ${placeIds.length} places`);

      for (const { placeId, name, address } of placeIds) {
        const key = `${name.toLowerCase()}|${city.toLowerCase()}`;
        if (seenNames.has(key)) continue;
        seenNames.add(key);
        totalFound++;

        console.log(`[LeadFinder]   Checking: ${name}`);

        // Step 1: Enrich with Place Details (website + phone)
        const details = await getPlaceDetails(placeId, apiKey);
        await sleep(150);

        const lead: Lead = {
          name,
          address,
          city,
          state,
          phone:          details.phone,
          website:        details.website,
          contractorType,
        };

        // Step 2: Multi-method email extraction from website
        if (details.website) {
          const email = await extractEmailFromWebsite(details.website);
          if (email) {
            lead.email = email;
            console.log(`[LeadFinder]   ✓ Found email: ${email}`);
          } else {
            console.log(`[LeadFinder]   ✗ No email found on ${details.website}`);
          }
          await sleep(1_000); // Be polite between website visits
        }

        // Step 3: Decide whether to keep this lead
        if (lead.email) {
          totalWithEmail++;
          allLeads.push(lead);
        } else if (lead.phone) {
          // Phone-only lead — still useful for future outreach methods
          totalPhoneOnly++;
          allLeads.push(lead);
          console.log(`[LeadFinder]   → Keeping as phone-only: ${lead.phone}`);
        } else {
          totalSkipped++;
          console.log(`[LeadFinder]   → Skipping ${name} (no email, no phone)`);
        }
      }
    }
  }

  console.log(
    `[LeadFinder] Summary: ${totalFound} found, ` +
    `${totalWithEmail} with email, ` +
    `${totalPhoneOnly} phone-only, ` +
    `${totalSkipped} skipped (no contact info)`
  );

  const saved = await saveLeads(allLeads);
  console.log(`[LeadFinder] Saved ${saved.length} new leads to DB`);
  return saved;
}

/** Legacy alias used by index.ts */
export async function findLeads(maxPerQuery = 10): Promise<Lead[]> {
  return findAndSaveLeads(maxPerQuery);
}

// ── Google Maps API ────────────────────────────────────────────────────────────

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
 * Tries every extraction method on the homepage + common contact pages.
 * Methods tried per page (in order):
 *   1. JSON-LD schema.org @type=LocalBusiness / email field
 *   2. mailto: href attributes
 *   3. Obfuscated emails: "name [at] domain [dot] com"
 *   4. Raw regex scan of visible text and JSON strings
 * Returns the first valid email found, or null.
 * Never throws.
 */
export async function extractEmailFromWebsite(websiteUrl: string): Promise<string | null> {
  const base = normalizeUrl(websiteUrl);
  if (!base) return null;

  const pagesToTry = [base, ...CONTACT_PATHS.map((p) => `${base.replace(/\/$/, "")}${p}`)];

  for (const pageUrl of pagesToTry) {
    const html = await fetchWithTimeout(pageUrl, 6_000);
    if (!html) continue;

    const email = pickBestEmail(extractAllEmails(html));
    if (email) return email;
  }

  return null;
}

/**
 * Runs every extraction method against a single HTML string.
 * Returns deduplicated candidate email list.
 */
function extractAllEmails(html: string): string[] {
  const candidates = new Set<string>();

  // ── Method 1: JSON-LD structured data ─────────────────────────────────────
  // <script type="application/ld+json">{"@type":"LocalBusiness","email":"..."}
  const ldJsonBlocks = Array.from(html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
  for (const block of ldJsonBlocks) {
    try {
      const obj = JSON.parse(block[1]);
      const emails = findEmailsInObject(obj);
      for (const e of emails) candidates.add(e.toLowerCase());
    } catch {
      // Malformed JSON — ignore
    }
  }

  // ── Method 2: mailto: href links ──────────────────────────────────────────
  for (const match of Array.from(html.matchAll(/mailto:([^"'\s>?&]+)/gi))) {
    const raw = match[1].toLowerCase().split("?")[0].trim();
    if (raw.includes("@")) candidates.add(raw);
  }

  // ── Method 3: Obfuscated "name [at] domain [dot] com" ─────────────────────
  const deobfuscated = html
    .replace(/\s*\[at\]\s*/gi, "@")
    .replace(/\s*\(at\)\s*/gi, "@")
    .replace(/\s+at\s+/gi,     "@")
    .replace(/\s*\[dot\]\s*/gi, ".")
    .replace(/\s*\(dot\)\s*/gi, ".")
    .replace(/\s+dot\s+/gi,     ".");

  for (const match of Array.from(deobfuscated.matchAll(new RegExp(EMAIL_REGEX.source, "g")))) {
    candidates.add(match[0].toLowerCase());
  }

  // ── Method 4: JSON string patterns "email":"..." and 'email':'...' ─────────
  for (const match of Array.from(html.matchAll(/["']email["']\s*:\s*["']([^"']+)["']/gi))) {
    const e = match[1].toLowerCase().trim();
    if (e.includes("@")) candidates.add(e);
  }

  // ── Method 5: Raw regex on full source (catches anything missed above) ─────
  for (const match of Array.from(html.matchAll(new RegExp(EMAIL_REGEX.source, "g")))) {
    candidates.add(match[0].toLowerCase());
  }

  return Array.from(candidates);
}

/** Recursively walks a parsed JSON object looking for "email" keys. */
function findEmailsInObject(obj: unknown, depth = 0): string[] {
  if (depth > 6 || obj === null || typeof obj !== "object") return [];
  const found: string[] = [];
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (key.toLowerCase() === "email" && typeof value === "string" && value.includes("@")) {
      found.push(value);
    } else if (typeof value === "object") {
      found.push(...findEmailsInObject(value, depth + 1));
    } else if (Array.isArray(value)) {
      for (const item of value as unknown[]) found.push(...findEmailsInObject(item, depth + 1));
    }
  }
  return found;
}

/** Fetches a URL with timeout. Returns null on error or timeout. */
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal:   controller.signal,
      redirect: "follow",
      headers:  {
        "User-Agent": BROWSER_UA,
        "Accept":     "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text") && !ct.includes("html")) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Filters candidate emails and returns the best one, or null. */
function pickBestEmail(emails: string[]): string | null {
  const valid = emails.filter((e) => {
    if (!e.includes("@")) return false;
    const lower = e.toLowerCase();
    if (EMAIL_BLOCKLIST.some((blocked) => lower.includes(blocked))) return false;
    const parts = lower.split(".");
    const tld   = parts[parts.length - 1];
    if (!tld || tld.length < 2 || tld.length > 6) return false;
    // Must have something before the @ and a domain after
    const [local, domain] = lower.split("@");
    if (!local || local.length < 1) return false;
    if (!domain || !domain.includes(".")) return false;
    return true;
  });

  if (valid.length === 0) return null;

  // Prefer business-generic addresses over personal ones
  const preferred = valid.find((e) =>
    /^(info|contact|hello|hey|admin|office|team|estimate|quotes?)@/.test(e)
  );
  return preferred ?? valid[0];
}

function normalizeUrl(raw: string): string | null {
  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return u.origin;
  } catch {
    return null;
  }
}

// ── Supabase ──────────────────────────────────────────────────────────────────

async function saveLeads(leads: Lead[]): Promise<Lead[]> {
  const saved: Lead[] = [];

  for (const lead of leads) {
    // Require at least one contact method
    if (!lead.email && !lead.phone) continue;

    const { data, error } = await supabaseAdmin
      .from("outreach_leads")
      .insert({
        business_name:   lead.name,
        email:           lead.email           ?? null,
        phone:           lead.phone           ?? null,
        city:            lead.city,
        state:           lead.state,
        contractor_type: lead.contractorType,
        website:         lead.website         ?? null,
        source:          "google_maps",
        status:          "new",
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") continue; // Duplicate — skip silently
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
