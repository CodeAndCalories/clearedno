import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";

const CRON_SECRET = process.env.CRON_SECRET ?? "leads_cron_secret_2026";
const FROM_EMAIL  = process.env.OUTREACH_FROM_EMAIL ?? "outreach@clearedno.com";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildFollowupText(city: string, state: string): string {
  return `Hi there,

Just following up on the note I sent last week about storm damage leads in ${city}, ${state}.

If you're hitting storm season and want to see which streets got hit and who owns the houses — happy to pull a specific county sample for you.

Just reply and let me know which county.

ClearedNo

---
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
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();

    const { data: leads, error } = await supabaseAdmin
      .from("outreach_leads")
      .select("id, email, city, state")
      .eq("outreach_sent", true)
      .eq("outreach_followup_sent", false)
      .eq("unsubscribed", false)
      .not("email", "is", null)
      .lt("outreach_sent_at", fiveDaysAgo)
      .limit(25);

    if (error) throw error;
    if (!leads || leads.length === 0) {
      console.log("[outreach-followup] No follow-up candidates found");
      return NextResponse.json({ sent: 0 });
    }

    let sent = 0;
    for (const lead of leads) {
      if (!lead.email) continue;

      const city  = lead.city  ?? "your area";
      const state = lead.state ?? "";
      const subject = `Re: ${city} roofing leads — quick follow up`;

      const { error: sendError } = await resend.emails.send({
        from:    FROM_EMAIL,
        to:      lead.email,
        subject,
        text:    buildFollowupText(city, state),
      });

      if (sendError) {
        console.error(`[outreach-followup] Failed to send to ${lead.email}:`, sendError);
        continue;
      }

      const { error: updateError } = await supabaseAdmin
        .from("outreach_leads")
        .update({
          outreach_followup_sent:    true,
          outreach_followup_sent_at: new Date().toISOString(),
        })
        .eq("id", lead.id);

      if (updateError) {
        console.error(`[outreach-followup] Failed to mark followup sent for ${lead.id}:`, updateError);
      } else {
        console.log(`[outreach-followup] Sent to ${lead.email} (${city}, ${state})`);
        sent++;
      }
    }

    console.log(`[outreach-followup] Done — sent ${sent} / ${leads.length}`);
    return NextResponse.json({ sent });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[outreach-followup] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
