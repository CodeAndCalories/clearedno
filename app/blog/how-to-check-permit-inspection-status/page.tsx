import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Check Building Permit Inspection Status in Ohio, Illinois, Indiana | ClearedNo",
  description:
    "Check building permit inspection status online in OH, IL, and IN. Search by address or permit number. Free lookup tools and what each status means.",
  keywords: [
    "check permit inspection status Ohio",
    "building permit inspection status Illinois",
    "Indiana permit inspection lookup",
    "Columbus permit status check",
    "Indianapolis permit inspection",
    "Chicago building permit status",
  ],
  alternates: { canonical: "https://www.clearedno.com/blog/how-to-check-permit-inspection-status" },
  openGraph: {
    title: "How to Check Building Permit Inspection Status in Ohio, Illinois, Indiana",
    description:
      "Check building permit inspection status online in OH, IL, and IN. Search by address or permit number. Free lookup tools and what each status means.",
    url: "https://www.clearedno.com/blog/how-to-check-permit-inspection-status",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Check Building Permit Inspection Status in Ohio, Illinois, Indiana",
  description:
    "Check building permit inspection status online in OH, IL, and IN. Search by address or permit number. Free lookup tools and what each status means.",
  author: { "@type": "Organization", name: "ClearedNo" },
  publisher: { "@type": "Organization", name: "ClearedNo", url: "https://www.clearedno.com" },
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
};

const STATUS_DEFINITIONS = [
  { status: "Scheduled",  desc: "Inspection is booked, waiting for inspector" },
  { status: "Passed",     desc: "Inspection complete, work approved" },
  { status: "Failed",     desc: "Inspector found issues, corrections required" },
  { status: "Pending",    desc: "Submitted but not yet scheduled" },
  { status: "Final",      desc: "All inspections complete, permit closed out" },
];

const OHIO_PORTALS = [
  { city: "Columbus",    detail: "Columbus Building Services portal — search by address or permit number at permits.columbus.gov" },
  { city: "Cleveland",   detail: "City of Cleveland Building Department — ePlans portal for status checks" },
  { city: "Cincinnati",  detail: "Hamilton County Building Inspections — search by permit number" },
  { city: "Dayton",      detail: "City of Dayton Permit Center — online status available at daytonohio.gov" },
];

const ILLINOIS_PORTALS = [
  { city: "Chicago",             detail: "Chicago Building Portal at chicago.gov/city/en/depts/bldgs — search by address" },
  { city: "Rockford",            detail: "Rockford Building and Inspections — online portal available" },
  { city: "Springfield",         detail: "City of Springfield permits — phone or online depending on project type" },
  { city: "Aurora / Naperville / Joliet", detail: "Most use a regional system — check your specific city's building department website" },
];

const INDIANA_PORTALS = [
  { city: "Indianapolis", detail: "Indy eGov portal at indy.gov — search by address or permit number" },
  { city: "Fort Wayne",   detail: "City of Fort Wayne Building Commission — online lookup available" },
  { city: "South Bend",   detail: "St. Joseph County portal — permit status by number" },
  { city: "Evansville",   detail: "City of Evansville — building permits searchable online" },
];

