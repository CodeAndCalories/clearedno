import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cities, getCitiesByState, isLiveCheckerCity, liveStateList, LIVE_CITY_COUNT } from "@/lib/cities";

const PAGE_URL = "https://www.clearedno.com/locations";

export const metadata: Metadata = {
  title: `Building Permit Status by City — Track Permits in ${LIVE_CITY_COUNT} Cities | ClearedNo`,
  description: `Check building permit status and typical approval timelines by city. Building department contacts, portal links, and automated permit tracking in ${LIVE_CITY_COUNT} US cities across ${liveStateList()}.`,
  keywords: [
    "building permit status by city",
    "permit tracking by city",
    "building department directory",
    "permit approval times by city",
    "check building permit status",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Building Permit Status by City | ClearedNo",
    description: `Permit timelines, building department contacts, and automated status tracking in ${LIVE_CITY_COUNT} cities across ${liveStateList()}.`,
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "Building Permit Status by City | ClearedNo",
    description: `Permit timelines and building department contacts, with automated tracking in ${LIVE_CITY_COUNT} US cities.`,
    images: ["/clearedno-icon.png"],
  },
};

export default function LocationsHubPage() {
  const groups = getCitiesByState();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Building Permit Status by City",
    description:
      "Cities with building permit status tracking, timelines, and building department details on ClearedNo.",
    numberOfItems: cities.length,
    itemListElement: cities.map((city, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${city.name}, ${city.stateAbbr} Building Permits`,
      url: `https://www.clearedno.com/locations/${city.stateSlug}/${city.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.clearedno.com" },
      { "@type": "ListItem", position: 2, name: "Permit Status by City", item: PAGE_URL },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
            <Link
              href="/login"
              className="hidden sm:block text-xs tracking-widest text-[#F5F0E8]/60 hover:text-[#FF6B00] transition-colors uppercase"
            >
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
              {cities.length} Cities Tracked
            </span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-6">
            BUILDING PERMIT<br />
            <span className="text-[#FF6B00]">STATUS BY CITY</span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-8">
            Every city runs its own permit portal, its own review queue, and its own definition of
            what &ldquo;approved&rdquo; means. Pick your city below for building department contacts,
            typical approval timelines, and a free permit status check.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors"
            >
              START TRACKING FREE <span>→</span>
            </Link>
            <Link
              href="/permits"
              className="inline-flex items-center gap-3 border border-[#FF6B00]/40 text-[#F5F0E8]/70 font-mono text-sm tracking-widest uppercase px-10 py-5 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors"
            >
              PERMIT COSTS &amp; TYPES <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* City groups by state */}
      {groups.map((group) => (
        <section key={group.state} className="py-14 px-6 border-t border-[#FF6B00]/10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8]">
                {group.state.toUpperCase()}
              </h2>
              <span className="text-[10px] tracking-[0.25em] text-[#F5F0E8]/25 font-mono uppercase">
                {group.cities.length} {group.cities.length === 1 ? "city" : "cities"}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {group.cities.map((city) => {
                const fastest = city.timelines[0];
                return (
                  <Link
                    key={city.slug}
                    href={`/locations/${city.stateSlug}/${city.slug}`}
                    className="group border border-[#FF6B00]/20 p-6 relative hover:border-[#FF6B00]/60 transition-colors"
                  >
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF6B00]/40 group-hover:border-[#FF6B00] transition-colors -translate-x-px -translate-y-px" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF6B00]/40 group-hover:border-[#FF6B00] transition-colors translate-x-px translate-y-px" />

                    <div className="flex items-baseline justify-between gap-3 mb-3">
                      <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] group-hover:text-[#FF6B00] transition-colors">
                        {city.name.toUpperCase()}
                      </h3>
                      <span className="text-[10px] tracking-[0.25em] font-mono uppercase flex-shrink-0 flex items-center gap-2">
                        {/* Derived badge — a card must never imply tracking we lack. */}
                        <span
                          className={
                            isLiveCheckerCity(city.slug)
                              ? "text-[#16A34A]/80 text-[9px]"
                              : "text-[#F5F0E8]/25 text-[9px]"
                          }
                        >
                          {isLiveCheckerCity(city.slug) ? "tracked" : "guide only"}
                        </span>
                        <span className="text-[#FF6B00]">{city.stateAbbr}</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#F5F0E8]/50 leading-relaxed mb-4">{city.summary}</p>

                    <div className="border-t border-[#FF6B00]/10 pt-3 space-y-1.5">
                      <div className="flex justify-between gap-3">
                        <span className="text-[10px] text-[#F5F0E8]/30 font-mono uppercase tracking-widest flex-shrink-0">
                          Dept
                        </span>
                        <span className="text-[10px] text-[#F5F0E8]/60 font-mono text-right">
                          {city.buildingDeptName}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-[10px] text-[#F5F0E8]/30 font-mono uppercase tracking-widest flex-shrink-0">
                          {fastest.type}
                        </span>
                        <span className="text-[10px] text-[#FF6B00] font-mono font-bold text-right">
                          {fastest.time}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-[10px] tracking-[0.25em] text-[#F5F0E8]/40 font-mono uppercase group-hover:text-[#FF6B00] transition-colors">
                      Check {city.name} permit status →
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* Request a city */}
      <section className="py-14 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <div className="border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-6 relative">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
            <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">
              DON&apos;T SEE YOUR CITY?
            </h2>
            <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4 max-w-2xl">
              We add cities based on contractor demand. Tell us where you pull permits and we&apos;ll
              prioritise that building department next.
            </p>
            <Link
              href="/suggest-city"
              className="inline-block border border-[#FF6B00]/40 text-[#F5F0E8]/70 font-mono text-xs tracking-widest uppercase px-8 py-3 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors"
            >
              Request Your City →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[#FF6B00]/10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-5xl tracking-widest text-[#F5F0E8] mb-4">
            STOP CHECKING.<br />
            <span className="text-[#FF6B00]">START BUILDING.</span>
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8">
            One permit free, forever. No card. Cancel anytime.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-12 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            MONITOR MY PERMITS FREE <span>→</span>
          </Link>
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
          <Link href="/suggest-city" className="hover:text-[#FF6B00] transition-colors">Request a City</Link>
        </p>
      </footer>
    </div>
  );
}
