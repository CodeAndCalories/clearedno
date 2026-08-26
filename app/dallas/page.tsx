import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PermitChecker } from "@/app/components/permit-checker";
import { CityWaitlistCTA } from "@/app/components/city-waitlist-cta";
import { liveCityList } from "@/lib/cities";

// Dallas has no permit-status API — Dallas publishes permits but no status
// field — so nothing on this page may promise automated tracking. It stays a
// guide page plus a waitlist capture until that changes.
export const metadata: Metadata = {
  title: "Dallas TX Building Permit Status — How to Check | ClearedNo",
  description:
    "How to check a Dallas building permit status through Planning and Development, plus typical approval timelines. Automated tracking isn't available in Dallas yet — join the waitlist.",
  keywords: [
    "Dallas permit tracking", "Dallas building permit status", "check permit status Dallas",
    "Dallas TX permit monitoring", "Dallas Planning and Development", "Dallas Development Services", "Dallas permit cleared",
  ],
  alternates: { canonical: "https://www.clearedno.com/dallas" },
  openGraph: {
    title: "Dallas TX Building Permit Status — How to Check | ClearedNo",
    description: "How to check a Dallas building permit status, and how long Dallas approvals actually take.",
    url: "https://www.clearedno.com/dallas",
    type: "website",
    images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ClearedNo — Dallas TX Permit Guide",
  description:
    "Building permit status guide and approval timelines for Dallas, Texas contractors. Automated monitoring is not yet available in Dallas.",
  url: "https://www.clearedno.com/dallas",
  areaServed: { "@type": "City", name: "Dallas", containedInPlace: { "@type": "State", name: "Texas" } },
  serviceType: "Building Permit Information",
};

export default function DallasPage() {
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
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Dallas, TX</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-6">
            DALLAS<br />
            <span className="text-[#FF6B00]">BUILDING PERMIT</span><br />
            STATUS GUIDE.
          </h1>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-8">
            Dallas Planning and Development doesn&apos;t send permit status alerts, so Dallas
            permits have to be checked by hand. Automated tracking isn&apos;t available in Dallas
            yet — Dallas publishes permit records but no status field we can poll. Get notified
            when it launches.
          </p>
          <Link
            href="#waitlist"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            NOTIFY ME WHEN DALLAS LAUNCHES <span>→</span>
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
            Live Dallas status data isn&apos;t wired up yet. Our free lookup covers{" "}
            {liveCityList({ separator: ", ", conjunction: "and" })}.
          </p>
          <PermitChecker defaultCity="dallas" />
        </div>
      </section>

      {/* City Info */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-6">
              DALLAS PERMIT PORTAL INFO
            </h2>
            <div className="space-y-4 text-sm text-[#F5F0E8]/60 leading-relaxed">
              <p>
                Dallas uses the <strong className="text-[#F5F0E8]">DallasNow portal</strong>, run by the
                Planning and Development Department{" "}
                at <a href="https://dallascityhall.com/departments/planning-and-development" target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] hover:underline">dallascityhall.com</a>.
                It handles building, mechanical, electrical, and plumbing permits for the city of
                Dallas only — Plano, Irving, Garland, Mesquite, Richardson, and Carrollton each run
                separate permit systems, so confirm which city your job site falls in before applying.
              </p>
              <div className="border border-[#FF6B00]/20 p-4">
                <div className="text-[10px] tracking-[0.2em] text-[#FF6B00] uppercase mb-3">Typical Dallas Permit Timelines</div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">Simple remodel / repair</span><span className="text-[#FF6B00]">1–2 weeks</span></div>
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">New residential build</span><span className="text-[#FF6B00]">4–10 weeks</span></div>
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">Commercial tenant improvement</span><span className="text-[#FF6B00]">4–8 weeks</span></div>
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">New commercial construction</span><span className="text-[#FF6B00]">8–14 weeks</span></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-6">
              TIPS FOR DALLAS CONTRACTORS
            </h2>
            <div className="space-y-4">
              {[
                { tip: "Plan your inspections early", detail: "Dallas inspection queues can back up 1–2 weeks. Schedule as soon as you know the inspection is coming, not the day before." },
                { tip: "Check the trade permit status separately", detail: "Electrical, plumbing, and mechanical permits are tracked separately from the main building permit. Make sure all trade permits are also cleared before starting work." },
                { tip: "Get your COA early", detail: "If your project requires a Certificate of Occupancy, apply as soon as the final inspection is passed — Dallas COA processing adds additional time." },
                { tip: "Use Dallas 311 for escalation", detail: "If your permit has been sitting 'under review' for longer than expected, call Dallas 311 and ask to speak with the Planning and Development permit technician." },
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

      {/* Waitlist — the testimonial that sat here quoted a Dallas contractor
          getting alerts we have never been able to send. */}
      <div id="waitlist" className="scroll-mt-20 border-t border-[#FF6B00]/10">
        <CityWaitlistCTA cityName="Dallas" citySlug="dallas" />
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
