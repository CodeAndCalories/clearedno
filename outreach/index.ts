// Outreach agent — orchestrates the full lead generation → email pipeline.
//
// Usage:
//   npx ts-node --project tsconfig.scripts.json outreach/index.ts
//
// Or via PM2:
//   pm2 start ecosystem.config.js --only clearedno-outreach
//
// The agent:
//   1. Finds contractor leads via Google Maps
//   2. Generates personalized emails with Claude
//   3. Sends up to DAILY_LIMIT emails via Resend
//   4. Logs everything to outreach/sent-log.json

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { findLeads } from "./lead-finder";
import { writeBatchEmails } from "./email-writer";
import { sendBatch } from "./sender";

// ── Config ───────────────────────────────────────────────────────────────────

// How many leads to find per run
const LEADS_PER_RUN = 60;

// NOTE: In a real outreach pipeline you'd have a lead-to-email mapping
// (scraped from their website, LinkedIn, etc.). For this scaffold we
// generate a placeholder email from the company name + domain as a
// starting point. Replace with your actual lead enrichment logic.
function guessEmail(lead: { name: string; website?: string }): string | null {
  if (lead.website) {
    try {
      const domain = new URL(
        lead.website.startsWith("http") ? lead.website : `https://${lead.website}`
      ).hostname.replace(/^www\./, "");
      return `info@${domain}`;
    } catch {
      // Invalid URL
    }
  }
  return null;
}

// ── Main pipeline ─────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log(" ClearedNo Outreach Agent");
  console.log(`  Started: ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════");

  // 1. Find leads
  console.log(`\n[1/3] Finding up to ${LEADS_PER_RUN} leads...`);
  const leads = await findLeads(Math.ceil(LEADS_PER_RUN / 5)); // Per city limit
  console.log(`      Found ${leads.length} leads`);

  if (leads.length === 0) {
    console.log("No leads found. Check GOOGLE_MAPS_API_KEY and quota.");
    return;
  }

  // Filter leads that have an email we can derive
  const leadsWithEmail = leads
    .map((lead) => ({ lead, email: guessEmail(lead) }))
    .filter((l): l is { lead: typeof l.lead; email: string } => l.email !== null);

  console.log(`      ${leadsWithEmail.length} leads have derivable email addresses`);

  // 2. Write personalized emails
  console.log(`\n[2/3] Writing personalized emails with Claude...`);
  const drafts = await writeBatchEmails(
    leadsWithEmail.map((l) => l.lead),
    5 // 5 concurrent API calls
  );
  console.log(`      Generated ${drafts.length} email drafts`);

  // 3. Send emails
  console.log(`\n[3/3] Sending emails (max 50/day)...`);
  const emailsToSend = drafts.map((draft, i) => ({
    draft,
    recipientEmail: leadsWithEmail[i].email,
  }));

  const result = await sendBatch(emailsToSend);

  // Summary
  console.log("\n═══════════════════════════════════════════════");
  console.log(` Run complete: ${new Date().toISOString()}`);
  console.log(`  Sent:    ${result.sent}`);
  console.log(`  Skipped: ${result.skipped} (already sent or limit reached)`);
  console.log(`  Errors:  ${result.errors}`);
  console.log("═══════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("[Outreach] Fatal error:", err);
  process.exit(1);
});
