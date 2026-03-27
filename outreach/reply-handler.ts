// Reply handler — classifies inbound email replies using Claude.
// Wire to Resend inbound webhook at: app/api/outreach/reply/route.ts
//
// On INTERESTED  → update lead status → alert admin with context
// On QUESTION    → draft suggested reply → alert admin
// On NOT_INTERESTED → mark do_not_contact
// On OUT_OF_OFFICE → no action (schedule follow-up manually)

import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "../lib/supabase/admin";
import { sendAdminAlert } from "../lib/email";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type ReplyIntent =
  | "interested"
  | "not_interested"
  | "question"
  | "out_of_office"
  | "unclassified";

export interface ClassifiedReply {
  intent:          ReplyIntent;
  confidence:      "high" | "medium" | "low";
  suggestedAction: string;
  summary:         string;
}

// ── Classifier ────────────────────────────────────────────────────────────────

export async function classifyReply(
  fromEmail: string,
  subject: string,
  body: string
): Promise<ClassifiedReply> {
  const message = await client.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: `You classify cold email replies for ClearedNo (permit monitoring SaaS for contractors).
Classify into: interested, not_interested, question, out_of_office, unclassified.
Return JSON only: { "intent": "...", "confidence": "high|medium|low", "suggestedAction": "...", "summary": "..." }`,
    messages: [
      {
        role: "user",
        content: `From: ${fromEmail}\nSubject: ${subject}\n\n${body.slice(0, 500)}`,
      },
    ],
  });

  const raw     = message.content[0].type === "text" ? message.content[0].text : "{}";
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as ClassifiedReply;
}

// ── Webhook handler ───────────────────────────────────────────────────────────

export async function handleInboundWebhook(payload: {
  from: string;
  subject: string;
  text: string;
}) {
  const classified = await classifyReply(payload.from, payload.subject, payload.text);

  console.log(
    `[ReplyHandler] ${payload.from} → ${classified.intent} (${classified.confidence}) — ${classified.summary}`
  );

  // Look up the lead by email address
  const { data: lead } = await supabaseAdmin
    .from("outreach_leads")
    .select("id, business_name, city, state, contractor_type, status")
    .ilike("email", payload.from)
    .maybeSingle();

  switch (classified.intent) {
    case "interested": {
      // Update lead to 'replied', flag reply_received
      if (lead) {
        await supabaseAdmin
          .from("outreach_leads")
          .update({ status: "replied", reply_received: true })
          .eq("id", lead.id);
      }

      // Notify admin immediately
      await sendAdminAlert({
        subject: `INTERESTED reply from ${payload.from}`,
        message: [
          `Outreach reply classified as INTERESTED.`,
          ``,
          `From:     ${payload.from}`,
          `Subject:  ${payload.subject}`,
          `Lead:     ${lead ? `${lead.business_name} (${lead.city}, ${lead.state} — ${lead.contractor_type})` : "(not found in leads table)"}`,
          ``,
          `Their message:`,
          `─────────────────────────────`,
          payload.text.slice(0, 600),
          `─────────────────────────────`,
          ``,
          `Suggested action: ${classified.suggestedAction}`,
          ``,
          `Reply to them with the signup link:`,
          `${process.env.NEXT_PUBLIC_URL ?? "https://www.clearedno.com"}/signup`,
        ].join("\n"),
      });
      break;
    }

    case "question": {
      // Update status to 'replied' — they engaged
      if (lead) {
        await supabaseAdmin
          .from("outreach_leads")
          .update({ status: "replied", reply_received: true })
          .eq("id", lead.id);
      }

      // Generate a suggested reply and send to admin
      let suggestedReply = "";
      try {
        suggestedReply = await draftReplyToQuestion(
          lead?.business_name ?? payload.from,
          lead?.city ?? "",
          payload.text
        );
      } catch {
        suggestedReply = "(Claude failed to draft a reply — respond manually)";
      }

      await sendAdminAlert({
        subject: `QUESTION from ${payload.from} — reply needed`,
        message: [
          `Outreach reply classified as QUESTION.`,
          ``,
          `From:    ${payload.from}`,
          `Subject: ${payload.subject}`,
          `Lead:    ${lead ? `${lead.business_name} (${lead.city}, ${lead.state})` : "(unknown)"}`,
          ``,
          `Their question:`,
          `─────────────────────────────`,
          payload.text.slice(0, 600),
          `─────────────────────────────`,
          ``,
          `Suggested reply:`,
          `─────────────────────────────`,
          suggestedReply,
          `─────────────────────────────`,
        ].join("\n"),
      });
      break;
    }

    case "not_interested": {
      if (lead) {
        await supabaseAdmin
          .from("outreach_leads")
          .update({ status: "do_not_contact", reply_received: true })
          .eq("id", lead.id);
      }
      console.log(`[ReplyHandler] Marked ${payload.from} as do_not_contact`);
      break;
    }

    case "out_of_office": {
      // No action — they'll be back. Don't mark do_not_contact.
      console.log(`[ReplyHandler] Out of office from ${payload.from} — no action`);
      break;
    }

    default: {
      console.log(`[ReplyHandler] Unclassified reply from ${payload.from}`);
    }
  }

  return classified;
}

// ── Draft reply to a question ─────────────────────────────────────────────────

async function draftReplyToQuestion(
  name: string,
  city: string,
  question: string
): Promise<string> {
  const message = await client.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: `You help the founder of ClearedNo (a permit monitoring SaaS) draft short, honest replies to contractor questions.
ClearedNo monitors building permit statuses 24/7 and emails contractors the moment status changes.
Price: $79/month. 14-day free trial. Currently supports Austin TX and Dallas TX.
Keep replies under 80 words. Friendly but direct. No marketing fluff.`,
    messages: [
      {
        role: "user",
        content: `Name: ${name}\nCity: ${city}\nTheir question: ${question.slice(0, 400)}`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}
