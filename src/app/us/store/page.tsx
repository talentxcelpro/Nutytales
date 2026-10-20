import type { Metadata } from 'next'
import { REGIONAL_CONFIGS, getRegionalProducts } from '@/lib/regional-data'
import RegionalCatalogClient from '@/components/regional/RegionalCatalogClient'

const config = REGIONAL_CONFIGS.us

export const metadata: Metadata = {
  title: `Gourmet Orchard Store Catalog | ${config.brandName}`,
  description:
    'Browse all gourmet orchard dry fruit selections, Mithila jumbo makhana, single-origin Mamra almonds, and Kashmiri walnuts distributed across the US and Canada.',
  alternates: {
    canonical: `${config.canonicalDomain}/store`,
  },
}

export const revalidate = 3600

export default function AmericaStorePage() {
  const products = getRegionalProducts('us')
  return <RegionalCatalogClient config={config} products={products} />
}
