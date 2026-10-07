import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CRAFT_PRODUCTS, type CraftProduct } from '@/lib/crafts-data';
import { generatePageMetadata, buildBreadcrumbSchema, schemaToJsonLd } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  business: 'crafts',
  pageType: 'hub',
  intentType: 'commercial',
  slug: '/pashmina-shawls',
  primaryKeyword: 'Pashmina Shawls',
  title: 'Authentic Kashmir Pashmina Shawls | GI Tag Certified | Nutty Tales Crafts',
  description: '100% pure Changthangi Cashmere Pashmina shawls handwoven in the Kashmir Valley. GI Tag certified, sozni embroidery, kani loom weaves, micro-optical tested.',
});

export default function PashminaShawlsPage() {
  const pashminaItems = CRAFT_PRODUCTS.filter(
    (c) => c.category === 'shawls' || c.category === 'stoles' || c.tags.includes('pashmina')
  );

  const breadcrumbs = [
    { name: 'Home', url: 'https://nutytales.com' },
    { name: 'Crafts', url: 'https://nutytales.com/crafts' },
    { name: 'Pashmina Shawls', url: 'https://nutytales.com/pashmina-shawls' },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32 text-[#17233B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#176B68]">Home</Link>
          <span>/</span>
          <Link href="/crafts" className="hover:text-[#176B68]">Crafts</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Pashmina Shawls</span>
        </nav>

        <div className="space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            🏔️ GI-TAG CERTIFIED KASHMIR CASHMERE (14.5 MICRONS)
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17233B] font-serif leading-tight">
            Authentic Kashmir Pashmina Shawls
          </h1>
          <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
            Sourced directly from the nomadic Changpa herders of high-altitude Ladakh and woven on traditional wooden looms across the historic Shehr-e-Khaas guild quarters in Srinagar. Zero synthetic blends. Every piece accompanied by an individual provenance passport.
          </p>
        </div>

        {/* Provenance Guarantee Banner */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-2xl">📜</span>
            <h3 className="font-bold text-sm text-[#17233B]">GI-Tag Certification</h3>
            <p className="text-xs text-stone-600">Official Geographical Indication stamp from the Crafts Development Institute, Srinagar.</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl">🔬</span>
            <h3 className="font-bold text-sm text-[#17233B]">14.5 Micron Microfiber</h3>
            <p className="text-xs text-stone-600">Pure capra hircus underfleece harvested without harming the animal.</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl">🪡</span>
            <h3 className="font-bold text-sm text-[#17233B]">Master Weaver Guilds</h3>
            <p className="text-xs text-stone-600">Up to 240+ artisan hours per heirloom piece, signed by the master craftsman.</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pashminaItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] w-full bg-stone-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#704B32]">{item.categoryLabel}</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.provenance.giTagCertified ? 'GI Certified' : 'Authentic Handloom'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold font-serif text-[#17233B]">{item.name}</h2>
                  <p className="text-xs text-stone-600 line-clamp-2">{item.shortDesc}</p>
                  <p className="text-xs text-stone-500 pt-1">
                    <strong>Artisan:</strong> {item.provenance.artisanGroup}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-[#17233B]">₹{item.price.toLocaleString('en-IN')}</span>
                  {item.mrp && <span className="text-xs text-stone-400 line-through ml-2">₹{item.mrp.toLocaleString('en-IN')}</span>}
                </div>
                <Link
                  href={`/crafts/product/${item.slug}`}
                  className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs rounded-xl transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Conversion Action */}
        <div className="bg-gradient-to-r from-[#17233B] to-[#176B68] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold">Try Crafts with SI Visual Concierge</h2>
            <p className="text-xs text-stone-200">
              See how these shawls drape, request video consultations with our master artisan guilds, or order bespoke colors.
            </p>
          </div>
          <Link
            href="/crafts/try-with-si"
            className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            Try with SI Visual Concierge →
          </Link>
        </div>
      </div>
    </div>
  );
}
