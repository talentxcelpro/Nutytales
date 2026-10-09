import type { MetadataRoute } from 'next'
import { NRI_CATEGORIES } from '@/lib/nri/nri-data'

const NRI_BASE_URL = 'https://nri.nutytales.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${NRI_BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${NRI_BASE_URL}/services`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${NRI_BASE_URL}/marketplace`, lastModified: now, changeFrequency: 'daily', priority: 0.90 },
    { url: `${NRI_BASE_URL}/how-it-works`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${NRI_BASE_URL}/providers`, lastModified: now, changeFrequency: 'weekly', priority: 0.80 },
    { url: `${NRI_BASE_URL}/business`, lastModified: now, changeFrequency: 'weekly', priority: 0.80 },
    { url: `${NRI_BASE_URL}/emergency`, lastModified: now, changeFrequency: 'daily', priority: 0.90 },
    { url: `${NRI_BASE_URL}/country/usa`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${NRI_BASE_URL}/country/uk`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${NRI_BASE_URL}/country/canada`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${NRI_BASE_URL}/country/uae`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(NRI_CATEGORIES).map((key) => ({
    url: `${NRI_BASE_URL}/services/${key.replace('_', '-')}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.90,
  }))

  return [...coreRoutes, ...categoryRoutes]
}
