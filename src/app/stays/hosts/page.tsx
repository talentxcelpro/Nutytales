import type { Metadata } from 'next'
import StaysHostsClient from './StaysHostsClient'

export const metadata: Metadata = {
  title: 'List Your Luxury Property & Orchard Estate | Nuty Tales Stays',
  description:
    'Partner with Nuty Tales Stays. List your boutique orchard villa, alpine ski chalet, or heritage estate for exclusive, high-yield private buyouts.',
  alternates: {
    canonical: 'https://nutytales.com/stays/hosts',
  },
  openGraph: {
    title: 'List Your Luxury Property & Orchard Estate | Nuty Tales Stays',
    description:
      'Partner with Nuty Tales Stays for exclusive, high-yield private buyouts.',
    url: 'https://nutytales.com/stays/hosts',
    siteName: 'Nuty Tales Stays',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function StaysHostPortalPage() {
  return <StaysHostsClient />
}
