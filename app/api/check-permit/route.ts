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
import { resolveStatus } from "@/lib/permit-status";

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

// ── Status normalisation ──────────────────────────────────────────────────────
//
// Status vocabularies live in lib/permit-status.ts and are shared with the
// scraper engine. This route previously carried its own generic map, which
// meant the same permit could report one status here and a different one in
// the dashboard. resolveStatus() is the exact logic the scrapers use.

// ── City checkers ─────────────────────────────────────────────────────────────
//
// Every checker below hits a public, unauthenticated API. No browser, no auth.
// Each one must return { found: false } when the permit is absent rather than
// inventing a status.
//
// NOTE: the fetch/parse logic below deliberately re-implements what the
// scrapers in scrapers/cities/*.ts do, instead of importing them: those
// modules pull in `playwright` (Austin still keeps a portal fallback), which
// must never enter the Next.js bundle. The status VOCABULARIES are not
// duplicated — both sides call resolveStatus() from lib/permit-status.

type CheckResult =
  | { found: false }
  | { found: true; status: string; rawStatus: string; address?: string };

/** Escape a value for safe interpolation into a single-quoted SQL literal. */
function sqlQuote(value: string): string {
  return `'${value.trim().replace(/'/g, "''")}'`;
}

// Austin — Socrata Open Data API
async function checkAustin(permitNumber: string): Promise<CheckResult> {
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

  const status = rawStatus ? resolveStatus("austin", rawStatus) : "UNKNOWN";

  return { found: true, status, rawStatus, address };
}

// Columbus — ArcGIS Feature Service (City of Columbus Maps & Apps)
async function checkColumbus(permitNumber: string): Promise<CheckResult> {
  const params = new URLSearchParams({
    where:             `B1_ALT_ID=${sqlQuote(permitNumber)}`,
    outFields:         "B1_ALT_ID,PERMIT_STATUS,B1_APPL_STATUS,SITE_ADDRESS",
    returnGeometry:    "false",
    resultRecordCount: "1",
    f:                 "json",
  });
  const url =
    "https://services1.arcgis.com/9yy6msODkIBzkUXU/arcgis/rest/services/" +
    `Building_Permits/FeatureServer/0/query?${params.toString()}`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Columbus API ${res.status}`);

  const data = await res.json() as {
    features?: { attributes?: Record<string, string | null> }[];
    error?: { message?: string };
  };

  // ArcGIS returns query errors with HTTP 200, so this must be checked
  // explicitly or a malformed query looks like "permit not found".
  if (data.error) throw new Error(`Columbus API: ${data.error.message ?? "unknown"}`);

  const attrs = data.features?.[0]?.attributes;
  if (!attrs) return { found: false };

  // PERMIT_STATUS is the lifecycle status; B1_APPL_STATUS is the fallback.
  // "None" is Columbus's placeholder for "no status recorded".
  const permitStatus = (attrs.PERMIT_STATUS  ?? "").trim();
  const applStatus   = (attrs.B1_APPL_STATUS ?? "").trim();
  const rawStatus    = permitStatus || applStatus;
  const usable       = rawStatus && rawStatus.toUpperCase() !== "NONE" ? rawStatus : "";

  const address = (attrs.SITE_ADDRESS ?? "").trim()
    ? `${(attrs.SITE_ADDRESS ?? "").trim()}, Columbus, OH`
    : undefined;

  return {
    found:     true,
    status:    usable ? resolveStatus("columbus", usable) : "UNKNOWN",
    rawStatus: usable,
    address,
  };
}

// Philadelphia — L&I permits via the Carto SQL API.
// The permit number MUST be quoted; unquoted it parses as a column name and
// the API returns HTTP 400.
async function checkPhiladelphia(permitNumber: string): Promise<CheckResult> {
  const sql =
    `SELECT permitnumber, status, address FROM permits ` +
    `WHERE permitnumber=${sqlQuote(permitNumber)} LIMIT 1`;
  const url = `https://phl.carto.com/api/v2/sql?q=${encodeURIComponent(sql)}`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Philadelphia API ${res.status}`);

  const data = await res.json() as { rows?: Record<string, string | null>[] };
  const row  = data.rows?.[0];
  if (!row) return { found: false };

  const rawStatus = (row.status ?? "").trim();
  const address   = (row.address ?? "").trim()
    ? `${(row.address ?? "").trim()}, Philadelphia, PA`
    : undefined;

  return {
    found:     true,
    status:    rawStatus ? resolveStatus("philadelphia", rawStatus) : "UNKNOWN",
    rawStatus,
    address,
  };
}

