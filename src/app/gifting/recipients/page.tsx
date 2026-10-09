import type { Metadata } from 'next'
import GiftingRecipientsClient from './GiftingRecipientsClient'

export const metadata: Metadata = {
  title: 'Enterprise Multi-Recipient Gifting Desk | Nuty Tales Gifting',
  description:
    'Upload multi-address rosters or generate choice links for corporate gifting. Individual dispatch tracking, custom laser branding, and GST invoicing.',
  alternates: {
    canonical: 'https://gifting.nutytales.com/recipients',
  },
  openGraph: {
    title: 'Enterprise Multi-Recipient Gifting Desk | Nuty Tales Gifting',
    description:
      'Upload multi-address rosters or generate choice links for corporate gifting.',
    url: 'https://gifting.nutytales.com/recipients',
    siteName: 'Nuty Tales Gifting',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function GiftingRecipientsPage() {
  return <GiftingRecipientsClient />
}
