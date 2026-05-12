import Link from "next/link";
import Image from "next/image";

const RECENT_POSTS = [
  { title: "Free Building Permit Lookup by Address — Search Any City (2026)", href: "/blog/free-permit-lookup-by-address" },
  { title: "Building Permit Status Check — How to Find Any Permit in the Midwest", href: "/blog/building-permit-status-check-guide" },
  { title: "Houston Building Permit Status Check — Complete 2026 Guide", href: "/blog/houston-building-permit-status-2026" },
  { title: "How to Check Building Inspection Status Online (OH, TX, IL, PA)", href: "/blog/how-to-check-building-inspection-status" },
  { title: "Austin TX Permit Search Tool: How to Find Any Permit", href: "/blog/austin-permit-tx-search-tool" },
  { title: "Tracking Multiple Permits Without Losing Your Mind", href: "/blog/contractor-permit-tracking-multiple-jobs" },
  { title: "Why Austin Permits Take So Long", href: "/blog/why-austin-permits-take-so-long" },
  { title: "Round Rock, Cedar Park & Georgetown Permit Requirements", href: "/blog/round-rock-cedar-park-permit-requirements" },
  { title: "Travis County Building Permits Guide", href: "/blog/travis-county-building-permits" },
  { title: "Austin Contractor Permit Lookup: What You Need to Know", href: "/blog/austin-contractor-permit-lookup" },
  { title: "How to Check Your Austin Building Permit Status", href: "/blog/how-to-check-austin-permit-status" },
  { title: "Average Permit Approval Times in Texas (2026)", href: "/blog/average-permit-times-texas" },
  { title: "What Does 'Permit Cleared' Actually Mean?", href: "/blog/what-does-permit-cleared-mean" },
  { title: "Columbus Ohio Building Permit Status Check (2026)", href: "/blog/columbus-ohio-building-permit-status-check" },
  { title: "Cleveland Building Permit Guide for Contractors", href: "/blog/cleveland-ohio-building-permit-guide-contractors" },
  { title: "Cincinnati Building Permit Approval Times 2026", href: "/blog/cincinnati-building-permit-approval-times-2026" },
  { title: "Grand Rapids Michigan Building Permit Guide", href: "/blog/grand-rapids-michigan-building-permit-guide" },
  { title: "Detroit Building Permit Status Check 2026", href: "/blog/detroit-building-permit-status-check-2026" },
  { title: "Philadelphia Building Permit Guide for Contractors", href: "/blog/philadelphia-building-permit-guide-contractors-2026" },
  { title: "Pittsburgh Building Permit Status 2026", href: "/blog/pittsburgh-building-permit-status-2026" },
  { title: "San Antonio Building Permit Guide 2026", href: "/blog/san-antonio-building-permit-guide-2026" },
  { title: "Houston Building Permit Status Check 2026", href: "/blog/houston-building-permit-status-check-2026" },
  { title: "Building Permit Tracking Software: What Contractors Actually Need", href: "/blog/building-permit-tracking-software-contractors" },
  { title: "Automatic Permit Status Alerts: Stop Checking Portals Every Morning", href: "/blog/automatic-permit-status-alerts-contractors" },
  { title: "Best Permit Monitoring Service for Contractors 2026", href: "/blog/best-permit-monitoring-service-2026" },
  { title: "The Contractor Permit Management Tool That Runs While You Sleep", href: "/blog/contractor-permit-management-tool" },
  { title: "Austin TX Permit Monitoring: Get Alerted the Second It Clears", href: "/blog/austin-tx-permit-monitoring-service" },
  { title: "Dallas TX Permit Status Alerts for Contractors", href: "/blog/dallas-tx-permit-status-alerts" },
  { title: "Houston TX Permit Tracking: Never Miss a Status Change", href: "/blog/houston-tx-permit-tracking-contractors" },
  { title: "How Much Does a Permit Delay Actually Cost? (2026)", href: "/blog/how-much-does-permit-delay-cost-contractors" },
  { title: "Permit Cleared: What Happens the Moment You Get the Alert", href: "/blog/permit-cleared-what-happens-next" },
  { title: "Permit Monitoring Coming to Ohio, Michigan & Pennsylvania", href: "/blog/ohio-michigan-pennsylvania-permit-monitoring" },
  { title: "San Antonio TX Permit Tracking for Contractors: 2026 Guide", href: "/blog/san-antonio-tx-permit-tracking-contractors" },
  { title: "How Contractors Never Miss a Permit Approval", href: "/blog/how-to-never-miss-permit-approval" },
  { title: "Permit Status Pending: What It Means and What to Do", href: "/blog/permit-status-pending-what-it-means" },
  { title: "How Contractors Reduce the Real Cost of Permit Wait Time", href: "/blog/reduce-permit-wait-time-contractors" },
];

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
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
            <Link href="/blog" className="hidden sm:block text-xs tracking-widest text-[#F5F0E8]/60 hover:text-[#FF6B00] transition-colors uppercase">Blog</Link>
            <Link href="/login" className="hidden sm:block text-xs tracking-widest text-[#F5F0E8]/60 hover:text-[#FF6B00] transition-colors uppercase">Log In</Link>
            <Link href="/signup" className="bg-[#FF6B00] text-[#0A0A0A] text-xs font-mono font-bold tracking-widest uppercase px-4 py-2 hover:bg-[#F5F0E8] transition-colors">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Content + Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-16">
          {/* Main content */}
          <main>{children}</main>

          {/* Sidebar */}
          <aside className="mt-16 lg:mt-0">
            {/* Recent Posts */}
            <div className="border border-[#FF6B00]/20 p-6 mb-6">
              <div className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase mb-4">Recent Posts</div>
              <ul className="space-y-3">
                {RECENT_POSTS.map((post) => (
                  <li key={post.href}>
                    <Link
                      href={post.href}
                      className="text-xs text-[#F5F0E8]/60 hover:text-[#FF6B00] transition-colors leading-relaxed block"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="border border-[#FF6B00]/40 bg-[#FF6B00]/5 p-6 relative">
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
              <div className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase mb-3">Stop Checking Manually</div>
              <p className="text-xs text-[#F5F0E8]/60 leading-relaxed mb-4">
                Get instant alerts when your Austin, Dallas, Houston, or San Antonio permit status changes.
                Columbus, Philadelphia, and Grand Rapids coming soon.
              </p>
              <Link
                href="/signup"
                className="block w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-[10px] font-bold tracking-widest uppercase py-3 text-center hover:bg-[#F5F0E8] transition-colors"
              >
                START FREE TRIAL →
              </Link>
              <p className="mt-2 text-[9px] text-[#F5F0E8]/25 text-center">First month free · Card not charged for 30 days</p>
            </div>

            {/* City links */}
            <div className="mt-6 border border-[#FF6B00]/10 p-6">
              <div className="text-[10px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-4">Permit Tracking By City</div>
              <ul className="space-y-2">
                {[
                  { label: "Austin, TX", href: "/austin" },
                  { label: "Dallas, TX", href: "/dallas" },
                  { label: "Houston, TX", href: "/houston" },
                  { label: "San Antonio, TX", href: "/san-antonio" },
                ].map((city) => (
                  <li key={city.href}>
                    <Link
                      href={city.href}
                      className="text-xs text-[#F5F0E8]/50 hover:text-[#FF6B00] transition-colors font-mono"
                    >
                      → {city.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2 border-t border-[#FF6B00]/10">
                  <span className="text-[9px] tracking-[0.2em] text-[#FF6B00]/40 uppercase font-mono">Coming Soon</span>
                </li>
                {[
                  { label: "Columbus, OH", href: "/suggest-city" },
                  { label: "Philadelphia, PA", href: "/suggest-city" },
                  { label: "Grand Rapids, MI", href: "/suggest-city" },
                ].map((city) => (
                  <li key={city.label}>
                    <Link
                      href={city.href}
                      className="text-xs text-[#F5F0E8]/30 hover:text-[#FF6B00] transition-colors font-mono"
                    >
                      → {city.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

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
