import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

// ─── Static data ──────────────────────────────────────────────────────────────

const TRADES = [
  "roofing",
  "electrical",
  "plumbing",
  "hvac",
  "general-contractor",
  "remodeling",
];

const CITIES = [
  "austin-tx",
  "dallas-tx",
  "houston-tx",
  "san-antonio-tx",
  "columbus-oh",
  "philadelphia-pa",
  "grand-rapids-mi",
  "cleveland-oh",
  "pittsburgh-pa",
  "detroit-mi",
  "cincinnati-oh",
];

type TradeMeta = {
  label: string;
  plural: string;
  trade: string;    // used in sentence ("a roofing contractor")
  adjective: string; // "roofing", "electrical", etc.
};

const TRADE_META: Record<string, TradeMeta> = {
  "roofing": {
    label: "Roofing",
    plural: "Roofing Contractors",
    trade: "roofing contractor",
    adjective: "roofing",
  },
  "electrical": {
    label: "Electrical",
    plural: "Electrical Contractors",
    trade: "electrical contractor",
    adjective: "electrical",
  },
  "plumbing": {
    label: "Plumbing",
    plural: "Plumbing Contractors",
    trade: "plumbing contractor",
    adjective: "plumbing",
  },
  "hvac": {
    label: "HVAC",
    plural: "HVAC Contractors",
    trade: "HVAC contractor",
    adjective: "HVAC",
  },
  "general-contractor": {
    label: "General Contractor",
    plural: "General Contractors",
    trade: "general contractor",
    adjective: "general contracting",
  },
  "remodeling": {
    label: "Remodeling",
    plural: "Remodeling Contractors",
    trade: "remodeling contractor",
    adjective: "remodeling",
  },
};

const CITY_META: Record<string, { name: string; state: string; stateFull: string }> = {
  "austin-tx":       { name: "Austin",       state: "TX", stateFull: "Texas" },
  "dallas-tx":       { name: "Dallas",       state: "TX", stateFull: "Texas" },
  "houston-tx":      { name: "Houston",      state: "TX", stateFull: "Texas" },
  "san-antonio-tx":  { name: "San Antonio",  state: "TX", stateFull: "Texas" },
  "columbus-oh":     { name: "Columbus",     state: "OH", stateFull: "Ohio" },
  "philadelphia-pa": { name: "Philadelphia", state: "PA", stateFull: "Pennsylvania" },
  "grand-rapids-mi": { name: "Grand Rapids", state: "MI", stateFull: "Michigan" },
  "cleveland-oh":    { name: "Cleveland",    state: "OH", stateFull: "Ohio" },
  "pittsburgh-pa":   { name: "Pittsburgh",   state: "PA", stateFull: "Pennsylvania" },
  "detroit-mi":      { name: "Detroit",      state: "MI", stateFull: "Michigan" },
  "cincinnati-oh":   { name: "Cincinnati",   state: "OH", stateFull: "Ohio" },
};

const PERMIT_TYPES = [
  { slug: "deck-permit",       label: "Deck Permit" },
  { slug: "roof-permit",       label: "Roof Permit" },
  { slug: "fence-permit",      label: "Fence Permit" },
  { slug: "addition-permit",   label: "Addition Permit" },
  { slug: "new-construction",  label: "New Construction" },
  { slug: "electrical-permit", label: "Electrical Permit" },
  { slug: "plumbing-permit",   label: "Plumbing Permit" },
];

// ─── generateStaticParams: 6 trades × 11 cities = 66 pages ───────────────────

