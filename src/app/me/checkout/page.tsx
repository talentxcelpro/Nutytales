import type { Metadata } from 'next'
import { REGIONAL_CONFIGS } from '@/lib/regional-data'
import RegionalCheckoutClient from '@/components/regional/RegionalCheckoutClient'

const config = REGIONAL_CONFIGS.me

export const metadata: Metadata = {
  title: `Checkout — GCC & Middle East Delivery | ${config.brandName}`,
  description: `Complete your cross-border luxury hamper order with pre-paid GCC customs duties (DDP) and direct dispatch from ${config.regionalHub}.`,
  alternates: {
    canonical: `${config.canonicalDomain}/checkout`,
  },
}

export default function MiddleEastCheckoutPage() {
  return <RegionalCheckoutClient config={config} />
}
