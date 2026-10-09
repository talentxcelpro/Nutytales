/**
 * Nuty Tales SEO — Metadata Engine
 *
 * Generates unique, intent-driven metadata for every SEO page type.
 *
 * Rules:
 * - Titles follow intent-specific formulas (NOT keyword stacking)
 * - Meta descriptions must include a unique commercial hook
 * - Every page gets canonical + OpenGraph + robots directive
 * - Hreflang only when a genuine equivalent page exists in another language
 *
 * Integration: Call generatePageMetadata() from page.tsx files to get
 * a Next.js Metadata object ready to export.
 */

import type { Metadata } from 'next';
import type {
  SeoPage,
  SeoPageCandidate,
  NutyBusiness,
  SeoPageType,
  SeoIntentType,
  HreflangEntry,
  RobotsDirective,
} from './types';
import { BUSINESS_DOMAINS } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// BRAND CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_NAMES: Record<NutyBusiness, string> = {
  root:     'Nuty Tales',
  nri:      'Nuty Tales NRI',
  business: 'Nuty Tales Business',
  gifting:  'Nuty Tales Gifting',
  weddings: 'Nuty Tales Weddings',
  crafts:   'Nuty Tales Crafts',
  stays:    'Nuty Tales Stays',
  travel:   'Nuty Tales Travel',
};

// ─────────────────────────────────────────────────────────────────────────────
// TITLE GENERATION — INTENT-SPECIFIC FORMULAS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates the page <title> based on page type and intent.
 *
 * Formula examples:
 *   hub:           "Wholesale Dry Fruits | Bulk Supply India | Nuty Tales Business"
 *   product:       "California Almonds W240 — 1kg to 25kg | Buy Online | Nuty Tales"
 *   location:      "Wholesale Dry Fruits Noida | B2B Bulk Orders | Nuty Tales Business"
 *   destination:   "Kashmir Travel Packages 2026 | 5 to 10 Day Trips | Nuty Tales Travel"
 *   occasion:      "Corporate Gifts for Diwali — Dubai Delivery | Nuty Tales Gifting"
 */
