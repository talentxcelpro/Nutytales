import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generatePageMetadata, buildBreadcrumbSchema, schemaToJsonLd } from '@/lib/seo/metadata';
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants';

interface PageProps {
  params: Promise<{ destination: string }>;
}

const DESTINATION_DATA: Record<string, {
  name: string;
  heroTag: string;
  title: string;
  desc: string;
  venues: string[];
  services: string[];
  pricingRange: string;
}> = {
  kashmir: {
    name: 'Kashmir Valley',
    heroTag: 'ROYAL MOUNTAIN CELEBRATIONS',
    title: 'Destination Wedding in Kashmir | Venues, Planners & Bespoke Hampers',
    desc: 'Exchange vows amidst blooming apple orchards, Chinar-shaded Mughal lawns, and panoramic views of Mt. Mahadev and Dal Lake. Turnkey coordination from airport shikaras to authentic Wazwan banquets.',
    venues: [
      'The Heritage Chinar Lawns (Srinagar)',
      'The Harwan Royal Walnut Orchard Estate',
      'Zabarwan Valley Pine Deck',
      'Nigeen Lake Luxury Cedar Flotilla',
    ],
    services: [
      'Full-Scale Day-Of Production & Stage Design',
      'Wazwan Master Chef 36-Course Banquet Execution',
      'Airport 4x4 Convoy & Shikara Guest Transfers',
      'Personalized Laser-Monogrammed Saffron & Dry Fruit Favours',
      'Changthangi Pashmina Wedding Favours for VIP Families',
    ],
    pricingRange: 'Packages starting from ₹35 Lakh for 150 Guests',
  },
  dubai: {
    name: 'Dubai & UAE',
    heroTag: 'EMIRATES LUXURY & DESERT ESTATES',
    title: 'Destination Wedding in Dubai | Luxury Planning & Indian Trousseau',
    desc: 'Opulent desert dune banquets and private downtown sky villas with authentic Kashmiri dry fruit trousseau hampers and Pan-Gulf customs clearance.',
    venues: [
      'Private Al Maha Desert Sanctuary',
      'Palm Jumeirah Oceanfront Villas',
      'Downtown Sky Ballroom',
    ],
    services: [
      'Destination Hospitality & Room Block Allocation',
      'Gulf Direct Air-Freight Dry Fruit Gifting with GCC Compliance',
      'Henna / Mehendi Kashmiri Saffron Artisans',
      'Bespoke Gold-Foil Calligraphy Monogramming',
    ],
    pricingRange: 'From AED 120,000 for 120 Guests',
  },
  italy: {
    name: 'Lake Como & Tuscany, Italy',
    heroTag: 'EUROPEAN HERITAGE ESTATES',
    title: 'Destination Weddings in Italy | Lake Como & Tuscan Villas',
    desc: 'Intimate royal Indian weddings at historic Italian lakeside villas with handcrafted Kashmiri cashmere stoles and heritage dry fruit presentation chests.',
    venues: [
      'Lake Como Waterfront Villa Grounds',
      'Tuscan Olive Grove Historic Farmhouse',
    ],
    services: [
      'Bilingual Event Coordinators & Guest Hospitality',
      'Export-Compliant Cashmere Stoles & Gift Curation',
      'Multi-Day Itinerary & Private Boat Charters',
    ],
    pricingRange: 'Custom Quotes via International Desk',
  },
};

export async function generateStaticParams() {
  return Object.keys(DESTINATION_DATA).map((destination) => ({ destination }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { destination } = await params;
  const data = DESTINATION_DATA[destination];
  if (!data) return { title: 'Destination Wedding | Nutty Tales' };

  return generatePageMetadata({
    business: 'weddings',
    pageType: 'destination',
    intentType: 'transactional',
    slug: `/destination-weddings/${destination}`,
    primaryKeyword: data.title,
    title: `${data.title} | Nutty Tales Weddings`,
    description: `${data.desc} ${data.pricingRange}.`,
    location: data.name,
  });
}

export default async function DestinationWeddingDetail({ params }: PageProps) {
  const { destination } = await params;
  const data = DESTINATION_DATA[destination];

  if (!data) {
    notFound();
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '');

  const breadcrumbs = [
    { name: 'Home', url: 'https://nutytales.com' },
    { name: 'Weddings', url: 'https://nutytales.com/weddings' },
    { name: 'Destination Weddings', url: 'https://nutytales.com/destination-weddings' },
    { name: data.name, url: `https://nutytales.com/destination-weddings/${destination}` },
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
          <Link href="/destination-weddings" className="hover:text-[#176B68]">Destination Weddings</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">{data.name}</span>
        </nav>

        <div className="space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            💍 {data.heroTag}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17233B] font-serif leading-tight">
            Destination Wedding in {data.name}
          </h1>
          <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
            {data.desc}
          </p>
        </div>

        {/* Venues & Production Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-serif text-[#17233B]">Curated Partner Venues</h2>
            <ul className="space-y-2">
              {data.venues.map((v, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                  <span className="text-[#C9A45C] font-bold">🏛️</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-serif text-[#17233B]">Turnkey Production Services</h2>
            <ul className="space-y-2">
              {data.services.map((s, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cross-Link Ecosystem */}
        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Connected Wedding Supply Chain
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/stays/kashmir" className="text-xs font-semibold text-[#176B68] hover:underline">
              → Book Hotel Room Blocks &amp; Private Villas
            </Link>
            <span className="text-stone-300">|</span>
            <Link href="/travel/kashmir" className="text-xs font-semibold text-[#176B68] hover:underline">
              → Coordinate Guest Airport Shuttles &amp; Shikaras
            </Link>
            <span className="text-stone-300">|</span>
            <Link href="/crafts/kashmir" className="text-xs font-semibold text-[#176B68] hover:underline">
              → Source Authentic Pashmina Wedding Favours
            </Link>
          </div>
        </div>

        {/* Conversion Action */}
        <div className="bg-gradient-to-r from-[#17233B] to-[#176B68] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold">Request a {data.name} Wedding Blueprint</h2>
            <p className="text-xs text-stone-200">
              {data.pricingRange}. Senior wedding stylist consultation with complimentary sample trunk.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/weddings/workspace"
              className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Build Blueprint
            </Link>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                `Hello Nuty Tales! 💍 I am inquiring about planning a destination wedding in ${data.name}. Please connect me with the wedding desk.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-white/20 shadow-md inline-flex items-center gap-1.5 transition-colors"
            >
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
