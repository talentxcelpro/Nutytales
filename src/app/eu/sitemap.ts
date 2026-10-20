import type { MetadataRoute } from 'next'
import { REGIONAL_CONFIGS, getRegionalProducts } from '@/lib/regional-data'

const config = REGIONAL_CONFIGS.eu

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const base = config.canonicalDomain

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${base}/store`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
  ]

  const products = getRegionalProducts('eu')
  const productRoutes: MetadataRoute.Sitemap = products.map((item) => ({
    url: `${base}/store/${item.regionalSlug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  return [...coreRoutes, ...productRoutes]
}
