// GET /api/stripe/portal
// Server-side redirect to the Stripe Customer Portal.
// Keeping the URL in a server-only env var (no NEXT_PUBLIC_ prefix) means
// it is never embedded in the client bundle or visible in the browser.
// The user must be authenticated — unauthenticated requests get a 401.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  // Verify the user is logged in before redirecting
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portalUrl = process.env.STRIPE_CUSTOMER_PORTAL_URL;

  if (!portalUrl) {
    // Portal URL not configured yet — return a clear server error
    return NextResponse.json(
      { error: "Customer portal URL is not configured." },
      { status: 503 }
    );
  }

  // 303 See Other — correct status for a POST-to-GET style redirect
  return NextResponse.redirect(portalUrl, { status: 303 });
}
