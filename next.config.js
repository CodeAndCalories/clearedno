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
  },
};
module.exports = nextConfig;
