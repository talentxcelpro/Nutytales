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
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#176B68] text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <span>🏭</span> B2B INGREDIENT &amp; PRODUCTION PARTNER
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Nutty Tales Business Supply
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              We supply hotels, sweet manufacturers, commercial bakeries, and food brands across India. Mechanical slices, dices, slivers, and whole grades with FSSAI Central compliance and scheduled monthly freight.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/business-supply"
                className="px-6 py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Explore Business Supply →
              </Link>
              <Link
                href="/business-supply#production-si"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-colors"
              >
                Buy for Production (Ask SI)
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {B2B_TARGETS.map((t) => (
              <Link
                key={t.name}
                href="/business-supply"
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all space-y-2 group"
              >
                <span className="text-2xl block">{t.icon}</span>
                <h4 className="font-serif font-bold text-sm text-white group-hover:text-[#C9A45C] transition-colors leading-tight">
                  {t.name}
                </h4>
                <p className="text-[11px] text-stone-400 font-light leading-snug">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
