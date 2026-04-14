import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Roofing Leads & Permit Guides | ClearedNo",
  description:
    "Storm data insights, roofing lead strategies, and contractor permit guides from the ClearedNo team.",
  alternates: { canonical: "https://www.clearedno.com/blog" },
  openGraph: {
    title: "Blog | ClearedNo",
    description: "Roofing lead strategies and permit guides for contractors.",
    url: "https://www.clearedno.com/blog",
    type: "website",
  },
};

// ── Roofing leads articles ────────────────────────────────────────────────────

const ROOFING_POSTS = [
  {
    href: "/blog/ohio-roofing-leads",
    title: "Roofing leads in Ohio — how contractors find storm damage jobs in 2026",
    excerpt:
      "Ohio sees dozens of hail and wind damage events every year. Here's how the best roofing contractors find jobs before their competitors.",
    tag: "Roofing Leads",
    date: "April 2026",
    readTime: "5 min read",
  },
  {
    href: "/blog/roofing-lead-sources-2026",
    title: "Angi vs HomeAdvisor vs storm data — best roofing lead sources in 2026",
    excerpt:
      "Paying $300–600/month for shared leads that go to 5 competitors? There's a better way.",
    tag: "Roofing Leads",
    date: "April 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/ohio-hail-season-2025",
    title: "Ohio hail season 2025 — which counties got hit hardest",
    excerpt:
      "NOAA recorded 117 hail events in Ohio last year. Franklin, Hamilton and Cuyahoga counties saw the most activity.",
    tag: "Storm Data",
    date: "April 2026",
    readTime: "5 min read",
  },
];

// ── Permit articles ───────────────────────────────────────────────────────────

