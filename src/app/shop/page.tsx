import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PRODUCTS } from '@/lib/products-data'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import ShopProductCard from '@/components/shop/ShopProductCard'

export const metadata: Metadata = {
  title: 'Shop Premium Dry Fruits Online | Retail & Wholesale | Nutty Tales',
  description:
    'Browse our full dry fruits catalog. California Almonds, W240 Cashews, Kashmiri Walnuts, Afghan Raisins, Anjeer & Bihar Makhana. Fast dispatch across India. FSSAI certified.',
  keywords: [
    'buy dry fruits online',
    'shop almonds cashews online',
    'dry fruits wholesale shop',
    'kashmir walnuts online',
    'bihar makhana store',
  ],
}

interface ShopPageProps {
  searchParams: Promise<{ category?: string; origin?: string; sort?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, origin, sort } = await searchParams

  let filtered = [...PRODUCTS]

  if (category) {
    filtered = filtered.filter(
      (p) => p.categorySlug.toLowerCase() === category.toLowerCase(),
    )
  }

  if (origin) {
    filtered = filtered.filter((p) =>
      p.origin.toLowerCase().includes(origin.toLowerCase()),
    )
  }

  if (sort === 'price-low') {
    filtered.sort((a, b) => a.retailPrice - b.retailPrice)
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => b.retailPrice - a.retailPrice)
  } else {
    // Featured first
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-stone-200 pb-8 mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4870A]">
            Complete Catalogue
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2B1F] font-serif">
            Shop Premium Dry Fruits
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl">
            Sourced with care from California, Kashmir, Afghanistan, Iran, and Bihar. Retail pouches from 250g to bulk sacks up to 50kg+.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <Link
            href="/shop"
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              !category
                ? 'bg-[#3D2B1F] text-white'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-[#D4870A]'
            }`}
          >
            All ({PRODUCTS.length})
          </Link>
          {PRODUCT_CATEGORIES.map((cat) => {
            const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length
            return (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  category === cat.slug
                    ? 'bg-[#D4870A] text-white'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-[#D4870A]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {count > 0 && <span className="opacity-60 text-[10px]">({count})</span>}
              </Link>
            )
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((prod) => (
            <ShopProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  )
}
