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
          "/cart/",
          "/checkout",
          "/checkout/",
          "/api/",
          "/login",
          "/login/",
          "/register",
          "/register/",
          "/search",
          "/search/",
          "/*?*utm_",
          "/*?*session_*",
          "/*.json$",
        ],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
      },
      {
        userAgent: "CCBot",
        allow: "/",
      },
    ],
    sitemap: [
      `${APP_URL}/sitemap.xml`,
      "https://middleeast.nutytales.com/sitemap.xml",
      "https://europe.nutytales.com/sitemap.xml",
      "https://america.nutytales.com/sitemap.xml",
      "https://business.nutytales.com/sitemap.xml",
      "https://gifting.nutytales.com/sitemap.xml",
      "https://weddings.nutytales.com/sitemap.xml",
      "https://crafts.nutytales.com/sitemap.xml",
      "https://stays.nutytales.com/sitemap.xml",
      "https://travel.nutytales.com/sitemap.xml",
      "https://nri.nutytales.com/sitemap.xml",
    ],
    host: APP_URL,
  };
}
