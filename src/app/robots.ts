import type { MetadataRoute } from "next";

/**
 * Next.js robots.ts
 * Rendered at GET /robots.txt
 *
 * Disallows bots from sensitive/transactional sections while keeping
 * all product & content pages fully indexable.
 */
export default function robots(): MetadataRoute.Robots {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nutytales.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/account",
          "/account/",
          "/cart",
          "/checkout",
          "/api",
          "/api/",
          "/_next",
          "/_next/",
          "/login",
          "/register",
          "/*.json$",
        ],
      },
      // Prevent AI-training crawlers from scraping content
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}
