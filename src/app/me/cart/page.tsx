import type { Metadata } from 'next'
import { REGIONAL_CONFIGS } from '@/lib/regional-data'
import RegionalCartClient from '@/components/regional/RegionalCartClient'

const config = REGIONAL_CONFIGS.me

export const metadata: Metadata = {
  title: `Your Luxury Hamper Bag | ${config.brandName}`,
  description: `Review your curated GCC delivery hamper selections with pre-cleared customs and direct flight dispatch from ${config.regionalHub}.`,
  alternates: {
    canonical: `${config.canonicalDomain}/cart`,
  },
}

export default function MiddleEastCartPage() {
  return <RegionalCartClient config={config} />
}
