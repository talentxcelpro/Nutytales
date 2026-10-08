import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuty Tales Marketplace | Global Multi-Vertical Commerce Engine',
  description:
    'Browse verified suppliers, artisan guilds, boutique hosts, licensed DMCs, and gourmet growers across products, stays, travel packages, and wholesale commodities.',
  alternates: {
    canonical: 'https://nutytales.com/marketplace',
  },
  openGraph: {
    title: 'Nuty Tales Global Marketplace',
    description:
      'Connecting customers, sellers, artisans, farmers, hotels, hosts, and corporate buyers through one connected technology platform.',
    url: 'https://nutytales.com/marketplace',
    siteName: 'Nuty Tales',
  },
}

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
