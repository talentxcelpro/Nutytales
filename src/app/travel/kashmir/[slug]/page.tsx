import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KASHMIR_TRAVEL_PACKAGES, type TravelPackage } from '@/lib/travel-data';
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants';
import { generatePageMetadata, buildBreadcrumbSchema, schemaToJsonLd } from '@/lib/seo/metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Special intent clusters mapped to packages
const INTENT_MAPPINGS: Record<string, { pkgSlug: string; customTitle: string; customTagline: string }> = {
  '7-days': {
    pkgSlug: 'kashmir-winter-wonderland',
    customTitle: 'Kashmir 7-Day Complete Valley Tour & Orchard Stay',
    customTagline: 'Extended 7-day private circuit: Srinagar, Gulmarg, Pahalgam, and Sonamarg with dedicated 4x4 SUV and bukhari retreat.',
  },
  '5-days': {
    pkgSlug: 'kashmir-winter-wonderland',
    customTitle: 'Kashmir 5-Day Highlights Itinerary & Private Guided Tour',
    customTagline: '5 days of pristine snow, Gondola heights, Dal Lake shikara rides, and warm Samovar kehwa hospitality.',
  },
  'family': {
    pkgSlug: 'autumn-chinar-harvest-trail',
    customTitle: 'Kashmir Family Vacation Package | Private Villas & Experiences',
    customTagline: 'Handcrafted family holiday in Kashmir with safe private transfers, orchard villa stays, and child-friendly activities.',
  },
  'honeymoon': {
    pkgSlug: 'kashmir-winter-wonderland',
    customTitle: 'Royal Kashmir Honeymoon Package | Luxury Stays & Shikara Cruise',
    customTagline: 'Romantic private Kashmir retreat: candlelight Wazwan dinners, flower-decked Shikara rides, and mountain views.',
  },
  'luxury': {
    pkgSlug: 'kashmir-winter-wonderland',
    customTitle: 'Luxury Kashmir Private Travel & VIP Orchard Villa Retreat',
    customTagline: 'Ultra-exclusive Kashmir journey with private chef, dedicated chauffeur, high-altitude alpine views, and concierge.',
  },
  'winter': {
    pkgSlug: 'kashmir-winter-wonderland',
    customTitle: 'Kashmir Winter Snow Safari & Gulmarg Ski Expedition',
    customTagline: 'Frozen Dal Lake, Phase 2 Gondola snow summits, fireside bukharis, and snowmobile trails.',
  },
};

export async function generateStaticParams() {
  const directSlugs = KASHMIR_TRAVEL_PACKAGES.map((p) => ({ slug: p.slug }));
  const intentSlugs = Object.keys(INTENT_MAPPINGS).map((k) => ({ slug: k }));
  return [...directSlugs, ...intentSlugs];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const intent = INTENT_MAPPINGS[slug];
  const pkg = intent
    ? KASHMIR_TRAVEL_PACKAGES.find((p) => p.slug === intent.pkgSlug)
    : KASHMIR_TRAVEL_PACKAGES.find((p) => p.slug === slug);

  if (!pkg) {
    return { title: 'Kashmir Tour | Nuty Tales Travel' };
  }

  const title = intent ? intent.customTitle : `${pkg.title} | Nuty Tales Travel`;
  const description = intent
    ? intent.customTagline
    : `${pkg.tagline}. Starting at ₹${pkg.basePricePerAdult.toLocaleString('en-IN')}/adult with boutique stay, private transport, and local guides.`;

  return generatePageMetadata({
    business: 'travel',
    pageType: 'package',
    intentType: 'transactional',
    slug: `/travel/kashmir/${slug}`,
    primaryKeyword: title,
    title: `${title} | Nuty Tales`,
    description,
    priceFrom: pkg.basePricePerAdult,
    currency: 'INR',
  });
}

