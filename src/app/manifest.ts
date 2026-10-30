import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nuty Tales — Premium Gourmet Harvest & Crafts',
    short_name: 'Nuty Tales',
    description:
      'Buy certified single-origin Kashmiri Kagzi walnuts, Pampore Mongra saffron, high-oil Mamra almonds, and Mithila jumbo makhana.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F7F2E8',
    theme_color: '#17233B',
    icons: [
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
