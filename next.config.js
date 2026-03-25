/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep heavy server-only packages out of the webpack bundle.
  // Next.js 14 uses experimental.serverComponentsExternalPackages
  experimental: {
    serverComponentsExternalPackages: [
      "@anthropic-ai/sdk",
      "@react-email/components",
      "react-email",
      "playwright",
    ],
    // Keep scraper and outreach scripts out of the deployment bundle.
    // These run as standalone Node processes via PM2, not inside Next.js.
    outputFileTracingExcludes: {
      "*": ["./scrapers/**", "./outreach/**"],
    },
  },
};
module.exports = nextConfig;
