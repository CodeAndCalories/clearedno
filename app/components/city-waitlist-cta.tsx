// Waitlist CTA for cities we do NOT track yet.
//
// High-traffic guide pages (Houston, Dallas, San Antonio) used to close with a
// "we track this automatically" pitch for cities that have no working checker.
// This component replaces that claim with an honest launch-notification signup
// backed by the existing /api/permit-alert capture, so the traffic still
// converts into a lead without promising a product we can't deliver.

import PermitAlertSignup from "@/app/permit-alert-signup";

export function CityWaitlistCTA({
  cityName,
  citySlug,
}: {
  /** Display name, e.g. "Houston" or "San Antonio". */
  cityName: string;
  /** Slug stored against the lead, e.g. "houston". */
  citySlug: string;
}) {
  return (
    <PermitAlertSignup
      city={citySlug}
      eyebrow="Coming Soon"
      headline={`Automated tracking isn't available in ${cityName} yet`}
      subtext={`Get notified when it launches. We'll email you the day ${cityName} permit monitoring goes live — nothing else.`}
      success={`You're on the ${cityName} waitlist. We'll email you the day it launches.`}
      buttonLabel="Join Waitlist"
    />
  );
}
