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
    a: "No. A slot is a one-time $29 purchase and it's yours permanently — it survives cancelling a subscription, and it never renews or bills again.",
  },
  {
    q: "When is the subscription worth it over slots?",
    a: "Count the new permits you pull in a typical month. At one or two, slots win — $29 or $58, paid once and never again. At three a month you'd spend $87 on slots against $79 for unlimited, so the subscription is cheaper from the first month and stays cheaper every month after. A list that sits still at any size: buy slots. Three or more new permits a month: subscribe.",
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
    price: "$29",
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
            A slot is $29, once. Unlimited is $79, every month. Which one is
            cheaper comes down to a single question — does your permit list sit
            still, or does it keep moving? Both answers are below, with the
            arithmetic.
          </p>

          {/* A — a list that sits still */}
          <div className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase mb-3">
            A list that sits still &rarr; buy slots
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono min-w-[420px]">
              <thead>
                <tr className="border-b border-[#FF6B00]/20 text-[#FF6B00]/70">
                  <th className="text-left py-2 pr-4 font-normal tracking-widest uppercase text-[10px]">Permits</th>
                  <th className="text-left py-2 pr-4 font-normal tracking-widest uppercase text-[10px]">Slots to buy</th>
                  <th className="text-left py-2 font-normal tracking-widest uppercase text-[10px]">You pay, total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { permits: "1", slots: "0 — included free", total: "$0"   },
                  { permits: "2", slots: "1",                  total: "$29"  },
                  { permits: "3", slots: "2",                  total: "$58"  },
                  { permits: "5", slots: "4",                  total: "$116" },
                ].map((row) => (
                  <tr key={row.permits} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-4 text-[#F5F0E8]/80">{row.permits}</td>
                    <td className="py-3 pr-4 text-[#F5F0E8]/50">{row.slots}</td>
                    <td className="py-3 text-[#16A34A]">{row.total} once</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 mb-10 text-xs text-[#F5F0E8]/60 leading-relaxed max-w-2xl">
            Paid once, then never again. Five permits watched forever costs $116
            — less than two months of unlimited, and there is no third month.
            If this is you, don&apos;t buy the subscription.
          </p>

          {/* B — a list that keeps moving */}
          <div className="text-[10px] tracking-[0.25em] text-[#FF6B00] uppercase mb-3">
            A list that keeps moving &rarr; subscribe
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono min-w-[420px]">
              <thead>
                <tr className="border-b border-[#FF6B00]/20 text-[#FF6B00]/70">
                  <th className="text-left py-2 pr-4 font-normal tracking-widest uppercase text-[10px]">New permits / month</th>
                  <th className="text-left py-2 pr-4 font-normal tracking-widest uppercase text-[10px]">Slots cost</th>
                  <th className="text-left py-2 font-normal tracking-widest uppercase text-[10px]">Unlimited</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rate: "1", slots: "$29/mo",  cheaper: "slots" },
                  { rate: "2", slots: "$58/mo",  cheaper: "slots" },
                  { rate: "3", slots: "$87/mo",  cheaper: "sub"   },
                  { rate: "5", slots: "$145/mo", cheaper: "sub"   },
                ].map((row) => (
                  <tr key={row.rate} className="border-b border-[#FF6B00]/10">
                    <td className="py-3 pr-4 text-[#F5F0E8]/80">{row.rate}</td>
                    <td
                      className={`py-3 pr-4 ${
                        row.cheaper === "slots" ? "text-[#16A34A]" : "text-[#F5F0E8]/50"
                      }`}
                    >
                      {row.slots}
                    </td>
                    <td
                      className={`py-3 ${
                        row.cheaper === "sub" ? "text-[#16A34A]" : "text-[#F5F0E8]/50"
                      }`}
                    >
                      $79/mo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-[#F5F0E8]/60 leading-relaxed max-w-2xl">
            <span className="text-[#F5F0E8]">Three a month is the crossover.</span>{" "}
            At three new permits a month you spend $87 on slots against $79 for
            unlimited — and you spend it again next month, and the month after
            that. From three and up the subscription is simply the cheaper way to
            buy the same thing, before you count the time lost buying slots
            mid-job.
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
            <div className="font-heading text-3xl text-[#FF6B00]">$29</div>
          </div>
          <div>
            <div className="text-[#F5F0E8]/40 text-[10px] uppercase tracking-widest mb-1">
              Unlimited / month
            </div>
            <div className="font-heading text-3xl text-[#FF6B00]">$79</div>
          </div>
          <p className="sm:col-span-3 text-xs text-[#F5F0E8]/60 leading-relaxed border-t border-[#FF6B00]/10 pt-6">
            Half a day of idle crew pays for a year of monitoring. One slot costs
            under ten minutes of it.
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
