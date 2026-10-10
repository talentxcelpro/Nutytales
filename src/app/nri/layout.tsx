import type { Metadata } from 'next'
import NriNavbar from '@/components/nri/NriNavbar'
import NriFooter from '@/components/nri/NriFooter'

export const metadata: Metadata = {
  metadataBase: new URL('https://nri.nutytales.com'),
  title: {
    default: 'Nuty Tales NRI — India, handled. From anywhere in the world.',
    template: '%s | Nuty Tales NRI',
  },
  description:
    'Dedicated on-the-ground support in India for Non-Resident Indians and overseas families. Verified senior parent care visits, GPS-audited property inspections, Power of Attorney legal execution, and ICAI tax coordination.',
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
    'Nuty Tales NRI',
    'NRI services India',
    'property management Srinagar',
    'parent care Delhi',
    'Power of attorney India NRI',
    'Form 15CA 15CB CA certification',
    'Kashmir wedding planning overseas',
    'NRI property inspection report',
    'elder care companion India',
  ],
  authors: [{ name: 'Nuty Tales NRI', url: 'https://nri.nutytales.com' }],
  creator: 'Nuty Tales',
  publisher: 'Nuty Tales',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://nri.nutytales.com',
    siteName: 'Nuty Tales NRI',
    title: 'Nuty Tales NRI — India, handled. From anywhere in the world.',
    description:
      'Dedicated on-the-ground support in India for Non-Resident Indians and overseas families. Real transactional execution for family, property, documents, and ancestral stays.',
    images: [
      {
        url: 'https://nri.nutytales.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Nuty Tales NRI — India, handled. From anywhere in the world.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nutytales',
    creator: '@nutytales',
    title: 'Nuty Tales NRI — India, handled. From anywhere in the world.',
    description: 'Your trusted team in India, while you live anywhere in the world.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function NriLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#191919] flex flex-col font-sans selection:bg-[#C9A45C]/25 selection:text-[#191919]">
      <NriNavbar />
      <main className="flex-1">{children}</main>
      <NriFooter />
    </div>
  )
}
