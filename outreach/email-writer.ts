// Email writer — uses Claude claude-sonnet-4-6 to craft personalized cold emails for each lead.
// Personalization is based on the lead's name, city, and review signals.

import Anthropic from "@anthropic-ai/sdk";
import type { Lead } from "./lead-finder";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface EmailDraft {
  subject: string;
  body: string;
  lead: Lead;
}

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an outreach specialist for ClearedNo, a SaaS tool that monitors building permit statuses 24/7 and sends contractors an instant email the moment a permit clears or changes status.

Your job is to write short, direct cold emails to general contractors and construction company owners. The emails should:
- Sound like they were written by a real person, not a marketing department
- Be under 150 words
- Lead with a specific pain point (waiting on permits = idle crew = lost money)
- Mention a concrete benefit ($79/mo, 14-day free trial)
- Have a clear single CTA: reply "yes" to get a link
- Use the contractor's name and city when provided
- Avoid buzzwords, marketing fluff, and generic openers like "I hope this finds you well"
- No emojis
- No HTML — plain text only

Subject line should be direct and specific, like:
"Permit watching for [City] contractors" or "Know the moment permit [X] clears"

Return your response as JSON: { "subject": "...", "body": "..." }`;

// ── Main ──────────────────────────────────────────────────────────────────────

export async function writeEmail(lead: Lead): Promise<EmailDraft> {
  const userMessage = `Write a cold email for this lead:
Name: ${lead.name}
City: ${lead.city}, ${lead.state}
${lead.website ? `Website: ${lead.website}` : ""}

The email will be sent from the founder of ClearedNo. Keep it under 150 words.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "{}";

  // Strip markdown code fences if Claude wraps the JSON
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  const parsed = JSON.parse(cleaned) as { subject: string; body: string };

  return {
    subject: parsed.subject,
    body: parsed.body,
    lead,
  };
}

/**
 * Writes emails for a batch of leads in parallel (respects rate limits).
 * Returns only successfully generated drafts.
 */
export async function writeBatchEmails(
  leads: Lead[],
  concurrency = 5
): Promise<EmailDraft[]> {
  const results: EmailDraft[] = [];

  // Process in chunks of `concurrency` to avoid rate limits
  for (let i = 0; i < leads.length; i += concurrency) {
    const chunk = leads.slice(i, i + concurrency);
    const drafts = await Promise.allSettled(chunk.map(writeEmail));

    for (const result of drafts) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        console.error("[EmailWriter] Failed to write email:", result.reason);
      }
    }

    // Brief pause between batches
    if (i + concurrency < leads.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return results;
}
