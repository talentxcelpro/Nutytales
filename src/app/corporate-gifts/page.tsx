import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata, buildBreadcrumbSchema, schemaToJsonLd } from '@/lib/seo/metadata';
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants';

export const metadata: Metadata = generatePageMetadata({
  business: 'gifting',
  pageType: 'hub',
  intentType: 'commercial',
  slug: '/corporate-gifts',
  primaryKeyword: 'Corporate Gifts',
  title: 'Corporate Gifts & Luxury Dry Fruit Hampers | Nuty Tales Gifting',
  description: 'Premium corporate dry fruit hampers, Diwali gift boxes, employee welcome kits, and executive client tokens. Custom laser-engraved branding, Pan-India & Dubai delivery, GST invoices.',
});

export default function CorporateGiftsPage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '');

  const occasions = [
    {
      slug: 'diwali',
      name: 'Diwali Corporate Hampers',
      tagline: 'Festive gold-foiled rigid boxes with California almonds, W240 cashews, and saffron.',
      moq: 'MOQ: 25 Units',
      price: 'From ₹850 to ₹7,500',
    },
    {
      slug: 'employee-gifts',
      name: 'Employee Welcome & Onboarding',
      tagline: 'Energizing nut pouches, roasted makhana, and corporate-branded wellness boxes.',
      moq: 'MOQ: 10 Units',
      price: 'From ₹550 to ₹2,500',
    },
    {
      slug: 'client-gifts',
      name: 'Executive & VIP Client Gifts',
      tagline: 'Artisan walnut wood chests, single-origin Kashmiri walnuts, Medjool dates, and pure Acacia honey.',
      moq: 'MOQ: 5 Units',
      price: 'From ₹2,200 to ₹12,000',
    },
    {
      slug: 'diwali/dubai',
      name: 'Corporate Diwali Gifts Dubai',
      tagline: 'Turnkey GCC dispatch to offices in Dubai, Abu Dhabi, and Sharjah with customs clearance.',
      moq: 'MOQ: 50 Units',
      price: 'From AED 75 / Box',
    },
  ];

  const breadcrumbs = [
    { name: 'Home', url: 'https://nutytales.com' },
    { name: 'Gifting', url: 'https://nutytales.com/gifting' },
    { name: 'Corporate Gifts', url: 'https://nutytales.com/corporate-gifts' },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32 text-[#17233B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#176B68]">Home</Link>
          <span>/</span>
          <Link href="/gifting" className="hover:text-[#176B68]">Gifting</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Corporate Gifts</span>
        </nav>

        <div className="space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            🎁 B2B CORPORATE GIFTING &amp; FESTIVE RECOGNITION
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17233B] font-serif leading-tight">
            Corporate Gifts &amp; Premium Hampers
          </h1>
          <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
            Elevate executive relationships, celebrate company milestones, and honor employees with FSSAI-certified gourmet nuts, dried fruits, and bespoke corporate branding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {occasions.map((occ) => (
            <div key={occ.slug} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                    {occ.moq}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    {occ.price}
                  </span>
                </div>
                <h2 className="text-xl font-bold font-serif text-[#17233B]">{occ.name}</h2>
                <p className="text-xs text-stone-600 leading-relaxed">{occ.tagline}</p>
              </div>
              <div className="p-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href={`/corporate-gifts/${occ.slug}`}
                  className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs rounded-xl transition-colors"
                >
                  View Details &amp; Quote →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Services */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-serif text-[#17233B]">Enterprise Gifting Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
              <span className="text-xl block">👑</span>
              <strong className="text-stone-800 block text-sm">Company Logo Stamping</strong>
              <p>Hot-foil stamping, laser-engraved wooden lids, and custom Pantone ribbon.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
              <span className="text-xl block">🚚</span>
              <strong className="text-stone-800 block text-sm">Multi-City Direct Delivery</strong>
              <p>Direct doorstep dispatch to 500+ employee home addresses with tracking.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
              <span className="text-xl block">📄</span>
              <strong className="text-stone-800 block text-sm">GST Tax Invoices</strong>
              <p>Corporate purchase invoicing with input tax credit and bulk vendor terms.</p>
            </div>
          </div>
        </div>

        {/* Conversion Action */}
        <div className="bg-gradient-to-r from-[#17233B] to-[#176B68] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold">Request Corporate Gifting Catalogue</h2>
            <p className="text-xs text-stone-200">
              Receive our complete corporate pricing sheet and complimentary physical sample box.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gifting/designer"
              className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Design a Gift
            </Link>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                'Hello Nuty Tales! 🎁 I am inquiring about corporate gift hampers for our company. Please share catalogue and pricing.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-white/20 shadow-md inline-flex items-center gap-1.5 transition-colors"
            >
              <span>WhatsApp Gifting Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
