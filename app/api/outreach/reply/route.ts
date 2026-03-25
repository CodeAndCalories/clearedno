// POST /api/outreach/reply
// Resend inbound webhook — receives replies to cold emails and classifies them.
// Configure in Resend: https://resend.com/docs/send/with-inbound-emails
import { NextRequest, NextResponse } from "next/server";
import { handleInboundWebhook } from "@/outreach/reply-handler";

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    from?: string;
    subject?: string;
    text?: string;
  };

  if (!body.from || !body.text) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const classified = await handleInboundWebhook({
    from: body.from,
    subject: body.subject ?? "(no subject)",
    text: body.text,
  });

  return NextResponse.json({ ok: true, intent: classified.intent });
}
