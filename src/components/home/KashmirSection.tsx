import Link from 'next/link'
import Image from 'next/image'

export default function KashmirSection() {
  return (
    <section className="py-24 bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-semibold block">
            The Valley Heritage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B]">
            From Kashmir, with warmth.
          </h2>
          <p className="text-sm text-[#17233B]/70 font-normal">
            Stay. Explore. Take a little of the valley home.
          </p>
        </div>

        {/* 3 Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. Stay */}
          <div className="bg-white rounded-xl p-8 border border-[#17233B]/10 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#176B68] font-bold block">
                01 / Retreat
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                Stay
              </h3>
              <p className="text-xs text-[#17233B]/70 leading-relaxed font-normal">
                Our private Srinagar orchard estate surrounded by snow-capped Pir Panjal peaks, cedar wood bukharis, and fragrant apple blossoms.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <Link
                href="/stays/kashmir"
                className="text-xs uppercase tracking-wider font-semibold text-[#176B68] hover:text-[#214B39] inline-flex items-center gap-1"
              >
                <span>View Kashmir Stay</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* 2. Explore */}
          <div className="bg-white rounded-xl p-8 border border-[#17233B]/10 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#176B68] font-bold block">
                02 / Journeys
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                Explore
              </h3>
              <p className="text-xs text-[#17233B]/70 leading-relaxed font-normal">
                Curated Valley expeditions with authentic local hosts: sunset Dal Lake shikaras, Gulmarg alpine meadows, and Pampore saffron walks.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <Link
                href="/travel/kashmir"
                className="text-xs uppercase tracking-wider font-semibold text-[#176B68] hover:text-[#214B39] inline-flex items-center gap-1"
              >
                <span>Curated Tours</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* 3. Take Home */}
          <div className="bg-white rounded-xl p-8 border border-[#17233B]/10 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#176B68] font-bold block">
                03 / Harvest
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                Take Home
              </h3>
              <p className="text-xs text-[#17233B]/70 leading-relaxed font-normal">
                Kashmiri snow walnuts, rare Mamra badam, golden raisins, and pure Mongra saffron — packed fresh for your kitchen and gifts.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <Link
                href="/shop?category=walnuts"
                className="text-xs uppercase tracking-wider font-semibold text-[#176B68] hover:text-[#214B39] inline-flex items-center gap-1"
              >
                <span>Shop Valley Harvest</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div className="text-center pt-12">
          <Link
            href="/travel/kashmir"
            className="px-8 py-4 bg-[#17233B] hover:bg-[#176B68] text-white text-xs uppercase tracking-widest font-semibold rounded shadow-sm transition-colors inline-block"
          >
            Discover Kashmir with Nutty Tales
          </Link>
        </div>
      </div>
    </section>
  )
}
