import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Handcrafted Heritage Accessories | Nuty Tales Crafts',
  description:
    'Artisan-crafted Cashmere scarves, hand-embroidered clutches, wool wraps, and heirloom accessories.',
  alternates: {
    canonical: 'https://crafts.nutytales.com/accessories',
  },
}

export default function AccessoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
