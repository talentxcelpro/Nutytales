import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Women’s Handcrafted Heritage & Couture | Nuty Tales Crafts',
  description:
    'Exquisite Kashmiri Tilla pherans, pure Pashmina wraps, Banarasi silk kurtas, and artisanal couture for women.',
  alternates: {
    canonical: 'https://crafts.nutytales.com/women',
  },
}

export default function WomenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
