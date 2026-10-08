import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technology & Architecture | Nuty Tales Platform OS',
  description:
    'Explore the digital foundation behind Nuty Tales: System Intelligence (SI), Intent Resolution, Shared Marketplace Graph, Global Multi-Currency Engine, and Revenue OS.',
  alternates: {
    canonical: 'https://nutytales.com/technology',
  },
  openGraph: {
    title: 'The Technology Behind Nuty Tales — Global Platform Architecture',
    description:
      'How System Intelligence (SI) orchestrates multi-vertical commerce, cross-border fulfillment, and institutional procurement.',
    url: 'https://nutytales.com/technology',
    siteName: 'Nuty Tales',
  },
}

export default function TechnologyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
