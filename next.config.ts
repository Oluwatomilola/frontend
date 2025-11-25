import type { NextConfig } from "next";
import withPWA from "next-pwa";
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
export default withSentryConfig(withPWAConfigured(nextConfig as unknown as NextConfig), {
  silent: true,
});