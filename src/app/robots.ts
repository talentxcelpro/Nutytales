import type { MetadataRoute } from "next";

/**
 * Nuty Tales Global Search Engine Crawl Governance — robots.txt
 *
 * Rules:
 * - Allows all legitimate public SEO pages across all 6 business verticals.
 * - Disallows private/transactional routes (cart, checkout, admin, auth, internal search queries).
 * - Focuses crawl budget strictly on authoritative, canonical indexable pages.
 * - Publishes the primary clean sitemap to prevent crawl dilution.
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
    ],
  };
}
