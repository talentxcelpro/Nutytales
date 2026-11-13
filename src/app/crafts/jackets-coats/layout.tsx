import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Handcrafted Wool Jackets & Heritage Coats | Nuty Tales Crafts',
  description:
    'Tailored fine wool jackets, velvet waistcoats, and embroidered long coats handcrafted by master Kashmiri artisans.',
  alternates: {
    canonical: 'https://nutytales.com/crafts/jackets-coats',
  },
}

export default function JacketsCoatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
