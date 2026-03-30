import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PermitChecker } from "@/app/components/permit-checker";

export const metadata: Metadata = {
  title: "San Antonio TX Building Permit Tracking | ClearedNo",
  description:
    "Track your San Antonio building permits automatically. Get instant alerts when your San Antonio permit status changes. Built for Texas contractors.",
  keywords: [
    "San Antonio permit tracking", "San Antonio building permit status", "check permit status San Antonio",
    "San Antonio TX permit monitoring", "SAICIMS permit", "San Antonio permit cleared",
  ],
  alternates: { canonical: "https://www.clearedno.com/san-antonio" },
  openGraph: {
    title: "San Antonio TX Building Permit Tracking | ClearedNo",
    description: "Stop manually checking San Antonio's SAICIMS portal. Get instant alerts when your permit clears.",
    url: "https://www.clearedno.com/san-antonio",
    type: "website",
    images: [{ url: "/clearedno-icon.png", width: 512, height: 512 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ClearedNo — San Antonio TX Permit Monitoring",
  description: "Automated building permit status monitoring for San Antonio, Texas contractors.",
  url: "https://www.clearedno.com/san-antonio",
  areaServed: { "@type": "City", name: "San Antonio", containedInPlace: { "@type": "State", name: "Texas" } },
  serviceType: "Building Permit Monitoring",
};

export default function SanAntonioPage() {
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
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">San Antonio, TX</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wider text-[#F5F0E8] leading-[0.9] mb-6">
            TRACK YOUR SAN ANTONIO<br />
            <span className="text-[#FF6B00]">BUILDING PERMITS</span><br />
            AUTOMATICALLY.
          </h1>
          <p className="text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl mb-8">
            San Antonio&apos;s SAICIMS portal (Accela-based) doesn&apos;t send automatic status alerts.
            ClearedNo monitors your permits continuously — alerting you by email and push notification
            the moment your permit status changes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            START MONITORING MY SAN ANTONIO PERMITS <span>→</span>
          </Link>
        </div>
      </section>

      {/* Free Checker */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] mb-2">
            CHECK ANY SAN ANTONIO PERMIT — FREE
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 mb-8">
            No signup needed. Enter your permit number to see its current status.
          </p>
          <PermitChecker defaultCity="san-antonio" />
        </div>
      </section>

      {/* City Info */}
      <section className="py-16 px-6 border-t border-[#FF6B00]/10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-6">
              SAN ANTONIO PERMIT PORTAL INFO
            </h2>
            <div className="space-y-4 text-sm text-[#F5F0E8]/60 leading-relaxed">
              <p>
                San Antonio uses <strong className="text-[#F5F0E8]">SAICIMS</strong> (San Antonio Integrated
                City Information Management System) at{" "}
                <a href="https://saicims.sanantonio.gov/PermitStatus/" target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] hover:underline">saicims.sanantonio.gov</a>.
                The system is powered by Accela, the same platform used by Austin and many other Texas cities.
              </p>
              <div className="border border-[#FF6B00]/20 p-4">
                <div className="text-[10px] tracking-[0.2em] text-[#FF6B00] uppercase mb-3">Typical San Antonio Permit Timelines</div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">Simple remodel / repair</span><span className="text-[#FF6B00]">1–3 weeks</span></div>
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">New residential build</span><span className="text-[#FF6B00]">4–10 weeks</span></div>
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">Commercial tenant improvement</span><span className="text-[#FF6B00]">3–7 weeks</span></div>
                  <div className="flex justify-between"><span className="text-[#F5F0E8]/50">New commercial construction</span><span className="text-[#FF6B00]">8–16 weeks</span></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] mb-6">
              TIPS FOR SAN ANTONIO CONTRACTORS
            </h2>
            <div className="space-y-4">
              {[
                { tip: "Know your SAICIMS record number", detail: "SAICIMS assigns each application a unique record number. Keep this number handy — it's your primary way to look up permit status and schedule inspections." },
                { tip: "Check for Historic Review requirements", detail: "If your project is in a Historic District (like King William or Lavaca), you'll need approval from the Office of Historic Preservation before permits are issued. This adds 2–4 weeks." },
                { tip: "Military base proximity matters", detail: "Projects near JBSA (Joint Base San Antonio) or other military installations may need additional federal review. Factor this into your timeline." },
                { tip: "Use the DRSAB for large projects", detail: "San Antonio's Development and Business Services office (DRSAB) has pre-application meetings for commercial projects over 5,000 sq ft. Use these to catch issues before submission." },
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
            San Antonio is growing fast and the permit office is slammed. I used to call SAICIMS
            support every week just to get a status update. Now ClearedNo handles it and I spend
            that time on the job instead.
          </p>
          <div className="text-xs tracking-widest text-[#F5F0E8]/40 uppercase font-mono">
            Maria L. — General Contractor, San Antonio TX
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
            MONITOR MY SAN ANTONIO PERMITS FREE <span>→</span>
          </Link>
          <p className="mt-4 text-[10px] text-[#F5F0E8]/25 tracking-widest">
            Also monitoring: Austin · Dallas · Houston
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