// Cleveland — ArcGIS Feature Service (City of Cleveland Open Data)
async function checkCleveland(permitNumber: string): Promise<CheckResult> {
  const params = new URLSearchParams({
    where:             `PERMIT_ID=${sqlQuote(permitNumber)}`,
    outFields:         "PERMIT_ID,CURRENT_TASK,CURRENT_TASK_STATUS,PRIMARY_ADDRESS",
    returnGeometry:    "false",
    resultRecordCount: "1",
    f:                 "json",
  });
  const url =
    "https://services3.arcgis.com/dty2kHktVXHrqO8i/arcgis/rest/services/" +
    `Building_Permits/FeatureServer/0/query?${params.toString()}`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Cleveland API ${res.status}`);

  const data = await res.json() as {
    features?: { attributes?: Record<string, string | null> }[];
    error?: { message?: string };
  };

  if (data.error) throw new Error(`Cleveland API: ${data.error.message ?? "unknown"}`);

  const attrs = data.features?.[0]?.attributes;
  if (!attrs) return { found: false };

  const taskStatus  = (attrs.CURRENT_TASK_STATUS ?? "").trim();
  const currentTask = (attrs.CURRENT_TASK        ?? "").trim();
  // Surface the workflow stage alongside the status — "Inspection / Inspection
  // Pending" reads far better than the bare status.
  const rawStatus = currentTask && taskStatus
    ? `${currentTask} / ${taskStatus}`
    : taskStatus;

  return {
    found:     true,
    status:    taskStatus ? resolveStatus("cleveland", taskStatus) : "UNKNOWN",
    rawStatus,
    address:   (attrs.PRIMARY_ADDRESS ?? "").trim() || undefined,
  };
}

// Cincinnati — Socrata Open Data API
async function checkCincinnati(permitNumber: string): Promise<CheckResult> {
  const url =
    "https://data.cincinnati-oh.gov/resource/uhjb-xac9.json" +
    `?permitnum=${encodeURIComponent(permitNumber.trim())}&$limit=1`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Cincinnati API ${res.status}`);

  const rows = await res.json() as Array<Record<string, string>>;
  const row  = rows[0];
  if (!row) return { found: false };

  // statuscurrentmapped is the human label but omits some codes, so the raw
  // statuscurrent is the fallback rather than the other way round.
  const rawStatus = (row.statuscurrentmapped ?? "").trim()
                 || (row.statuscurrent       ?? "").trim();

  const address = [row.originaladdress1, row.originalcity, row.originalstate]
    .filter(Boolean)
    .join(", ") || undefined;

  return {
    found:     true,
    status:    rawStatus ? resolveStatus("cincinnati", rawStatus) : "UNKNOWN",
    rawStatus,
    address,
  };
}

// Pittsburgh — WPRDC CKAN datastore.
// `filters` passes the permit number as data, so no SQL escaping is needed.
async function checkPittsburgh(permitNumber: string): Promise<CheckResult> {
  const params = new URLSearchParams({
    resource_id: "f4d1177a-f597-4c32-8cbf-7885f56253f6",
    filters:     JSON.stringify({ permit_id: permitNumber.trim() }),
    limit:       "1",
  });
  const url = `https://data.wprdc.org/api/3/action/datastore_search?${params.toString()}`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Pittsburgh API ${res.status}`);

  const data = await res.json() as {
    success?: boolean;
    error?: { message?: string };
    result?: { records?: Record<string, string | null>[] };
  };

  // CKAN signals failure with success:false, not an HTTP error code.
  if (data.success === false) {
    throw new Error(`Pittsburgh API: ${data.error?.message ?? "unknown"}`);
  }

  const record = data.result?.records?.[0];
  if (!record) return { found: false };

  const rawStatus = (record.status ?? "").trim();

  return {
    found:     true,
    status:    rawStatus ? resolveStatus("pittsburgh", rawStatus) : "UNKNOWN",
    rawStatus,
    address:   (record.address ?? "").trim() || undefined,
  };
}

// Seattle — Socrata Open Data API (SDCI "Building Permits", 76t5-zqzr)
async function checkSeattle(permitNumber: string): Promise<CheckResult> {
  const url =
    "https://data.seattle.gov/resource/76t5-zqzr.json" +
    `?permitnum=${encodeURIComponent(permitNumber.trim())}&$limit=1`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Seattle API ${res.status}`);

  const rows = await res.json() as Array<Record<string, string>>;
  const row  = rows[0];
  if (!row) return { found: false };

  const rawStatus = (row.statuscurrent ?? "").trim();

  const address = [row.originaladdress1, row.originalcity, row.originalstate]
    .filter(Boolean)
    .join(", ") || undefined;

  return {
    found:     true,
    status:    rawStatus ? resolveStatus("seattle", rawStatus) : "UNKNOWN",
    rawStatus,
    address,
  };
}

