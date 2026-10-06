import Link from 'next/link'

const GIFT_STORIES = [
  { label: 'EVERYDAY', desc: 'Daily wholesome pantry snacking & wellness', href: '/shop' },
  { label: 'WEDDINGS', desc: 'Bespoke trousseau, favours & couple monograms', href: '/weddings', badge: 'New' },
  { label: 'DIWALI', desc: 'Prestige corporate hampers & employee gifting', href: '/corporate-gifting' },
  { label: 'CORPORATE', desc: 'Custom brand logo foil embossing & GST billing', href: '/corporate-gifting' },
  { label: 'KASHMIR', desc: 'GI Mongra saffron, Kagzi walnuts & artisan crafts', href: '/crafts' },
  { label: 'CELEBRATIONS', desc: 'Festive family trays & sweet shop ingredients', href: '/gifting' },
]

export default function GiftsForEveryStory() {
  return (
    <section className="bg-white border-b border-[#17233B]/10 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#176B68]" />
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#704B32]">
              Gifts for Every Story
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 flex-1">
            {GIFT_STORIES.map((story) => (
              <Link
                key={story.label}
                href={story.href}
                className="group p-2.5 rounded-xl hover:bg-[#FAF6EE] border border-transparent hover:border-[#C9A45C]/30 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#17233B] group-hover:text-[#176B68] transition-colors">
                    {story.label}
                  </span>
                  {story.badge && (
                    <span className="bg-[#C9A45C] text-[#17233B] text-[8px] font-extrabold px-1 rounded uppercase">
                      {story.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-stone-500 font-light truncate mt-0.5">
                  {story.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
