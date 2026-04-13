// Next.js middleware — refreshes Supabase auth sessions and protects routes
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require a valid session → redirect to /login
const PROTECTED_PREFIXES = ["/dashboard"];

// Routes that require a valid session → redirect to /leads/landing
const LEADS_PREFIX = "/leads";
// Public paths that must NOT be protected (avoids infinite redirect loop)
const LEADS_PUBLIC_PREFIX = "/leads/landing";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — MUST be called before any redirects
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Dashboard routes → /login
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Leads routes → /leads/landing (public landing stays accessible)
  const isLeadsProtected =
    pathname.startsWith(LEADS_PREFIX) &&
    !pathname.startsWith(LEADS_PUBLIC_PREFIX);

  if (isLeadsProtected) {
    // Step 1: must be logged in
    if (!user) {
      const landingUrl = request.nextUrl.clone();
      landingUrl.pathname = "/leads/landing";
      landingUrl.searchParams.delete("next");
      return NextResponse.redirect(landingUrl);
    }

    // Step 2: must have an active leads subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("leads_subscription_status")
      .eq("user_id", user.id)
      .single();

    if (profile?.leads_subscription_status !== "active") {
      const landingUrl = request.nextUrl.clone();
      landingUrl.pathname = "/leads/landing";
      landingUrl.searchParams.delete("next");
      return NextResponse.redirect(landingUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Skip static assets and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
