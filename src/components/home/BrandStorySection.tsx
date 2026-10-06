import Link from 'next/link'
import { FSSAI_NUMBER } from '@/lib/constants'

export default function BrandStorySection() {
  return (
    <section className="py-24 bg-white border-b border-[#17233B]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-semibold block">
          Our Story &amp; Philosophy
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B] tracking-tight leading-tight">
          Rooted in the soil. <br />
          Refined for the modern home.
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-[#17233B]/80 leading-relaxed font-normal text-left sm:text-center max-w-2xl mx-auto">
          <p>
            Nutty Tales was founded on an uncompromising principle: transparency. In an industry crowded with inflated claims and mixed grades, we provide clearly documented origins, true kernel sizes, and honest pricing.
          </p>
          <p>
            From snow-fed walnut groves in Kashmir and sun-drenched almond orchards in California, to the traditional Makhana ponds of Mithila and the spice bazaars of Khari Baoli, we trace every harvest. Every batch is graded, packed in airtight food-safe containers under FSSAI Lic. {FSSAI_NUMBER}, and shipped with pride across India.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-8 text-xs uppercase tracking-widest text-[#704B32] font-semibold">
          <span>Srinagar • Noida • Patna</span>
          <span className="text-stone-300">•</span>
          <span>100% Traceable</span>
          <span className="text-stone-300">•</span>
          <span>FSSAI Certified</span>
        </div>
      </div>
    </section>
  )
}
