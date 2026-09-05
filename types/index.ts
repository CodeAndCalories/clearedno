// Central type definitions for ClearedNo
// Keep these in sync with schema.sql

// UNDER_REVIEW:    with the city — a reviewer or inspector is working; wait
// ACTION_REQUIRED: with the APPLICANT — the city is waiting on corrections,
//                  missing information, a revised submittal or a payment.
//                  Not terminal: the permit keeps being checked. This is the
//                  status where a contractor who doesn't know loses days.
// EXPIRED:         permit lapsed without action
//
// Adding a value here requires a migration widening permits_status_check
// (see migrations/020) — the DB rejects unknown statuses with 23514.
export type PermitStatus =
  | "PENDING"
  | "APPROVED"
  | "CLEARED"
  | "UNDER_REVIEW"
  | "ACTION_REQUIRED"
  | "REJECTED"
  | "EXPIRED"
  | "UNKNOWN";

// "free" is added by migration 016: signed up, not paying, using the free
// allowance. Distinct from "trialing", which means a live Stripe trial and
// grants unlimited tracking.
export type SubscriptionStatus =
  | "free"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  subscription_status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  trial_ends_at: string | null;
  referral_code: string | null;
  referred_by_code: string | null;
  digest_opted_out: boolean;
  created_at: string;
}

export interface StatusHistoryEntry {
  status: PermitStatus;
  timestamp: string; // ISO 8601
  raw?: string;      // Verbatim text captured from the city portal
}

export interface Permit {
  id: string;
  user_id: string;
  permit_number: string;
  address: string;
  city: string;
  state: string;
  status: PermitStatus;
  last_checked: string | null;
  status_history: StatusHistoryEntry[];
  scrape_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  permit_id: string;
  type: string;
  new_status: PermitStatus | null;
  sent_at: string;
}

// Shape returned by every city scraper
export interface ScrapeResult {
  permit_number: string;
  status: PermitStatus;
  raw_text: string;   // Verbatim text from portal — stored in status_history
  scrape_url: string; // The exact URL that was scraped (for audit)
}
