import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kashmiri Pherans — Royal Velvet & Wool Pherans | Nuty Tales Crafts',
  description:
    'Handcrafted traditional and contemporary Kashmiri pherans with royal Tilla embroidery and fine Aari work for men, women, and kids.',
  alternates: {
    canonical: 'https://crafts.nutytales.com/pherans',
  },
  openGraph: {
    title: 'Kashmiri Pherans | Nuty Tales Crafts',
    description: 'Handcrafted royal Tilla and Aari embroidered Kashmiri pherans.',
    url: 'https://crafts.nutytales.com/pherans',
    siteName: 'Nuty Tales Crafts',
  },
}

export default function PheransLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
