import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// 10 real Franklin County, OH property records from the clearedno database.
const SAMPLE_ROWS: string[][] = [
  ["8970 OPOSSUM RUN RD",  "BALL JEFFREY A",      "PO BOX 9202 COPPELL TX 75019-9208",        "1994", "Franklin", "OH"],
  ["8896 OPOSSUM RUN RD",  "CLEVINGER CHERIE D",  "PO BOX 9202 COPPELL TX 75019-9208",        "1997", "Franklin", "OH"],
  ["8924 OPOSSUM RUN RD",  "CASH SHARON J",       "8924 OPOSSUM RUN RD LONDON OH 43140-9438", "1992", "Franklin", "OH"],
  ["8950 OPOSSUM RUN RD",  "QUEEN DONALD R",      "PO BOX 9202 COPPELL TX 75019-9208",        "1993", "Franklin", "OH"],
  ["8852 OPOSSUM RUN RD",  "WILLIAMS THOMAS M",   "8852 OPOSSUM RUN RD LONDON OH 43140-9438", "1992", "Franklin", "OH"],
  ["9027 CHAMBERLIN RD",   "CANADAY WILLIAM R",   "PO BOX 9202 COPPELL TX 75019-9208",        "1986", "Franklin", "OH"],
  ["9023 CHAMBERLIN RD",   "MCCORMICK CARSON",    "9023 CHAMBERLIN RD LONDON OH 43140-9667",  "1986", "Franklin", "OH"],
  ["8835 CHAMBERLIN RD",   "GREEN JOE L",         "8835 CHAMBERLIN RD LONDON OH 43140-9667",  "1978", "Franklin", "OH"],
  ["7025 BIGGERT RD",      "CATLETT NICHOLAS M",  "8805 GOVERNORS HILL DR CINCINNATI OH 45249-3314", "1978", "Franklin", "OH"],
  ["7041 BIGGERT RD",      "TAKAYAMA JOE",        "7041 BIGGERT RD LONDON OH 43140-9432",     "1979", "Franklin", "OH"],
];

const CSV_HEADER = "address,owner_name,owner_mailing_address,year_built,county,state";

function csvEscape(v: string): string {
  return `"${v.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : (req.headers.get("x-real-ip") ?? "unknown");

  // Rate-limit: one download per IP per 24 hours.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: existing } = await supabaseAdmin
    .from("sample_downloads")
    .select("id")
    .eq("ip_address", ip)
    .gte("downloaded_at", since)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "You've already downloaded the sample. Sign up for full access." },
      { status: 429 }
    );
  }

  await supabaseAdmin.from("sample_downloads").insert({ ip_address: ip });

  const lines = [
    CSV_HEADER,
    ...SAMPLE_ROWS.map((row) => row.map(csvEscape).join(",")),
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="clearedno-sample-franklin-county.csv"',
    },
  });
}
