import { PRODUCTS, Product } from '@/lib/products-data'
import { SUPPORTED_CURRENCIES, CurrencyCode, convertFromINR } from '@/lib/global-config'

export type RegionKey = 'me' | 'eu' | 'us'

export interface RegionalConfig {
  key: RegionKey
  subdomain: string
  canonicalDomain: string
  pathPrefix: string
  slugSuffix: string
  brandName: string
  offeringTitle: string
  tagline: string
  description: string
  defaultCurrency: CurrencyCode
  supportedCurrencies: CurrencyCode[]
  defaultLocale: string
  regionalHub: string
  shippingCarriers: string[]
  deliveryEstimate: string
  freeShippingThreshold: number // in default currency
  freeShippingLabel: string
  complianceBadge: string
  packagingDescription: string
  packagingBadge: string
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  supportedCountries: Array<{ code: string; name: string; flag: string }>
  highlights: Array<{ icon: string; title: string; desc: string }>
  faqs: Array<{ question: string; answer: string }>
}

export const REGIONAL_CONFIGS: Record<RegionKey, RegionalConfig> = {
  me: {
    key: 'me',
    subdomain: 'middleeast.nutytales.com',
    canonicalDomain: 'https://middleeast.nutytales.com',
    pathPrefix: '/me',
    slugSuffix: '-luxury-hamper',
    brandName: 'Nuty Tales Middle East',
    offeringTitle: 'GCC & Middle East Diaspora Luxury Hamper Delivery',
    tagline: 'Nuty Tales regional offering; GCC & Middle East diaspora delivery',
    description:
      'Curated Kashmiri gourmet hampers, Mamra almonds, royal Ajwa dates, and saffron delivered across UAE, Saudi Arabia, Qatar, Kuwait, Bahrain & Oman with zero recipient customs.',
    defaultCurrency: 'AED',
    supportedCurrencies: ['AED', 'SAR', 'USD'],
    defaultLocale: 'en-AE',
    regionalHub: 'Dubai Logistics City Hub (JAFZA) & Riyadh Air Cargo',
    shippingCarriers: ['Aramex Air Express', 'DHL Express Middle East', 'SMSA Express'],
    deliveryEstimate: '3 – 5 Days Doorstep Air Delivery across GCC',
    freeShippingThreshold: 350,
    freeShippingLabel: 'AED 350',
    complianceBadge: 'Dubai Municipality Food Safety & ESMA Certified · SFDA Registered',
    packagingDescription: 'Luxury Gold Foil & Silk-Lined Presentation Hamper Box with Custom Handwritten Arabic/English Gift Note',
    packagingBadge: 'Luxury Hamper Edition',
    heroBadge: 'GCC & Middle East Direct Dispatch',
    heroTitle: 'Exquisite Kashmiri Harvest & Luxury Hampers for the Middle East',
    heroSubtitle:
      'Direct farm-to-palace gourmet delivery across the GCC. Hand-picked Kashmiri Mamra almonds, saffron, raw high-altitude acacia honey, and premium royal Ajwa dates assembled in handcrafted luxury gift hampers.',
    supportedCountries: [
      { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
      { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
      { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
      { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
      { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
      { code: 'OM', name: 'Oman', flag: '🇴🇲' },
    ],
    highlights: [
      {
        icon: '✈️',
        title: 'Dubai JAFZA Hub Air Dispatch',
        desc: 'Direct refrigerated temperature-controlled flights from Srinagar to Dubai Logistics City with Aramex and DHL Express delivery.',
      },
      {
        icon: '👑',
        title: 'Silk-Lined Luxury Hampers',
        desc: 'Velvet-lined artisan trunks and engraved gold-accented jars designed for diaspora family gifting, Ramadan, Eid, and royal corporate hospitality.',
      },
      {
        icon: '🛡️',
        title: 'Pre-Cleared Customs (DDP)',
        desc: 'Delivered Duty Paid. Zero clearance delays, zero surprise import fees for recipients in Dubai, Abu Dhabi, Riyadh, or Doha.',
      },
      {
        icon: '🌾',
        title: '100% Halal & Pure Single-Origin',
        desc: 'Certified authentic Kashmiri farm harvest, chemical-free processing, ESMA and SFDA compliant batch telemetry.',
      },
    ],
    faqs: [
      {
        question: 'How fast is delivery to Dubai, Abu Dhabi, or Riyadh?',
        answer:
          'Orders dispatched from our JAFZA gateway hub reach doorstep addresses in Dubai, Abu Dhabi, and Sharjah within 48 to 72 hours. Deliveries to Riyadh, Jeddah, Dammam, Doha, and Kuwait City typically take 3 to 5 business days with full Aramex / DHL tracking.',
      },
      {
        question: 'Does the recipient need to pay customs or import duty in the GCC?',
        answer:
          'No. All orders on middleeast.nutytales.com are shipped Delivered Duty Paid (DDP). All GCC VAT and customs clearances are pre-settled by Nuty Tales Middle East.',
      },
      {
        question: 'Can I include a personalized bilingual message in the hamper?',
        answer:
          'Yes! Every luxury hamper comes with a complimentary gold-embossed keepsake card inscribed with your custom greeting in English and/or Arabic calligraphy.',
      },
      {
        question: 'Which payment methods are accepted for GCC customers?',
        answer:
          'We accept all major credit/debit cards (Visa, MasterCard, Amex), Apple Pay, Google Pay, Mada (Saudi Arabia), and direct international wire transfers.',
      },
    ],
  },

  eu: {
    key: 'eu',
    subdomain: 'europe.nutytales.com',
    canonicalDomain: 'https://europe.nutytales.com',
    pathPrefix: '/eu',
    slugSuffix: '-organic-heritage',
    brandName: 'Nuty Tales Europe',
    offeringTitle: 'UK & Europe Organic Dry Fruit & Heritage Delivery',
    tagline: 'Nuty Tales regional offering; UK & Europe organic dry fruit delivery',
    description:
      'Certified organic Himalayan harvest, unbleached Kashmiri walnuts, wild apricots, and raw acacia honey dispatched across the UK and European Union via Heathrow Gateway Hub.',
    defaultCurrency: 'EUR',
    supportedCurrencies: ['EUR', 'GBP', 'USD'],
    defaultLocale: 'en-GB',
    regionalHub: 'London Heathrow Gateway Hub & Frankfurt Cargo Depot',
    shippingCarriers: ['Royal Mail Special Delivery', 'DHL Express UK & Europe', 'DPD Europe'],
    deliveryEstimate: '4 – 7 Days Insured Tracked Doorstep Delivery',
    freeShippingThreshold: 85,
    freeShippingLabel: '€85 / £75',
    complianceBadge: 'UK Food Standards Agency (FSA) Import Compliant · EU Organic Importer Standard',
    packagingDescription: '100% Recyclable Biodegradable Kraft & Glass Heritage Pack with Vacuum Nitrogen Freshness Seal',
    packagingBadge: 'Organic Heritage Edition',
    heroBadge: 'UK & EU Organic Heritage Gateway',
    heroTitle: 'Certified Organic Himalayan Dry Fruits for the UK & Europe',
    heroSubtitle:
      'Pristine, chemical-free harvest grown in high-altitude glacier-fed valleys. Authentic Kashmiri Kagzi walnuts, wild forest apricots, single-origin Mamra almonds, and GI-tagged Pampore Mongra saffron delivered with zero customs friction.',
    supportedCountries: [
      { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
      { code: 'DE', name: 'Germany', flag: '🇩🇪' },
      { code: 'FR', name: 'France', flag: '🇫🇷' },
      { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
      { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
      { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
      { code: 'IT', name: 'Italy', flag: '🇮🇹' },
      { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    ],
    highlights: [
      {
        icon: '🌿',
        title: '100% Chemical-Free & Unbleached',
        desc: 'Traditional dry fruits in European markets are often chemically bleached. Nuty Tales guarantees zero sulfur, zero peroxide, and 100% raw tree-fresh integrity.',
      },
      {
        icon: '✈️',
        title: 'Heathrow Gateway Hub',
        desc: 'Direct air consolidation into London Heathrow for instant clearance under UK FSA and EU phyto-sanitary import guidelines.',
      },
      {
        icon: '🏷️',
        title: 'Geographical Indication (GI) Certified',
        desc: 'Every batch of Kashmiri saffron and walnuts features authentic GI traceability seals, verifying provenance to specific alpine orchard parcels.',
      },
      {
        icon: '♻️',
        title: 'Zero-Plastic Biodegradable Packaging',
        desc: 'Packaged in certified compostable kraft liners and reusable UV-shielded amber glass containers aligned with European sustainability goals.',
      },
    ],
    faqs: [
      {
        question: 'Are there any customs or Brexit fees for UK or EU customers?',
        answer:
          'No. All consignments are pre-cleared at our London Heathrow and Frankfurt gateways under unified customs tariff quotas. The price you pay at checkout is 100% final.',
      },
      {
        question: 'Are these dry fruits certified organic in Europe?',
        answer:
          'Our orchards in Kashmir and Ladakh practice multi-generational organic permaculture without synthetic pesticides or inorganic fertilizers. Batches are tested at accredited NABL and Eurofins laboratories.',
      },
      {
        question: 'How long does shipping take to mainland Europe (Germany, France, Netherlands)?',
        answer:
          'Mainland EU shipments are dispatched via DHL Express / DPD and arrive in 4 to 6 business days. UK mainland orders with Royal Mail Special Delivery arrive in 2 to 4 business days.',
      },
      {
        question: 'Can I pay in British Pounds (GBP) or Euros (EUR)?',
        answer:
          'Yes, you can toggle between EUR (€), GBP (£), and USD ($) at any time. Local payment methods including Apple Pay, Google Pay, Klarna, and SEPA are supported.',
      },
    ],
  },

  us: {
    key: 'us',
    subdomain: 'america.nutytales.com',
    canonicalDomain: 'https://america.nutytales.com',
    pathPrefix: '/us',
    slugSuffix: '-gourmet-orchard',
    brandName: 'Nuty Tales Americas',
    offeringTitle: 'US & Canada North American Distribution & Gourmet Orchard',
    tagline: 'Nuty Tales regional offering; US & Canada North American distribution',
    description:
      'Gourmet orchard selections, jumbo Mithila makhana, single-origin Mamra almonds, and Kashmiri walnuts distributed across all 50 US States and Canadian Provinces.',
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'CAD'],
    defaultLocale: 'en-US',
    regionalHub: 'New Jersey Air Port of Entry & California Distribution Hub',
    shippingCarriers: ['FedEx Priority Worldwide', 'UPS Worldwide Saver', 'USPS Priority Mail'],
    deliveryEstimate: '3 – 5 Days Expedited Delivery Across North America',
    freeShippingThreshold: 99,
    freeShippingLabel: '$99',
    complianceBadge: 'US FDA Food Facility Registered · Prior Notice Compliant · CFIA Import Approved',
    packagingDescription: 'Airtight Multi-Layer Nitrogen-Flushed Standup Barrier Pouch for Maximum Crispness & Shelf-Life',
    packagingBadge: 'Gourmet Orchard Edition',
    heroBadge: 'North American Direct Distribution',
    heroTitle: 'Gourmet Orchard Selections Distributed Across North America',
    heroSubtitle:
      'Bringing authentic Himalayan orchard harvest and Mithila wetland makhana directly to American and Canadian doorsteps. FDA compliant, nitrogen sealed, and expedited via FedEx Priority.',
    supportedCountries: [
      { code: 'US', name: 'United States (All 50 States)', flag: '🇺🇸' },
      { code: 'CA', name: 'Canada (All Provinces)', flag: '🇨🇦' },
    ],
    highlights: [
      {
        icon: '🇺🇸',
        title: 'US FDA Registered Food Facility',
        desc: 'Fully compliant with US FDA FSMA rules and Prior Notice confirmation, ensuring smooth, uninterrupted customs passage into Newark & LAX.',
      },
      {
        icon: '💨',
        title: 'Nitrogen-Flushed Crunch Lock',
        desc: 'Every bag of Mithila makhana and Kashmiri walnuts is nitrogen flushed in triple-barrier moisture-proof pouches to maintain orchard-gate crunch.',
      },
      {
        icon: '📦',
        title: 'Dual-Coast US/Canada Fulfillment',
        desc: 'Fulfillment operations coordinated through New Jersey (East Coast) and California (West Coast) for rapid FedEx doorstep delivery.',
      },
      {
        icon: '🍯',
        title: 'Authentic Single-Origin Harvest',
        desc: 'Direct trade relationships with smallholder orchardists and makhana harvesters—no industrial adulterants, no blending with cheap filler nuts.',
      },
    ],
    faqs: [
      {
        question: 'Is shipping free across the United States?',
        answer:
          'Yes! All orders over $99 qualify for Free Expedited FedEx Shipping across the 48 contiguous states. Flat-rate discounted air delivery is provided for Alaska, Hawaii, and Canadian provinces.',
      },
      {
        question: 'Are Nuty Tales food products compliant with US FDA and Canadian CFIA regulations?',
        answer:
          'Yes. Our processing and packaging facilities are registered with the US FDA (Food Facility Registration active) and all shipments carry automated Prior Notice documentation.',
      },
      {
        question: 'What is the shelf life upon arrival in North America?',
        answer:
          'Thanks to our vacuum nitrogen-flushing technology and multi-barrier foil packaging, dry fruits and makhana maintain peak freshness and sensory aroma for 9 to 12 months.',
      },
      {
        question: 'Can Canadian customers pay in Canadian Dollars (CAD)?',
        answer:
          'Yes! Toggle to CAD at the top of the store to browse and checkout seamlessly with automatic currency conversion and localized Canadian tax rates.',
      },
    ],
  },
}

export interface RegionalProductItem {
  baseProduct: Product
  regionalSlug: string
  regionalName: string
  regionalEditionTitle: string
  regionalPrice: number
  formattedPrice: string
  currency: CurrencyCode
  canonicalUrl: string
  packagingBadge: string
  regionKey: RegionKey
}

/**
 * Strips the regional suffix from a slug if present.
 */
export function cleanRegionalSlug(slug: string): string {
  if (!slug) return ''
  return slug
    .replace(/-luxury-hamper$/i, '')
    .replace(/-organic-heritage$/i, '')
    .replace(/-gourmet-orchard$/i, '')
}

/**
 * Returns formatted price for a given regional product in its default or selected currency
 */
export function formatRegionalCurrency(amountINR: number, currency: CurrencyCode): string {
  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.INR
  const converted = convertFromINR(amountINR, currency)
  const formatted = Math.round(converted).toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US')
  return config.symbolPosition === 'prefix' ? `${config.symbol}${formatted}` : `${formatted} ${config.symbol}`
}

/**
 * Generates all regional products for a specific region.
 */
export function getRegionalProducts(regionKey: RegionKey, currency?: CurrencyCode): RegionalProductItem[] {
  const config = REGIONAL_CONFIGS[regionKey]
  const targetCurrency = currency || config.defaultCurrency

  return PRODUCTS.map((prod) => {
    const regionalSlug = `${prod.slug}${config.slugSuffix}`
    const regionalPrice = Math.round(convertFromINR(prod.retailPrice, targetCurrency))
    const formattedPrice = formatRegionalCurrency(prod.retailPrice, targetCurrency)

    let regionalEditionTitle = `${prod.name} (${config.packagingBadge})`
    if (regionKey === 'me') {
      regionalEditionTitle = `${prod.name} — Luxury Gift Hamper`
    } else if (regionKey === 'eu') {
      regionalEditionTitle = `${prod.name} — Organic Heritage Pack`
    } else if (regionKey === 'us') {
      regionalEditionTitle = `${prod.name} — Gourmet Orchard Selection`
    }

    return {
      baseProduct: prod,
      regionalSlug,
      regionalName: prod.name,
      regionalEditionTitle,
      regionalPrice,
      formattedPrice,
      currency: targetCurrency,
      canonicalUrl: `${config.canonicalDomain}/store/${regionalSlug}`,
      packagingBadge: config.packagingBadge,
      regionKey,
    }
  })
}

/**
 * Resolves a single product by slug for a specific region.
 */
export function resolveRegionalProduct(
  slug: string,
  regionKey: RegionKey,
  currency?: CurrencyCode
): RegionalProductItem | undefined {
  const config = REGIONAL_CONFIGS[regionKey]
  const targetCurrency = currency || config.defaultCurrency
  const cleaned = cleanRegionalSlug(slug)

  // 1. Direct match on clean slug
  let matched = PRODUCTS.find((p) => p.slug === cleaned)

  // 2. Fallback search by inclusion
  if (!matched) {
    matched = PRODUCTS.find((p) => cleaned.includes(p.slug) || p.slug.includes(cleaned))
  }

  // 3. Fallback to first product if slug is generic or store
  if (!matched && (cleaned === 'store' || cleaned === 'luxury-hamper' || cleaned === 'organic-heritage' || cleaned === 'gourmet-orchard')) {
    matched = PRODUCTS[0]
  }

  if (!matched) return undefined

  const regionalSlug = `${matched.slug}${config.slugSuffix}`
  const regionalPrice = Math.round(convertFromINR(matched.retailPrice, targetCurrency))
  const formattedPrice = formatRegionalCurrency(matched.retailPrice, targetCurrency)

  let regionalEditionTitle = `${matched.name} (${config.packagingBadge})`
  if (regionKey === 'me') {
    regionalEditionTitle = `${matched.name} — Luxury Gift Hamper`
  } else if (regionKey === 'eu') {
    regionalEditionTitle = `${matched.name} — Organic Heritage Pack`
  } else if (regionKey === 'us') {
    regionalEditionTitle = `${matched.name} — Gourmet Orchard Selection`
  }

  return {
    baseProduct: matched,
    regionalSlug,
    regionalName: matched.name,
    regionalEditionTitle,
    regionalPrice,
    formattedPrice,
    currency: targetCurrency,
    canonicalUrl: `${config.canonicalDomain}/store/${regionalSlug}`,
    packagingBadge: config.packagingBadge,
    regionKey,
  }
}
