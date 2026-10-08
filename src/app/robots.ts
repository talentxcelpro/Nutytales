import type { MetadataRoute } from "next";

/**
 * Nuty Tales Global Search Engine Crawl Governance — robots.txt
 *
 * Rules:
 * - Allows all legitimate public SEO pages across all 6 business verticals.
 * - Disallows private/transactional routes (cart, checkout, admin, auth, internal search queries).
 * - Disallows AI scrapers (GPTBot, CCBot, Google-Extended) from bulk-scraping proprietary catalog.
 * - Publishes sitemaps for the root domain and all 6 independent business domains.
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
          "/api/",
          "/_next/",
          "/login",
          "/register",
          "/search?",
          "/search/",
          "/*?*utm_*",
          "/*?*session_*",
          "/*.json$",
        ],
      },
      // Restrict generative AI bulk scrapers
      {
        userAgent: ["GPTBot", "Google-Extended", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow: "/",
      },
    ],
    sitemap: [
      `${APP_URL}/sitemap.xml`,
      "https://business.nutytales.com/sitemap.xml",
      "https://gifting.nutytales.com/sitemap.xml",
      "https://weddings.nutytales.com/sitemap.xml",
      "https://crafts.nutytales.com/sitemap.xml",
      "https://stays.nutytales.com/sitemap.xml",
      "https://travel.nutytales.com/sitemap.xml",
    ],
    host: APP_URL,
  };
}
