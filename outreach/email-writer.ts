// Email writer — uses Claude claude-sonnet-4-6 to craft personalized cold emails for each lead.

import Anthropic from "@anthropic-ai/sdk";
import type { Lead } from "./lead-finder";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Sender name pulled from env so it stays consistent across every email
const SENDER_NAME = process.env.FROM_NAME?.split(" ")[0] ?? "Alex";

export interface EmailDraft {
  subject: string;
  body:    string;
  lead:    Lead;
}

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are writing cold emails on behalf of ${SENDER_NAME}, the founder of ClearedNo — a tool that monitors building permit statuses 24/7 and emails contractors the instant a permit clears or changes.

Rules (follow every one):
- Under 100 words total, including signature — count carefully
- Plain text only, no HTML, no emojis, no bullet points
- No generic openers ("Hope this finds you well", "I wanted to reach out", etc.)
- Lead with ONE specific pain point: checking portals manually = idle crew = lost money
- Mention the founding member offer exactly: "First 20 contractors lock in $49/mo (then $79). 17 spots left."
- CTA must be the direct link — not "reply yes": "Start your free 14-day trial at clearedno.com"
- Sign off as: ${SENDER_NAME} / ClearedNo
- Use the business name or city when it makes the email feel personal, not templated

Subject line rules:
- Direct and specific to their city or situation
- Good examples: "Are you checking Austin permits manually?", "Austin permit alert tool — free trial", "Your {city} permits — still checking by hand?"
- Bad examples: "Permit watching for contractors", "Quick question"

Return JSON only: { "subject": "...", "body": "..." }`;

// ── Main ──────────────────────────────────────────────────────────────────────

export async function writeEmail(lead: Lead): Promise<EmailDraft> {
  const userMessage = `Write a cold email for this contractor:
Business: ${lead.name}
City: ${lead.city}, ${lead.state}
${lead.website ? `Website: ${lead.website}` : ""}

Remember: under 100 words, founding member offer included, CTA is clearedno.com link.`;

  const message = await client.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 512,
    system:     SYSTEM_PROMPT,
    messages:   [{ role: "user", content: userMessage }],
  });

  const raw     = message.content[0].type === "text" ? message.content[0].text : "{}";
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed  = JSON.parse(cleaned) as { subject: string; body: string };

  return { subject: parsed.subject, body: parsed.body, lead };
}

// ── Batch ──────────────────────────────────────────────────────────────────────

/**
 * Writes emails for a batch of leads in parallel chunks.
 * Returns only successfully generated drafts.
 */
export async function writeBatchEmails(
  leads:       Lead[],
  concurrency  = 5
): Promise<EmailDraft[]> {
  const results: EmailDraft[] = [];

  for (let i = 0; i < leads.length; i += concurrency) {
    const chunk  = leads.slice(i, i + concurrency);
    const drafts = await Promise.allSettled(chunk.map(writeEmail));

    for (const result of drafts) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        console.error("[EmailWriter] Failed to write email:", result.reason);
      }
    }

    if (i + concurrency < leads.length) {
      await new Promise((r) => setTimeout(r, 1_000));
    }
  }

  return results;
}
