import type { Metadata } from 'next';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  SEO Metadata                                                        */
/* ------------------------------------------------------------------ */
export const metadata: Metadata = {
  title: 'Wholesale Dry Fruits Supplier India | Bulk Dry Fruits | Nuty Tales',
  description:
    'Buy wholesale dry fruits for your business. Bulk almonds, cashews, raisins, pistachios, makhana and more. Serving retailers, bakeries, hotels, restaurants, sweet shops. Noida, Kashmir, Patna.',
  alternates: { canonical: 'https://nutytales.com/wholesale-dry-fruits' },
  openGraph: {
    title: 'Wholesale Dry Fruits Supplier India | Nuty Tales',
    description:
      'Bulk supply of premium dry fruits across India. Competitive pricing, GST invoice, dedicated B2B support.',
    url: 'https://nutytales.com/wholesale-dry-fruits',
    type: 'website',
  },
};

/* ------------------------------------------------------------------ */
/*  JSON-LD Schemas                                                     */
/* ------------------------------------------------------------------ */
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nuty Tales',
  url: 'https://nutytales.com',
  logo: 'https://nutytales.com/logo.png',
  description:
    'Premium dry fruits wholesale and retail supplier across India. B2B supply to retailers, bakeries, hotels, sweet shops and food manufacturers.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Noida',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
  },
  areaServed: ['Noida', 'Delhi NCR', 'Srinagar', 'Kashmir', 'Patna', 'Bihar'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Wholesale Dry Fruits',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Nuty Tales — Wholesale Dry Fruits',
  image: 'https://nutytales.com/og-image.jpg',
  url: 'https://nutytales.com/wholesale-dry-fruits',
  description:
    'Wholesale and bulk dry fruit supplier serving businesses across India.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Noida',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 28.5355,
    longitude: 77.391,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '19:00',
  },
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Bank Transfer, UPI, RTGS, NEFT',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nutytales.com' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Wholesale Dry Fruits',
      item: 'https://nutytales.com/wholesale-dry-fruits',
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Static Data                                                         */
/* ------------------------------------------------------------------ */
const businessTypes = [
  { icon: '🏪', title: 'Retailers & Wholesalers', desc: 'Stock premium dry fruits for your store with attractive margins.' },
  { icon: '🥐', title: 'Bakeries & Confectioneries', desc: 'High-quality ingredients for baked goods, sweets, and confections.' },
  { icon: '🏨', title: 'Hotels & Restaurants', desc: 'Bulk supply ensuring freshness and consistency for your kitchen.' },
  { icon: '🍬', title: 'Sweet Shops & Namkeen Makers', desc: 'Bulk almonds, cashews, raisins and seeds for traditional sweets.' },
  { icon: '🎁', title: 'Corporate & Gifting Companies', desc: 'Premium dry fruit hampers and bulk gifting solutions.' },
  { icon: '🏭', title: 'Food Manufacturers', desc: 'Consistent quality and volume for your production requirements.' },
];

const bulkProducts = [
  { name: 'Almonds (Badam)', minOrder: '5 kg', priceRange: 'On request', packOptions: '5 kg, 10 kg, 25 kg, 50 kg' },
  { name: 'Cashews W320 (Kaju)', minOrder: '5 kg', priceRange: 'On request', packOptions: '5 kg, 10 kg, 25 kg' },
  { name: 'Raisins (Kishmish)', minOrder: '5 kg', priceRange: 'On request', packOptions: '5 kg, 10 kg, 25 kg' },
  { name: 'Makhana (Fox Nuts)', minOrder: '5 kg', priceRange: 'On request', packOptions: '5 kg, 10 kg' },
  { name: 'Pistachios (Pista)', minOrder: '5 kg', priceRange: 'On request', packOptions: '5 kg, 10 kg, 25 kg' },
  { name: 'Walnuts (Akhrot)', minOrder: '5 kg', priceRange: 'On request', packOptions: '5 kg, 10 kg, 25 kg' },
  { name: 'Anjeer (Figs)', minOrder: '5 kg', priceRange: 'On request', packOptions: '5 kg, 10 kg' },
  { name: 'Dates (Khajoor)', minOrder: '5 kg', priceRange: 'On request', packOptions: '5 kg, 10 kg, 25 kg' },
];

const howItWorks = [
  { step: '01', title: 'Register Your Business', desc: 'Create a free B2B account with your business details and GSTIN.' },
  { step: '02', title: 'Browse & Request Quote', desc: 'Select products, quantities and submit your bulk quote request.' },
  { step: '03', title: 'Confirm Order', desc: 'Receive pricing, confirm your order and complete payment.' },
  { step: '04', title: 'Delivery & GST Invoice', desc: 'Fast delivery with a proper GST invoice for your records.' },
];

