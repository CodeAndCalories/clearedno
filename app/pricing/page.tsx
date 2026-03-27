import Link from "next/link";
import Image from "next/image";

const FAQ = [
  {
    q: "What cities do you support?",
    a: "Currently Austin, TX and Dallas, TX. We add cities weekly based on demand. Request yours at clearedno.com/suggest-city.",
  },
  {
    q: "What permit types do you track?",
    a: "Building, electrical, plumbing, mechanical — any permit that appears in the city's official portal. If it's in the system, we watch it.",
  },
  {
    q: "How fast is the alert?",
    a: "We check every 2 hours around the clock. You'll know within 2 hours of your permit clearing — usually the same morning the city processes it.",
  },
  {
    q: "Can I track multiple permits at once?",
    a: "Yes. One plan covers unlimited permits for your company. Add as many jobs as you're running.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no annual lock-in, no questions asked. Cancel from your dashboard in 30 seconds.",
  },
  {
    q: "What if my city isn't supported?",
    a: "Request it at clearedno.com/suggest-city. We add cities based on demand — most requests go live within 1–2 weeks.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes — 14 days free, no credit card required. Start monitoring your permits today.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Nav */}
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
          <Image src="/clearedno-icon.png" alt="ClearedNo" width={24} height={24} />
          <span className="font-heading text-2xl tracking-widest text-[#FF6B00]">
            CLEARED<span className="text-[#F5F0E8]">NO</span>
          </span>
        </Link>
        <div className="flex items-center gap-6 text-[10px] tracking-widest text-[#F5F0E8]/50 uppercase">
          <Link href="/login"  className="hover:text-[#F5F0E8] transition-colors">Log In</Link>
          <Link href="/signup" className="bg-[#FF6B00] text-[#0A0A0A] px-4 py-2 hover:bg-[#F5F0E8] transition-colors">
            Start Free Trial
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* Heading */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Pricing</span>
            <div className="w-8 h-px bg-[#FF6B00]" />
          </div>
          <h1 className="font-heading text-6xl sm:text-8xl tracking-widest text-[#F5F0E8] leading-none mb-4">
            ONE PLAN.
          </h1>
          <h2 className="font-heading text-6xl sm:text-8xl tracking-widest text-[#FF6B00] leading-none mb-8">
            NO NONSENSE.
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 max-w-md mx-auto leading-relaxed">
            Unlimited permits. Instant alerts. No contracts.
            Cancel any time.
          </p>
        </div>

        {/* Pricing card + The Math */}
        <div className="grid lg:grid-cols-3 gap-0 mb-16">
          {/* Main plan */}
          <div className="lg:col-span-2 border border-[#FF6B00] p-10 relative">
            <div className="absolute top-0 right-0 bg-[#FF6B00] px-4 py-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#0A0A0A] uppercase">
                Only Plan
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-heading text-8xl text-[#F5F0E8]">$79</span>
              <span className="text-[#F5F0E8]/40 text-sm">/month</span>
            </div>
            <p className="text-xs text-[#F5F0E8]/60 tracking-widest uppercase mb-10">
              Per company · Unlimited permits
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Unlimited permit tracking — no per-permit fees",
                "Checks every 2 hours, 24 hours a day, 7 days a week",
                "Instant email alert the moment any status changes",
                "Full status history and audit trail",
                "All supported cities, new cities added weekly",
                "Priority email support",
                "14-day free trial — no credit card required",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-[#F5F0E8]/80">
                  <span className="text-[#FF6B00] mt-0.5 flex-shrink-0">■</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase px-10 py-4 hover:bg-[#F5F0E8] transition-colors"
            >
              START FREE TRIAL →
            </Link>
            <p className="mt-3 text-xs text-[#F5F0E8]/30">
              No credit card required to start
            </p>
          </div>

          {/* The Math */}
          <div className="border border-[#FF6B00]/20 border-t-0 lg:border-t lg:border-l-0 p-8 bg-[#FF6B00]/5">
            <div className="font-heading text-xl tracking-widest text-[#FF6B00] mb-6">
              THE MATH
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-[#F5F0E8]/40 text-xs uppercase tracking-widest mb-1">
                  Crew idle, 1 day
                </div>
                <div className="font-heading text-3xl text-[#F5F0E8]">$2,400</div>
              </div>
              <div className="w-full h-px bg-[#FF6B00]/20" />
              <div>
                <div className="text-[#F5F0E8]/40 text-xs uppercase tracking-widest mb-1">
                  ClearedNo / month
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

        {/* FAQ */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">FAQ</span>
          </div>

          <div className="space-y-0">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="border-b border-[#FF6B00]/10 py-6 grid sm:grid-cols-5 gap-4"
              >
                <div className="sm:col-span-2">
                  <p className="text-sm text-[#F5F0E8] font-mono leading-relaxed">{item.q}</p>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border border-[#FF6B00]/30 p-10 text-center relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

          <h3 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] mb-4">
            START FREE TRIAL
          </h3>
          <p className="text-sm text-[#F5F0E8]/40 mb-8 max-w-sm mx-auto">
            14 days free. No credit card. Cancel any time.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase px-12 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            Get Started Free →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#FF6B00]/10 px-6 py-8 mt-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-heading text-lg tracking-widest text-[#FF6B00]">
            CLEARED<span className="text-[#F5F0E8]/30">NO</span>
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase">
            <Link href="/"             className="hover:text-[#FF6B00] transition-colors">Home</Link>
            <Link href="/suggest-city" className="hover:text-[#FF6B00] transition-colors">Request a City</Link>
            <Link href="/privacy"      className="hover:text-[#FF6B00] transition-colors">Privacy</Link>
            <Link href="/terms"        className="hover:text-[#FF6B00] transition-colors">Terms</Link>
            <a href="mailto:support@clearedno.com" className="hover:text-[#FF6B00] transition-colors normal-case">
              support@clearedno.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
