import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products-data";
import { CRAFT_PRODUCTS } from "@/lib/crafts-data";
import { STAY_PROPERTIES } from "@/lib/stays-data";
import { KASHMIR_TRAVEL_PACKAGES } from "@/lib/travel-data";
import { INDUSTRIES } from "@/lib/business-supply-data";
import { buildRootCoreSitemap } from "@/lib/seo/sitemap";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nutytales.com";

/**
 * Next.js Root sitemap.ts
 * Rendered at GET /sitemap.xml
 *
 * Emits ONLY verified 200 OK, canonical, indexable URLs with real supply & commercial actions.
 * Excludes checkout, cart, auth, admin, parameter URLs, and thin pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 1. Core high-intent hubs and landing pages
  const corePages = buildRootCoreSitemap();

  // 2. Real Verified Product SKU Pages from catalog
  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${APP_URL}/shop/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 3. Real Verified Craft Products from catalog
  const craftPages: MetadataRoute.Sitemap = CRAFT_PRODUCTS.map((craft) => ({
    url: `${APP_URL}/crafts/product/${craft.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 4. Real Verified Stay Properties
  const stayPages: MetadataRoute.Sitemap = STAY_PROPERTIES.map((prop) => ({
    url: `${APP_URL}/stays/${prop.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 5. Real Verified Travel Packages
  const travelPages: MetadataRoute.Sitemap = KASHMIR_TRAVEL_PACKAGES.map((pkg) => ({
    url: `${APP_URL}/travel/kashmir/${pkg.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 6. Real Verified B2B Industry Procurement Pages
  const industryPages: MetadataRoute.Sitemap = INDUSTRIES.map((ind) => ({
    url: `${APP_URL}/wholesale-dry-fruits/${ind.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.80,
  }));

  // Combine and deduplicate by URL
  const allEntries = [
    ...corePages,
    ...productPages,
    ...craftPages,
    ...stayPages,
    ...travelPages,
    ...industryPages,
  ];

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
