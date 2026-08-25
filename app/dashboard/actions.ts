"use server";

// Server Actions for the dashboard.
// These run on the server and revalidate the dashboard after mutations.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEntitlement } from "@/lib/entitlements";
import { cities, LIVE_CHECKER_CITIES } from "@/lib/cities";

/**
 * Soft-deletes a permit by setting is_active = false.
 * Revalidates the dashboard so the card disappears without a full navigation.
 */
export async function deletePermit(permitId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // RLS enforces ownership — only the permit owner can update their row.
  const { error } = await supabase
    .from("permits")
    .update({ is_active: false })
    .eq("id", permitId)
    .eq("user_id", user.id); // Belt-and-suspenders: ensure user owns this permit

  if (error) {
    // Log and surface — the client useTransition will keep the card visible
    console.error("[deletePermit] Supabase error:", error.message);
    throw new Error(error.message);
  }

  // Revalidate the dashboard route so Next.js re-fetches permit data
  revalidatePath("/dashboard");
}

// ── Adding a permit ─────────────────────────────────────────────────────────

export interface AddPermitInput {
  citySlug: string;
  permitNumber: string;
  address: string;
}

export type AddPermitResult =
  | { ok: true }
  | { ok: false; error: string; overLimit?: boolean };

/**
 * Creates a permit after checking the caller's entitlement.
 *
 * This used to be a client-side supabase.from("permits").insert() in
 * app/dashboard/add/page.tsx, running with the anon key. The only thing
 * standing between a user and unlimited permits was an RLS policy that checks
 * ownership and nothing else — so any limit rendered in the form was
 * decoration: the same insert could be issued straight to PostgREST with the
 * user's own JWT. Enforcement has to happen somewhere the user cannot reach,
 * which is here.
 *
 * Every check the form performs is repeated rather than trusted: the client
 * supplies citySlug, permitNumber and address, and all three arrive
 * attacker-controlled.
 */
export async function addPermit(input: AddPermitInput): Promise<AddPermitResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ── City must have a working scraper ──────────────────────────────────
  // Accepting a permit for a city nothing checks is a promise we cannot keep:
  // the row would sit forever waiting for an alert that can never fire.
  const city = cities.find((c) => c.slug === input.citySlug);

  if (!city || !LIVE_CHECKER_CITIES.has(city.slug)) {
    return { ok: false, error: "We can't monitor permits in that city yet." };
  }

  // ── Field validation (mirrors the form, re-run server-side) ────────────
  const permitNumber = input.permitNumber.trim();
  const address = input.address.trim();

  if (!permitNumber) {
    return { ok: false, error: "Permit number is required." };
  }
  if (permitNumber.length < 4) {
    return { ok: false, error: "Permit number must be at least 4 characters." };
  }
  if (!/^[A-Za-z0-9\-\s]+$/.test(permitNumber)) {
    return {
      ok: false,
      error: "Permit number may only contain letters, numbers, hyphens, and spaces.",
    };
  }
  if (!address) {
    return { ok: false, error: "Property address is required." };
  }

  // ── Entitlement ────────────────────────────────────────────────────────
  // Note: this is a check-then-insert, so two requests racing can both pass
  // and land one permit over the limit. The durable fix is a BEFORE INSERT
  // trigger enforcing the same rule in the database; until then the exposure
  // is one extra permit under deliberate concurrent abuse, not unlimited.
  const entitlement = await getEntitlement(user.id);

  if (!entitlement.canAdd) {
    return {
      ok: false,
      overLimit: true,
      error:
        `You're tracking ${entitlement.used} of ${entitlement.limit} permits. ` +
        `Add a permit slot to track another.`,
    };
  }

  // city/state come from the canonical list, never from free text, so the
  // scraper registry can always route the row to a real scraper.
  // RLS remains the second layer: it still enforces auth.uid() = user_id.
  const { error } = await supabase.from("permits").insert({
    user_id:       user.id,
    permit_number: permitNumber.toUpperCase(),
    address,
    city:          city.name,
    state:         city.stateAbbr,
    status:        "PENDING",
  });

  if (error) {
    console.error("[addPermit] Supabase error:", error.message);
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/add");

  return { ok: true };
}
