import type { Metadata } from 'next'
import { REGIONAL_CONFIGS } from '@/lib/regional-data'
import RegionalShell from '@/components/regional/RegionalShell'

const config = REGIONAL_CONFIGS.eu

export const metadata: Metadata = {
  metadataBase: new URL(config.canonicalDomain),
  title: {
    default: `${config.brandName} — ${config.offeringTitle}`,
    template: `%s | ${config.brandName}`,
  },
  description: config.description,
  keywords: [
    'Nuty Tales Europe',
    'europe.nutytales.com',
    'organic dry fruits uk',
    'kashmiri walnuts london',
    'pure mongra saffron europe',
    'uk organic heritage dry fruits',
    'raw acacia honey germany',
    'halman apricots france',
    'fsa compliant dry fruit delivery uk',
  ],
  openGraph: {
    title: `${config.brandName} — ${config.offeringTitle}`,
    description: config.description,
    url: config.canonicalDomain,
    siteName: config.brandName,
    locale: config.defaultLocale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.brandName} — ${config.offeringTitle}`,
    description: config.description,
  },
}

export default function EuropeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RegionalShell config={config}>{children}</RegionalShell>
}
