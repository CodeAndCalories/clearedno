// POST /api/user/digest-preference
// Toggles the weekly digest email opt-out for the authenticated user.
// Body: { digest_opted_out: boolean }
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { digest_opted_out: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.digest_opted_out !== "boolean") {
    return NextResponse.json({ error: "digest_opted_out must be a boolean" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ digest_opted_out: body.digest_opted_out })
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ digest_opted_out: body.digest_opted_out });
}
