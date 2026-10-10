import type { Metadata } from 'next'
import StaysShell from '@/components/stays/StaysShell'

export const metadata: Metadata = {
  metadataBase: new URL('https://stays.nutytales.com'),
  title: {
    default: 'Nuty Tales Stays — Find Your Place to Stay. Make It Part of the Journey.',
    template: '%s | Nuty Tales Stays',
  },
  description:
    'Find vetted luxury private residences, alpine chalets, walnut orchard estates, and executive corporate suites across Kashmir, Delhi-NCR, and Patna. Where you stay is an unforgettable chapter of where you travel.',
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
    'luxury private residences Kashmir',
    'private villa Srinagar',
    'walnut orchard retreat Harwan',
    'luxury houseboat Dal Lake',
    'exclusive estate buyout Kashmir',
    'Gulmarg alpine ski chalet',
    'corporate offsite estate buyout Delhi NCR',
    'Patna heritage villa stay',
    'executive residences Noida',
  ],
  openGraph: {
    title: 'Nuty Tales Stays — Find Your Place to Stay. Make It Part of the Journey.',
    description:
      'Find vetted luxury private residences, alpine chalets, walnut orchard estates, and executive corporate suites across Kashmir, Delhi-NCR, and Patna.',
    url: 'https://stays.nutytales.com',
    siteName: 'Nuty Tales Stays',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuty Tales Stays — Find Your Place to Stay. Make It Part of the Journey.',
    description: 'Private walnut orchard villas, alpine chalets, royal houseboats, and executive corporate suites.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StaysShell>{children}</StaysShell>
}
