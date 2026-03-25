// Privacy Policy — ClearedNo
import Link from "next/link";

const EFFECTIVE_DATE = "March 25, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[#FF6B00]/15 pt-8 mt-8">
      <h2 className="font-heading text-2xl tracking-widest text-[#FF6B00] mb-4">{title}</h2>
      <div className="space-y-3 text-sm text-[#F5F0E8]/65 leading-relaxed">{children}</div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function UL({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mt-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="text-[#FF6B00] mt-0.5 flex-shrink-0 text-xs">■</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top bar */}
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>
        <Link
          href="/"
          className="text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase hover:text-[#FF6B00] transition-colors"
        >
          ← Back to Home
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">Legal</span>
          </div>
          <h1 className="font-heading text-5xl tracking-widest text-[#F5F0E8] mb-3">
            PRIVACY POLICY
          </h1>
          <p className="text-xs text-[#F5F0E8]/30 font-mono tracking-widest">
            Effective date: {EFFECTIVE_DATE}
          </p>
        </div>

        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">
          ClearedNo (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the ClearedNo permit monitoring
          service. This Privacy Policy explains what information we collect, how we use it,
          and your rights regarding that data. By using ClearedNo you agree to the
          practices described here.
        </p>

        <Section title="1. INFORMATION WE COLLECT">
          <P>We collect only the information necessary to provide the permit monitoring service:</P>
          <UL items={[
            "Email address — used to create your account and send permit status alerts.",
            "Full name and company name — used to personalise your account and communications.",
            "Phone number — optional; collected on the profile page but never required.",
            "Permit numbers and property addresses — the core data you enter so we can monitor your permits.",
            "City and state — required to route your permits to the correct city monitoring scraper.",
            "Billing information — processed directly by Stripe. We never see or store your full card number.",
            "Usage data — standard server logs (IP address, browser type, pages visited) used for security and debugging only.",
          ]} />
        </Section>

        <Section title="2. HOW WE USE YOUR INFORMATION">
          <P>We use the data we collect exclusively to operate and improve the service:</P>
          <UL items={[
            "Monitoring permit numbers against official city portals on your behalf.",
            "Sending you email alerts when a permit status changes.",
            "Authenticating your account and keeping it secure.",
            "Processing your subscription payment through Stripe.",
            "Responding to support requests you send to us.",
            "Improving scraper accuracy and adding support for new cities.",
          ]} />
          <P>
            We do not sell your data. We do not use your data for advertising. We do not
            share permit numbers or property addresses with any third party except as
            required to deliver the service (see Section 3).
          </P>
        </Section>

        <Section title="3. THIRD-PARTY SERVICES">
          <P>
            ClearedNo uses a small number of third-party providers. Each has its own
            privacy policy governing how it handles data.
          </P>
          <UL items={[
            "Supabase (supabase.com) — our database and authentication provider. Your account data, permit records, and alert history are stored in Supabase's infrastructure.",
            "Stripe (stripe.com) — payment processing. Stripe handles all credit card data. We store only your Stripe customer ID and subscription status.",
            "Resend (resend.com) — transactional email delivery. Permit alert emails and account emails are sent via Resend. Your email address is passed to Resend to deliver messages.",
          ]} />
          <P>
            We have data processing agreements in place with each provider and have
            selected providers with strong security and privacy practices.
          </P>
        </Section>

        <Section title="4. COOKIES AND TRACKING">
          <P>
            ClearedNo uses session cookies set by Supabase to keep you logged in. These
            are functional cookies — no advertising or tracking cookies are used.
            We do not use Google Analytics, Meta Pixel, or any third-party analytics
            platform.
          </P>
        </Section>

        <Section title="5. DATA RETENTION">
          <UL items={[
            "Active accounts: we retain your data for as long as your account is active.",
            "Cancelled accounts: permit records and alert history are deleted within 90 days of account cancellation.",
            "Email logs: Resend retains delivery logs for 30 days per their standard policy.",
            "Billing records: Stripe retains transaction records as required by financial regulations (typically 7 years).",
          ]} />
        </Section>

        <Section title="6. YOUR RIGHTS">
          <P>You have the right to:</P>
          <UL items={[
            "Access the personal data we hold about you — email support@clearedno.com to request an export.",
            "Correct inaccurate data — update your name, company, and phone from the dashboard at any time.",
            "Delete your account and all associated data — email support@clearedno.com with the subject \"Delete My Account\".",
            "Withdraw consent and cancel your subscription — cancel from the dashboard at any time; no questions asked.",
          ]} />
          <P>
            Residents of California (CCPA), the EU/UK (GDPR), and other jurisdictions with
            specific data rights may contact us at support@clearedno.com to exercise those
            rights. We will respond within 30 days.
          </P>
        </Section>

        <Section title="7. DATA SECURITY">
          <P>
            We take reasonable technical and organisational measures to protect your data,
            including encryption in transit (TLS), row-level security policies on the
            database, and limited internal access to production systems. No system is
            perfectly secure — if you believe your account has been compromised, contact
            us immediately at support@clearedno.com.
          </P>
        </Section>

        <Section title="8. CHILDREN">
          <P>
            ClearedNo is a professional service intended for contractors and businesses.
            We do not knowingly collect data from anyone under 18. If you believe a minor
            has submitted data to us, please contact support@clearedno.com.
          </P>
        </Section>

        <Section title="9. CHANGES TO THIS POLICY">
          <P>
            We may update this Privacy Policy from time to time. We will notify active
            subscribers by email at least 14 days before material changes take effect.
            Continued use of the service after changes constitutes acceptance.
          </P>
        </Section>

        <Section title="10. CONTACT">
          <P>
            Questions about this Privacy Policy or your data?
          </P>
          <P>
            Email:{" "}
            <a
              href="mailto:support@clearedno.com"
              className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors"
            >
              support@clearedno.com
            </a>
          </P>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#FF6B00]/20 px-6 py-6 mt-10">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] tracking-widest text-[#F5F0E8]/25 uppercase">
          <Link href="/"        className="hover:text-[#FF6B00] transition-colors">Home</Link>
          <Link href="/terms"   className="hover:text-[#FF6B00] transition-colors">Terms</Link>
          <Link href="/refunds" className="hover:text-[#FF6B00] transition-colors">Refunds</Link>
          <a href="mailto:support@clearedno.com" className="hover:text-[#FF6B00] transition-colors">
            support@clearedno.com
          </a>
        </div>
      </footer>
    </div>
  );
}
