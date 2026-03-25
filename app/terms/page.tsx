// Terms of Service — ClearedNo
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

export default function TermsPage() {
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
            TERMS OF SERVICE
          </h1>
          <p className="text-xs text-[#F5F0E8]/30 font-mono tracking-widest">
            Effective date: {EFFECTIVE_DATE}
          </p>
        </div>

        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of ClearedNo
          (&quot;Service&quot;), operated by ClearedNo (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By creating an
          account or using the Service you agree to be bound by these Terms. If you do
          not agree, do not use the Service.
        </p>

        <Section title="1. SERVICE DESCRIPTION">
          <P>
            ClearedNo is a SaaS platform that monitors building permit statuses on behalf
            of contractors and construction professionals. You provide permit numbers and
            property addresses; we check the relevant city portal on a recurring schedule
            and send you an email alert when the status changes.
          </P>
          <P>
            The Service is a monitoring and notification tool only. We do not interact
            with city officials, submit permit applications, or guarantee any particular
            outcome for any permit.
          </P>
        </Section>

        <Section title="2. ACCOUNT REGISTRATION">
          <P>
            You must provide accurate information when creating your account. You are
            responsible for keeping your login credentials secure. You may not share your
            account with others or use the Service on behalf of someone who has not agreed
            to these Terms.
          </P>
          <P>
            You must be at least 18 years old and legally authorised to enter into these
            Terms to use the Service.
          </P>
        </Section>

        <Section title="3. FREE TRIAL">
          <UL items={[
            "New accounts receive a 14-day free trial with full access to the Service.",
            "No credit card is required to start the trial.",
            "If you do not add a payment method before the trial ends, your permit monitoring will pause.",
            "You will not be charged anything if you cancel before the trial period ends.",
            "Each person or company is entitled to one free trial. Creating multiple accounts to obtain additional trials is not permitted.",
          ]} />
        </Section>

        <Section title="4. SUBSCRIPTION AND PAYMENT">
          <UL items={[
            "After the free trial, the Service is billed at $79 per month per company account.",
            "Billing is processed on a monthly cycle starting from the date your paid subscription begins.",
            "Payments are processed by Stripe. By subscribing you agree to Stripe's terms of service.",
            "Your subscription renews automatically each month unless you cancel.",
            "We may change pricing with at least 30 days' written notice to active subscribers. Continued use after the effective date constitutes acceptance of the new price.",
          ]} />
        </Section>

        <Section title="5. CANCELLATION">
          <UL items={[
            "You may cancel your subscription at any time from the account dashboard or by emailing support@clearedno.com.",
            "Cancellation takes effect at the end of your current billing period. You retain access until that date.",
            "We do not offer partial-month refunds. See our Refund Policy at clearedno.com/refunds for full details.",
            "After cancellation your permit data is retained for 90 days in case you reactivate, then permanently deleted.",
          ]} />
        </Section>

        <Section title="6. THIRD-PARTY PORTAL DEPENDENCY">
          <P>
            The Service depends on publicly accessible city permit portals maintained by
            local governments. We have no affiliation with, control over, or advance
            notice of changes to those portals.
          </P>
          <P>
            We make no guarantee that:
          </P>
          <UL items={[
            "Any particular city portal will remain accessible or structurally unchanged.",
            "Status information obtained from city portals is accurate, complete, or up to date.",
            "The Service will detect every status change on every permit at all times.",
            "Alerts will be delivered within any specific time window.",
          ]} />
          <P>
            If a city portal undergoes changes that temporarily prevent monitoring, we will
            work to restore coverage as quickly as possible and will notify affected users
            by email.
          </P>
        </Section>

        <Section title="7. ACCEPTABLE USE">
          <P>You agree not to:</P>
          <UL items={[
            "Use the Service for any unlawful purpose.",
            "Attempt to reverse-engineer, scrape, or copy the Service's software or data.",
            "Submit false or misleading permit information.",
            "Interfere with or disrupt the Service or its infrastructure.",
            "Use automated means to create accounts or extract data beyond your own permit data.",
            "Resell or sublicence access to the Service without written permission.",
          ]} />
        </Section>

        <Section title="8. REFUND POLICY">
          <P>
            ClearedNo does not offer partial-month refunds. Subscriptions may be cancelled
            at any time; you will not be billed for the next cycle. Trials cancelled before
            expiry incur no charge. For the full refund policy see{" "}
            <Link href="/refunds" className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors">
              clearedno.com/refunds
            </Link>
            .
          </P>
        </Section>

        <Section title="9. INTELLECTUAL PROPERTY">
          <P>
            All software, design, copy, and branding in the Service is owned by ClearedNo
            and protected by copyright. You retain ownership of the permit data you submit.
            By using the Service you grant us a limited licence to use that data to provide
            the monitoring and alerting service.
          </P>
        </Section>

        <Section title="10. DISCLAIMER OF WARRANTIES">
          <P>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
            IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE,
            OR THAT ANY PARTICULAR PERMIT STATUS WILL BE DETECTED OR DELIVERED WITHIN ANY
            SPECIFIC TIME FRAME.
          </P>
        </Section>

        <Section title="11. LIMITATION OF LIABILITY">
          <P>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLEAREDNO SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE
            OF THE SERVICE, INCLUDING LOST PROFITS OR MISSED CONSTRUCTION SCHEDULES, EVEN
            IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </P>
          <P>
            OUR TOTAL LIABILITY FOR ANY CLAIM RELATED TO THE SERVICE SHALL NOT EXCEED THE
            AMOUNT YOU PAID TO US IN THE THREE MONTHS PRECEDING THE CLAIM.
          </P>
        </Section>

        <Section title="12. GOVERNING LAW">
          <P>
            These Terms are governed by the laws of the State of Texas, United States,
            without regard to conflict-of-law principles. Any disputes shall be resolved
            in the courts located in Travis County, Texas.
          </P>
        </Section>

        <Section title="13. CHANGES TO THESE TERMS">
          <P>
            We may update these Terms from time to time. We will notify active subscribers
            by email at least 14 days before material changes take effect. Continued use
            of the Service after the effective date constitutes acceptance of the updated
            Terms.
          </P>
        </Section>

        <Section title="14. CONTACT">
          <P>
            Questions about these Terms?
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
          <Link href="/"         className="hover:text-[#FF6B00] transition-colors">Home</Link>
          <Link href="/privacy"  className="hover:text-[#FF6B00] transition-colors">Privacy</Link>
          <Link href="/refunds"  className="hover:text-[#FF6B00] transition-colors">Refunds</Link>
          <a href="mailto:support@clearedno.com" className="hover:text-[#FF6B00] transition-colors">
            support@clearedno.com
          </a>
        </div>
      </footer>
    </div>
  );
}
