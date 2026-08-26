import Link from "next/link";
import Image from "next/image";
import { liveCityList, LIVE_CITY_COUNT } from "@/lib/cities";

const FAQ = [
  {
    q: "What cities do you support?",
    a: `Automated tracking is live in ${liveCityList({ separator: ", ", conjunction: "and" })}. Other cities aren't tracked yet — request yours at clearedno.com/suggest-city and we'll email you when it launches.`,
  },
  {
    q: "Is the free tier really free?",
    a: "Yes. One tracked permit, no card, no time limit. It's checked on the same schedule as every paid permit and you get the same alerts. We'd rather you try it on a real job than read about it.",
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
    q: "Do permit slots expire?",
    a: "No. A slot is a one-time $9.99 purchase and it's yours permanently — it survives cancelling a subscription, and it never renews or bills again.",
  },
  {
    q: "When is the subscription worth it over slots?",
    a: "Slots are cheaper in raw dollars almost however many you buy, because they never bill again. The subscription is for pipelines that don't stop — unlimited permits with nothing to count, buy, or top up as jobs come in. If you're running a handful of jobs a year, buy slots.",
  },
  {
    q: "What happens if I cancel the subscription?",
    a: "You drop to the free tier — one tracked permit — plus any slots you bought outright, which you keep. Your permit history stays intact and nothing is deleted.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no annual lock-in, no questions asked. Cancel from your dashboard in 30 seconds.",
  },
  {
    q: "What if my city isn't supported?",
    a: "Request it at clearedno.com/suggest-city. We add cities based on demand, but only once the city's portal exposes a status feed we can poll reliably — so we can't promise a date. We'll email you the day it launches.",
  },
];

