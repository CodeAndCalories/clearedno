import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";

// CRON_SECRET must be set in environment and in GitHub Actions secrets
const CRON_SECRET = process.env.CRON_SECRET;
const FROM_EMAIL  = process.env.FROM_EMAIL ?? "leads@clearedno.com";
const BASE_URL    = "https://clearedno.com";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

function getNextMonday(): string {
  const d   = new Date();
  const day = d.getDay(); // 0=Sun … 6=Sat
  const diff = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + diff);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function buildEmailHtml(
  leads: Array<{
    county: string;
    state: string | null;
    event_type: string;
    lead_score: string;
    event_date: string;
  }>,
  weekLabel: string,
  totalLeadsInSystem: number
): string {
  const statesCovered = new Set(leads.map((l) => l.state).filter(Boolean)).size;
  const nextUpdate    = getNextMonday();
  const tableLeads    = leads.slice(0, 10);
  const overflow      = leads.length > 10 ? leads.length - 10 : 0;

  const scoreCell = (score: string) =>
    score === "hot"
      ? `<span style="display:inline-block;background:rgba(255,107,0,0.15);color:#ff6b00;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;font-weight:bold;padding:3px 8px;">HOT</span>`
      : `<span style="display:inline-block;background:rgba(234,179,8,0.15);color:#eab308;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;font-weight:bold;padding:3px 8px;">WARM</span>`;

  const rows = tableLeads
    .map(
      (l, i) => `
      <tr style="background:${i % 2 === 0 ? "#0f0f0f" : "#0a0a0a"};">
        <td style="padding:10px 14px;color:#f5f0e8;font-size:12px;font-family:monospace;border-bottom:1px solid #1a1a1a;">${l.county}</td>
        <td style="padding:10px 14px;color:#888;font-size:12px;font-family:monospace;border-bottom:1px solid #1a1a1a;">${l.state ?? "—"}</td>
        <td style="padding:10px 14px;color:#888;font-size:11px;font-family:monospace;text-transform:uppercase;border-bottom:1px solid #1a1a1a;">${l.event_type}</td>
        <td style="padding:10px 14px;font-family:monospace;border-bottom:1px solid #1a1a1a;">${scoreCell(l.lead_score)}</td>
        <td style="padding:10px 14px;color:#666;font-size:12px;font-family:monospace;border-bottom:1px solid #1a1a1a;">${formatDate(l.event_date)}</td>
      </tr>`
    )
    .join("");

  const overflowRow = overflow > 0
    ? `<tr><td colspan="5" style="padding:10px 14px;text-align:center;font-family:monospace;">
         <a href="${BASE_URL}/leads" style="color:#ff6b00;font-size:11px;text-decoration:none;letter-spacing:0.15em;text-transform:uppercase;">
           view all ${leads.length} leads →
         </a>
       </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your weekly roofing leads</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:monospace;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0a;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- ── Logo / Header ─────────────────────────────────────── -->
          <tr>
            <td style="padding-bottom:8px;">
              <p style="margin:0;color:#ff6b00;font-family:monospace;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;">
                CLEAREDNO
              </p>
            </td>
          </tr>
          <tr>
            <td style="border-bottom:1px solid #2a2a2a;padding-bottom:28px;margin-bottom:0;">
              <p style="margin:0 0 6px;color:#666;font-family:monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;">
                Roofing Leads Digest
              </p>
              <p style="margin:0;color:#555;font-family:monospace;font-size:11px;">${weekLabel}</p>
            </td>
          </tr>

          <!-- ── Hero ─────────────────────────────────────────────── -->
          <tr>
            <td style="padding:36px 0 32px;text-align:center;border-bottom:1px solid #1a1a1a;">
              <p style="margin:0 0 8px;color:#ff6b00;font-family:monospace;font-size:56px;font-weight:bold;line-height:1;">
                ${leads.length}
              </p>
              <p style="margin:0;color:#f5f0e8;font-family:monospace;font-size:14px;letter-spacing:0.25em;text-transform:uppercase;">
                new leads dropped this week
              </p>
            </td>
          </tr>

          <!-- ── Storm Events Table ────────────────────────────────── -->
          <tr>
            <td style="padding-top:28px;padding-bottom:8px;">
              <p style="margin:0 0 12px;color:#ff6b00;font-family:monospace;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;">
                Storm Events
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #1a1a1a;border-collapse:collapse;">
                <thead>
                  <tr style="background:#111;border-bottom:1px solid #2a2a2a;">
                    <th style="text-align:left;padding:10px 14px;color:#ff6b00;font-family:monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;font-weight:normal;">County</th>
                    <th style="text-align:left;padding:10px 14px;color:#ff6b00;font-family:monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;font-weight:normal;">State</th>
                    <th style="text-align:left;padding:10px 14px;color:#ff6b00;font-family:monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;font-weight:normal;">Type</th>
                    <th style="text-align:left;padding:10px 14px;color:#ff6b00;font-family:monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;font-weight:normal;">Score</th>
                    <th style="text-align:left;padding:10px 14px;color:#ff6b00;font-family:monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;font-weight:normal;">Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                  ${overflowRow}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- ── Stats Row ─────────────────────────────────────────── -->
          <tr>
            <td style="padding:28px 0;border-top:1px solid #1a1a1a;border-bottom:1px solid #1a1a1a;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33%" style="text-align:center;padding:0 8px;">
                    <p style="margin:0 0 4px;color:#ff6b00;font-family:monospace;font-size:22px;font-weight:bold;">
                      ${totalLeadsInSystem.toLocaleString()}
                    </p>
                    <p style="margin:0;color:#555;font-family:monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;">
                      Total leads in system
                    </p>
                  </td>
                  <td width="33%" style="text-align:center;padding:0 8px;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
                    <p style="margin:0 0 4px;color:#ff6b00;font-family:monospace;font-size:22px;font-weight:bold;">
                      ${statesCovered}
                    </p>
                    <p style="margin:0;color:#555;font-family:monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;">
                      States covered
                    </p>
                  </td>
                  <td width="33%" style="text-align:center;padding:0 8px;">
                    <p style="margin:0 0 4px;color:#f5f0e8;font-family:monospace;font-size:14px;font-weight:bold;">
                      ${nextUpdate}
                    </p>
                    <p style="margin:0;color:#555;font-family:monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;">
                      Next update
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── CTA Button ────────────────────────────────────────── -->
          <tr>
            <td style="padding:40px 0;text-align:center;">
              <a href="${BASE_URL}/leads"
                 style="display:inline-block;background:#ff6b00;color:#0a0a0a;font-family:monospace;font-size:13px;font-weight:bold;letter-spacing:0.2em;text-transform:uppercase;padding:16px 40px;text-decoration:none;">
                Open your dashboard →
              </a>
            </td>
          </tr>

          <!-- ── Footer ───────────────────────────────────────────── -->
          <tr>
            <td style="border-top:1px solid #1a1a1a;padding-top:24px;text-align:center;">
              <p style="margin:0 0 10px;color:#333;font-family:monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;">
                clearedno.com
              </p>
              <p style="margin:0;font-family:monospace;font-size:10px;">
                <a href="${BASE_URL}/account" style="color:#444;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;">Manage subscription</a>
                &nbsp;·&nbsp;
                <a href="${BASE_URL}/account" style="color:#444;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export async function POST(req: NextRequest) {
  // ── Auth check ──────────────────────────────────────────────────────────
  const authHeader = req.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now     = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekLabel = `Week of ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

    // ── Fetch leads from last 7 days + total system count ─────────────────
    const [leadsRes, totalCountRes] = await Promise.all([
      supabaseAdmin
        .from("roofing_leads")
        .select("county, state, event_type, lead_score, event_date")
        .not("event_date", "is", null)
        .gte("event_date", weekAgo.toISOString().split("T")[0])
        .order("lead_score", { ascending: true }) // hot first
        .order("event_date", { ascending: false }),
      supabaseAdmin
        .from("roofing_leads")
        .select("id", { count: "exact", head: true }),
    ]);

    const { data: leads, error: leadsError } = leadsRes;
    const totalLeadsInSystem = totalCountRes.count ?? 0;

    if (leadsError) throw leadsError;
    if (!leads || leads.length === 0) {
      console.log("[digest] No new leads this week — skipping emails");
      return NextResponse.json({ sent: 0, leads: 0 });
    }

    // ── Fetch active subscribers ───────────────────────────────────────────
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, email_digest_enabled, leads_subscription_status")
      .eq("email_digest_enabled", true)
      .eq("leads_subscription_status", "active");

    if (profilesError) throw profilesError;
    if (!profiles || profiles.length === 0) {
      console.log("[digest] No active subscribers with digest enabled");
      return NextResponse.json({ sent: 0, leads: leads.length });
    }

    // ── Send one email per subscriber ──────────────────────────────────────
    const subject  = `Your weekly roofing leads — ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
    const html     = buildEmailHtml(leads, weekLabel, totalLeadsInSystem);

    let sent = 0;
    for (const profile of profiles) {
      if (!profile.email) continue;
      const { error: sendError } = await resend.emails.send({
        from:    FROM_EMAIL,
        to:      profile.email,
        subject,
        html,
      });
      if (sendError) {
        console.error(`[digest] Failed to send to ${profile.email}:`, sendError);
      } else {
        sent++;
      }
    }

    console.log(`[digest] Sent ${sent} / ${profiles.length} emails — ${leads.length} leads this week`);
    return NextResponse.json({ sent, leads: leads.length, subscribers: profiles.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[digest] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
