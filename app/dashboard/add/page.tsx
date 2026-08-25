// Server Component. Resolves the caller's entitlement before rendering, so
// the form is never offered to someone who has no room for another permit.
//
// This page used to be a Client Component that inserted straight into
// `permits` with the anon key. Enforcement now lives in the addPermit server
// action; what happens here is presentation only — the numbers shown must
// match what the action will decide, but they are not what enforces it.
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getEntitlement } from "@/lib/entitlements";
import AddPermitForm, { type EntitlementView } from "./add-permit-form";

export default async function AddPermitPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const entitlement = await getEntitlement(user.id);

  // Infinity does not survive serialization into a Client Component, so
  // unlimited crosses the boundary as null.
  const view: EntitlementView = {
    tier:           entitlement.tier,
    used:           entitlement.used,
    limit:          entitlement.limit === Infinity ? null : entitlement.limit,
    canAdd:         entitlement.canAdd,
    purchasedSlots: entitlement.purchasedSlots,
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top bar */}
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>
        <span className="ml-4 text-[#F5F0E8]/20">/</span>
        <Link href="/dashboard" className="ml-4 text-xs text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors tracking-widest uppercase">
          Dashboard
        </Link>
        <span className="ml-4 text-[#F5F0E8]/20">/</span>
        <span className="ml-4 text-xs text-[#FF6B00] tracking-widest uppercase">Add Permit</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">New Permit</span>
          </div>
          <h1 className="font-heading text-5xl tracking-widest text-[#F5F0E8]">ADD A PERMIT</h1>
          <p className="mt-3 text-sm text-[#F5F0E8]/40 leading-relaxed">
            Pick your city, and we&apos;ll start checking the permit on the next scheduled
            run. You&apos;ll get an email when the status changes.
          </p>
        </div>

        {/* ── Entitlement strip ────────────────────────────────────────── */}
        <EntitlementStrip entitlement={view} />

        <AddPermitForm entitlement={view} defaultEmail={user.email ?? ""} />
      </main>
    </div>
  );
}

function EntitlementStrip({ entitlement }: { entitlement: EntitlementView }) {
  const { tier, used, limit, purchasedSlots } = entitlement;

  if (tier === "unlimited") {
    return (
      <div className="mb-6 border border-[#16A34A]/30 bg-[#16A34A]/5 px-5 py-3 flex items-center justify-between gap-4">
        <span className="text-[10px] tracking-[0.25em] text-[#16A34A] uppercase font-mono">
          Unlimited permits
        </span>
        <span className="text-xs text-[#F5F0E8]/40 font-mono">
          {used} tracked
        </span>
      </div>
    );
  }

  const atLimit = limit !== null && used >= limit;

  return (
    <div
      className={`mb-6 border px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
        atLimit
          ? "border-[#EAB308]/40 bg-[#EAB308]/5"
          : "border-[#FF6B00]/20 bg-[#FF6B00]/5"
      }`}
    >
      <span
        className={`text-[10px] tracking-[0.25em] uppercase font-mono ${
          atLimit ? "text-[#EAB308]" : "text-[#FF6B00]"
        }`}
      >
        {used} of {limit} permits used
      </span>
      <span className="text-xs text-[#F5F0E8]/40 font-mono">
        {purchasedSlots > 0
          ? `1 free + ${purchasedSlots} purchased ${purchasedSlots === 1 ? "slot" : "slots"}`
          : atLimit
            ? "Free permit used — add another for $9.99"
            : "1 free permit included"}
      </span>
    </div>
  );
}