type Tier = {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
  note?: string;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    tagline: "One permit, tracked properly.",
    features: [
      "1 tracked permit",
      "Checks every 2 hours, 24/7",
      "Instant email alert on every status change",
      "Full status history",
      `All ${LIVE_CITY_COUNT} tracked cities`,
    ],
    cta: "Track a Permit Free →",
    href: "/signup",
    note: "No card required.",
  },
  {
    name: "Permit Slot",
    price: "$9.99",
    cadence: "one-time, each",
    tagline: "Add permits as jobs come in.",
    features: [
      "Everything in Free",
      "+1 tracked permit per slot",
      "One-time payment — never renews",
      "Yours permanently, even if you cancel later",
      "Buy from the dashboard when you hit the cap",
    ],
    cta: "Start Free, Add Later →",
    href: "/signup",
    note: "Bought inside the app, not here.",
  },
  {
    name: "Unlimited",
    price: "$79",
    cadence: "per month",
    tagline: "For pipelines that don't stop.",
    features: [
      "Unlimited tracked permits",
      "No per-permit fees, no counting",
      "Everything in Free, without the cap",
      "Priority email support",
      "Cancel anytime — you keep the free tier",
    ],
    cta: "Start Free Trial →",
    href: "/signup",
    featured: true,
    note: "First month free. Card required, not charged for 30 days.",
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
            Start Free
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* Heading */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Pricing</span>
            <div className="w-8 h-px bg-[#FF6B00]" />
          </div>
          <h1 className="font-heading text-6xl sm:text-8xl tracking-widest text-[#F5F0E8] leading-none mb-4">
            START FREE.
          </h1>
          <h2 className="font-heading text-6xl sm:text-8xl tracking-widest text-[#FF6B00] leading-none mb-8">
            PAY WHEN YOU GROW.
          </h2>
          <p className="text-sm text-[#F5F0E8]/50 max-w-lg mx-auto leading-relaxed">
            Track your first permit free, forever. Add more one at a time, or go
            unlimited when counting stops making sense.
          </p>
        </div>

        {/* Three tiers */}
        <div className="grid lg:grid-cols-3 gap-4 mb-14">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-8 flex flex-col ${
                tier.featured
                  ? "border-2 border-[#FF6B00]"
                  : "border border-[#FF6B00]/25"
              }`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-0 bg-[#FF6B00] px-3 py-1">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-[#0A0A0A] uppercase">
                    Most Permits
                  </span>
                </div>
              )}

              <div className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase mb-4">
                {tier.name}
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-heading text-5xl text-[#F5F0E8]">{tier.price}</span>
                <span className="text-xs text-[#F5F0E8]/40 font-mono">{tier.cadence}</span>
              </div>
              <p className="text-xs text-[#FF6B00]/70 font-mono mb-8">{tier.tagline}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs text-[#F5F0E8]/70 leading-relaxed">
                    <span className="text-[#FF6B00] mt-0.5 flex-shrink-0">■</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Link
                  href={tier.href}
                  className={`block text-center font-mono text-xs font-medium tracking-widest uppercase px-6 py-3.5 transition-colors ${
                    tier.featured
                      ? "bg-[#FF6B00] text-[#0A0A0A] hover:bg-[#F5F0E8]"
                      : "border border-[#FF6B00]/40 text-[#FF6B00] hover:bg-[#FF6B00] hover:text-[#0A0A0A]"
                  }`}
                >
                  {tier.cta}
                </Link>
                {tier.note && (
                  <p className="mt-2.5 text-[10px] text-[#F5F0E8]/30 text-center leading-relaxed">
                    {tier.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Which one, honestly ─────────────────────────────────────── */}
        <div className="border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-8 sm:p-10 mb-16">
          <div className="font-heading text-xl tracking-widest text-[#FF6B00] mb-2">
            WHICH ONE, HONESTLY
          </div>
          <p className="text-xs text-[#F5F0E8]/50 mb-8 max-w-2xl leading-relaxed">
            Slots are a one-time charge and never renew, so in raw dollars they
            stay cheaper than the subscription almost however many you buy. We&apos;d
            rather say that plainly than bury it.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono min-w-[420px]">
              <thead>
                <tr className="border-b border-[#FF6B00]/20 text-[#FF6B00]/70">
                  <th className="text-left py-2 pr-4 font-normal tracking-widest uppercase text-[10px]">Permits</th>
                  <th className="text-left py-2 pr-4 font-normal tracking-widest uppercase text-[10px]">With slots</th>
                  <th className="text-left py-2 font-normal tracking-widest uppercase text-[10px]">Unlimited, 1 year</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { permits: "1",   slots: "$0",      sub: "$948" },
                  { permits: "3",   slots: "$19.98",  sub: "$948" },
                  { permits: "10",  slots: "$89.91",  sub: "$948" },
                  { permits: "25",  slots: "$239.76", sub: "$948" },
                ].map((row) => (
                  <tr key={row.permits} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-4 text-[#F5F0E8]/80">{row.permits}</td>
                    <td className="py-3 pr-4 text-[#16A34A]">{row.slots} once</td>
                    <td className="py-3 text-[#F5F0E8]/50">{row.sub}/yr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-[#F5F0E8]/60 leading-relaxed max-w-2xl">
            <span className="text-[#F5F0E8]">So why subscribe?</span> Because
            counting costs something too. On the subscription there is no cap to
            hit, no purchase to make mid-job, and no permit you skipped tracking
            because it wasn&apos;t worth another $9.99. If your permit list changes
            week to week, buy the plan. If it doesn&apos;t, buy slots — we&apos;ll
            still be here.
          </p>
        </div>

        {/* The Math */}
        <div className="border border-[#FF6B00]/20 p-8 mb-16 grid sm:grid-cols-3 gap-8">
          <div>
            <div className="text-[#F5F0E8]/40 text-[10px] uppercase tracking-widest mb-1">
              Crew idle, 1 day
            </div>
            <div className="font-heading text-3xl text-[#F5F0E8]">$2,400</div>
          </div>
          <div>
            <div className="text-[#F5F0E8]/40 text-[10px] uppercase tracking-widest mb-1">
              One permit slot
            </div>
            <div className="font-heading text-3xl text-[#FF6B00]">$9.99</div>
          </div>
          <div>
            <div className="text-[#F5F0E8]/40 text-[10px] uppercase tracking-widest mb-1">
              Unlimited / month
            </div>
            <div className="font-heading text-3xl text-[#FF6B00]">$79</div>
          </div>
          <p className="sm:col-span-3 text-xs text-[#F5F0E8]/60 leading-relaxed border-t border-[#FF6B00]/10 pt-6">
            Half a day of idle crew pays for a year of monitoring. One slot costs
            less than twenty minutes of it.
          </p>
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
            TRACK ONE FREE
          </h3>
          <p className="text-sm text-[#F5F0E8]/40 mb-8 max-w-sm mx-auto">
            No card. No trial countdown. Put a real permit in and see whether the
            alert beats your city&apos;s portal.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-medium tracking-widest uppercase px-12 py-5 hover:bg-[#F5F0E8] transition-colors"
          >
            START FREE →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#FF6B00]/10 px-6 py-8 mt-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
