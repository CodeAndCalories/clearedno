import type { Metadata } from "next";
import { Bebas_Neue, DM_Mono } from "next/font/google";
import "./globals.css";

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
        "Permit status monitoring for contractors. ClearedNo watches your building permits 24/7 and alerts you the moment your permit clears.",
      "offers": {
        "@type": "Offer",
        "price": "79.00",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "79.00",
          "priceCurrency": "USD",
          "unitText": "month",
        },
      },
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
      "areaServed": [
        { "@type": "City", "name": "Austin", "containedInPlace": { "@type": "State", "name": "Texas" } },
        { "@type": "City", "name": "Dallas", "containedInPlace": { "@type": "State", "name": "Texas" } },
        { "@type": "City", "name": "Houston", "containedInPlace": { "@type": "State", "name": "Texas" } },
        { "@type": "City", "name": "San Antonio", "containedInPlace": { "@type": "State", "name": "Texas" } },
      ],
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
            "text": "Currently Austin, TX and Dallas, TX — plus Houston, TX and San Antonio, TX in early access. We add new cities based on demand. Request yours at clearedno.com/suggest-city.",
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
            "text": "Yes. No contracts, no annual lock-in, no commitments. Cancel from your dashboard in one click.",
          },
        },
        {
          "@type": "Question",
          "name": "How does the free trial work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Your first month is completely free. We collect your card upfront but charge nothing for 30 days. Cancel before day 31 and you pay nothing. Ever. Then $79/mo.",
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
