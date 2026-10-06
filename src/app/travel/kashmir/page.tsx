import type { Metadata } from 'next'
import Link from 'next/link'
import StayBookingForm from '@/components/stays/StayBookingForm'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Kashmir Travel, Tours & Stays | Nutty Tales Experiences',
  description:
    'Experience the magic of Kashmir with Nutty Tales. Stay at our private Srinagar orchard retreat and enjoy curated tours to Gulmarg, Pahalgam, Sonamarg, and Dal Lake with authentic local guides.',
  keywords: [
    'kashmir travel package',
    'srinagar orchard stay',
    'gulmarg tour package',
    'pahalgam day trip',
    'kashmir dry fruit tour',
    'kashmir wazwan experience',
  ],
}

const ITINERARIES = [
  {
    title: 'The Valley Enchantment (4 Days / 3 Nights)',
    subtitle: 'Srinagar • Dal Lake Shikara • Gulmarg Cable Car',
    desc: 'Perfect for couples and quick family getaways. Includes luxury orchard stay, private airport transfers, Dal Lake sunset shikara, and full-day excursion to Gulmarg.',
    inclusions: ['3 Nights Orchard Stay', 'Daily Breakfast & Kahwa', 'Private Sedan Transfer', 'Shikara Ride'],
    tariff: 'Starting from ₹18,500 / couple',
  },
  {
    title: 'Grand Kashmir & Orchard Trail (6 Days / 5 Nights)',
    subtitle: 'Srinagar • Gulmarg • Pahalgam • Saffron & Walnut Groves',
    desc: 'Our signature complete itinerary. Explore snow-capped summits, riverside pine meadows in Pahalgam, and take a guided walk through Pampore saffron fields and walnut groves.',
    inclusions: ['5 Nights Stay', 'All Sightseeing & Transfers', 'Traditional Wazwan Feast', 'Curated Dry Fruit Hamper'],
    tariff: 'Starting from ₹32,000 / couple',
  },
  {
    title: 'Corporate & Leadership Retreat (3 Days / 2 Nights)',
    subtitle: 'Executive Meetings • Fireside Networking • Mountain Treks',
    desc: 'Customized for executive boards and high-performing teams seeking inspiration, crisp mountain air, and uninterrupted strategic planning amidst deodar cedar woods.',
    inclusions: ['Full Property Buyout', 'Curated Dining', 'Team Excursions', 'High-Speed Connectivity'],
    tariff: 'Custom Quote Available',
  },
]

export default function KashmirTravelPage() {
  const whatsappNumber = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1C3A27] via-[#2D6A4F] to-[#143526] text-white pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <span className="inline-block px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-400/30">
              🏔️ CURATED KASHMIR EXPERIENCES
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Stay in Kashmir. Explore Kashmir. Taste Kashmir.
            </h1>
            <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
              Discover paradise through the eyes of locals. From our tranquil Srinagar orchard stay to snow-clad Gulmarg slopes and authentic Wazwan banquets, let Nutty Tales craft your unforgettable Kashmir journey.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#enquire"
                className="px-6 py-3.5 bg-gradient-to-r from-[#D4870A] to-[#B8710A] text-white font-bold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all"
              >
                Plan Your Kashmir Tour ↓
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  'Hello Nutty Tales! 🏔️ I want to plan a trip to Kashmir.',
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition-all"
              >
                Chat on WhatsApp (+91 9717161809)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Itineraries */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4870A]">
            Curated Packages
          </span>
          <h2 className="text-3xl font-bold text-[#3D2B1F]">
            Signature Kashmir Itineraries
          </h2>
          <p className="text-stone-600 text-sm">
            Handcrafted travel packages combining cozy accommodation, private sanitized transport, and authentic local experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ITINERARIES.map((pkg, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider block">
                  {pkg.subtitle}
                </span>
                <h3 className="text-xl font-bold text-[#3D2B1F]">{pkg.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{pkg.desc}</p>
                <div className="pt-2">
                  <span className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Inclusions:
                  </span>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {pkg.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#3D2B1F]">{pkg.tariff}</span>
                <a
                  href="#enquire"
                  className="px-4 py-2 bg-[#D4870A] hover:bg-[#B8710A] text-white text-xs font-bold rounded-xl transition-colors uppercase tracking-wider"
                >
                  Book →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section id="enquire" className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <StayBookingForm defaultProperty="Kashmir Valley Orchard Stay (Srinagar)" />
      </section>
    </div>
  )
}