const benefits = [
  { icon: '📉', title: 'Quantity-Based Pricing', desc: 'Better rates as your order volume grows. Tiered pricing for all products.' },
  { icon: '🧾', title: 'GST Invoice', desc: 'Proper GST invoices for all B2B orders. Claim input tax credit.' },
  { icon: '📦', title: 'One Supplier, Many Products', desc: 'All major dry fruits from a single trusted supplier. Simplify procurement.' },
  { icon: '🔁', title: 'Easy Repeat Orders', desc: 'Reorder with one click. Saved order templates for regular buyers.' },
  { icon: '📍', title: 'Location-Based Fulfilment', desc: 'Warehouses in Noida, Kashmir and Patna for faster regional delivery.' },
  { icon: '👤', title: 'Dedicated Account Manager', desc: 'A dedicated B2B point of contact for quotes, support and logistics.' },
];

const locations = [
  {
    city: 'Noida / Delhi NCR',
    icon: '🏙️',
    desc: 'Our central operations hub. Serving Noida, Greater Noida, Ghaziabad, Gurugram, Faridabad and Delhi.',
    supplies: ['Almonds', 'Cashews', 'Raisins', 'Pistachios', 'Walnuts', 'Makhana', 'Anjeer', 'Dates'],
    href: '/wholesale-dry-fruits/noida',
    cta: 'Noida Wholesale',
  },
  {
    city: 'Kashmir / Srinagar',
    icon: '🏔️',
    desc: 'Supplying premium Afghan dry fruits to Kashmir businesses. Retailers, wholesalers, hotels and bakeries.',
    supplies: ['Afghan Raisins', 'Afghan Pistachios', 'Afghan Anjeer', 'Almonds', 'Walnuts', 'Dates'],
    href: '/wholesale-dry-fruits/kashmir',
    cta: 'Kashmir Wholesale',
  },
  {
    city: 'Patna / Bihar',
    icon: '🌾',
    desc: 'Patna distribution with direct Makhana sourcing from Bihar farms. Best rates for Bihar businesses.',
    supplies: ['Makhana', 'Almonds', 'Cashews', 'Raisins', 'Pistachios', 'Walnuts'],
    href: '/wholesale-dry-fruits/patna',
    cta: 'Patna Wholesale',
  },
];

