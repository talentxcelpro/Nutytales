import type { Metadata } from 'next'
import { REGIONAL_CONFIGS, getRegionalProducts } from '@/lib/regional-data'
import RegionalLandingClient from '@/components/regional/RegionalLandingClient'

const config = REGIONAL_CONFIGS.us

export const metadata: Metadata = {
  title: `${config.brandName} — ${config.offeringTitle}`,
  description: config.description,
  alternates: {
    canonical: config.canonicalDomain,
  },
}

export const revalidate = 3600

export default function AmericaPage() {
  const products = getRegionalProducts('us')
  return <RegionalLandingClient config={config} featuredProducts={products} />
}
