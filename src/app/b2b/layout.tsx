import type { Metadata } from 'next'
import B2BShell from '@/components/b2b/B2BShell'

export const metadata: Metadata = {
  metadataBase: new URL('https://business.nutytales.com'),
  title: {
    default: 'Nuty Tales Business — Global B2B Dry Fruits & Industrial Sourcing Engine',
    template: '%s | Nuty Tales Business',
  },
  description:
    'Direct farm-to-enterprise procurement portal for commercial bakeries, FMCG brands, HORECA, and institutional buyers. NABL-tested, FSSAI-certified bulk almonds, walnuts, cashews, makhana & saffron with wholesale tier pricing and multi-point logistics.',
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
    title: 'Nuty Tales Business — Global B2B Dry Fruits Wholesale Engine',
    description:
      'Direct farm-to-enterprise procurement portal for commercial food production, bakery chains, and institutional dry fruit buyers.',
    url: 'https://business.nutytales.com',
    siteName: 'Nuty Tales Business',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuty Tales Business — Global B2B Dry Fruits Procurement',
    description: 'Direct farm-to-enterprise bulk almonds, walnuts, cashews, makhana & saffron.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <B2BShell>{children}</B2BShell>
}
