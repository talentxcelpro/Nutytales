import type { Metadata } from 'next'
import BusinessSupplyClient from './BusinessSupplyClient'

export const metadata: Metadata = {
  title: 'Enterprise Dry Fruit & Raw Nut Ingredients Supply Engine | Nuty Tales Business',
  description:
    'Direct farm-to-factory dry fruit supply for commercial bakeries, FMCG brands, HORECA, and institutional buyers. NABL-tested, FSSAI-certified bulk ingredients with wholesale tier pricing.',
  alternates: {
    canonical: 'https://business.nutytales.com/business-supply',
  },
  openGraph: {
    title: 'Enterprise Dry Fruit & Raw Nut Ingredients Supply Engine | Nuty Tales Business',
    description:
      'Direct farm-to-factory dry fruit supply for commercial bakeries, FMCG brands, HORECA, and institutional buyers.',
    url: 'https://business.nutytales.com/business-supply',
    siteName: 'Nuty Tales Business',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function BusinessSupplyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Nuty Tales Enterprise Business Supply',
    url: 'https://business.nutytales.com/business-supply',
    description: 'Bulk raw dry fruit ingredients and B2B industrial supply.',
    provider: {
      '@type': 'Organization',
      name: 'Nuty Tales Business',
      url: 'https://business.nutytales.com',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BusinessSupplyClient />
    </>
  )
}
