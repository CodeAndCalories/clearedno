import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return new NextResponse("Missing email parameter.", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const { error } = await supabaseAdmin
    .from("outreach_leads")
    .update({ unsubscribed: true })
    .eq("email", email);

  if (error) {
    console.error("[unsubscribe] Error:", error.message);
    return new NextResponse("Something went wrong. Please try again.", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new NextResponse(
    "You've been unsubscribed and will no longer receive emails from ClearedNo.",
    { status: 200, headers: { "Content-Type": "text/plain" } }
  );
}