const PERMIT_POSTS = [
  {
    href: "/blog/austin-permit-tx-search-tool",
    title: "Austin TX Permit Search Tool: How to Find Any Permit in 2026",
    excerpt:
      "Whether you're looking up your own permit or researching a property — here's every way to search Austin permits by number, address, or contractor.",
    tag: "Austin, TX",
    date: "March 2026",
    readTime: "5 min read",
  },
  {
    href: "/blog/contractor-permit-tracking-multiple-jobs",
    title: "How Contractors Track Multiple Permit Applications Without Losing Their Minds",
    excerpt:
      "Running 8 jobs means 8 permits to watch across multiple city portals. Here's what actually works — spreadsheets, delegation, and automation.",
    tag: "Operations",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/why-austin-permits-take-so-long",
    title: "Why Austin Permits Take So Long (And What to Do About It)",
    excerpt:
      "What actually causes Austin permit delays, which project types are worst, and practical things that make a real difference.",
    tag: "Austin, TX",
    date: "March 2026",
    readTime: "7 min read",
  },
  {
    href: "/blog/round-rock-cedar-park-permit-requirements",
    title: "Permit Requirements in Round Rock, Cedar Park & Georgetown TX",
    excerpt:
      "Each of Austin's northern suburbs runs its own permit department. Here's how Round Rock, Cedar Park, and Georgetown compare — portals, timelines, and what they require.",
    tag: "Central Texas",
    date: "March 2026",
    readTime: "8 min read",
  },
  {
    href: "/blog/travis-county-building-permits",
    title: "Travis County Building Permits: A Contractor's Guide",
    excerpt:
      "Building in unincorporated Travis County is a different process than building inside Austin. Here's what changes, the ETJ situation, and what trips people up.",
    tag: "Travis County",
    date: "March 2026",
    readTime: "7 min read",
  },
  {
    href: "/blog/austin-contractor-permit-lookup",
    title: "Austin Contractor Permit Lookup: What You Need to Know in 2026",
    excerpt:
      "Austin runs two permit systems that don't talk to each other well. Here's how to navigate both — and what each status actually means.",
    tag: "Austin, TX",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/how-to-check-austin-permit-status",
    title: "How to Check Your Austin Building Permit Status in 2026",
    excerpt:
      "A step-by-step guide to checking your Austin permit status manually — and why most contractors eventually stop doing it by hand.",
    tag: "Austin, TX",
    date: "March 2026",
    readTime: "5 min read",
  },
  {
    href: "/blog/average-permit-times-texas",
    title: "Average Building Permit Approval Times in Texas (2026)",
    excerpt:
      "How long does it take to get a building permit in Austin, Dallas, Houston, and San Antonio? We break it down by city and project type.",
    tag: "Texas",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/what-does-permit-cleared-mean",
    title: "What Does 'Permit Cleared' Actually Mean? A Contractor's Guide",
    excerpt:
      "The difference between pending, approved, issued, cleared, and finaled — and what you can and can't do at each stage.",
    tag: "Permits 101",
    date: "March 2026",
    readTime: "4 min read",
  },
  {
    href: "/blog/houston-building-permit-status-check-2026",
    title: "Houston Building Permit Status Check: A Contractor's Guide (2026)",
    excerpt:
      "Houston's AMANDA portal, no-zoning quirks, ETJ complications, and how to track a residential or commercial permit from submission to final.",
    tag: "Houston, TX",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/san-antonio-building-permit-guide-2026",
    title: "San Antonio Building Permit Guide for Contractors (2026)",
    excerpt:
      "San Antonio's SAconnect portal, typical approval timelines, Historic Design Review, and what to do when your permit gets stuck.",
    tag: "San Antonio, TX",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/columbus-ohio-building-permit-status-check",
    title: "Columbus Ohio Building Permit Status Check: A Complete Guide (2026)",
    excerpt:
      "How to search the Columbus Accela portal, what Applied/Issued/Finaled statuses mean, typical 6–10 week timelines, and common delay causes.",
    tag: "Columbus, OH",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/cleveland-ohio-building-permit-guide-contractors",
    title: "Cleveland Building Permit Guide for Contractors (2026)",
    excerpt:
      "Cleveland Building & Housing portal walkthrough, what PENDING vs ISSUED vs FINAL means, inspection requirements, and how to get unstuck.",
    tag: "Cleveland, OH",
    date: "March 2026",
    readTime: "7 min read",
  },
  {
    href: "/blog/cincinnati-building-permit-approval-times-2026",
    title: "Cincinnati Building Permit Approval Times in 2026",
    excerpt:
      "Hamilton County vs. City of Cincinnati split jurisdiction explained, two different portals, typical timeframes, and why contractors get confused.",
    tag: "Cincinnati, OH",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/grand-rapids-michigan-building-permit-guide",
    title: "Grand Rapids Michigan Building Permit Guide: How to Search and Track (2026)",
    excerpt:
      "BS&A Online portal explained, how to search by permit number, typical 4–8 week timelines, and what contractors commonly get wrong.",
    tag: "Grand Rapids, MI",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/detroit-building-permit-status-check-2026",
    title: "Detroit Building Permit Status Check: What Contractors Need to Know (2026)",
    excerpt:
      "BSEED portal walkthrough, why Detroit's dual system is complex, practical tracking steps, and what to do when your permit disappears.",
    tag: "Detroit, MI",
    date: "March 2026",
    readTime: "7 min read",
  },
  {
    href: "/blog/philadelphia-building-permit-guide-contractors-2026",
    title: "Philadelphia Building Permit Guide for Contractors (2026)",
    excerpt:
      "eCLIPSE portal walkthrough, L&I department explained, 8–12 week residential wait, expedited review options, and common delay causes.",
    tag: "Philadelphia, PA",
    date: "March 2026",
    readTime: "7 min read",
  },
  {
    href: "/blog/pittsburgh-building-permit-status-2026",
    title: "Pittsburgh Building Permit Status: How to Track Your Permit in 2026",
    excerpt:
      "PLI portal walkthrough, what each status means, common contractor mistakes, historic district complications, and how to escalate delays.",
    tag: "Pittsburgh, PA",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/building-permit-tracking-software-contractors",
    title: "Building Permit Tracking Software: What Contractors Actually Need in 2026",
    excerpt:
      "Manual permit checking wastes hours every week. What to look for in a permit tracking tool, why automation matters, and what actually works for contractors.",
    tag: "Operations",
    date: "March 2026",
    readTime: "7 min read",
  },
  {
    href: "/blog/automatic-permit-status-alerts-contractors",
    title: "Automatic Permit Status Alerts: Stop Checking City Portals Every Morning",
    excerpt:
      "The daily pain of checking portals manually, what instant permit alerts look like, and how much time and money automatic notifications save contractors.",
    tag: "Operations",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/best-permit-monitoring-service-2026",
    title: "Best Building Permit Monitoring Service for Contractors in 2026",
    excerpt:
      "What permit monitoring options exist, what to compare, and why simplicity wins. A no-nonsense breakdown for contractors who want to stop checking portals manually.",
    tag: "Operations",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/contractor-permit-management-tool",
    title: "The Contractor Permit Management Tool That Runs While You Sleep",
    excerpt:
      "Managing 5–10 active permits at once. Why spreadsheets break down at scale. The real cost of a missed permit alert and what automated management looks like.",
    tag: "Operations",
    date: "March 2026",
    readTime: "7 min read",
  },
  {
    href: "/blog/austin-tx-permit-monitoring-service",
    title: "Austin TX Permit Monitoring: Get Alerted the Second Your Permit Clears",
    excerpt:
      "Austin's ABC portal pain points, why manual checking fails, and how ClearedNo monitors Austin permits 24/7 so contractors never miss a status change.",
    tag: "Austin, TX",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/dallas-tx-permit-status-alerts",
    title: "Dallas TX Permit Status Alerts for Contractors",
    excerpt:
      "Dallas portal issues, why contractors miss status changes in eDevelopment, and how instant permit alerts close the notification gap.",
    tag: "Dallas, TX",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/houston-tx-permit-tracking-contractors",
    title: "Houston TX Permit Tracking: Never Miss a Status Change Again",
    excerpt:
      "Houston's permit volume is massive. Missing a clearance means days of delay and cascading schedule problems. Automation is the only answer that scales.",
    tag: "Houston, TX",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    href: "/blog/how-much-does-permit-delay-cost-contractors",
    title: "How Much Does a Permit Delay Actually Cost Contractors? (2026 Numbers)",
    excerpt:
      "Real numbers on permit delays: crew idle time, equipment rental, client penalties, and schedule compression. The $2,400/day math explained.",
    tag: "Business",
    date: "March 2026",
    readTime: "8 min read",
  },
  {
    href: "/blog/permit-cleared-what-happens-next",
    title: "Permit Cleared: What Happens the Moment You Get the Alert",
    excerpt:
      "A permit clearance is a starting gun. The first contractor to mobilize wins schedule. Here's what the first 30 minutes after a clearance should look like.",
    tag: "Permits 101",
    date: "March 2026",
    readTime: "5 min read",
  },
  {
    href: "/blog/ohio-michigan-pennsylvania-permit-monitoring",
    title: "Permit Monitoring Coming to Ohio, Michigan & Pennsylvania — Join the Waitlist",
    excerpt:
      "ClearedNo is expanding to Columbus, Cleveland, Cincinnati, Grand Rapids, Detroit, Philadelphia, and Pittsburgh. Request your city to move it up the queue.",
    tag: "Expansion",
    date: "March 2026",
    readTime: "5 min read",
  },
];

