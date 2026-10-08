import type { Metadata } from 'next'
import StaysShell from '@/components/stays/StaysShell'

export const metadata: Metadata = {
  metadataBase: new URL('https://stays.nutytales.com'),
  title: {
    default: 'Nuty Tales Stays — Private Residences, Orchard Estates & Executive Suites',
    template: '%s | Nuty Tales Stays',
  },
  description:
    'Vetted luxury private estate collection and executive hospitality across Kashmir, Delhi-NCR, Patna, and global gateways. Harwan walnut orchard villas, alpine ski chalets, royal cedar houseboats, and executive corporate boardroom suites with dedicated master chefs and 4x4 convoys.',
  alternates: {
    canonical: 'https://stays.nutytales.com',
  },
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
    title: 'Nuty Tales Stays — Private Residences, Orchard Estates & Executive Living',
    description:
      'Curated private estate collection across Kashmir, Delhi-NCR, and Patna. Private orchard villa buyouts, alpine chalets, cedar houseboats, and executive boardroom residences.',
    url: 'https://stays.nutytales.com',
    siteName: 'Nuty Tales Stays',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuty Tales Stays — Private Residences & Estate Collection',
    description: 'Private walnut orchard villas, alpine chalets, royal houseboats, and executive corporate suites.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StaysShell>{children}</StaysShell>
}
