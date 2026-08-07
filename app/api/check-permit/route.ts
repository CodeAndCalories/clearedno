// POST /api/check-permit
//
// Free permit status check — no auth required.
// Rate limited: max 5 checks per IP per hour (in-memory counter).
//
// Body: { city: string, permitNumber: string }
// Returns:
//   200 → { status, rawStatus, address?, lastChecked, city }
//   404 → { status: "not_found", error, city }   permit absent from city records
//   503 → { status: "unavailable", message, city }  city integration not live
//
// `status` is only ever a mapped value or "UNKNOWN". This route never guesses
// a status for a permit it could not find or could not classify.

import { NextRequest, NextResponse } from "next/server";
import { cities, LIVE_CHECKER_CITIES } from "@/lib/cities";

// ── Rate limiter (in-memory, resets on server restart) ───────────────────────

type RateBucket = { count: number; resetAt: number };
const rateLimits = new Map<string, RateBucket>();
const MAX_PER_HOUR = 5;
const ONE_HOUR_MS  = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now    = Date.now();
  const bucket = rateLimits.get(ip);

  if (!bucket || now > bucket.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + ONE_HOUR_MS });
    return true;
  }

  if (bucket.count >= MAX_PER_HOUR) return false;

  bucket.count++;
  return true;
}

// ── Status normaliser ─────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, string> = {
  // Cleared / done
  FINAL: "CLEARED", FINALED: "CLEARED", CLOSED: "CLEARED",
  "CO ISSUED": "CLEARED", "CERTIFICATE OF OCCUPANCY": "CLEARED",
  COMPLETED: "CLEARED", "FINAL INSPECTION": "CLEARED", "FINAL INSPECTION APPROVED": "CLEARED",
  "PERMIT ISSUED": "CLEARED",

  // Approved / active
  ISSUED: "APPROVED", ACTIVE: "APPROVED", APPROVED: "APPROVED", "IN PROGRESS": "APPROVED",

  // Under review
  "UNDER REVIEW": "UNDER_REVIEW", "IN REVIEW": "UNDER_REVIEW",
  "CORRECTIONS REQUIRED": "UNDER_REVIEW", "PLAN REVIEW": "UNDER_REVIEW",
  HOLD: "UNDER_REVIEW", "ON HOLD": "UNDER_REVIEW", INSPECTION: "UNDER_REVIEW",

  // Pending
  PENDING: "PENDING",
  APPLICATION: "PENDING", SUBMITTED: "PENDING", INTAKE: "PENDING",
  "APPLICATION RECEIVED": "PENDING", "IN QUEUE": "PENDING", "IN INTAKE": "PENDING",
  RECEIVED: "PENDING",

  // Rejected
  CANCELLED: "REJECTED", CANCELED: "REJECTED", VOID: "REJECTED", VOIDED: "REJECTED",
  WITHDRAWN: "REJECTED", DENIED: "REJECTED", REVOKED: "REJECTED",
  REJECTED: "REJECTED",

  // Expired
  EXPIRED: "EXPIRED", LAPSED: "EXPIRED",
};

// Returns null when the city's status text has no mapping. Callers must
// surface that as UNKNOWN rather than substituting a plausible status —
// reporting "PENDING" for a status we don't recognise is a guess dressed
// up as a fact.
function normaliseStatus(raw: string): string | null {
  const key = raw.trim().toUpperCase();
  return STATUS_MAP[key] ?? null;
}

// ── Austin — Open Data API ────────────────────────────────────────────────────

type AustinResult =
  | { found: false }
  | { found: true; status: string; rawStatus: string; address?: string };

async function checkAustin(permitNumber: string): Promise<AustinResult> {
  const encoded = encodeURIComponent(permitNumber.trim());
  const url     = `https://data.austintexas.gov/resource/3syk-w9eu.json?permit_number=${encoded}&$limit=1`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Austin API ${res.status}`);

  const rows = await res.json() as Array<Record<string, string>>;

  // No row means the dataset has no such permit. Saying "PENDING" here
  // invented a status for permit numbers that don't exist at all.
  if (!rows.length) {
    return { found: false };
  }

  const row       = rows[0];
  const rawStatus = (row.status_current ?? row.status ?? "").trim();

  // Address fields on dataset 3syk-w9eu are original_address1 / original_city /
  // original_state. The previously used work_address / work_city / work_state
  // do not exist on this dataset, so the address was always undefined.
  const address = [row.original_address1, row.original_city, row.original_state]
    .filter(Boolean)
    .join(", ") || undefined;

  const status = (rawStatus && normaliseStatus(rawStatus)) || "UNKNOWN";

  return { found: true, status, rawStatus, address };
}

// ── City router ───────────────────────────────────────────────────────────────
//
// Only Austin has a live integration (Socrata Open Data API). The remaining
// city portals don't expose public APIs and would need Playwright scrapers —
// until those exist, we surface an honest "coming soon" instead of pretending
// to check.
//
// Accepted cities are derived from lib/cities.ts so every city with a
// /locations page can reach this route instead of failing "Invalid city".

const CITY_LABELS: Record<string, string> = Object.fromEntries(
  cities.map((c) => [c.slug, `${c.name}, ${c.stateAbbr}`])
);

const SUPPORTED_CITIES = LIVE_CHECKER_CITIES;

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
          ?? req.headers.get("x-real-ip")
          ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. You can check up to 5 permits per hour for free." },
      { status: 429 }
    );
  }

  let city: string;
  let permitNumber: string;

  try {
    const body = await req.json();
    city         = (body.city         as string | undefined)?.toLowerCase().trim() ?? "";
    permitNumber = (body.permitNumber as string | undefined)?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!city || !CITY_LABELS[city]) {
    return NextResponse.json({ error: "Invalid city" }, { status: 400 });
  }

  if (!permitNumber) {
    return NextResponse.json({ error: "Permit number is required" }, { status: 400 });
  }

  if (permitNumber.length > 50) {
    return NextResponse.json({ error: "Permit number too long" }, { status: 400 });
  }

  // Cities without a live integration return an honest 503. Surfacing fake
  // "PENDING" results regardless of input was destroying user trust on the
  // Dallas / Houston / San Antonio landing pages.
  if (!SUPPORTED_CITIES.has(city)) {
    const label = CITY_LABELS[city];
    const cityName = label.split(",")[0];
    return NextResponse.json(
      {
        status: "unavailable",
        message: `Live data for ${cityName} is coming soon. We're still working on the integration. Try Austin while you wait.`,
        city: cityName,
      },
      { status: 503 }
    );
  }

  try {
    const result = await checkAustin(permitNumber);

    // Permit isn't in the city's public dataset. Say so plainly instead of
    // returning a status we have no basis for.
    if (!result.found) {
      const cityName = CITY_LABELS[city].split(",")[0];
      return NextResponse.json(
        {
          status: "not_found",
          error:
            `No permit matching "${permitNumber}" was found in ${cityName}'s public records. ` +
            `Double-check the number, or note that very recent applications can take a few days to appear.`,
          city: cityName,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status:    result.status,
      rawStatus: result.rawStatus,
      address:   result.address,
      lastChecked: new Date().toLocaleString("en-US", {
        timeZone:     "America/Chicago",
        dateStyle:    "medium",
        timeStyle:    "short",
      }),
      city: CITY_LABELS[city],
    });
  } catch (err) {
    console.error("[check-permit] error:", err);
    return NextResponse.json(
      { error: "Failed to check permit. Please try again." },
      { status: 500 }
    );
  }
}
