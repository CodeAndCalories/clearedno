import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// Article data
// ---------------------------------------------------------------------------

interface Article {
  title: string;
  slug: string;
  date: string;
  description: string;
  body: React.ReactNode;
}

const ARTICLES: Article[] = [
  {
    title: "Roofing leads in Ohio — how contractors find storm damage jobs in 2026",
    slug: "ohio-roofing-leads",
    date: "April 14, 2026",
    description:
      "Ohio sees dozens of hail and wind damage events every year. Here's how the best roofing contractors find jobs before their competitors.",
    body: (
      <>
        <p>
          Ohio is one of the most active hail states in the country. Every spring and summer, storm
          cells roll across the Great Lakes region and drop golf ball-sized hail on counties from
          Toledo to Youngstown. NOAA's Storm Events Database recorded over 100 significant hail
          events in Ohio in 2025 alone — each one representing dozens of homes with damaged shingles
          and homeowners who don't yet know they need a new roof.
        </p>
        <p>
          The contractors who win those jobs aren't waiting for referrals. They're working the data.
        </p>
        <h2>How storm-based lead generation works</h2>
        <p>
          When NOAA logs a hail event, it records the date, county, and the size of the hailstones
          in inches. Hail above 1 inch causes measurable shingle granule loss. Hail above 1.5 inches
          typically destroys asphalt shingles outright, guaranteeing an insurance claim.
        </p>
        <p>
          Savvy roofing contractors pull this data as fast as possible — ideally within days of a
          storm — and canvass the affected counties before insurance adjusters finish their
          inspections. The window between "hail fell" and "homeowner signs with someone else" is
          narrow. Contractors who move first close more jobs.
        </p>
        <h2>The counties to watch in Ohio</h2>
        <p>
          Not all Ohio counties see equal storm activity. Franklin (Columbus), Cuyahoga (Cleveland),
          Hamilton (Cincinnati), and Summit (Akron) counties are the highest-volume markets — dense
          population, aging roofs, and regular storm tracks from the southwest. Smaller counties like
          Delaware, Licking, and Stark also see consistent hail exposure due to their position in
          common tornado and thunderstorm corridors.
        </p>
        <p>
          For wind damage leads, the Lake Erie shoreline counties — Lorain, Erie, Ottawa — see
          significant wind events that lift and crack shingles even without hail. Insurance carriers
          process these claims at high rates because the damage is usually visible and undeniable.
        </p>
        <h2>What separates good leads from bad ones</h2>
        <p>
          The difference between a county-level hail record and a usable roofing lead is specificity
          and timing. A contractor who knows that Licking County saw 1.25-inch hail on March 15
          can canvass targeted neighborhoods within a week. A contractor who gets a vague "Ohio got
          hit by storms" alert three months later is wasting marketing dollars.
        </p>
        <p>
          At ClearedNo, we pull NOAA data weekly, score every event by severity, and deliver a
          sorted list of counties ranked by damage potential. Hot leads are 1-inch+ hail events.
          Warm leads are under 1 inch but still worth a canvass. You know which jobs to chase first.
        </p>
        <h2>The ROI math</h2>
        <p>
          The average roofing replacement in Ohio runs $8,000–$15,000. If you convert even one
          callback per month into a signed job, the math works at $300/month. Most contractors
          on our list close 3–5 jobs a month from the data. That's not a marketing expense —
          that's a revenue engine.
        </p>
      </>
    ),
  },
  {
    title: "Angi vs HomeAdvisor vs storm data — best roofing lead sources in 2026",
    slug: "roofing-lead-sources-2026",
    date: "April 14, 2026",
    description:
      "Paying $300-600/month for shared leads that go to 5 competitors? There's a better way.",
    body: (
      <>
        <p>
          Every roofing contractor has heard the pitch: pay us a monthly fee and we'll send you
          warm leads. Angi (formerly Angie's List), HomeAdvisor, Thumbtack, and a dozen other
          platforms have built billion-dollar businesses on this promise. But if you've been on
          any of these platforms for more than six months, you already know the frustrations.
        </p>
        <h2>The shared-lead problem</h2>
        <p>
          Angi and HomeAdvisor sell the same lead to multiple contractors simultaneously. When a
          homeowner submits a request, that contact information gets sent to 3–5 contractors at
          once. You're not getting a lead — you're entering a race. The contractor who calls back
          fastest wins, and the others wasted their money.
        </p>
        <p>
          Angi charges $300–$600/month for membership, plus per-lead fees of $15–$85 depending on
          the job type and market. A roofing lead in a competitive metro market can cost $60–$85
          per contact. If you're converting 1 in 5, you're paying $300–$425 in lead costs for
          every job before you've even touched a shingle.
        </p>
        <h2>HomeAdvisor's model</h2>
        <p>
          HomeAdvisor Pro works similarly but leans harder into pay-per-lead. Costs vary by
          trade and location but average $50–$70 per roofing lead in Ohio and Midwest markets.
          The platform generates leads through SEO and paid search — meaning the homeowners
          you're reaching were actively searching for help, which sounds good, until you realize
          4 other contractors got the same call.
        </p>
        <p>
          Contractors frequently report that HomeAdvisor leads are lower quality than expected —
          homeowners doing price comparisons, renters who can't authorize work, or invalid contact
          information. Chargeback processes exist but require documentation and aren't guaranteed.
        </p>
        <h2>Where storm data beats both</h2>
        <p>
          NOAA storm data leads are fundamentally different in two ways: exclusivity and intent.
        </p>
        <p>
          When a hail event hits Franklin County, Ohio, every house in the affected area is a
          potential job — whether or not the homeowner knows it yet. You're not competing for
          a submitted form. You're canvassing a neighborhood where you know the damage happened.
          You're the first call, not the fifth.
        </p>
        <p>
          The second advantage is volume. A single storm event can generate hundreds of addressable
          homes in a county. A $300/month subscription to storm lead data gives you access to
          every event across 6 states — Ohio, Indiana, Michigan, Kentucky, Illinois, and
          Pennsylvania — refreshed every week.
        </p>
        <h2>What storm data won't do</h2>
        <p>
          Storm data requires you to do the outreach. Angi and HomeAdvisor deliver inbound
          homeowners who already want a quote. Storm canvassing means door-knocking or
          direct mail in affected neighborhoods. If your team isn't set up for proactive outreach,
          platform leads may still be part of your mix. But for contractors with an outbound
          sales motion, NOAA-sourced leads at $300/month is the most cost-effective source
          in the market.
        </p>
      </>
    ),
  },
  {
    title: "Ohio hail season 2025 — which counties got hit hardest",
    slug: "ohio-hail-season-2025",
    date: "April 14, 2026",
    description:
      "NOAA recorded 117 hail events in Ohio last year. Franklin, Hamilton and Cuyahoga counties saw the most activity.",
    body: (
      <>
        <p>
          Ohio's 2025 hail season was one of the more active on record. NOAA's Storm Events
          Database logged 117 significant hail events across the state between April and September —
          up roughly 15% from the 5-year average. For roofing contractors, that meant a busy
          summer and a pipeline of storm damage claims heading into fall.
        </p>
        <h2>The top counties by event count</h2>
        <p>
          Franklin County (Columbus) led the state with 14 individual hail events recorded in
          2025, including two significant storms in June with hailstones measuring 1.5 to 1.75
          inches. At that size, asphalt shingles sustain measurable damage on impact — granule
          loss, cracked tabs, and compromised underlayment. Insurance carriers accept these claims
          at high rates.
        </p>
        <p>
          Hamilton County (Cincinnati) had 11 events, with the most damaging hitting the
          northern suburbs in late May. Hailstones of 1.25 inches fell across Blue Ash,
          Sharonville, and Fairfield — dense residential areas with aging housing stock from
          the 1970s and 80s. Roofs in that age range are near the end of their warranty period
          and particularly vulnerable to storm damage claims.
        </p>
        <p>
          Cuyahoga County (Cleveland) recorded 9 events, with wind damage supplementing hail
          on several of the storms. Lake Erie's proximity creates unique storm dynamics — cells
          that would dissipate inland often reorganize over the lake and come ashore with
          additional energy. Contractors working the Cleveland market should track both hail
          and wind events.
        </p>
        <h2>Mid-tier counties that outperformed expectations</h2>
        <p>
          Stark County (Canton) and Licking County (Newark) each had 7–8 events in 2025.
          These markets are less competitive than Columbus and Cleveland, meaning contractors
          can canvass more effectively without running into saturated neighborhoods. Conversion
          rates from door-to-door in secondary markets tend to run 10–15% higher than in
          major metros, per feedback from contractors on our platform.
        </p>
        <p>
          Summit County (Akron) and Mahoning County (Youngstown) also saw above-average
          activity, with several events producing 1-inch or larger hail. The I-76 corridor
          between Akron and Youngstown sits in a common storm track that produces hail
          several times per season.
        </p>
        <h2>What 2026 looks like</h2>
        <p>
          NOAA's long-range outlooks suggest Ohio's 2026 hail season will be similar to
          or slightly more active than 2025, driven by warmer Gulf moisture and an active
          jet stream pattern through spring and early summer. Contractors who build their
          outbound lead process now — before the season peaks — will be positioned to
          capture the highest-value jobs when events hit.
        </p>
        <p>
          The contractors who closed the most storm damage work in 2025 weren't reacting
          to storms after the fact. They had a weekly data cadence, a canvass crew on
          standby, and a clear playbook for moving fast when NOAA logged a new event.
          That's the model worth replicating.
        </p>
      </>
    ),
  },
];

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Not Found" };
  return {
    title: `${article.title} | ClearedNo`,
    description: article.description,
  };
}

