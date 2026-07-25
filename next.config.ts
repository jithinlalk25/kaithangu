import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * This app handles some of the most sensitive disclosures a person can make, on
 * shared and borrowed phones, so the defaults are tightened: no framing, no
 * MIME sniffing, no referrer leakage to third parties, and no access to camera,
 * microphone or geolocation from any embedded context. The camera and mic the
 * app itself uses are same-origin, which `self` still permits.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(self), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
