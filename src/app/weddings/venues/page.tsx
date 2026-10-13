import type { Metadata } from 'next'
import VenuesMarketplaceClient from './VenuesMarketplaceClient'

export const metadata: Metadata = {
  title: 'Global Wedding Venues Directory | Heritage Palaces, Resorts & Estates',
  description:
    'Discover and compare luxury wedding venues across Jaipur, Udaipur, Kashmir, Goa, Dubai, and Lake Como Italy. Verified capacities, room counts, and catering policies.',
  alternates: {
    canonical: 'https://weddings.nutytales.com/venues',
  },
}

export default function VenuesPage() {
  return <VenuesMarketplaceClient />
}
