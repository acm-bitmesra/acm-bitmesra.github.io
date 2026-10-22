import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=(), payment=(), usb=(), midi=(), display-capture=(), sync-xhr=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://bitmesra.ac.in https://github-readme-stats.vercel.app https://github-profile-summary-cards.vercel.app https://github-stats-extended.vercel.app https://skillicons.dev https://leetcard.jacoblin.cool",
      "font-src 'self' data:",
      "connect-src 'self' https://accounts.google.com https://*.neon.tech https://api.github.com",
      "frame-src 'self' https://accounts.google.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://github.com https://accounts.google.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const privateAntiCacheHeaders = [
  {
    key: "Cache-Control",
    value: "private, no-cache, no-store, max-age=0, must-revalidate, proxy-revalidate",
  },
  {
    key: "Pragma",
    value: "no-cache",
  },
  {
    key: "Surrogate-Control",
    value: "no-store",
  },
  {
    key: "CDN-Cache-Control",
    value: "no-store",
  },
  {
    key: "Cloudflare-CDN-Cache-Control",
    value: "no-store",
  },
];

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: privateAntiCacheHeaders,
      },
      {
        source: "/api/admin/:path*",
        headers: privateAntiCacheHeaders,
      },
      {
        source: "/dashboard/:path*",
        headers: privateAntiCacheHeaders,
      },
      {
        source: "/api/profile/:path*",
        headers: privateAntiCacheHeaders,
      },
      {
        source: "/api/integrations/:path*",
        headers: privateAntiCacheHeaders,
      },
      {
        source: "/api/events/:path*/register",
        headers: privateAntiCacheHeaders,
      },
      {
        source: "/api/events/:path*/status",
        headers: privateAntiCacheHeaders,
      },
      {
        source: "/api/auth/:path*",
        headers: privateAntiCacheHeaders,
      },
    ];
  },
};

export default nextConfig;
