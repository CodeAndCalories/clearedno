// Email writer — uses Claude claude-sonnet-4-6 to craft personalized cold emails for each lead.

import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "../lib/supabase/admin";
import type { Lead } from "./lead-finder";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SENDER_NAME     = process.env.FROM_NAME?.split(" ")[0] ?? "Alex";
const FOUNDING_TOTAL  = 20;

export interface EmailDraft {
  subject: string;
  body:    string;
  lead:    Lead;
}

// ── Founding spots ────────────────────────────────────────────────────────────

async function getRemainingFoundingSpots(): Promise<number> {
  const { count } = await supabaseAdmin
    .from("outreach_leads")
    .select("*", { count: "exact", head: true })
    .eq("converted", true);
  return Math.max(0, FOUNDING_TOTAL - (count ?? 0));
}

// ── System prompt ─────────────────────────────────────────────────────────────

function buildSystemPrompt(spotsLeft: number): string {
  const foundingBlock = spotsLeft > 0
    ? `- Include the promo line exactly: "Use code FOUNDING49 — first month $49, then $79. ${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left."`
    : `- No founding member offer — all spots are filled. Mention standard pricing: $79/mo, 14-day free trial.`;

  return `You are writing cold emails on behalf of ${SENDER_NAME}, the founder of ClearedNo — a tool that monitors building permit statuses 24/7 and emails contractors the instant a permit clears or changes.

Rules (follow every one):
- Under 100 words total including signature — count carefully
- Plain text only, no HTML, no emojis, no bullet points
- No generic openers ("Hope this finds you well", "I wanted to reach out", etc.)
- Lead with ONE specific pain point: checking portals manually = idle crew = lost money
- Explain ClearedNo in 1 sentence max
- CTA must be the direct link: "Start your free 14-day trial at clearedno.com"
${foundingBlock}
- Email structure: pain point → what it does → CTA → promo line → sign off
- Sign off as: ${SENDER_NAME} (name only, no title)
- Use the business name or city to make it feel personal, not templated

Subject line rules:
- Direct and specific to their city or trade
- Good: "Are you checking Austin permits manually?", "Austin permit alert tool — free trial", "Still checking Dallas permits by hand?"
- Bad: "Permit watching for contractors", "Quick question", "Following up"

Return JSON only: { "subject": "...", "body": "..." }`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

export async function writeEmail(lead: Lead, spotsLeft: number): Promise<EmailDraft> {
  const userMessage = `Write a cold email for this contractor:
Business: ${lead.name}
City: ${lead.city}, ${lead.state}
${lead.website ? `Website: ${lead.website}` : ""}

Remember: under 100 words, include FOUNDING49 promo if spots remain, CTA is clearedno.com link.`;

  const message = await client.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 512,
    system:     buildSystemPrompt(spotsLeft),
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
 * Queries founding spots once and reuses the value for the whole batch.
 * Returns only successfully generated drafts.
 */
export async function writeBatchEmails(
  leads:      Lead[],
  concurrency = 5
): Promise<EmailDraft[]> {
  // Fetch spots once — same count applies to the whole batch run
  const spotsLeft = await getRemainingFoundingSpots();
  console.log(`[EmailWriter] Founding spots remaining: ${spotsLeft}`);

  const results: EmailDraft[] = [];

  for (let i = 0; i < leads.length; i += concurrency) {
    const chunk  = leads.slice(i, i + concurrency);
    const drafts = await Promise.allSettled(chunk.map((l) => writeEmail(l, spotsLeft)));

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