// ---------------------------------------------------------------------------
// generateStaticParams — only for the 3 roofing articles
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <div className="font-mono text-[#F5F0E8]">
      {/* Breadcrumb */}
      <p className="text-[9px] tracking-[0.3em] text-[#F5F0E8]/25 uppercase mb-8">
        <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">
          Blog
        </Link>
        {" / "}
        <span className="text-[#F5F0E8]/15">Article</span>
      </p>

      {/* Title */}
      <h1 className="font-heading text-4xl sm:text-5xl tracking-widest text-[#F5F0E8] uppercase leading-tight mb-6">
        {article.title}
      </h1>

      {/* Byline */}
      <div className="flex items-center gap-4 mb-12 pb-8 border-b border-[#FF6B00]/15">
        <span className="text-[9px] tracking-[0.3em] text-[#F5F0E8]/30 uppercase">
          {article.date}
        </span>
        <span className="w-px h-3 bg-[#FF6B00]/20" />
        <span className="text-[9px] tracking-[0.3em] text-[#FF6B00]/50 uppercase">ClearedNo</span>
      </div>

      {/* Body */}
      <div className="space-y-6 text-sm text-[#F5F0E8]/70 leading-relaxed [&_h2]:font-heading [&_h2]:text-xl [&_h2]:tracking-widest [&_h2]:text-[#F5F0E8] [&_h2]:uppercase [&_h2]:mt-10 [&_h2]:mb-4">
        {article.body}
      </div>

      {/* CTA */}
      <div className="mt-16 border border-[#FF6B00]/25 p-8">
        <p className="text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase mb-3">
          Ready to start?
        </p>
        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed mb-6">
          Get weekly NOAA-sourced roofing leads across 6 Midwest states — scored by severity,
          updated every Monday.
        </p>
        <Link
          href="/leads/landing"
          className="inline-flex items-center gap-2 bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#F5F0E8] transition-colors"
        >
          Get roofing leads for your area →
        </Link>
      </div>
    </div>
  );
}
