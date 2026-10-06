import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PRODUCTS } from '@/lib/products-data'
import { PRODUCT_CATEGORIES } from '@/lib/constants'

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
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-stone-200 hover:border-[#D4870A] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-stone-100 overflow-hidden">
                  {prod.image ? (
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300">
                      <span className="text-5xl">🥜</span>
                      <span className="text-[10px] mt-1 uppercase font-bold tracking-widest text-stone-400">
                        {prod.category}
                      </span>
                    </div>
                  )}

                  {prod.isFeatured && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#C9A227] text-white text-[10px] font-bold tracking-wider shadow">
                      POPULAR
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#2D6A4F] text-[10px] font-bold border border-emerald-200">
                    {prod.origin.split(',')[0]}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4870A] block">
                    {prod.category} • {prod.grade}
                  </span>
                  <Link
                    href={`/shop/${prod.slug}`}
                    className="font-bold text-sm text-[#3D2B1F] group-hover:text-[#D4870A] transition-colors line-clamp-1 block"
                  >
                    {prod.name}
                  </Link>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {prod.shortDesc}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-extrabold text-[#3D2B1F]">
                        ₹{prod.retailPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-stone-500"> / kg</span>
                    </div>
                    {prod.b2bPricePerKg && (
                      <span className="text-[11px] font-bold text-[#2D6A4F] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Wholesale: ₹{prod.b2bPricePerKg}/kg
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Link
                  href={`/shop/${prod.slug}`}
                  className="py-2 text-center rounded-xl bg-stone-100 hover:bg-[#D4870A] hover:text-white text-stone-800 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  View Details
                </Link>
                <Link
                  href={`/bulk-quote?product=${encodeURIComponent(prod.name)}`}
                  className="py-2 text-center rounded-xl border border-[#2D6A4F] text-[#2D6A4F] hover:bg-emerald-50 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Bulk Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
