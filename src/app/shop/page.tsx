import type { Metadata } from 'next'
import { PRODUCTS } from '@/lib/products-data'
import ShopCatalogClient from '@/components/shop/ShopCatalogClient'

export const metadata: Metadata = {
  title: 'Shop Premium Dry Fruits Online | Retail & Wholesale | Nuty Tales',
  description:
    'Browse our full dry fruits catalog. California Almonds, Kashmiri Mamra Badam, W240 Cashews, Kashmiri Walnuts, Saffron, Turkish Anjeer & Bihar Makhana. Fast express dispatch across India. FSSAI & GI certified.',
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

interface ShopPageProps {
  searchParams: Promise<{ category?: string; origin?: string; sort?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, origin, sort } = await searchParams

  return (
    <ShopCatalogClient
      products={PRODUCTS}
      initialCategory={category}
      initialOrigin={origin}
      initialSort={sort}
    />
  )
}
