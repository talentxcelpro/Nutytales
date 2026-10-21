import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Try With SI — Virtual AI 3D Garment Fitting | Nuty Tales Crafts',
  description:
    'Experience virtual 3D draping and personalized sizing recommendations for authentic Kashmiri pherans, shawls, and couture.',
  alternates: {
    canonical: 'https://crafts.nutytales.com/try-with-si',
  },
}

export default function TryWithSILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
