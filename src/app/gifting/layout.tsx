import type { Metadata } from 'next'
import GiftingShell from '@/components/gifting/GiftingShell'

export const metadata: Metadata = {
  metadataBase: new URL('https://gifting.nutytales.com'),
  title: {
    default: 'Nuty Tales Gifting — Bespoke Corporate & Festive Luxury Dry Fruit Hampers',
    template: '%s | Nuty Tales Gifting',
  },
  description:
    'Global corporate gifting and festive hamper solutions. Enterprise multi-recipient desk, custom laser-etched branding, handcrafted Kashmiri walnut wood boxes, GST invoicing, and PAN-India/international scheduled dispatch.',
  alternates: {
    canonical: 'https://gifting.nutytales.com',
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
    title: 'Nuty Tales Gifting — Bespoke Corporate & Festive Hampers',
    description:
      'Curate luxury dry fruit gift boxes with enterprise multi-recipient delivery, laser branding, and scheduled dispatch.',
    url: 'https://gifting.nutytales.com',
    siteName: 'Nuty Tales Gifting',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuty Tales Gifting — Corporate & Luxury Hampers',
    description: 'Enterprise multi-recipient desk and bespoke handcrafted gifting.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GiftingShell>{children}</GiftingShell>
}
