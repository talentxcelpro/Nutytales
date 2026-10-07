import Image from 'next/image'
import Link from 'next/link'

const B2B_TARGETS = [
  { name: 'Hotels & Resorts', icon: '🏨', desc: 'Buffets, in-room amenities, banquets' },
  { name: 'Bakeries & Patisseries', icon: '🥐', desc: 'Sliced, slivered, flaked & nut flours' },
  { name: 'Sweet Shops (Mithai)', icon: '🍬', desc: 'Cashew splits (LWP), saffron, pista' },
  { name: 'Biscuit & Food Plants', icon: '🍪', desc: 'Diced nuts, recurring monthly tons' },
]

export default function BusinessSupplyBanner() {
  return (
    <section className="py-16 bg-[#10192A] text-white border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Editorial Campaign Poster */}
          <div className="lg:col-span-4 relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
            <Image
              src="/images/campaign-good-food-story.jpg"
              alt="Good Food Has A Story — Nuty Tales Business Supply"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10192A] via-transparent to-transparent opacity-40" />
            <div className="absolute bottom-3 left-3 right-3 bg-[#10192A]/90 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                🏭 Thoughtfully Sourced
              </span>
              <p className="text-[11px] text-stone-300 font-light leading-tight mt-0.5">
                Responsibly supplied across 15+ Indian commercial sectors.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#176B68] text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <span>🏭</span> B2B INGREDIENT &amp; PRODUCTION PARTNER
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Nuty Tales Business Supply
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              We supply hotels, sweet manufacturers, commercial bakeries, and food brands across India. Mechanical slices, dices, slivers, and whole grades with FSSAI Central compliance and scheduled monthly freight.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/business-supply"
                className="px-6 py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Explore Marketplace →
              </Link>
              <Link
                href="/founders"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-colors"
              >
                Founder Program 🚀
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {B2B_TARGETS.map((t) => (
              <Link
                key={t.name}
                href="/business-supply"
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-3 group"
              >
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <h4 className="font-serif font-bold text-xs text-white group-hover:text-[#C9A45C] transition-colors leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 font-light leading-snug">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
