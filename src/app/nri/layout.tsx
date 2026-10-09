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
    'The premier global India-management platform for NRIs, OCI holders, and overseas families. Property management in Srinagar & Delhi, senior parent care visits, Power of Attorney legal execution, and ICAI tax coordination.',
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
    title: 'Nuty Tales NRI — Global India-Management Platform',
    description:
      'Your trusted team in India, while you live anywhere in the world. Real transactional execution for family, property, documents, and travel.',
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
    title: 'Nuty Tales NRI — Global India-Management Platform',
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
