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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    // Reasonable device sizes for e-commerce product grids
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  compress: true,

  experimental: {
    optimizePackageImports: [
      "@/lib/products-data",
      "@/lib/constants",
      "clsx",
      "tailwind-merge",
    ],
  },

  // ── Server-side external packages ──────────────────────────────────────────
  serverExternalPackages: ["@prisma/client", "bcryptjs"],

  // ── Security & SEO HTTP headers ────────────────────────────────────────────
  async headers() {
    return [
      {
        // Static images long-term caching
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Brand icons & favicon caching
        source: "/:file(favicon\\.ico|favicon\\.png|apple-touch-icon\\.png|logo\\.jpg|icon\\.png|apple-icon\\.png)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // IndexNow and crawler verification key CDN edge caching
        source: "/479c5a2c20774a35b128562761895a28.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
        ],
      },
      {
        // Static sitemap index — served as pure static file, bypasses WAF/middleware
        source: "/sitemap_index.xml",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400" },
          { key: "Content-Type", value: "application/xml; charset=utf-8" },
        ],
      },
      {
        // Programmatic sitemap shards — Cloudflare CDN 7-day edge cache
        source: "/sitemaps/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
          { key: "Content-Type", value: "application/xml; charset=utf-8" },
        ],
      },
      {
        // Programmatic wholesale & pincode pages — Cloudflare CDN 30-day edge cache
        source: "/wholesale-dry-fruits/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=2592000, stale-while-revalidate=86400" },
        ],
      },
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
      {
        source: "/journal",
        destination: "/gastronomy-journal",
        permanent: true,
      },
      {
        source: "/gastronomy",
        destination: "/gastronomy-journal",
        permanent: true,
      },
      {
        source: "/shop/afghani-anjeer-dried-figs",
        destination: "/shop/afghan-anjeer-wild-figs",
        permanent: true,
      },
    ];
  },

  // ── SEO Rewrites & Aliases ──────────────────────────────────────────────────
  async rewrites() {
    return [
      // Firebase Auth Custom Domain Handlers
      {
        source: "/__/auth/:path*",
        destination: "https://nutty-tales-1c667.firebaseapp.com/__/auth/:path*",
      },
      {
        source: "/:vertical/__/auth/:path*",
        destination: "https://nutty-tales-1c667.firebaseapp.com/__/auth/:path*",
      },
      { source: "/almonds-wholesale", destination: "/wholesale-dry-fruits/almonds" },
      { source: "/cashews-wholesale", destination: "/wholesale-dry-fruits/cashews" },
      { source: "/makhana-wholesale", destination: "/wholesale-dry-fruits/makhana" },
      { source: "/almonds-wholesale/:city", destination: "/wholesale-dry-fruits/:city" },
      { source: "/cashews-wholesale/:city", destination: "/wholesale-dry-fruits/:city" },
      { source: "/makhana-wholesale/:city", destination: "/wholesale-dry-fruits/:city" },
      { source: "/dry-fruits-for-bakeries", destination: "/wholesale-dry-fruits/bakeries" },
      { source: "/dry-fruits-for-hotels", destination: "/wholesale-dry-fruits/hotels-resorts" },
      { source: "/dry-fruits-for-sweet-shops", destination: "/wholesale-dry-fruits/sweet-shops" },
      { source: "/dry-fruits-for-restaurants", destination: "/wholesale-dry-fruits/restaurants-cafes" },
      { source: "/kashmir-crafts", destination: "/crafts/kashmir" },
      { source: "/kani-shawls", destination: "/pashmina-shawls" },
      { source: "/sozni-shawls", destination: "/pashmina-shawls" },
      { source: "/hotels/srinagar", destination: "/stays/srinagar" },
      { source: "/hotels/gulmarg", destination: "/stays/gulmarg" },
      { source: "/boutique-stays/kashmir", destination: "/stays/kashmir" },
      { source: "/family-stays/srinagar", destination: "/stays/srinagar" },
      { source: "/wedding-planners/kashmir", destination: "/destination-weddings/kashmir" },
      { source: "/wedding-venues/kashmir", destination: "/destination-weddings/kashmir" },
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
