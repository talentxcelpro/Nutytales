import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import CorporateQuoteForm from '@/components/corporate/CorporateQuoteForm'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Festive Corporate Gift Hampers | Custom Dry Fruit Hampers | Nuty Tales',
  description:
    'Premium Corporate festive gift hampers with customized logo boxes, personalized greeting cards, and pan-India delivery. Almonds, Cashews, Kashmiri Walnuts, Afghan Anjeer & Saffron. Request a bulk quote.',
  keywords: [
    'festive corporate gift hampers',
    'dry fruit corporate gifts',
    'custom branded festive gifts',
    'employee festive gifts',
    'client festive gift boxes',
    'kashmir dry fruit hampers',
    'luxury festive hampers india',
    'Nuty Tales corporate gifting',
  ],
  openGraph: {
    title: 'Festive Corporate Gift Hampers | Nuty Tales',
    description:
      'Stronger Relationships for a Brighter Tomorrow. Handcrafted dry fruit hampers with custom branding for your clients & team.',
    images: ['/images/corporate-diwali-gifting.jpg'],
  },
}

const HAMPERS = [
  {
    id: 'essential-delight',
    name: 'Essential Delight',
    tagline: 'A perfect blend of taste & health',
    price: '₹799',
    contents: ['Almonds 200g', 'Cashews 200g', 'Raisins 200g', 'Premium Rigid Box'],
    bestFor: 'Team & Employee Gifting (High Volume)',
    badge: 'Popular for Teams',
    packaging: 'Rigid Gift Box with Gold Foil',
  },
  {
    id: 'classic-elegance',
    name: 'Classic Elegance',
    tagline: 'A timeless corporate favourite',
    price: '₹1,499',
    contents: [
      'Almonds 250g',
      'Cashews 250g',
      'Pistachios 200g',
      'Walnuts 200g',
      'Dates 200g',
      'Embossed Gift Box',
    ],
    bestFor: 'Distributors, Vendors & Senior Associates',
    badge: 'Best Seller',
    packaging: 'Festive Gold Foil Box',
  },
  {
    id: 'royal-premium',
    name: 'Royal Premium',
    tagline: 'Premium nuts for premium people',
    price: '₹2,499',
    contents: [
      'Almonds 250g',
      'Cashews 250g',
      'Pistachios 250g',
      'Walnuts 250g',
      'Afghan Anjeer 250g',
      'Dates 250g',
      'Teal Luxury Box',
    ],
    bestFor: 'Key Clients, Partners & Leadership Teams',
    badge: 'Executive Choice',
    packaging: 'Teal & Gold Luxury Box with Glass Jars',
  },
  {
    id: 'kashmir-special',
    name: 'Kashmir Special',
    tagline: 'Authentic flavours from the Valley',
    price: '₹2,999',
    contents: [
      'Kashmiri Walnuts 250g',
      'Afghan Anjeer 250g',
      'Premium Almonds 250g',
      'Kashmiri Golden Raisins 250g',
      'Kashmir Saffron (Optional)',
      'Handcrafted Wooden Box',
    ],
    bestFor: 'VIP Clients, Board Members & Prestige Partners',
    badge: 'Authentic Heritage',
    packaging: 'Carved Wooden Gift Box',
  },
  {
    id: 'executive-gourmet',
    name: 'Executive Gourmet',
    tagline: 'A complete gourmet experience',
    price: '₹3,999',
    contents: [
      'Almonds 250g',
      'Cashews 250g',
      'Pistachios 250g',
      'Walnuts 250g',
      'Mixed Nuts 250g',
      'Dates 250g',
      'Premium Box + Custom Greeting Card',
    ],
    bestFor: 'C-Suite Executives & Key Accounts',
    badge: 'Gourmet Selection',
    packaging: 'Midnight Blue & Gold Velvet Rigid Box',
  },
  {
    id: 'luxury-heritage',
    name: 'Luxury Heritage',
    tagline: 'Tradition meets luxury',
    price: '₹5,999',
    contents: [
      'Almonds 250g',
      'Cashews 250g',
      'Pistachios 250g',
      'Walnuts 250g',
      'Afghan Anjeer 250g',
      'Dates 250g',
      'Pure Saffron 1g (Optional)',
      'Handcrafted Royal Wooden Trunk',
    ],
    bestFor: 'Chairman, Founders & Special Celebrations',
    badge: 'Ultra Luxury',
    packaging: 'Handcrafted Solid Wooden Chest',
  },
]

