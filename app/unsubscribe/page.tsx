// Public unsubscribe page — the destination for the "Unsubscribe" link in
// every ClearedNo email. It must work with no login and no JavaScript: an
// unsubscribe that requires signing in is what gets a sender marked as spam.
//
// The confirm button is a plain form POST to /api/unsubscribe. Nothing is
// changed by loading this page, because mail clients and corporate link
// scanners prefetch every URL in an email — a GET that unsubscribed on sight
// would opt people out who never clicked.
//
// Identifiers:
//   ?u=<user_id>  app users (welcome, weekly digest) — a UUID nobody can guess
//   ?email=<addr> cold-outreach recipients, who live in outreach_leads
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribe | ClearedNo",
  // Never index an unsubscribe endpoint.
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{
    u?: string;
    email?: string;
    done?: string;
    error?: string;
  }>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <header className="border-b border-[#FF6B00]/20 px-6 h-14 flex items-center">
        <Link href="/" className="font-heading text-2xl tracking-widest text-[#FF6B00]">
          CLEARED<span className="text-[#F5F0E8]">NO</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full">
          <div className="border border-[#FF6B00]/20 p-10 sm:p-12 relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00] -translate-x-px -translate-y-px" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00] translate-x-px -translate-y-px" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00] -translate-x-px translate-y-px" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00] translate-x-px translate-y-px" />
            {children}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase hover:text-[#F5F0E8]/60 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-px bg-[#FF6B00]" />
      <span className="text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase">{label}</span>
    </div>
  );
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { u, email, done, error } = await searchParams;

  // ── Done ──────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <Shell>
        <Eyebrow label="Unsubscribed" />
        <h1 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] mb-4">
          YOU&apos;RE UNSUBSCRIBED.
        </h1>
        <p className="text-sm text-[#F5F0E8]/50 leading-relaxed mb-6">
          You won&apos;t receive the weekly digest or any other bulk email from ClearedNo again.
          Nothing else about your account changed.
        </p>
        <div className="border border-[#FF6B00]/10 bg-[#FF6B00]/5 px-5 py-4">
          <div className="text-[10px] tracking-widest text-[#FF6B00] uppercase font-medium mb-2">
            One thing to know
          </div>
          <p className="text-xs text-[#F5F0E8]/60 leading-relaxed">
            Alerts for permits you are tracking are part of the service itself, so they keep
            coming. Turn an individual permit off any time from your{" "}
            <Link href="/dashboard" className="text-[#FF6B00] hover:underline">
              dashboard
            </Link>
            .
          </p>
        </div>
      </Shell>
    );
  }

  // ── Something went wrong ──────────────────────────────────────────────────
  if (error) {
    return (
      <Shell>
        <Eyebrow label="Not saved" />
        <h1 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] mb-4">
          THAT DIDN&apos;T GO THROUGH.
        </h1>
        <p className="text-sm text-[#F5F0E8]/50 leading-relaxed mb-6">
          We couldn&apos;t record your request just now. You are still subscribed, so please try
          again, or email us and a person will remove you by hand.
        </p>
        <a
          href="mailto:support@clearedno.com?subject=Unsubscribe"
          className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors"
        >
          Email support@clearedno.com →
        </a>
      </Shell>
    );
  }

  // ── No identifier — someone reached this page without an email link ───────
  if (!u && !email) {
    return (
      <Shell>
        <Eyebrow label="Unsubscribe" />
        <h1 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] mb-4">
          WE NEED THE LINK FROM YOUR EMAIL.
        </h1>
        <p className="text-sm text-[#F5F0E8]/50 leading-relaxed mb-6">
          This page needs to know who to unsubscribe, and that only comes from the
          Unsubscribe link at the bottom of one of our emails. Open any ClearedNo email and
          use the link there, or write to us and we&apos;ll take care of it.
        </p>
        <a
          href="mailto:support@clearedno.com?subject=Unsubscribe"
          className="inline-block bg-[#FF6B00] text-[#0A0A0A] font-mono text-xs font-bold tracking-widest uppercase px-8 py-3 hover:bg-[#F5F0E8] transition-colors"
        >
          Email support@clearedno.com →
        </a>
      </Shell>
    );
  }

  // ── Confirm ───────────────────────────────────────────────────────────────
  return (
    <Shell>
      <Eyebrow label="Unsubscribe" />
      <h1 className="font-heading text-3xl sm:text-4xl tracking-widest text-[#F5F0E8] mb-4">
        STOP THESE EMAILS?
      </h1>
      <p className="text-sm text-[#F5F0E8]/50 leading-relaxed mb-6">
        {email ? (
          <>
            Confirm below and we&apos;ll stop emailing{" "}
            <span className="text-[#F5F0E8]/80 font-mono text-xs break-all">{email}</span>.
          </>
        ) : (
          <>Confirm below and we&apos;ll stop sending the weekly digest and other bulk email.</>
        )}{" "}
        It takes effect immediately.
      </p>

      {/* Plain form POST — works with JavaScript disabled, and means merely
          opening this page (or a scanner prefetching it) changes nothing. */}
      <form method="POST" action="/api/unsubscribe">
        {u ? <input type="hidden" name="u" value={u} /> : null}
        {email ? <input type="hidden" name="email" value={email} /> : null}
        <button
          type="submit"
          className="w-full bg-[#FF6B00] text-[#0A0A0A] font-mono text-sm font-bold tracking-widest uppercase py-4 hover:bg-[#F5F0E8] transition-colors cursor-pointer"
        >
          Confirm Unsubscribe →
        </button>
      </form>

      <p className="mt-4 text-[10px] text-[#F5F0E8]/25 tracking-widest leading-relaxed">
        Alerts for permits you are tracking are part of the service and keep coming. Manage
        those from your{" "}
        <Link href="/dashboard" className="text-[#F5F0E8]/40 hover:text-[#FF6B00]">
          dashboard
        </Link>
        .
      </p>
    </Shell>
  );
}
