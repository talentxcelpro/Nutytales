import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STAY_PROPERTIES, type StayProperty } from '@/lib/stays-data';
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants';
import { generatePageMetadata, buildBreadcrumbSchema, buildLodgingSchema, schemaToJsonLd } from '@/lib/seo/metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const DESTINATION_MAPPINGS: Record<string, { title: string; subtitle: string; filterKey: string }> = {
  'kashmir': {
    title: 'Boutique Stays & Luxury Private Estates in Kashmir',
    subtitle: 'High-altitude orchard retreats in Srinagar, ski chalets in Gulmarg, and cedar houseboats on Nigeen Lake.',
    filterKey: 'Kashmir',
  },
  'srinagar': {
    title: 'Hotels & Private Orchard Villas in Srinagar',
    subtitle: 'Curated luxury accommodations with wood-burning bukharis, organic orchard breakfasts, and mountain panoramas.',
    filterKey: 'Srinagar',
  },
  'gulmarg': {
    title: 'Alpine Ski Chalets & Mountain Lodges in Gulmarg',
    subtitle: 'Direct ski access, Phase 1 & 2 Gondola proximity, heated suites, and mountain hospitality.',
    filterKey: 'Gulmarg',
  },
};

export async function generateStaticParams() {
  const propertySlugs = STAY_PROPERTIES.map((p) => ({ slug: p.slug }));
  const destinationSlugs = Object.keys(DESTINATION_MAPPINGS).map((d) => ({ slug: d }));
  return [...propertySlugs, ...destinationSlugs];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const prop = STAY_PROPERTIES.find((p) => p.slug === slug);
  const dest = DESTINATION_MAPPINGS[slug];

  if (prop) {
    return generatePageMetadata({
      business: 'stays',
      pageType: 'property',
      intentType: 'transactional',
      slug: `/stays/${slug}`,
      primaryKeyword: prop.name,
      title: `${prop.name} | ${prop.city} | Nutty Tales Stays`,
      description: `${prop.tagline}. ${prop.bedrooms} bedrooms, max ${prop.maxTotalGuests} guests. From ₹${prop.estateBuyoutPrice.toLocaleString('en-IN')}/night.`,
      priceFrom: prop.estateBuyoutPrice,
      currency: 'INR',
      location: prop.city,
    });
  }

  if (dest) {
    return generatePageMetadata({
      business: 'stays',
      pageType: 'destination',
      intentType: 'commercial',
      slug: `/stays/${slug}`,
      primaryKeyword: dest.title,
      title: `${dest.title} | Nutty Tales Stays`,
      description: dest.subtitle,
      location: slug.toUpperCase(),
    });
  }

  return { title: 'Boutique Stays | Nutty Tales' };
}

export default async function StaySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const prop = STAY_PROPERTIES.find((p) => p.slug === slug);
  const dest = DESTINATION_MAPPINGS[slug];

  if (!prop && !dest) {
    notFound();
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '');

  // 1. Single Property Page
  if (prop) {
    const breadcrumbs = [
      { name: 'Home', url: 'https://nutytales.com' },
      { name: 'Stays', url: 'https://nutytales.com/stays' },
      { name: prop.name, url: `https://nutytales.com/stays/${prop.slug}` },
    ];
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
    const lodgingSchema = buildLodgingSchema({
      name: prop.name,
      url: `https://stays.nutytales.com/stays/${prop.slug}`,
      description: prop.tagline,
      image: prop.featuredImage,
      addressLocality: prop.city,
      addressRegion: prop.state,
      addressCountry: prop.country,
      telephone: '+91 9717161809',
      priceRange: `₹${prop.estateBuyoutPrice.toLocaleString('en-IN')}`,
      starRating: 5,
      ratingValue: prop.rating,
      reviewCount: prop.reviewsCount,
    });

    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32 text-[#17233B]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaToJsonLd(lodgingSchema) }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-[#176B68]">Home</Link>
            <span>/</span>
            <Link href="/stays" className="hover:text-[#176B68]">Stays</Link>
            <span>/</span>
            <span className="text-stone-800 font-semibold">{prop.name}</span>
          </nav>

          {/* Hero */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                ⭐ {prop.rating} ({prop.reviewsCount} verified guest reviews)
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
                📍 {prop.locationNote}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17233B] font-serif leading-tight">
              {prop.name}
            </h1>
            <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
              {prop.tagline}
            </p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
              <span className="text-xs text-stone-500 block">Bedrooms</span>
              <span className="text-lg font-bold text-[#17233B]">{prop.bedrooms} Chambers</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
              <span className="text-xs text-stone-500 block">Capacity</span>
              <span className="text-lg font-bold text-[#17233B]">Up to {prop.maxTotalGuests} Guests</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
              <span className="text-xs text-stone-500 block">Connectivity</span>
              <span className="text-lg font-bold text-[#17233B]">{prop.wifiSpeedMbps} Mbps Fiber</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
              <span className="text-xs text-stone-500 block">Estate Buyout</span>
              <span className="text-lg font-bold text-emerald-700">₹{prop.estateBuyoutPrice.toLocaleString('en-IN')}/nt</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold font-serif text-[#17233B]">Residency Amenities &amp; Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prop.propertyAmenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cross Links */}
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Related Kashmir Experiences
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/travel/kashmir" className="text-xs font-semibold text-[#176B68] hover:underline">
                → Private Kashmir 4x4 Travel Packages
              </Link>
              <span className="text-stone-300">|</span>
              <Link href="/crafts/kashmir" className="text-xs font-semibold text-[#176B68] hover:underline">
                → Certified Kashmir Crafts &amp; Pashminas
              </Link>
            </div>
          </div>

          {/* Conversion CTA */}
          <div className="bg-gradient-to-r from-[#17233B] to-[#176B68] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold">Check Availability &amp; Reserve</h2>
              <p className="text-xs text-stone-200">
                Direct reservation with concierge. Instant confirmation and private airport transfer coordination.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/stays/group-quote"
                className="px-6 py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
              >
                Request Dates &amp; Quote
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `Hello Nuty Tales Concierge, I would like to check availability for ${prop.name} in ${prop.city}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-white/20 shadow-md inline-flex items-center gap-1.5 transition-colors"
              >
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Destination Collection Page (Kashmir, Srinagar, Gulmarg)
  if (dest) {
    const matchingProps = STAY_PROPERTIES.filter(
      (p) => p.hubZone === dest.filterKey || p.city.toLowerCase() === dest.filterKey.toLowerCase()
    );

    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32 text-[#17233B]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-[#176B68]">Home</Link>
            <span>/</span>
            <Link href="/stays" className="hover:text-[#176B68]">Stays</Link>
            <span>/</span>
            <span className="text-stone-800 font-semibold">{slug}</span>
          </nav>

          <div className="space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
              🏔️ BOUTIQUE COLLECTION · {slug.toUpperCase()}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17233B] font-serif leading-tight">
              {dest.title}
            </h1>
            <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
              {dest.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchingProps.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      ⭐ {p.rating} ({p.reviewsCount} reviews)
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      {p.bedrooms} Beds · {p.maxTotalGuests} Guests
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-serif text-[#17233B]">{p.name}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{p.tagline}</p>
                  <p className="text-xs text-stone-500">📍 {p.locationNote}</p>
                </div>
                <div className="p-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 block">Buyout from</span>
                    <span className="text-base font-bold text-emerald-700">₹{p.estateBuyoutPrice.toLocaleString('en-IN')}/nt</span>
                  </div>
                  <Link
                    href={`/stays/${p.slug}`}
                    className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    View Estate →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return notFound();
}
