import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Himalayan Winter Wear & Pure Woolens | Nuty Tales Crafts',
  description:
    'Authentic sub-zero thermal Pashmina, double-layer wool pherans, hand-knitted caps, and heirloom winter wraps.',
  alternates: {
    canonical: 'https://crafts.nutytales.com/winter-wear',
  },
}

export default function WinterWearLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
