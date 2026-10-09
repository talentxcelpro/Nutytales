import type { Metadata } from 'next';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  SEO Metadata                                                        */
/* ------------------------------------------------------------------ */
export const metadata: Metadata = {
  title: 'Dry Fruit Wholesale Supplier Kashmir | Srinagar | Nuty Tales',
  description:
    'Wholesale dry fruits in Kashmir. Supply to retailers, wholesalers, bakeries, hotels and businesses in Srinagar and J&K. GST invoice. Bulk orders.',
  alternates: { canonical: 'https://nutytales.com/wholesale-dry-fruits/kashmir' },
  openGraph: {
    title: 'Dry Fruit Wholesale Supplier Kashmir | Srinagar | Nuty Tales',
    description:
      'Premium wholesale dry fruits for businesses in Srinagar and J&K. Afghan raisins, pistachios, anjeer and more. GST invoice.',
    url: 'https://nutytales.com/wholesale-dry-fruits/kashmir',
    type: 'website',
  },
};

/* ------------------------------------------------------------------ */
/*  JSON-LD Schema                                                      */
/* ------------------------------------------------------------------ */
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Nuty Tales — Wholesale Dry Fruits Kashmir',
  image: 'https://nutytales.com/og-image.jpg',
  url: 'https://nutytales.com/wholesale-dry-fruits/kashmir',
  description:
    'Wholesale dry fruit supplier serving businesses in Srinagar and Jammu & Kashmir. Premium Afghan dry fruits and more.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Arshid House, Budgam–Gojra Road, Dadna',
    addressLocality: 'Budgam',
    addressRegion: 'Jammu and Kashmir',
    postalCode: '191111',
    addressCountry: 'IN',
  },
  areaServed: ['Srinagar', 'Jammu', 'Kashmir', 'Baramulla', 'Anantnag', 'Pulwama'],
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Bank Transfer, UPI, Cash',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nutytales.com' },
    { '@type': 'ListItem', position: 2, name: 'Wholesale', item: 'https://nutytales.com/wholesale-dry-fruits' },
    { '@type': 'ListItem', position: 3, name: 'Kashmir', item: 'https://nutytales.com/wholesale-dry-fruits/kashmir' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Static Data                                                         */
/* ------------------------------------------------------------------ */
const kashmirProducts = [
  {
    name: 'Afghan Raisins (Kishmish)',
    highlight: true,
    desc: 'Premium Afghan green & golden raisins. High demand in Kashmiri sweet shops and bakeries.',
    packOptions: '5 kg, 10 kg, 25 kg',
  },
  {
    name: 'Afghan Pistachios (Pista)',
    highlight: true,
    desc: 'Authentic Afghan pistachios. Salted, unsalted and in-shell options available.',
    packOptions: '5 kg, 10 kg, 25 kg',
  },
  {
    name: 'Afghan Anjeer (Figs)',
    highlight: true,
    desc: 'Soft, high-quality dried figs from Afghanistan. Popular in Srinagar retail and gifting.',
    packOptions: '5 kg, 10 kg',
  },
  {
    name: 'Almonds (Badam)',
    highlight: false,
    desc: 'American and Kashmiri almonds available in bulk. California and Mamra varieties.',
    packOptions: '5 kg, 10 kg, 25 kg, 50 kg',
  },
  {
    name: 'Cashews (Kaju)',
    highlight: false,
    desc: 'W320 and W240 grade cashews for retail, bakeries and sweet shops.',
    packOptions: '5 kg, 10 kg, 25 kg',
  },
  {
    name: 'Walnuts (Akhrot)',
    highlight: false,
    desc: 'Shelled and unshelled walnuts. Sourced for quality and consistency.',
    packOptions: '5 kg, 10 kg, 25 kg',
  },
  {
    name: 'Dates (Khajoor)',
    highlight: false,
    desc: 'Medjool, Ajwa and Safawi dates. Popular year-round in J&K markets.',
    packOptions: '5 kg, 10 kg, 25 kg',
  },
  {
    name: 'Dried Apricots (Khubani)',
    highlight: false,
    desc: 'Afghan and local dried apricots. A Kashmiri staple with strong local demand.',
    packOptions: '5 kg, 10 kg',
  },
];

const businessTargets = [
  { icon: '🏪', title: 'Retailers in Srinagar', desc: 'Stock your shop with premium dry fruits at wholesale rates.' },
  { icon: '🥐', title: 'Bakeries', desc: 'Reliable bulk supply of almonds, raisins, and figs for baked goods.' },
  { icon: '🛒', title: 'Wholesalers', desc: 'Distribute to smaller retailers across J&K with our wholesale pricing.' },
  { icon: '🏨', title: 'Hotels & Resorts', desc: 'Premium dry fruits for hotel kitchens, restaurants and in-room amenities.' },
  { icon: '🍬', title: 'Sweet Shops', desc: 'Bulk nuts and raisins for traditional Kashmiri sweets and confections.' },
  { icon: '🍽️', title: 'Restaurants', desc: 'Quality dry fruits for cooking, garnishing and dessert preparation.' },
];

const howToOrder = [
  { step: '01', title: 'WhatsApp Our Kashmir Team', desc: 'Message our Kashmir sales team directly on WhatsApp with your requirements.' },
  { step: '02', title: 'Request a Quote', desc: 'Share product list and quantities. We respond with pricing within a few hours.' },
  { step: '03', title: 'Confirm Your Order', desc: 'Agree on pricing, confirm the order and complete payment.' },
  { step: '04', title: 'Delivery to Srinagar', desc: 'We arrange delivery to your business. GST invoice included.' },
];

const kashmirFaqs = [
  {
    q: 'Do you deliver to Srinagar?',
    a: 'Yes, we deliver to Srinagar. We serve businesses across J&K and are actively expanding our distribution network in the valley.',
  },
  {
    q: 'What is the MOQ for Kashmir orders?',
    a: 'The minimum order quantity is 5 kg per product. Combined orders are encouraged for better freight economics.',
  },
  {
    q: 'How long does delivery take to Kashmir?',
    a: 'Standard delivery to Srinagar takes 3–5 working days. We work with reliable logistics partners to ensure safe and timely delivery.',
  },
  {
    q: 'Do you have stock in Srinagar?',
    a: 'We are building local stock capacity in Srinagar. Some orders are dispatched from our Noida hub. Contact our Kashmir team for current availability.',
  },
  {
    q: 'Do you provide GST invoices?',
    a: 'Yes. All wholesale orders come with a proper GST invoice. GSTIN is required for B2B invoicing.',
  },
  {
    q: 'What Afghan dry fruits do you supply?',
    a: 'We specialize in Afghan raisins, Afghan pistachios, and Afghan anjeer (figs). These are among the most sought-after products for Kashmiri businesses.',
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                      */
/* ------------------------------------------------------------------ */
export default function KashmirWholesalePage() {
  const whatsappKashmir = process.env.NEXT_PUBLIC_WHATSAPP_KASHMIR ?? '';
  const phoneKashmir = process.env.NEXT_PUBLIC_PHONE_KASHMIR ?? '';
  const whatsappMessage = encodeURIComponent(
    'Hello Nuty Tales Kashmir team, I would like a wholesale quote for dry fruits.'
  );

  return (
    <>
      {/* JSON-LD */}
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
          <ol className="flex items-center gap-2 text-sm text-[#8B6F5E] flex-wrap">
            <li><Link href="/" className="hover:text-[#C8862A] transition-colors">Home</Link></li>
            <li className="text-[#C8862A]">/</li>
            <li><Link href="/wholesale-dry-fruits" className="hover:text-[#C8862A] transition-colors">Wholesale</Link></li>
            <li className="text-[#C8862A]">/</li>
            <li className="text-[#3D2B1F] font-medium">Kashmir</li>
          </ol>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#1B3A4B] via-[#2C5364] to-[#1B3A4B] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-block bg-[#C8862A] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              🏔️ Kashmir Wholesale
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Dry Fruit Wholesale Supplier in Kashmir
            </h1>
            <p className="text-lg sm:text-xl text-[#A8D8EA] mb-8 leading-relaxed">
              Supplying premium Afghan dry fruits and all major dry fruits to retailers, wholesalers, bakeries, hotels and businesses in Srinagar and across J&amp;K.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {whatsappKashmir && (
                <a
                  href={`https://wa.me/${whatsappKashmir}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-lg transition-colors text-sm tracking-wider uppercase"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Kashmir Team
                </a>
              )}
              <Link
                href="/bulk-quote"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#C8862A] hover:bg-[#A36E22] text-white font-bold rounded-lg transition-colors text-sm tracking-wider uppercase"
              >
                Get Kashmir Wholesale Price
              </Link>
            </div>
            {phoneKashmir && (
              <p className="mt-6 text-[#A8D8EA] text-sm">
                📞 Call: <a href={`tel:${phoneKashmir}`} className="underline hover:text-white">{phoneKashmir}</a>
                &nbsp;·&nbsp;📧 <a href="mailto:kashmir@nutytales.com" className="underline hover:text-white">kashmir@nutytales.com</a>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── About Supply in Kashmir ── */}
      <section className="py-16 px-4 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#3D2B1F] mb-5">
                Your Trusted Wholesale Dry Fruit Partner in J&amp;K
              </h2>
              <div className="space-y-4 text-[#5C3D2E] leading-relaxed">
                <p>
                  Nuty Tales supplies premium dry fruits to businesses across Jammu &amp; Kashmir. Our Kashmir operation focuses on delivering authentic Afghan dry fruits — raisins, pistachios, and anjeer — that are in constant demand across Srinagar&apos;s bustling retail, hospitality, and food sectors.
                </p>
                <p>
                  Srinagar is our primary service area, with active expansion to Baramulla, Anantnag, Pulwama, and other J&amp;K districts. We work with a dedicated Kashmir sales team to ensure fast communication, competitive pricing, and reliable delivery.
                </p>
                <p>
                  All wholesale orders come with proper GST invoices, making it easy for your business to manage procurement and claim input tax credit.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Srinagar', 'Baramulla', 'Anantnag', 'Pulwama', 'Budgam', 'Jammu'].map((area) => (
                  <span key={area} className="text-sm bg-white border border-[#E8DFD0] text-[#3D2B1F] px-3 py-1 rounded-full font-medium">
                    📍 {area}
                  </span>
                ))}
                <span className="text-sm bg-[#F5F0E8] text-[#C8862A] px-3 py-1 rounded-full font-medium">
                  + More expanding
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Afghan Products', value: '8+', sub: 'Speciality items' },
                { label: 'MOQ', value: '5 kg', sub: 'Per product' },
                { label: 'GST Invoice', value: '✓', sub: 'For all orders' },
                { label: 'Response', value: '24 hrs', sub: 'Quote turnaround' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-[#E8DFD0] p-6 text-center shadow-sm">
                  <div className="text-3xl font-black text-[#C8862A] mb-1">{stat.value}</div>
                  <div className="font-semibold text-[#3D2B1F] text-sm">{stat.label}</div>
                  <div className="text-[#8B6F5E] text-xs">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3D2B1F] mb-4">Products We Supply in Kashmir</h2>
            <p className="text-[#8B6F5E] text-lg">Afghan specialities and all major dry fruits at wholesale prices.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {kashmirProducts.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-5 border shadow-sm ${
                  p.highlight
                    ? 'bg-[#3D2B1F] border-[#5C3D2E] text-white'
                    : 'bg-[#FAF7F2] border-[#E8DFD0] text-[#3D2B1F]'
                }`}
              >
                {p.highlight && (
                  <span className="inline-block bg-[#C8862A] text-white text-xs font-bold px-2 py-0.5 rounded-full mb-3 uppercase tracking-wider">
                    Afghan Special
                  </span>
                )}
                <h3 className={`font-bold mb-2 ${p.highlight ? 'text-white' : 'text-[#3D2B1F]'}`}>{p.name}</h3>
                <p className={`text-sm leading-relaxed mb-3 ${p.highlight ? 'text-[#D4B896]' : 'text-[#8B6F5E]'}`}>
                  {p.desc}
                </p>
                <p className={`text-xs font-medium ${p.highlight ? 'text-[#C8862A]' : 'text-[#8B6F5E]'}`}>
                  📦 {p.packOptions}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/bulk-quote"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#C8862A] hover:bg-[#A36E22] text-white font-bold rounded-lg transition-colors uppercase tracking-wider text-sm"
            >
              Request Kashmir Wholesale Quote
            </Link>
          </div>
        </div>
      </section>

      {/* ── Who We Serve ── */}
      <section className="py-16 px-4 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3D2B1F] mb-4">Businesses We Serve in Kashmir</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {businessTargets.map((bt) => (
              <div key={bt.title} className="flex gap-4 bg-white rounded-2xl border border-[#E8DFD0] p-5 shadow-sm">
                <div className="text-3xl flex-shrink-0">{bt.icon}</div>
                <div>
                  <h3 className="font-bold text-[#3D2B1F] mb-1">{bt.title}</h3>
                  <p className="text-[#8B6F5E] text-sm leading-relaxed">{bt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Order ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3D2B1F] mb-4">How to Place a Kashmir Wholesale Order</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howToOrder.map((step) => (
              <div key={step.step} className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8DFD0] text-center">
                <div className="w-14 h-14 bg-[#1B3A4B] text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-[#3D2B1F] mb-2">{step.title}</h3>
                <p className="text-[#8B6F5E] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-16 px-4 bg-[#1B3A4B]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Contact Our Kashmir Sales Team</h2>
          <p className="text-[#A8D8EA] text-lg mb-8">
            Reach out directly for quotes, product availability and delivery timelines.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {whatsappKashmir && (
              <a
                href={`https://wa.me/${whatsappKashmir}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-5 px-6 rounded-2xl transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            )}
            {phoneKashmir && (
              <a
                href={`tel:${phoneKashmir}`}
                className="flex flex-col items-center gap-3 bg-[#2C5364] hover:bg-[#3a6b7e] text-white font-bold py-5 px-6 rounded-2xl transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Us
              </a>
            )}
            <a
              href="mailto:kashmir@nutytales.com"
              className="flex flex-col items-center gap-3 bg-[#C8862A] hover:bg-[#A36E22] text-white font-bold py-5 px-6 rounded-2xl transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          </div>

          {/* Arshid House Kashmir Location Card */}
          <div className="bg-white/10 p-6 rounded-2xl border border-white/20 text-left max-w-xl mx-auto space-y-2 mb-8 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9A45C] block">
              🏔️ Kashmir Hub &amp; Property Information
            </span>
            <p className="text-sm font-semibold text-white">
              Arshid House, Budgam–Gojra Road, Dadna, Budgam, Jammu and Kashmir 191111, India
            </p>
            <p className="text-xs text-stone-300">
              Valley farm procurement, Himalayan walnuts, Mamra almonds &amp; authentic craft aggregation.
            </p>
            <a
              href="https://www.google.com/maps/place/Arshid+House/@34.0087558,74.7060736,17z/data=!4m6!3m5!1s0x38e191f6e26e2615:0x437d1ccd908b0d4a!8m2!3d34.0087701!4d74.7086101!16s%2Fg%2F11t2ssyygj?entry=ttu&g_ep=EgoyMDI2MTAwNi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#C9A45C] hover:underline font-bold pt-1"
            >
              <span>Open Arshid House on Google Maps ↗</span>
            </a>
          </div>
          <Link
            href="/bulk-quote"
            className="inline-flex items-center justify-center px-10 py-4 bg-[#C8862A] hover:bg-[#A36E22] text-white font-bold rounded-lg transition-colors uppercase tracking-wider text-sm"
          >
            Get Kashmir Wholesale Price
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3D2B1F] mb-4">Kashmir Wholesale — FAQ</h2>
          </div>
          <div className="space-y-4">
            {kashmirFaqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-[#E8DFD0] p-6 shadow-sm">
                <h3 className="font-bold text-[#3D2B1F] mb-2">{faq.q}</h3>
                <p className="text-[#8B6F5E] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
