import type { Metadata } from 'next'
import KashmirCraftsClient from './KashmirCraftsClient'

export const metadata: Metadata = {
  title: 'Kashmir Crafts & Master Artisan Heirlooms | Nuty Tales Crafts',
  description:
    'Handcrafted treasures directly from the master cooperatives of Kashmir. GI-certified Pashmina shawls, walnut wood carvings, crewel embroidery, and paper mache.',
  alternates: {
    canonical: 'https://crafts.nutytales.com/kashmir',
  },
  openGraph: {
    title: 'Kashmir Crafts & Master Artisan Heirlooms | Nuty Tales Crafts',
    description:
      'Handcrafted treasures directly from the master cooperatives of Kashmir. GI-certified Pashmina shawls and walnut wood carvings.',
    url: 'https://crafts.nutytales.com/kashmir',
    siteName: 'Nuty Tales Crafts',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function KashmirCraftsPage() {
  return <KashmirCraftsClient />
}
