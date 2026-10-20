import type { Metadata } from 'next'
import { REGIONAL_CONFIGS } from '@/lib/regional-data'
import RegionalShell from '@/components/regional/RegionalShell'

const config = REGIONAL_CONFIGS.us

export const metadata: Metadata = {
  metadataBase: new URL(config.canonicalDomain),
  title: {
    default: `${config.brandName} — ${config.offeringTitle}`,
    template: `%s | ${config.brandName}`,
  },
  description: config.description,
  keywords: [
    'Nuty Tales Americas',
    'america.nutytales.com',
    'dry fruits delivery usa',
    'buy kashmiri walnuts usa',
    'mithila makhana canada',
    'pampore saffron new york',
    'california almonds gourmet orchard',
    'us fda compliant dry fruit supplier',
    'fox nuts distribution north america',
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

export default function AmericaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RegionalShell config={config}>{children}</RegionalShell>
}