function PostRow({ post, last }: { post: typeof PERMIT_POSTS[number]; last: boolean }) {
  return (
    <Link
      href={post.href}
      className={`block group px-6 py-8 hover:bg-[#FF6B00]/5 transition-colors ${
        !last ? "border-b border-[#FF6B00]/20" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[9px] tracking-[0.25em] text-[#FF6B00] uppercase font-mono border border-[#FF6B00]/40 px-2 py-0.5">
          {post.tag}
        </span>
        <span className="text-[10px] text-[#F5F0E8]/25 font-mono">{post.date}</span>
        <span className="text-[10px] text-[#F5F0E8]/25 font-mono">· {post.readTime}</span>
      </div>
      <h2 className="font-heading text-2xl tracking-widest text-[#F5F0E8] group-hover:text-[#FF6B00] transition-colors mb-3 leading-[1.1]">
        {post.title.toUpperCase()}
      </h2>
      <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">{post.excerpt}</p>
      <div className="mt-4 text-[10px] tracking-[0.2em] text-[#FF6B00] uppercase font-mono group-hover:translate-x-1 transition-transform inline-block">
        Read More →
      </div>
    </Link>
  );
}

export default function BlogIndexPage() {
  const allPosts = [...ROOFING_POSTS, ...PERMIT_POSTS];
  return (
    <div>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#FF6B00]" />
          <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">ClearedNo Blog</span>
        </div>
        <h1 className="font-heading text-5xl sm:text-6xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-4">
          FIELD NOTES<br />
          <span className="text-[#FF6B00]">FOR CONTRACTORS.</span>
        </h1>
        <p className="text-sm text-[#F5F0E8]/50 leading-relaxed max-w-lg">
          Roofing lead strategies, storm data insights, and permit guides — written for the people
          actually doing the work.
        </p>
      </div>

      <div className="space-y-0 border border-[#FF6B00]/20">
        {allPosts.map((post, i) => (
          <PostRow key={post.href} post={post} last={i === allPosts.length - 1} />
        ))}
      </div>
    </div>
  );
}
