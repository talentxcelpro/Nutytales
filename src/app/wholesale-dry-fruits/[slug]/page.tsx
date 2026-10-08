import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants';
import { INDUSTRIES, type IndustryProfile } from '@/lib/business-supply-data';
import { GEO_ENTITIES } from '@/lib/seo/geo';
import type { GeoEntity } from '@/lib/seo/types';
import { generatePageMetadata, buildBreadcrumbSchema, buildLocalBusinessSchema, buildOrganizationSchema, schemaToJsonLd } from '@/lib/seo/metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const industrySlugs = INDUSTRIES.map((i) => ({ slug: i.slug }));
  const citySlugs = ['delhi', 'mumbai', 'bangalore', 'bihar'];
  return [...industrySlugs, ...citySlugs.map((c) => ({ slug: c }))];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.slug === slug);
  const city = GEO_ENTITIES.find((g) => g.slug === slug);

  if (industry) {
    return generatePageMetadata({
      business: 'business',
      pageType: 'audience',
      intentType: 'b2b_procurement',
      slug: `/wholesale-dry-fruits/${slug}`,
      primaryKeyword: `Wholesale Dry Fruits for ${industry.name}`,
      title: `Wholesale Dry Fruits for ${industry.name} | Bulk Supply & Ingredients | Nuty Tales`,
      description: `Commercial dry fruit & nut ingredients for ${industry.name}. ${industry.tagline}. Graded cuts, vacuum packaging, FSSAI certified batch COA, and scheduled B2B supply.`,
    });
  }

  if (city) {
    return generatePageMetadata({
      business: 'business',
      pageType: 'location',
      intentType: 'local_commercial',
      slug: `/wholesale-dry-fruits/${slug}`,
      primaryKeyword: `Wholesale Dry Fruits in ${city.name}`,
      title: `Dry Fruit Wholesale Supplier in ${city.name} | B2B Bulk Supply | Nuty Tales`,
      description: `Wholesale dry fruits supplier serving ${city.name}. Bulk California almonds, W240/W320 cashews, raisins, walnuts, makhana. FSSAI Reg. ${FSSAI_NUMBER}, GST invoices, reliable dispatch.`,
    });
  }

  return {
    title: 'B2B Wholesale Dry Fruits | Nuty Tales',
  };
}

