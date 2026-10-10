import type { Metadata } from 'next'
import B2BHomeClient from './B2BHomeClient'

export const metadata: Metadata = {
  title: {
    absolute: 'Nuty Tales Business — Source Better. Supply Smarter. Grow Together.',
  },
  description:
    'Direct farm-to-enterprise procurement portal for commercial bakeries, FMCG brands, HORECA, and institutional buyers. NABL-tested, FSSAI-certified bulk almonds, walnuts, cashews, makhana & saffron with wholesale tier pricing. Source better, supply smarter, grow together.',
  alternates: {
    canonical: 'https://business.nutytales.com',
  },
  openGraph: {
    title: 'Nuty Tales Business — Source Better. Supply Smarter. Grow Together.',
    description:
      'Direct farm-to-enterprise procurement portal for commercial food production, bakery chains, and institutional dry fruit buyers. Source better, supply smarter, grow together.',
    url: 'https://business.nutytales.com',
    siteName: 'Nuty Tales Business',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function B2BHomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nuty Tales Business',
    url: 'https://business.nutytales.com',
    description: 'Wholesale B2B dry fruits, nuts, makhana, and bulk food ingredients supply engine.',
    parentOrganization: {
      '@type': 'Organization',
      name: 'Nuty Tales',
      url: 'https://nutytales.com',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <B2BHomeClient />
    </>
  )
}
