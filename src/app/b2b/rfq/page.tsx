import type { Metadata } from 'next'
import B2BRfqClient from './B2BRfqClient'

export const metadata: Metadata = {
  title: 'Request for Quotation (RFQ) Terminal | Nuty Tales Business',
  description:
    'Instant bulk pricing calculator and commercial RFQ submission for bakeries, FMCG brands, and institutional dry fruit buyers.',
  alternates: {
    canonical: 'https://nutytales.com/b2b/rfq',
  },
  openGraph: {
    title: 'Request for Quotation (RFQ) Terminal | Nuty Tales Business',
    description:
      'Instant bulk pricing calculator and commercial RFQ submission for commercial dry fruit buyers.',
    url: 'https://nutytales.com/b2b/rfq',
    siteName: 'Nuty Tales Business',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function B2BRfqPage() {
  return <B2BRfqClient />
}
