import type { Metadata } from 'next'
import GiftingShell from '@/components/gifting/GiftingShell'

export const metadata: Metadata = {
  metadataBase: new URL('https://gifting.nutytales.com'),
  title: {
    default: 'Nuty Tales Gifting — Make Every Gift Mean More',
    template: '%s | Nuty Tales Gifting',
  },
  description:
    'Global corporate gifting and festive hamper solutions. Enterprise multi-recipient desk, custom branding, and scheduled dispatch across India and worldwide. Make every gift mean more.',
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
    'corporate gifting dry fruits',
    'festive hampers',
    'luxury dry fruit gift boxes',
    'employee festive gifts',
    'custom branded corporate hampers',
    'multi address gift delivery India',
    'executive gift boxes India',
    'walnut wood gift boxes',
    'corporate gifting concierge',
  ],
  openGraph: {
    title: 'Nuty Tales Gifting — Make Every Gift Mean More',
    description:
      'Curate luxury dry fruit gift boxes with enterprise multi-recipient delivery, laser branding, and scheduled dispatch. Make every gift mean more.',
    url: 'https://gifting.nutytales.com',
    siteName: 'Nuty Tales Gifting',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuty Tales Gifting — Make Every Gift Mean More',
    description: 'Enterprise multi-recipient desk and bespoke handcrafted gifting.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GiftingShell>{children}</GiftingShell>
}