export function generateStaticParams() {
  const params: Array<{ trade: string; city: string }> = [];
  for (const trade of TRADES) {
    for (const city of CITIES) {
      params.push({ trade, city });
    }
  }
  return params;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export function generateMetadata({
  params,
}: {
  params: { trade: string; city: string };
}): Metadata {
  const tradeMeta = TRADE_META[params.trade];
  const cityMeta = CITY_META[params.city];
  if (!tradeMeta || !cityMeta) return {};

  const title = `${cityMeta.name} ${tradeMeta.plural} — Track Your Permits 24/7 | ClearedNo`;
  const description = `${cityMeta.name} ${tradeMeta.adjective} contractors: stop manually checking the permit portal. ClearedNo monitors permit status 24/7 and sends an instant alert the moment your permit is approved.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.clearedno.com/contractors/${params.trade}/${params.city}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.clearedno.com/contractors/${params.trade}/${params.city}`,
      type: "website",
      images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContractorCityPage({
  params,
}: {
  params: { trade: string; city: string };
}) {
  const tradeMeta = TRADE_META[params.trade];
  const cityMeta = CITY_META[params.city];

  if (!tradeMeta || !cityMeta) notFound();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#FF6B00]/20 bg-[#0A0A0A]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/clearedno-icon.png" alt="ClearedNo" width={28} height={28} className="rounded-sm" />
            <span className="font-heading text-2xl tracking-widest text-[#FF6B00]">
              CLEARED<span className="text-[#F5F0E8]">NO</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-xs tracking-widest text-[#F5F0E8]/60 hover:text-[#FF6B00] transition-colors uppercase">
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-[#FF6B00] text-[#0A0A0A] text-xs font-mono font-bold tracking-widest uppercase px-4 py-2 hover:bg-[#F5F0E8] transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-[10px] tracking-widest font-mono text-[#F5F0E8]/30 uppercase">
            <Link href="/contractors" className="hover:text-[#FF6B00] transition-colors">
              Contractors
            </Link>
            <span>/</span>
            <span className="text-[#F5F0E8]/50">{tradeMeta.label}</span>
            <span>/</span>
            <span className="text-[#FF6B00]">{cityMeta.name}</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              {cityMeta.name}, {cityMeta.state}
            </span>
          </div>

          <h1 className="font-heading text-5xl sm:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-6">
            {cityMeta.name.toUpperCase()}<br />
            <span className="text-[#FF6B00]">
              {tradeMeta.plural.toUpperCase()}
            </span>
          </h1>

          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-10">
            If you&apos;re a {tradeMeta.trade} in {cityMeta.name}, permit delays cost
            you money. ClearedNo monitors your permit status 24/7 and sends an instant
            email alert the moment your permit is approved or updated — so you can
            schedule your crew without refreshing the portal.
          </p>

          {/* 3-stat grid */}
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            <div className="border border-[#FF6B00]/20 p-5 text-center">
              <div className="font-mono text-xl font-bold text-[#FF6B00]">11</div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1 font-mono">
                Cities Covered
              </div>
            </div>
            <div className="border border-[#FF6B00]/20 p-5 text-center">
              <div className="font-mono text-xl font-bold text-[#FF6B00]">2 hrs</div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1 font-mono">
                Check Frequency
              </div>
            </div>
            <div className="border border-[#FF6B00]/20 p-5 text-center">
              <div className="font-mono text-xl font-bold text-[#FF6B00]">30 days</div>
              <div className="text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase mt-1 font-mono">
                Free Trial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary CTA */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10 bg-[#FF6B00]/3">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase font-mono mb-2">
              Free for 30 Days
            </div>
            <p className="font-heading text-2xl tracking-widest text-[#F5F0E8]">
              TRACK YOUR {cityMeta.name.toUpperCase()} PERMITS
            </p>
            <p className="text-sm text-[#F5F0E8]/50 mt-1">
              First month free · No charge for 30 days · Cancel anytime
            </p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-8 py-4 hover:bg-[#F5F0E8] transition-colors"
          >
            Track Your {cityMeta.name} Permits Free <span>→</span>
          </Link>
        </div>
      </section>

      {/* Internal links — permit guides for this city */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-2">
            {cityMeta.name.toUpperCase()} PERMIT GUIDES
          </h2>
          <p className="text-sm text-[#F5F0E8]/40 mb-8">
            Requirements, fees, and timelines for every permit type in {cityMeta.name}.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {PERMIT_TYPES.map((pt) => (
              <Link
                key={pt.slug}
                href={`/permits/${params.city}/${pt.slug}`}
                className="group flex items-center justify-between border border-[#FF6B00]/20 px-5 py-4 hover:border-[#FF6B00]/60 hover:bg-[#FF6B00]/5 transition-all"
              >
                <span className="text-sm font-heading tracking-widest text-[#F5F0E8] group-hover:text-[#FF6B00] transition-colors">
                  {pt.label.toUpperCase()}
                </span>
                <span className="text-[10px] tracking-widest text-[#FF6B00]/60 font-mono uppercase">
                  View guide →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-10">
            HOW CLEAREDNO WORKS
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Add Your Permit",
                detail: `Enter your ${cityMeta.name} permit number. ClearedNo starts monitoring immediately.`,
              },
              {
                step: "02",
                title: "We Check Every 2 Hours",
                detail: `ClearedNo polls the ${cityMeta.name} permit portal around the clock so you don't have to.`,
              },
              {
                step: "03",
                title: "Instant Alert",
                detail: "The moment your status changes, you get a text and email. Schedule your crew with confidence.",
              },
            ].map((item) => (
              <div key={item.step} className="border border-[#FF6B00]/20 p-6">
                <div className="font-mono text-2xl text-[#FF6B00] mb-3">{item.step}</div>
                <div className="font-heading text-lg tracking-widest text-[#F5F0E8] mb-2">
                  {item.title.toUpperCase()}
                </div>
                <div className="text-xs text-[#F5F0E8]/50 leading-relaxed">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 border-t border-[#FF6B00]/10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-4xl tracking-widest text-[#F5F0E8] mb-4">
            STOP CHECKING.<br />
            <span className="text-[#FF6B00]">START BUILDING.</span>
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8">
            First month free. Card required, not charged for 30 days. Cancel anytime.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            MONITOR MY {cityMeta.name.toUpperCase()} PERMITS FREE <span>→</span>
          </Link>
        </div>
      </section>

      {/* Back nav */}
      <section className="py-8 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/contractors"
            className="text-xs tracking-widest text-[#F5F0E8]/40 hover:text-[#FF6B00] transition-colors font-mono uppercase"
          >
            ← All Trades & Cities
          </Link>
          <Link
            href={`/permits/${params.city}`}
            className="text-xs tracking-widest text-[#F5F0E8]/40 hover:text-[#FF6B00] transition-colors font-mono uppercase"
          >
            {cityMeta.name} Permit Hub →
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#FF6B00]/10 px-6 py-8 text-center">
        <p className="text-[10px] text-[#F5F0E8]/20 tracking-widest">
          © 2026 ClearedNo ·{" "}
          <Link href="/contractors" className="hover:text-[#FF6B00] transition-colors">Contractors</Link>
          {" · "}
          <Link href="/permits" className="hover:text-[#FF6B00] transition-colors">Permit Encyclopedia</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-[#FF6B00] transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-[#FF6B00] transition-colors">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
