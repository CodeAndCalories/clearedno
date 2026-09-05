import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PermitChecker } from "@/app/components/permit-checker";
import {
  cities,
  liveCheckerCities,
  liveCityList,
  LIVE_CHECKER_CITIES,
  LIVE_CITY_COUNT,
} from "@/lib/cities";
import type { PermitStatus } from "@/types";

// /check — the public, no-signup permit status checker.
//
// This page is a server component so it is statically generated and exports
// metadata; the lookup itself is the existing PermitChecker client component
// hitting /api/check-permit. Nothing here re-implements a lookup. Every city
// claim derives from LIVE_CHECKER_CITIES so the copy can't outrun the checker.

const PAGE_URL = "https://www.clearedno.com/check";

const TITLE       = "Check Any Building Permit Status — Free Instant Lookup";
const DESCRIPTION =
  `Look up building permit status instantly in ${LIVE_CITY_COUNT} cities. ` +
  "Enter a permit number, get real status straight from the city. No signup required.";

export const metadata: Metadata = {
  title: `${TITLE} | ClearedNo`,
  description: DESCRIPTION,
  keywords: [
    "check building permit status",
    "permit status lookup",
    "building permit status check",
    "look up permit by number",
    "permit status checker",
    ...liveCheckerCities.map((c) => `${c.name} permit status`),
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/clearedno-icon.png", width: 512, height: 512, alt: "ClearedNo" }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/clearedno-icon.png"],
  },
};

// ── Status glossary ───────────────────────────────────────────────────────────
//
// Colours match app/dashboard/permit-card.tsx and the checker's own result
// panel, so a reader sees the same colour here, in the result, and later in
// their dashboard. UNKNOWN is listed last and explained honestly rather than
// hidden: the checker does show it.

type StatusEntry = {
  status:  PermitStatus;
  label:   string;
  color:   string;
  means:   string;
  action:  string;
};

const STATUS_GLOSSARY: StatusEntry[] = [
  {
    status: "PENDING",
    label:  "PENDING",
    color:  "#6B7280",
    means:  "The city has your application, or has approved it, but has not issued the permit. This covers intake queues, scheduled intake appointments, fee-due states, and approved-but-not-issued states like Seattle's \"Ready for Issuance\" or Pittsburgh's \"Ready For Issue\".",
    action: "Nothing yet, unless fees are due. Work may not legally start until the status moves to APPROVED.",
  },
  {
    status: "UNDER_REVIEW",
    label:  "UNDER REVIEW",
    color:  "#EAB308",
    means:  "A reviewer or inspector is actively working the file — plan review in process, routed for review, inspection pending, or a hold the city placed itself.",
    action: "Wait. The ball is with the city. If it sits here for longer than the typical review window for your project type, call the department.",
  },
  {
    status: "ACTION_REQUIRED",
    label:  "ACTION REQUIRED",
    color:  "#F43F5E",
    means:  "The city has stopped and is waiting on you. Corrections required, additional information requested, applicant revisions, an incomplete application, a failed inspection, or a declined payment. Review does not resume until you respond.",
    action: "Open the permit record today, read the reviewer's comments, and submit what was asked for. Every day this sits is a day added to your timeline.",
  },
  {
    status: "APPROVED",
    label:  "APPROVED",
    color:  "#FF6B00",
    means:  "The permit is issued and active. Inspections may still be ahead, and some cities use it for \"inspections passed, certificate of occupancy still required\".",
    action: "Work can proceed. Schedule inspections as each phase completes.",
  },
  {
    status: "CLEARED",
    label:  "CLEARED",
    color:  "#16A34A",
    means:  "The final inspection passed and the permit is closed out, or the certificate of occupancy was issued. The job is done as far as the city is concerned.",
    action: "Keep the record for the property file. Nothing further is owed to the city on this permit.",
  },
  {
    status: "REJECTED",
    label:  "REJECTED",
    color:  "#DC2626",
    means:  "Denied, withdrawn, cancelled, voided or revoked. The application will not become a permit in its current form.",
    action: "Read the denial reason. Most cities allow a corrected resubmittal or a new application.",
  },
  {
    status: "EXPIRED",
    label:  "EXPIRED",
    color:  "#6B7280",
    means:  "The permit or application lapsed before the work was finaled. Cities expire permits when no inspection is called for a set period, often 180 days.",
    action: "Contact the department about reinstatement or a renewal permit before doing any further work.",
  },
  {
    status: "UNKNOWN",
    label:  "UNKNOWN",
    color:  "#6B7280",
    means:  "The city returned a status we have not classified yet. The checker shows the city's exact wording next to it so you are never left with just a label.",
    action: "Read the city's own wording. If you see this often for one city, tell us — it usually means the city added a status.",
  },
];

