import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Nuty Tales | Global Discovery for Products, Places & Experiences',
  description:
    'Discover extraordinary Himalayan private stays, handwoven GI Pashmina, artisan walnut crafts, alpine ski expeditions, curated gifting, and global B2B commodities on Nuty Tales.',
  alternates: {
    canonical: 'https://nutytales.com/explore',
  },
  openGraph: {
    title: 'Explore Nuty Tales — Global Marketplace Discovery',
    description:
      'Curated collections across products, places, stays, experiences, and global sourcing.',
    url: 'https://nutytales.com/explore',
    siteName: 'Nuty Tales',
  },
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
