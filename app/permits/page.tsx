import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cities, isLiveCheckerCity, liveCityList } from "@/lib/cities";

export const metadata: Metadata = {
  title: "Building Permit Encyclopedia — Requirements, Fees & Timelines | ClearedNo",
  description:
    "Find building permit requirements, base fees, and approval timelines for 7 cities. Deck permits, roof permits, additions, new construction, electrical, plumbing, and more.",
  alternates: { canonical: "https://www.clearedno.com/permits" },
  openGraph: {
    title: "Building Permit Encyclopedia | ClearedNo",
    description:
      "Requirements, fees, and timelines for building permits across 7 cities.",
    url: "https://www.clearedno.com/permits",
    type: "website",
    images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
  },
};

// Guides exist for every city; `live` marks the ones we can also track.
const CITIES = cities.map((c) => ({
  slug:  `${c.slug}-${c.stateSlug}`,
  name:  c.name,
  state: c.stateAbbr,
  types: 7,
  live:  isLiveCheckerCity(c.slug),
}));

const PROJECT_TYPES = [
  "Deck Permit",
  "Roof Permit",
  "Fence Permit",
  "Addition Permit",
  "New Construction",
  "Electrical Permit",
  "Plumbing Permit",
];

export default function PermitsIndexPage() {
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
              Start Free
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
              Permit Encyclopedia
            </span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-6">
            BUILDING PERMIT<br />
            <span className="text-[#FF6B00]">REQUIREMENTS</span><br />
            BY CITY.
          </h1>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-8">
            Everything you need to know before you pull a permit — fees, timelines,
            required documents, and links to official portals — for every major
            project type across our covered cities.
          </p>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map((t) => (
              <span
                key={t}
                className="text-[10px] tracking-widest text-[#F5F0E8]/40 border border-[#FF6B00]/20 px-3 py-1 font-mono uppercase"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* City Grid */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-2">
            SELECT A CITY
          </h2>
          <p className="text-sm text-[#F5F0E8]/40 mb-10">
            {CITIES.length} cities covered · {CITIES.length * 7} permit guides total
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/permits/${city.slug}`}
                className="group border border-[#FF6B00]/20 p-6 hover:border-[#FF6B00]/60 hover:bg-[#FF6B00]/5 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase font-mono">
                    {city.state}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase tracking-widest ${
                      city.live ? "text-[#16A34A]/70" : "text-[#F5F0E8]/25"
                    }`}
                  >
                    {city.live ? "tracked" : "guide only"}
                  </span>
                </div>
                <div className="font-heading text-2xl tracking-widest text-[#F5F0E8] group-hover:text-[#FF6B00] transition-colors mb-3">
                  {city.name.toUpperCase()}
                </div>
                <div className="text-xs text-[#F5F0E8]/40 font-mono">
                  {city.types} permit types →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[#FF6B00]/10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-4xl tracking-widest text-[#F5F0E8] mb-4">
            KNOW THE RULES.<br />
            <span className="text-[#FF6B00]">TRACK YOUR PERMIT.</span>
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8">
            Once you&apos;ve submitted, ClearedNo watches the portal and alerts you the
            moment your status changes. Automated tracking is live in{" "}
            {liveCityList({ separator: ", ", conjunction: "and", format: "city" })}.
            Track one permit free, forever.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            START MONITORING MY PERMITS <span>→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#FF6B00]/10 px-6 py-8 text-center">
        <p className="text-[10px] text-[#F5F0E8]/20 tracking-widest">
          © 2026 ClearedNo ·{" "}
          <Link href="/privacy" className="hover:text-[#FF6B00] transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-[#FF6B00] transition-colors">Terms</Link>
          {" · "}
          <Link href="/locations" className="hover:text-[#FF6B00] transition-colors">Permit Status by City</Link>
          {" · "}
          <Link href="/" className="hover:text-[#FF6B00] transition-colors">Home</Link>
        </p>
      </footer>
    </div>
  );
}
