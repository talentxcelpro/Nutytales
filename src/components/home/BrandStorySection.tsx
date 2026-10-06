import Image from 'next/image'
import Link from 'next/link'
import { FSSAI_NUMBER } from '@/lib/constants'

export default function BrandStorySection() {
  return (
    <section className="py-24 bg-white border-b border-[#17233B]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Editorial Campaign Poster */}
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-3xl overflow-hidden border border-stone-200 shadow-xl group">
            <Image
              src="/images/campaign-travel-further.jpg"
              alt="Good Things Travel Further — Nutty Tales Master Campaign"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                🌐 From Our Lands to Your Lives
              </span>
              <p className="text-xs text-[#17233B] font-serif italic">
                Taste · Gift · Wear · Stay · Explore
              </p>
            </div>
          </div>

          {/* Brand Philosophy Copy */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-semibold block mb-2">
                Our Story &amp; Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B] tracking-tight leading-tight">
                Rooted in the soil. <br />
                Refined for the modern home.
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#17233B]/80 leading-relaxed font-normal">
              <p>
                Nutty Tales was founded on an uncompromising principle: transparency. In an industry crowded with inflated claims and mixed grades, we provide clearly documented origins, true kernel sizes, and honest pricing.
              </p>
              <p>
                From snow-fed walnut groves in Kashmir and sun-drenched almond orchards in California, to the traditional Makhana ponds of Mithila and the spice bazaars of Khari Baoli, we trace every harvest. Every batch is graded, packed in airtight food-safe containers under FSSAI Lic. {FSSAI_NUMBER}, and shipped with pride across India.
              </p>
              <p>
                Today, that same commitment powers our boutique stays in Srinagar, Noida, and Patna, our bespoke wedding and corporate gifting suites, and our curated Kashmir crafts &amp; heritage vertical.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest text-[#704B32] font-semibold border-t border-stone-200">
              <span>Srinagar • Noida • Patna</span>
              <span className="text-stone-300">•</span>
              <span>100% Traceable</span>
              <span className="text-stone-300">•</span>
              <span>FSSAI Certified</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Shop Foods &amp; Dry Fruits →
              </Link>
              <Link
                href="/crafts"
                className="px-6 py-3 bg-[#FAF6EE] hover:bg-stone-100 text-[#17233B] rounded-xl text-xs font-semibold uppercase tracking-wider border border-stone-300 transition-colors"
              >
                Discover Crafts &amp; Heritage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