const faqs = [
  {
    q: 'What is the minimum order quantity?',
    a: 'The minimum order quantity (MOQ) is 5 kg per product for B2B buyers. Combined orders across multiple products qualify for better pricing.',
  },
  {
    q: 'How do I get B2B pricing?',
    a: 'Register a free business account or submit a bulk quote request. Our team will share pricing based on your quantity and product mix within 24 hours.',
  },
  {
    q: 'Do you provide GST invoice?',
    a: 'Yes. All wholesale orders come with a proper GST invoice. You can claim input tax credit on your purchases.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept bank transfer (NEFT/RTGS/IMPS), UPI, and cheque for verified B2B accounts. Payment terms are negotiable for regular buyers.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Delivery timelines vary by location: Noida/NCR (1–2 days), Patna (2–3 days), Kashmir/Srinagar (3–5 days). Expedited options are available.',
  },
  {
    q: 'Can I visit your warehouse?',
    a: 'Yes! You are welcome to visit our Noida facility. Please contact us to schedule a visit. Our Kashmir and Patna offices can be visited by appointment.',
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                      */
/* ------------------------------------------------------------------ */
export default function WholesalePage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-[#F5F0E8] border-b border-[#E8DFD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-sm text-[#8B6F5E]">
            <li><Link href="/" className="hover:text-[#C8862A] transition-colors">Home</Link></li>
            <li className="text-[#C8862A]">/</li>
            <li className="text-[#3D2B1F] font-medium">Wholesale Dry Fruits</li>
          </ol>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#3D2B1F] via-[#5C3D2E] to-[#3D2B1F] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-block bg-[#C8862A] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              B2B Wholesale
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Wholesale Dry Fruits for Retailers, Distributors &amp; Businesses
            </h1>
            <p className="text-lg sm:text-xl text-[#D4B896] mb-8 leading-relaxed">
              Bulk supply of premium dry fruits across India. Competitive pricing, GST invoice, dedicated B2B support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/bulk-quote"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#C8862A] hover:bg-[#A36E22] text-white font-bold rounded-lg transition-colors text-sm tracking-wider uppercase"
              >
                Request Bulk Quote
              </Link>
              <Link
                href="/business"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white hover:bg-white hover:text-[#3D2B1F] text-white font-bold rounded-lg transition-colors text-sm tracking-wider uppercase"
              >
                Create Business Account
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-[#D4B896]">
              <span>✓ MOQ from 5 kg</span>
              <span>✓ GST Invoice</span>
              <span>✓ Pan-India delivery</span>
              <span>✓ FSSAI: 22724441000048</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Serve ── */}
      <section className="py-16 px-4 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3D2B1F] mb-4">Who We Serve</h2>
            <p className="text-[#8B6F5E] text-lg max-w-2xl mx-auto">
              From small retailers to large food manufacturers — we supply dry fruits to businesses of all sizes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessTypes.map((bt) => (
              <div
                key={bt.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8DFD0] hover:shadow-md hover:border-[#C8862A] transition-all group"
              >
                <div className="text-4xl mb-4">{bt.icon}</div>
                <h3 className="text-lg font-bold text-[#3D2B1F] mb-2 group-hover:text-[#C8862A] transition-colors">
                  {bt.title}
                </h3>
                <p className="text-[#8B6F5E] text-sm leading-relaxed">{bt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bulk Products ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3D2B1F] mb-4">Bulk Products &amp; Pack Options</h2>
            <p className="text-[#8B6F5E] text-lg">All prices are available on request after business verification.</p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#E8DFD0] shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#3D2B1F] text-white">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Min. Order</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">B2B Price</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Pack Options</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {bulkProducts.map((p, i) => (
                  <tr key={p.name} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]'}>
                    <td className="px-6 py-4 font-semibold text-[#3D2B1F]">{p.name}</td>
                    <td className="px-6 py-4 text-[#5C3D2E]">{p.minOrder}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-[#F5F0E8] text-[#C8862A] font-semibold px-3 py-1 rounded-full text-sm">
                        {p.priceRange}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#8B6F5E] text-sm">{p.packOptions}</td>
                    <td className="px-6 py-4">
                      <Link
                        href="/bulk-quote"
                        className="text-[#C8862A] hover:text-[#A36E22] font-semibold text-sm transition-colors"
                      >
                        Get Quote →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid gap-4">
            {bulkProducts.map((p) => (
              <div key={p.name} className="bg-white rounded-xl border border-[#E8DFD0] p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-[#3D2B1F]">{p.name}</h3>
                  <span className="text-xs bg-[#F5F0E8] text-[#C8862A] font-semibold px-2 py-1 rounded-full">
                    {p.priceRange}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-[#8B6F5E] mb-4">
                  <p>Min. Order: <span className="font-medium text-[#3D2B1F]">{p.minOrder}</span></p>
                  <p>Packs: {p.packOptions}</p>
                </div>
                <Link href="/bulk-quote" className="text-sm font-bold text-[#C8862A] hover:underline">
                  Get Quote →
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/bulk-quote"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#C8862A] hover:bg-[#A36E22] text-white font-bold rounded-lg transition-colors uppercase tracking-wider text-sm"
            >
              Request Bulk Quote for All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-4 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3D2B1F] mb-4">How It Works</h2>
            <p className="text-[#8B6F5E] text-lg">Start buying wholesale in 4 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-[#E8DFD0] z-0" />
                )}
                <div className="relative z-10 bg-white rounded-2xl p-6 shadow-sm border border-[#E8DFD0] text-center">
                  <div className="w-16 h-16 bg-[#3D2B1F] text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-[#3D2B1F] mb-2">{step.title}</h3>
                  <p className="text-[#8B6F5E] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B Benefits ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3D2B1F] mb-4">Why Businesses Choose Nuty Tales</h2>
            <p className="text-[#8B6F5E] text-lg max-w-2xl mx-auto">
              Everything a B2B buyer needs from a dry fruit supplier.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 p-6 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD0]">
                <div className="text-3xl flex-shrink-0">{b.icon}</div>
                <div>
                  <h3 className="font-bold text-[#3D2B1F] mb-1">{b.title}</h3>
                  <p className="text-[#8B6F5E] text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location Coverage ── */}
      <section className="py-16 px-4 bg-[#3D2B1F]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">We Supply Across India</h2>
            <p className="text-[#D4B896] text-lg max-w-2xl mx-auto">
              Regional warehouses for faster delivery and local support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <div key={loc.city} className="bg-[#4E3526] rounded-2xl p-6 border border-[#6B4B35]">
                <div className="text-4xl mb-4">{loc.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{loc.city}</h3>
                <p className="text-[#D4B896] text-sm leading-relaxed mb-4">{loc.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {loc.supplies.map((s) => (
                    <span key={s} className="text-xs bg-[#3D2B1F] text-[#C8862A] px-2 py-1 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                <Link
                  href={loc.href}
                  className="inline-flex items-center text-sm font-bold text-[#C8862A] hover:text-white transition-colors"
                >
                  {loc.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3D2B1F] mb-4">Frequently Asked Questions</h2>
            <p className="text-[#8B6F5E] text-lg">Everything you need to know about wholesale orders.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-[#E8DFD0] p-6 shadow-sm">
                <h3 className="font-bold text-[#3D2B1F] mb-2">{faq.q}</h3>
                <p className="text-[#8B6F5E] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-4 bg-[#C8862A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Buying Wholesale?
          </h2>
          <p className="text-[#FAF7F2] text-lg mb-8">
            Get competitive bulk pricing for your business. Our team responds within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bulk-quote"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#C8862A] font-bold rounded-lg hover:bg-[#FAF7F2] transition-colors uppercase tracking-wider text-sm"
            >
              Get Wholesale Pricing
            </Link>
            <Link
              href="/business"
              className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#C8862A] transition-colors uppercase tracking-wider text-sm"
            >
              Register Business
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
