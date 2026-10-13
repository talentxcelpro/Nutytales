import type { Metadata } from 'next'
import VendorsMarketplaceClient from './VendorsMarketplaceClient'

export const metadata: Metadata = {
  title: 'Global Wedding Vendors Directory | Planners, Wazwan Chefs & Cinema',
  description:
    'Discover verified wedding planners, authentic royal Wazwan caterers, candid cinematographers, and scenographers. Compare packages and request formal quotations.',
  alternates: {
    canonical: 'https://weddings.nutytales.com/vendors',
  },
}

export default function VendorsPage() {
  return <VendorsMarketplaceClient />
}
