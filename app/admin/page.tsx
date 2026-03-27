// Admin dashboard — restricted to ADMIN_EMAIL only.
// Server Component: all data fetched on server, never exposed to client.
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Metrics {
  totalUsers:      number;
  activeSubsCount: number;
  trialCount:      number;
  mrr:             number;
  permitsTracked:  number;
  citySuggestions: Array<{ city: string; state: string; votes: number; email: string | null }>;
  outreach: {
    total:        number;
    contacted:    number;
    replied:      number;
    converted:    number;
    doNotContact: number;
  };
}

async function fetchMetrics(): Promise<Metrics> {
  const [
    usersRes,
    activeRes,
    trialRes,
    permitsRes,
    suggestionsRes,
    outreachRes,
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("subscription_status", "active"),
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("subscription_status", "trialing"),
    supabaseAdmin.from("permits").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabaseAdmin.from("city_suggestions").select("city, state, votes, email").order("votes", { ascending: false }).limit(20),
    supabaseAdmin.from("outreach_leads").select("status"),
  ]);

  const outreachRows = (outreachRes.data ?? []) as Array<{ status: string }>;
  const outreachByStatus = outreachRows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return {
    totalUsers:      usersRes.count      ?? 0,
    activeSubsCount: activeRes.count     ?? 0,
    trialCount:      trialRes.count      ?? 0,
    mrr:             (activeRes.count ?? 0) * 79,
    permitsTracked:  permitsRes.count    ?? 0,
    citySuggestions: (suggestionsRes.data ?? []) as Metrics["citySuggestions"],
    outreach: {
      total:        outreachRows.length,
      contacted:    outreachByStatus["contacted"]     ?? 0,
      replied:      outreachByStatus["replied"]       ?? 0,
      converted:    outreachByStatus["converted"]     ?? 0,
      doNotContact: outreachByStatus["do_not_contact"] ?? 0,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const m = await fetchMetrics();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
            CLEARED<span className="text-[#F5F0E8]">NO</span>
          </Link>
          <span className="text-[#F5F0E8]/20">/</span>
          <span className="text-xs tracking-widest text-[#FF6B00] uppercase font-mono">Admin</span>
        </div>
        <Link href="/dashboard" className="text-xs text-[#F5F0E8]/40 hover:text-[#F5F0E8] tracking-widest uppercase transition-colors">
          Dashboard →
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* ── Key metrics strip ── */}
        <section>
          <SectionLabel>Key Metrics</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <MetricCard label="Total Users"     value={m.totalUsers}      />
            <MetricCard label="Active Subs"     value={m.activeSubsCount} accent />
            <MetricCard label="On Trial"        value={m.trialCount}      />
            <MetricCard label="MRR"             value={`$${m.mrr}`}       accent />
            <MetricCard label="Permits Tracked" value={m.permitsTracked}  />
          </div>
        </section>

        {/* ── Outreach ── */}
        <section>
          <SectionLabel>Outreach</SectionLabel>
          <div className="border border-[#FF6B00]/20 overflow-hidden">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[#FF6B00]/10 bg-[#FF6B00]/5">
                  <Th>Stage</Th>
                  <Th right>Count</Th>
                  <Th right>%</Th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Total leads",    val: m.outreach.total,        pct: null },
                  { label: "Contacted",      val: m.outreach.contacted,    pct: pct(m.outreach.contacted,    m.outreach.total) },
                  { label: "Replied",        val: m.outreach.replied,      pct: pct(m.outreach.replied,      m.outreach.total) },
                  { label: "Converted",      val: m.outreach.converted,    pct: pct(m.outreach.converted,    m.outreach.total) },
                  { label: "Do not contact", val: m.outreach.doNotContact, pct: null },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-[#FF6B00]/10 last:border-0">
                    <Td>{row.label}</Td>
                    <Td right highlight={row.label === "Replied" || row.label === "Converted"}>{row.val}</Td>
                    <Td right muted>{row.pct ?? "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── City suggestions ── */}
        <section>
          <SectionLabel>City Suggestions (by votes)</SectionLabel>
          {m.citySuggestions.length === 0 ? (
            <p className="text-xs text-[#F5F0E8]/30 font-mono">No suggestions yet.</p>
          ) : (
            <div className="border border-[#FF6B00]/20 overflow-hidden">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-[#FF6B00]/10 bg-[#FF6B00]/5">
                    <Th>City</Th>
                    <Th>State</Th>
                    <Th right>Votes</Th>
                    <Th>Email</Th>
                  </tr>
                </thead>
                <tbody>
                  {m.citySuggestions.map((s, i) => (
                    <tr key={i} className="border-b border-[#FF6B00]/10 last:border-0">
                      <Td>{s.city}</Td>
                      <Td>{s.state}</Td>
                      <Td right highlight={s.votes >= 3}>{s.votes}</Td>
                      <Td muted>{s.email ?? "—"}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Referral tip ── */}
        <section>
          <SectionLabel>Migrations Needed</SectionLabel>
          <div className="border border-[#FF6B00]/10 bg-[#FF6B00]/5 px-5 py-4 space-y-1">
            {[
              "001_subscription_columns.sql",
              "002_permit_status_expand.sql",
              "003_referrals.sql",
              "004_city_suggestions.sql",
              "005_outreach_leads.sql",
            ].map((m) => (
              <div key={m} className="text-xs text-[#F5F0E8]/60 font-mono flex items-center gap-2">
                <span className="text-[#FF6B00]">■</span>{m}
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-px bg-[#FF6B00]" />
      <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">{children}</span>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`border p-5 ${accent ? "border-[#FF6B00]/50 bg-[#FF6B00]/5" : "border-[#FF6B00]/15"}`}>
      <div className={`font-heading text-3xl tracking-wider ${accent ? "text-[#FF6B00]" : "text-[#F5F0E8]"}`}>
        {value}
      </div>
      <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1">{label}</div>
    </div>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={`px-4 py-2.5 text-[10px] tracking-widest text-[#FF6B00]/60 uppercase ${right ? "text-right" : "text-left"}`}>
      {children}
    </th>
  );
}

function Td({ children, right, muted, highlight }: { children: React.ReactNode; right?: boolean; muted?: boolean; highlight?: boolean }) {
  return (
    <td className={`px-4 py-2.5 ${right ? "text-right" : ""} ${muted ? "text-[#F5F0E8]/30" : highlight ? "text-[#FF6B00]" : "text-[#F5F0E8]/70"}`}>
      {children}
    </td>
  );
}

function pct(n: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((n / total) * 100)}%`;
}
