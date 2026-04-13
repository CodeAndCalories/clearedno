import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ClearedNo — Tools Built for Contractors",
  description:
    "Permit monitoring and roofing leads for contractors. Stop waiting. Start working.",
  alternates: {
    canonical: "https://www.clearedno.com",
  },
  openGraph: {
    title: "ClearedNo — Tools Built for Contractors",
    description:
      "Permit monitoring and roofing leads for contractors. Stop waiting. Start working.",
    url: "https://www.clearedno.com",
    type: "website",
    images: [{ url: "/clearedno-icon.png", width: 512, height: 512, alt: "ClearedNo" }],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-mono flex flex-col">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/clearedno-icon.png"
            alt="ClearedNo"
            width={26}
            height={26}
            className="rounded-sm"
            priority
          />
          <span className="font-heading text-2xl tracking-widest text-[#FF6B00]">
            CLEARED<span className="text-[#F5F0E8]">NO</span>
          </span>
        </Link>
        <Link
          href="/login"
          className="text-xs tracking-widest text-[#F5F0E8]/40 uppercase hover:text-[#FF6B00] transition-colors"
        >
          Log In
        </Link>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-[10px] tracking-[0.4em] text-[#FF6B00]/70 uppercase mb-5">
          ClearedNo
        </p>
        <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl tracking-widest text-[#F5F0E8] uppercase leading-none mb-4">
          Tools Built for<br />
          <span className="text-[#FF6B00]">Contractors</span>
        </h1>
        <p className="text-sm text-[#F5F0E8]/40 max-w-sm leading-relaxed mb-16">
          Stop waiting. Stop checking manually. Get the data that moves your business forward.
        </p>

        {/* ── Product cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">

          {/* Card 1 — Permit Tracker */}
          <div className="border border-[#FF6B00]/30 p-8 relative bg-[#0A0A0A] flex flex-col gap-6 text-left">
            {/* corner accents */}
            <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
            <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
            <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
            <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

            <div>
              <p className="text-[9px] tracking-[0.35em] text-[#FF6B00]/60 uppercase mb-3">
                Product 01
              </p>
              <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] uppercase mb-3">
                Permit Tracker
              </h2>
              <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">
                Track permit status across any US city. Get alerted the moment your permit clears.
              </p>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase mb-1">Starting at</p>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl tracking-widest text-[#F5F0E8]">$79</span>
                <span className="text-[#F5F0E8]/40 text-sm">/month</span>
              </div>
              <p className="text-[10px] text-[#FF6B00]/50 tracking-widest uppercase mt-1">
                First month free
              </p>
            </div>

            <div className="mt-auto">
              <Link
                href="/permits/landing"
                className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-[10px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] transition-colors w-full text-center"
              >
                View Plans →
              </Link>
            </div>
          </div>

          {/* Card 2 — Contractor Leads */}
          <div className="border border-[#FF6B00]/30 p-8 relative bg-[#0A0A0A] flex flex-col gap-6 text-left">
            <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
            <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
            <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
            <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

            <div>
              <p className="text-[9px] tracking-[0.35em] text-[#FF6B00]/60 uppercase mb-3">
                Product 02
              </p>
              <h2 className="font-heading text-3xl tracking-widest text-[#F5F0E8] uppercase mb-3">
                Contractor Leads
              </h2>
              <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">
                Weekly hail and storm leads for roofing contractors. Sourced from NOAA. Updated every Monday.
              </p>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase mb-1">Starting at</p>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl tracking-widest text-[#F5F0E8]">$300</span>
                <span className="text-[#F5F0E8]/40 text-sm">/month</span>
              </div>
              <p className="text-[10px] text-[#F5F0E8]/20 tracking-widest uppercase mt-1">
                30-day money-back guarantee
              </p>
            </div>

            <div className="mt-auto">
              <Link
                href="/leads/landing"
                className="inline-block border border-[#FF6B00] text-[#FF6B00] font-mono text-[10px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#FF6B00] hover:text-[#0A0A0A] transition-colors w-full text-center"
              >
                See Leads →
              </Link>
            </div>
          </div>

        </div>

        {/* Sign in link */}
        <p className="mt-10 text-xs text-[#F5F0E8]/30">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#FF6B00]/10 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase">
          © {new Date().getFullYear()} ClearedNo
        </p>
        <div className="flex gap-6">
          {[["Privacy", "/privacy"], ["Terms", "/terms"], ["Refunds", "/refunds"]].map(
            ([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase hover:text-[#FF6B00]/60 transition-colors"
              >
                {label}
              </Link>
            )
          )}
        </div>
      </footer>

    </div>
  );
}
