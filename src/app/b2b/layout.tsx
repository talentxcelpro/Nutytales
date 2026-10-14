import type { Metadata } from 'next'
import B2BRoutingShell from '@/components/b2b/B2BRoutingShell'

export const metadata: Metadata = {
  metadataBase: new URL('https://business.nutytales.com'),
  title: {
    default: 'Nuty Tales Business — Wholesale Procurement, Without the Guesswork',
    template: '%s | Nuty Tales Business',
  },
  description:
    'Wholesale B2B procurement platform. Compare verified supplier quotes, calculate landed costs, inspect NABL quality lot passports, and arrange reliable delivery across India and globally.',
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
    'dry fruits wholesale India',
    'B2B dry fruits procurement',
    'bulk almonds supplier',
    'Kashmiri walnuts bulk',
    'commercial bakery nuts supply',
    'NABL certified dry fruits',
    'industrial dry fruits supply',
    'bulk saffron Kashmir',
    'business dry fruits supply',
    'almonds container procurement',
  ],
  openGraph: {
    title: 'Nuty Tales Business — Source Better. Supply Smarter. Grow Together.',
    description:
      'Direct farm-to-enterprise procurement portal for commercial food production, bakery chains, and institutional dry fruit buyers. Source better, supply smarter, grow together.',
    url: 'https://business.nutytales.com',
    siteName: 'Nuty Tales Business',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuty Tales Business — Source Better. Supply Smarter. Grow Together.',
    description: 'Direct farm-to-enterprise bulk almonds, walnuts, cashews, makhana & saffron.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <B2BRoutingShell>{children}</B2BRoutingShell>
}
