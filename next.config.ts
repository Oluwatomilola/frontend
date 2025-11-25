import type { NextConfig } from "next";
// @ts-ignore - next-pwa types are not fully compatible with Next.js 16
import withPWA from "next-pwa";
// @ts-ignore - sentry types might have conflicts
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.walletconnect.com",
      },
      {
        protocol: "https",
        hostname: "**.walletconnect.org",
      },
      {
        protocol: "https",
        hostname: "**.reown.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.infura-ipfs.io",
      },
      {
        protocol: "https",
        hostname: "**.ipfs.io",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  compress: true,
};

const withPWAConfigured = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

// Type assertion for the final export
export default withSentryConfig(withPWAConfigured({
  ...nextConfig,
  // Add any specific overrides needed for PWA
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
} as NextConfig), {
  silent: true,
});