export default async function TravelPackageSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const intent = INTENT_MAPPINGS[slug];
  const pkg = intent
    ? KASHMIR_TRAVEL_PACKAGES.find((p) => p.slug === intent.pkgSlug)
    : KASHMIR_TRAVEL_PACKAGES.find((p) => p.slug === slug);

  if (!pkg) {
    notFound();
  }

  const displayTitle = intent ? intent.customTitle : pkg.title;
  const displayTagline = intent ? intent.customTagline : pkg.tagline;
  const whatsappPhone = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '');

  const breadcrumbs = [
    { name: 'Home', url: 'https://nutytales.com' },
    { name: 'Travel', url: 'https://nutytales.com/travel' },
    { name: 'Kashmir', url: 'https://nutytales.com/travel/kashmir' },
    { name: displayTitle, url: `https://nutytales.com/travel/kashmir/${slug}` },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  // TouristTrip Schema
  const tripSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: displayTitle,
    description: displayTagline,
    touristType: intent ? slug : 'All',
    offers: {
      '@type': 'Offer',
      price: pkg.basePricePerAdult.toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `https://travel.nutytales.com/travel/kashmir/${slug}`,
    },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: pkg.itinerary.length,
      itemListElement: pkg.itinerary.map((day, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'TouristAttraction',
          name: day.title,
          description: day.desc,
        },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32 text-[#17233B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(tripSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#176B68]">Home</Link>
          <span>/</span>
          <Link href="/travel" className="hover:text-[#176B68]">Travel</Link>
          <span>/</span>
          <Link href="/travel/kashmir" className="hover:text-[#176B68]">Kashmir</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">{slug}</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
              🏔️ {pkg.duration} · {pkg.bestSeason}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
              From ₹{pkg.basePricePerAdult.toLocaleString('en-IN')} / Adult
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17233B] font-serif leading-tight">
            {displayTitle}
          </h1>
          <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
            {displayTagline}
          </p>
        </div>

        {/* Daily Itinerary */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8">
          <h2 className="text-2xl font-bold font-serif text-[#17233B]">Curated Day-by-Day Journey</h2>
          <div className="space-y-6">
            {pkg.itinerary.map((day) => (
              <div key={day.day} className="flex gap-4 border-l-2 border-[#176B68] pl-4 sm:pl-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#176B68] text-white flex items-center justify-center font-bold text-xs">
                  D{day.day}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#17233B]">{day.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{day.desc}</p>
                  <p className="text-xs text-[#176B68] font-semibold">Stay: {day.stay}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-emerald-800 flex items-center gap-2">
              <span>✓</span> What&apos;s Included
            </h3>
            <ul className="space-y-2 text-xs text-stone-600">
              {pkg.inclusions.map((inc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-stone-700 flex items-center gap-2">
              <span>✕</span> Exclusions
            </h3>
            <ul className="space-y-2 text-xs text-stone-500">
              {pkg.exclusions.map((exc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span>•</span>
                  <span>{exc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cross-business Internal Links (Kashmir Stays, Crafts, Gifting) */}
        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Complete Your Kashmir Journey With Nutty Tales
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/stays/kashmir"
              className="text-xs font-semibold text-[#176B68] hover:underline"
            >
              → Boutique Kashmir Stays &amp; Villas
            </Link>
            <span className="text-stone-300">|</span>
            <Link
              href="/crafts/kashmir"
              className="text-xs font-semibold text-[#176B68] hover:underline"
            >
              → Authentic Kashmiri Pashmina &amp; Craft Workshops
            </Link>
            <span className="text-stone-300">|</span>
            <Link
              href="/corporate-gifting"
              className="text-xs font-semibold text-[#176B68] hover:underline"
            >
              → Saffron &amp; Walnut Gift Hampers
            </Link>
          </div>
        </div>

        {/* Conversion Action */}
        <div className="bg-gradient-to-r from-[#17233B] via-[#176B68] to-[#214B39] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold">Customize &amp; Book This Kashmir Trip</h2>
            <p className="text-xs text-stone-200">
              Connect with our Srinagar concierge desk for immediate date checks and vehicle reservation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/travel/kashmir#tour-customizer"
              className="px-6 py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Customize Itinerary ↓
            </Link>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                `Hello Nuty Tales! 🏔️ I am inquiring about the ${displayTitle} (${pkg.duration}). Please check availability for my dates.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-white/20 shadow-md inline-flex items-center gap-1.5 transition-colors"
            >
              <span>WhatsApp Travel Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
