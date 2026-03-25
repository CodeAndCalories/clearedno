// Reply handler — classifies inbound email replies using Claude.
// In production, wire this up to a Resend inbound webhook:
// https://resend.com/docs/send/with-inbound-emails
//
// Route handler: app/api/outreach/reply/route.ts

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type ReplyIntent =
  | "interested"    // They want to try it / asked for the link
  | "not_interested"// Polite no / unsubscribe
  | "question"      // They have a specific question before deciding
  | "out_of_office" // Auto-reply
  | "unclassified"; // Anything else

export interface ClassifiedReply {
  intent: ReplyIntent;
  confidence: "high" | "medium" | "low";
  suggestedAction: string;
  summary: string;
}

// ── Classifier ────────────────────────────────────────────────────────────────

export async function classifyReply(
  fromEmail: string,
  subject: string,
  body: string
): Promise<ClassifiedReply> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001", // Fast + cheap for classification
    max_tokens: 256,
    system: `You classify cold email replies for a SaaS called ClearedNo (permit monitoring for contractors).
Classify the reply into one of: interested, not_interested, question, out_of_office, unclassified.
Return JSON: { "intent": "...", "confidence": "high|medium|low", "suggestedAction": "...", "summary": "..." }`,
    messages: [
      {
        role: "user",
        content: `From: ${fromEmail}\nSubject: ${subject}\n\n${body.slice(0, 500)}`,
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "{}";
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  return JSON.parse(cleaned) as ClassifiedReply;
}

// ── Webhook handler helper ────────────────────────────────────────────────────
// Import this in your Next.js route handler and call it from the POST body.

export async function handleInboundWebhook(payload: {
  from: string;
  subject: string;
  text: string;
}) {
  const classified = await classifyReply(payload.from, payload.subject, payload.text);

  console.log(
    `[ReplyHandler] ${payload.from} → ${classified.intent} (${classified.confidence}) — ${classified.summary}`
  );

  // TODO: Based on intent, add to your CRM, send a follow-up, or unsubscribe them
  switch (classified.intent) {
    case "interested":
      // Auto-send the signup link with a personal note
      console.log(`[ReplyHandler] ACTION: Send signup link to ${payload.from}`);
      break;
    case "not_interested":
      // Mark as do-not-contact in your send log
      console.log(`[ReplyHandler] ACTION: Mark ${payload.from} as DNC`);
      break;
    case "question":
      // Flag for founder to reply personally
      console.log(`[ReplyHandler] ACTION: Flag for personal reply from ${payload.from}`);
      break;
    case "out_of_office":
      // Schedule a follow-up in 7 days
      console.log(`[ReplyHandler] ACTION: Schedule follow-up for ${payload.from}`);
      break;
    default:
      console.log(`[ReplyHandler] No automated action for intent: ${classified.intent}`);
  }

  return classified;
}
