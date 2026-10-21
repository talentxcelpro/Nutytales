import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join Nuty Tales Business Network | Wholesale Supplier & Buyer Partner',
  description:
    'Register as a verified commercial buyer or artisan producer. Direct farm-to-enterprise supply, NABL-tested dry fruits, and wholesale pricing.',
  alternates: {
    canonical: 'https://business.nutytales.com/business/join',
  },
  openGraph: {
    title: 'Join Nuty Tales Business Network',
    description:
      'Register as a verified commercial buyer or artisan producer with Nuty Tales Business.',
    url: 'https://business.nutytales.com/business/join',
    siteName: 'Nuty Tales Business',
  },
}

export default function BusinessJoinLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