export default function PermitInspectionStatusPost() {
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">OH · IL · IN</span>
          <span className="text-[10px] text-[#F5F0E8]/25 font-mono">April 2026 · 6 min read</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-6">
          HOW TO CHECK BUILDING PERMIT INSPECTION STATUS IN OHIO, ILLINOIS, INDIANA
        </h1>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed border-l-2 border-[#FF6B00]/40 pl-4">
          If you&apos;re a contractor waiting on a permit inspection, knowing the status before you
          show up on site saves time and avoids costly delays.
        </p>
      </header>

      {/* Body */}
      <div className="prose-custom space-y-8 text-sm text-[#F5F0E8]/70 leading-relaxed">

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT &ldquo;INSPECTION STATUS&rdquo; ACTUALLY MEANS</h2>
          <p>Most city permit portals break inspection status into a few stages:</p>
          <div className="mt-4 border border-[#FF6B00]/20 overflow-hidden">
            {STATUS_DEFINITIONS.map((row, i) => (
              <div
                key={row.status}
                className={`flex gap-4 px-5 py-3 ${i % 2 === 0 ? "" : "bg-[#FF6B00]/3"} ${i < STATUS_DEFINITIONS.length - 1 ? "border-b border-[#FF6B00]/10" : ""}`}
              >
                <span className="font-mono text-xs text-[#FF6B00] w-24 flex-shrink-0">{row.status}</span>
                <span className="text-xs text-[#F5F0E8]/60">{row.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO CHECK IN OHIO</h2>
          <p>
            Ohio permit inspections are managed at the city and county level. Here are the main portals:
          </p>
          <ul className="space-y-4 mt-4">
            {OHIO_PORTALS.map((item) => (
              <li key={item.city} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span><strong className="text-[#F5F0E8]">{item.city}:</strong> {item.detail}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">Most Ohio cities update inspection status within 24 hours of the inspector&apos;s visit.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO CHECK IN ILLINOIS</h2>
          <p>Illinois permit inspections vary significantly by municipality.</p>
          <ul className="space-y-4 mt-4">
            {ILLINOIS_PORTALS.map((item) => (
              <li key={item.city} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span><strong className="text-[#F5F0E8]">{item.city}:</strong> {item.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">HOW TO CHECK IN INDIANA</h2>
          <ul className="space-y-4 mt-4">
            {INDIANA_PORTALS.map((item) => (
              <li key={item.city} className="flex gap-3">
                <span className="text-[#FF6B00] flex-shrink-0 mt-0.5">→</span>
                <span><strong className="text-[#F5F0E8]">{item.city}:</strong> {item.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">WHAT TO DO IF YOUR INSPECTION FAILED</h2>
          <p>A failed inspection doesn&apos;t mean the project is dead. Here&apos;s the typical process:</p>
          <ol className="space-y-3 mt-4 ml-4">
            {[
              { n: "1", t: "Review the correction notice from the inspector" },
              { n: "2", t: "Make the required repairs or changes" },
              { n: "3", t: "Request a re-inspection through the same portal" },
              { n: "4", t: "Most cities schedule re-inspections within 3–5 business days" },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-5 h-5 border border-[#FF6B00]/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-mono flex-shrink-0">{step.n}</span>
                <span>{step.t}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">TRACKING MULTIPLE PERMITS ACROSS CITIES</h2>
          <p>
            If you&apos;re a contractor managing permits in multiple cities, checking each portal
            individually gets old fast.
          </p>
          <p className="mt-3">
            ClearedNo&apos;s Permit Tracker monitors permit status across major Midwest cities
            automatically — you get an email alert the moment a status changes. No more logging
            into 5 different portals every morning.
          </p>
        </section>

        {/* CTA */}
        <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
          <h3 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-3">SEE HOW THE PERMIT TRACKER WORKS</h3>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
            Automatic status alerts across OH, IL, IN, MI, KY, and PA.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors text-center"
          >
            SEE HOW THE PERMIT TRACKER WORKS →
          </Link>
        </div>

        <section>
          <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] mb-4">FAQS</h2>
          <div className="space-y-6">
            {[
              {
                q: "How long does a permit inspection take to schedule?",
                a: "Typically 3–10 business days depending on the city and inspector workload. Chicago and Columbus tend to run longer during busy seasons.",
              },
              {
                q: "Can I check permit status by address?",
                a: "Yes — most city portals allow address-based search. Some require the exact permit number.",
              },
              {
                q: "What if my city isn't listed?",
                a: "Search \"[your city] building permit inspection status\" — most municipalities have an online portal now. If not, call the building department directly.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <p className="font-heading text-base tracking-widest text-[#F5F0E8] mb-2">{faq.q}</p>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <nav className="border-t border-[#FF6B00]/10 pt-6 flex flex-col sm:flex-row gap-4 justify-between text-xs text-[#F5F0E8]/40 font-mono">
          <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">← All posts</Link>
          <Link href="/blog/cincinnati-building-permit-approval-times-2026" className="hover:text-[#FF6B00] transition-colors">
            Cincinnati Permit Approval Times →
          </Link>
        </nav>
      </div>
    </article>
  );
}
