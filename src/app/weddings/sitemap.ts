import type { MetadataRoute } from "next";
import { WEDDING_OCCASIONS } from "@/lib/weddings-data";

const WEDDINGS_URL = "https://weddings.nutytales.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${WEDDINGS_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${WEDDINGS_URL}/destination-weddings`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${WEDDINGS_URL}/destination-weddings/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${WEDDINGS_URL}/wedding-planners/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${WEDDINGS_URL}/wedding-venues/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${WEDDINGS_URL}/wedding-catering/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${WEDDINGS_URL}/wedding-return-gifts`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${WEDDINGS_URL}/wedding-gifts/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${WEDDINGS_URL}/workspace`, lastModified: now, changeFrequency: "monthly", priority: 0.70 },
  ];

  const occasionRoutes: MetadataRoute.Sitemap = WEDDING_OCCASIONS.map((occ) => ({
    url: `${WEDDINGS_URL}/#${occ.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.80,
  }));

  return [...coreRoutes, ...occasionRoutes];
}
