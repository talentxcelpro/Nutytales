import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kids Heritage Handloom & Woolens | Nuty Tales Crafts',
  description:
    'Ultra-soft natural wool pherans, organic cotton sets, and handcrafted heirlooms designed gently for children.',
  alternates: {
    canonical: 'https://crafts.nutytales.com/kids',
  },
}

export default function KidsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
