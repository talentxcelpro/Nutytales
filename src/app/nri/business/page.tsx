import type { Metadata } from 'next'
import BusinessDeskClient from './BusinessDeskClient'

export const metadata: Metadata = {
  title: 'Enterprise & Corporate Desk | Nuty Tales NRI',
  description:
    'Dedicated corporate and family office operational support in India. Expat relocations, supplier audits, commercial property management, and Bar Council legal liaisons.',
  alternates: {
    canonical: 'https://nri.nutytales.com/business',
  },
  openGraph: {
    title: 'Enterprise & Corporate Desk | Nuty Tales NRI',
    description:
      'Dedicated corporate and family office operational support in India. Expat relocations, supplier audits, commercial property management, and Bar Council legal liaisons.',
    url: 'https://nri.nutytales.com/business',
    siteName: 'Nuty Tales NRI',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function NriBusinessPage() {
  return <BusinessDeskClient />
}
