import type { Metadata } from 'next'
import WeddingsShell from '@/components/weddings/WeddingsShell'

export const metadata: Metadata = {
  metadataBase: new URL('https://weddings.nutytales.com'),
  title: {
    default: 'Nuty Tales Weddings — Bring Every Wedding Detail Together Beautifully',
    template: '%s | Nuty Tales Weddings',
  },
  description:
    'Curated wedding favors, royal trousseau walnut gift hampers, and destination wedding execution. Bring every wedding detail together beautifully with intelligent planning and artisan curation.',
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
    'luxury wedding hampers',
    'Kashmir destination wedding favors',
    'royal trousseau gift boxes',
    'wedding dry fruit hampers',
    'bespoke wedding favors India',
    'destination wedding planner Srinagar',
    'wedding budget workspace',
    'monogram trousseau boxes',
  ],
  openGraph: {
    title: 'Nuty Tales Weddings — Bring Every Wedding Detail Together Beautifully',
    description:
      'Curated wedding favors, royal trousseau walnut gift hampers, and destination wedding execution. Bring every wedding detail together beautifully.',
    url: 'https://weddings.nutytales.com',
    siteName: 'Nuty Tales Weddings',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuty Tales Weddings — Bring Every Wedding Detail Together Beautifully',
    description: 'Royal trousseau hampers, destination weddings, and seamless execution.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WeddingsShell>{children}</WeddingsShell>
}
