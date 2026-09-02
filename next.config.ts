import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://aurelijazitke.lt https://www.aurelijazitke.lt"
          },
          { key: "X-Robots-Tag", value: "noindex, nofollow" }
        ]
      },
      {
        source: "/((?!embed).*)",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