// Detroit — two ArcGIS Feature Services (BSEED open data).
//
// The building-permits layer holds ISSUED permits only and has no status
// column; the plan-reviews layer holds the pre-issuance task state. Both are
// queried in parallel and the permits layer wins: a record there with an
// issued_date is issued, whatever earlier review stage the other layer shows.
// See scrapers/cities/detroit-mi.ts for the verification behind this.
async function checkDetroit(permitNumber: string): Promise<CheckResult> {
  const base     = "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services";
  const recordId = permitNumber.trim().toUpperCase();
  const where    = `record_id=${sqlQuote(recordId)}`;

  const query = async (
    layer: string,
    outFields: string,
    orderBy: string
  ): Promise<Record<string, string | null> | null> => {
    const params = new URLSearchParams({
      where,
      outFields,
      orderByFields:     orderBy,
      returnGeometry:    "false",
      resultRecordCount: "1",
      f:                 "json",
    });
    const res = await fetch(`${base}/${layer}/FeatureServer/0/query?${params.toString()}`, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) throw new Error(`Detroit API ${res.status}`);

    const data = await res.json() as {
      features?: { attributes?: Record<string, string | null> }[];
      error?: { message?: string };
    };

    // ArcGIS returns query errors with HTTP 200, so this must be checked
    // explicitly or a malformed query looks like "permit not found".
    if (data.error) throw new Error(`Detroit API: ${data.error.message ?? "unknown"}`);

    return data.features?.[0]?.attributes ?? null;
  };

  const [permit, review] = await Promise.all([
    query("bseed_building_permits",
          "record_id,issued_date,address", "issued_date DESC"),
    query("bseed_building_permit_plan_reviews",
          "record_id,task,task_status,address", "task_status_date DESC"),
  ]);

  if (!permit && !review) return { found: false };

  const addressOf = (a: Record<string, string | null> | null): string | undefined => {
    const street = (a?.address ?? "").trim();
    return street ? `${street}, Detroit, MI` : undefined;
  };

  const issuedDate = (permit?.issued_date ?? "").trim();
  if (permit && issuedDate) {
    return {
      found:     true,
      status:    resolveStatus("detroit", "Issued"),
      rawStatus: `Issued ${issuedDate}`,
      address:   addressOf(permit) ?? addressOf(review),
    };
  }

  const taskStatus = (review?.task_status ?? "").trim();
  const task       = (review?.task        ?? "").trim();
  // Surface the workflow stage alongside the status — "Plans Distribution /
  // Routed for Electronic Review" reads far better than the bare status.
  const rawStatus = task && taskStatus ? `${task} / ${taskStatus}` : taskStatus;

  return {
    found:     true,
    status:    taskStatus ? resolveStatus("detroit", taskStatus) : "UNKNOWN",
    rawStatus,
    address:   addressOf(review) ?? addressOf(permit),
  };
}

/**
 * City slug → checker. Every slug in LIVE_CHECKER_CITIES must appear here, or
 * the route would fall back to another city's dataset and report a confidently
 * wrong answer. The guard below enforces that at runtime.
 */
const CITY_CHECKERS: Record<string, (permitNumber: string) => Promise<CheckResult>> = {
  austin:       checkAustin,
  columbus:     checkColumbus,
  cleveland:    checkCleveland,
  cincinnati:   checkCincinnati,
  philadelphia: checkPhiladelphia,
  pittsburgh:   checkPittsburgh,
  seattle:      checkSeattle,
  detroit:      checkDetroit,
};

// ── City router ───────────────────────────────────────────────────────────────
//
// Every city in LIVE_CHECKER_CITIES has a checker above, each backed by a
// public API. The remaining city portals don't expose a usable status API —
// until they do, we surface an honest "coming soon" instead of pretending
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

  // A city can be marked live without a checker wired up only through an
  // editing mistake. Fail loudly rather than silently querying Austin's
  // dataset for a Columbus permit number.
  const checker = CITY_CHECKERS[city];
  if (!checker) {
    console.error(`[check-permit] no checker registered for live city "${city}"`);
    return NextResponse.json(
      { error: "Failed to check permit. Please try again." },
      { status: 500 }
    );
  }

  try {
    const result = await checker(permitNumber);

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