const CUSTOMIZATION_FEATURES = [
  {
    icon: '🏷️',
    title: 'Custom Company Logo Branding',
    desc: 'Your brand logo elegantly embossed, foil-stamped, or printed on the hamper lid and inside sleeve.',
  },
  {
    icon: '💌',
    title: 'Personalised Greeting Cards',
    desc: 'Custom-printed festive greeting cards signed from your CEO or leadership team with your corporate message.',
  },
  {
    icon: '🚚',
    title: 'Multi-Location Pan-India Delivery',
    desc: 'Bulk dispatch to your central office or individual direct deliveries to employee & client doorsteps across 19,000+ pincodes.',
  },
  {
    icon: '📋',
    title: '100% Tax Compliant GST Invoices',
    desc: 'Full tax invoicing with GSTIN input tax credit (ITC) for your corporate finance and procurement records.',
  },
  {
    icon: '🌿',
    title: 'FSSAI Certified Freshness',
    desc: `Compliant with FSSAI Lic. ${FSSAI_NUMBER}. High-grade, airtight jars preserving natural crunch and nutrition.`,
  },
  {
    icon: '🤝',
    title: 'Dedicated Corporate Account Manager',
    desc: 'One point of contact from quotation, sampling, and proof approval to dispatch and proof-of-delivery (POD).',
  },
]

