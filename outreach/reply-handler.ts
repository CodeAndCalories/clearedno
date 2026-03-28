// reply-handler.ts — classifies inbound email replies and auto-responds.
//
// Wire to an inbound email webhook at: app/api/outreach/reply/route.ts
//
// First reply from a lead:
//   INTERESTED    → auto-reply with signup link + FOUNDING49 → mark auto_replied = true
//   QUESTION      → Claude answers question → auto-send → mark auto_replied = true
//   NOT_INTERESTED → polite one-liner → mark do_not_contact
//   OUT_OF_OFFICE  → no reply → set follow_up_after = now + 7 days
//
// Subsequent replies (auto_replied = true):
//   → Admin alert only — no further auto-replies. Human takes over.

import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "../lib/supabase/admin";
import { sendAdminAlert } from "../lib/email";
import { sendSingleEmail } from "./sender";

const client      = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SENDER_NAME = process.env.FROM_NAME?.split(" ")[0] ?? "Alex";
const BASE_URL    = process.env.NEXT_PUBLIC_URL ?? "https://www.clearedno.com";

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
  subject:   string,
  body:      string
): Promise<ClassifiedReply> {
  const message = await client.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: `You classify cold email replies for ClearedNo (permit monitoring SaaS for contractors).
Classify into: interested, not_interested, question, out_of_office, unclassified.
Return JSON only: { "intent": "...", "confidence": "high|medium|low", "suggestedAction": "...", "summary": "..." }`,
    messages: [
      {
        role:    "user",
        content: `From: ${fromEmail}\nSubject: ${subject}\n\n${body.slice(0, 500)}`,
      },
    ],
  });

  const raw     = message.content[0].type === "text" ? message.content[0].text : "{}";
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as ClassifiedReply;
}

// ── Auto-reply builders ───────────────────────────────────────────────────────

function buildInterestedReply(firstName: string, originalSubject: string) {
  return {
    subject: `Re: ${originalSubject}`,
    text: [
      `Hey ${firstName},`,
      ``,
      `Great to hear from you. Here's everything you need:`,
      ``,
      `→ ${BASE_URL}`,
      `→ Use code FOUNDING49 at checkout`,
      `→ First month $49, then $79/mo locked in`,
      ``,
      `Takes about 2 minutes to set up. Let me know if you have any questions.`,
      ``,
      SENDER_NAME,
    ].join("\n"),
  };
}

function buildNotInterestedReply(originalSubject: string) {
  return {
    subject: `Re: ${originalSubject}`,
    text: `No problem at all. Good luck with your projects.\n\n${SENDER_NAME}`,
  };
}

