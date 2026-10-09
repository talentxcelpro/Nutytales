import type { Metadata } from 'next'
import B2BCatalogClient from './B2BCatalogClient'

export const metadata: Metadata = {
  title: 'Wholesale Commodities & Bulk Ingredients Catalogue | Nuty Tales Business',
  description:
    'Live wholesale rates across tree nuts, GI-tagged Kashmiri saffron, Mithila makhana, and dried fruits. Cleaned, machine-graded, and moisture-controlled for industrial production.',
  alternates: {
    canonical: 'https://business.nutytales.com/catalog',
  },
  openGraph: {
    title: 'Wholesale Commodities & Bulk Ingredients Catalogue | Nuty Tales Business',
    description:
      'Live wholesale rates across bulk tree nuts, Kashmiri saffron, and Mithila makhana.',
    url: 'https://business.nutytales.com/catalog',
    siteName: 'Nuty Tales Business',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function B2BCatalogPage() {
  return <B2BCatalogClient />
}
