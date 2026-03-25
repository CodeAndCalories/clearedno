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
  title: "ClearedNo — Permit Status Alerts for Contractors",
  description:
    "Stop manually checking city portals. ClearedNo monitors your building permits 24/7 and alerts you the second status changes.",
  icons: {
    icon: "/favicon.ico",
    apple: "/clearedno-icon.png",
  },
  openGraph: {
    title: "ClearedNo — Know When Your Permit Clears",
    description:
      "Instant permit status alerts for contractors. $79/mo. Start free trial.",
    type: "website",
    images: [
      {
        url: "/clearedno-icon.png",
        width: 512,
        height: 512,
        alt: "ClearedNo — Permit Status Alerts",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmMono.variable}`}>
      <body className="bg-[#0A0A0A] text-[#F5F0E8] font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
