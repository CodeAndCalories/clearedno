// GET /auth/confirm
// Handles the magic-link / email confirmation token that Supabase sends.
// Supabase redirects users here after they click the confirmation link in
// their email. We exchange the token for a session, then redirect to the
// dashboard (or wherever NEXT_PUBLIC_URL points — never localhost in prod).
//
// Supabase dashboard config required:
//   Authentication → URL Configuration
//     Site URL:      https://www.clearedno.com
//     Redirect URLs: https://www.clearedno.com/**
//
// The email template's {{ .ConfirmationURL }} will then resolve to
// https://www.clearedno.com/auth/confirm?token_hash=...&type=signup

import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token_hash = searchParams.get("token_hash");
  const type       = searchParams.get("type") as "signup" | "recovery" | "email" | null;
  const next       = searchParams.get("next") ?? "/dashboard";

  // Base URL from env — never falls back to localhost
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "https://www.clearedno.com";

  if (!token_hash || !type) {
    return NextResponse.redirect(`${baseUrl}/login?error=missing_token`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — middleware will handle session refresh
          }
        },
      },
    }
  );

  const { error } = await supabase.auth.verifyOtp({ token_hash, type });

  if (error) {
    console.error("[auth/confirm] OTP verification failed:", error.message);
    return NextResponse.redirect(`${baseUrl}/login?error=invalid_token`);
  }

  // Successful confirmation → send to dashboard (or custom next param)
  const redirectTo = next.startsWith("/")
    ? `${baseUrl}${next}`
    : `${baseUrl}/dashboard`;

  return NextResponse.redirect(redirectTo);
}
