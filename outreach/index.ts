// Outreach agent — orchestrates lead generation → email pipeline.
//
// Usage:
//   node dist/scraper/outreach/index.js
//   DRY_RUN=true node dist/scraper/outreach/index.js
//
// Or via PM2:
//   pm2 start ecosystem.config.js --only clearedno-outreach
//
// Flow:
//   1. If DB has < MIN_LEADS new/uncontacted leads → run lead finder to top up
//   2. Pull up to DAILY_LIMIT uncontacted leads from DB
//   3. Generate personalized emails with Claude
//   4. Send via Gmail API (Supabase-tracked, deduped, 30/day hard limit)

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { findAndSaveLeads }  from "./lead-finder";
import { writeBatchEmails }  from "./email-writer";
import { sendBatch }         from "./sender";
import { supabaseAdmin }     from "../lib/supabase/admin";

// ── Config ────────────────────────────────────────────────────────────────────

const DRY_RUN = process.env.DRY_RUN === "true" || false;
const DAILY_LIMIT  = 30;   // Max emails per run
const MIN_LEADS    = 100;  // Re-run lead finder when uncontacted DB leads fall below this

// ── Helpers ───────────────────────────────────────────────────────────────────

async function countUncontactedLeads(): Promise<number> {
  const { count } = await supabaseAdmin
    .from("outreach_leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")
    .is("last_contacted_at", null);
  return count ?? 0;
}

// ── Main pipeline ─────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log(" ClearedNo Outreach Agent");
  console.log(`  Started:  ${new Date().toISOString()}`);
  console.log(`  DRY_RUN:  ${DRY_RUN}`);
  console.log("═══════════════════════════════════════════════");

  // ── 1. Top up leads if running low ────────────────────────────────────────
  const uncontacted = await countUncontactedLeads();
  console.log(`\n[1/3] Uncontacted leads in DB: ${uncontacted}`);

  if (uncontacted < MIN_LEADS) {
    console.log(`      Below ${MIN_LEADS} — running lead finder...`);

    if (DRY_RUN) {
      console.log("      DRY_RUN: skipping Google Maps calls");
    } else {
      try {
        const found = await findAndSaveLeads(15);
        console.log(`      Found and saved ${found.length} new leads`);
      } catch (err) {
        console.error("      Lead finder failed:", err instanceof Error ? err.message : err);
        // Non-fatal: continue with existing leads
      }
    }
  } else {
    console.log(`      Sufficient leads — skipping finder`);
  }

  // ── 2. Pull leads to contact this run ─────────────────────────────────────
  console.log(`\n[2/3] Fetching up to ${DAILY_LIMIT} leads to contact...`);

  const { data: leads, error: fetchErr } = await supabaseAdmin
    .from("outreach_leads")
    .select("id, business_name, email, city, state, contractor_type, website")
    .eq("status", "new")
    .is("last_contacted_at", null)
    .not("email", "is", null)
    .order("created_at", { ascending: true })
    .limit(DAILY_LIMIT);

  if (fetchErr || !leads || leads.length === 0) {
    console.log("      No leads available to contact. Run lead finder first.");
    return;
  }

  console.log(`      Got ${leads.length} leads`);

  // Map DB rows → Lead shape expected by email-writer
  const leadShapes = leads.map((l) => ({
    id:             l.id,
    name:           l.business_name,
    address:        "",
    city:           l.city ?? "",
    state:          l.state ?? "",
    contractorType: l.contractor_type ?? "general",
    website:        l.website,
    email:          l.email,
  }));

  // ── 3. Write personalized emails ──────────────────────────────────────────
  console.log(`\n[3/3] Writing emails with Claude...`);

  let drafts;
  if (DRY_RUN) {
    console.log("      DRY_RUN: generating drafts (will not send)");
  }

  drafts = await writeBatchEmails(leadShapes, 5);
  console.log(`      Generated ${drafts.length} drafts`);

  if (drafts.length === 0) {
    console.log("      No drafts generated — check ANTHROPIC_API_KEY.");
    return;
  }

  // ── 4. Send ────────────────────────────────────────────────────────────────
  console.log(`\n[4/4] Sending emails...`);

  const sendItems = drafts.map((draft, i) => ({
    draft,
    recipientEmail: leadShapes[i].email!,
    leadId:         leadShapes[i].id!,
  }));

  const result = await sendBatch(sendItems, DRY_RUN);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════");
  console.log(` Run complete: ${new Date().toISOString()}`);
  console.log(`  Sent:        ${result.sent}`);
  console.log(`  Skipped:     ${result.skipped} (already contacted or limit reached)`);
  console.log(`  Errors:      ${result.errors}`);
  if (DRY_RUN) console.log(`  DRY_RUN:     no emails were actually sent`);
  console.log("═══════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("[Outreach] Fatal error:", err);
  process.exit(1);
});
