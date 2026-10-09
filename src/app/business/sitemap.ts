import type { MetadataRoute } from "next";
import { INDUSTRIES } from "@/lib/business-supply-data";

const BUSINESS_URL = "https://business.nutytales.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${BUSINESS_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BUSINESS_URL}/business-supply`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${BUSINESS_URL}/wholesale-dry-fruits`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${BUSINESS_URL}/wholesale-dry-fruits/noida`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${BUSINESS_URL}/wholesale-dry-fruits/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${BUSINESS_URL}/wholesale-dry-fruits/patna`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${BUSINESS_URL}/wholesale-dry-fruits/delhi`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BUSINESS_URL}/wholesale-dry-fruits/mumbai`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BUSINESS_URL}/wholesale-dry-fruits/bangalore`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BUSINESS_URL}/catalog`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BUSINESS_URL}/rfq`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${BUSINESS_URL}/bulk-quote`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  ];

  const industryRoutes: MetadataRoute.Sitemap = INDUSTRIES.map((ind) => ({
    url: `${BUSINESS_URL}/wholesale-dry-fruits/${ind.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...coreRoutes, ...industryRoutes];
}
