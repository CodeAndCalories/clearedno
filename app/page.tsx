// ClearedNo — Landing Page
// Industrial utility aesthetic: black, safety orange, off-white.
// Bebas Neue headings, DM Mono for data/body.
import Link from "next/link";
import Image from "next/image";

// ── Shared CTA button ────────────────────────────────────────────────────────
// Single source of truth for the primary CTA so every instance is identical.
function PrimaryCTA({
  label = "START WATCHING MY PERMITS",
  href = "/signup",
  className = "",
}: {
  label?: string;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 hover:bg-[#F5F0E8] transition-colors inline-flex items-center gap-3 ${className}`}
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
          {/* Logo — whitespace-nowrap prevents "NO" wrapping to a new line */}
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
          <a
            href="#how-it-works"
            className="hidden sm:block text-xs tracking-widest text-[#F5F0E8]/60 hover:text-[#FF6B00] transition-colors uppercase"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="hidden sm:block text-xs tracking-widest text-[#F5F0E8]/60 hover:text-[#FF6B00] transition-colors uppercase"
          >
            Pricing
          </a>
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
// 3 rows max. CLEARED row is the hero row — orange, large, high contrast.
function HeroPermitCard() {
  const permits = [
    { num: "2024-BC-03991", addr: "530 Industrial Blvd", status: "PENDING",  color: "#6B7280", hero: false },
    { num: "2024-BC-04812", addr: "1847 Commerce St",    status: "CLEARED",  color: "#FF6B00", hero: true  },
    { num: "2024-BC-05120", addr: "2201 Main St Ste 4",  status: "APPROVED", color: "#FF6B00", hero: false },
  ];

  return (
    <div>
      {/* Label */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
        <span className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono font-medium">
          Real Permit Update — Austin, TX
        </span>
      </div>

      {/* Card */}
      <div className="border border-[#FF6B00]/30 bg-[#0A0A0A] overflow-hidden">
        {/* Column headers */}
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

        {/* Footer */}
        <div className="px-5 py-3 flex items-center gap-2 bg-[#FF6B00]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
          <span className="text-[10px] text-[#F5F0E8]/40 tracking-widest uppercase">
            Updated 7:12 AM this morning
          </span>
        </div>
      </div>

      {/* Hook line below card */}
      <p className="mt-3 text-sm text-[#FF6B00] font-mono font-medium">
        → You could&apos;ve started work this morning.
      </p>
    </div>
  );
}

// ── Pain point stat box ──────────────────────────────────────────────────────
function PainPoint({ stat, label }: { stat: string; label: string }) {
  return (
    <div className="border border-[#FF6B00]/20 p-6">
      <div className="font-heading text-6xl text-[#FF6B00] mb-2">{stat}</div>
      <div className="text-xs text-[#F5F0E8]/60 tracking-widest uppercase leading-relaxed">{label}</div>
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
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,107,0,0.12) 39px,rgba(255,107,0,0.12) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,107,0,0.12) 39px,rgba(255,107,0,0.12) 40px)",
          }}
        />
        {/* Orange corner accents */}
        <div className="absolute top-0 left-0 w-48 h-1 bg-[#FF6B00]" />
        <div className="absolute top-0 left-0 w-1 h-48 bg-[#FF6B00]" />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── Left col ── */}
            <div>
              {/* Situation lines — sets the scene before the headline */}
              <div className="border-l-2 border-[#FF6B00]/40 pl-4 mb-5 space-y-1">
                <p className="text-sm text-[#F5F0E8]/50 font-mono leading-relaxed">
                  Your permit clears at 7:12 AM. Your crew is still waiting at noon.
                </p>
                <p className="text-sm text-[#F5F0E8]/30 font-mono leading-relaxed">
                  Your crew could&apos;ve started hours ago.
                </p>
              </div>

              {/* Main headline */}
              <h1 className="font-heading text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] tracking-wider text-[#F5F0E8] mb-6">
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

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <PrimaryCTA className="justify-center sm:justify-start" />
                <a
                  href="#how-it-works"
                  className="border border-[#FF6B00]/40 text-[#F5F0E8]/70 font-mono text-sm tracking-widest uppercase px-8 py-4 hover:border-[#FF6B00] hover:text-[#F5F0E8] transition-colors text-center"
                >
                  SEE HOW IT WORKS
                </a>
              </div>

              {/* Below-CTA reassurance line */}
              <p className="mt-4 text-xs text-[#F5F0E8]/30 font-mono">
                No setup. No integrations. Works with your city portal.
              </p>

              {/* Trust strip */}
              <div className="mt-4 flex items-center gap-4 text-[10px] tracking-widest text-[#F5F0E8]/40 uppercase">
                <span>No credit card</span>
                <span className="text-[#FF6B00]">·</span>
                <span>14-day free trial</span>
                <span className="text-[#FF6B00]">·</span>
                <span>Cancel anytime</span>
              </div>
              <div className="mt-2 text-[10px] tracking-widest text-[#FF6B00]/50 uppercase">
                Monitoring Austin permits 24/7
              </div>
            </div>

            {/* ── Right col: permit card ── */}
            <div className="hidden lg:block">
              <HeroPermitCard />
            </div>

          </div>
        </div>
      </section>

      <Divider />

      {/* ── PAIN POINTS ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">The Problem</span>
            </div>
            <h2 className="font-heading text-5xl tracking-widest text-[#F5F0E8]">
              EVERY DAY YOU WAIT IS MONEY LOST.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-0 border border-[#FF6B00]/20">
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
            <PainPoint
              stat="48hrs"
              label="Typical delay between permit clearing and contractor finding out"
            />
          </div>

          <div className="mt-6 border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-6">
            <p className="text-sm text-[#F5F0E8]/70 leading-relaxed max-w-2xl">
              City systems weren&apos;t built for you. No alerts. No notifications.
              Just a page you have to keep checking.
              <span className="text-[#FF6B00] font-medium"> ClearedNo fixes that.</span>
            </p>
          </div>

          {/* Bottom note */}
          <p className="mt-8 text-xs text-[#F5F0E8]/30 italic text-center">
            Most contractors don&apos;t realize how much time they&apos;re losing.
          </p>
        </div>
      </section>

      <Divider />

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">How It Works</span>
            </div>
            <h2 className="font-heading text-5xl tracking-widest text-[#F5F0E8]">
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

              {/* Action line after steps */}
              <p className="text-sm text-[#FF6B00] font-mono font-medium pl-0">
                → Start work immediately instead of waiting.
              </p>

              <div className="pt-2">
                <PrimaryCTA />
              </div>
            </div>

            {/* ── Email mockup ── */}
            <div>
              {/* Label above mockup */}
              <div className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono font-medium mb-3">
                You get this the moment it changes
              </div>

              <div className="border border-[#FF6B00]/30 bg-[#0F0F0F]">
                {/* Window chrome */}
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

                  {/* Big status line */}
                  <div className="font-heading text-4xl text-[#FF6B00] tracking-widest">
                    ✅ PERMIT CLEARED
                  </div>

                  {/* Permit detail block */}
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

              {/* Hook line below mockup */}
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Pricing</span>
            </div>
            <h2 className="font-heading text-5xl tracking-widest text-[#F5F0E8]">
              LOCK IN YOUR RATE.
            </h2>
            <p className="mt-3 text-sm text-[#F5F0E8]/50 max-w-md leading-relaxed">
              First 20 contractors lock in $49/mo forever. Price increases to $79 when spots fill.
            </p>
          </div>

          {/* Spots counter */}
          <div className="inline-flex items-center gap-2 border border-[#FF6B00]/40 bg-[#FF6B00]/10 px-4 py-2 mb-10">
            <span className="text-[#FF6B00] text-sm">⚡</span>
            <span className="text-xs font-mono text-[#FF6B00] tracking-widest uppercase">
              17 of 20 founding spots remaining
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-0">
            {/* Plans side by side (span 2 cols) */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-0">

              {/* Founding Member */}
              <div className="border border-[#FF6B00] p-8 relative bg-[#FF6B00]/5">
                <div className="absolute top-0 right-0 bg-[#FF6B00] px-3 py-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#0A0A0A] uppercase">
                    Best Value
                  </span>
                </div>

                <div className="text-[10px] font-mono tracking-[0.3em] text-[#FF6B00] uppercase mb-3">
                  Founding Member
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-heading text-7xl text-[#FF6B00]">$49</span>
                  <span className="text-[#F5F0E8]/40 text-sm">first mo</span>
                </div>
                <p className="text-[10px] text-[#FF6B00]/70 tracking-widest uppercase mb-1">
                  Then $79/mo — locked forever
                </p>
                <p className="text-[10px] text-[#F5F0E8]/30 mb-6">
                  New customers after founding period pay $149/mo
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Standard",
                    "Price locked forever",
                    "Founding member badge",
                    "Direct founder access",
                    "14-day free trial",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#F5F0E8]/80">
                      <span className="text-[#FF6B00] mt-0.5 flex-shrink-0">■</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <PrimaryCTA
                  label="CLAIM FOUNDING PRICING →"
                  href="/signup?plan=founding"
                  className="text-xs px-4 py-3 w-full justify-center"
                />
                <p className="mt-3 text-[10px] text-[#F5F0E8]/30 text-center">
                  Only 17 spots left
                </p>
              </div>

              {/* Standard */}
              <div className="border border-[#FF6B00]/20 border-t-0 sm:border-t sm:border-l-0 p-8 relative">
                <div className="text-[10px] font-mono tracking-[0.3em] text-[#F5F0E8]/40 uppercase mb-3">
                  Standard
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-heading text-7xl text-[#F5F0E8]/60">$79</span>
                  <span className="text-[#F5F0E8]/30 text-sm">/mo</span>
                </div>
                <p className="text-[10px] text-[#F5F0E8]/30 tracking-widest uppercase mb-6">
                  After founding spots fill
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited permit tracking",
                    "Checks every 2 hours, 24/7",
                    "Instant email alerts",
                    "Full status history",
                    "14-day free trial",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#F5F0E8]/40">
                      <span className="text-[#F5F0E8]/20 mt-0.5 flex-shrink-0">■</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="w-full border border-[#FF6B00]/15 text-[#F5F0E8]/30 font-mono text-xs tracking-widest uppercase px-4 py-3 text-center">
                  Available after founding spots fill
                </div>
              </div>

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
                    Founding member / mo
                  </div>
                  <div className="font-heading text-3xl text-[#FF6B00]">$79</div>
                </div>
                <div className="w-full h-px bg-[#FF6B00]/20" />
                <p className="text-xs text-[#F5F0E8]/60 leading-relaxed">
                  One hour of saved crew time pays for a year of monitoring.
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
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Beta Tester Feedback</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8]">
              BUILT FOR THE GUYS<br />
              <span className="text-[#FF6B00]">WHO BUILD THINGS</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                quote: "Saved me 2 days waiting on a permit in Austin. I knew the morning it cleared.",
                name:  "Mike R.",
                title: "General Contractor",
              },
              {
                quote: "I used to check the portal every morning. Now I just wait for the email.",
                name:  "James T.",
                title: "Roofing",
              },
              {
                quote: "Worth it for the first permit alone.",
                name:  "Carlos M.",
                title: "Remodeling",
              },
            ].map((t) => (
              <div key={t.name} className="border border-[#FF6B00]/20 p-8 relative">
                <div className="font-heading text-5xl text-[#FF6B00]/20 leading-none mb-4 select-none">"</div>
                <blockquote className="text-sm text-[#F5F0E8]/80 leading-relaxed mb-6">
                  {t.quote}
                </blockquote>
                <div className="border-t border-[#FF6B00]/10 pt-4">
                  <div className="text-xs text-[#F5F0E8]/60 font-mono">{t.name}</div>
                  <div className="text-[10px] text-[#FF6B00]/60 tracking-widest uppercase">{t.title}</div>
                </div>
              </div>
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
          <h2 className="font-heading text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-widest text-[#F5F0E8] mb-4">
            YOUR CREW IS WAITING.
            <br />
            <span className="text-[#FF6B00]">THE PERMIT ALREADY CLEARED.</span>
          </h2>
          {/* Interstitial line — Bebas Neue, white, smaller */}
          <p className="font-heading text-[clamp(1.5rem,3vw,2.5rem)] tracking-widest text-[#F5F0E8] mb-6 leading-tight">
            You just don&apos;t know it yet.
          </p>
          <p className="text-sm text-[#F5F0E8]/50 mb-10 tracking-widest uppercase font-mono">
            Are you still checking manually?
          </p>
          <PrimaryCTA
            label="START FREE TRIAL — NO CREDIT CARD"
            className="text-base px-12 py-5"
          />
        </div>
      </section>

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
                Currently monitoring Austin, TX and Dallas, TX permits
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
