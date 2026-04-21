import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";

const CRON_SECRET = process.env.CRON_SECRET;
const FROM_EMAIL  = process.env.OUTREACH_FROM_EMAIL ?? "outreach@clearedno.com";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildOutreachText(city: string): string {
  return `Hi there,

I run a data service called ClearedNo that pulls weekly hail and wind damage leads for roofing contractors in the Midwest.

Here's what's in the dashboard:

- Weekly NOAA updates so you're the first on the doorstep after a storm hits
- 285,000+ property records with owner name, mailing address, and year built — so you know exactly who to call or mail
- Hot/warm lead scoring, CSV export, and print-ready canvassing sheets covering OH, IN, MI, KY, IL, and PA

I attached a sample CSV of 50 real Franklin County, Ohio properties — owner names, addresses, year built. This is exactly what you'd get every week.

Flat $300/month. No per-lead fees. No competing bids.
30-day money-back guarantee.

See the full dashboard at clearedno.com/leads — or just reply here if you want me to pull a specific county for you to check out.

ClearedNo

---
You're receiving this email because your business was found via public business listings as a roofing contractor serving the Midwest.

To unsubscribe, reply with "unsubscribe" in the subject line and you will be removed within 10 business days.

ClearedNo | 1179 W Miner Rd, Cleveland, OH 44109
clearedno.com`;
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: leads, error } = await supabaseAdmin
      .from("outreach_leads")
      .select("id, email, city, state")
      .eq("outreach_sent", false)
      .eq("unsubscribed", false)
      .not("email", "is", null)
      .limit(25);

    if (error) throw error;
    if (!leads || leads.length === 0) {
      console.log("[outreach-send] No unsent leads found");
      return NextResponse.json({ sent: 0 });
    }

    let sent = 0;
    for (const lead of leads) {
      if (!lead.email) continue;

      const city = lead.city ?? "your area";
      const subject = `Updated: ${city} Hail Event Data + 50 Lead Sample`;

      const { error: sendError } = await resend.emails.send({
        from:    FROM_EMAIL,
        to:      lead.email,
        subject,
        text:    buildOutreachText(city),
      });

      if (sendError) {
        console.error(`[outreach-send] Failed to send to ${lead.email}:`, sendError);
        continue;
      }

      const { error: updateError } = await supabaseAdmin
        .from("outreach_leads")
        .update({ outreach_sent: true, outreach_sent_at: new Date().toISOString() })
        .eq("id", lead.id);

      if (updateError) {
        console.error(`[outreach-send] Failed to mark sent for ${lead.id}:`, updateError);
      } else {
        console.log(`[outreach-send] Sent to ${lead.email} (${city})`);
        sent++;
      }
    }

    console.log(`[outreach-send] Done — sent ${sent} / ${leads.length}`);
    return NextResponse.json({ sent });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[outreach-send] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
