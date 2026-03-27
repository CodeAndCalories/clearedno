// Admin dashboard — restricted to ADMIN_EMAIL only.
// Server Component: all Supabase queries run on the server.
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchAll() {
  const [
    usersRes,
    activeRes,
    trialRes,
    permitsRes,
    permitsByCityRes,
    recentProfilesRes,
    suggestionsRes,
    outreachRes,
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("subscription_status", "active"),
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("subscription_status", "trialing"),
    supabaseAdmin.from("permits").select("*", { count: "exact", head: true }).eq("is_active", true),
    // Permits grouped by city — fetch all active and aggregate in JS
    supabaseAdmin.from("permits").select("city, state").eq("is_active", true),
    // Recent signups: last 10 profiles with user_id + sub status + created_at
    supabaseAdmin.from("profiles")
      .select("user_id, subscription_status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabaseAdmin.from("city_suggestions").select("city, state, votes, email").order("votes", { ascending: false }).limit(15),
    supabaseAdmin.from("outreach_leads").select("status"),
  ]);

  // Aggregate permits by city
  const permitCities = (permitsByCityRes.data ?? []) as Array<{ city: string; state: string }>;
  const cityCount: Record<string, number> = {};
  for (const p of permitCities) {
    const key = `${p.city}, ${p.state}`;
    cityCount[key] = (cityCount[key] ?? 0) + 1;
  }
  const permitsByCity = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .map(([city, count]) => ({ city, count }));

  // Get user emails for recent signups via admin auth API
  const recentProfiles = (recentProfilesRes.data ?? []) as Array<{
    user_id: string;
    subscription_status: string | null;
    created_at: string;
  }>;

  // Fetch auth user emails in one call
  let emailMap: Record<string, string> = {};
  try {
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 100 });
    for (const u of users) {
      emailMap[u.id] = u.email ?? u.id.slice(0, 8);
    }
  } catch {
    // Auth admin API may not be available in all environments — fall back to user_id
  }

  const recentSignups = recentProfiles.map((p) => ({
    email:  emailMap[p.user_id] ?? p.user_id.slice(0, 12) + "…",
    status: p.subscription_status ?? "—",
    date:   new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));

  // Outreach funnel
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
    permitsByCity,
    recentSignups,
    citySuggestions: (suggestionsRes.data ?? []) as Array<{ city: string; state: string; votes: number; email: string | null }>,
    outreach: {
      total:        outreachRows.length,
      contacted:    outreachByStatus["contacted"]      ?? 0,
      replied:      outreachByStatus["replied"]        ?? 0,
      converted:    outreachByStatus["converted"]      ?? 0,
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
  if (!adminEmail || user.email !== adminEmail) redirect("/dashboard");

  const d = await fetchAll();

  const ghBase = "https://github.com/CodeAndCalories/clearedno/actions/workflows";

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
        <div className="flex items-center gap-4">
          <a
            href={`${ghBase}/scraper.yml`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-[#FF6B00]/30 text-[#FF6B00]/70 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
          >
            ▶ Run Scraper
          </a>
          <a
            href={`${ghBase}/outreach.yml`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-[#FF6B00]/30 text-[#FF6B00]/70 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
          >
            ▶ Send Outreach
          </a>
          <Link href="/dashboard" className="text-xs text-[#F5F0E8]/40 hover:text-[#F5F0E8] tracking-widest uppercase transition-colors">
            Dashboard →
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* ── Key metrics ── */}
        <section>
          <SectionLabel>Key Metrics</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <MetricCard label="Total Users"     value={d.totalUsers}      />
            <MetricCard label="Active Subs"     value={d.activeSubsCount} accent />
            <MetricCard label="On Trial"        value={d.trialCount}      />
            <MetricCard label="MRR"             value={`$${d.mrr}`}       accent />
            <MetricCard label="Permits Tracked" value={d.permitsTracked}  />
          </div>
        </section>

        {/* ── Recent signups + Permits by city ── */}
        <div className="grid sm:grid-cols-2 gap-6">

          {/* Recent signups */}
          <section>
            <SectionLabel>Recent Signups</SectionLabel>
            <div className="border border-[#FF6B00]/20 overflow-hidden">
              {d.recentSignups.length === 0 ? (
                <p className="px-4 py-3 text-xs text-[#F5F0E8]/30 font-mono">No signups yet.</p>
              ) : (
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#FF6B00]/10 bg-[#FF6B00]/5">
                      <Th>Email</Th>
                      <Th>Status</Th>
                      <Th right>Date</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.recentSignups.map((s, i) => (
                      <tr key={i} className="border-b border-[#FF6B00]/10 last:border-0">
                        <Td muted>{s.email}</Td>
                        <Td highlight={s.status === "active"}>{s.status}</Td>
                        <Td right muted>{s.date}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Permits by city */}
          <section>
            <SectionLabel>Permits by City</SectionLabel>
            <div className="border border-[#FF6B00]/20 overflow-hidden">
              {d.permitsByCity.length === 0 ? (
                <p className="px-4 py-3 text-xs text-[#F5F0E8]/30 font-mono">No permits tracked yet.</p>
              ) : (
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#FF6B00]/10 bg-[#FF6B00]/5">
                      <Th>City</Th>
                      <Th right>Permits</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.permitsByCity.map((c, i) => (
                      <tr key={i} className="border-b border-[#FF6B00]/10 last:border-0">
                        <Td>{c.city}</Td>
                        <Td right highlight>{c.count}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>

        {/* ── Outreach funnel ── */}
        <section>
          <SectionLabel>Outreach Funnel</SectionLabel>
          <div className="border border-[#FF6B00]/20 overflow-hidden">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[#FF6B00]/10 bg-[#FF6B00]/5">
                  <Th>Stage</Th>
                  <Th right>Count</Th>
                  <Th right>Rate</Th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Total leads",    val: d.outreach.total,        base: d.outreach.total },
                  { label: "Contacted",      val: d.outreach.contacted,    base: d.outreach.total },
                  { label: "Replied",        val: d.outreach.replied,      base: d.outreach.contacted },
                  { label: "Converted",      val: d.outreach.converted,    base: d.outreach.replied },
                  { label: "Do not contact", val: d.outreach.doNotContact, base: null },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-[#FF6B00]/10 last:border-0">
                    <Td>{row.label}</Td>
                    <Td right highlight={row.label === "Replied" || row.label === "Converted"}>{row.val}</Td>
                    <Td right muted>{row.base != null ? pct(row.val, row.base) : "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── City suggestions ── */}
        <section>
          <SectionLabel>City Suggestions (by votes)</SectionLabel>
          {d.citySuggestions.length === 0 ? (
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
                  {d.citySuggestions.map((s, i) => (
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

        {/* ── Migrations ── */}
        <section>
          <SectionLabel>Migrations (run in Supabase SQL editor)</SectionLabel>
          <div className="border border-[#FF6B00]/10 bg-[#FF6B00]/5 px-5 py-4 space-y-1">
            {[
              "001_subscription_columns.sql",
              "002_permit_status_expand.sql",
              "003_referrals.sql",
              "004_city_suggestions.sql",
              "005_outreach_leads.sql",
            ].map((mig) => (
              <div key={mig} className="text-xs text-[#F5F0E8]/60 font-mono flex items-center gap-2">
                <span className="text-[#FF6B00]">■</span>{mig}
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