// ── Permit number formats ─────────────────────────────────────────────────────
//
// One verified example per live city, keyed by slug. A city added to
// LIVE_CHECKER_CITIES without an entry here is simply omitted from the list;
// the checker still works for it.

const PERMIT_NUMBER_EXAMPLES: Record<string, string> = {
  austin:       "2026-033822 PP",
  columbus:     "RSWDR2611829",
  cleveland:    "BCH26-032235",
  cincinnati:   "2026P06504",
  philadelphia: "CP-2025-001242",
  pittsburgh:   "BDA-2026-03807",
  seattle:      "7083427-CN",
  detroit:      "BLD2026-01450",
};

// ── FAQ ───────────────────────────────────────────────────────────────────────

const liveList = liveCityList({ separator: ", ", conjunction: "and", format: "abbr" });

const FAQ: { q: string; a: string }[] = [
  {
    q: "Is the permit status check really free?",
    a: `Yes. Pick a city, enter a permit number, and you get the current status straight from the city's own public records. No account, no email, no card. Lookups are limited to five per hour per visitor to keep the tool fast for everyone.`,
  },
  {
    q: "Which cities can I check a permit in?",
    a: `Live status lookup works in ${LIVE_CITY_COUNT} cities: ${liveList}. Each one publishes its permit records through a public open-data API, which is what makes an instant check possible. Other cities have permit guides on this site but no live lookup yet.`,
  },
  {
    q: "Where does the status come from?",
    a: "Directly from each city's open-data feed — the same records the building department publishes. The checker queries the feed at the moment you click, so the result is as current as the city's last data refresh, which is daily for every city we support.",
  },
  {
    q: "What does ACTION REQUIRED mean?",
    a: "It means the city has paused your permit and is waiting on you: corrections required, additional information requested, applicant revisions, an incomplete application, a failed inspection or a declined payment. Nothing moves until you respond. It is shown in red because it is the one status where not knowing costs you days.",
  },
  {
    q: "What is the difference between PENDING, UNDER REVIEW and APPROVED?",
    a: "PENDING means the city has the application but has not issued the permit — including approved-but-not-yet-issued states. UNDER REVIEW means a reviewer or inspector is actively working the file. APPROVED means the permit is issued and work may proceed. Only APPROVED authorises work to start.",
  },
  {
    q: "Why does the checker say my permit was not found?",
    a: "Three common reasons: the number was typed in a different format than the city publishes (see the examples above the checker), the application is very new and has not reached the open-data feed yet — that can take a few days — or the permit belongs to a different jurisdiction, such as a county or a neighbouring city.",
  },
  {
    q: "Can I get an alert when the status changes instead of checking manually?",
    a: `Yes. A free ClearedNo account tracks one permit forever and emails you the moment its status changes, in any of the ${LIVE_CITY_COUNT} live cities. Paid plans track unlimited permits. Checks run every two hours around the clock.`,
  },
];

