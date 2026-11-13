import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Men’s Handcrafted Heritage & Couture | Nuty Tales Crafts',
  description:
    'Pure wool men’s pherans, Pashmina stoles, raw silk kurtas, and handcrafted royal sherwanis.',
  alternates: {
    canonical: 'https://nutytales.com/crafts/men',
  },
}

export default function MenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
