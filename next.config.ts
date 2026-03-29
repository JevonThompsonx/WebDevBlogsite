import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
type RemotePatterns = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>;

function parseAllowedImageHosts(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

const allowedImageHosts = parseAllowedImageHosts(process.env.ALLOWED_IMAGE_HOSTS);
const remoteImagePatterns: RemotePatterns = allowedImageHosts.map((hostname) => ({
  protocol: "https",
  hostname,
}));

if (isDevelopment && remoteImagePatterns.length === 0) {
  remoteImagePatterns.push({
    protocol: "https",
    hostname: "**",
  });
}

const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()",
  },
  ...(isDevelopment
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: remoteImagePatterns,
  },
};

export default nextConfig;
