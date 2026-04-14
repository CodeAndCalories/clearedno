import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";

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

function buildAlertHtml(lead: {
  county: string;
  state: string | null;
  event_type: string;
  lead_score: string;
  event_date: string;
  magnitude?: number | null;
}): string {
  const scoreColor = lead.lead_score === "hot" ? "#ff6b00" : "#eab308";
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:monospace;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

    <p style="color:#ff6b00;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px;">
      ClearedNo / Storm Alert
    </p>
    <h1 style="color:#f5f0e8;font-size:26px;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 24px;">
      Storm alert — ${lead.county}, ${lead.state ?? ""}
    </h1>

    <div style="border:1px solid #2a2a2a;padding:24px;margin-bottom:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;width:40%;">County</td>
          <td style="padding:8px 0;color:#f5f0e8;font-size:13px;">${lead.county}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;">State</td>
          <td style="padding:8px 0;color:#f5f0e8;font-size:13px;">${lead.state ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;">Event Type</td>
          <td style="padding:8px 0;color:#f5f0e8;font-size:13px;text-transform:uppercase;">${lead.event_type}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;">Score</td>
          <td style="padding:8px 0;font-size:13px;font-weight:bold;text-transform:uppercase;color:${scoreColor};">${lead.lead_score}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;">Date</td>
          <td style="padding:8px 0;color:#f5f0e8;font-size:13px;">${formatDate(lead.event_date)}</td>
        </tr>
        ${
          lead.magnitude != null
            ? `<tr>
                <td style="padding:8px 0;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;">Magnitude</td>
                <td style="padding:8px 0;color:#ff6b00;font-size:13px;">${lead.magnitude.toFixed(2)}&quot;</td>
               </tr>`
            : ""
        }
      </table>
    </div>

    <div style="text-align:center;margin:0 0 32px;">
      <a href="${BASE_URL}/leads"
         style="display:inline-block;background:#ff6b00;color:#0a0a0a;font-family:monospace;font-size:13px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;padding:14px 32px;text-decoration:none;">
        View Dashboard →
      </a>
    </div>

    <div style="border-top:1px solid #1a1a1a;padding-top:16px;text-align:center;">
      <a href="${BASE_URL}/leads/alerts"
         style="color:#444;font-size:10px;text-decoration:none;letter-spacing:0.15em;text-transform:uppercase;">
        Manage county alerts →
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
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // ── Recent storm leads ─────────────────────────────────────────────────
    const { data: recentLeads, error: leadsError } = await supabaseAdmin
      .from("roofing_leads")
      .select("county, state, event_type, lead_score, event_date, magnitude")
      .not("event_date", "is", null)
      .gte("event_date", weekAgo.toISOString().split("T")[0]);

    if (leadsError) throw leadsError;
    if (!recentLeads || recentLeads.length === 0) {
      return NextResponse.json({ sent: 0, message: "No recent leads" });
    }

    // ── All county alerts with profile emails ──────────────────────────────
    const { data: alerts, error: alertsError } = await supabaseAdmin
      .from("lead_alerts")
      .select("user_id, county, state, profiles(email, leads_subscription_status)");

    if (alertsError) throw alertsError;
    if (!alerts || alerts.length === 0) {
      return NextResponse.json({ sent: 0, message: "No alerts configured" });
    }

    // ── Match leads to alerts and send ────────────────────────────────────
    let sent = 0;

    for (const lead of recentLeads) {
      const matchedAlerts = alerts.filter(
        (a) =>
          a.county.toLowerCase() === lead.county.toLowerCase() &&
          (a.state ?? "").toUpperCase() === (lead.state ?? "").toUpperCase()
      );

      for (const alert of matchedAlerts) {
        const profile = Array.isArray(alert.profiles) ? alert.profiles[0] : alert.profiles;
        if (!profile?.email) continue;
        if (profile.leads_subscription_status !== "active") continue;

        const { error: sendError } = await resend.emails.send({
          from:    FROM_EMAIL,
          to:      profile.email,
          subject: `Storm alert — ${lead.county}, ${lead.state ?? ""} got hit`,
          html:    buildAlertHtml(lead),
        });

        if (sendError) {
          console.error(`[notify-alerts] Failed for ${profile.email}:`, sendError);
        } else {
          sent++;
          console.log(`[notify-alerts] Sent alert to ${profile.email} for ${lead.county}, ${lead.state}`);
        }
      }
    }

    console.log(`[notify-alerts] Done — ${sent} alert emails sent`);
    return NextResponse.json({ sent, leads: recentLeads.length, alerts: alerts.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[notify-alerts] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
