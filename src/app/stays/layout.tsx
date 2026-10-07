import type { Metadata } from 'next'
import StaysShell from '@/components/stays/StaysShell'

export const metadata: Metadata = {
  metadataBase: new URL('https://stays.nutytales.com'),
  title: {
    default: 'Nutty Tales Stays — Exclusive Kashmiri Walnut Orchard Estates & Boutique Stays',
    template: '%s | Nutty Tales Stays',
  },
  description:
    'Curated heritage stays in Kashmir. Private Harwan walnut orchard villa buyouts, Dal Lake cedar houseboats, curated royal Wazwan dining, and personal mountain concierges.',
  alternates: {
    canonical: 'https://stays.nutytales.com',
  },
  keywords: [
    'luxury stays Kashmir',
    'private villa Srinagar',
    'walnut orchard retreat Harwan',
    'luxury houseboat Dal Lake',
    'exclusive estate buyout Kashmir',
    'boutique stays Gulmarg Pahalgam',
    'heritage stays Kashmir',
    'Kashmir corporate retreat villa',
  ],
  openGraph: {
    title: 'Nutty Tales Stays — Luxury Kashmiri Orchard Estates & Heritage Stays',
    description:
      'Curated heritage stays in Kashmir. Private orchard villa buyouts, Dal Lake houseboats, and bespoke concierge.',
    url: 'https://stays.nutytales.com',
    siteName: 'Nutty Tales Stays',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutty Tales Stays — Kashmiri Orchard Estates',
    description: 'Private orchard villa buyouts, Dal Lake cedar houseboats, and mountain hospitality.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StaysShell>{children}</StaysShell>
}
