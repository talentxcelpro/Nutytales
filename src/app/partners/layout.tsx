import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner With Nuty Tales | Global Marketplace Seller & Supplier Network',
  description:
    'Join Nuty Tales as a verified grower, artisan guild, luxury hotel, tour operator, or corporate supplier. Access millions of global customers across India, UAE, UK, USA, and Europe.',
  alternates: {
    canonical: 'https://nutytales.com/partners',
  },
  openGraph: {
    title: 'Partner With Nuty Tales — Global Marketplace Network',
    description:
      'Direct grower aggregation, GI artisan guilds, luxury boutique stays, and curated DMCs on a single global commerce engine.',
    url: 'https://nutytales.com/partners',
    siteName: 'Nuty Tales',
  },
}

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
