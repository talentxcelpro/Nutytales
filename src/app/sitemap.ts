import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products-data";
import { buildRootCoreSitemap } from "@/lib/seo/sitemap";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nutytales.com";

/**
 * Next.js Root sitemap.ts
 * Rendered at GET https://nutytales.com/sitemap.xml
 *
 * Emits ONLY verified 200 OK, canonical, indexable URLs belonging to the primary domain.
 * Specialist subdomains (nri, travel, stays, crafts, weddings, gifting, business)
 * maintain their own independent, isolated sitemaps.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 1. Core high-intent hubs and brand pages
  const corePages = buildRootCoreSitemap();

  // 2. Real Verified Product SKU Pages from catalog
  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${APP_URL}/shop/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Combine and deduplicate by URL
  const allEntries = [...corePages, ...productPages];

  const seenUrls = new Set<string>();
  const uniqueEntries: MetadataRoute.Sitemap = [];

  for (const entry of allEntries) {
    if (!seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      uniqueEntries.push(entry);
    }
  }

  return uniqueEntries;
}
