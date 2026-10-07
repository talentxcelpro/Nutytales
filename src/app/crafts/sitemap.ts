import type { MetadataRoute } from "next";
import { CRAFT_PRODUCTS } from "@/lib/crafts-data";

const CRAFTS_URL = "https://crafts.nutytales.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${CRAFTS_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${CRAFTS_URL}/kashmir`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${CRAFTS_URL}/pashmina-shawls`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${CRAFTS_URL}/kani-shawls`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${CRAFTS_URL}/sozni-shawls`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${CRAFTS_URL}/kashmir-crafts`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${CRAFTS_URL}/shawls-stoles`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${CRAFTS_URL}/pherans`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${CRAFTS_URL}/jackets-coats`, lastModified: now, changeFrequency: "weekly", priority: 0.80 },
    { url: `${CRAFTS_URL}/winter-wear`, lastModified: now, changeFrequency: "weekly", priority: 0.80 },
    { url: `${CRAFTS_URL}/heritage-home`, lastModified: now, changeFrequency: "weekly", priority: 0.80 },
    { url: `${CRAFTS_URL}/try-with-si`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${CRAFTS_URL}/wholesale`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  ];

  const productRoutes: MetadataRoute.Sitemap = CRAFT_PRODUCTS.map((craft) => ({
    url: `${CRAFTS_URL}/product/${craft.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...coreRoutes, ...productRoutes];
}
