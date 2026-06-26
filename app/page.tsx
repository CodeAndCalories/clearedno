import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PermitLookupForm from "./permit-lookup-form";

export const metadata: Metadata = {
  title: "Check Any Building Permit Status — Free Lookup Tool | ClearedNo",
  description:
    "Look up building permit approval times, fees, and requirements for any major US city — free, no signup. Austin, Dallas, Houston, Columbus, Cleveland, Cincinnati & more.",
  alternates: {
    canonical: "https://www.clearedno.com",
  },
  openGraph: {
    title: "Check Any Building Permit Status — Free",
    description:
      "Look up permit approval times, fees, and requirements for any major US city. No signup required.",
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

      <main className="flex-1">

        {/* ── Hero + lookup tool ──────────────────────────────────────────── */}
        <section className="px-6 pt-20 pb-16 sm:pt-24 text-center">
          <p className="text-[10px] tracking-[0.4em] text-[#FF6B00]/70 uppercase mb-5">
            Free Tool · No Signup
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl tracking-widest text-[#F5F0E8] uppercase leading-[1.05] mb-5">
            Check Any Building<br />
            Permit Status — <span className="text-[#FF6B00]">Free</span>
          </h1>
          <p className="text-sm text-[#F5F0E8]/50 max-w-xl mx-auto leading-relaxed mb-12">
            Look up permit approval times, fees, and requirements for any major
            US city. No signup required.
          </p>

          <PermitLookupForm />
        </section>

        {/* ── Upsell: automatic tracking ──────────────────────────────────── */}
        <section className="px-6 pb-20">
          <div className="relative max-w-2xl mx-auto border border-[#FF6B00]/30 bg-[#FF6B00]/[0.03] p-8 sm:p-10 text-center">
            {/* corner accents */}
            <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
            <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
            <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
            <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />

            <p className="text-[9px] tracking-[0.35em] text-[#FF6B00]/60 uppercase mb-3">
              Already submitted?
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl tracking-widest text-[#F5F0E8] uppercase mb-3">
              Tracking a permit you already pulled?
            </h2>
            <p className="text-sm text-[#F5F0E8]/50 leading-relaxed max-w-md mx-auto mb-7">
              Get an email the second your permit status changes. Stop checking
              city portals every morning.
            </p>
            <Link
              href="/permits/landing"
              className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-4 hover:bg-[#F5F0E8] transition-colors"
            >
              Track It Automatically — $79/mo →
            </Link>
            <p className="mt-3 text-[10px] text-[#FF6B00]/50 tracking-widest uppercase">
              First month free
            </p>
          </div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#FF6B00]/10 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <p className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/20 uppercase">
            © {new Date().getFullYear()} ClearedNo
          </p>
          <Link
            href="/leads/landing"
            className="text-[9px] tracking-[0.2em] text-[#F5F0E8]/30 uppercase hover:text-[#FF6B00]/60 transition-colors"
          >
            Roofing contractors → see storm leads
          </Link>
        </div>
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
