// ─── Nuty Tales Founder Program — Supply Chain & Growth Infrastructure ─────────
// "We help founders build. Source better. Launch faster. Grow smarter."
// Providing real commercial infrastructure: Sourcing, Private Label, Travel Inventory, Fashion, Packaging & Multi-Hub Fulfilment

export interface FounderSector {
  id: string
  name: string
  icon: string
  tagline: string
  idealFor: string[]
  whatWeProvide: string[]
  sampleCase: {
    startupName: string
    founderNeed: string
    nutytalesSolution: string
  }
}

export const FOUNDER_SECTORS: FounderSector[] = [
  {
    id: 'sec-d2c',
    name: 'D2C Food & Wellness Brands',
    icon: '📦',
    tagline: 'Dry fruits · healthy snacks · super seeds · makhana · gourmet foods',
    idealFor: ['Packaged dry-fruit startups', 'High-protein snack labels', 'Keto granola makers', 'Organic superfood brands'],
    whatWeProvide: [
      'Bulk certified ingredient sourcing (Almonds, Cashews, Walnuts, Makhana, Seeds)',
      'Custom nitrogen-flushed pouching (100g, 200g, 250g, 500g)',
      'Barcode, FSSAI & nutritional labeling compliance',
      'Multi-hub storage & PAN-India drop-shipping (Noida, Patna, Srinagar)',
    ],
    sampleCase: {
      startupName: 'Kashmir Wellness Co.',
      founderNeed: '1,000 units of 250g Kashmiri Mamra Almonds with custom matte pouch and Delhi NCR fulfilment.',
      nutytalesSolution: 'Nuty Tales sourced single-origin Mamra from Srinagar, custom-pouched at Noida HQ, and dispatched same-day to Amazon FBA.',
    },
  },
  {
    id: 'sec-travel',
    name: 'Travel Startups & Agencies',
    icon: '🏔️',
    tagline: 'Kashmir stays · 4x4 snow transfers · local guides · welcome hampers',
    idealFor: ['New travel agencies', 'Boutique tour operators', 'Kashmir honeymoon specialists', 'Adventure travel startups'],
    whatWeProvide: [
      'Inventory access to Nuty Tales Orchard Retreat & Villa (Srinagar)',
      'Dedicated sanitized 4x4 snow vehicles & airport transfers',
      'Local experienced guides and Gulmarg Gondola priority booking support',
      'Bespoke co-branded welcome hampers (Kagzi walnuts + saffron kahwa) placed in guest rooms',
    ],
    sampleCase: {
      startupName: 'Himalayan Escapes Agency',
      founderNeed: 'Curated 5-night Kashmir package for 40 luxury couples without owning hotels or transport in Srinagar.',
      nutytalesSolution: 'Nuty Tales provided complete ground operations: orchard villa suites, 4x4 snow fleet, private shikaras, and custom welcome hampers under the agency brand.',
    },
  },
  {
    id: 'sec-fashion',
    name: 'Fashion & Clothing Labels',
    icon: '🧣',
    tagline: 'Pashmina · Kani shawls · Pherans · velvet jackets · artisan heritage',
    idealFor: ['Ethnic-wear startups', 'Contemporary winter wear brands', 'Designer boutiques', 'Kashmir craft retailers'],
    whatWeProvide: [
      'Direct-from-loom sourcing of GI-certified Pashmina, Kani, and Tweed Pherans',
      'Custom fabric labels, hangtags, and presentation gift boxes',
      'Try with SI virtual drape integration for founder online stores',
      'Secure climate-controlled garment storage & insured shipping',
    ],
    sampleCase: {
      startupName: 'Noor Heritage Label',
      founderNeed: 'Boutique winter collection of 50 hand-embroidered velvet Pherans with custom branding.',
      nutytalesSolution: 'Connected to master Shehr-e-Khaas artisan guilds, tailored to modern silhouettes, branded with custom woven tags, and shipped worldwide.',
    },
  },
  {
    id: 'sec-hospitality',
    name: 'Boutique Hospitality & Stays',
    icon: '🏡',
    tagline: 'Boutique resorts · luxury estate villas · heritage retreats · private suites',
    idealFor: ['Heritage homestay owners', 'Hill-station villa hosts', 'Corporate guest-houses', 'Boutique hotel chains'],
    whatWeProvide: [
      'In-room minibar dry fruit amenity jars (Almonds, Cashews, Trail mix)',
      'Traditional Samovar Kehwa welcome kits with saffron & whole spices',
      'High-thread-count Kashmiri woolen throws & decorative walnut craft accents',
      'Recurring monthly pantry replenishment with automated billing',
    ],
    sampleCase: {
      startupName: 'Pine Mist Cottages (Manali)',
      founderNeed: 'Luxury welcome amenity hampers and breakfast dry fruit jars for 12 chalets.',
      nutytalesSolution: 'Supplied branded 100g vacuum glass jars with wooden lids and monthly automatic replenishment from Noida HQ.',
    },
  },
  {
    id: 'sec-fnb',
    name: 'Food & F&B Startups',
    icon: '🥐',
    tagline: 'Artisan bakeries · cafés · cloud kitchens · modern mithai innovators',
    idealFor: ['Sourdough bakers', 'Specialty dessert chefs', 'Modern mithai startups', 'Healthy snack cloud kitchens'],
    whatWeProvide: [
      'Micro-MOQ mechanical cuts (Sliced 1.0mm, slivered, stone-ground almond flour)',
      'Ultra-fresh white cashew splits for smooth Kaju Katli paste',
      'Pure Pampore Mongra saffron with >240 crocin strength',
      'Weekly kitchen delivery with low minimum order thresholds',
    ],
    sampleCase: {
      startupName: 'Crust & Crumb Patisserie',
      founderNeed: 'Weekly 25kg delivery of uniform blanched almond slices and fine almond meal for French macarons.',
      nutytalesSolution: 'Supplied precision-sliced 0.8mm dust-free almond flakes with weekly scheduled delivery from Noida.',
    },
  },
  {
    id: 'sec-gifting',
    name: 'Gifting & Event Companies',
    icon: '🎁',
    tagline: 'Corporate hamper businesses · wedding planners · celebration curators',
    idealFor: ['Bespoke hamper curators', 'Wedding planning agencies', 'Corporate relationship managers'],
    whatWeProvide: [
      'Unbranded / White-label dry fruit pouches and jars',
      'Empty designer packaging (Rigid magnetic boxes, walnut wood chests, potlis)',
      'Turnkey gift box kitting and multi-city address dispatch',
      'Flexible credit billing for established festive peak orders',
    ],
    sampleCase: {
      startupName: 'The Gift Atelier',
      founderNeed: '500 Diwali executive hampers requiring luxury wooden boxes, jumbo nuts, and 5-city delivery.',
      nutytalesSolution: 'Assembled, packaged, and dispatched all 500 boxes to Mumbai, Bengaluru, Delhi, Hyderabad, and Chennai within 48 hours.',
    },
  },
]

