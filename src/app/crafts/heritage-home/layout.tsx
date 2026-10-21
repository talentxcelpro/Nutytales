import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Heritage Home & Living — Hand-Carved Walnut Wood & Décor | Nuty Tales Crafts',
  description:
    'Exquisite single-origin walnut wood carved bowls, trays, papier-mâché artifacts, and crewel chain-stitch cushions for refined living.',
  alternates: {
    canonical: 'https://crafts.nutytales.com/heritage-home',
  },
}

export default function HeritageHomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
