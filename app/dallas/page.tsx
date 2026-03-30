import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PermitChecker } from "@/app/components/permit-checker";

export const metadata: Metadata = {
  title: "Dallas TX Building Permit Tracking | ClearedNo",
  description:
    "Track your Dallas building permits automatically. Get instant alerts when your Dallas permit status changes. Built for Texas contractors.",
  keywords: [
    "Dallas permit tracking", "Dallas building permit status", "check permit status Dallas",
    "Dallas TX permit monitoring", "Dallas Development Services", "Dallas permit cleared",
  ],
  alternates: { canonical: "https://www.clearedno.com/dallas" },
  openGraph: {
    title: "Dallas TX Building Permit Tracking | ClearedNo",
    description: "Stop manually checking Dallas Development Services. Get instant alerts when your permit clears.",
    url: "https://www.clearedno.com/dallas",
    type: "website",
    images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ClearedNo — Dallas TX Permit Monitoring",
  description: "Automated building permit status monitoring for Dallas, Texas contractors.",
  url: "https://www.clearedno.com/dallas",
  areaServed: { "@type": "City", name: "Dallas", containedInPlace: { "@type": "State", name: "Texas" } },
  serviceType: "Building Permit Monitoring",
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
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Dallas, TX</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-6">
            TRACK YOUR DALLAS<br />
            <span className="text-[#FF6B00]">BUILDING PERMITS</span><br />
            AUTOMATICALLY.
          </h1>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-8">
            Dallas Development Services doesn&apos;t send permit status alerts. ClearedNo watches
            the portal for you — checking daily and alerting you the moment your permit status changes,
            so your crew starts work the same day it clears.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            START MONITORING MY DALLAS PERMITS <span>→</span>
          </Link>
        </div>
      </section>

      {/* Free Checker */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] mb-2">
            CHECK ANY DALLAS PERMIT — FREE
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8">
            No signup needed. Enter your permit number to see its current status.
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
                Dallas uses the <strong className="text-[#F5F0E8]">Development Services portal</strong>{" "}
                at <a href="https://developmentservices.dallascityhall.com" target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] hover:underline">dallascityhall.com</a>.
                The system handles building, mechanical, electrical, and plumbing permits for all of Dallas County.
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
                { tip: "Use Dallas 311 for escalation", detail: "If your permit has been sitting 'under review' for longer than expected, call Dallas 311 and ask to speak with the Development Services permit technician." },
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

      {/* Testimonial */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10 bg-[#FF6B00]/3">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-heading text-5xl text-[#FF6B00] mb-6">&ldquo;</div>
          <p className="text-lg text-[#F5F0E8]/80 leading-relaxed mb-6">
            The Dallas Development Services site is painful to navigate. With ClearedNo I just get
            a text when my permit clears and my crew gets moving. Simple as that.
          </p>
          <div className="text-xs tracking-widest text-[#F5F0E8]/40 uppercase font-mono">
            James T. — Commercial Contractor, Dallas TX
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
            First month free. No credit card required. Cancel anytime.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-12 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            MONITOR MY DALLAS PERMITS FREE <span>→</span>
          </Link>
          <p className="mt-4 text-[10px] text-[#F5F0E8]/25 tracking-widest">
            Also monitoring: Austin · Houston · San Antonio
          </p>
        </div>
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
