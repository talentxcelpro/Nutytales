'use client'

import Link from 'next/link'
import Image from 'next/image'

export interface ProductSummary {
  id: string
  name: string
  slug: string
  category: string
  origin: string
  retailPrice: number
  wholesalePrice?: number
  image?: string
}

const COLLECTION: ProductSummary[] = [
  {
    id: 'alm-001',
    name: 'California Almonds Premium',
    slug: 'california-almonds-premium',
    category: 'Almonds',
    origin: 'California, USA',
    retailPrice: 980,
    wholesalePrice: 890,
    image: '/images/almonds-pouch-250g.png',
  },
  {
    id: 'csw-001',
    name: 'W240 Premium Cashews',
    slug: 'w240-premium-cashews',
    category: 'Cashews',
    origin: 'Kerala & Goa',
    retailPrice: 1100,
    wholesalePrice: 980,
    image: '/images/cashews-pouch-250g.jpg',
  },
  {
    id: 'wln-001',
    name: 'Kashmiri Snow Walnuts',
    slug: 'kashmiri-walnuts-kernels',
    category: 'Walnuts',
    origin: 'Srinagar, Kashmir',
    retailPrice: 1350,
    wholesalePrice: 1200,
  },
  {
    id: 'mkh-001',
    name: 'Phool Makhana (Jumbo Fox Nuts)',
    slug: 'phool-makhana-grade-a',
    category: 'Makhana',
    origin: 'Mithila, Bihar',
    retailPrice: 920,
    wholesalePrice: 820,
  },
  {
    id: 'pst-001',
    name: 'Iranian Pistachios (Akbari)',
    slug: 'iranian-pistachios-roasted',
    category: 'Pistachios',
    origin: 'Rafsanjan, Iran',
    retailPrice: 1450,
    wholesalePrice: 1320,
  },
  {
    id: 'ras-001',
    name: 'Afghan Green Seedless Raisins',
    slug: 'afghan-green-seedless-raisins',
    category: 'Raisins',
    origin: 'Kandahar, Afghanistan',
    retailPrice: 580,
    wholesalePrice: 490,
  },
]

export default function PopularProducts() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-[#704B32] font-semibold">
          Curated Harvest
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          Our Collection
        </h2>
        <p className="text-xs sm:text-sm text-[#17233B]/70 font-normal">
          Naturally good. Beautifully packed in airtight pouches and vacuum-sealed boxes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {COLLECTION.map((item) => (
          <Link
            key={item.id}
            href={`/shop/${item.slug}`}
            className="group bg-white rounded-xl overflow-hidden border border-[#17233B]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-square bg-[#F7F2E8]/60 p-8 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-300">
                    <span className="text-6xl">🥜</span>
                    <span className="text-[10px] mt-2 uppercase font-bold tracking-widest text-[#704B32]">
                      {item.category}
                    </span>
                  </div>
                )}

                <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded text-[#176B68] border border-[#176B68]/20">
                  {item.origin}
                </span>
              </div>

              <div className="p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#704B32] block">
                  {item.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#17233B] group-hover:text-[#176B68] transition-colors leading-snug">
                  {item.name}
                </h3>

                <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-bold text-[#17233B]">
                      ₹{item.retailPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-500 font-normal"> / kg</span>
                  </div>
                  {item.wholesalePrice && (
                    <span className="text-[11px] text-[#176B68] font-semibold">
                      Wholesale from ₹{item.wholesalePrice}/kg
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <span className="w-full py-2.5 block text-center border border-[#17233B]/20 group-hover:border-[#176B68] group-hover:bg-[#176B68] group-hover:text-white text-[#17233B] text-[11px] uppercase tracking-wider font-semibold rounded transition-colors">
                View Pack Sizes &amp; Wholesale
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#17233B] hover:text-[#176B68] border-b border-[#17233B] pb-1 transition-colors"
        >
          <span>View All 25 Products</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}
