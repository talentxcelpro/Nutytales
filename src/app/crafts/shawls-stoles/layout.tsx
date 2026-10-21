import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pashmina Shawls & Luxury Cashmere Stoles | Nuty Tales Crafts',
  description:
    'GI-certified pure Changthangi Cashmere shawls, Kani jacquard weaves, and Sozni needlework stoles crafted by master Kashmiri weavers.',
  alternates: {
    canonical: 'https://crafts.nutytales.com/shawls-stoles',
  },
  openGraph: {
    title: 'Pashmina Shawls & Luxury Cashmere Stoles | Nuty Tales Crafts',
    description: 'GI-certified Changthangi Cashmere shawls and Kani weaves.',
    url: 'https://crafts.nutytales.com/shawls-stoles',
    siteName: 'Nuty Tales Crafts',
  },
}

export default function ShawlsStolesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
