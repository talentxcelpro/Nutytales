import type { Metadata } from 'next'
import { REGIONAL_CONFIGS, getRegionalProducts } from '@/lib/regional-data'
import RegionalLandingClient from '@/components/regional/RegionalLandingClient'

const config = REGIONAL_CONFIGS.eu

export const metadata: Metadata = {
  title: `${config.brandName} — ${config.offeringTitle}`,
  description: config.description,
  alternates: {
    canonical: config.canonicalDomain,
  },
}

export const revalidate = 3600

export default function EuropePage() {
  const products = getRegionalProducts('eu')
  return <RegionalLandingClient config={config} featuredProducts={products} />
}
