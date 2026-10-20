import type { Metadata } from 'next'
import { REGIONAL_CONFIGS } from '@/lib/regional-data'
import RegionalCartClient from '@/components/regional/RegionalCartClient'

const config = REGIONAL_CONFIGS.eu

export const metadata: Metadata = {
  title: `Your Organic Heritage Basket | ${config.brandName}`,
  description: `Review your European order with UK FSA & EU organic phytosanitary certified batch release and direct carrier delivery from ${config.regionalHub}.`,
  alternates: {
    canonical: `${config.canonicalDomain}/cart`,
  },
}

export default function EuropeCartPage() {
  return <RegionalCartClient config={config} />
}
