import type { MetadataRoute } from "next";

const GIFTING_URL = "https://gifting.nutytales.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${GIFTING_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${GIFTING_URL}/corporate-gifts`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${GIFTING_URL}/corporate-gifts/diwali`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${GIFTING_URL}/corporate-gifts/diwali/dubai`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${GIFTING_URL}/corporate-gifts/diwali/mumbai`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${GIFTING_URL}/corporate-gifts/employee-gifts`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${GIFTING_URL}/corporate-gifts/client-gifts`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${GIFTING_URL}/employee-welcome-gifts`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${GIFTING_URL}/client-gifts`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${GIFTING_URL}/executive-gifts`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${GIFTING_URL}/wedding-return-gifts`, lastModified: now, changeFrequency: "weekly", priority: 0.90 },
    { url: `${GIFTING_URL}/wedding-gifts/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${GIFTING_URL}/designer`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${GIFTING_URL}/recipients`, lastModified: now, changeFrequency: "monthly", priority: 0.70 },
  ];
}
