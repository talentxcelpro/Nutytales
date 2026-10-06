import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image Optimisation ─────────────────────────────────────────────────────
  images: {
    // Supabase storage CDN + any other trusted image hosts
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Reasonable device sizes for e-commerce product grids
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ── Server-side external packages ──────────────────────────────────────────
  serverExternalPackages: ["@prisma/client", "bcryptjs"],

  // ── Security & SEO HTTP headers ────────────────────────────────────────────
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // ── Redirects ──────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Fallback redirect if accessed via www.nuttytales.com typo
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nuttytales.com" }],
        destination: "https://www.nutytales.com/:path*",
        permanent: true,
      },
    ];
  },

  // ── Compiler options ───────────────────────────────────────────────────────
  compiler: {
    // Remove console.log in production builds (keep warn/error)
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["warn", "error"] } : false,
  },

  // ── Misc ───────────────────────────────────────────────────────────────────
  poweredByHeader: false, // Don't expose Next.js version
  reactStrictMode: true,
};

export default nextConfig;
