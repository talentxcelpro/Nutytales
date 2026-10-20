import type { Metadata } from 'next'
import { REGIONAL_CONFIGS, getRegionalProducts } from '@/lib/regional-data'
import RegionalCatalogClient from '@/components/regional/RegionalCatalogClient'

const config = REGIONAL_CONFIGS.me

export const metadata: Metadata = {
  title: `Luxury Hamper Store Catalog | ${config.brandName}`,
  description:
    'Browse all luxury gift hampers and single-origin dry fruit boxes curated for GCC & Middle East diaspora delivery. Direct dispatch from Dubai JAFZA Hub.',
  alternates: {
    canonical: `${config.canonicalDomain}/store`,
  },
}

export const revalidate = 3600

export default function MiddleEastStorePage() {
  const products = getRegionalProducts('me')
  return <RegionalCatalogClient config={config} products={products} />
}
