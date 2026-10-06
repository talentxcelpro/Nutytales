import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Mithila Makhana Wholesale & Retail — Bihar Fox Nuts | Nutty Tales',
  description:
    'Procure authentic GI-tagged Mithila Phool Makhana directly from Bihar origin. Grade A Jumbo (6+ count) and Standard grades. Retail packs (100g–500g) and wholesale 10kg–25kg sacks.',
  keywords: [
    'mithila makhana wholesale',
    'buy phool makhana online',
    'bihar fox nuts bulk price',
    'jumbo makhana 6 suta',
    'makhana supplier delhi ncr',
    'makhana distributor patna',
    'organic lotus seeds wholesale',
  ],
  openGraph: {
    title: 'Authentic Mithila Makhana — Direct from Bihar | Nutty Tales',
    description:
      'GI-tagged Mithila Fox Nuts. Hand-graded Jumbo flakes, retail pouches, and bulk sacks for B2B supply nationwide.',
    url: 'https://nuttytales.com/makhana',
    siteName: 'Nutty Tales',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function MakhanaPage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where does Nutty Tales source its Makhana?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our Makhana is sourced directly from certified harvesting ponds across the Mithila region (Darbhanga, Madhubani, and Saharsa) in North Bihar, holding GI Tag recognition.',
        },
      },
      {
        '@type': 'Question',
        name: 'What grades of Makhana are available for wholesale procurement?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We provide Grade A Jumbo (6 Suta / 6+ count with minimal breakage), Grade A Standard (5 Suta for everyday snacking), and processing grade for sweet and namkeen manufacturing.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the bulk sack packaging sizes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Wholesale Makhana is packed in 5 kg, 10 kg, and 25 kg moisture-barrier multi-wall woven PP bags with inner food-grade liners to protect crispness.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-[#F7F2E8] pt-28 sm:pt-36 pb-24 text-[#17233B]">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <nav className="text-xs uppercase tracking-widest text-[#17233B]/60 flex items-center gap-2">
            <Link href="/" className="hover:text-[#176B68]">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#176B68]">
              Collection
            </Link>
            <span>/</span>
            <span className="text-[#176B68] font-bold">Mithila Makhana</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#17233B]/10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#176B68]/10 text-[#176B68] text-xs font-bold uppercase tracking-wider">
                <span>🌾 Origin Bihar — Mithila Geographical Indication (GI)</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17233B] leading-tight">
                Authentic Mithila Phool Makhana
              </h1>

              <p className="text-sm sm:text-base text-[#17233B]/75 leading-relaxed max-w-2xl">
                Harvested from the wetland ponds of North Bihar, sun-dried, and popped to pristine perfection.
                Nutty Tales delivers hand-sorted, extra-large lotus seeds with exceptional crunch, zero artificial bleaching, and FSSAI certification.
              </p>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="bg-[#F7F2E8] p-3 rounded-2xl border border-[#17233B]/5 text-center">
                  <span className="block text-lg font-serif font-bold text-[#176B68]">6+ Suta</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#17233B]/70">
                    Jumbo Count
                  </span>
                </div>
                <div className="bg-[#F7F2E8] p-3 rounded-2xl border border-[#17233B]/5 text-center">
                  <span className="block text-lg font-serif font-bold text-[#176B68]">&lt; 9%</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#17233B]/70">
                    Moisture Retained
                  </span>
                </div>
                <div className="bg-[#F7F2E8] p-3 rounded-2xl border border-[#17233B]/5 text-center">
                  <span className="block text-lg font-serif font-bold text-[#176B68]">100%</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#17233B]/70">
                    Natural Pop
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/shop/mithila-phool-makhana"
                  className="px-8 py-3.5 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Shop Retail Packs
                </Link>
                <Link
                  href="/bulk-quote?product=Mithila%20Makhana"
                  className="px-8 py-3.5 bg-[#17233B] hover:bg-black text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Request Wholesale Quotation
                </Link>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    'Hello Nutty Tales! 👋 I want to enquire about wholesale bulk orders for Mithila Makhana.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 border border-[#176B68] text-[#176B68] hover:bg-[#176B68]/5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  WhatsApp Concierge
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F7F2E8] border border-[#17233B]/10 shadow-inner">
                <Image
                  src="/images/hero-lifestyle-bowl.png"
                  alt="Nutty Tales Fresh Mithila Makhana"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-[#17233B]/10 shadow-sm text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-[#17233B]">Grade A Jumbo (Handpicked)</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      FSSAI Lic. {FSSAI_NUMBER}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#17233B]/70 mt-1">
                    Sourced through our Patna regional hub with direct supply lines into Delhi NCR and nationwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grade Ladder & Specifications */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#176B68]">
              Commercial Sourcing Grades
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#17233B] mt-1">
              Hand-Graded for Retailers & Food Manufacturers
            </h2>
            <p className="text-sm text-[#17233B]/70 mt-2">
              Whether you need pristine jumbo flakes for premium retail packaging or industrial volume for roasting lines, we provide consistent particle sizing and verified moisture thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Grade 1 */}
            <div className="bg-white rounded-3xl p-8 border border-[#17233B]/10 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-[#176B68]/10 text-[#176B68] text-[10px] font-bold uppercase tracking-wider inline-block">
                  Premium Retail Grade
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                  Jumbo 6+ Suta (Handpicked)
                </h3>
                <p className="text-xs text-[#17233B]/70 leading-relaxed">
                  The pinnacle of Mithila makhana. 100% hand-sorted to ensure massive flake diameter, round spherical contour, snow-white interior, and near-zero hard seed remnants.
                </p>
                <div className="space-y-2 text-xs border-t border-[#17233B]/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Particle Diameter:</span>
                    <span className="font-bold text-[#17233B]">18mm – 22mm+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Broken / Small Flakes:</span>
                    <span className="font-bold text-[#17233B]">&lt; 1.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Moisture Content:</span>
                    <span className="font-bold text-[#17233B]">7% – 9%</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Link
                  href="/shop/mithila-phool-makhana"
                  className="block w-full py-3 bg-[#176B68] hover:bg-[#125350] text-white text-center rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  View Pricing & Packs
                </Link>
              </div>
            </div>

            {/* Grade 2 */}
            <div className="bg-white rounded-3xl p-8 border border-[#17233B]/10 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-[#704B32]/10 text-[#704B32] text-[10px] font-bold uppercase tracking-wider inline-block">
                  Everyday & Roasting Grade
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                  Standard 5+ Suta
                </h3>
                <p className="text-xs text-[#17233B]/70 leading-relaxed">
                  Ideal for branded snack manufacturers, flavored makhana processors, and supermarkets. Excellent crunch retention when roasted in olive oil or desi ghee.
                </p>
                <div className="space-y-2 text-xs border-t border-[#17233B]/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Particle Diameter:</span>
                    <span className="font-bold text-[#17233B]">14mm – 17mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Broken / Small Flakes:</span>
                    <span className="font-bold text-[#17233B]">&lt; 3.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Moisture Content:</span>
                    <span className="font-bold text-[#17233B]">8% – 10%</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Link
                  href="/bulk-quote?product=Makhana%205%20Suta"
                  className="block w-full py-3 bg-[#17233B] hover:bg-black text-white text-center rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Request Bulk Quote
                </Link>
              </div>
            </div>

            {/* Grade 3 */}
            <div className="bg-white rounded-3xl p-8 border border-[#17233B]/10 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold uppercase tracking-wider inline-block">
                  Industrial / Confectionery
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                  Processing Grade (4 Suta)
                </h3>
                <p className="text-xs text-[#17233B]/70 leading-relaxed">
                  Engineered for halwais, sweet marts, namkeen mixes, and energy bar makers who grind or blend makhana flour without requiring giant presentation flakes.
                </p>
                <div className="space-y-2 text-xs border-t border-[#17233B]/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Particle Diameter:</span>
                    <span className="font-bold text-[#17233B]">10mm – 13mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Broken / Small Flakes:</span>
                    <span className="font-bold text-[#17233B]">Variable</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Moisture Content:</span>
                    <span className="font-bold text-[#17233B]">&lt; 11%</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Link
                  href="/wholesale-dry-fruits/patna"
                  className="block w-full py-3 border border-[#17233B]/20 hover:border-[#176B68] text-[#17233B] hover:text-[#176B68] text-center rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Patna Hub Supply
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Wholesale Packaging & Dispatch Logistics */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-[#17233B] text-white rounded-3xl p-8 sm:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A45C]">
                  B2B Logistics & Sacking
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#F7F2E8]">
                  Direct Dispatch from Patna & Noida Hubs
                </h2>
                <p className="text-sm text-stone-300 leading-relaxed max-w-xl">
                  Makhana is extraordinarily fragile and moisture-sensitive. To prevent crushing in transit and protect crunch during monsoon months, Nutty Tales utilizes heavy-gauge multi-layer woven sacks with heat-sealed food-grade LDPE moisture liners.
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs text-stone-200">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span className="block font-bold text-white mb-1">Standard Sacks</span>
                    5 kg, 10 kg, and 25 kg bags suitable for warehouse stacking and palletization.
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span className="block font-bold text-white mb-1">Taxation & GST</span>
                    Clear 5% GST billing with mandatory HSN codes and commercial e-way bills.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#F7F2E8]">
                  Request Instant Sacking Quote
                </h3>
                <p className="text-xs text-stone-300">
                  Receive live wholesale quotes for full-truck (FTL) or partial pallet (PTL) deliveries across India.
                </p>
                <div className="space-y-3 pt-2">
                  <Link
                    href="/bulk-quote?product=Mithila%20Makhana"
                    className="block w-full py-3.5 bg-[#176B68] hover:bg-[#125350] text-white text-center font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                  >
                    Submit Procurement RFQ
                  </Link>
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                      'Hello Nutty Tales! 👋 I want to speak with your wholesale procurement team regarding Makhana sacks.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3.5 border border-white/20 hover:border-white text-white text-center font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors"
                  >
                    Call / WhatsApp Concierge (+91 9717161809)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nutritional & Health Benefits */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#17233B]/10 shadow-sm space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#176B68]">
                Superfood Profile
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-[#17233B] mt-1">
                The Nutrient Density of Fox Nuts
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-5 rounded-2xl bg-[#F7F2E8] border border-[#17233B]/5">
                <span className="text-2xl font-serif font-bold text-[#176B68] block">9.7g</span>
                <span className="text-xs font-semibold text-[#17233B] block mt-1">Plant Protein</span>
                <span className="text-[10px] text-stone-500">Per 100g serving</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#F7F2E8] border border-[#17233B]/5">
                <span className="text-2xl font-serif font-bold text-[#176B68] block">0.1g</span>
                <span className="text-xs font-semibold text-[#17233B] block mt-1">Saturated Fat</span>
                <span className="text-[10px] text-stone-500">Naturally low fat</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#F7F2E8] border border-[#17233B]/5">
                <span className="text-2xl font-serif font-bold text-[#176B68] block">60mg</span>
                <span className="text-xs font-semibold text-[#17233B] block mt-1">Calcium</span>
                <span className="text-[10px] text-stone-500">Supports bone density</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#F7F2E8] border border-[#17233B]/5">
                <span className="text-2xl font-serif font-bold text-[#176B68] block">Low GI</span>
                <span className="text-xs font-semibold text-[#17233B] block mt-1">Glycemic Index</span>
                <span className="text-[10px] text-stone-500">Diabetic & fasting friendly</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#176B68]">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#17233B] mt-1">
              Procuring Mithila Makhana
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#17233B]/10 space-y-2">
              <h3 className="font-bold text-sm text-[#17233B]">
                How does Nutty Tales ensure the Makhana does not become soggy or soft?
              </h3>
              <p className="text-xs text-[#17233B]/70 leading-relaxed">
                We maintain strict moisture checks (&lt; 9%) immediately after roasting and popping in Bihar. All sacks and consumer pouches are hermetically sealed with moisture-blocking barrier films.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#17233B]/10 space-y-2">
              <h3 className="font-bold text-sm text-[#17233B]">
                Can I order samples before placing a large wholesale order?
              </h3>
              <p className="text-xs text-[#17233B]/70 leading-relaxed">
                Yes. For registered businesses, sweet manufacturers, and retail buyers, we provide 500g and 1kg sample verification packs delivered via express courier.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#17233B]/10 space-y-2">
              <h3 className="font-bold text-sm text-[#17233B]">
                What is the lead time for 500 kg to 2,000 kg orders?
              </h3>
              <p className="text-xs text-[#17233B]/70 leading-relaxed">
                Orders dispatch within 24 to 48 hours from our central transit facility in Patna or our regional fulfillment warehouse in Sector 62, Noida.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
