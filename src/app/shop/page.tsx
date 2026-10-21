import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PRODUCTS } from '@/lib/products-data'
import ShopCatalogClient from '@/components/shop/ShopCatalogClient'

export const metadata: Metadata = {
  title: 'Shop Premium Dry Fruits Online | Retail & Wholesale | Nuty Tales',
  description:
    'Browse our full dry fruits catalog. California Almonds, Kashmiri Mamra Badam, W240 Cashews, Kashmiri Walnuts, Saffron, Turkish Anjeer & Bihar Makhana. Fast express dispatch across India. FSSAI & GI certified.',
  alternates: {
    canonical: 'https://nutytales.com/shop',
  },
  keywords: [
    'buy dry fruits online',
    'shop almonds cashews online',
    'kashmir mamra badam online',
    'dry fruits wholesale shop',
    'kashmir walnuts online',
    'bihar makhana store',
    'pure kashmir saffron buy',
  ],
}

// Prerender to static edge cache with 1-hour revalidation
export const revalidate = 3600

export default function ShopPage() {
  return (
    <Suspense>
      <ShopCatalogClient products={PRODUCTS} />
    </Suspense>
  )
}
