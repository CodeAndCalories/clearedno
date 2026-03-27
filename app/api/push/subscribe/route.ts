// POST /api/push/subscribe
//
// Saves a browser PushSubscription to the user's profile in Supabase.
// Called from the dashboard when the user enables push notifications.
//
// Body: { subscription: PushSubscriptionJSON }
//   subscription.endpoint — the push endpoint URL
//   subscription.keys.p256dh — the public key
//   subscription.keys.auth — the auth secret
//
// DELETE /api/push/subscribe
// Removes the push subscription from the user's profile.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let subscription: Record<string, unknown>;
  try {
    const body = await req.json();
    subscription = body.subscription;
    if (!subscription?.endpoint) {
      throw new Error("Missing subscription.endpoint");
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid request body" },
      { status: 400 }
    );
  }

  // Save the subscription JSON to the user's profile.
  // The push_subscription column is JSONB — Supabase stores it as-is.
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ push_subscription: subscription })
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(): Promise<NextResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ push_subscription: null })
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
