import type { Metadata } from 'next'
import { REGIONAL_CONFIGS } from '@/lib/regional-data'
import RegionalShell from '@/components/regional/RegionalShell'

const config = REGIONAL_CONFIGS.me

export const metadata: Metadata = {
  metadataBase: new URL(config.canonicalDomain),
  title: {
    default: `${config.brandName} — ${config.offeringTitle}`,
    template: `%s | ${config.brandName}`,
  },
  description: config.description,
  keywords: [
    'Nuty Tales Middle East',
    'middleeast.nutytales.com',
    'dry fruits delivery dubai',
    'kashmiri mamra badam riyadh',
    'pampore saffron uae',
    'gcc diaspora luxury hampers',
    'eid dry fruit hampers',
    'ramadan corporate gift boxes gcc',
    'dates and nuts delivery saudi arabia',
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

export default function MiddleEastLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RegionalShell config={config}>{children}</RegionalShell>
}
