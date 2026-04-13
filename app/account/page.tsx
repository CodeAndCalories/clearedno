import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Account | ClearedNo",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active:   { label: "Active",    color: "#22C55E", bg: "rgba(34,197,94,0.12)"   },
  trialing: { label: "Trial",     color: "#FF6B00", bg: "rgba(255,107,0,0.12)"   },
  past_due: { label: "Past Due",  color: "#EAB308", bg: "rgba(234,179,8,0.12)"   },
  canceled: { label: "Canceled",  color: "#DC2626", bg: "rgba(220,38,38,0.12)"   },
  none:     { label: "No Access", color: "#F5F0E8", bg: "rgba(245,240,232,0.06)" },
};

function statusBadge(status: string | null) {
  const s = status ?? "none";
  const cfg = STATUS_CONFIG[s] ?? STATUS_CONFIG.none;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium font-mono"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
      {cfg.label}
    </span>
  );
}

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, subscription_status, leads_subscription_status")
    .eq("user_id", user.id)
    .single();

  const permitStatus = profile?.subscription_status ?? null;
  const leadsStatus  = profile?.leads_subscription_status ?? null;

  const permitActive = permitStatus === "active" || permitStatus === "trialing";
  const leadsActive  = leadsStatus === "active";

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono">
      {/* Header */}
      <div className="border-b border-[#FF6B00]/20 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-2">
            ClearedNo / Account
          </p>
          <h1 className="font-heading text-4xl tracking-widest text-[#F5F0E8] uppercase">
            {profile?.full_name ? `Welcome, ${profile.full_name.split(" ")[0]}` : "My Account"}
          </h1>
          <p className="text-xs text-[#F5F0E8]/30 mt-1">{user.email}</p>
        </div>
      </div>

      {/* Product cards */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-[10px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-6">
          Your Products
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* ── Permit Checker card ──────────────────────────────── */}
          <div className="border border-[#FF6B00]/20 p-6 relative bg-[#0A0A0A] flex flex-col gap-5">
            <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FF6B00]/60 -translate-x-px -translate-y-px" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FF6B00]/60 translate-x-px translate-y-px" />

            <div>
              <p className="text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-1">
                Product
              </p>
              <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] uppercase">
                Permit Checker
              </h2>
              <p className="text-xs text-[#F5F0E8]/40 mt-1">$79 / month</p>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-2">
                Status
              </p>
              {statusBadge(permitStatus)}
            </div>

            <div className="mt-auto">
              {permitActive ? (
                <a
                  href="/dashboard"
                  className="inline-block border border-[#FF6B00] text-[#FF6B00] text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:bg-[#FF6B00] hover:text-[#0A0A0A] transition-colors"
                >
                  Open Dashboard →
                </a>
              ) : (
                <a
                  href="/pricing"
                  className="inline-block border border-[#F5F0E8]/30 text-[#F5F0E8]/60 text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:border-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors"
                >
                  Get Access →
                </a>
              )}
            </div>
          </div>

          {/* ── Roofing Leads card ───────────────────────────────── */}
          <div className="border border-[#FF6B00]/20 p-6 relative bg-[#0A0A0A] flex flex-col gap-5">
            <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FF6B00]/60 -translate-x-px -translate-y-px" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FF6B00]/60 translate-x-px translate-y-px" />

            <div>
              <p className="text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-1">
                Product
              </p>
              <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] uppercase">
                Roofing Leads
              </h2>
              <p className="text-xs text-[#F5F0E8]/40 mt-1">$300 / month</p>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-2">
                Status
              </p>
              {statusBadge(leadsStatus)}
            </div>

            <div className="mt-auto">
              {leadsActive ? (
                <a
                  href="/leads"
                  className="inline-block border border-[#FF6B00] text-[#FF6B00] text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:bg-[#FF6B00] hover:text-[#0A0A0A] transition-colors"
                >
                  View Leads →
                </a>
              ) : (
                <a
                  href="/leads/landing"
                  className="inline-block border border-[#F5F0E8]/30 text-[#F5F0E8]/60 text-[10px] tracking-widest uppercase font-mono px-4 py-2 hover:border-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors"
                >
                  Get Access →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div className="mt-10 pt-8 border-t border-[#FF6B00]/10">
          <a
            href="/auth/signout"
            className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase hover:text-[#FF6B00]/60 transition-colors"
          >
            Sign Out
          </a>
        </div>
      </div>
    </main>
  );
}
