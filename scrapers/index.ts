// Scraper engine — runs all city scrapers, detects status changes, fires alerts.
// This is designed to be called by a cron job or a PM2-managed long-running process.
//
// Run locally: npx ts-node --project tsconfig.scripts.json scrapers/index.ts
// In production: pm2 start ecosystem.config.js

import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendPermitClearedEmail } from "@/lib/email";
import type { Permit, StatusHistoryEntry, PermitStatus } from "@/types";

// ── Registry of all city scrapers ──────────────────────────────────────────
// Import and register each new city scraper here.
import { AustinTxScraper } from "./cities/austin-tx";
import type { BaseScraper } from "./base-scraper";

const SCRAPERS: BaseScraper[] = [
  new AustinTxScraper(),
  // new HoustonTxScraper(),
  // new DallasTxScraper(),
  // Add more cities here as they're implemented
];

// ── Main engine ─────────────────────────────────────────────────────────────

async function runScrapers() {
  console.log(`[Engine] Starting scraper run at ${new Date().toISOString()}`);

  // Fetch all active permits from Supabase (bypasses RLS via service role)
  const { data: permits, error } = await supabaseAdmin
    .from("permits")
    .select("*")
    .eq("is_active", true);

  if (error || !permits) {
    console.error("[Engine] Failed to fetch permits:", error);
    return;
  }

  console.log(`[Engine] Processing ${permits.length} active permits`);

  for (const permit of permits as Permit[]) {
    await processPermit(permit);
  }

  console.log(`[Engine] Scraper run complete at ${new Date().toISOString()}`);
}

async function processPermit(permit: Permit) {
  // Find the right scraper for this permit's city + state
  const scraper = SCRAPERS.find((s) => s.handles(permit.city, permit.state));

  if (!scraper) {
    // No scraper implemented for this city yet — skip silently
    return;
  }

  const result = await scraper.run(permit.permit_number, permit.address);

  if (!result) {
    // Scrape failed after retries — don't update last_checked to trigger re-check soon
    console.warn(`[Engine] Scrape failed for permit ${permit.permit_number}`);
    return;
  }

  const now = new Date().toISOString();
  const statusChanged = result.status !== permit.status;

  // Build updated history
  const newEntry: StatusHistoryEntry = {
    status:    result.status,
    timestamp: now,
    raw:       result.raw_text,
  };

  const updatedHistory: StatusHistoryEntry[] = [
    ...(permit.status_history ?? []),
    newEntry,
  ];

  // Update permit in Supabase
  const { error: updateError } = await supabaseAdmin
    .from("permits")
    .update({
      status:         result.status,
      last_checked:   now,
      status_history: updatedHistory,
      scrape_url:     result.scrape_url,
    })
    .eq("id", permit.id);

  if (updateError) {
    console.error(`[Engine] Failed to update permit ${permit.id}:`, updateError);
    return;
  }

  // If status changed, send an alert and log it
  if (statusChanged) {
    console.log(
      `[Engine] Status change: ${permit.permit_number} ${permit.status} → ${result.status}`
    );
    await sendAlert(permit, result.status);
  }
}

async function sendAlert(permit: Permit, newStatus: PermitStatus) {
  // Check if we've already sent an alert for this exact status change (dedup)
  const { data: existing } = await supabaseAdmin
    .from("alerts")
    .select("id")
    .eq("permit_id", permit.id)
    .eq("new_status", newStatus)
    .single();

  if (existing) {
    console.log(`[Engine] Alert already sent for ${permit.permit_number} → ${newStatus}, skipping`);
    return;
  }

  // Fetch the user's email and profile
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(permit.user_id);
  const userEmail = userData?.user?.email;
  if (!userEmail) return;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("user_id", permit.user_id)
    .single();

  const userName = profile?.full_name ?? "there";

  // Send the email
  await sendPermitClearedEmail({
    to: userEmail,
    userName,
    permit: { ...permit, status: newStatus },
  });

  // Log the alert so we don't double-send
  await supabaseAdmin.from("alerts").insert({
    user_id:    permit.user_id,
    permit_id:  permit.id,
    type:       "status_change",
    new_status: newStatus,
  });

  console.log(`[Engine] Alert sent to ${userEmail} for ${permit.permit_number} → ${newStatus}`);
}

// ── Entrypoint ──────────────────────────────────────────────────────────────

runScrapers().catch((err) => {
  console.error("[Engine] Fatal error:", err);
  process.exit(1);
});
