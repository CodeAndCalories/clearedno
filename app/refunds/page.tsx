// Refund Policy — ClearedNo
import Link from "next/link";

const EFFECTIVE_DATE = "August 26, 2026";

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

export default function RefundsPage() {
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
            REFUND POLICY
          </h1>
          <p className="text-xs text-[#F5F0E8]/30 font-mono tracking-widest">
            Effective date: {EFFECTIVE_DATE}
          </p>
          <p className="text-xs text-[#F5F0E8]/40 mt-3 leading-relaxed max-w-2xl">
            Updated {EFFECTIVE_DATE}: added the free tier and one-time permit slots, and
            clarified that the 30-day free trial belongs to the Unlimited plan and begins
            at upgrade rather than at signup. These changes only add to what an account
            receives — no existing entitlement was reduced.
          </p>
        </div>

        <p className="text-sm text-[#F5F0E8]/60 leading-relaxed">
          ClearedNo is committed to being straightforward about money. Here&apos;s exactly
          how billing and refunds work — no fine print.
        </p>

        {/* Summary box */}
        <div className="mt-8 border border-[#FF6B00]/30 bg-[#FF6B00]/5 p-6 space-y-3">
          <div className="font-heading text-lg tracking-widest text-[#FF6B00]">THE SHORT VERSION</div>
          {[
            "The free tier is free forever — one permit, no card, nothing to bill or refund.",
            "Permit slots are one-time $29 purchases — refundable within 14 days, no questions asked.",
            "Unlimited is $79/mo with a 30-day free trial that starts at upgrade — no charge if you cancel before it ends.",
            "Cancel anytime — you keep access to the end of the billing period, then return to the free tier.",
            "No partial-month refunds after a billing cycle has started.",
            "Billing disputes? Email support@clearedno.com — we'll make it right.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-[#F5F0E8]/70">
              <span className="text-[#FF6B00] mt-0.5 flex-shrink-0 text-xs">■</span>
              {item}
            </div>
          ))}
        </div>

        <Section title="FREE TIER">
          <P>
            Creating a ClearedNo account costs nothing and requires no card. You get one
            tracked permit, checked on the same schedule as every paid permit, with no
            time limit and no countdown. Signing up does not start a trial and does not
            create a charge, so there is nothing on the free tier to refund.
          </P>
          <P>
            The free tier does not expire. If you never upgrade, nothing happens — your
            permit keeps being monitored and you are never billed.
          </P>
        </Section>

        <Section title="FREE TRIAL (UNLIMITED PLAN)">
          <P>
            The Unlimited plan is $79 per month and includes a 30-day free trial. The
            trial begins when you start the upgrade checkout — not when you create your
            account. A card is required at that point and is not charged for 30 days.
          </P>
          <P>
            If you cancel at any point during the trial you will not be charged.
            Ever. No questions asked.
          </P>
          <P>
            If the trial ends and you have not added a working payment method, your
            account returns to the free tier. Nothing is deleted: your account stays
            open, your permit history is kept, and the permits you were already
            tracking continue to be monitored.
          </P>
        </Section>

        <Section title="PERMIT SLOTS">
          <P>
            A permit slot is a one-time <strong className="text-[#F5F0E8]/80">$29</strong>{" "}
            purchase that adds one permanently tracked permit to your account. It is not
            a subscription: it never renews, never expires, and is never billed again.
          </P>
          <P>
            Because a slot does not recur, there is nothing to cancel. Cancelling an
            Unlimited subscription does not affect slots you have bought — you keep them
            on the free tier.
          </P>
          <P>
            <strong className="text-[#F5F0E8]/80">14-day refund, no questions asked:</strong>{" "}
            email support@clearedno.com within 14 days of buying a slot and we will refund
            it in full. You do not need to give a reason. The refunded slot is removed
            from your account when the refund is processed.
          </P>
          <P>
            After 14 days a slot purchase is final. A slot is delivered the moment you
            buy it and is yours permanently, so there is no unused portion to return.
          </P>
          <P>
            This deadline does not affect billing errors. If you were double-charged, or
            charged for a slot that never appeared on your account, contact us whenever
            you notice it and we will put it right — see Exceptions and Disputes below.
          </P>
        </Section>

        <Section title="MONTHLY SUBSCRIPTIONS">
          <P>
            After the trial, ClearedNo charges <strong className="text-[#F5F0E8]/80">$79 per month</strong> for the
            Unlimited plan. Billing renews automatically on the same date each month.
          </P>
          <P>
            <strong className="text-[#F5F0E8]/80">Cancel anytime:</strong> You can cancel from the dashboard at any
            time. Cancellation takes effect at the end of your current billing period.
            You will not be billed for the next month, and your account then returns to
            the free tier rather than closing.
          </P>
          <P>
            <strong className="text-[#F5F0E8]/80">No partial refunds:</strong> We do not issue refunds for partial
            months. If you cancel on day 5 of a billing cycle, you retain unlimited
            tracking for the remaining 25 days and are not charged again — but we do not
            refund the current month&apos;s charge.
          </P>
        </Section>

        <Section title="EXCEPTIONS AND DISPUTES">
          <P>
            We recognise that unusual situations happen. If you believe you were charged
            in error — for example, after cancelling, or for a period when the service
            was completely unavailable — please contact us:
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
          <P>
            Include your account email and a brief description of the issue. We aim to
            respond within one business day and will resolve genuine errors promptly.
          </P>
        </Section>

        <Section title="CHARGEBACKS">
          <P>
            Please contact us before initiating a chargeback with your bank. Chargebacks
            create significant overhead and may result in your account being permanently
            suspended. We are committed to resolving billing issues directly and will
            always work with you first.
          </P>
        </Section>

        <Section title="CONTACT">
          <P>
            Any billing question not covered here? Email us at{" "}
            <a
              href="mailto:support@clearedno.com"
              className="text-[#FF6B00] hover:text-[#F5F0E8] transition-colors"
            >
              support@clearedno.com
            </a>{" "}
            and we&apos;ll get back to you within one business day.
          </P>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#FF6B00]/20 px-6 py-6 mt-10">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] tracking-widest text-[#F5F0E8]/25 uppercase">
          <Link href="/"        className="hover:text-[#FF6B00] transition-colors">Home</Link>
          <Link href="/privacy" className="hover:text-[#FF6B00] transition-colors">Privacy</Link>
          <Link href="/terms"   className="hover:text-[#FF6B00] transition-colors">Terms</Link>
          <a href="mailto:support@clearedno.com" className="hover:text-[#FF6B00] transition-colors">
            support@clearedno.com
          </a>
        </div>
      </footer>
    </div>
  );
}