export function buildTitle(params: {
  pageType: SeoPageType;
  intentType: SeoIntentType;
  business: NutyBusiness;
  primaryKeyword: string;
  location?: string;
  occasion?: string;
  attribute?: string;
}): string {
  const brand = BRAND_NAMES[params.business];
  const { pageType, intentType, primaryKeyword, location, occasion, attribute } = params;

  // Location-qualified commercial pages
  if (location && (intentType === 'transactional' || intentType === 'local_commercial' || intentType === 'b2b_procurement')) {
    return `${primaryKeyword} ${location} | ${attribute ?? 'Bulk Supply'} | ${brand}`;
  }

  // B2B procurement intent
  if (intentType === 'b2b_procurement' || intentType === 'rfq') {
    return `${primaryKeyword} | Wholesale & Bulk Supply | ${brand}`;
  }

  // Occasion-qualified
  if (occasion && pageType === 'occasion') {
    const loc = location ? ` — ${location} Delivery` : '';
    return `${primaryKeyword} for ${occasion}${loc} | ${brand}`;
  }

  // Product page
  if (pageType === 'product') {
    return `${primaryKeyword} | Buy Online | ${brand}`;
  }

  // Destination
  if (pageType === 'destination' || pageType === 'experience' || pageType === 'package') {
    const attr = attribute ? ` | ${attribute}` : '';
    return `${primaryKeyword}${attr} | ${brand}`;
  }

  // Property / Stay
  if (pageType === 'property') {
    const loc = location ? `, ${location}` : '';
    return `${primaryKeyword}${loc} | Book Stay | ${brand}`;
  }

  // Craft page
  if (pageType === 'craft') {
    return `${primaryKeyword} | Authentic Kashmir Craft | ${brand}`;
  }

  // Hub / Category
  return `${primaryKeyword} | ${brand}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// META DESCRIPTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a ~155-character meta description with a commercial hook.
 * Never keyword-stuffed. Always ends with a soft CTA.
 */
export function buildMetaDescription(params: {
  pageType: SeoPageType;
  intentType: SeoIntentType;
  business: NutyBusiness;
  primaryKeyword: string;
  location?: string;
  occasion?: string;
  priceFrom?: number;
  currency?: string;
  cta?: string;
  summary?: string;
}): string {
  const { primaryKeyword, location, occasion, priceFrom, currency, cta, summary, business, intentType } = params;

  if (summary && summary.length > 50) {
    // Use a provided editorial summary if it's substantive
    const truncated = summary.length > 140 ? summary.substring(0, 140) + '…' : summary;
    return truncated;
  }

  const pricePart = priceFrom
    ? ` Starting from ${currency ?? 'INR'} ${priceFrom.toLocaleString('en-IN')}.`
    : '';

  const locPart   = location  ? ` in ${location}` : '';
  const occPart   = occasion  ? ` for ${occasion}` : '';
  const ctaPart   = cta       ? ` ${cta}` : defaultCta(business, intentType);

  const base = `${primaryKeyword}${locPart}${occPart}.${pricePart}${ctaPart}`;
  return base.length > 160 ? base.substring(0, 157) + '…' : base;
}

function defaultCta(business: NutyBusiness, intent: SeoIntentType): string {
  const ctas: Partial<Record<NutyBusiness, string>> = {
    nri:      ' Request India-based assistance.',
    business: ' Get a bulk quote today.',
    gifting:  ' Design your gift now.',
    weddings: ' Request a wedding quote.',
    crafts:   ' Shop authentic Kashmir crafts.',
    stays:    ' Check availability and book.',
    travel:   ' Build your custom trip.',
  };
  if (intent === 'b2b_procurement' || intent === 'rfq') return ' Request an RFQ.';
  return ctas[business] ?? ' Enquire now.';
}

// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL URL
// ─────────────────────────────────────────────────────────────────────────────

export function buildCanonicalUrl(business: NutyBusiness, slug: string): string {
  const domain = BUSINESS_DOMAINS[business];
  const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
  // Enforce lowercase, hyphenated, no trailing slash (except root)
  const normalized = cleanSlug === '/' ? '/' : cleanSlug.toLowerCase().replace(/\/$/, '');
  return `${domain}${normalized}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROBOTS META
// ─────────────────────────────────────────────────────────────────────────────

function parseRobotsDirective(directive: RobotsDirective): Metadata['robots'] {
  switch (directive) {
    case 'index,follow':
      return { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } };
    case 'noindex,follow':
      return { index: false, follow: true };
    case 'noindex,nofollow':
      return { index: false, follow: false };
    case 'index,nofollow':
      return { index: true, follow: false };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL METADATA GENERATION
// ─────────────────────────────────────────────────────────────────────────────

export interface PageMetadataInput {
  business: NutyBusiness;
  pageType: SeoPageType;
  intentType: SeoIntentType;
  slug: string;
  primaryKeyword: string;
  title?: string;                // Override auto-generated title
  description?: string;          // Override auto-generated description
  h1?: string;
  location?: string;
  occasion?: string;
  attribute?: string;
  priceFrom?: number;
  currency?: string;
  heroImageUrl?: string;
  robotsDirective?: RobotsDirective;
  hreflangAlternates?: HreflangEntry[];
  publishedAt?: Date;
  updatedAt?: Date;
}

/**
 * Generates a complete Next.js Metadata object.
 * Import this in your page.tsx and export as `metadata` or return from `generateMetadata`.
 */
export function generatePageMetadata(input: PageMetadataInput): Metadata {
  const canonicalUrl = buildCanonicalUrl(input.business, input.slug);
  const brand = BRAND_NAMES[input.business];

  const title = input.title ?? buildTitle({
    pageType:       input.pageType,
    intentType:     input.intentType,
    business:       input.business,
    primaryKeyword: input.primaryKeyword,
    location:       input.location,
    occasion:       input.occasion,
    attribute:      input.attribute,
  });

  const description = input.description ?? buildMetaDescription({
    pageType:       input.pageType,
    intentType:     input.intentType,
    business:       input.business,
    primaryKeyword: input.primaryKeyword,
    location:       input.location,
    occasion:       input.occasion,
    priceFrom:      input.priceFrom,
    currency:       input.currency,
  });

  const robots = parseRobotsDirective(input.robotsDirective ?? 'index,follow');

  // Build alternates
  const alternates: NonNullable<Metadata['alternates']> = {
    canonical: canonicalUrl,
  };

  if (input.hreflangAlternates && input.hreflangAlternates.length > 0) {
    alternates.languages = Object.fromEntries(
      input.hreflangAlternates.map((h) => [h.hreflang, h.href])
    );
  }

  // OpenGraph image
  const ogImage = input.heroImageUrl ?? `${BUSINESS_DOMAINS[input.business]}/opengraph-image`;

  return {
    title,
    description,
    robots,
    alternates,
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      siteName: brand,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_IN',
      ...(input.updatedAt ? { modifiedTime: input.updatedAt.toISOString() } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@nutytales',
      title,
      description,
      images: [ogImage],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STRUCTURED DATA (JSON-LD) BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * BreadcrumbList schema — always use real breadcrumb hierarchy.
 */
export function buildBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * FAQPage schema — only include questions with genuine answers.
 */
export function buildFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Organization schema for business hub pages.
 */
export function buildOrganizationSchema(params: {
  name: string;
  url: string;
  description?: string;
  logo?: string;
  sameAs?: string[];
  contactPhone?: string;
  contactEmail?: string;
  addressLocality?: string;
  addressCountry?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: params.name,
    url: params.url,
    ...(params.description ? { description: params.description } : {}),
    ...(params.logo ? { logo: { '@type': 'ImageObject', url: params.logo } } : {}),
    ...(params.sameAs?.length ? { sameAs: params.sameAs } : {}),
    ...(params.contactPhone || params.contactEmail ? {
      contactPoint: {
        '@type': 'ContactPoint',
        ...(params.contactPhone ? { telephone: params.contactPhone } : {}),
        ...(params.contactEmail ? { email: params.contactEmail } : {}),
        contactType: 'customer service',
      },
    } : {}),
    ...(params.addressLocality ? {
      address: {
        '@type': 'PostalAddress',
        addressLocality: params.addressLocality,
        addressCountry: params.addressCountry ?? 'IN',
      },
    } : {}),
  };
}

/**
 * Product schema — only call when the product is genuinely purchasable
 * with real, verified data. NEVER fabricate prices or availability.
 */
export function buildProductSchema(params: {
  name: string;
  description: string;
  image: string;
  sku?: string;
  brand?: string;
  priceCurrency: string;
  price: number;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
  reviewCount?: number;
  ratingValue?: number;
}) {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: params.name,
    description: params.description,
    image: params.image,
    offers: {
      '@type': 'Offer',
      priceCurrency: params.priceCurrency,
      price: params.price.toString(),
      availability: `https://schema.org/${params.availability}`,
      url: params.url,
    },
  };

  if (params.sku)   base.sku   = params.sku;
  if (params.brand) base.brand = { '@type': 'Brand', name: params.brand };

  // Only add AggregateRating if we have genuine, verified reviews
  if (params.reviewCount && params.reviewCount > 0 && params.ratingValue) {
    base.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: params.ratingValue,
      reviewCount: params.reviewCount,
    };
  }

  return base;
}

/**
 * LocalBusiness schema for location-specific pages.
 */
export function buildLocalBusinessSchema(params: {
  name: string;
  url: string;
  addressLocality: string;
  addressRegion?: string;
  addressCountry: string;
  description?: string;
  telephone?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string[];
  priceRange?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: params.name,
    url: params.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: params.addressLocality,
      ...(params.addressRegion ? { addressRegion: params.addressRegion } : {}),
      addressCountry: params.addressCountry,
    },
    ...(params.description ? { description: params.description } : {}),
    ...(params.telephone ? { telephone: params.telephone } : {}),
    ...(params.latitude && params.longitude ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: params.latitude,
        longitude: params.longitude,
      },
    } : {}),
    ...(params.openingHours ? { openingHours: params.openingHours } : {}),
    ...(params.priceRange ? { priceRange: params.priceRange } : {}),
  };
}

