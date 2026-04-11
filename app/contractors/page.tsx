import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contractor Permit Tracking by Trade & City | ClearedNo",
  description:
    "ClearedNo monitors building permit status 24/7 for roofing, electrical, plumbing, HVAC, general, and remodeling contractors across 11 cities. Get instant alerts when your permit is approved.",
  alternates: { canonical: "https://www.clearedno.com/contractors" },
  openGraph: {
    title: "Contractor Permit Tracking by Trade & City | ClearedNo",
    description:
      "Instant permit status alerts for contractors in 11 cities. Stop manually checking the portal.",
    url: "https://www.clearedno.com/contractors",
    type: "website",
    images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
  },
};

const TRADES = [
  { slug: "roofing",             label: "Roofing",            plural: "Roofing Contractors" },
  { slug: "electrical",          label: "Electrical",         plural: "Electrical Contractors" },
  { slug: "plumbing",            label: "Plumbing",           plural: "Plumbing Contractors" },
  { slug: "hvac",                label: "HVAC",               plural: "HVAC Contractors" },
  { slug: "general-contractor",  label: "General Contractor", plural: "General Contractors" },
  { slug: "remodeling",          label: "Remodeling",         plural: "Remodeling Contractors" },
];

const CITIES = [
  { slug: "austin-tx",       name: "Austin",        state: "TX" },
  { slug: "dallas-tx",       name: "Dallas",        state: "TX" },
  { slug: "houston-tx",      name: "Houston",       state: "TX" },
  { slug: "san-antonio-tx",  name: "San Antonio",   state: "TX" },
  { slug: "columbus-oh",     name: "Columbus",      state: "OH" },
  { slug: "philadelphia-pa", name: "Philadelphia",  state: "PA" },
  { slug: "grand-rapids-mi", name: "Grand Rapids",  state: "MI" },
  { slug: "cleveland-oh",    name: "Cleveland",     state: "OH" },
  { slug: "pittsburgh-pa",   name: "Pittsburgh",    state: "PA" },
  { slug: "detroit-mi",      name: "Detroit",       state: "MI" },
  { slug: "cincinnati-oh",   name: "Cincinnati",    state: "OH" },
];

export default function ContractorsIndexPage() {
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">
              For Contractors
            </span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-6">
            PERMIT TRACKING<br />
            <span className="text-[#FF6B00]">BY TRADE.</span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-8">
            ClearedNo monitors building permit status 24/7 across 11 cities. Pick your
            trade and city — get an instant alert the moment your permit is approved or
            updated. Stop manually checking the portal.
          </p>
          <div className="flex flex-wrap gap-2">
            {TRADES.map((t) => (
              <span
                key={t.slug}
                className="text-[10px] tracking-widest text-[#F5F0E8]/40 border border-[#FF6B00]/20 px-3 py-1 font-mono uppercase"
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trade sections */}
      <section className="pb-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto space-y-16 pt-16">
          {TRADES.map((trade) => (
            <div key={trade.slug}>
              <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-2">
                {trade.plural.toUpperCase()}
              </h2>
              <p className="text-xs text-[#F5F0E8]/40 font-mono mb-6">
                {CITIES.length} cities — select yours
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {CITIES.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/contractors/${trade.slug}/${city.slug}`}
                    className="group border border-[#FF6B00]/20 px-4 py-3 hover:border-[#FF6B00]/60 hover:bg-[#FF6B00]/5 transition-all"
                  >
                    <div className="text-[10px] tracking-widest text-[#FF6B00] font-mono uppercase mb-1">
                      {city.state}
                    </div>
                    <div className="text-sm font-heading tracking-widest text-[#F5F0E8] group-hover:text-[#FF6B00] transition-colors">
                      {city.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
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
            MONITOR MY PERMITS FREE <span>→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#FF6B00]/10 px-6 py-8 text-center">
        <p className="text-[10px] text-[#F5F0E8]/20 tracking-widest">
          © 2026 ClearedNo ·{" "}
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
