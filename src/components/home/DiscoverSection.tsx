import Link from 'next/link'
import Image from 'next/image'

const PILLARS = [
  {
    title: 'Dry Fruits',
    subtitle: 'Everyday Indulgence',
    desc: 'Premium almonds, cashews, pistachios, walnuts, raisins, and Bihar makhana.',
    link: '/shop',
    linkText: 'Shop Collection →',
    image: '/images/crystal-gold-nut-bowls.jpg',
  },
  {
    title: 'Wholesale & B2B',
    subtitle: 'Commercial Supply',
    desc: 'Reliable dry-fruit sourcing with structured tiered pricing for businesses and retailers.',
    link: '/wholesale-dry-fruits',
    linkText: 'Buy Wholesale →',
    image: '/images/hero-banner.png',
  },
  {
    title: 'Corporate Gifting',
    subtitle: 'Diwali & Celebrations',
    desc: 'Handcrafted luxury hampers with custom logo embossing and pan-India doorstep delivery.',
    link: '/corporate-gifting',
    linkText: 'Explore Gifting →',
    image: '/images/luxury-teal-gift-box.jpg',
  },
  {
    title: 'Stays & Travel',
    subtitle: 'Curated Experiences',
    desc: 'Boutique properties and orchards in Srinagar, Noida, and Patna.',
    link: '/stays',
    linkText: 'Explore Stays →',
    image: '/images/brand-showcase-collage.jpg',
  },
]

export default function DiscoverSection() {
  return (
    <section className="py-20 bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-[#704B32] font-semibold">
            The Pillars of Nutty Tales
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Discover Nutty Tales
          </h2>
          <p className="text-xs sm:text-sm text-[#17233B]/70 font-normal">
            Gourmet dry fruits, wholesale procurement, luxury festive gifting, and tranquil regional retreats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar, idx) => (
            <Link
              key={idx}
              href={pillar.link}
              className="group bg-white rounded-xl overflow-hidden border border-[#17233B]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#704B32] font-semibold block">
                    {pillar.subtitle}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#17233B] group-hover:text-[#176B68] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#17233B]/70 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#176B68] group-hover:text-[#214B39] transition-colors inline-flex items-center gap-1">
                  {pillar.linkText}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
