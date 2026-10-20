import type { Metadata } from 'next'
import { REGIONAL_CONFIGS } from '@/lib/regional-data'
import RegionalCartClient from '@/components/regional/RegionalCartClient'

const config = REGIONAL_CONFIGS.us

export const metadata: Metadata = {
  title: `Your Gourmet Orchard Pack | ${config.brandName}`,
  description: `Review your North American harvest order with nitrogen-flushed pouch presentation and automated US Prior Notice clearance from ${config.regionalHub}.`,
  alternates: {
    canonical: `${config.canonicalDomain}/cart`,
  },
}

export default function AmericaCartPage() {
  return <RegionalCartClient config={config} />
}
