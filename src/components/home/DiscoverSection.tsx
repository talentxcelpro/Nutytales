import Link from 'next/link'
import Image from 'next/image'

const FOUR_DOORS = [
  {
    tag: 'Taste',
    title: 'Foods & Dry Fruits',
    subtitle: 'Everyday Indulgence',
    desc: 'California almonds, W240 cashews, Kashmiri Kagzi walnuts, Mongra saffron, raw honey, and Mithila makhana.',
    link: '/shop',
    linkText: 'Shop Collection →',
    image: '/images/crystal-gold-nut-bowls.jpg',
  },
  {
    tag: 'Gift',
    title: 'Corporate & Heritage Gifting',
    subtitle: 'Diwali & Celebrations',
    desc: 'Bespoke hampers pairing gourmet dry fruits with handcrafted papier-mâché, custom logo engraving, and pan-India delivery.',
    link: '/corporate-gifting',
    linkText: 'Explore Gifting →',
    image: '/images/crafts-gifting-box.jpg',
  },
  {
    tag: 'Stay',
    title: 'Boutique Stays & Retreats',
    subtitle: 'Orchards & Escapes',
    desc: 'Tranquil properties in Srinagar, Noida, and Patna. Orchard walks, airport transfers, and authentic valley hospitality.',
    link: '/stays',
    linkText: 'Explore Stays →',
    image: '/images/brand-showcase-collage.jpg',
  },
  {
    tag: 'Discover',
    title: 'Crafts & Heritage',
    subtitle: 'Autumn & Winter Artisan',
    desc: 'Hand-woven Kani Pashmina shawls, wool tweed pherans, embroidered stoles, velvet coats, and carved walnut wood.',
    link: '/crafts',
    linkText: 'Discover Crafts (Try with SI) →',
    image: '/images/crafts-shawls.jpg',
  },
]

export default function DiscoverSection() {
  return (
    <section className="py-20 bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-semibold">
            Taste · Stay · Explore · Discover
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Discover the World Through Nuty Tales
          </h2>
          <p className="text-xs sm:text-sm text-[#17233B]/70 font-light">
            Taste it. Stay there. Explore it. Bring its stories home. Four connected doors into wholesome nourishment, warm retreats, and timeless craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUR_DOORS.map((door, idx) => (
            <Link
              key={idx}
              href={door.link}
              className="group bg-white rounded-2xl overflow-hidden border border-[#17233B]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={door.image}
                    alt={door.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-3 left-3 bg-[#17233B]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {door.tag}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#704B32] font-semibold block">
                    {door.subtitle}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#17233B] group-hover:text-[#176B68] transition-colors leading-snug">
                    {door.title}
                  </h3>
                  <p className="text-xs text-[#17233B]/70 leading-relaxed font-light">
                    {door.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#176B68] group-hover:text-[#214B39] transition-colors inline-flex items-center gap-1">
                  {door.linkText}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
