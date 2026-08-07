import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PermitChecker } from "@/app/components/permit-checker";
import { CityWaitlistCTA } from "@/app/components/city-waitlist-cta";
import { liveCityList } from "@/lib/cities";

// Houston publishes no per-permit status API, so there is no automated Houston
// tracking to sell. This page is a guide plus a waitlist capture.
export const metadata: Metadata = {
  title: "Houston TX Building Permit Status — How to Check | ClearedNo",
  description:
    "How to check a Houston building permit status through the Houston Permitting Center, plus typical approval timelines. Automated tracking isn't available in Houston yet — join the waitlist.",
  keywords: [
    "Houston permit tracking", "Houston building permit status", "check permit status Houston",
    "Houston TX permit monitoring", "Houston permitting center", "Houston permit cleared",
  ],
  alternates: { canonical: "https://www.clearedno.com/houston" },
  openGraph: {
    title: "Houston TX Building Permit Status — How to Check | ClearedNo",
    description: "How to check a Houston building permit status, and how long Houston approvals actually take.",
    url: "https://www.clearedno.com/houston",
    type: "website",
    images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ClearedNo — Houston TX Permit Guide",
  description:
    "Building permit status guide and approval timelines for Houston, Texas contractors. Automated monitoring is not yet available in Houston.",
  url: "https://www.clearedno.com/houston",
  areaServed: { "@type": "City", name: "Houston", containedInPlace: { "@type": "State", name: "Texas" } },
  serviceType: "Building Permit Information",
};

export default function HoustonPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
            <Link href="/login" className="hidden sm:block text-xs tracking-widest text-[#F5F0E8]/60 hover:text-[#FF6B00] transition-colors uppercase">Log In</Link>
            <Link href="/signup" className="bg-[#FF6B00] text-[#0A0A0A] text-xs font-mono font-bold tracking-widest uppercase px-4 py-2 hover:bg-[#F5F0E8] transition-colors">
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
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Houston, TX</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-6">
            HOUSTON<br />
            <span className="text-[#FF6B00]">BUILDING PERMIT</span><br />
            STATUS GUIDE.
          </h1>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-8">
            Houston&apos;s permitting center handles one of the largest construction markets in the
            U.S., and it doesn&apos;t push status alerts. Automated tracking isn&apos;t available in
            Houston yet — the city publishes no per-permit status API we can poll. Get notified
            when it launches.
          </p>
          <Link
            href="#waitlist"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            NOTIFY ME WHEN HOUSTON LAUNCHES <span>→</span>
          </Link>
        </div>
      </section>

      {/* Free Checker */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] mb-2">
            PERMIT LOOKUP
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8">
            Live Houston status data isn&apos;t wired up yet. Our free lookup covers{" "}
            {liveCityList({ separator: ", ", conjunction: "and" })}.
          </p>
          <PermitChecker defaultCity="houston" />
        </div>
      </section>

      {/* City Info */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-6">
              HOUSTON PERMIT PORTAL INFO
            </h2>
            <div className="space-y-4 text-sm text-[#F5F0E8]/60 leading-relaxed">
              <p>
                Houston uses the <strong className="text-[#F5F0E8]">Houston Permitting Center</strong>{" "}
                at <a href="https://www.houstonpermittingcenter.org" target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] hover:underline">houstonpermittingcenter.org</a>.
                Houston is one of the few major U.S. cities without zoning laws, making the permitting
                process unique — but no less time-consuming to monitor.
              </p>
              <div className="border border-[#FF6B00]/20 p-4">
                <div className="text-[10px] tracking-[0.2em] text-[#FF6B00] uppercase mb-3">Typical Houston Permit Timelines</div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">Simple remodel / repair</span><span className="text-[#FF6B00]">1–2 weeks</span></div>
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">New residential build</span><span className="text-[#FF6B00]">3–8 weeks</span></div>
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">Commercial tenant improvement</span><span className="text-[#FF6B00]">3–6 weeks</span></div>
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">New commercial construction</span><span className="text-[#FF6B00]">6–12 weeks</span></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-6">
              TIPS FOR HOUSTON CONTRACTORS
            </h2>
            <div className="space-y-4">
              {[
                { tip: "\"Issued\" in Houston means approved and active", detail: "In Houston, a status of \"Issued\" means your permit is approved and construction can begin — unlike some cities where \"Issued\" means it's still being processed." },
                { tip: "Book inspections before the permit clears", detail: "Houston inspectors are in high demand. Call to schedule your rough-in and final inspections before your permit is fully approved to avoid backlog delays." },
                { tip: "No zoning = faster starts, same permit process", detail: "While Houston has no zoning, you still need permits for most construction. The lack of zoning reviews can speed things up, but plan review is still required." },
                { tip: "Check flood zone status first", detail: "Houston has extensive flood zone designations. Projects in flood-prone areas need additional review from the Harris County Flood Control District, which can add weeks." },
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

      {/* Waitlist — the testimonial that sat here quoted a Houston contractor
          getting alerts we have never been able to send. */}
      <div id="waitlist" className="scroll-mt-20 border-t border-[#FF6B00]/10">
        <CityWaitlistCTA cityName="Houston" citySlug="houston" />
      </div>

      <section className="pb-20 px-6 text-center">
        <p className="text-[10px] text-[#F5F0E8]/25 tracking-widest">
          Automated tracking is live in: {liveCityList()}
        </p>
      </section>

      <footer className="border-t border-[#FF6B00]/10 px-6 py-8 text-center">
        <p className="text-[10px] text-[#F5F0E8]/20 tracking-widest">
          © 2026 ClearedNo ·{" "}
          <Link href="/privacy" className="hover:text-[#FF6B00] transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-[#FF6B00] transition-colors">Terms</Link>
          {" · "}
          <Link href="/" className="hover:text-[#FF6B00] transition-colors">Home</Link>
        </p>
      </footer>
    </div>
  );
}
