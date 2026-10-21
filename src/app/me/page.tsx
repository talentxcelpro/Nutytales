import type { Metadata } from 'next'
import { REGIONAL_CONFIGS, getRegionalProducts } from '@/lib/regional-data'
import RegionalLandingClient from '@/components/regional/RegionalLandingClient'

const config = REGIONAL_CONFIGS.me

export const metadata: Metadata = {
  title: `${config.brandName} — ${config.offeringTitle}`,
  description: config.description,
  alternates: {
    canonical: config.canonicalDomain,
  },
}

export const revalidate = 3600

export default function MiddleEastPage() {
  const products = getRegionalProducts('me')
  return <RegionalLandingClient config={config} featuredProducts={products} />
}
