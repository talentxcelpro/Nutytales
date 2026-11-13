import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wholesale Crafts & Artisan Cooperative Export | Nuty Tales Crafts',
  description:
    'B2B bulk sourcing for boutiques, luxury retailers, and hospitality brands. GI-certified Pashmina shawls, woodcrafts, and handlooms with authentic certificates of origin.',
  alternates: {
    canonical: 'https://nutytales.com/crafts/wholesale',
  },
}

export default function WholesaleCraftsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
