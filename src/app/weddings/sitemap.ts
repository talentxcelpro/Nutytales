import type { MetadataRoute } from "next";

const WEDDINGS_URL = "https://weddings.nutytales.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${WEDDINGS_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${WEDDINGS_URL}/destination-weddings`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${WEDDINGS_URL}/destination-weddings/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${WEDDINGS_URL}/destination-weddings/dubai`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${WEDDINGS_URL}/destination-weddings/italy`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${WEDDINGS_URL}/wedding-return-gifts`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${WEDDINGS_URL}/workspace`, lastModified: now, changeFrequency: "monthly", priority: 0.70 },
  ];
}
