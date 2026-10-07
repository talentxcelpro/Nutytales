import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata, buildBreadcrumbSchema, schemaToJsonLd } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  business: 'weddings',
  pageType: 'hub',
  intentType: 'commercial',
  slug: '/destination-weddings',
  primaryKeyword: 'Destination Weddings',
  title: 'Destination Wedding Planning, Venues & Bespoke Gifting | Nutty Tales Weddings',
  description: 'Full-stack destination wedding orchestration across Kashmir, Dubai, and Udaipur. Verified heritage venues, hotel room block management, custom royal trousseau hampers, and Day-Of execution.',
});

export default function DestinationWeddingsHubPage() {
  const destinations = [
    {
      slug: 'kashmir',
      name: 'Kashmir Valley',
      tagline: 'Orchard lawns beneath snow peaks, Dal Lake shikara processions, and traditional Wazwan banquets.',
      venues: 'The Heritage Chinar Lawns, Harwan Orchard Estate, Gulmarg Alpine Chalets',
      guestCount: '100 – 500 Guests',
      budget: 'From ₹45 Lakh',
    },
    {
      slug: 'dubai',
      name: 'Dubai & Emirates',
      tagline: 'Desert luxury dunes, downtown sky villas, and turnkey PAN-Gulf dry fruit hamper dispatch.',
      venues: 'Private Desert Resorts, Palm Jumeirah Estates, Luxury Ballrooms',
      guestCount: '150 – 800 Guests',
      budget: 'From AED 120,000',
    },
    {
      slug: 'udaipur',
      name: 'Udaipur & Rajasthan',
      tagline: 'Royal lakefront palaces, brass-foiled trousseau trunks, and heritage hospitality.',
      venues: 'Lakefront Haveli Estates, Aravali Mountain Resorts',
      guestCount: '200 – 600 Guests',
      budget: 'From ₹65 Lakh',
    },
  ];

  const breadcrumbs = [
    { name: 'Home', url: 'https://nutytales.com' },
    { name: 'Weddings', url: 'https://nutytales.com/weddings' },
    { name: 'Destination Weddings', url: 'https://nutytales.com/destination-weddings' },
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
          <Link href="/weddings" className="hover:text-[#176B68]">Weddings</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Destination Weddings</span>
        </nav>

        <div className="space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            💍 FULL-STACK DESTINATION WEDDING ORCHESTRATION
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17233B] font-serif leading-tight">
            Curated Destination Weddings
          </h1>
          <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
            We connect couples with verified heritage venues, luxury room blocks, private ground transport, artisan wedding gifts, and seasoned Day-Of coordinators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <div key={d.slug} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="p-6 space-y-4">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  {d.guestCount}
                </span>
                <h2 className="text-xl font-bold font-serif text-[#17233B]">{d.name}</h2>
                <p className="text-xs text-stone-600 leading-relaxed">{d.tagline}</p>
                <div className="pt-2 border-t border-stone-100 space-y-1 text-xs text-stone-500">
                  <p><strong>Key Venues:</strong> {d.venues}</p>
                  <p><strong>Budget:</strong> {d.budget}</p>
                </div>
              </div>
              <div className="p-6 bg-stone-50 border-t border-stone-100">
                <Link
                  href={`/destination-weddings/${d.slug}`}
                  className="block w-full py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Explore {d.name} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Commercial Conversion Callout */}
        <div className="bg-gradient-to-r from-[#17233B] to-[#176B68] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold">Plan Your Destination Wedding with SI</h2>
            <p className="text-xs text-stone-200">
              Submit your dates and guest count. Receive a synchronized Blueprint covering venue, stays, fleet, and gifts.
            </p>
          </div>
          <Link
            href="/weddings/workspace"
            className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            Launch Wedding Workspace →
          </Link>
        </div>
      </div>
    </div>
  );
}
