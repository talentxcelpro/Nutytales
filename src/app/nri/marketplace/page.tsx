import type { Metadata } from 'next'
import MarketplaceClient from './MarketplaceClient'

export const metadata: Metadata = {
  title: 'NRI Service Scoping & Vetting Directory | Nuty Tales NRI',
  description:
    'Verified India-based execution: direct scoping and transparent pricing for property inspections, legal tasks, and elder support.',
  alternates: {
    canonical: 'https://nri.nutytales.com/marketplace',
  },
  openGraph: {
    title: 'NRI Service Scoping & Ground Network | Nuty Tales NRI',
    description:
      'Direct scoping and transparent pricing for property inspections, legal tasks, and elder support in India.',
    url: 'https://nri.nutytales.com/marketplace',
  },
}

export default function NriMarketplacePage() {
  return <MarketplaceClient />
}