/**
 * LodgingBusiness / Hotel schema for stays pages.
 */
export function buildLodgingSchema(params: {
  name: string;
  url: string;
  description: string;
  image: string;
  addressLocality: string;
  addressRegion?: string;
  addressCountry: string;
  telephone?: string;
  priceRange?: string;
  starRating?: number;
  reviewCount?: number;
  ratingValue?: number;
  latitude?: number;
  longitude?: number;
}) {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: params.name,
    url: params.url,
    description: params.description,
    image: params.image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: params.addressLocality,
      ...(params.addressRegion ? { addressRegion: params.addressRegion } : {}),
      addressCountry: params.addressCountry,
    },
    ...(params.telephone ? { telephone: params.telephone } : {}),
    ...(params.priceRange ? { priceRange: params.priceRange } : {}),
    ...(params.starRating ? { starRating: { '@type': 'Rating', ratingValue: params.starRating } } : {}),
    ...(params.latitude && params.longitude ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: params.latitude,
        longitude: params.longitude,
      },
    } : {}),
  };

  // AggregateRating only from real, verified guest reviews
  if (params.reviewCount && params.reviewCount > 0 && params.ratingValue) {
    base.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: params.ratingValue,
      reviewCount: params.reviewCount,
    };
  }

  return base;
}

/**
 * Renders a JSON-LD block as a Next.js-compatible script tag object.
 * Use in page.tsx like: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 */
export function schemaToJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema);
}
