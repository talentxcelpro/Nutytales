import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
  {
    name: 'Almonds',
    slug: 'almonds',
    origin: 'California & Kashmir',
    image: '/images/almonds-pouch-250g.png',
  },
  {
    name: 'Cashews',
    slug: 'cashews',
    origin: 'W180, W240, W320',
    image: '/images/cashews-pouch-250g.jpg',
  },
  {
    name: 'Walnuts',
    slug: 'walnuts',
    origin: 'Kashmiri Snow Kernels',
    image: '/images/walnuts-pouch-250g.jpg',
  },
  {
    name: 'Makhana',
    slug: 'makhana',
    origin: 'Mithila Grade A & Jumbo',
    image: '/images/makhana-pouch-250g.jpg',
  },
  {
    name: 'Pistachios',
    slug: 'pistachios',
    origin: 'Iranian Akbari & Afghan',
    image: '/images/pistachios-pouch-250g.jpg',
  },
  {
    name: 'Gift Boxes',
    slug: 'gift-packs',
    origin: 'Festive & Corporate',
    image: '/images/royal-tradition-box.jpg',
  },
]

export default function CategoryTiles() {
  return (
    <section className="py-20 bg-white border-y border-[#17233B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-[#704B32] font-semibold">
            Pure Indulgence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#17233B]/70 font-normal">
            Carefully graded for size, crunch, natural aroma, and moisture balance.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug === 'makhana' ? '/makhana' : `/shop?category=${cat.slug}`}
              className="group bg-[#F7F2E8] rounded-xl overflow-hidden border border-[#17233B]/10 shadow-sm hover:shadow-lg transition-all text-center flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full p-4 flex items-center justify-center overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>

              <div className="p-4 bg-white border-t border-[#17233B]/5">
                <h3 className="font-serif text-base font-bold text-[#17233B] group-hover:text-[#176B68] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-[#704B32] uppercase tracking-wider block mt-0.5">
                  {cat.origin}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
