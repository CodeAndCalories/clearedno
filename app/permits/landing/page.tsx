// ClearedNo — Landing Page
// Industrial utility aesthetic: black, safety orange, off-white.
// Bebas Neue headings, DM Mono for data/body.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ScrollRevealInit, StickyMobileCTA } from "../../components/landing-client";
import { PermitDelayCalculator } from "../../components/permit-delay-calculator";

// ── Page-specific metadata (overrides layout defaults) ───────────────────────
export const metadata: Metadata = {
  title: "ClearedNo — Permit Monitoring for Contractors",
  description:
    "Stop manually checking city portals. Get instant alerts the moment your building permit clears. Built for contractors.",
  alternates: {
    canonical: "https://www.clearedno.com/permits/landing",
  },
  openGraph: {
    title: "ClearedNo — Permit Monitoring for Contractors",
    description:
      "Stop manually checking city portals. Get instant alerts the moment your building permit clears. Built for contractors.",
    url: "https://www.clearedno.com/permits/landing",
    type: "website",
    images: [
      {
        url: "/clearedno-icon.png",
        width: 512,
        height: 512,
        alt: "ClearedNo — Permit Monitoring for Contractors",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ClearedNo — Permit Monitoring for Contractors",
    description:
      "Stop manually checking city portals. Get instant alerts the moment your building permit clears. Built for contractors.",
    images: ["/clearedno-icon.png"],
  },
};

// ── Shared CTA button ────────────────────────────────────────────────────────
function PrimaryCTA({
  label = "START YOUR 30-DAY FREE TRIAL",
  href = "/signup",
  className = "",
  glow = false,
}: {
  label?: string;
  href?: string;
  className?: string;
  glow?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-all hover:scale-[1.02] inline-flex items-center gap-3 w-full sm:w-auto justify-center ${glow ? "cta-glow" : ""} ${className}`}
    >
      {label}
      <span className="group-hover:translate-x-1 transition-transform">→</span>
    </Link>
  );
}

// ── Section divider ──────────────────────────────────────────────────────────
function Divider() {
  return <div className="w-full h-px bg-[#FF6B00]/30" />;
}

// ── Nav ──────────────────────────────────────────────────────────────────────
function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#FF6B00]/20 bg-[#0A0A0A]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
            <Image
              src="/clearedno-icon.png"
              alt="ClearedNo"
              width={28}
              height={28}
              className="rounded-sm"
              priority
            />
            <span className="font-heading text-2xl tracking-widest text-[#FF6B00]">
              CLEARED<span className="text-[#F5F0E8]">NO</span>
            </span>
          </Link>
          {/* Nav tagline — only visible on wider screens */}
          <span className="hidden lg:block text-[10px] tracking-[0.15em] text-[#F5F0E8]/30 uppercase border-l border-[#FF6B00]/20 pl-4 whitespace-nowrap">
            Built for Contractors. Not Bureaucrats.
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Hide text links on mobile — show only the CTA */}
          <Link
            href="/login"
            className="hidden sm:block text-xs tracking-widest text-[#F5F0E8]/60 hover:text-[#FF6B00] transition-colors uppercase"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-[#FF6B00] text-[#0A0A0A] text-xs font-mono font-bold tracking-widest uppercase px-4 py-2 hover:bg-[#F5F0E8] transition-colors whitespace-nowrap"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Hero permit card (right side) ────────────────────────────────────────────
function HeroPermitCard() {
  const permits = [
    { num: "2024-BC-03991", addr: "530 Industrial Blvd", status: "PENDING",  color: "#6B7280", hero: false },
    { num: "2024-BC-04812", addr: "1847 Commerce St",    status: "CLEARED",  color: "#FF6B00", hero: true  },
    { num: "2024-BC-05120", addr: "2201 Main St Ste 4",  status: "APPROVED", color: "#FF6B00", hero: false },
  ];

  return (
    <div style={{ perspective: "900px" }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
        <span className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono font-medium">
          Real Permit Update — Austin, TX
        </span>
      </div>

      <div
        className="border border-[#FF6B00]/30 bg-[#0A0A0A] overflow-hidden"
        style={{
          transform: "rotateX(3deg) rotateY(-4deg)",
          boxShadow: "0 30px 60px -10px rgba(255,107,0,0.18), 0 20px 40px -15px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,107,0,0.08)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div className="grid grid-cols-3 border-b border-[#FF6B00]/20 px-5 py-3 bg-[#FF6B00]/5">
          <span className="text-[10px] tracking-[0.2em] text-[#FF6B00]/60 uppercase">Permit #</span>
          <span className="text-[10px] tracking-[0.2em] text-[#FF6B00]/60 uppercase">Address</span>
          <span className="text-[10px] tracking-[0.2em] text-[#FF6B00]/60 uppercase text-right">Status</span>
        </div>

        {permits.map((p) => (
          <div
            key={p.num}
            className={`grid grid-cols-3 px-5 py-4 border-b border-[#FF6B00]/10 transition-colors ${
              p.hero ? "bg-[#FF6B00]/15 border-l-2 border-l-[#FF6B00]" : ""
            }`}
          >
            <span className={`font-mono ${p.hero ? "text-sm text-[#F5F0E8] font-medium" : "text-xs text-[#F5F0E8]/70"}`}>
              {p.num}
            </span>
            <span className={`font-mono truncate ${p.hero ? "text-sm text-[#F5F0E8]/90" : "text-xs text-[#F5F0E8]/50"}`}>
              {p.addr}
            </span>
            <span
              className={`font-mono font-bold tracking-widest text-right ${
                p.hero ? "text-lg" : "text-xs"
              } ${p.hero ? "drop-shadow-[0_0_12px_rgba(255,107,0,0.4)]" : ""}`}
              style={{ color: p.hero ? "#FF6B00" : p.status === "PENDING" ? "#6B7280" : "#FF6B00" }}
            >
              {p.hero ? "● CLEARED" : `● ${p.status}`}
            </span>
          </div>
        ))}

        <div className="px-5 py-3 flex items-center gap-2 bg-[#FF6B00]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
          <span className="text-[10px] text-[#F5F0E8]/40 tracking-widest uppercase">
            Updated 7:12 AM this morning
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm text-[#FF6B00] font-mono font-medium">
        → You could&apos;ve started work this morning.
      </p>
    </div>
  );
}

// ── Pain point stat box ──────────────────────────────────────────────────────
function PainPoint({ stat, label }: { stat: string; label: string }) {
  return (
    <div
      className="border border-[#FF6B00]/20 p-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.07) 0%, rgba(10,10,10,0) 55%)" }}
    >
      {/* ambient corner glow */}
      <div
        className="absolute top-0 left-0 w-28 h-28 pointer-events-none"
        style={{ background: "radial-gradient(circle at top left, rgba(255,107,0,0.12) 0%, transparent 70%)" }}
      />
      <div className="font-heading text-6xl text-[#FF6B00] mb-2 relative">{stat}</div>
      <div className="text-xs text-[#F5F0E8]/60 tracking-widest uppercase leading-relaxed relative">{label}</div>
    </div>
  );
}

// ── How-it-works step ────────────────────────────────────────────────────────
function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 border border-[#FF6B00] flex items-center justify-center">
        <span className="font-heading text-2xl text-[#FF6B00]">{num}</span>
      </div>
      <div>
        <div className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-1">{title}</div>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <NavBar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section id="hero-section" className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,107,0,0.12) 39px,rgba(255,107,0,0.12) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,107,0,0.12) 39px,rgba(255,107,0,0.12) 40px)",
          }}
        />
        {/* Radial gradient fade — softens grid edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, transparent 35%, #0A0A0A 80%)" }}
        />
        {/* Ambient orange glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,107,0,0.12) 0%, transparent 70%)" }}
        />
        {/* Orange corner accents */}
        <div className="absolute top-0 left-0 w-48 h-1 bg-[#FF6B00]" />
        <div className="absolute top-0 left-0 w-1 h-48 bg-[#FF6B00]" />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── Left col ── */}
            <div>
              {/* Situation lines */}
              <div className="border-l-2 border-[#FF6B00]/40 pl-4 mb-5 space-y-1">
                <p className="text-sm text-[#F5F0E8]/50 font-mono leading-relaxed">
                  Your permit clears at 7:12 AM. Your crew is still waiting at noon.
                </p>
                <p className="text-sm text-[#F5F0E8]/30 font-mono leading-relaxed">
                  Your crew could&apos;ve started hours ago.
                </p>
              </div>

              {/* Main headline — clamp keeps it readable on small screens */}
              <h1 className="font-heading leading-[0.9] tracking-wider text-[#F5F0E8] mb-6"
                  style={{ fontSize: "clamp(2rem, 8vw, 7rem)" }}>
                YOUR PERMIT{" "}
                <span className="text-[#FF6B00]">CLEARED.</span>
                <br />
                YOU&apos;LL KNOW{" "}
                <span className="relative">
                  IN SECONDS.
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#FF6B00]" />
                </span>
              </h1>

              <p className="text-sm text-[#F5F0E8]/60 leading-relaxed mb-10 max-w-md">
                Stop checking city portals every morning. ClearedNo watches your permits
                and alerts you the moment anything changes — so work starts the same day.
              </p>

              {/* CTAs — full width on mobile */}
              <div className="relative">
                {/* Floating glow behind CTA */}
                <div
                  className="absolute -inset-3 blur-2xl rounded-full pointer-events-none -z-10"
                  style={{ background: "radial-gradient(ellipse, rgba(255,107,0,0.2) 0%, transparent 70%)" }}
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <PrimaryCTA glow className="justify-center sm:justify-start" />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#F5F0E8]/40 font-mono">
                First month free. Then $79/mo. Cancel any time.
              </p>
            </div>

            {/* ── Right col: permit card — hidden on small screens ── */}
            <div className="hidden sm:block">
              <HeroPermitCard />
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
      <div className="border-b border-[#FF6B00]/10 py-3 px-6" style={{ background: "rgba(255,107,0,0.03)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse flex-shrink-0" />
            <span className="text-[10px] tracking-[0.2em] text-[#F5F0E8]/45 uppercase font-mono">
              Trusted by contractors in 4 Texas cities
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-[10px] tracking-widest text-[#FF6B00]/50 uppercase font-mono">
            <span>Austin</span>
            <span className="text-[#FF6B00]/20">·</span>
            <span>Dallas</span>
            <span className="text-[#FF6B00]/20">·</span>
            <span>Houston</span>
            <span className="text-[#FF6B00]/20">·</span>
            <span>San Antonio</span>
          </div>
        </div>
      </div>

      <Divider />

      {/* ── PAIN POINTS ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto reveal">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">The Problem</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8]">
              EVERY DAY YOU WAIT IS MONEY LOST.
            </h2>
          </div>

          {/* Stack on mobile, 3-col on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#FF6B00]/20">
            <PainPoint
              stat="$2,400"
              label="Average daily cost of crew sitting idle while a permit clears"
            />
            <div className="border-t border-b md:border-t-0 md:border-b-0 md:border-l md:border-r border-[#FF6B00]/20">
              <PainPoint
                stat="3–5×"
                label="Times per week contractors manually check city portals hoping for an update"
              />
            </div>
            <div className="border-t md:border-t-0">
              <PainPoint
                stat="48hrs"
                label="Typical delay between permit clearing and contractor finding out"
              />
            </div>
          </div>

          <div className="mt-6 border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-6">
            <p className="text-sm text-[#F5F0E8]/70 leading-relaxed max-w-2xl">
              City systems weren&apos;t built for you. No alerts. No notifications.
              Just a page you have to keep checking.
              <span className="text-[#FF6B00] font-medium"> ClearedNo fixes that.</span>
            </p>
          </div>

          <p className="mt-8 text-xs text-[#F5F0E8]/30 italic text-center">
            Most contractors don&apos;t realize how much time they&apos;re losing.
          </p>
        </div>
      </section>

      <Divider />

      {/* ── CITY COVERAGE ─────────────────────────────────────────────────── */}
      <section className="py-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-[#F5F0E8]/40 tracking-widest uppercase font-mono">
            Currently monitoring: Austin TX · Dallas TX · Houston TX · San Antonio TX · More cities weekly
          </p>
        </div>
      </section>

      <Divider />

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto reveal">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">How It Works</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8]">
              THREE STEPS. ZERO CHECKING.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Steps */}
            <div className="space-y-10">
              <Step
                num="01"
                title="ADD YOUR PERMIT"
                desc="Drop in your permit number. That's it."
              />
              <div className="w-px h-8 bg-[#FF6B00]/20 ml-6" />
              <Step
                num="02"
                title="WE WATCH IT"
                desc="We check the city portal for you — day and night."
              />
              <div className="w-px h-8 bg-[#FF6B00]/20 ml-6" />
              <Step
                num="03"
                title="YOU GET THE ALERT"
                desc="The second it changes, you know."
              />

              <p className="text-sm text-[#FF6B00] font-mono font-medium pl-0">
                → Start work immediately instead of waiting.
              </p>

              <div className="pt-2">
                <PrimaryCTA />
              </div>
            </div>

            {/* ── Email mockup ── */}
            <div>
              <div className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono font-medium mb-3">
                You get this the moment it changes
              </div>

              <div className="border border-[#FF6B00]/30 bg-[#0F0F0F]">
                <div className="border-b border-[#FF6B00]/20 px-4 py-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                  <span className="ml-4 text-[10px] text-[#F5F0E8]/30 tracking-widest">
                    alerts@clearedno.com
                  </span>
                </div>

                <div className="p-8 space-y-5">
                  <div className="text-[10px] text-[#F5F0E8]/40 tracking-widest uppercase">
                    From: ClearedNo &lt;alerts@clearedno.com&gt;
                  </div>

                  <div className="font-heading text-4xl text-[#FF6B00] tracking-widest">
                    ✅ PERMIT CLEARED
                  </div>

                  <div className="border-l-2 border-[#FF6B00] pl-5 space-y-2">
                    <div className="text-sm text-[#F5F0E8]/80">
                      <span className="text-[#F5F0E8]/40">Permit:</span>{" "}
                      <span className="font-mono">2024-BC-04812</span>
                    </div>
                    <div className="text-sm text-[#F5F0E8]/80">
                      <span className="text-[#F5F0E8]/40">Address:</span>{" "}
                      1847 Commerce St, Austin TX
                    </div>
                    <div className="text-sm text-[#F5F0E8]/80">
                      <span className="text-[#F5F0E8]/40">New Status:</span>{" "}
                      <span className="text-[#FF6B00] font-bold">CLEARED</span>
                    </div>
                    <div className="text-xs text-[#F5F0E8]/40">
                      Detected: Today at 7:12 AM
                    </div>
                  </div>

                  <div className="bg-[#FF6B00] text-[#0A0A0A] text-xs font-mono font-bold tracking-widest uppercase px-6 py-3 inline-block">
                    View Permit Dashboard →
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-[#FF6B00] font-mono font-medium">
                → Your permit has cleared. You can proceed.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Divider />

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto reveal">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Pricing</span>
            </div>
            <h2 className="font-heading text-5xl tracking-widest text-[#F5F0E8]">
              ONE PLAN. NO NONSENSE.
            </h2>
            <p className="mt-3 text-sm text-[#F5F0E8]/50 max-w-md leading-relaxed">
              First month free. Then $79/mo. Cancel any time.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-0">
            {/* Main plan */}
            <div className="lg:col-span-2 border border-[#FF6B00] p-10 relative">
              <div className="absolute top-0 right-0 bg-[#FF6B00] px-4 py-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#0A0A0A] uppercase">
                  Only Plan
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-heading text-8xl text-[#FF6B00]">FREE</span>
              </div>
              <p className="text-sm text-[#FF6B00]/80 font-mono tracking-widest uppercase mb-1">
                First month — cancel anytime
              </p>
              <p className="text-xs text-[#F5F0E8]/40 mb-10">
                Then $79/mo per company. Cancel any time.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Unlimited permit tracking — no per-permit fees",
                  "Checks every 2 hours, 24 hours a day, 7 days a week",
                  "Instant email alert the moment any status changes",
                  "Full status history and audit trail",
                  "All supported cities, new cities added weekly",
                  "Priority email support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[#F5F0E8]/80">
                    <span className="text-[#FF6B00] mt-0.5 flex-shrink-0">■</span>
                    {f}
                  </li>
                ))}
              </ul>

              <PrimaryCTA
                label="START FREE TRIAL"
                href="/signup"
                className="text-xs px-6 py-4"
              />
              <p className="mt-3 text-[10px] text-[#F5F0E8]/30">
                30 days free · Card required · Cancel anytime
              </p>
            </div>

            {/* THE MATH */}
            <div className="border border-[#FF6B00]/20 border-t-0 lg:border-t lg:border-l-0 p-8 bg-[#FF6B00]/5">
              <div className="font-heading text-xl tracking-widest text-[#FF6B00] mb-6">
                THE MATH
              </div>
              <div className="space-y-6">
                <div>
                  <div className="text-[#F5F0E8]/40 text-xs uppercase tracking-widest mb-1">
                    One idle day
                  </div>
                  <div className="font-heading text-3xl text-[#F5F0E8]">$2,400</div>
                </div>
                <div className="w-full h-px bg-[#FF6B00]/20" />
                <div>
                  <div className="text-[#F5F0E8]/40 text-xs uppercase tracking-widest mb-1">
                    ClearedNo / mo
                  </div>
                  <div className="font-heading text-3xl text-[#FF6B00]">$79</div>
                </div>
                <div className="w-full h-px bg-[#FF6B00]/20" />
                <p className="text-xs text-[#F5F0E8]/60 leading-relaxed">
                  Half a day of crew time pays for a year of monitoring.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-[#F5F0E8]/30 text-center">
            Per company · Unlimited permits · No contracts · Cancel any time
          </p>
        </div>
      </section>

      <Divider />

      {/* ── SOCIAL PROOF ──────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8]">
            Built for contractors. <span className="text-[#FF6B00]">Trusted across the country.</span>
          </p>
        </div>
      </section>

      <Divider />

      {/* ── PERMIT DELAY CALCULATOR ───────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto reveal">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Cost Analysis</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8]">
              HOW MUCH ARE PERMIT DELAYS COSTING YOU?
            </h2>
            <p className="mt-3 text-sm text-[#F5F0E8]/50 max-w-xl leading-relaxed">
              Enter your project value and days delayed to see what waiting really costs.
            </p>
          </div>
          <PermitDelayCalculator />
        </div>
      </section>

      <Divider />

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto reveal">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">FAQ</span>
            </div>
            <h2 className="font-heading text-5xl tracking-widest text-[#F5F0E8]">
              COMMON QUESTIONS.
            </h2>
          </div>

          <div className="space-y-0">
            {[
              {
                q: "What cities do you support?",
                a: "Currently Austin, TX, Dallas, TX, Houston, TX, and San Antonio, TX. Columbus OH, Philadelphia PA, and Grand Rapids MI are also supported. More cities added weekly — request yours at /suggest-city.",
              },
              {
                q: "How often do you check my permit?",
                a: "Every 2 hours, 24/7. You'll know within hours of any status change — usually the same morning the city processes it.",
              },
              {
                q: "Is my data secure?",
                a: "Yes. We only store your permit numbers and email address. No payment info is stored on our servers — billing is handled entirely by Stripe.",
              },
              {
                q: "What if my city isn't supported?",
                a: "Submit a request at /suggest-city and we'll prioritize based on demand. New cities are added weekly — most requests go live within 1–2 weeks.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. No contracts, no annual lock-in, no commitments. Cancel from your dashboard in one click — no questions asked.",
              },
              {
                q: "How does the free trial work?",
                a: "Your first month is completely free. We collect your card upfront but charge nothing for 30 days. Cancel before day 31 and you pay nothing. Ever.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group border-b border-[#FF6B00]/20 first:border-t"
              >
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none">
                  <span className="text-sm font-mono text-[#F5F0E8] leading-relaxed">
                    {item.q}
                  </span>
                  <span className="flex-shrink-0 w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00] font-mono text-sm group-open:bg-[#FF6B00]/10 transition-colors">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:block">−</span>
                  </span>
                </summary>
                <p className="pb-5 text-sm text-[#F5F0E8]/60 leading-relaxed max-w-2xl">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,107,0,0.05) 10px,rgba(255,107,0,0.05) 11px)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2
            className="font-heading leading-[0.95] tracking-widest text-[#F5F0E8] mb-4"
            style={{ fontSize: "clamp(2rem, 7vw, 6rem)" }}
          >
            YOUR CREW IS WAITING.
            <br />
            <span className="text-[#FF6B00]">THE PERMIT ALREADY CLEARED.</span>
          </h2>
          <p
            className="font-heading tracking-widest text-[#F5F0E8] mb-6 leading-tight"
            style={{ fontSize: "clamp(1.25rem, 3vw, 2.5rem)" }}
          >
            You just don&apos;t know it yet.
          </p>
          <p className="text-sm text-[#F5F0E8]/50 mb-10 tracking-widest uppercase font-mono">
            Are you still checking manually?
          </p>
          <PrimaryCTA
            label="START FREE TRIAL"
            className="text-base px-12 py-5"
            glow
          />
        </div>
      </section>

      {/* ── CLIENT-SIDE ENHANCEMENTS ──────────────────────────────────────── */}
      <ScrollRevealInit />
      <StickyMobileCTA />

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#FF6B00]/20 px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Top row: logo + nav links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
            <span className="font-heading text-xl tracking-widest text-[#FF6B00]">
              CLEARED<span className="text-[#F5F0E8]/40">NO</span>
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase">
              <Link href="/login"         className="hover:text-[#FF6B00] transition-colors">Log In</Link>
              <Link href="/signup"        className="hover:text-[#FF6B00] transition-colors">Sign Up</Link>
              <Link href="/pricing"       className="hover:text-[#FF6B00] transition-colors">Pricing</Link>
              <Link href="/suggest-city"  className="hover:text-[#FF6B00] transition-colors">Request a City</Link>
              <Link href="/privacy"       className="hover:text-[#FF6B00] transition-colors">Privacy Policy</Link>
              <Link href="/terms"         className="hover:text-[#FF6B00] transition-colors">Terms of Service</Link>
              <Link href="/refunds"       className="hover:text-[#FF6B00] transition-colors">Refund Policy</Link>
              <a
                href="mailto:support@clearedno.com"
                className="hover:text-[#FF6B00] transition-colors normal-case"
              >
                support@clearedno.com
              </a>
            </div>
          </div>

          {/* City coverage + "more cities" note */}
          <div className="border-t border-[#FF6B00]/10 pt-5 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] flex-shrink-0" />
              <span className="text-[10px] text-[#F5F0E8]/40 tracking-widest uppercase">
                Currently monitoring Austin, TX · Dallas, TX · Houston, TX · San Antonio, TX · Columbus OH soon · Philadelphia PA soon · Grand Rapids MI soon
              </span>
            </div>
            <span className="text-[10px] text-[#FF6B00]/50 tracking-widest uppercase">
              More cities added weekly
            </span>
          </div>

          {/* Bottom row: copyright */}
          <div className="border-t border-[#FF6B00]/10 pt-4">
            <span className="text-[10px] text-[#F5F0E8]/20 tracking-widest">
              © {new Date().getFullYear()} ClearedNo. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
