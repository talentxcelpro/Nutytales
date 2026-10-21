import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuty Tales for Founders | Incubating D2C Food & Craft Brands',
  description:
    'End-to-end launchpad for D2C founders: bulk raw material procurement, nitrogen flushing, custom packaging, compliance, and fulfillment.',
  alternates: {
    canonical: 'https://nutytales.com/founders',
  },
  openGraph: {
    title: 'Nuty Tales for Founders | Incubating D2C Food & Craft Brands',
    description:
      'End-to-end launchpad for D2C founders: bulk raw material procurement, nitrogen flushing, custom packaging, compliance, and fulfillment.',
    url: 'https://nutytales.com/founders',
    siteName: 'Nuty Tales',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function FoundersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
