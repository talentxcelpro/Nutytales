import type { Metadata } from 'next'
import { REGIONAL_CONFIGS } from '@/lib/regional-data'
import RegionalCheckoutClient from '@/components/regional/RegionalCheckoutClient'

const config = REGIONAL_CONFIGS.us

export const metadata: Metadata = {
  title: `Checkout — US & Canada Gourmet Orchard | ${config.brandName}`,
  description: `Complete your North American gourmet harvest delivery with US FDA Prior Notice automated pre-clearance and FedEx Priority air courier from ${config.regionalHub}.`,
  alternates: {
    canonical: `${config.canonicalDomain}/checkout`,
  },
}

export default function AmericaCheckoutPage() {
  return <RegionalCheckoutClient config={config} />
}
