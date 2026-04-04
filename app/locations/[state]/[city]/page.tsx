import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cities, getCityData, getCityDisplayName } from "@/lib/cities";
import { PermitDelayCalculator } from "@/app/components/permit-delay-calculator";

type Props = {
  params: { state: string; city: string };
};

export function generateStaticParams() {
  return cities.map((c) => ({
    state: c.stateSlug,
    city: c.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = getCityData(params.state, params.city);
  if (!city) return {};

  const title = `${city.name} Building Permit Status Tracker | ClearedNo`;
  const description = `Track ${city.name} building permits automatically. Get instant alerts when your ${city.name}, ${city.stateAbbr} permit status changes. Built for contractors.`;
  const url = `https://www.clearedno.com/locations/${city.stateSlug}/${city.slug}`;

  return {
    title,
    description,
    keywords: [
      `${city.name} permit tracking`,
      `${city.name} building permit status`,
      `check permit status ${city.name}`,
      `${city.name} ${city.stateAbbr} permit monitoring`,
      `${city.name} building department`,
      `${city.name} permit cleared`,
      `${city.name.toLowerCase()} permit status check`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description: `Stop manually checking ${city.name}'s permit portal. Get instant alerts when your permit clears.`,
      url,
      type: "website",
      images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/clearedno-icon.png"],
    },
  };
}

export default function LocationCityPage({ params }: Props) {
  const city = getCityData(params.state, params.city);
  if (!city) notFound();

  const pageUrl = `https://www.clearedno.com/locations/${city.stateSlug}/${city.slug}`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `ClearedNo — ${city.name} ${city.stateAbbr} Permit Monitoring`,
    description: `Automated building permit status monitoring for ${city.name}, ${city.state} contractors.`,
    url: pageUrl,
    telephone: city.buildingDeptPhone,
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: { "@type": "State", name: city.state },
    },
    serviceType: "Building Permit Monitoring",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I check a permit in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `You can check a ${city.name} building permit status by visiting the ${city.buildingDeptName} portal or using ClearedNo to get automatic alerts when your permit status changes — no manual checking required.`,
        },
      },
      {
        "@type": "Question",
        name: `How long are permit delays in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${city.name} permit timelines vary by project type. ${city.timelines.map((t) => `${t.type}: ${t.time}`).join(". ")}. Actual times depend on application completeness and department workload.`,
        },
      },
      {
        "@type": "Question",
        name: `How do I track building permit status in ${city.name}, ${city.stateAbbr}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `ClearedNo monitors your ${city.name} permits around the clock and sends an instant alert the moment your permit status changes. Sign up free — first month is on us.`,
        },
      },
      {
        "@type": "Question",
        name: `What happens when a permit clears in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `When a ${city.name} building permit clears, you can begin construction. ClearedNo sends an immediate notification so you can mobilize your crew the same day — avoiding costly delays.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
              {city.name}, {city.stateAbbr}
            </span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-6">
            TRACK YOUR {city.name.toUpperCase()}<br />
            <span className="text-[#FF6B00]">BUILDING PERMITS</span><br />
            IN REAL-TIME.
          </h1>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-8">
            {city.buildingDeptName} doesn&apos;t send alerts when your permit status changes.
            ClearedNo watches it for you — checking around the clock and sending an instant
            notification the moment anything updates.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            AVOID {city.name.toUpperCase()} LATE FEES AND PROJECT DELAYS — START FREE TRIAL <span>→</span>
          </Link>
        </div>
      </section>

      {/* Permit Delay Calculator */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Cost Analysis</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] mb-2">
              HOW MUCH ARE {city.name.toUpperCase()} PERMIT DELAYS COSTING YOU?
            </h2>
            <p className="text-sm text-[#F5F0E8]/50">
              Enter your project value and days delayed to see the real cost.
            </p>
          </div>
          <PermitDelayCalculator />
        </div>
      </section>

      {/* Building Dept Info */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-6">
              {city.name.toUpperCase()} BUILDING DEPARTMENT
            </h2>
            <div className="space-y-5">
              <div className="border border-[#FF6B00]/20 p-5 space-y-4">
                <div>
                  <div className="text-[10px] tracking-[0.2em] text-[#FF6B00] uppercase mb-1 font-mono">Department</div>
                  <div className="text-sm text-[#F5F0E8]/80">{city.buildingDeptName}</div>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.2em] text-[#FF6B00] uppercase mb-1 font-mono">Phone</div>
                  <div className="text-sm text-[#F5F0E8]/80 font-mono">{city.buildingDeptPhone}</div>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.2em] text-[#FF6B00] uppercase mb-1 font-mono">Address</div>
                  <div className="text-sm text-[#F5F0E8]/80">{city.buildingDeptAddress}</div>
                </div>
              </div>

              <div className="border border-[#FF6B00]/20 p-5">
                <div className="text-[10px] tracking-[0.2em] text-[#FF6B00] uppercase mb-3 font-mono">
                  Typical {city.name} Permit Timelines
                </div>
                <div className="space-y-2">
                  {city.timelines.map((t) => (
                    <div key={t.type} className="flex justify-between items-center">
                      <span className="text-xs text-[#F5F0E8]/50 font-mono">{t.type}</span>
                      <span className="text-xs text-[#FF6B00] font-mono font-bold">{t.time}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-[#F5F0E8]/25">
                  * Estimates based on city averages. Actual times vary by project type and workload.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-6">
              WHY CONTRACTORS USE CLEAREDNO
            </h2>
            <div className="space-y-4">
              {[
                {
                  tip: "Stop checking the portal manually",
                  detail: `${city.buildingDeptName} doesn't push updates. ClearedNo polls it around the clock and alerts you within hours of any change.`,
                },
                {
                  tip: "Know the moment your permit clears",
                  detail: "Mobilize your crew the same day your permit clears instead of finding out 48 hours later — or never.",
                },
                {
                  tip: "Track unlimited permits in one place",
                  detail: "One $79/mo subscription covers every permit in your pipeline — no per-permit fees, no caps.",
                },
                {
                  tip: "First month completely free",
                  detail: "Start tracking today. Card required but not charged for 30 days. Cancel anytime with one click.",
                },
              ].map((item) => (
                <div key={item.tip} className="border-l-2 border-[#FF6B00]/40 pl-4">
                  <div className="text-xs font-mono font-bold text-[#FF6B00] mb-1">{item.tip}</div>
                  <div className="text-xs text-[#F5F0E8]/50 leading-relaxed">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Internal Link Cloud */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Also Monitoring</span>
          </div>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-6">
            PERMIT TRACKING IN NEARBY CITIES
          </h2>
          <div className="flex flex-wrap gap-3">
            {city.neighbors.map((neighborPath) => (
              <Link
                key={neighborPath}
                href={neighborPath}
                className="border border-[#FF6B00]/30 text-[#F5F0E8]/70 text-xs font-mono tracking-widest uppercase px-4 py-2 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
              >
                {getCityDisplayName(neighborPath)} Permits →
              </Link>
            ))}
            <Link
              href="/suggest-city"
              className="border border-[#FF6B00]/10 text-[#F5F0E8]/30 text-xs font-mono tracking-widest uppercase px-4 py-2 hover:border-[#FF6B00]/40 hover:text-[#F5F0E8]/60 transition-colors"
            >
              Request Your City →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ (visible) */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">FAQ</span>
          </div>
          <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-8">
            {city.name.toUpperCase()} PERMIT QUESTIONS
          </h2>
          <div className="space-y-0">
            {[
              {
                q: `How do I check a permit in ${city.name}?`,
                a: `Visit the ${city.buildingDeptName} at ${city.buildingDeptUrl} to look up a permit manually, or sign up for ClearedNo to get automatic alerts — no manual checking required.`,
              },
              {
                q: `How long are permit delays in ${city.name}?`,
                a: `${city.name} permit timelines vary: ${city.timelines.map((t) => `${t.type} typically takes ${t.time}`).join("; ")}. Actual timelines depend on application completeness and current department workload.`,
              },
              {
                q: `How do I track building permit status in ${city.name}, ${city.stateAbbr}?`,
                a: `ClearedNo monitors your ${city.name} permits around the clock and sends an instant alert the moment your permit status changes. Sign up free — first month is on us, no charge for 30 days.`,
              },
              {
                q: `What happens when a permit clears in ${city.name}?`,
                a: `When a ${city.name} building permit clears, you have authorization to begin construction. ClearedNo sends you an immediate notification so you can mobilize your crew the same day — not 48 hours later.`,
              },
            ].map((item, i) => (
              <details key={i} className="group border-b border-[#FF6B00]/20 first:border-t">
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

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[#FF6B00]/10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-5xl tracking-widest text-[#F5F0E8] mb-4">
            STOP CHECKING.<br /><span className="text-[#FF6B00]">START BUILDING.</span>
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8">
            First month free. Card required, not charged for 30 days. Cancel anytime.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-12 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            AVOID {city.name.toUpperCase()} LATE FEES — START FREE <span>→</span>
          </Link>
          <p className="mt-4 text-[10px] text-[#F5F0E8]/25 tracking-widest">
            Monitoring contractors in {city.state} and beyond
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
          <Link href="/suggest-city" className="hover:text-[#FF6B00] transition-colors">Request a City</Link>
        </p>
      </footer>
    </div>
  );
}