export const FOUNDER_TIERS = [
  {
    tier: 'STARTER',
    subtitle: 'For idea & pre-launch founders',
    moq: 'Small MOQ (from 10 kg / 50 units)',
    features: [
      'Access to direct origin agricultural pricing',
      'Free SI Founder Copilot planning session',
      'Sample kit with batch lab COA certificates',
      'Standard unbranded & custom pouch options',
      'Self-serve online ordering & WhatsApp concierge',
    ],
    cta: 'Start with Low MOQ',
  },
  {
    tier: 'GROWTH',
    subtitle: 'For brands with active traction & revenue',
    moq: 'Recurring 100 kg - 500 kg / month',
    features: [
      'Preferential tiered wholesale pricing (10% - 15% discount)',
      'Custom packaging design & plate creation assistance',
      'Private label contract packing at Noida facility',
      'Bi-weekly or monthly automated replenishment',
      'Dedicated B2B account specialist',
    ],
    cta: 'Scale Your Brand',
    highlighted: true,
  },
  {
    tier: 'SCALE',
    subtitle: 'For established brands & multi-city operations',
    moq: '1 Ton+ / Multi-location annual contract',
    features: [
      'Fixed 6-month price lock hedging on key ingredients',
      'Dedicated warehouse bay allocation (Noida / Patna / Srinagar)',
      'Multi-city scheduled delivery with unified invoicing',
      'Custom formulation blending and cleanroom bagging',
      'Direct access to Nuty Tales executive supply chain desk',
    ],
    cta: 'Enterprise Supply Agreement',
  },
]

export const FOUNDER_SERVICES = [
  {
    title: '1. SOURCE',
    subtitle: 'Direct Origin Farm & Artisan Access',
    desc: 'Bypass mandi middlemen. Source California almonds, Kashmiri walnuts & saffron, and Mithila makhana at verified transparent wholesale rates with startup-friendly batch sizes.',
    icon: '🌾',
  },
  {
    title: '2. PRIVATE LABEL',
    subtitle: 'We Source. We Pack. You Brand.',
    desc: 'From custom-printed matte pouches to nitrogen-flushed tins and rigid luxury boxes. We handle regulatory FSSAI labeling, batch barcoding, and packing under certified cleanrooms.',
    icon: '🏷️',
  },
  {
    title: '3. TRAVEL PARTNER SUPPLY',
    subtitle: 'Ground Infrastructure for Travel Agencies',
    desc: 'Sell high-margin Kashmir tours without setting up an office in Srinagar. Access our boutique orchard villa rooms, 4x4 snow fleet, mountain guides, and room welcome hampers.',
    icon: '🏔️',
  },
  {
    title: '4. CLOTHING & CRAFT LAB',
    subtitle: 'Turnkey Heritage Fashion Production',
    desc: 'Launch your winter ethnic label with verified GI Pashmina, Kani, and Tilla Pherans. We handle artisan guild aggregation, custom tag attachment, packaging, and shipping.',
    icon: '🧣',
  },
  {
    title: '5. PACKAGING LAB',
    subtitle: 'From Concept to Shelf-Ready Pack',
    desc: 'Pouches, rigid magnetic boxes, hand-carved walnut wood boxes, sleeves, stickers, QR codes. SI recommends 3 high-impact packaging formats optimized for your unit economics.',
    icon: '📦',
  },
  {
    title: '6. MULTI-HUB FULFILMENT',
    subtitle: 'Noida · Srinagar · Patna Architecture',
    desc: 'You do not need to lease a warehouse. Store your inventory across our strategically placed hubs for rapid next-day delivery across North, East, and Pan-India markets.',
    icon: '🚚',
  },
]
