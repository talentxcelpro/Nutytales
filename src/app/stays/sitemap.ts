import type { MetadataRoute } from "next";
import { STAY_PROPERTIES } from "@/lib/stays-data";

const STAYS_URL = "https://stays.nutytales.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${STAYS_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${STAYS_URL}/stays/kashmir`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${STAYS_URL}/hotels/srinagar`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${STAYS_URL}/hotels/gulmarg`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${STAYS_URL}/boutique-stays/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${STAYS_URL}/family-stays/srinagar`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${STAYS_URL}/hosts`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${STAYS_URL}/group-quote`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = STAY_PROPERTIES.map((prop) => ({
    url: `${STAYS_URL}/stays/${prop.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...coreRoutes, ...propertyRoutes];
}
