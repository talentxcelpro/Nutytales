import type { Metadata } from 'next'
import { REGIONAL_CONFIGS } from '@/lib/regional-data'
import RegionalCheckoutClient from '@/components/regional/RegionalCheckoutClient'

const config = REGIONAL_CONFIGS.eu

export const metadata: Metadata = {
  title: `Checkout — UK & Europe Organic Heritage | ${config.brandName}`,
  description: `Complete your European organic dry fruit and saffron delivery with certified phyto-sanitary compliance and direct air dispatch from ${config.regionalHub}.`,
  alternates: {
    canonical: `${config.canonicalDomain}/checkout`,
  },
}

export default function EuropeCheckoutPage() {
  return <RegionalCheckoutClient config={config} />
}
