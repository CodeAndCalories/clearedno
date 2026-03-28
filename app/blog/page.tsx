import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contractor Blog — Permit Tips & News | ClearedNo",
  description:
    "Guides and tips for Texas contractors on building permits, approval times, and status tracking in Austin, Dallas, Houston, and San Antonio.",
  alternates: { canonical: "https://www.clearedno.com/blog" },
  openGraph: {
    title: "Contractor Blog | ClearedNo",
    description: "Permit guides for Texas contractors.",
    url: "https://www.clearedno.com/blog",
    type: "website",
  },
};

const POSTS = [
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
];

export default function BlogIndexPage() {
  return (
    <div>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#FF6B00]" />
          <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">ClearedNo Blog</span>
        </div>
        <h1 className="font-heading text-5xl sm:text-6xl tracking-widest text-[#F5F0E8] leading-[0.95] mb-4">
          PERMIT GUIDES<br />
          <span className="text-[#FF6B00]">FOR CONTRACTORS.</span>
        </h1>
        <p className="text-sm text-[#F5F0E8]/50 leading-relaxed max-w-lg">
          No-fluff guides on building permits in Texas — written for the people actually waiting
          on them, not the bureaucrats issuing them.
        </p>
      </div>

      <div className="space-y-0 border border-[#FF6B00]/20">
        {POSTS.map((post, i) => (
          <Link
            key={post.href}
            href={post.href}
            className={`block group px-6 py-8 hover:bg-[#FF6B00]/5 transition-colors ${
              i < POSTS.length - 1 ? "border-b border-[#FF6B00]/20" : ""
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
        ))}
      </div>
    </div>
  );
}
