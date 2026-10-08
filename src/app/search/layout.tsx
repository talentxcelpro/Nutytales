import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Nuty Tales | Global Marketplace for Products, Stays, Crafts & Travel',
  description:
    'Search across all Nuty Tales verticals: gourmet dry fruits, artisan pashmina shawls, boutique heritage stays, Kashmir travel itineraries, wedding favors, and wholesale B2B commodities.',
  alternates: {
    canonical: 'https://nutytales.com/search',
  },
  openGraph: {
    title: 'Search Nuty Tales — Global Marketplace Search',
    description:
      'Search authentic Kashmiri gourmet foods, handwoven Pashmina, heritage houseboats, ski expeditions, and wholesale sourcing.',
    url: 'https://nutytales.com/search',
    siteName: 'Nuty Tales',
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
