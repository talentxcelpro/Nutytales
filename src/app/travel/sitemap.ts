import type { MetadataRoute } from "next";
import { KASHMIR_TRAVEL_PACKAGES } from "@/lib/travel-data";

const TRAVEL_URL = "https://travel.nutytales.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${TRAVEL_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${TRAVEL_URL}/travel/kashmir`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${TRAVEL_URL}/travel/kashmir/7-days`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${TRAVEL_URL}/travel/kashmir/5-days`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${TRAVEL_URL}/travel/kashmir/family`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${TRAVEL_URL}/travel/kashmir/honeymoon`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${TRAVEL_URL}/travel/kashmir/luxury`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${TRAVEL_URL}/travel/kashmir/winter`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${TRAVEL_URL}/builder`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${TRAVEL_URL}/partners`, lastModified: now, changeFrequency: "monthly", priority: 0.70 },
  ];

  const packageRoutes: MetadataRoute.Sitemap = KASHMIR_TRAVEL_PACKAGES.map((pkg) => ({
    url: `${TRAVEL_URL}/travel/kashmir/${pkg.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...coreRoutes, ...packageRoutes];
}
