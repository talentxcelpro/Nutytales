import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import StayBookingForm from '@/components/stays/StayBookingForm'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Nutty Tales Stays & Travel | Kashmir, Noida & Patna Properties',
  description:
    'Taste. Stay. Explore. Experience authentic hospitality at Nutty Tales properties in Srinagar (Kashmir), Noida (Delhi NCR), and Patna (Bihar). Curated tours, local gourmet dining, and tranquil retreats.',
  keywords: [
    'nutty tales stays',
    'kashmir orchard stay srinagar',
    'noida corporate stay',
    'patna heritage stay',
    'kashmir dry fruit tour',
    'taste stay explore',
  ],
  openGraph: {
    title: 'Nutty Tales Stays | Taste. Stay. Explore.',
    description:
      'Curated stays in Srinagar, Noida, and Patna. Unmatched comfort, local experiences, and farm-fresh dry fruit heritage.',
    images: ['/images/brand-showcase-collage.jpg'],
  },
}

const PROPERTIES = [
  {
    id: 'kashmir',
    name: 'Kashmir Valley Orchard Stay',
    location: 'Srinagar, Jammu & Kashmir',
    tagline: 'Apple orchards, pine breezes & majestic Pir Panjal mountain views',
    desc: 'Nestled on the outskirts of Srinagar amidst fragrant walnut and apple orchards, our flagship property offers handcrafted deodar wood interiors, crackling bukharis in winter, and bespoke shikara and mountain excursions.',
    highlights: [
      'Orchard-facing balcony suites',
      'Authentic Kashmiri Wazwan & Kahwa',
      'Guided Walnut & Saffron farm visits',
      'Private day tours to Gulmarg & Pahalgam',
    ],
    startingTariff: '₹4,500 / night',
    link: '/stays/kashmir',
    badge: 'Flagship Valley Experience',
  },
  {
    id: 'noida',
    name: 'Noida Executive Retreat',
    location: 'Noida, Delhi NCR',
    tagline: 'Modern luxury, boardroom tranquility & supreme NCR connectivity',
    desc: 'Designed for discerning business travellers and corporate retreats, our Noida property features ergonomic workspaces, gigabit connectivity, quiet terrace lounges, and easy access to Delhi and Greater Noida expressways.',
    highlights: [
      'Spacious Executive & Suite Rooms',
      'Boardroom & private meeting lounges',
      'Healthy gourmet dining & dry fruit bar',
      'Minutes from Delhi-NCR business hubs',
    ],
    startingTariff: '₹3,200 / night',
    link: '/stays/noida',
    badge: 'Corporate & Long-Stay Preferred',
  },
  {
    id: 'patna',
    name: 'Patna Heritage Comfort Stay',
    location: 'Patna, Bihar',
    tagline: 'Warm Bihar hospitality, central access & cultural tranquility',
    desc: 'Conveniently located in the heart of Patna, our comfortable property provides modern amenities, traditional culinary delights, and curated day trips to Nalanda, Rajgir, Bodh Gaya, and Mithila Makhana processing centers.',
    highlights: [
      'Contemporary premium rooms',
      'Authentic regional Bihari cuisine',
      'Makhana sourcing & farm heritage visits',
      'Gateway to Nalanda & Bodh Gaya circuits',
    ],
    startingTariff: '₹2,800 / night',
    link: '/stays/patna',
    badge: 'Cultural Gateway',
  },
]

export default function StaysPage() {
  const whatsappNumber = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-[#1E4D38] via-[#2D6A4F] to-[#3D2B1F] text-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-wide border border-amber-400/30">
              <span>🏔️ NUTTY TALES STAYS & EXPERIENCES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Taste. Stay. Explore.
              <span className="block text-amber-300 font-serif italic text-2xl sm:text-3xl md:text-4xl mt-1">
                Hospitality Grounded in Authenticity
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
              Nutty Tales is more than a purveyor of fine dry fruits — it is a gateway to the lands from which they emerge. Stay at our private properties in Srinagar, Noida, and Patna, where gracious warmth meets unforgettable regional experiences.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#reserve"
                className="px-6 py-3.5 bg-gradient-to-r from-[#D4870A] to-[#B8710A] text-white font-bold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all"
              >
                Book Your Stay ↓
              </a>
              <Link
                href="/travel/kashmir"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition-all"
              >
                Explore Kashmir Travel Packages →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Properties Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4870A]">
            Our Operating Locations
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#3D2B1F]">
            Three Distinct Properties, One High Standard
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Whether relaxing among the walnut groves of Kashmir, closing business deals in Delhi NCR, or discovering historical Bihar, experience our trademark hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PROPERTIES.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {prop.badge}
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    {prop.location}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#3D2B1F] group-hover:text-[#D4870A] transition-colors">
                  {prop.name}
                </h3>
                <p className="text-xs text-[#2D6A4F] font-semibold italic">{prop.tagline}</p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{prop.desc}</p>

                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Key Amenities & Experiences:
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {prop.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-stone-500 block">Tariff from</span>
                  <span className="text-xl font-extrabold text-[#3D2B1F]">{prop.startingTariff}</span>
                </div>
                <a
                  href="#reserve"
                  className="px-4 py-2.5 bg-[#2D6A4F] hover:bg-[#1E4D38] text-white text-xs font-bold rounded-xl transition-colors uppercase tracking-wider"
                >
                  Reserve →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Ecosystem Loop: Taste & Stay */}
      <section className="py-14 bg-amber-50/70 border-y border-amber-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4870A]">
            The Connected Nutty Tales Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2B1F]">
            From Orchard Stay to Your Daily Pantry
          </h2>
          <p className="text-stone-600 text-sm max-w-2xl mx-auto leading-relaxed">
            During your stay in Kashmir, walk the very orchards where our premium walnuts and almonds are nurtured. Taste the fresh harvest over warm saffron kahwa, take home handcrafted gift hampers, and reorder effortlessly online once you return home.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4870A] hover:bg-[#B8710A] text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-colors"
            >
              Explore Our Dry Fruits Collection →
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="reserve" className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <StayBookingForm />
      </section>
    </div>
  )
}
