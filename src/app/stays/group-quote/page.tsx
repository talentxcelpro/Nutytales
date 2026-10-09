import type { Metadata } from 'next'
import StaysGroupQuoteClient from './StaysGroupQuoteClient'

export const metadata: Metadata = {
  title: 'Group Bookings & Private Estate Buyout Quote | Nuty Tales Stays',
  description:
    'Plan complete private estate buyouts and corporate offsites in Kashmir and Delhi-NCR. Live transparent cost calculator for multi-night luxury stays.',
  alternates: {
    canonical: 'https://stays.nutytales.com/group-quote',
  },
  openGraph: {
    title: 'Group Bookings & Private Estate Buyout Quote | Nuty Tales Stays',
    description:
      'Plan complete private estate buyouts and corporate offsites in Kashmir and Delhi-NCR with live instant cost estimation.',
    url: 'https://stays.nutytales.com/group-quote',
    siteName: 'Nuty Tales Stays',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function StaysGroupQuotePage() {
  return <StaysGroupQuoteClient />
}