export default function CorporateGiftingPage() {
  const whatsappNumber = (WHATSAPP_NUMBERS.CORPORATE || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section with Creative Image */}
      <section className="relative bg-gradient-to-br from-[#1C3A27] via-[#2D6A4F] to-[#1E4D38] text-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4870A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-wide border border-amber-400/30">
                <span>✨ FESTIVE CORPORATE GIFTING</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>BOOKINGS OPEN</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Corporate Gift Hampers
                <span className="block text-amber-300 font-serif italic text-2xl sm:text-3xl md:text-4xl mt-1">
                  Stronger Relationships for a Brighter Tomorrow
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
                Elevate your corporate gifting this festive season. Nuty Tales brings you premium dry fruit gift hampers featuring California almonds, cashews, Kashmiri walnuts, and Afghan anjeer, packaged in luxury rigid boxes or handcrafted wooden chests with your company logo.
              </p>

              {/* Quick Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-center">
                  <span className="text-xl block">🏢</span>
                  <span className="text-xs font-semibold text-white">Custom Logo</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-center">
                  <span className="text-xl block">🚚</span>
                  <span className="text-xs font-semibold text-white">Pan-India Ship</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-center">
                  <span className="text-xl block">📋</span>
                  <span className="text-xs font-semibold text-white">GST Invoice</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-center">
                  <span className="text-xl block">🌿</span>
                  <span className="text-xs font-semibold text-white">FSSAI Certified</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#request-quote"
                  className="px-7 py-3.5 bg-gradient-to-r from-[#D4870A] to-[#B8710A] hover:from-[#B8710A] hover:to-[#965A08] text-white font-bold rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider"
                >
                  Request a Corporate Quote ↓
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    'Hello Nuty Tales! 🎁 I want to enquire about Corporate Diwali Gift Hampers.',
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-all inline-flex items-center gap-2"
                >
                  <span>WhatsApp: +91 9717161809</span>
                </a>
              </div>
            </div>

            {/* Showcase Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300/30 group">
                <Image
                  src="/images/corporate-diwali-gifting.jpg"
                  alt="Nuty Tales Corporate Gift Hampers - Diwali Collection"
                  width={800}
                  height={600}
                  priority
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-center">
                  <p className="text-xs font-medium text-amber-200">
                    Handcrafted Hampers with Custom Logo & Personalized Greetings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Hamper Ladder */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4870A]">
            Curated Gifting Ladder
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#3D2B1F]">
            The Festive Corporate Hamper Collection
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            From high-volume employee appreciation gifts to bespoke handcrafted wooden chests for CXOs and key clients. Indicative starting prices shown — final quotation customized by quantity and branding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HAMPERS.map((hamper) => (
            <div
              key={hamper.id}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200 flex flex-col justify-between relative group hover:border-[#D4870A]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-[#D4870A] text-xs font-bold border border-amber-200">
                    {hamper.badge}
                  </span>
                  <span className="text-xs text-stone-500">{hamper.packaging}</span>
                </div>

                <h3 className="text-2xl font-bold text-[#3D2B1F] group-hover:text-[#D4870A] transition-colors">
                  {hamper.name}
                </h3>
                <p className="text-xs text-stone-500 italic mt-0.5">{hamper.tagline}</p>

                <div className="my-5 pb-4 border-b border-stone-100 flex items-baseline gap-2">
                  <span className="text-xs uppercase text-stone-500 font-medium">Starting at</span>
                  <span className="text-3xl font-extrabold text-[#2D6A4F]">{hamper.price}</span>
                  <span className="text-xs text-stone-500">/ hamper</span>
                </div>

                <div className="space-y-2 mb-6">
                  <span className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    What&apos;s Inside:
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {hamper.contents.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div className="text-xs text-stone-500">
                  <span className="font-semibold text-stone-700">Ideal for:</span> {hamper.bestFor}
                </div>
                <a
                  href="#request-quote"
                  className="w-full block text-center py-2.5 px-4 rounded-xl bg-stone-100 group-hover:bg-[#D4870A] group-hover:text-white text-stone-800 font-semibold text-xs tracking-wider uppercase transition-colors"
                >
                  Select for Quote →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <p className="text-xs text-stone-700">
            * Note: Starting prices are indicative for planning and budgeting. Final pricing is customized based on your total order quantity, custom branding specifications, GST, and logistics destination.
          </p>
        </div>
      </section>

      {/* Customisation & Branding Section */}
      <section className="py-16 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F]">
              Tailored to Your Identity
            </span>
            <h2 className="text-3xl font-bold text-[#3D2B1F]">
              Your Brand. Our Hampers. A Lasting Impression.
            </h2>
            <p className="text-stone-600 text-sm">
              We manage the entire gifting pipeline so your team can focus on celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CUSTOMIZATION_FEATURES.map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 space-y-3"
              >
                <span className="text-3xl block">{feat.icon}</span>
                <h3 className="font-bold text-base text-[#3D2B1F]">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The RFQ Form Section */}
      <section id="request-quote" className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <CorporateQuoteForm />
      </section>

      {/* Corporate FAQ */}
      <section className="py-16 bg-stone-100/70 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2B1F]">
              Frequently Asked Questions — Corporate Gifting
            </h2>
            <p className="text-stone-600 text-sm">Everything you need to know about our corporate hamper service.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-sm text-[#3D2B1F]">What is the Minimum Order Quantity (MOQ) for corporate hampers?</h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">Our standard MOQ for corporate-branded hampers is 25 boxes. For orders exceeding 100 boxes, we provide volume-based discounts and complimentary custom branding.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-sm text-[#3D2B1F]">Can you deliver directly to individual employee addresses across India?</h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">Yes! We provide complete end-to-end doorstep delivery to individual residential or office addresses across 19,000+ pincodes in India with live tracking updates.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-sm text-[#3D2B1F]">How early should we place our Diwali order?</h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">For custom-branded hampers, we recommend placing orders at least 15 to 20 days in advance of your preferred delivery date to ensure timely box production and dispatch.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-sm text-[#3D2B1F]">Can we customize the nut and dry fruit combinations inside the box?</h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">Absolutely. You can choose any combination from California almonds, cashews (W240/W320), Kashmiri walnuts, Afghan anjeer, Iranian pistachios, Medjool dates, roasted seeds, and Kashmiri saffron.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
