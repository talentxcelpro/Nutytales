import Link from 'next/link'
import Image from 'next/image'

export default function CorporateEditorialSection() {
  return (
    <section className="bg-[#17233B] text-white py-24 border-y border-[#C9A45C]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-semibold block">
              Diwali &amp; Corporate Collections
            </span>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]">
                Gifting, <br />
                made memorable.
              </h2>
              <p className="text-sm sm:text-base text-stone-300 max-w-lg leading-relaxed font-normal">
                Curated dry-fruit hampers for clients, teams, and people who matter. Handcrafted rigid gift boxes and carved wooden chests, bespoke branded with your company insignia.
              </p>
            </div>

            {/* Micro Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs text-stone-300">
              <div className="space-y-1">
                <span className="block text-stone-400 uppercase tracking-widest text-[10px]">
                  Tariff
                </span>
                <span className="font-bold text-white text-sm">From ₹799 / hamper</span>
              </div>
              <div className="space-y-1">
                <span className="block text-stone-400 uppercase tracking-widest text-[10px]">
                  Branding
                </span>
                <span className="font-bold text-white text-sm">Custom Box &amp; Card</span>
              </div>
              <div className="space-y-1">
                <span className="block text-stone-400 uppercase tracking-widest text-[10px]">
                  Logistics
                </span>
                <span className="font-bold text-white text-sm">Pan-India Multi-Drop</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/corporate-gifting"
                className="px-7 py-3.5 bg-[#C9A45C] hover:bg-[#b08b47] text-[#17233B] font-bold text-xs uppercase tracking-widest transition-colors shadow-sm"
              >
                View Corporate Gifting
              </Link>
              <Link
                href="/corporate-gifting#request-quote"
                className="px-7 py-3.5 border border-white/40 hover:border-white text-white font-semibold text-xs uppercase tracking-widest transition-colors"
              >
                Request Corporate Quote
              </Link>
            </div>
          </div>

          {/* Right Luxury Hamper Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/luxury-hamper-jars.png"
                  alt="Nuty Tales Luxury Corporate Gift Hamper with Glass Jars"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-center">
                <span className="text-[11px] text-[#C9A45C] uppercase tracking-widest font-semibold block">
                  Artisanal Jars in Deep Emerald Rigid Box
                </span>
                <span className="text-xs text-stone-200">
                  California Almonds • W240 Cashews • Afghan Figs • Kashmiri Walnuts • Pistachios
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
