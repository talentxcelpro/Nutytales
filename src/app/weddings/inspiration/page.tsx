import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Real Weddings & Cultural Inspiration | Nuty Tales Weddings',
  description:
    'Explore real celebrations, multi-day cultural timelines, color palettes, and royal photography from Kashmir, Rajasthan, Goa, Dubai, and Italy.',
  alternates: {
    canonical: 'https://weddings.nutytales.com/inspiration',
  },
}

const CULTURAL_STORIES = [
  {
    title: 'An Orchard Phera Ceremony in Harwan, Kashmir',
    couple: 'Zain & Alizeh',
    location: 'Srinagar, Kashmir',
    image: '/images/stays/kashmir-orchard-estate.jpg',
    tag: 'Mountain Romance',
    highlights: '36-course royal woodfire Wazwan, handmade gold-leaf papier-mâché favors, shikara arrival.',
  },
  {
    title: 'A Regal Jai Mahal Celebration in the Pink City',
    couple: 'Ananya & Vikram',
    location: 'Jaipur, Rajasthan',
    image: '/images/jaipur-heritage.jpg',
    tag: 'Rajputana Grandeur',
    highlights: 'Vintage convertible baraat, sunset lotus pavilion pheras, monogrammed dry fruit chests.',
  },
  {
    title: 'Sunset Beach Pheras and Barefoot Sundowner',
    couple: 'Rhea & Kabir',
    location: 'North Goa Coastline',
    image: '/images/stays/kerala-heritage.jpg',
    tag: 'Coastal Bohemian',
    highlights: 'Marigold mandap on sand, live acoustic rabab, French ribbon favor potlis.',
  },
  {
    title: 'Ethereal Desert Dusk & Bedouin Tents',
    couple: 'Pooja & Zayd',
    location: 'Dubai Desert Reserve, UAE',
    image: '/images/stays/modern-apartment-interior.jpg',
    tag: 'Arabian Nights',
    highlights: 'Falconry welcome, dune amphitheater pheras, direct air-freight Kashmiri saffron gifts.',
  },
]

export default function InspirationPage() {
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-[#17233B]">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1520] text-[#C9A45C] text-xs font-semibold tracking-wide">
          <span>✨ REAL CELEBRATIONS &amp; EDITORIAL INSPIRATION</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          Wedding Stories &amp; Traditions
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
          From multi-day Kashmiri Wazwan banquets to regal Rajasthani palace affairs and Italian lakeside vows. Authentic ideas for timelines, mandap scenography, and guest gifting.
        </p>
      </div>

      {/* ── Stories Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CULTURAL_STORIES.map((story, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] w-full bg-stone-100">
                <Image src={story.image} alt={story.title} fill className="object-cover" />
                <div className="absolute top-3 left-3 bg-[#2D1520] text-[#C9A45C] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {story.tag}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-lg">
                  {story.couple} · {story.location}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#17233B]">
                  {story.title}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {story.highlights}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href="/workspace"
                className="block w-full py-2.5 bg-stone-100 hover:bg-[#8E2848] hover:text-white text-stone-800 text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Plan a Wedding Like This →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Cultural Guides Section ──────────────────────────────────────────── */}
      <div className="bg-[#2D1520] text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">
          Cultural Ceremony Guides
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-light max-w-2xl leading-relaxed">
          Detailed checklists and protocols for multicultural and regional wedding customs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#C9A45C]">Kashmiri Pandit &amp; Muslim Rites</h4>
            <p className="text-stone-300 font-light text-[11px] leading-relaxed">
              Kasamdry engagement, Devgon purification, traditional Traami Wazwan sequence, and Phoolon Ka Dupatta.
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#C9A45C]">Rajputana Royal Traditions</h4>
            <p className="text-stone-300 font-light text-[11px] leading-relaxed">
              Tilak announcement, Pithi turmeric rituals, elephant/vintage car baraat, and Toran welcoming.
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#C9A45C]">Multicultural &amp; Interfaith Vows</h4>
            <p className="text-stone-300 font-light text-[11px] leading-relaxed">
              Harmonizing civil ceremonies with traditional rituals, bilingual coordinator guidelines, and flexible meal stations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
