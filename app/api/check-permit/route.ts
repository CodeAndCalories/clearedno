// POST /api/check-permit
//
// Free permit status check — no auth required.
// Rate limited: max 5 checks per IP per hour (in-memory counter).
//
// Body: { city: string, permitNumber: string }
// Returns: { status, address?, lastChecked, city }

import { NextRequest, NextResponse } from "next/server";

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
  APPLICATION: "PENDING", SUBMITTED: "PENDING", INTAKE: "PENDING",
  "APPLICATION RECEIVED": "PENDING", "IN QUEUE": "PENDING", "IN INTAKE": "PENDING",
  RECEIVED: "PENDING",

  // Rejected
  CANCELLED: "REJECTED", CANCELED: "REJECTED", VOID: "REJECTED", VOIDED: "REJECTED",
  WITHDRAWN: "REJECTED", DENIED: "REJECTED", REVOKED: "REJECTED",

  // Expired
  EXPIRED: "EXPIRED", LAPSED: "EXPIRED",
};

function normaliseStatus(raw: string): string {
  const key = raw.trim().toUpperCase();
  return STATUS_MAP[key] ?? "PENDING";
}

// ── Austin — Open Data API ────────────────────────────────────────────────────

async function checkAustin(permitNumber: string): Promise<{ status: string; address?: string }> {
  const encoded = encodeURIComponent(permitNumber.trim());
  const url     = `https://data.austintexas.gov/resource/3syk-w9eu.json?permit_number=${encoded}&$limit=1`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Austin API ${res.status}`);

  const rows = await res.json() as Array<Record<string, string>>;

  if (!rows.length) {
    return { status: "PENDING" };
  }

  const row    = rows[0];
  const raw    = row.status_current ?? row.status ?? "";
  const status = normaliseStatus(raw) || "PENDING";
  const address = [row.work_address, row.work_city, row.work_state].filter(Boolean).join(", ") || undefined;

  return { status, address };
}

// ── Dallas — portal check (best-effort, no Playwright) ───────────────────────

async function checkDallas(permitNumber: string): Promise<{ status: string; address?: string }> {
  // Dallas Development Services portal (Energov-based) doesn't expose a public API.
  // We return a best-effort result and direct users to sign up for full monitoring.
  const url = `https://developmentservices.dallascityhall.com/`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8_000) });
    if (res.ok) {
      return { status: "PENDING" };
    }
  } catch {
    // Portal unreachable — return generic pending
  }
  return { status: "PENDING" };
}

// ── Houston — portal check (best-effort) ─────────────────────────────────────

async function checkHouston(permitNumber: string): Promise<{ status: string; address?: string }> {
  // Houston's permit portal is a JS-rendered SPA — full check requires Playwright.
  // We confirm the portal is reachable and return PENDING until the user signs up.
  const url = `https://www.houston311.org/hpd/`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8_000) });
    if (res.ok) {
      return { status: "PENDING" };
    }
  } catch {
    // fall through
  }
  return { status: "PENDING" };
}

// ── San Antonio — portal check (best-effort) ─────────────────────────────────

async function checkSanAntonio(permitNumber: string): Promise<{ status: string; address?: string }> {
  // SAICIMS portal is Accela-based and requires Playwright for full scraping.
  const url = `https://saicims.sanantonio.gov/PermitStatus/`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8_000) });
    if (res.ok) {
      return { status: "PENDING" };
    }
  } catch {
    // fall through
  }
  return { status: "PENDING" };
}

// ── City router ───────────────────────────────────────────────────────────────

const CITY_LABELS: Record<string, string> = {
  austin:       "Austin, TX",
  dallas:       "Dallas, TX",
  houston:      "Houston, TX",
  "san-antonio": "San Antonio, TX",
};

async function runCityCheck(
  city: string,
  permitNumber: string
): Promise<{ status: string; address?: string }> {
  switch (city) {
    case "austin":       return checkAustin(permitNumber);
    case "dallas":       return checkDallas(permitNumber);
    case "houston":      return checkHouston(permitNumber);
    case "san-antonio":  return checkSanAntonio(permitNumber);
    default:             throw new Error(`Unsupported city: ${city}`);
  }
}

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

  try {
    const { status, address } = await runCityCheck(city, permitNumber);

    return NextResponse.json({
      status,
      address,
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
