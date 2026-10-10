import type { Metadata } from 'next'
import CraftsShell from '@/components/crafts/CraftsShell'

export const metadata: Metadata = {
  metadataBase: new URL('https://crafts.nutytales.com'),
  title: {
    default: 'Nuty Tales Crafts — Crafted by Tradition. Chosen for a Lifetime.',
    template: '%s | Nuty Tales Crafts',
  },
  description:
    'Evidence-backed GI-certified Changthangi Pashmina, hand-embroidered Tilla shawls, fine wool pherans, and bespoke heritage crafts. Crafted by tradition, chosen for a lifetime.',
  icons: {
    icon: [
      { url: 'https://nutytales.com/favicon.ico', sizes: 'any' },
      { url: 'https://nutytales.com/favicon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: 'https://nutytales.com/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  keywords: [
    'GI certified Pashmina shawl',
    'authentic Kashmiri pashmina',
    'pure cashmere wrap',
    'artisan hand embroidery Srinagar',
    'luxury wool pheran',
    'Kashmir crafts export',
    'GI tag Changthangi goat wool',
    'Kashmir artisan couture',
    'handwoven pashmina wholesale',
  ],
  openGraph: {
    title: 'Nuty Tales Crafts — Crafted by Tradition. Chosen for a Lifetime.',
    description:
      'Evidence-backed GI-certified Changthangi Pashmina, fine wool pherans, and bespoke Himalayan heritage crafts. Crafted by tradition, chosen for a lifetime.',
    url: 'https://crafts.nutytales.com',
    siteName: 'Nuty Tales Crafts',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuty Tales Crafts — Crafted by Tradition. Chosen for a Lifetime.',
    description: 'GI certified Changthangi Pashmina, pherans, and master artisan weaves.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CraftsShell>{children}</CraftsShell>
}