// ── Structured data ───────────────────────────────────────────────────────────

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ClearedNo Permit Status Checker",
  url: PAGE_URL,
  description: DESCRIPTION,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  areaServed: liveCheckerCities.map((c) => ({
    "@type": "City",
    name: c.name,
    containedInPlace: { "@type": "State", name: c.state },
  })),
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CheckPage() {
  const guideOnlyCities = cities.filter((c) => !LIVE_CHECKER_CITIES.has(c.slug));

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#FF6B00]/20 bg-[#0A0A0A]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/clearedno-icon.png" alt="ClearedNo" width={28} height={28} className="rounded-sm" priority />
            <span className="font-heading text-2xl tracking-widest text-[#FF6B00]">
              CLEARED<span className="text-[#F5F0E8]">NO</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-xs tracking-widest text-[#F5F0E8]/60 hover:text-[#FF6B00] transition-colors uppercase">Log In</Link>
            <Link href="/signup" className="bg-[#FF6B00] text-[#0A0A0A] text-xs font-mono font-bold tracking-widest uppercase px-4 py-2 hover:bg-[#F5F0E8] transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero + checker — the tool is the page, so it sits inside the hero. */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Free Tool · No Signup · {LIVE_CITY_COUNT} Cities</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-5">
            CHECK ANY BUILDING<br />
            PERMIT STATUS —<br />
            <span className="text-[#FF6B00]">FREE, INSTANTLY.</span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-3">
            Enter a permit number and get the real status straight from the city&apos;s own records.
            Live lookup in {liveCityList({ separator: ", ", conjunction: "and", format: "city" })}.
          </p>
          <p className="text-[11px] text-[#F5F0E8]/35 font-mono leading-relaxed max-w-2xl mb-10">
            Number formats:{" "}
            {liveCheckerCities
              .filter((c) => PERMIT_NUMBER_EXAMPLES[c.slug])
              .map((c) => `${c.name} ${PERMIT_NUMBER_EXAMPLES[c.slug]}`)
              .join(" · ")}
          </p>

          <PermitChecker />
        </div>
      </section>

      {/* Conversion moment — right under the result. */}
      <section className="px-6 pb-20">
        <div className="relative max-w-3xl mx-auto border border-[#FF6B00]/30 bg-[#FF6B00]/[0.03] p-8 sm:p-10">
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

          <p className="text-[9px] tracking-[0.35em] text-[#FF6B00]/60 uppercase mb-3">
            Checked it once. Now stop checking.
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] uppercase mb-3">
            Want to be told when this changes?
          </h2>
          <p className="text-sm text-[#F5F0E8]/55 leading-relaxed max-w-xl mb-3">
            Add the permit you just looked up and ClearedNo checks it every two hours, around the
            clock. You get an email the moment the status moves — issued, corrections required,
            cleared — with the city&apos;s own wording and a link to the record.
          </p>
          <p className="text-[10px] text-[#F5F0E8]/40 tracking-wider leading-relaxed max-w-xl mb-7">
            One permit tracked free, forever. No card. Covers{" "}
            {liveCityList({ separator: ", ", conjunction: "and", format: "abbr" })}.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-4 hover:bg-[#F5F0E8] transition-colors"
            >
              TRACK THIS PERMIT FREE <span>→</span>
            </Link>
            <Link
              href="/pricing"
              className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/40 uppercase hover:text-[#FF6B00] transition-colors font-mono"
            >
              Unlimited permits from $79/mo →
            </Link>
          </div>
        </div>
      </section>

      {/* Status glossary */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">What the result means</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] mb-4">
            EVERY PERMIT STATUS, EXPLAINED
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 leading-relaxed max-w-2xl mb-10">
            Cities use dozens of different words for the same handful of situations — Austin says
            &ldquo;Final&rdquo;, Cincinnati says &ldquo;Permit Finaled&rdquo;, Seattle says &ldquo;Completed&rdquo;.
            The checker maps each city&apos;s vocabulary onto the {STATUS_GLOSSARY.length} statuses below and
            shows the city&apos;s exact wording alongside whenever it matters.
          </p>

          <div className="grid gap-px bg-[#FF6B00]/10 border border-[#FF6B00]/20">
            {STATUS_GLOSSARY.map((s) => (
              <div key={s.status} className="bg-[#0A0A0A] p-6 grid md:grid-cols-[180px_1fr] gap-4 md:gap-8">
                <div>
                  <span
                    className="inline-flex items-center gap-2 px-2.5 py-1 text-[10px] font-mono font-medium tracking-widest uppercase"
                    style={{ color: s.color, backgroundColor: `${s.color}1F` }}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full${s.status === "ACTION_REQUIRED" ? " animate-pulse" : ""}`}
                      style={{ backgroundColor: s.color }}
                    />
                    {s.label}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#F5F0E8]/75 leading-relaxed">{s.means}</p>
                  <p className="text-xs text-[#F5F0E8]/45 leading-relaxed">
                    <span className="text-[#FF6B00]/80 font-mono tracking-widest uppercase text-[10px] mr-2">What to do</span>
                    {s.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage — derived */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Live lookup — {LIVE_CITY_COUNT} cities</span>
            </div>
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-6">
              WHERE THE CHECKER WORKS
            </h2>
            <ul className="space-y-2">
              {liveCheckerCities.map((c) => (
                <li key={c.slug} className="flex items-baseline justify-between gap-4 border-b border-[#FF6B00]/10 pb-2">
                  <Link
                    href={`/locations/${c.stateSlug}/${c.slug}`}
                    className="text-sm text-[#F5F0E8]/80 hover:text-[#FF6B00] transition-colors font-mono"
                  >
                    → {c.name}, {c.stateAbbr}
                  </Link>
                  <span className="text-[10px] text-[#F5F0E8]/30 font-mono truncate">{c.buildingDeptName}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[10px] text-[#F5F0E8]/30 leading-relaxed">
              Each of these cities publishes permit records through a public open-data API. That is the
              only way the checker adds a city — no scraping, no guessing.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]/40" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00]/50 uppercase">Guides only — no live lookup yet</span>
            </div>
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8]/70 mb-6">
              PERMIT GUIDES, CHECKER COMING
            </h2>
            <ul className="space-y-2">
              {guideOnlyCities.map((c) => (
                <li key={c.slug} className="border-b border-[#FF6B00]/10 pb-2">
                  <Link
                    href={`/locations/${c.stateSlug}/${c.slug}`}
                    className="text-sm text-[#F5F0E8]/45 hover:text-[#FF6B00] transition-colors font-mono"
                  >
                    → {c.name}, {c.stateAbbr}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[10px] text-[#F5F0E8]/30 leading-relaxed">
              These cities publish permits without a status field, or no per-permit feed at all, so a
              live check is not honest yet. Their pages explain how to check manually and let you join
              a waitlist.{" "}
              <Link href="/suggest-city" className="text-[#FF6B00]/70 hover:text-[#FF6B00]">Request a city →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">FAQ</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] mb-8">
            PERMIT STATUS CHECK — QUESTIONS
          </h2>
          <div>
            {FAQ.map((item) => (
              <details key={item.q} className="group border-b border-[#FF6B00]/20 first:border-t">
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none">
                  <span className="text-sm font-mono text-[#F5F0E8] leading-relaxed">{item.q}</span>
                  <span className="flex-shrink-0 w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00] font-mono text-sm group-open:bg-[#FF6B00]/10 transition-colors">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:block">−</span>
                  </span>
                </summary>
                <p className="pb-5 text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 px-6 border-t border-[#FF6B00]/10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-5xl tracking-widest text-[#F5F0E8] mb-4">
            STOP CHECKING.<br /><span className="text-[#FF6B00]">START BUILDING.</span>
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8">
            One permit free, forever. No card. Cancel anytime.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-12 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            GET PERMIT ALERTS FREE <span>→</span>
          </Link>
          <p className="mt-4 text-[10px] text-[#F5F0E8]/25 tracking-widest">
            Monitoring {liveCityList({ separator: " · ", format: "abbr" })}
          </p>
        </div>
      </section>

      <footer className="border-t border-[#FF6B00]/10 px-6 py-8 text-center">
        <p className="text-[10px] text-[#F5F0E8]/20 tracking-widest">
          © {new Date().getFullYear()} ClearedNo ·{" "}
          <Link href="/privacy" className="hover:text-[#FF6B00] transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-[#FF6B00] transition-colors">Terms</Link>
          {" · "}
          <Link href="/" className="hover:text-[#FF6B00] transition-colors">Home</Link>
          {" · "}
          <Link href="/locations" className="hover:text-[#FF6B00] transition-colors">All Cities</Link>
          {" · "}
          <Link href="/tools/permit-fee-calculator" className="hover:text-[#FF6B00] transition-colors">Fee Calculator</Link>
          {" · "}
          <Link href="/tools/permit-timeline-estimator" className="hover:text-[#FF6B00] transition-colors">Timeline Estimator</Link>
        </p>
      </footer>
    </div>
  );
}