export default async function WholesaleSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.slug === slug);
  const city = GEO_ENTITIES.find((g) => g.slug === slug);

  if (!industry && !city) {
    notFound();
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.NOIDA || DEFAULT_CONTACT_PHONE).replace(/\D/g, '');

  if (industry) {
    const breadcrumbs = [
      { name: 'Home', url: 'https://nutytales.com' },
      { name: 'Wholesale Dry Fruits', url: 'https://nutytales.com/wholesale-dry-fruits' },
      { name: industry.name, url: `https://nutytales.com/wholesale-dry-fruits/${industry.slug}` },
    ];
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
    const orgSchema = buildOrganizationSchema({
      name: `Nuty Tales B2B — ${industry.name} Supply`,
      url: `https://nutytales.com/wholesale-dry-fruits/${industry.slug}`,
      description: industry.tagline,
    });

    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32 text-[#3D2B1F]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaToJsonLd(orgSchema) }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-[#D4870A]">Home</Link>
            <span>/</span>
            <Link href="/wholesale-dry-fruits" className="hover:text-[#D4870A]">Wholesale</Link>
            <span>/</span>
            <span className="text-stone-800 font-semibold">{industry.name}</span>
          </nav>

          {/* Hero */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{industry.icon}</span>
              <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-[#3D2B1F] text-xs font-bold border border-amber-300">
                INDUSTRIAL INGREDIENTS &amp; B2B PROCUREMENT
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3D2B1F] font-serif">
              Wholesale Dry Fruits &amp; Nuts for {industry.name}
            </h1>
            <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
              {industry.tagline}. Direct-origin procurement from Kashmir orchards, California growers, and Mithila wetland farms with precision mechanical cuts and batch-tested COA.
            </p>
          </div>

          {/* Primary Products & Cut Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-sm">
              <h2 className="text-lg font-bold text-[#3D2B1F]">Recommended Ingredient Grades</h2>
              <ul className="space-y-2">
                {industry.primaryProducts.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-stone-700">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-stone-100 text-xs text-stone-500">
                <strong>Typical Monthly Drawdown:</strong> {industry.typicalMonthlyKg}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-sm">
              <h2 className="text-lg font-bold text-[#3D2B1F]">Precision Cut &amp; Process Options</h2>
              <ul className="space-y-2">
                {industry.cutTypes.map((c, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-stone-700">
                    <span className="text-emerald-600 font-bold">▪</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-stone-100 text-xs text-stone-500">
                <strong>Food Safety Standard:</strong> {industry.fssaiStandard}
              </div>
            </div>
          </div>

          {/* Use Cases & Operational Benefits */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-6">
            <h2 className="text-xl font-bold font-serif text-[#3D2B1F]">Key Commercial Advantages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {industry.keyBenefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <span className="text-amber-600 text-base">★</span>
                  <span className="text-xs sm:text-sm text-stone-700">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Commercial Conversion Block */}
          <div className="bg-gradient-to-r from-[#D4870A] to-[#B8710A] text-white p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold">Request Industrial B2B Pricing</h2>
              <p className="text-xs text-amber-100">
                Lock in contract rates, request ingredient samples, or submit your specification sheet.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/bulk-quote"
                className="px-6 py-3 bg-white text-[#3D2B1F] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-stone-50 transition-colors"
              >
                Request RFQ / Sample
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `Hello Nuty Tales, I am looking for wholesale dry fruit ingredients for ${industry.name}. Please share technical specifications and pricing.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#2D6A4F] hover:bg-[#1E4D38] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-1.5 transition-colors"
              >
                <span>WhatsApp Procurement Desk</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // City Page
  if (city) {
    const breadcrumbs = [
      { name: 'Home', url: 'https://nutytales.com' },
      { name: 'Wholesale Dry Fruits', url: 'https://nutytales.com/wholesale-dry-fruits' },
      { name: city.name, url: `https://nutytales.com/wholesale-dry-fruits/${city.slug}` },
    ];
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
    const localSchema = buildLocalBusinessSchema({
      name: `Nuty Tales Wholesale Supply — ${city.name}`,
      url: `https://nutytales.com/wholesale-dry-fruits/${city.slug}`,
      addressLocality: city.name,
      addressCountry: 'India',
      description: `Wholesale dry fruits supplier serving ${city.name}. FSSAI certified bulk almonds, cashews, makhana.`,
      telephone: '+91 9717161809',
    });

    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32 text-[#3D2B1F]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaToJsonLd(localSchema) }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-[#D4870A]">Home</Link>
            <span>/</span>
            <Link href="/wholesale-dry-fruits" className="hover:text-[#D4870A]">Wholesale</Link>
            <span>/</span>
            <span className="text-stone-800 font-semibold">{city.name}</span>
          </nav>

          {/* Hero */}
          <div className="space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-[#3D2B1F] text-xs font-bold border border-amber-300">
              📍 B2B BULK DISPATCH &amp; WHOLESALE SUPPLY
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3D2B1F] font-serif">
              Dry Fruit Wholesale Supplier in {city.name}
            </h1>
            <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
              Nuty Tales supplies supermarkets, bakeries, mithai manufacturers, and corporate buyers across {city.name} with premium California almonds, W240/W320 cashews, raisins, pistachios, walnuts, and Phool Makhana with scheduled logistics and GST tax invoices.
            </p>
          </div>

          {/* Commercial Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2 shadow-sm">
              <span className="text-2xl">⚡</span>
              <h3 className="font-bold text-sm text-[#3D2B1F]">Scheduled {city.name} Delivery</h3>
              <p className="text-xs text-stone-600">Palletized freight and direct commercial transport with tracking and moisture-barrier packaging.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2 shadow-sm">
              <span className="text-2xl">📋</span>
              <h3 className="font-bold text-sm text-[#3D2B1F]">GST Tax Invoices &amp; HSN</h3>
              <p className="text-xs text-stone-600">100% compliant business invoices for seamless input tax credit and institutional audits.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2 shadow-sm">
              <span className="text-2xl">🌿</span>
              <h3 className="font-bold text-sm text-[#3D2B1F]">FSSAI Reg. {FSSAI_NUMBER}</h3>
              <p className="text-xs text-stone-600">Aflatoxin-tested, moisture-calibrated, and sorted kernels with zero foreign matter.</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="bg-gradient-to-r from-[#D4870A] to-[#B8710A] text-white p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Get Current {city.name} Wholesale Rates</h2>
              <p className="text-xs text-amber-100 mt-1">Direct communication with our regional commercial desk.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/bulk-quote"
                className="px-6 py-3 bg-white text-[#3D2B1F] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-stone-50 transition-colors"
              >
                Request Bulk Quote (RFQ)
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `Hello Nuty Tales, I need current wholesale dry fruit rates for ${city.name}. Please share price list.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#2D6A4F] hover:bg-[#1E4D38] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-1.5 transition-colors"
              >
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return notFound();
}
