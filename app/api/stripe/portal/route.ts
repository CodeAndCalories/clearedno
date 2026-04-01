export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const portalUrl = process.env.STRIPE_CUSTOMER_PORTAL_URL
    if (!portalUrl) {
      return NextResponse.json({ error: 'Portal not configured' }, { status: 503 })
    }

    return NextResponse.redirect(portalUrl)
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Requires STRIPE_CUSTOMER_PORTAL_URL in Vercel env vars
// Value: https://billing.stripe.com/p/login/cNibJ11c15crcYPdCA5wI00
