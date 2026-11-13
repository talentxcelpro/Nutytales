import type { Metadata } from 'next'
import GiftingRecipientsClient from './GiftingRecipientsClient'

export const metadata: Metadata = {
  title: 'Enterprise Multi-Recipient Gifting Desk | Nuty Tales Gifting',
  description:
    'Upload multi-address rosters or generate choice links for corporate gifting. Individual dispatch tracking, custom laser branding, and GST invoicing.',
  alternates: {
    canonical: 'https://nutytales.com/gifting/recipients',
  },
  openGraph: {
    title: 'Enterprise Multi-Recipient Gifting Desk | Nuty Tales Gifting',
    description:
      'Upload multi-address rosters or generate choice links for corporate gifting.',
    url: 'https://nutytales.com/gifting/recipients',
    siteName: 'Nuty Tales Gifting',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function GiftingRecipientsPage() {
  return <GiftingRecipientsClient />
}
