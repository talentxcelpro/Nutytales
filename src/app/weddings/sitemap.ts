import type { MetadataRoute } from 'next'
import { INITIAL_VENUES, INITIAL_VENDORS } from '@/lib/weddings/data'

const WEDDINGS_URL = 'https://weddings.nutytales.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${WEDDINGS_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${WEDDINGS_URL}/venues`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${WEDDINGS_URL}/vendors`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${WEDDINGS_URL}/inspiration`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${WEDDINGS_URL}/destination-weddings`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${WEDDINGS_URL}/destination-weddings/kashmir`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${WEDDINGS_URL}/destination-weddings/dubai`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${WEDDINGS_URL}/destination-weddings/italy`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${WEDDINGS_URL}/wedding-return-gifts`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${WEDDINGS_URL}/workspace`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${WEDDINGS_URL}/dashboard`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${WEDDINGS_URL}/planner`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${WEDDINGS_URL}/vendor-portal`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
  ]

  const venueEntries: MetadataRoute.Sitemap = INITIAL_VENUES.map((v) => ({
    url: `${WEDDINGS_URL}/venues/${v.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const vendorEntries: MetadataRoute.Sitemap = INITIAL_VENDORS.map((v) => ({
    url: `${WEDDINGS_URL}/vendors/${v.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  return [...staticEntries, ...venueEntries, ...vendorEntries]
}
