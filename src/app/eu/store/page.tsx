import type { Metadata } from 'next'
import { REGIONAL_CONFIGS, getRegionalProducts } from '@/lib/regional-data'
import RegionalCatalogClient from '@/components/regional/RegionalCatalogClient'

const config = REGIONAL_CONFIGS.eu

export const metadata: Metadata = {
  title: `Organic Heritage Store Catalog | ${config.brandName}`,
  description:
    'Browse all organic heritage dry fruits, Himalayan walnuts, unpasteurized honey, and GI saffron curated for UK & Europe delivery. Dispatched via London Heathrow Gateway Hub.',
  alternates: {
    canonical: `${config.canonicalDomain}/store`,
  },
}

export const revalidate = 3600

export default function EuropeStorePage() {
  const products = getRegionalProducts('eu')
  return <RegionalCatalogClient config={config} products={products} />
}
