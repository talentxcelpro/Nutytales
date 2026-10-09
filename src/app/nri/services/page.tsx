import type { Metadata } from 'next'
import ServicesDirectoryClient from './ServicesDirectoryClient'

export const metadata: Metadata = {
  title: 'All India NRI Services Directory | Property, Legal & Family | Nuty Tales NRI',
  description:
    'Explore the full spectrum of verified India-based coordination services for NRIs and OCIs: property management in Srinagar & Delhi, parent care, legal execution & CA tax filings.',
  alternates: {
    canonical: 'https://nri.nutytales.com/services',
  },
  openGraph: {
    title: 'All India NRI Services Directory | Nuty Tales NRI',
    description:
      'Verified India-based coordination: property management, parent care, legal execution & CA tax filings across Srinagar, Delhi NCR, and major hubs.',
    url: 'https://nri.nutytales.com/services',
  },
}

export default function NriServicesDirectoryPage() {
  return <ServicesDirectoryClient />
}
