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

function buildEmailHtml(
  leads: Array<{
    county: string;
    state: string | null;
    event_type: string;
    lead_score: string;
    event_date: string;
  }>,
  weekLabel: string
): string {
  const hot  = leads.filter((l) => l.lead_score === "hot").length;
  const warm = leads.filter((l) => l.lead_score === "warm").length;

  const rows = leads
    .slice(0, 50) // cap at 50 rows in email
    .map(
      (l) => `
      <tr style="border-bottom:1px solid #1a1a1a;">
        <td style="padding:8px 12px;color:#a0a0a0;font-size:12px;">${l.state ?? "—"}</td>
        <td style="padding:8px 12px;color:#f5f0e8;font-size:12px;">${l.county}</td>
        <td style="padding:8px 12px;color:#a0a0a0;font-size:12px;text-transform:uppercase;">${l.event_type}</td>
        <td style="padding:8px 12px;font-size:12px;">
          <span style="color:${l.lead_score === "hot" ? "#ff6b00" : "#eab308"};text-transform:uppercase;font-weight:bold;">
            ${l.lead_score}
          </span>
        </td>
        <td style="padding:8px 12px;color:#a0a0a0;font-size:12px;">${formatDate(l.event_date)}</td>
      </tr>`
    )
    .join("");

  const overflow =
    leads.length > 50
      ? `<p style="color:#666;font-size:11px;text-align:center;margin-top:8px;">
           + ${leads.length - 50} more leads in the dashboard
         </p>`
      : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:monospace;">
  <div style="max-width:640px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="border-bottom:1px solid #2a2a2a;padding-bottom:24px;margin-bottom:32px;">
      <p style="color:#ff6b00;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px;">
        ClearedNo / Roofing Leads
      </p>
      <h1 style="color:#f5f0e8;font-size:28px;letter-spacing:0.1em;text-transform:uppercase;margin:0;">
        New leads this week
      </h1>
      <p style="color:#555;font-size:12px;margin:8px 0 0;">${weekLabel}</p>
    </div>

    <!-- Summary -->
    <div style="display:flex;gap:24px;margin-bottom:32px;">
      <div style="flex:1;border:1px solid #2a2a2a;padding:16px;">
        <p style="color:#666;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 4px;">Hot Leads</p>
        <p style="color:#ff6b00;font-size:32px;font-weight:bold;margin:0;">${hot}</p>
        <p style="color:#444;font-size:9px;text-transform:uppercase;margin:4px 0 0;">1&quot;+ hailstone</p>
      </div>
      <div style="flex:1;border:1px solid #2a2a2a;padding:16px;">
        <p style="color:#666;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 4px;">Warm Leads</p>
        <p style="color:#eab308;font-size:32px;font-weight:bold;margin:0;">${warm}</p>
        <p style="color:#444;font-size:9px;text-transform:uppercase;margin:4px 0 0;">under 1&quot; hail</p>
      </div>
      <div style="flex:1;border:1px solid #2a2a2a;padding:16px;">
        <p style="color:#666;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 4px;">Total</p>
        <p style="color:#f5f0e8;font-size:32px;font-weight:bold;margin:0;">${leads.length}</p>
        <p style="color:#444;font-size:9px;text-transform:uppercase;margin:4px 0 0;">this week</p>
      </div>
    </div>

    <!-- Table -->
    <table style="width:100%;border-collapse:collapse;border:1px solid #1a1a1a;margin-bottom:8px;">
      <thead>
        <tr style="border-bottom:1px solid #2a2a2a;background:#111;">
          <th style="text-align:left;padding:8px 12px;color:#ff6b00;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;font-weight:normal;">State</th>
          <th style="text-align:left;padding:8px 12px;color:#ff6b00;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;font-weight:normal;">County</th>
          <th style="text-align:left;padding:8px 12px;color:#ff6b00;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;font-weight:normal;">Type</th>
          <th style="text-align:left;padding:8px 12px;color:#ff6b00;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;font-weight:normal;">Score</th>
          <th style="text-align:left;padding:8px 12px;color:#ff6b00;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;font-weight:normal;">Date</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    ${overflow}

    <!-- CTA -->
    <div style="text-align:center;margin:40px 0;">
      <a href="${BASE_URL}/leads"
         style="display:inline-block;background:#ff6b00;color:#0a0a0a;font-family:monospace;font-size:13px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;padding:14px 32px;text-decoration:none;">
        View Full Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #1a1a1a;padding-top:20px;text-align:center;">
      <p style="color:#333;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">
        ${hot} hot leads · ${warm} warm leads this week
      </p>
      <a href="${BASE_URL}/leads"
         style="color:#555;font-size:10px;text-decoration:none;letter-spacing:0.15em;text-transform:uppercase;">
        Manage your subscription →
      </a>
    </div>

  </div>
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

    // ── Fetch leads from last 7 days ───────────────────────────────────────
    const { data: leads, error: leadsError } = await supabaseAdmin
      .from("roofing_leads")
      .select("county, state, event_type, lead_score, event_date")
      .not("event_date", "is", null)
      .gte("event_date", weekAgo.toISOString().split("T")[0])
      .order("lead_score", { ascending: true }) // hot first
      .order("event_date", { ascending: false });

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
    const html     = buildEmailHtml(leads, weekLabel);

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