async function buildQuestionReply(
  name:            string,
  city:            string,
  question:        string,
  originalSubject: string
): Promise<{ subject: string; text: string }> {
  const message = await client.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: `You help ${SENDER_NAME}, founder of ClearedNo, write short direct replies to contractor questions.

ClearedNo facts (use only what's relevant):
- Monitors building permit statuses 24/7 — Austin TX and Dallas TX currently
- Checks every 2 hours, emails instantly on any status change
- Tracks building, electrical, plumbing, mechanical permits
- $79/mo, first month $49 with code FOUNDING49
- 14-day free trial included, cancel anytime
- Adding new cities weekly — users can request at clearedno.com/suggest-city

Rules:
- Under 80 words
- Plain text, no emojis, no bullet points
- Answer their specific question directly — don't pad
- End with: "Let me know if you have other questions. ${SENDER_NAME}"
- Do not include a subject line — return plain body text only`,
    messages: [
      {
        role:    "user",
        content: `Name: ${name}\nCity: ${city}\nTheir question: ${question.slice(0, 400)}`,
      },
    ],
  });

  const body = message.content[0].type === "text" ? message.content[0].text : "";
  return { subject: `Re: ${originalSubject}`, text: body };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractFirstName(businessName: string | undefined, email: string): string {
  if (businessName) {
    const first = businessName.split(/[\s,]+/)[0];
    if (first && first.length > 1 && first.length < 20) return first;
  }
  const local = email.split("@")[0].split(/[._-]/)[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

/** Marks the lead as auto_replied and updates status/reply_received. */
async function markAutoReplied(leadId: string, status: string) {
  await supabaseAdmin
    .from("outreach_leads")
    .update({ status, reply_received: true, auto_replied: true })
    .eq("id", leadId);
}

// ── Main webhook handler ──────────────────────────────────────────────────────

export async function handleInboundWebhook(payload: {
  from:    string;
  subject: string;
  text:    string;
}) {
  const classified = await classifyReply(payload.from, payload.subject, payload.text);

  console.log(
    `[ReplyHandler] ${payload.from} → ${classified.intent} (${classified.confidence}) — ${classified.summary}`
  );

  // Fetch lead — include auto_replied flag
  const { data: lead } = await supabaseAdmin
    .from("outreach_leads")
    .select("id, business_name, city, state, contractor_type, status, auto_replied")
    .ilike("email", payload.from)
    .maybeSingle();

  const firstName = extractFirstName(lead?.business_name, payload.from);

  // ── Guard: already auto-replied once → hand off to admin, no more auto-replies
  if (lead?.auto_replied) {
    console.log(`[ReplyHandler] ${payload.from} already received auto-reply — forwarding to admin`);
    await sendAdminAlert({
      subject: `Follow-up from ${payload.from} — handle manually`,
      message: [
        `This lead already received an auto-reply. Respond manually.`,
        ``,
        `From:   ${payload.from}`,
        `Lead:   ${lead.business_name} (${lead.city}, ${lead.state})`,
        `Status: ${lead.status}`,
        ``,
        `Their message:`,
        payload.text.slice(0, 600),
      ].join("\n"),
    });
    return classified;
  }

  switch (classified.intent) {

    // ── INTERESTED ────────────────────────────────────────────────────────────
    case "interested": {
      const reply = buildInterestedReply(firstName, payload.subject);
      const sent  = await sendSingleEmail({ to: payload.from, ...reply });

      if (sent && lead) await markAutoReplied(lead.id, "replied");

      console.log(`[ReplyHandler] ${sent ? "✓" : "✗"} Auto-replied INTERESTED to ${payload.from}`);

      await sendAdminAlert({
        subject: `INTERESTED reply from ${payload.from}`,
        message: [
          `Outreach reply: INTERESTED`,
          ``,
          `From:   ${payload.from}`,
          `Lead:   ${lead ? `${lead.business_name} (${lead.city}, ${lead.state})` : "(not found)"}`,
          ``,
          `Their message:`,
          payload.text.slice(0, 600),
          ``,
          `Auto-reply sent: ${sent ? "YES" : "FAILED — send manually"}`,
        ].join("\n"),
      });
      break;
    }

    // ── QUESTION ──────────────────────────────────────────────────────────────
    case "question": {
      let reply: { subject: string; text: string };
      try {
        reply = await buildQuestionReply(
          lead?.business_name ?? firstName,
          lead?.city ?? "",
          payload.text,
          payload.subject
        );
      } catch {
        await sendAdminAlert({
          subject: `QUESTION from ${payload.from} — reply manually`,
          message: [
            `Auto-reply generation failed. Reply manually.`,
            ``,
            `From: ${payload.from}`,
            `Lead: ${lead ? `${lead.business_name} (${lead.city}, ${lead.state})` : "(unknown)"}`,
            ``,
            `Their question:`,
            payload.text.slice(0, 600),
          ].join("\n"),
        });
        break;
      }

      const sent = await sendSingleEmail({ to: payload.from, ...reply });
      if (sent && lead) await markAutoReplied(lead.id, "replied");

      console.log(`[ReplyHandler] Auto-replied to question from ${payload.from} — sent: ${sent}`);

      await sendAdminAlert({
        subject: `QUESTION auto-replied → ${payload.from}`,
        message: [
          `Auto-reply sent to question.`,
          `From: ${payload.from}`,
          ``,
          `Their question:`,
          payload.text.slice(0, 400),
          ``,
          `Our reply:`,
          reply.text,
          ``,
          `Sent: ${sent ? "YES" : "FAILED"}`,
        ].join("\n"),
      });
      break;
    }

    // ── NOT INTERESTED ────────────────────────────────────────────────────────
    case "not_interested": {
      const reply = buildNotInterestedReply(payload.subject);
      const sent  = await sendSingleEmail({ to: payload.from, ...reply });

      if (lead) {
        await supabaseAdmin
          .from("outreach_leads")
          .update({ status: "do_not_contact", reply_received: true, auto_replied: true })
          .eq("id", lead.id);
      }

      console.log(`[ReplyHandler] Marked ${payload.from} do_not_contact + sent polite close (sent: ${sent})`);
      break;
    }

    // ── OUT OF OFFICE ─────────────────────────────────────────────────────────
    case "out_of_office": {
      if (lead) {
        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + 7);
        await supabaseAdmin
          .from("outreach_leads")
          .update({ follow_up_after: followUpDate.toISOString() })
          .eq("id", lead.id);
        console.log(
          `[ReplyHandler] OOO from ${payload.from} — follow_up_after set to ${followUpDate.toDateString()}`
        );
      } else {
        console.log(`[ReplyHandler] OOO from ${payload.from} — lead not found, no action`);
      }
      break;
    }

    default: {
      console.log(`[ReplyHandler] Unclassified reply from ${payload.from} — no action`);
    }
  }

  return classified;
}
