import type { Metadata } from "next";
import { Bebas_Neue, DM_Mono } from "next/font/google";
import "./globals.css";
import { liveCheckerCities, liveCityList } from "@/lib/cities";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? "https://www.clearedno.com"),
  title: "ClearedNo — Permit Status Monitoring for Contractors",
  description:
    "Stop manually checking city portals. ClearedNo monitors your building permits 24/7 and alerts you the moment your permit clears.",
  keywords: [
    "building permit tracking",
    "contractor permit alerts",
    "permit status monitoring",
    "Austin TX permits",
    "building permit notification",
    "permit cleared alert",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/clearedno-icon.png",
  },
  openGraph: {
    title: "ClearedNo — Permit Status Monitoring for Contractors",
    description:
      "Stop manually checking city portals. ClearedNo monitors your building permits 24/7 and alerts you the moment your permit clears.",
    type: "website",
    siteName: "ClearedNo",
    images: [
      {
        url: "/clearedno-icon.png",
        width: 512,
        height: 512,
        alt: "ClearedNo — Permit Status Monitoring",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ClearedNo — Permit Status Monitoring for Contractors",
    description:
      "Stop manually checking city portals. ClearedNo monitors your building permits 24/7 and alerts you the moment your permit clears.",
    images: ["/clearedno-icon.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.clearedno.com/#app",
      "name": "ClearedNo",
      "url": "https://www.clearedno.com",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description":
        "Permit status monitoring for contractors. ClearedNo watches your building permits 24/7 and alerts you the moment your permit clears. Start free with one tracked permit — no card required.",
      // Three tiers, not one. A lone $79 Offer told Google the product had a
      // price of admission it no longer has: signup is free and takes no card,
      // and extra permits can be bought outright instead of subscribed to.
      "offers": [
        {
          "@type": "Offer",
          "name": "Free",
          "price": "0",
          "priceCurrency": "USD",
          "description":
            "One tracked permit, checked every 2 hours. No card required, no time limit.",
        },
        {
          "@type": "Offer",
          "name": "Permit Slot",
          "price": "29.00",
          "priceCurrency": "USD",
          "description":
            "One additional tracked permit. One-time purchase, kept permanently, never renews.",
        },
        {
          "@type": "Offer",
          "name": "Unlimited",
          "price": "79.00",
          "priceCurrency": "USD",
          "description":
            "Unlimited tracked permits. First 30 days free when you upgrade.",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "79.00",
            "priceCurrency": "USD",
            "unitText": "month",
          },
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://www.clearedno.com/#org",
      "name": "ClearedNo",
      "url": "https://www.clearedno.com",
      "logo": "https://www.clearedno.com/clearedno-icon.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@clearedno.com",
        "contactType": "customer support",
      },
      // Derived from LIVE_CHECKER_CITIES — structured data is a public claim
      // about where the service works, so it tracks the same source as the copy.
      "areaServed": liveCheckerCities.map((c) => ({
        "@type": "City",
        "name": c.name,
        "containedInPlace": { "@type": "State", "name": c.state },
      })),
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.clearedno.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What cities do you support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Automated tracking is live in ${liveCityList({ separator: ", ", conjunction: "and" })}. Other cities aren't tracked yet — request yours at clearedno.com/suggest-city and we'll email you when it launches.`,
          },
        },
        {
          "@type": "Question",
          "name": "How often do you check my permit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Every 2 hours, 24/7. You'll know within hours of any status change — usually the same morning the city processes it.",
          },
        },
        {
          "@type": "Question",
          "name": "Is my data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. We only store your permit numbers and email address. No payment info is stored on our servers — billing is handled entirely by Stripe.",
          },
        },
        {
          "@type": "Question",
          "name": "What if my city isn't supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Submit a request at clearedno.com/suggest-city and we'll prioritize based on demand. New cities are added weekly.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I cancel anytime?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. No contracts, no annual lock-in, no commitments. Cancel from your dashboard in one click. You drop back to the free tier — one tracked permit, plus any slots you bought outright, which you keep. Nothing is deleted.",
          },
        },
        {
          "@type": "Question",
          "name": "How much does ClearedNo cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "One tracked permit is free forever and needs no card. Extra permits are $29 each — a one-time purchase that never renews. Unlimited tracking is $79/month, with the first 30 days free.",
          },
        },
        {
          "@type": "Question",
          "name": "Do I need a card to sign up?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Signing up is free and takes no card at all — you get one tracked permit with no time limit. A card is only needed if you upgrade to unlimited at $79/month, and even then the first 30 days are free.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmMono.variable}`}>
      <body className="bg-[#0A0A0A] text-[#F5F0E8] font-mono antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
