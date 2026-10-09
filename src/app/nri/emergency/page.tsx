import type { Metadata } from 'next'
import EmergencyClient from './EmergencyClient'

export const metadata: Metadata = {
  title: 'India Emergency Assistance Desk | Nuty Tales NRI',
  description:
    'Urgent on-ground coordination in India for overseas families. Rapid response for elder distress, hospital emergency coordination, and immediate property crises.',
  alternates: {
    canonical: 'https://nri.nutytales.com/emergency',
  },
  openGraph: {
    title: 'India Emergency Assistance Desk | Nuty Tales NRI',
    description:
      'Urgent on-ground coordination in India for overseas families. Rapid response for elder distress and immediate property crises.',
    url: 'https://nri.nutytales.com/emergency',
    siteName: 'Nuty Tales NRI',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function EmergencyAssistancePage() {
  return <EmergencyClient />
}
