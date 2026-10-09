// ─── Static Product Catalog ────────────────────────────────────────────────────
// 25 products across 12 categories with full pricing tiers

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

export interface PriceTier {
  minQtyKg: number
  maxQtyKg: number | null // null = 100+
  pricePerKg: number
  savingsPercent: number
}

export interface ProductVariant {
  sizeG: number
  label: string
  retailPrice: number // actual retail price for this size
  mrp?: number        // if different from retailPrice (for strikethrough)
}

export interface NutritionInfo {
  servingSize: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sodium?: number
}

export interface SensoryProfile {
  tastingNotes?: string[]
  altitude?: string
  harvestSeason?: string
  oilIndex?: string
  crunchScore?: number
  secondaryImage?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  category: string
  categorySlug: string
  origin: string
  grade: string
  shortDesc: string
  longDesc: string
  retailPrice: number   // 1kg retail price (base price for display)
  b2bPricePerKg: number // base wholesale price/kg
  mrp?: number          // MRP if different
  variants: ProductVariant[]
  b2bTiers: PriceTier[]
  stockStatus: StockStatus
  image?: string
  images?: string[]
  sensory?: SensoryProfile
  isFeatured: boolean
  shelfLifeMonths: number
  storage: string
  allergens: string
  nutrition: NutritionInfo
  tags: string[]
}

// ─── B2B Tier helper ────────────────────────────────────────────────────────────
function buildTiers(baseKgPrice: number): PriceTier[] {
  return [
    { minQtyKg: 5,   maxQtyKg: 9,   pricePerKg: Math.round(baseKgPrice * 0.95), savingsPercent: 5  },
    { minQtyKg: 10,  maxQtyKg: 24,  pricePerKg: Math.round(baseKgPrice * 0.92), savingsPercent: 8  },
    { minQtyKg: 25,  maxQtyKg: 49,  pricePerKg: Math.round(baseKgPrice * 0.88), savingsPercent: 12 },
    { minQtyKg: 50,  maxQtyKg: 99,  pricePerKg: Math.round(baseKgPrice * 0.85), savingsPercent: 15 },
    { minQtyKg: 100, maxQtyKg: null, pricePerKg: 0, savingsPercent: 0 }, // contact for quote
  ]
}

// ─── Variant helper ─────────────────────────────────────────────────────────────
function buildVariants(pricePerKg: number, mrpMultiplier = 1.18): ProductVariant[] {
  return [
    { sizeG: 250,  label: '250g',  retailPrice: Math.round(pricePerKg * 0.25 * 1.05), mrp: Math.round(pricePerKg * 0.25 * 1.05 * mrpMultiplier) },
    { sizeG: 500,  label: '500g',  retailPrice: Math.round(pricePerKg * 0.50 * 1.04), mrp: Math.round(pricePerKg * 0.50 * 1.04 * mrpMultiplier) },
    { sizeG: 1000, label: '1 kg',  retailPrice: pricePerKg, mrp: Math.round(pricePerKg * mrpMultiplier) },
  ]
}

// ─── Product Catalog ────────────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  // ── Almonds (3) ──────────────────────────────────────────────────────────────
  {
    id: 'alm-001',
    name: 'California Almonds Premium',
    slug: 'california-almonds-premium',
    category: 'Almonds',
    categorySlug: 'almonds',
    origin: 'California, USA',
    grade: 'Grade A',
    shortDesc: 'Extra-large, crunchy California almonds with rich flavour — perfect for snacking, baking, and gifting.',
    longDesc: `Our California Almonds are sourced directly from certified farms in the San Joaquin Valley. Every batch is hand-selected for uniform size, superior crunch, and rich natural flavour. Free from artificial additives and preservatives. These almonds are perfect for daily snacking, baking, smoothies, milk preparation, and corporate gifting.\n\nNuty Tales almonds are FSSAI-certified, vacuum-packed to preserve freshness, and available in retail packs as well as wholesale sacks for businesses, cloud kitchens, and HORECA buyers.`,
    retailPrice: 1250,
    b2bPricePerKg: 1120,
    mrp: 1499,
    variants: buildVariants(1250),
    b2bTiers: buildTiers(1120),
    stockStatus: 'IN_STOCK',
    image: '/images/almonds-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Crisp Snap', 'Toasted Sweetness', 'Mild Almond Cream'],
      altitude: 'San Joaquin Valley, California',
      harvestSeason: 'Late Summer 2025',
      oilIndex: '46% Natural Healthy Fats',
      crunchScore: 5,
      secondaryImage: '/images/mamra-kernels-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Store in a cool, dry place below 25°C. Refrigerate after opening.',
    allergens: 'Tree Nuts (Almonds). Manufactured in a facility that handles other tree nuts.',
    nutrition: { servingSize: '30g', calories: 173, protein: 6, carbs: 6, fat: 15, fiber: 3.5, sodium: 0 },
    tags: ['almonds', 'california', 'premium', 'grade-a', 'snacking'],
  },
  {
    id: 'alm-002',
    name: 'Mamra Almonds (Kashmiri Badam)',
    slug: 'mamra-almonds-kashmiri-badam',
    category: 'Almonds',
    categorySlug: 'almonds',
    origin: 'Kashmir, India',
    grade: 'Grade A+',
    shortDesc: 'Rare thin-shelled Mamra almonds from Kashmir — exceptionally nutritious and prized for medicinal use.',
    longDesc: `Mamra Almonds (also called Kashmiri Badam) are considered the finest variety of almonds in the world. Unlike California almonds, Mamra almonds are cultivated in the high altitudes of Kashmir and Afghanistan. They are smaller, wrinkled, and oil-rich — containing up to 50% more oil than California almonds.\n\nTraditionally used in Unani and Ayurvedic medicine, they are prized for brain health, skin nourishment, and energy. Nuty Tales sources these directly from farms in the Kashmir Valley, ensuring zero adulteration.`,
    retailPrice: 4200,
    b2bPricePerKg: 3600,
    mrp: 4999,
    variants: buildVariants(4200),
    b2bTiers: buildTiers(3600),
    stockStatus: 'IN_STOCK',
    image: '/images/mamra-almonds-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Rich Cold-Pressed Butter', 'Subtle Pine Honey', 'Dense Crunch'],
      altitude: '1,650m (Pulwama Valley)',
      harvestSeason: 'Autumn 2025 Reserve',
      oilIndex: '52% Natural Oils (Rare High)',
      crunchScore: 5,
      secondaryImage: '/images/mamra-kernels-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 18,
    storage: 'Store in an airtight container in a cool, dry place. Best kept refrigerated.',
    allergens: 'Tree Nuts (Almonds). Manufactured in a facility that handles other tree nuts.',
    nutrition: { servingSize: '30g', calories: 185, protein: 6.5, carbs: 5, fat: 17, fiber: 3, sodium: 0 },
    tags: ['almonds', 'mamra', 'kashmir', 'premium', 'kashmiri-badam'],
  },
  {
    id: 'alm-003',
    name: 'Roasted Salted Almonds',
    slug: 'roasted-salted-almonds',
    category: 'Almonds',
    categorySlug: 'almonds',
    origin: 'California, USA',
    grade: 'Grade A',
    shortDesc: 'Perfectly roasted and lightly salted California almonds — the ultimate snacking companion.',
    longDesc: `Our Roasted Salted Almonds are dry-roasted in small batches to bring out their natural sweetness, then lightly seasoned with Himalayan pink salt. No oil added in the roasting process. Great for on-the-go snacking, party mixes, and gift hampers. These are popular with gym-goers, office workers, and health-conscious families.`,
    retailPrice: 1380,
    b2bPricePerKg: 1220,
    mrp: 1650,
    variants: buildVariants(1380),
    b2bTiers: buildTiers(1220),
    stockStatus: 'IN_STOCK',
    image: '/images/almonds-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 6,
    storage: 'Store in a cool, dry place. Once opened, consume within 30 days.',
    allergens: 'Tree Nuts (Almonds), Salt. May contain traces of peanuts.',
    nutrition: { servingSize: '30g', calories: 178, protein: 6, carbs: 6.5, fat: 15, fiber: 3.5, sodium: 95 },
    tags: ['almonds', 'roasted', 'salted', 'snacking'],
  },
  {
    id: 'alm-004',
    name: 'Kashmiri Kagzi Badam (Soft Shell)',
    slug: 'kashmiri-kagzi-badam-soft-shell',
    category: 'Almonds',
    categorySlug: 'almonds',
    origin: 'Kashmir Valley, India',
    grade: 'Kagzi Grade A',
    shortDesc: 'Traditional Kashmiri paper-shell whole almonds — easily cracked by hand, bursting with natural mountain oils.',
    longDesc: `Harvested from the high-altitude orchards of Kashmir, our Kagzi Badam are prized for their soft, paper-thin shell that cracks open effortlessly between two fingers. Inside lies a pure, unblemished almond kernel rich in vitamin E, dietary fiber, and natural omega oils.\n\nUnlike commercially imported varieties, Kashmiri Kagzi almonds are non-GMO, sun-dried naturally, and unpolished. Ideal for festive gifting, Ayurvedic preparations, and daily family nourishment.`,
    retailPrice: 1150,
    b2bPricePerKg: 980,
    mrp: 1399,
    variants: buildVariants(1150),
    b2bTiers: buildTiers(980),
    stockStatus: 'IN_STOCK',
    image: '/images/kashmir-kagzi-badam-250g.jpg',
    isFeatured: true,
    shelfLifeMonths: 18,
    storage: 'Store in a cool, dry place. Crack open fresh for best flavor.',
    allergens: 'Tree Nuts (Almonds).',
    nutrition: { servingSize: '30g', calories: 175, protein: 6, carbs: 5.5, fat: 15.5, fiber: 3.5, sodium: 0 },
    tags: ['almonds', 'kashmiri-badam', 'kagzi', 'kashmir', 'soft-shell', 'natural'],
  },
  {
    id: 'alm-005',
    name: 'Gurbandi Badam (High-Oil Afghan Almonds)',
    slug: 'gurbandi-badam-afghan-almonds',
    category: 'Almonds',
    categorySlug: 'almonds',
    origin: 'Gurband Valley, Afghanistan',
    grade: 'Grade A Chhoti Giri',
    shortDesc: 'Small, unpolished high-oil Afghan almonds with intense therapeutic nutrients and rich bittersweet undertone.',
    longDesc: `Gurbandi Almonds (also known as Chhoti Giri Badam) originate from the rugged high-altitude valleys of Afghanistan. While physically smaller than California almonds, Gurbandi badam contains extraordinarily high concentrations of natural cold-pressed oils and antioxidants.\n\nPrized in Ayurvedic and Unani traditions for brain tonic memory enhancement, eyesight, and joint health. 100% raw, unpasteurized, unbleached, and non-GMO.`,
    retailPrice: 1850,
    b2bPricePerKg: 1620,
    mrp: 2250,
    variants: buildVariants(1850),
    b2bTiers: buildTiers(1620),
    stockStatus: 'IN_STOCK',
    image: '/images/gurbandi-almonds-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Deep Cold-Pressed Oil', 'Subtle Herbal Bittersweet', 'Dense Firm Snap'],
      altitude: 'Gurband Highlands (2,100m)',
      harvestSeason: 'Autumn 2025 Reserve',
      oilIndex: '54% Rare High Medicinal Oils',
      crunchScore: 5,
      secondaryImage: '/images/mamra-kernels-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 18,
    storage: 'Store in an airtight jar in a cool, shaded environment.',
    allergens: 'Tree Nuts (Almonds).',
    nutrition: { servingSize: '30g', calories: 188, protein: 6.8, carbs: 4.8, fat: 17.5, fiber: 3.2, sodium: 0 },
    tags: ['almonds', 'gurbandi', 'afghanistan', 'chhoti-giri', 'high-oil', 'ayurvedic'],
  },


  // ── Cashews (3) ──────────────────────────────────────────────────────────────
  {
    id: 'csw-001',
    name: 'W240 Premium Cashews',
    slug: 'w240-premium-cashews',
    category: 'Cashews',
    categorySlug: 'cashews',
    origin: 'Goa & Kerala, India',
    grade: 'W240',
    shortDesc: 'Large W240 grade whole cashews — creamy, rich, and perfect for sweets, curries, and gifting.',
    longDesc: `W240 refers to the count of cashews per pound — 240 pieces, which means extra-large, whole, and beautifully white kernels. Our W240 cashews are sourced from coastal Karnataka and Goa where cashew cultivation is a centuries-old tradition.\n\nIdeal for mithai shops, restaurants, bakeries, and retail consumers. Packed in moisture-proof packaging to preserve freshness. Available for bulk orders with GST invoice.`,
    retailPrice: 1450,
    b2bPricePerKg: 1280,
    mrp: 1750,
    variants: buildVariants(1450),
    b2bTiers: buildTiers(1280),
    stockStatus: 'IN_STOCK',
    image: '/images/cashews-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Velvety Sweet Cream', 'Silky Melt', 'Subtle Cashew Fruit'],
      altitude: 'Coastal Karnataka & Goa',
      harvestSeason: 'Spring 2025 Crop',
      oilIndex: '48% Natural Fats',
      crunchScore: 4,
      secondaryImage: '/images/cashews-walnuts-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Store in a cool, dry place. Refrigerate in warm climates.',
    allergens: 'Tree Nuts (Cashews). Processed in a facility handling other tree nuts.',
    nutrition: { servingSize: '30g', calories: 163, protein: 5, carbs: 9, fat: 13, fiber: 0.9, sodium: 3 },
    tags: ['cashews', 'w240', 'premium', 'whole', 'goa'],
  },
  {
    id: 'csw-002',
    name: 'Cashew Pieces (W320 Splits)',
    slug: 'cashew-pieces-w320-splits',
    category: 'Cashews',
    categorySlug: 'cashews',
    origin: 'Kerala, India',
    grade: 'W320 Splits',
    shortDesc: 'Economy cashew pieces — ideal for cooking, halwas, biryanis, and ice-cream toppings.',
    longDesc: `Cashew splits and pieces are the economical choice for food businesses. Same quality, same taste — just broken kernels instead of whole. Our W320 splits are perfect for any cooked application where the shape does not matter: kheer, halwa, biryani, cakes, and energy bars.\n\nA favourite among cloud kitchens, catering companies, bakeries, and confectionery manufacturers.`,
    retailPrice: 1350,
    b2bPricePerKg: 1180,
    mrp: 1599,
    variants: buildVariants(1350),
    b2bTiers: buildTiers(1180),
    stockStatus: 'IN_STOCK',
    image: '/images/cashews-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 12,
    storage: 'Store in an airtight container in a cool, dry place.',
    allergens: 'Tree Nuts (Cashews). Processed in a facility handling other tree nuts.',
    nutrition: { servingSize: '30g', calories: 163, protein: 5, carbs: 9, fat: 13, fiber: 0.9, sodium: 3 },
    tags: ['cashews', 'pieces', 'splits', 'cooking', 'economy'],
  },
  {
    id: 'csw-003',
    name: 'Roasted Cashews (Unsalted)',
    slug: 'roasted-cashews-unsalted',
    category: 'Cashews',
    categorySlug: 'cashews',
    origin: 'Goa, India',
    grade: 'W240',
    shortDesc: 'Dry-roasted W240 cashews with no salt or oil added — clean, crunchy, and nutritious.',
    longDesc: `Roasted in small batches using dry-heat technology, our unsalted cashews retain maximum nutrients while achieving a golden, crunchy texture. Zero oil. Zero salt. Perfect for keto, paleo, and low-sodium diets. Popular with fitness enthusiasts and health-food stores.`,
    retailPrice: 1580,
    b2bPricePerKg: 1380,
    mrp: 1899,
    variants: buildVariants(1580),
    b2bTiers: buildTiers(1380),
    stockStatus: 'LOW_STOCK',
    image: '/images/cashews-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 6,
    storage: 'Store in an airtight container. Consume within 45 days of opening.',
    allergens: 'Tree Nuts (Cashews). Processed in a facility handling other tree nuts.',
    nutrition: { servingSize: '30g', calories: 168, protein: 5, carbs: 9.5, fat: 13.5, fiber: 0.9, sodium: 0 },
    tags: ['cashews', 'roasted', 'unsalted', 'health', 'keto'],
  },
  {
    id: 'csw-004',
    name: 'King Jumbo W180 Cashews (Royal Reserve)',
    slug: 'king-jumbo-w180-cashews',
    category: 'Cashews',
    categorySlug: 'cashews',
    origin: 'Goan Coastal Groves, India',
    grade: 'Grade W180 (King Grade)',
    shortDesc: 'The prized King of Cashews — massive whole ivory white crescents with rich buttery sweetness.',
    longDesc: `Grade W180 represents the undisputed royalty of the cashew world — indicating fewer than 180 cashews per pound. These colossal, pristine white whole kernels are hand-selected from the finest mature coastal groves of Goa and Mangalore.\n\nSmooth, silky, and naturally sweet without any chemical processing or bleaching. An opulent centerpiece for luxury dry fruit gifting, royal festive platters, and connoisseur snacking. Vacuum packed in nitrogen-flushed multi-barrier pouches for maximum crunch.`,
    retailPrice: 1850,
    b2bPricePerKg: 1620,
    mrp: 2299,
    variants: buildVariants(1850),
    b2bTiers: buildTiers(1620),
    stockStatus: 'IN_STOCK',
    image: '/images/cashews-w180-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Velvety Clotted Cream', 'Natural Raw Sweetness', 'Buttery Soft Snap'],
      altitude: 'Goan Coastal Plateau',
      harvestSeason: 'Spring 2025 Reserve',
      oilIndex: '49% Natural Plant Fats',
      crunchScore: 5,
      secondaryImage: '/images/cashews-w180-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Keep in an airtight container in a cool, dry place away from heat.',
    allergens: 'Tree Nuts (Cashews).',
    nutrition: { servingSize: '30g', calories: 165, protein: 5.2, carbs: 8.8, fat: 13.5, fiber: 1, sodium: 2 },
    tags: ['cashews', 'w180', 'king-jumbo', 'royal-reserve', 'luxury', 'goa'],
  },


  // ── Walnuts (2) ──────────────────────────────────────────────────────────────
  {
    id: 'wln-001',
    name: 'Kashmiri Kagzi Akhrot (Paper Shell)',
    slug: 'kashmiri-walnuts-in-shell',
    category: 'Walnuts',
    categorySlug: 'walnuts',
    origin: 'Kashmir Valley, India',
    grade: 'Kagzi Grade A',
    shortDesc: 'Handpicked thin-shelled Kashmiri Kagzi walnuts — easily broken by hand with golden buttery kernels.',
    longDesc: `Kashmiri Kagzi walnuts are world-renowned for their paper-thin shells, light blonde color, and rich, buttery kernel with high essential fatty acids. Harvested from ancient walnut groves in the Kashmir Valley, these walnuts are sorted and packed immediately after autumn curing.\n\nPaper-shell (Kagzi) walnuts break cleanly with simple hand pressure. Zero chemical bleaching or sulfur treatment. Rich in plant-based Omega-3 ALA, antioxidants, and neuro-protective nutrients.`,
    retailPrice: 980,
    b2bPricePerKg: 850,
    mrp: 1199,
    variants: buildVariants(980),
    b2bTiers: buildTiers(850),
    stockStatus: 'IN_STOCK',
    image: '/images/kashmir-kagzi-akhrot-250g.jpg',
    sensory: {
      tastingNotes: ['Snow-White Flesh', 'Zero Bitterness', 'Buttery Walnut Finish'],
      altitude: '1,800m (Anantnag & Shopian)',
      harvestSeason: 'Autumn 2025 Fresh Harvest',
      oilIndex: '65% Omega-3 Rich Natural Fats',
      crunchScore: 4,
      secondaryImage: '/images/cashews-walnuts-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Store in a cool, dry place. Keep away from strong odours.',
    allergens: 'Tree Nuts (Walnuts). Processed in a facility handling other tree nuts.',
    nutrition: { servingSize: '30g', calories: 196, protein: 4.5, carbs: 4, fat: 19, fiber: 2, sodium: 0 },
    tags: ['walnuts', 'akhrot', 'kashmir', 'kagzi', 'in-shell', 'fresh'],
  },
  {
    id: 'wln-002',
    name: 'Walnut Kernels (Halves & Pieces)',
    slug: 'walnut-kernels-halves-pieces',
    category: 'Walnuts',
    categorySlug: 'walnuts',
    origin: 'Kashmir, India',
    grade: 'Grade A',
    shortDesc: 'Shelled Kashmiri walnut kernels — ready-to-eat halves and pieces, perfect for cooking and snacking.',
    longDesc: `Our walnut kernels are hand-shelled from premium Kashmiri walnuts, sorted into halves and pieces. Light amber in colour with a mild, rich flavour. Ready to use directly in salads, baking, cakes, and as toppings.\n\nNo artificial bleaching or processing. Packed in nitrogen-flushed pouches to prevent oxidation.`,
    retailPrice: 1950,
    b2bPricePerKg: 1720,
    mrp: 2350,
    variants: buildVariants(1950),
    b2bTiers: buildTiers(1720),
    stockStatus: 'IN_STOCK',
    image: '/images/walnuts-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 6,
    storage: 'Refrigerate after opening. Best consumed within 3 months.',
    allergens: 'Tree Nuts (Walnuts). Processed in a facility handling other tree nuts.',
    nutrition: { servingSize: '30g', calories: 196, protein: 4.5, carbs: 4, fat: 19, fiber: 2, sodium: 0 },
    tags: ['walnuts', 'kernels', 'kashmir', 'halves', 'ready-to-eat'],
  },

  // ── Pistachios (2) ───────────────────────────────────────────────────────────
  {
    id: 'pst-001',
    name: 'Iranian Pistachios (Roasted & Salted)',
    slug: 'iranian-pistachios-roasted-salted',
    category: 'Pistachios',
    categorySlug: 'pistachios',
    origin: 'Iran',
    grade: 'Grade A',
    shortDesc: 'Premium Iranian pistachios — roasted, lightly salted, and naturally split for easy snacking.',
    longDesc: `Iranian pistachios are the gold standard — plump, naturally split, with vibrant green kernels and a rich, complex flavour. Our stock is sourced from Rafsanjan, Iran, the pistachio capital of the world.\n\nRoasted in small batches and lightly seasoned with sea salt. Popular at parties, in trail mixes, and as luxury gifting.`,
    retailPrice: 1650,
    b2bPricePerKg: 1450,
    mrp: 1950,
    variants: buildVariants(1650),
    b2bTiers: buildTiers(1450),
    stockStatus: 'IN_STOCK',
    image: '/images/pistachios-pouch-250g.jpg',
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Store in a cool, dry place. Refrigerate for extended freshness.',
    allergens: 'Tree Nuts (Pistachios). Processed in a facility handling other tree nuts and peanuts.',
    nutrition: { servingSize: '30g', calories: 173, protein: 6, carbs: 8, fat: 14, fiber: 3, sodium: 130 },
    tags: ['pistachios', 'iranian', 'roasted', 'salted', 'premium'],
  },
  {
    id: 'pst-002',
    name: 'Raw Pistachios (Unsalted)',
    slug: 'raw-pistachios-unsalted',
    category: 'Pistachios',
    categorySlug: 'pistachios',
    origin: 'Afghanistan',
    grade: 'Grade A',
    shortDesc: 'Natural raw pistachios — no roasting, no salt, maximum nutrition for health-conscious buyers.',
    longDesc: `Raw, unroasted pistachios retain maximum levels of antioxidants and vitamins. Sourced from Afghanistan's high-altitude farms, our raw pistachios are a favourite with nutritionists, health stores, and Ayurvedic practitioners.\n\nUse in smoothies, granolas, Middle Eastern sweets like baklava, or eat as-is for a pure natural snack.`,
    retailPrice: 2400,
    b2bPricePerKg: 2100,
    mrp: 2850,
    variants: buildVariants(2400),
    b2bTiers: buildTiers(2100),
    stockStatus: 'IN_STOCK',
    image: '/images/pistachios-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 12,
    storage: 'Store in an airtight container in a cool, dry place.',
    allergens: 'Tree Nuts (Pistachios). Processed in a facility handling other tree nuts.',
    nutrition: { servingSize: '30g', calories: 173, protein: 6, carbs: 8, fat: 14, fiber: 3, sodium: 0 },
    tags: ['pistachios', 'raw', 'unsalted', 'health', 'afghanistan'],
  },
  {
    id: 'pst-003',
    name: 'Green Peeled Pista Slivers (Peshawari Slivers)',
    slug: 'green-peeled-pista-slivers',
    category: 'Pistachios',
    categorySlug: 'pistachios',
    origin: 'Peshawar & Kashmir Valley',
    grade: 'Grade AAA Emerald Slivers',
    shortDesc: 'Vibrant jade-green peeled pistachio slivers — freshly cut for luxury royal sweets, kheer, and confectionery.',
    longDesc: `Blanched and peeled from select cold-climate pistachios, our Emerald Green Pista Slivers are sliced wafer-thin to provide the ultimate garnish for royal Indian desserts, Persian saffron rice, kheer, halwas, and gourmet pastries.\n\nVivid naturally green without artificial food dyes, sulfur, or preservatives. 100% pure raw kernels sealed in airtight oxygen-barrier stand-up pouches.`,
    retailPrice: 3850,
    b2bPricePerKg: 3350,
    mrp: 4600,
    variants: buildVariants(3850),
    b2bTiers: buildTiers(3350),
    stockStatus: 'IN_STOCK',
    image: '/images/pista-slivers-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Fresh Pine Nut Meadow', 'Delicate Sweet Cream', 'Silky Crisp Shavings'],
      altitude: 'Northwest Mountain Valleys',
      harvestSeason: 'Autumn 2025 Reserve',
      oilIndex: '52% Heart-Healthy Lipids',
      crunchScore: 4,
      secondaryImage: '/images/pista-slivers-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 9,
    storage: 'Refrigerate immediately in an airtight container to preserve radiant emerald color.',
    allergens: 'Tree Nuts (Pistachios).',
    nutrition: { servingSize: '30g', calories: 175, protein: 6.2, carbs: 7.8, fat: 14.5, fiber: 3, sodium: 0 },
    tags: ['pistachios', 'pista-slivers', 'peshawari', 'emerald-green', 'baking', 'garnish'],
  },


  // ── Raisins (2) ──────────────────────────────────────────────────────────────
  {
    id: 'rsn-001',
    name: 'Kishmish Green (Afghan Raisins)',
    slug: 'kishmish-green-afghan-raisins',
    category: 'Raisins',
    categorySlug: 'raisins',
    origin: 'Afghanistan',
    grade: 'Premium',
    shortDesc: 'Plump, naturally sun-dried green Afghan kishmish — seedless, sweet, and intensely flavourful.',
    longDesc: `Afghan green raisins (Kishmish) are sun-dried without sulphur dioxide, giving them their characteristic green-yellow hue and concentrated sweetness. Unlike artificially coloured raisins, these are pure and natural.\n\nPopular in Indian sweets, biryanis, pulao, cakes, and as a healthy snack. A key ingredient in dry fruit assortments and gift boxes.`,
    retailPrice: 580,
    b2bPricePerKg: 490,
    mrp: 699,
    variants: buildVariants(580),
    b2bTiers: buildTiers(490),
    stockStatus: 'IN_STOCK',
    image: '/images/raisins-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 12,
    storage: 'Store in an airtight container. Refrigerate in summer.',
    allergens: 'Sulphite free. May contain traces of tree nuts from shared facility.',
    nutrition: { servingSize: '40g', calories: 122, protein: 1, carbs: 32, fat: 0.2, fiber: 1.5, sodium: 4 },
    tags: ['raisins', 'kishmish', 'afghan', 'green', 'seedless'],
  },
  {
    id: 'rsn-002',
    name: 'Black Raisins (Munakka)',
    slug: 'black-raisins-munakka',
    category: 'Raisins',
    categorySlug: 'raisins',
    origin: 'Afghanistan & Kashmir',
    grade: 'Premium',
    shortDesc: 'Large, seeded Munakka raisins — traditionally prized in Ayurvedic medicine for energy and digestion.',
    longDesc: `Munakka (large black raisins) are the traditional form of dried grapes used extensively in Ayurvedic medicine. Unlike regular raisins, Munakka are larger, contain seeds, and have a more complex, tangy-sweet flavour.\n\nHigh in iron and antioxidants, they are commonly soaked overnight and consumed first thing in the morning. Nuty Tales sources Munakka directly from Afghanistan and Kashmir.`,
    retailPrice: 650,
    b2bPricePerKg: 550,
    mrp: 780,
    variants: buildVariants(650),
    b2bTiers: buildTiers(550),
    stockStatus: 'IN_STOCK',
    image: '/images/black-raisins-pouch-250g.jpg',
    sensory: {
      secondaryImage: '/images/black-munakka-macro.jpg',
    },
    isFeatured: false,
    shelfLifeMonths: 18,
    storage: 'Store in a cool, dry place in an airtight container.',
    allergens: 'May contain traces of tree nuts from shared facility.',
    nutrition: { servingSize: '40g', calories: 128, protein: 1.2, carbs: 34, fat: 0.2, fiber: 1.8, sodium: 5 },
    tags: ['raisins', 'munakka', 'black', 'ayurvedic', 'seeded'],
  },
  {
    id: 'rsn-003',
    name: 'Jumbo Black Munakka (Seedless Antioxidant Raisins)',
    slug: 'jumbo-black-munakka-seedless',
    category: 'Raisins',
    categorySlug: 'raisins',
    origin: 'Afghanistan & Nashik, India',
    grade: 'Grade A+ Jumbo Seedless',
    shortDesc: 'Large sun-dried black munakka raisins — plump, naturally sweet, and loaded with iron and polyphenols.',
    longDesc: `Our Jumbo Black Munakka are carefully cured in the sun from ripe black seedless grapes. Packed with bioavailable iron, potassium, and protective anthocyanin antioxidants.\n\nTraditionally soaked overnight in water and consumed in the morning for gut regularity, hemoglobin support, and sustained natural energy. 100% chemical-free and zero added sugar.`,
    retailPrice: 950,
    b2bPricePerKg: 820,
    mrp: 1250,
    variants: buildVariants(950),
    b2bTiers: buildTiers(820),
    stockStatus: 'IN_STOCK',
    image: '/images/black-raisins-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Dark Berry Molasses', 'Mellow Wine Fruit', 'Soft Succulent Chew'],
      altitude: 'Sun-Drenched Deccan & Afghan Hills',
      harvestSeason: 'Winter 2025 Cure',
      oilIndex: '0.4% Naturally Lean',
      crunchScore: 2,
      secondaryImage: '/images/black-munakka-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 18,
    storage: 'Store in an airtight jar in a cool, dry pantry.',
    allergens: 'Natural Dried Fruit. Sulphite free.',
    nutrition: { servingSize: '40g', calories: 126, protein: 1.3, carbs: 33, fat: 0.2, fiber: 2.2, sodium: 4 },
    tags: ['raisins', 'black-raisins', 'munakka', 'iron-rich', 'ayurvedic', 'natural'],
  },


  // ── Dates (2) ────────────────────────────────────────────────────────────────
  {
    id: 'dat-001',
    name: 'Medjool Dates Premium',
    slug: 'medjool-dates-premium',
    category: 'Dates',
    categorySlug: 'dates',
    origin: 'Jordan / Israel',
    grade: 'Jumbo Premium',
    shortDesc: 'The king of dates — extra-large Medjool with rich caramel-like sweetness and soft, moist flesh.',
    longDesc: `Medjool dates are known as the 'King of Dates' for good reason. Our premium Medjool dates are sourced from Jordan and Israel, where the warm, arid climate produces the finest specimens. Each date is plump, soft, and intensely sweet with a rich caramel-toffee flavour.\n\nA natural energy booster, beloved by fitness enthusiasts, athletes, and families alike. Perfect as a natural sweetener, in energy balls, and as a luxury dessert ingredient.`,
    retailPrice: 1200,
    b2bPricePerKg: 1050,
    mrp: 1399,
    variants: buildVariants(1200),
    b2bTiers: buildTiers(1050),
    stockStatus: 'IN_STOCK',
    image: '/images/dates-box-250g.jpg',
    isFeatured: true,
    shelfLifeMonths: 18,
    storage: 'Refrigerate for longer shelf life. Can be kept at room temperature for up to 3 months.',
    allergens: 'No known allergens. Produced in a facility handling tree nuts.',
    nutrition: { servingSize: '40g', calories: 133, protein: 0.8, carbs: 36, fat: 0.1, fiber: 3.2, sodium: 1 },
    tags: ['dates', 'medjool', 'premium', 'jordan', 'energy'],
  },
  {
    id: 'dat-002',
    name: 'Safawi Dates (Saudi)',
    slug: 'safawi-dates-saudi',
    category: 'Dates',
    categorySlug: 'dates',
    origin: 'Madinah, Saudi Arabia',
    grade: 'Grade A',
    shortDesc: 'Dark, semi-dry Safawi dates from Madinah — soft texture, mild sweetness, zero added sugar.',
    longDesc: `Safawi dates are grown in the fertile date farms of Madinah, Saudi Arabia. They are a darker variety with a semi-dry texture, mildly sweet, and slightly chewy. These are extremely popular during Ramadan and as everyday healthy snacks.\n\nRich in potassium, magnesium, and natural sugars. No preservatives, no added sugar. Ideal for health-conscious consumers and gift boxes.`,
    retailPrice: 950,
    b2bPricePerKg: 820,
    mrp: 1150,
    variants: buildVariants(950),
    b2bTiers: buildTiers(820),
    stockStatus: 'IN_STOCK',
    image: '/images/dates-box-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 24,
    storage: 'Store in a cool, dry place. Refrigerate after opening.',
    allergens: 'No known allergens. Produced in a facility handling tree nuts.',
    nutrition: { servingSize: '40g', calories: 122, protein: 0.7, carbs: 33, fat: 0.1, fiber: 2.8, sodium: 1 },
    tags: ['dates', 'safawi', 'saudi', 'ramadan', 'natural'],
  },
  {
    id: 'dat-003',
    name: 'Royal Ajwa Dates (Madinah Al-Aliya)',
    slug: 'royal-ajwa-dates-madinah',
    category: 'Dates',
    categorySlug: 'dates',
    origin: 'Madinah Al-Munawwarah, Saudi Arabia',
    grade: 'Grade A VIP Reserve',
    shortDesc: 'Revered soft black Ajwa dates from the sacred groves of Madinah — velvety, mildly sweet with fine white fissures.',
    longDesc: `Ajwa is the most celebrated date variety in the world, cultivated exclusively in the historic Al-Aliya region of Madinah Al-Munawwarah. Distinctive for its rounded midnight-black appearance, fine delicate white striations, and delightfully soft, prune-like texture.\n\nPrized for thousands of years for its potent cardioprotective antioxidants, natural iron, and digestive benefits. Direct certified import from Saudi date orchards.`,
    retailPrice: 2450,
    b2bPricePerKg: 2150,
    mrp: 2999,
    variants: buildVariants(2450),
    b2bTiers: buildTiers(2150),
    stockStatus: 'IN_STOCK',
    image: '/images/ajwa-dates-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Silky Black Caramel', 'Mellow Brown Sugar', 'Soft Melting Pulp'],
      altitude: 'Madinah Date Oases',
      harvestSeason: 'Late Summer 2025 Crop',
      oilIndex: 'Zero Fat • High Polyphenol Matrix',
      crunchScore: 1,
      secondaryImage: '/images/ajwa-dates-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 24,
    storage: 'Store in a cool, dry place below 22°C. Refrigerate for long storage.',
    allergens: 'None.',
    nutrition: { servingSize: '40g', calories: 125, protein: 1, carbs: 34, fat: 0.1, fiber: 3.5, sodium: 1 },
    tags: ['dates', 'ajwa', 'madinah', 'saudi-arabia', 'superfood', 'spiritual', 'healing'],
  },


  // ── Anjeer (2) ───────────────────────────────────────────────────────────────
  {
    id: 'anj-001',
    name: 'Dried Anjeer (Turkish Figs)',
    slug: 'dried-anjeer-turkish-figs',
    category: 'Anjeer',
    categorySlug: 'anjeer',
    origin: 'Turkey',
    grade: 'Grade A',
    shortDesc: 'Sun-dried Turkish figs (Anjeer) — naturally sweet, fibre-rich, and loaded with calcium and iron.',
    longDesc: `Turkish dried figs are considered the world's finest. Our Anjeer is sourced from the Aegean region of Turkey, where fig cultivation has flourished for thousands of years. Naturally sun-dried without sulphur, they have a sweet, jam-like flavour and chewy texture.\n\nRich in dietary fibre, calcium, potassium, and iron. Popular in Ayurvedic wellness routines, desserts, chutneys, and as a standalone snack.`,
    retailPrice: 1650,
    b2bPricePerKg: 1450,
    mrp: 1950,
    variants: buildVariants(1650),
    b2bTiers: buildTiers(1450),
    stockStatus: 'IN_STOCK',
    image: '/images/anjeer-pouch-250g.jpg',
    sensory: {
      secondaryImage: '/images/anjeer-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Store in an airtight container in a cool, dry place. Refrigerate in summer.',
    allergens: 'No known allergens. Produced in a facility handling tree nuts.',
    nutrition: { servingSize: '40g', calories: 107, protein: 1.4, carbs: 28, fat: 0.4, fiber: 4, sodium: 4 },
    tags: ['anjeer', 'figs', 'turkey', 'dried', 'fibre'],
  },
  {
    id: 'anj-002',
    name: 'Afghan Anjeer (Wild Figs)',
    slug: 'afghan-anjeer-wild-figs',
    category: 'Anjeer',
    categorySlug: 'anjeer',
    origin: 'Afghanistan',
    grade: 'Premium Wild',
    shortDesc: 'Rare wild-harvested Afghan figs with intense sweetness and complex flavour — a connoisseur\'s choice.',
    longDesc: `Afghan wild figs are harvested from naturally growing fig trees in Afghanistan's mountain regions. Smaller than cultivated varieties but far more flavourful. These are not commercially farmed — they are true wild figs, hand-collected and sun-dried.\n\nA rare delicacy in the dry fruit world. Limited seasonal availability. Premium choice for gifting and Ayurvedic practitioners.`,
    retailPrice: 1950,
    b2bPricePerKg: 1720,
    mrp: 2350,
    variants: buildVariants(1950),
    b2bTiers: buildTiers(1720),
    stockStatus: 'LOW_STOCK',
    image: '/images/anjeer-pouch-250g.jpg',
    sensory: {
      secondaryImage: '/images/anjeer-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Store in an airtight container. Refrigerate for extended shelf life.',
    allergens: 'No known allergens. Wild harvested.',
    nutrition: { servingSize: '40g', calories: 112, protein: 1.5, carbs: 29, fat: 0.4, fiber: 4.5, sodium: 3 },
    tags: ['anjeer', 'figs', 'afghanistan', 'wild', 'rare'],
  },
  {
    id: 'anj-003',
    name: 'Afghan Kandahari Mala Anjeer (String Wreath Figs)',
    slug: 'afghan-kandahari-mala-anjeer',
    category: 'Anjeer',
    categorySlug: 'anjeer',
    origin: 'Kandahar Mountains, Afghanistan',
    grade: 'Grade A+ Garland Wreath',
    shortDesc: 'Prized Afghan string-threaded garland figs — sun-dried mountain figs with dense golden honeyed sweetness.',
    longDesc: `Threaded onto traditional organic cotton strings into decorative garlands (Mala), these authentic Kandahari figs are cured under intense mountain sun. Naturally chewy with a concentrated, fig-honey jam interior and satisfying seed crunch.\n\nRenowned across South Asia as an elite tonic for bone density, dietary fiber, and restorative vitality. Zero sulfur, zero artificial sweeteners, and zero moisture additives.`,
    retailPrice: 2450,
    b2bPricePerKg: 2150,
    mrp: 2999,
    variants: buildVariants(2450),
    b2bTiers: buildTiers(2150),
    stockStatus: 'IN_STOCK',
    image: '/images/anjeer-mala-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Caramelized Wild Honey', 'Nutty Seed Crunch', 'Rich Molasses Fig'],
      altitude: 'Kandahar Foothills (1,800m)',
      harvestSeason: 'Autumn 2025 Reserve',
      oilIndex: 'Natural Fruit Fiber & Seeds',
      crunchScore: 4,
      secondaryImage: '/images/anjeer-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 18,
    storage: 'Store in an airtight container. Refrigerate in summer.',
    allergens: 'None.',
    nutrition: { servingSize: '40g', calories: 115, protein: 1.6, carbs: 29.5, fat: 0.5, fiber: 4.8, sodium: 3 },
    tags: ['anjeer', 'afghan-anjeer', 'mala-anjeer', 'garland-figs', 'figs', 'kandahar'],
  },

  {
    id: 'apr-001',
    name: 'Ladakh Halman Organic Wild Apricots (Khubani)',
    slug: 'ladakh-halman-wild-apricots',
    category: 'Apricots & Berries',
    categorySlug: 'apricots',
    origin: 'Nubra Valley, Ladakh, India',
    grade: 'Grade A+ Sun-Dried Halman',
    shortDesc: 'Organic sun-dried Halman apricots from high-altitude Ladakh — velvety golden flesh with sweet edible inner kernel.',
    longDesc: `Cultivated at elevations exceeding 10,000 feet in the glacial meltwater of Ladakh's Nubra and Kargil valleys, Halman is India's most extraordinary indigenous apricot variety. Sun-dried naturally on rooftop stone beds beneath pristine Himalayan sun.\n\nIntensely fragrant, plump, and deeply sweet with zero sulfur dioxide preservation. Bonus: crack open the inner pit to enjoy the rare sweet, non-bitter apricot kernel inside! Rich in vitamin A, beta-carotene, and potassium.`,
    retailPrice: 1250,
    b2bPricePerKg: 1080,
    mrp: 1550,
    variants: buildVariants(1250),
    b2bTiers: buildTiers(1080),
    stockStatus: 'IN_STOCK',
    image: '/images/apricots-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Floral Honey Glaze', 'Velvety Sun-Dried Stonefruit', 'Sweet Edible Nut Interior'],
      altitude: 'Ladakh High Valleys (3,100m)',
      harvestSeason: 'Late Autumn 2025',
      oilIndex: 'Rich in Essential Kernel Oils',
      crunchScore: 2,
      secondaryImage: '/images/apricot-halman-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 18,
    storage: 'Store in an airtight container in a cool, dry pantry.',
    allergens: 'Contains inner edible apricot kernel.',
    nutrition: { servingSize: '40g', calories: 118, protein: 1.8, carbs: 28, fat: 0.3, fiber: 3.8, sodium: 2 },
    tags: ['apricots', 'khubani', 'ladakh', 'halman', 'organic', 'wild-harvest'],
  },


  // ── Makhana (3) ──────────────────────────────────────────────────────────────
  {
    id: 'mkh-001',
    name: 'Makhana Grade A (Fox Nuts)',
    slug: 'makhana-grade-a-fox-nuts',
    category: 'Makhana',
    categorySlug: 'makhana',
    origin: 'Darbhanga, Bihar, India',
    grade: 'Grade A',
    shortDesc: 'Premium Grade A Makhana from Bihar — large, crispy lotus seeds perfect for roasting and kheer.',
    longDesc: `Makhana (Fox Nuts / Lotus Seeds) is a superfood cultivated in the wetlands of Bihar, India. Nuty Tales sources Grade A Makhana directly from farmers in Darbhanga and Madhubani — the heart of India's Makhana belt.\n\nGrade A Makhana are characterised by large, uniform size (Sutta 6 grade), brilliant white colour, and exceptional crispness. Zero additives, zero processing, straight from the farm.\n\nPerfect for roasting with ghee and spices, making Makhana kheer, trail mixes, and baby food. Our Makhana is sourced fresh at harvest season and vacuum-packed for maximum shelf life.`,
    retailPrice: 2100,
    b2bPricePerKg: 1850,
    mrp: 2499,
    variants: buildVariants(2100),
    b2bTiers: buildTiers(1850),
    stockStatus: 'IN_STOCK',
    image: '/images/makhana-pouch-250g.jpg',
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Store in an airtight container in a cool, dry place. Keep away from moisture.',
    allergens: 'No known allergens. Lotus seed product. Produced in a facility handling tree nuts.',
    nutrition: { servingSize: '30g', calories: 107, protein: 3.8, carbs: 20, fat: 0.1, fiber: 0.5, sodium: 0 },
    tags: ['makhana', 'fox-nuts', 'lotus-seeds', 'bihar', 'grade-a', 'superfood'],
  },
  {
    id: 'mkh-002',
    name: 'Makhana Grade B (Fox Nuts Economy)',
    slug: 'makhana-grade-b-fox-nuts-economy',
    category: 'Makhana',
    categorySlug: 'makhana',
    origin: 'Sitamarhi, Bihar, India',
    grade: 'Grade B',
    shortDesc: 'Economy Grade B Makhana — smaller size, same great taste, ideal for kheer and cooking.',
    longDesc: `Grade B Makhana are smaller-sized fox nuts that are equally nutritious and delicious as Grade A, at a more accessible price point. Ideal for cooking applications where presentation is not critical — kheer, halwa, curry gravies, and roasted snacks.\n\nVery popular with restaurants, cloud kitchens, catering companies, and households looking for economical nutrition. Sourced from Bihar's Makhana farms.`,
    retailPrice: 1750,
    b2bPricePerKg: 1520,
    mrp: 1999,
    variants: buildVariants(1750),
    b2bTiers: buildTiers(1520),
    stockStatus: 'IN_STOCK',
    image: '/images/makhana-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 12,
    storage: 'Store in an airtight container in a cool, dry place.',
    allergens: 'No known allergens. Lotus seed product.',
    nutrition: { servingSize: '30g', calories: 107, protein: 3.8, carbs: 20, fat: 0.1, fiber: 0.5, sodium: 0 },
    tags: ['makhana', 'fox-nuts', 'bihar', 'grade-b', 'economy', 'cooking'],
  },
  {
    id: 'mkh-003',
    name: 'Masala Makhana (Roasted)',
    slug: 'masala-makhana-roasted',
    category: 'Makhana',
    categorySlug: 'makhana',
    origin: 'Bihar, India',
    grade: 'Grade A Processed',
    shortDesc: 'Crispy roasted Makhana with tangy masala — a guilt-free healthy snack for all ages.',
    longDesc: `Our Masala Makhana is made from Grade A Bihar Makhana, roasted with pure ghee and a blend of Himalayan salt, chaat masala, and mild spices. The result is an incredibly addictive, crunchy snack that is far healthier than chips or namkeen.\n\nHigh in protein, low in calories, naturally gluten-free. A fast-growing favourite in health-food retail. Available for private label in bulk.`,
    retailPrice: 2400,
    b2bPricePerKg: 2100,
    mrp: 2850,
    variants: buildVariants(2400),
    b2bTiers: buildTiers(2100),
    stockStatus: 'IN_STOCK',
    image: '/images/makhana-pouch-250g.jpg',
    isFeatured: true,
    shelfLifeMonths: 6,
    storage: 'Store in a cool, dry place. Consume within 30 days of opening.',
    allergens: 'Contains: Ghee (Milk). May contain traces of tree nuts. Gluten-free.',
    nutrition: { servingSize: '30g', calories: 118, protein: 3.5, carbs: 21, fat: 2, fiber: 0.5, sodium: 180 },
    tags: ['makhana', 'roasted', 'masala', 'snack', 'healthy', 'ghee'],
  },

  // ── Seeds (2) ────────────────────────────────────────────────────────────────
  {
    id: 'sed-001',
    name: 'Chia Seeds Premium',
    slug: 'chia-seeds-premium',
    category: 'Seeds',
    categorySlug: 'seeds',
    origin: 'Mexico / South America',
    grade: 'Premium',
    shortDesc: 'High-quality black chia seeds — loaded with omega-3, fibre, and antioxidants.',
    longDesc: `Chia seeds are among the most nutrient-dense foods on the planet. Our premium chia seeds are sourced from certified farms in Mexico. They are rich in omega-3 fatty acids, dietary fibre, protein, and antioxidants.\n\nUse in smoothies, puddings, overnight oats, juices, and baked goods. When soaked in water, chia seeds form a gel that aids digestion and promotes satiety.`,
    retailPrice: 399,
    b2bPricePerKg: 350,
    mrp: 449,
    variants: buildVariants(399),
    b2bTiers: buildTiers(350),
    stockStatus: 'IN_STOCK',
    image: '/images/chia-seeds-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 24,
    storage: 'Store in an airtight container in a cool, dry place.',
    allergens: 'No known allergens.',
    nutrition: { servingSize: '30g', calories: 137, protein: 4.4, carbs: 12, fat: 8.6, fiber: 10.6, sodium: 5 },
    tags: ['seeds', 'chia', 'omega-3', 'superfood', 'health'],
  },
  {
    id: 'sed-002',
    name: 'Pumpkin Seeds (Roasted)',
    slug: 'pumpkin-seeds-roasted',
    category: 'Seeds',
    categorySlug: 'seeds',
    origin: 'India / China',
    grade: 'Premium',
    shortDesc: 'Crunchy roasted pumpkin seeds — rich in zinc, magnesium, and healthy fats.',
    longDesc: `Pumpkin seeds (pepitas) are a nutritional powerhouse. Our roasted pumpkin seeds are shell-free, dry-roasted without oil, and lightly salted. Rich in zinc (immune support), magnesium (muscle function), and healthy monounsaturated fats.\n\nA great addition to salads, trail mixes, granola, and baked goods. Also delicious on their own as a snack.`,
    retailPrice: 550,
    b2bPricePerKg: 480,
    mrp: 650,
    variants: buildVariants(550),
    b2bTiers: buildTiers(480),
    stockStatus: 'IN_STOCK',
    image: '/images/pumpkin-seeds-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 12,
    storage: 'Store in an airtight container in a cool, dry place.',
    allergens: 'No known allergens. Produced in a facility handling tree nuts.',
    nutrition: { servingSize: '30g', calories: 163, protein: 8.5, carbs: 5, fat: 13, fiber: 1.7, sodium: 65 },
    tags: ['seeds', 'pumpkin', 'roasted', 'zinc', 'magnesium'],
  },

  // ── Mixed Nuts (2) ───────────────────────────────────────────────────────────
  {
    id: 'mxn-001',
    name: 'Premium Mixed Nuts (7 Variety)',
    slug: 'premium-mixed-nuts-7-variety',
    category: 'Mixed Nuts',
    categorySlug: 'mixed-nuts',
    origin: 'Multi-origin',
    grade: 'Premium',
    shortDesc: 'The ultimate nut mix — almonds, cashews, walnuts, pistachios, hazelnuts, pecans, and macadamia.',
    longDesc: `Our Premium Mixed Nuts is the finest nut blend you can buy — containing 7 varieties of carefully selected nuts from their best origins. Each batch contains: California Almonds, W240 Cashews, Kashmiri Walnuts, Iranian Pistachios, Turkish Hazelnuts, American Pecans, and Hawaiian Macadamia Nuts.\n\nRoasted to perfection and lightly salted. Perfect for corporate gifting, premium retail, high-end hospitality, and health-conscious snackers.`,
    retailPrice: 1950,
    b2bPricePerKg: 1700,
    mrp: 2350,
    variants: buildVariants(1950),
    b2bTiers: buildTiers(1700),
    stockStatus: 'IN_STOCK',
    image: '/images/nut-mix-pouch-250g.jpg',
    isFeatured: true,
    shelfLifeMonths: 6,
    storage: 'Store in a cool, dry place. Refrigerate after opening.',
    allergens: 'Contains: Almonds, Cashews, Walnuts, Pistachios, Hazelnuts, Pecans, Macadamia. Major tree nut allergen product.',
    nutrition: { servingSize: '30g', calories: 183, protein: 5, carbs: 7, fat: 16, fiber: 2, sodium: 80 },
    tags: ['mixed-nuts', 'premium', 'gift', 'assorted', '7-variety'],
  },
  {
    id: 'mxn-002',
    name: 'Dry Fruit & Nut Mix (Classic)',
    slug: 'dry-fruit-nut-mix-classic',
    category: 'Mixed Nuts',
    categorySlug: 'mixed-nuts',
    origin: 'Multi-origin',
    grade: 'Standard',
    shortDesc: 'Classic Indian dry fruit mix — almonds, cashews, raisins, pistachios, and dates.',
    longDesc: `Our Classic Dry Fruit & Nut Mix is the perfect everyday dry fruit assortment for Indian households. Contains: Almonds, Cashews, Raisins (Kishmish), Pistachios, and Dates — the five staples of Indian dry fruit culture.\n\nIdeal as a daily health snack, for adding to milk, sweets, and as a starter gift for festive seasons. Available in premium gift packaging on request.`,
    retailPrice: 1450,
    b2bPricePerKg: 1280,
    mrp: 1750,
    variants: buildVariants(1450),
    b2bTiers: buildTiers(1280),
    stockStatus: 'IN_STOCK',
    image: '/images/nut-mix-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 6,
    storage: 'Store in a cool, dry place. Keep away from moisture.',
    allergens: 'Contains: Almonds, Cashews, Pistachios (Tree Nuts). Contains Dried Fruit (Raisins, Dates).',
    nutrition: { servingSize: '30g', calories: 160, protein: 4, carbs: 15, fat: 10, fiber: 2, sodium: 20 },
    tags: ['mixed-nuts', 'dry-fruit-mix', 'classic', 'everyday', 'indian'],
  },

  // ── Healthy Snacks (2) ───────────────────────────────────────────────────────
  {
    id: 'snk-001',
    name: 'Trail Mix (Fitness Blend)',
    slug: 'trail-mix-fitness-blend',
    category: 'Healthy Snacks',
    categorySlug: 'healthy-snacks',
    origin: 'Multi-origin',
    grade: 'Premium',
    shortDesc: 'Energy-packed trail mix for athletes — nuts, seeds, cranberries, and dark chocolate chips.',
    longDesc: `Formulated for active lifestyles, our Fitness Trail Mix combines high-protein nuts with energy-boosting dried fruits and antioxidant-rich extras. Contains: Almonds, Cashews, Pumpkin Seeds, Sunflower Seeds, Dried Cranberries, and Dark Chocolate Chips.\n\nNo artificial colours, no synthetic preservatives. A favourite with gym-goers, hikers, and corporate wellness programmes.`,
    retailPrice: 980,
    b2bPricePerKg: 850,
    mrp: 1199,
    variants: buildVariants(980),
    b2bTiers: buildTiers(850),
    stockStatus: 'IN_STOCK',
    image: '/images/nut-mix-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 6,
    storage: 'Store in a cool, dry place. Consume within 30 days of opening.',
    allergens: 'Contains: Almonds, Cashews (Tree Nuts), Dark Chocolate (Milk, Soya). May contain peanuts.',
    nutrition: { servingSize: '40g', calories: 192, protein: 5, carbs: 20, fat: 11, fiber: 2.5, sodium: 30 },
    tags: ['trail-mix', 'fitness', 'snack', 'energy', 'chocolate'],
  },
  {
    id: 'snk-002',
    name: 'Roasted Mixed Seeds',
    slug: 'roasted-mixed-seeds',
    category: 'Healthy Snacks',
    categorySlug: 'healthy-snacks',
    origin: 'India',
    grade: 'Premium',
    shortDesc: 'Crunchy roasted seed mix — flaxseeds, pumpkin, sunflower, sesame, and watermelon seeds.',
    longDesc: `Our Roasted Mixed Seeds blend is a nutritional powerhouse in a small package. Each serving contains 5 types of seeds: Flaxseeds (omega-3), Pumpkin Seeds (zinc), Sunflower Seeds (vitamin E), Sesame Seeds (calcium), and Watermelon Seeds (protein).\n\nLightly roasted and minimally salted. Great as a topping for salads, yogurt, soups, and rice dishes. Also perfect for plain snacking. Popular with diabetics, heart patients, and weight-conscious consumers.`,
    retailPrice: 450,
    b2bPricePerKg: 390,
    mrp: 550,
    variants: buildVariants(450),
    b2bTiers: buildTiers(390),
    stockStatus: 'IN_STOCK',
    image: '/images/seeds-mix-pouch-250g.jpg',
    isFeatured: false,
    shelfLifeMonths: 9,
    storage: 'Store in an airtight container in a cool, dry place.',
    allergens: 'Contains Sesame. No other major allergens. Produced in a facility handling tree nuts.',
    nutrition: { servingSize: '30g', calories: 160, protein: 6.5, carbs: 8, fat: 12, fiber: 4, sodium: 45 },
    tags: ['seeds-mix', 'roasted', 'flaxseed', 'pumpkin-seed', 'healthy', 'diabetic-friendly'],
  },

  // ── Gift Packs (2) ───────────────────────────────────────────────────────────
  {
    id: 'gft-001',
    name: 'Diwali Dry Fruit Gift Box (Premium)',
    slug: 'diwali-dry-fruit-gift-box-premium',
    category: 'Gift Packs',
    categorySlug: 'gift-packs',
    origin: 'Multi-origin',
    grade: 'Gift Grade',
    shortDesc: 'Luxurious Diwali dry fruit gift box — 8 varieties in an elegant wooden box with satin lining.',
    longDesc: `The Nuty Tales Premium Diwali Gift Box is the ultimate gifting statement. A hand-crafted wooden box with satin lining, containing 8 premium dry fruits in individual compartments: Mamra Almonds, W240 Cashews, Iranian Pistachios, Kashmiri Walnuts, Medjool Dates, Afghan Kishmish, Turkish Figs, and Masala Makhana.\n\nCustom branding available for corporate orders of 50+ boxes. GST invoice provided. Pan-India delivery with special festive packaging.`,
    retailPrice: 3499,
    b2bPricePerKg: 3000,
    mrp: 4199,
    variants: [
      { sizeG: 1000, label: '1 kg (8×125g)', retailPrice: 3499, mrp: 4199 },
      { sizeG: 2000, label: '2 kg (8×250g)', retailPrice: 6799, mrp: 7999 },
    ],
    b2bTiers: buildTiers(2600),
    stockStatus: 'IN_STOCK',
    image: '/images/luxury-teal-gift-box.jpg',
    isFeatured: true,
    shelfLifeMonths: 6,
    storage: 'Store in a cool, dry place. Individual contents have varying storage requirements.',
    allergens: 'Contains multiple tree nuts, dried fruits. See individual product labels. Not suitable for nut allergy sufferers.',
    nutrition: { servingSize: '30g', calories: 170, protein: 4.5, carbs: 14, fat: 11, fiber: 2.5, sodium: 20 },
    tags: ['gift', 'diwali', 'premium', 'wooden-box', 'corporate', 'festive'],
  },
  {
    id: 'gft-002',
    name: 'Dry Fruit Family Pack',
    slug: 'dry-fruit-family-pack',
    category: 'Gift Packs',
    categorySlug: 'gift-packs',
    origin: 'Multi-origin',
    grade: 'Standard',
    shortDesc: 'Everyday family dry fruit pack — 5 essentials in resealable pouches, great value for money.',
    longDesc: `The Family Pack is our best-selling everyday value pack. Five resealable pouches containing the Indian household staples: Almonds (200g), Cashews (200g), Raisins (200g), Pistachios (100g), and Dates (300g). Total 1 kg of premium dry fruits.\n\nAvailable in jute bags for an eco-friendly gifting option. Excellent for Eid, Diwali, anniversaries, and housewarming gifts. Affordable luxury for every family.`,
    retailPrice: 1699,
    b2bPricePerKg: 1450,
    mrp: 1999,
    variants: [
      { sizeG: 1000, label: '1 kg (5-in-1)', retailPrice: 1699, mrp: 1999 },
      { sizeG: 2000, label: '2 kg (5-in-1)', retailPrice: 3299, mrp: 3899 },
    ],
    b2bTiers: buildTiers(1150),
    stockStatus: 'IN_STOCK',
    image: '/images/royal-tradition-box.jpg',
    isFeatured: false,
    shelfLifeMonths: 6,
    storage: 'Store in a cool, dry place. Each individual pouch is resealable.',
    allergens: 'Contains multiple tree nuts. Not suitable for nut allergy sufferers.',
    nutrition: { servingSize: '30g', calories: 158, protein: 4, carbs: 14, fat: 10, fiber: 2, sodium: 15 },
    tags: ['gift', 'family-pack', 'value', 'everyday', 'indian', 'eid', 'diwali'],
  },

  // ── Saffron (1) ─────────────────────────────────────────────────────────────
  {
    id: 'saf-001',
    name: 'Pure Kashmiri Mongra Saffron',
    slug: 'kashmiri-mongra-saffron',
    category: 'Saffron',
    categorySlug: 'saffron',
    origin: 'Pampore, Kashmir, India',
    grade: 'Grade A1 Mongra (GI Tagged)',
    shortDesc: 'Certified pure Kashmiri Mongra saffron — intense crimson threads with intoxicating aroma and medicinal potency.',
    longDesc: `Sourced directly from the autumn harvest in the historic saffron fields of Pampore, Kashmir. Mongra refers to the purest top-portion stigmas, completely free from style or yellow base components. 100% natural, tested for high crocin (color), picrocrocin (flavor), and safranal (aroma) count.\n\nFSSAI certified and vacuum packed in airtight gold-accented glass jars to preserve fragile essential oils. Perfect for gourmet cooking, traditional biryanis, desserts, pregnancy wellness, and luxury corporate gifting.`,
    retailPrice: 1950,
    b2bPricePerKg: 180000,
    mrp: 2350,
    variants: [
      { sizeG: 1, label: '1g Jar', retailPrice: 420, mrp: 499 },
      { sizeG: 2, label: '2g Jar', retailPrice: 820, mrp: 975 },
      { sizeG: 5, label: '5g Jar', retailPrice: 1950, mrp: 2350 },
    ],
    b2bTiers: [
      { minQtyKg: 0.05, maxQtyKg: 0.1, pricePerKg: 160000, savingsPercent: 5 },
      { minQtyKg: 0.1, maxQtyKg: null, pricePerKg: 150000, savingsPercent: 10 },
    ],
    stockStatus: 'IN_STOCK',
    image: '/images/saffron-jar-5g.jpg',
    sensory: {
      tastingNotes: ['Honeyed Hay & Warm Earth', 'Intense Crimson Bloom', 'Mild Bittersweet Spice'],
      altitude: '1,600m (Karewa Plateau, Pampore)',
      harvestSeason: 'October 2025 Hand-Plucked',
      oilIndex: 'Grade 1 Stigma (100% Pure Crocin)',
      crunchScore: 5,
      secondaryImage: '/images/saffron-threads-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 24,
    storage: 'Store in a cool, dark place away from direct sunlight.',
    allergens: 'None. Pure spice.',
    nutrition: { servingSize: '1g', calories: 3, protein: 0.1, carbs: 0.6, fat: 0, fiber: 0, sodium: 1 },
    tags: ['saffron', 'kesar', 'kashmir', 'pampore', 'mongra', 'pure', 'luxury'],
  },
  {
    id: 'saf-002',
    name: 'Iranian Super Negin Saffron',
    slug: 'iranian-super-negin-saffron',
    category: 'Saffron',
    categorySlug: 'saffron',
    origin: 'Khorasan, Iran',
    grade: 'Super Negin Grade 1',
    shortDesc: 'World-renowned Iranian Super Negin saffron — thick, all-red unbroken stigmas with intense color and floral aroma.',
    longDesc: `Sourced from the historic saffron terraces of Khorasan, Iran. Super Negin represents the highest commercial grade of Persian saffron, containing only the pristine all-red tips of the stigma with zero yellow style.\n\nRenowned for intense color release (crocin levels > 250), deep aromatic complexity, and culinary excellence. Sealed in airtight luxury glass jars for connoisseurs, gourmet kitchens, and prestige gifting.`,
    retailPrice: 1550,
    b2bPricePerKg: 145000,
    mrp: 1850,
    variants: [
      { sizeG: 1, label: '1g Jar', retailPrice: 340, mrp: 420 },
      { sizeG: 2, label: '2g Jar', retailPrice: 650, mrp: 799 },
      { sizeG: 5, label: '5g Jar', retailPrice: 1550, mrp: 1850 },
    ],
    b2bTiers: [
      { minQtyKg: 0.05, maxQtyKg: 0.1, pricePerKg: 135000, savingsPercent: 5 },
      { minQtyKg: 0.1, maxQtyKg: null, pricePerKg: 125000, savingsPercent: 10 },
    ],
    stockStatus: 'IN_STOCK',
    image: '/images/iran-saffron-jar-5g.jpg',
    isFeatured: true,
    shelfLifeMonths: 24,
    storage: 'Store in a cool, dark place away from light and humidity.',
    allergens: 'None. Pure spice.',
    nutrition: { servingSize: '1g', calories: 3, protein: 0.1, carbs: 0.6, fat: 0, fiber: 0, sodium: 1 },
    tags: ['saffron', 'iran', 'super-negin', 'persian-saffron', 'kesar', 'luxury'],
  },

  // ── Kashmiri Honey (2) ──────────────────────────────────────────────────────
  {
    id: 'hny-001',
    name: 'Pure Kashmiri Acacia Honey',
    slug: 'pure-kashmiri-acacia-honey',
    category: 'Honey',
    categorySlug: 'honey',
    origin: 'Kashmir Valley, India',
    grade: 'Raw & Unfiltered (Grade A+)',
    shortDesc: 'Single-origin white acacia honey harvested from Robinia pseudoacacia blossoms in Kashmir — delicate, floral, and naturally liquid.',
    longDesc: `Harvested in late spring across the pristine acacia groves of the Kashmir Valley. Kashmiri Acacia Honey is prized globally for its pale, almost transparent golden hue, smooth floral sweetness, and high fructose-to-glucose ratio that prevents quick crystallization.\n\n100% raw, unheated, and unpasteurized to preserve active bee enzymes, pollen, and natural antioxidants. Zero added sugar or corn syrup. A natural gourmet sweetener for herbal teas, desserts, and daily wellness.`,
    retailPrice: 780,
    b2bPricePerKg: 1100,
    mrp: 920,
    variants: [
      { sizeG: 250, label: '250g Jar', retailPrice: 420, mrp: 499 },
      { sizeG: 500, label: '500g Jar', retailPrice: 780, mrp: 920 },
      { sizeG: 1000, label: '1 kg Jar', retailPrice: 1450, mrp: 1750 },
    ],
    b2bTiers: buildTiers(580),
    stockStatus: 'IN_STOCK',
    image: '/images/kashmir-honey-jar-500g.jpg',
    isFeatured: true,
    shelfLifeMonths: 36,
    storage: 'Store at room temperature. Do not refrigerate.',
    allergens: 'Pure raw honey. Not recommended for infants under 1 year.',
    nutrition: { servingSize: '20g', calories: 64, protein: 0.1, carbs: 17, fat: 0, fiber: 0, sodium: 1 },
    tags: ['honey', 'kashmiri-honey', 'acacia', 'raw-honey', 'unfiltered', 'kashmir'],
  },
  {
    id: 'hny-002',
    name: 'Kashmiri Wild Forest Sidr Honey',
    slug: 'kashmiri-wild-forest-sidr-honey',
    category: 'Honey',
    categorySlug: 'honey',
    origin: 'Kashmir Foothills, India',
    grade: 'Wild Forest Raw Grade A',
    shortDesc: 'Dark amber artisanal honey gathered from wild Sidr (Jujube) trees in the Himalayan foothills — rich, butterscotch notes and high medicinal value.',
    longDesc: `Harvested by traditional beekeepers from wild Sidr tree blossoms flourishing in the untouched foothills of Kashmir. Sidr honey is celebrated in classical healing traditions for its antimicrobial potency, deep caramel undertone, and rich mineral profile.\n\nUnfiltered, thick, and raw. Excellent for soothing throat irritations, strengthening digestion, and serving as a luxury accompaniment to aged cheeses and dry fruit platters.`,
    retailPrice: 1450,
    b2bPricePerKg: 2200,
    mrp: 1699,
    variants: [
      { sizeG: 250, label: '250g Jar', retailPrice: 750, mrp: 899 },
      { sizeG: 500, label: '500g Jar', retailPrice: 1450, mrp: 1699 },
      { sizeG: 1000, label: '1 kg Jar', retailPrice: 2800, mrp: 3299 },
    ],
    b2bTiers: buildTiers(720),
    stockStatus: 'IN_STOCK',
    image: '/images/kashmir-honey-jar-500g.jpg',
    isFeatured: false,
    shelfLifeMonths: 36,
    storage: 'Store at room temperature in a dry location.',
    allergens: 'Pure raw honey. Not recommended for infants under 1 year.',
    nutrition: { servingSize: '20g', calories: 64, protein: 0.1, carbs: 17, fat: 0, fiber: 0, sodium: 1 },
    tags: ['honey', 'sidr-honey', 'wild-honey', 'forest-honey', 'kashmir', 'ayurvedic'],
  },

  // ── Gourmet Makhana Snack (1) ───────────────────────────────────────────────
  {
    id: 'mkh-004',
    name: 'Desi Ghee & Pink Salt Roasted Makhana',
    slug: 'desi-ghee-pink-salt-roasted-makhana',
    category: 'Makhana',
    categorySlug: 'makhana',
    origin: 'Bihar & A2 Cow Ghee, India',
    grade: 'Gourmet Roasted Jumbo',
    shortDesc: 'Slow-roasted jumbo Mithila makhana tossed in pure Vedic A2 cow ghee and stone-ground Himalayan pink rock salt.',
    longDesc: `Handpicked 6+ Suta jumbo fox nuts from Mithila, slowly roasted in iron kadhais with pure A2 cow ghee and seasoned with natural pink rock salt. Super crunchy, lightly buttery, and completely gluten-free.\n\nAn ideal low-glycemic, gut-friendly snack for diabetic diet management, midday cravings, and children's school tiffins. Contains zero palm oil, zero maltodextrin, and zero artificial flavor enhancers.`,
    retailPrice: 2650,
    b2bPricePerKg: 2320,
    mrp: 3150,
    variants: buildVariants(2650),
    b2bTiers: buildTiers(2320),
    stockStatus: 'IN_STOCK',
    image: '/images/makhana-pouch-250g.jpg',
    isFeatured: true,
    shelfLifeMonths: 6,
    storage: 'Store in an airtight container once unsealed to preserve crunch.',
    allergens: 'Contains: Cow Milk Ghee. Naturally gluten-free.',
    nutrition: { servingSize: '30g', calories: 125, protein: 3.6, carbs: 19, fat: 3.5, fiber: 0.8, sodium: 110 },
    tags: ['makhana', 'roasted-makhana', 'desi-ghee', 'pink-salt', 'snack', 'healthy'],
  },
  // ── Afghanistan Harvest Specialities ─────────────────────────────────────────
  {
    id: 'exo-001',
    name: 'Afghan Hindu Kush Chilgoza (Pine Nuts In-Shell)',
    slug: 'afghan-hindu-kush-chilgoza',
    category: 'Pine Nuts & Exotic',
    categorySlug: 'exotic-nuts',
    origin: 'Hindu Kush, Afghanistan',
    grade: 'Royal Jumbo Grade A+',
    shortDesc: 'Handpicked wild harvest Chilgoza pine nuts from high-altitude Hindu Kush pine forests. Incredibly buttery with rich natural pinolenic acid.',
    longDesc: `Sourced from wild Pinus gerardiana trees that grow at elevations exceeding 2,500 meters in the pristine Hindu Kush ranges of Afghanistan. Afghan Chilgoza is recognized globally as the finest pine nut variety — featuring elongated shells enclosing pale, ivory-gold kernels rich in heart-healthy pinolenic acid and essential minerals.\n\nEach batch is naturally sun-dried and lightly polished by master sorters without bleach or chemicals. Nuty Tales ensures that every shell is unblemished and packed in hermetic vacuum zip pouches with moisture absorbers for peak freshness.\n\nFSSAI Certified, 100% natural, and non-GMO.`,
    retailPrice: 5800,
    b2bPricePerKg: 5100,
    mrp: 6750,
    variants: buildVariants(5800),
    b2bTiers: buildTiers(5100),
    stockStatus: 'IN_STOCK',
    image: '/images/chilgoza-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Sweet cedar aroma', 'Melting buttery texture', 'Subtle resinous undertone'],
      altitude: '2,600m - Hindu Kush High Altitudes',
      harvestSeason: 'Late Autumn Wild Forage',
      oilIndex: 'High Pinolenic Fat Matrix',
      crunchScore: 4.8,
      secondaryImage: '/images/chilgoza-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 9,
    storage: 'Store in an airtight container in a cool, dry place or refrigerate after opening.',
    allergens: 'Contains: Tree Nuts (Pine Nuts).',
    nutrition: { servingSize: '30g', calories: 202, protein: 4.1, carbs: 3.9, fat: 20.5, fiber: 1.1, sodium: 1 },
    tags: ['chilgoza', 'pine-nuts', 'afghanistan', 'hindu-kush', 'superfood', 'exotic-nuts', 'healthy'],
  },
  {
    id: 'rai-004',
    name: 'Afghan Kandahari Abjosh Jumbo Golden Sultanas',
    slug: 'afghan-kandahari-abjosh-raisins',
    category: 'Raisins',
    categorySlug: 'raisins',
    origin: 'Kandahar, Afghanistan',
    grade: 'Extra Long Royal Abjosh Grade 1',
    shortDesc: 'Traditional Afghan Abjosh golden sultanas parboiled and shade-cured in Kishmish Khanas. Extra-long, juicy, and caramel-sweet.',
    longDesc: `Kandahari Abjosh raisins are cultivated using centuries-old viticulture in the arid, high-mineral soils of Kandahar. Freshly harvested elongated seedless grapes are dipped briefly in boiling mineral water (the ancient "ab-josh" technique) and hung in naturally ventilated adobe drying houses known as Kishmish Khanas.\n\nThis artisanal method retains the translucent honey-golden hue and locks in rich grape sugars, polyphenols, and iron without sulphur dioxide treatment. Juicy, soft, and remarkably fragrant.\n\nPacked in certified food-grade Nuty Tales zipper pouches under strict FSSAI quality benchmarks.`,
    retailPrice: 950,
    b2bPricePerKg: 820,
    mrp: 1150,
    variants: buildVariants(950),
    b2bTiers: buildTiers(820),
    stockStatus: 'IN_STOCK',
    image: '/images/abjosh-raisins-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Sun-ripened grape nectar', 'Wild floral honey', 'Silky tender chew'],
      altitude: '1,050m - Arid Kandahar Basins',
      harvestSeason: 'September Solar Cured',
      oilIndex: 'Naturally Moisture-Sealed',
      crunchScore: 3.5,
      secondaryImage: '/images/black-munakka-macro.jpg',
    },
    isFeatured: false,
    shelfLifeMonths: 12,
    storage: 'Store in cool ambient conditions or refrigerate for prolonged chewiness.',
    allergens: 'Packed in a facility handling tree nuts.',
    nutrition: { servingSize: '40g', calories: 120, protein: 1.3, carbs: 31, fat: 0.2, fiber: 1.8, sodium: 8 },
    tags: ['raisins', 'abjosh', 'afghanistan', 'kishmish', 'golden-raisins', 'natural-sweetener'],
  },
  // ── Middle East Harvest Specialities ─────────────────────────────────────────
  {
    id: 'dat-004',
    name: 'Royal Mabroom Dates (Madinah Al-Munawwarah)',
    slug: 'mabroom-dates-madinah',
    category: 'Dates',
    categorySlug: 'dates',
    origin: 'Madinah, Saudi Arabia',
    grade: 'VIP Grade 1 Slender Chewy',
    shortDesc: 'Prestigious elongated Madinah Mabroom dates with a dense, toffee-like chew and delicate caramelized natural sweetness.',
    longDesc: `Cultivated in the ancient volcanic oasis palm groves of Madinah Al-Munawwarah, Mabroom dates are famous for their slender elongated silhouette, dark bronze-amber skin, and distinctively firm yet chewy texture. Unlike soft dates, Mabroom offers a slow-releasing toffee caramel flavor that deepens as you chew.\n\nNaturally low in glycemic index compared to table sugars, Mabroom dates are favored by nutritionists for sustained stamina, potassium replenishing, and festive gifting.\n\nCarefully cleaned, sorted by length, and vacuum sealed under FSSAI certified hygienic standards.`,
    retailPrice: 1650,
    b2bPricePerKg: 1420,
    mrp: 1980,
    variants: buildVariants(1650),
    b2bTiers: buildTiers(1420),
    stockStatus: 'IN_STOCK',
    image: '/images/mabroom-dates-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Burnt caramel toffee', 'Firm resilient chew', 'Subtle malt aroma'],
      altitude: '600m - Volcanic Madinah Oasis',
      harvestSeason: 'Late Summer Rutab Harvest',
      oilIndex: 'Natural Fruit Fructose',
      crunchScore: 3.8,
      secondaryImage: '/images/mabroom-dates-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Store in a cool dry pantry or refrigerate to preserve firm bite.',
    allergens: 'Naturally allergen-free. Contains date pit/seeds.',
    nutrition: { servingSize: '40g', calories: 110, protein: 1.0, carbs: 28, fat: 0.1, fiber: 2.7, sodium: 3 },
    tags: ['dates', 'mabroom', 'madinah', 'saudi-arabia', 'middle-east', 'gourmet-dates', 'energy'],
  },
  {
    id: 'ber-001',
    name: 'Iranian Ruby Wild Barberries (Pofaki Zereshk)',
    slug: 'iranian-ruby-barberries-zereshk',
    category: 'Berries & Superfoods',
    categorySlug: 'berries',
    origin: 'South Khorasan, Iran',
    grade: 'Pofaki Grade A+ Wild Mountain',
    shortDesc: 'Vibrant scarlet Persian wild barberries shade-dried to preserve their puffed shape, jewel luster, and exquisite tart berry tang.',
    longDesc: `Sourced from the pristine mountainous terraces of South Khorasan in Iran, Pofaki Zereshk represents the gold standard of Persian culinary berries. Harvested with branches and gently shade-dried over several months in darkness, these barberries maintain their puffed ruby spherical shape and intense jewel-like crimson color without oxidization.\n\nRenowned for extraordinary antioxidant levels (ORAC value) and berberine content, Zereshk provides an electric, citrusy-tart contrast to pilafs, roasted poultry, salads, and artisan baked goods.\n\nFSSAI approved, washed, and packed in fresh nitrogen-flushed zip barrier pouches.`,
    retailPrice: 1450,
    b2bPricePerKg: 1250,
    mrp: 1750,
    variants: buildVariants(1450),
    b2bTiers: buildTiers(1250),
    stockStatus: 'IN_STOCK',
    image: '/images/barberries-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Electric crimson tartness', 'Citrus berry aroma', 'Puffed tender texture'],
      altitude: '1,800m - South Khorasan Terraces',
      harvestSeason: 'Autumn Shade-Cured Pofaki',
      oilIndex: 'Rich in Berberine & Organic Acids',
      crunchScore: 3.2,
      secondaryImage: '/images/barberries-macro.jpg',
    },
    isFeatured: false,
    shelfLifeMonths: 12,
    storage: 'Keep refrigerated in an airtight jar to retain vibrant crimson color and tartness.',
    allergens: 'Packed in a facility handling tree nuts.',
    nutrition: { servingSize: '30g', calories: 95, protein: 1.2, carbs: 21, fat: 0.5, fiber: 3.8, sodium: 4 },
    tags: ['barberries', 'zereshk', 'iran', 'middle-east', 'berries', 'superfood', 'antioxidants'],
  },
  // ── USA Harvest Specialities ─────────────────────────────────────────────────
  {
    id: 'ber-002',
    name: 'USA Whole Dried Cranberries (Tart-Sweet Grade A)',
    slug: 'american-whole-cranberries',
    category: 'Berries & Superfoods',
    categorySlug: 'berries',
    origin: 'Wisconsin, USA',
    grade: 'Grade A Whole Plump',
    shortDesc: 'Premium whole American bog-grown cranberries gently infused with pure cane juice. Plump, juicy, and antioxidant-rich.',
    longDesc: `Harvested from glacial bogs in Wisconsin and Massachusetts, our Whole Dried Cranberries are plump, crimson-red berries known for their vibrant sweet-tart balance. Unlike shredded or sliced berries, our whole cranberries retain their natural internal juices and succulent chew.\n\nRich in proanthocyanidins (PACs), vitamin C, and dietary fiber, they are the ideal superfood addition to your morning oatmeal, Greek yogurt, trail mixes, festive baked breads, and salads.\n\nNon-GMO, free of artificial red colorings or high fructose corn syrup, and certified by FSSAI.`,
    retailPrice: 1150,
    b2bPricePerKg: 980,
    mrp: 1390,
    variants: buildVariants(1150),
    b2bTiers: buildTiers(980),
    stockStatus: 'IN_STOCK',
    image: '/images/cranberries-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Zesty tart berry', 'Caramelized cane sweetness', 'Juicy succulent chew'],
      altitude: '250m - Glacial Peat Bogs',
      harvestSeason: 'October Water Harvest',
      oilIndex: 'Light Sunflower Oil Shield',
      crunchScore: 3.6,
      secondaryImage: '/images/cranberries-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Store in an airtight zipper pouch away from direct heat and sunlight.',
    allergens: 'Packed in a facility handling tree nuts.',
    nutrition: { servingSize: '40g', calories: 128, protein: 0.4, carbs: 32, fat: 0.5, fiber: 2.4, sodium: 5 },
    tags: ['cranberries', 'usa', 'berries', 'superfood', 'antioxidant', 'baking', 'healthy-snack'],
  },
  {
    id: 'ber-003',
    name: 'USA Wild Dried Blueberries (Antioxidant Superfood)',
    slug: 'wild-dried-blueberries',
    category: 'Berries & Superfoods',
    categorySlug: 'berries',
    origin: 'Pacific Northwest, USA',
    grade: 'Grade A Wild Lowbush',
    shortDesc: 'Deep indigo wild lowbush blueberries from North American barrens. Intensely concentrated antioxidant anthocyanins and deep berry flavor.',
    longDesc: `Wild blueberries (Vaccinium angustifolium) grow naturally in glacial soils across North America. Because they thrive in harsh climates, wild blueberries develop twice the antioxidant power and a far deeper flavor concentration than ordinary cultivated bush blueberries.\n\nEvery tiny deep indigo berry is infused with anthocyanins that support cognitive wellness, vision health, and cellular repair. Enjoy them by the handful, folded into breakfast bowls, or blended into revitalizing smoothies.\n\nFSSAI licensed, zero artificial flavors, hermetically packed in branded Nuty Tales resealable pouches.`,
    retailPrice: 1850,
    b2bPricePerKg: 1580,
    mrp: 2250,
    variants: buildVariants(1850),
    b2bTiers: buildTiers(1580),
    stockStatus: 'IN_STOCK',
    image: '/images/blueberries-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Intense wild blueberry', 'Subtle floral tang', 'Soft tender skin'],
      altitude: '300m - Glacial Barrens',
      harvestSeason: 'August Native Forage',
      oilIndex: 'Natural Anthocyanin Dense',
      crunchScore: 3.4,
      secondaryImage: '/images/blueberries-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Store in a cool, dry place. Seal tightly after each use.',
    allergens: 'Packed in a facility handling tree nuts.',
    nutrition: { servingSize: '30g', calories: 105, protein: 0.8, carbs: 26, fat: 0.4, fiber: 2.9, sodium: 3 },
    tags: ['blueberries', 'usa', 'superfood', 'berries', 'wild-blueberries', 'anthocyanins', 'healthy'],
  },
  {
    id: 'ber-004',
    name: 'California Sun-Dried Pitted Prunes (Sweet D\'Agen Plums)',
    slug: 'california-pitted-prunes',
    category: 'Berries & Superfoods',
    categorySlug: 'berries',
    origin: 'Sacramento Valley, California, USA',
    grade: 'Jumbo Pitted Grade A',
    shortDesc: 'Plump, glossy pitted dried plums from California sunny orchards. Natural gut health support rich in soluble fiber and potassium.',
    longDesc: `Cultivated in the rich soils and sunny Mediterranean climate of California's Sacramento Valley, our pitted prunes are crafted from sweet French D'Agen plums. Harvested at the pinnacle of ripeness, the plums are washed, gently dehydrated, and mechanically pitted with utmost precision.\n\nFamous for promoting digestive regularity, bone density maintenance, and smooth sustained energy. Super moist, delightfully chewy, and naturally luscious without added sugar.\n\nFSSAI approved, sulfur-conscious, and packed in freshness-sealed zip pouches.`,
    retailPrice: 1100,
    b2bPricePerKg: 920,
    mrp: 1320,
    variants: buildVariants(1100),
    b2bTiers: buildTiers(920),
    stockStatus: 'IN_STOCK',
    image: '/images/prunes-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Deep spiced plum', 'Malted honey notes', 'Velvety moist texture'],
      altitude: '150m - Sacramento River Valley',
      harvestSeason: 'August Solar Harvest',
      oilIndex: 'High Soluble Pectin Fiber',
      crunchScore: 3.0,
      secondaryImage: '/images/ajwa-dates-macro.jpg',
    },
    isFeatured: false,
    shelfLifeMonths: 12,
    storage: 'Store in refrigerator after opening for maximum tenderness and freshness.',
    allergens: 'Machine pitted; may rarely contain partial pit fragments.',
    nutrition: { servingSize: '40g', calories: 96, protein: 0.9, carbs: 26, fat: 0.1, fiber: 3.1, sodium: 1 },
    tags: ['prunes', 'california', 'usa', 'dried-fruit', 'gut-health', 'fiber', 'pitted-prunes'],
  },
  {
    id: 'exo-002',
    name: 'California Golden Pecan Halves (Raw Mammoth Halves)',
    slug: 'california-pecan-halves',
    category: 'Pine Nuts & Exotic',
    categorySlug: 'exotic-nuts',
    origin: 'California, USA',
    grade: 'Mammoth Halves Grade 1',
    shortDesc: 'Jumbo golden mammoth pecan halves from American orchards. Naturally sweet, buttery richness ideal for keto snacking and gourmet baking.',
    longDesc: `Sourced from sun-drenched pecan orchards across California, our Mammoth Pecan Halves are celebrated for their golden amber hue, deep ridges, and melt-in-your-mouth buttery sweetness. With a crisp bite and higher unsaturated healthy fat profile than walnuts, pecans contain virtually no bitter skin tannins.\n\nAn essential staple for artisan bakers, keto diets, luxury nut butter blends, and festive holiday desserts. Vacuum packed to eliminate rancidity.\n\nFSSAI certified, raw, unroasted, and completely unpasteurized.`,
    retailPrice: 2400,
    b2bPricePerKg: 2050,
    mrp: 2850,
    variants: buildVariants(2400),
    b2bTiers: buildTiers(2050),
    stockStatus: 'IN_STOCK',
    image: '/images/pecans-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Creamy maple undertone', 'Rich buttery sweetness', 'Tender crisp break'],
      altitude: '200m - Central Valley Orchards',
      harvestSeason: 'Late Fall Orchard Harvest',
      oilIndex: 'Superior Oleic Fat Density',
      crunchScore: 4.6,
      secondaryImage: '/images/pecans-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 9,
    storage: 'Store in airtight container in refrigerator or deep freezer to protect delicate healthy oils.',
    allergens: 'Contains: Tree Nuts (Pecans).',
    nutrition: { servingSize: '30g', calories: 207, protein: 2.7, carbs: 4.1, fat: 21.6, fiber: 2.9, sodium: 0 },
    tags: ['pecans', 'pecan-halves', 'california', 'usa', 'keto', 'exotic-nuts', 'baking', 'healthy'],
  },
  // ── Regional Indian Harvest Specialities ─────────────────────────────────────
  {
    id: 'snk-004',
    name: 'Malabar Black Pepper Roasted Cashews (Tellicherry Pepper)',
    slug: 'malabar-black-pepper-cashews',
    category: 'Healthy Snacks',
    categorySlug: 'healthy-snacks',
    origin: 'Malabar Coast, Kerala, India',
    grade: 'Jumbo W210 Slow-Roasted',
    shortDesc: 'Crisp Goan whole jumbo cashews tossed with cold-pressed virgin coconut oil and crushed sun-dried Tellicherry black peppercorns from Kerala.',
    longDesc: `Celebrating India\'s spice heritage, this signature savoury snack unites large Goan W210 cashew kernels with world-famous Tellicherry Garbled Extra Bold (TGSEB) black peppercorns from Kerala's Malabar Coast. The cashews are gently dry-roasted in small batches to golden crunch, brushed with cold-pressed virgin coconut oil, and dusted with coarse stone-ground black pepper and Himalayan pink salt.\n\nBold, aromatic, and invigorating with zero artificial seasoning powder, zero MSG, and zero palm oil.\n\nFSSAI licensed, nitrogen-flushed to preserve that irresistible fresh-roasted crunch.`,
    retailPrice: 1650,
    b2bPricePerKg: 1420,
    mrp: 1950,
    variants: buildVariants(1650),
    b2bTiers: buildTiers(1420),
    stockStatus: 'IN_STOCK',
    image: '/images/pepper-cashews-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Zesty pungent Tellicherry kick', 'Creamy sweet nut heart', 'Subtle toasted coconut'],
      altitude: 'Coastal Foothills - Western Ghats',
      harvestSeason: 'Winter Harvest Spices & Nuts',
      oilIndex: 'Virgin Cold-Pressed Infusion',
      crunchScore: 4.9,
      secondaryImage: '/images/pepper-cashews-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 6,
    storage: 'Reseal airtight immediately after opening to keep peppercorns crisp and fragrant.',
    allergens: 'Contains: Tree Nuts (Cashews). May contain traces of other nuts.',
    nutrition: { servingSize: '30g', calories: 172, protein: 5.2, carbs: 9.1, fat: 13.8, fiber: 1.1, sodium: 125 },
    tags: ['cashews', 'pepper-cashews', 'kerala', 'malabar', 'snacks', 'roasted-cashews', 'spicy'],
  },
  {
    id: 'wal-003',
    name: 'Kinnaur Wild Mountain Walnuts (High-Altitude Akhrot)',
    slug: 'kinnaur-wild-walnuts',
    category: 'Walnuts',
    categorySlug: 'walnuts',
    origin: 'Kinnaur, Himachal Pradesh, India',
    grade: 'Mountain Organic Wild Shell',
    shortDesc: 'Hard-shell high-altitude wild walnuts from Kinnaur cliffs. Exceptionally high cold-pressed walnut oil content and deep earthy aroma.',
    longDesc: `Harvested from centuries-old seedling walnut trees perched along the steep glacial river valleys of Kinnaur, Himachal Pradesh at altitudes between 2,200 and 3,000 meters. Kinnaur walnuts endure extreme alpine winters, causing the kernels to concentrate massive amounts of protective Omega-3 ALA fatty acids and natural antioxidants.\n\nThough wild mountain shells are firmer than commercial cultivated Kagzi varieties, the inner amber kernels offer an unmatched deeply woodsy, buttery richness prized across Ayurvedic traditions for neurological vitality.\n\n100% wild organic harvest, crack-sorted, and packed under FSSAI certified sanitary conditions.`,
    retailPrice: 1750,
    b2bPricePerKg: 1500,
    mrp: 2100,
    variants: buildVariants(1750),
    b2bTiers: buildTiers(1500),
    stockStatus: 'IN_STOCK',
    image: '/images/himachal-walnuts-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Earthy alpine forest', 'Intense buttery walnut oil', 'Pleasant mild astringency'],
      altitude: '2,400m - Kinnaur Himalayan Terraces',
      harvestSeason: 'October Wild Mountain Shake',
      oilIndex: 'Super High Omega-3 Lipid Matrix',
      crunchScore: 4.7,
      secondaryImage: '/images/cashews-walnuts-macro.jpg',
    },
    isFeatured: false,
    shelfLifeMonths: 9,
    storage: 'Store in an airtight container in a cool pantry or refrigerator.',
    allergens: 'Contains: Tree Nuts (Walnuts).',
    nutrition: { servingSize: '30g', calories: 195, protein: 4.6, carbs: 3.8, fat: 19.8, fiber: 2.1, sodium: 1 },
    tags: ['walnuts', 'himachal', 'kinnaur', 'akhrot', 'wild-harvest', 'omega-3', 'brain-food'],
  },
]

// ─── Helper Functions ───────────────────────────────────────────────────────────
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug)
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, limit)
}

export function getAllSlugs(): string[] {
  return PRODUCTS.map((p) => p.slug)
}

export function getAllCategorySlugs(): string[] {
  return [...new Set(PRODUCTS.map((p) => p.categorySlug))]
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Returns a clean, high-definition gallery containing ONLY images strictly relevant to the product.
 * Eliminates out-of-context craft photos, embroidery shots, travel banners, or unrelated gift boxes.
 */
export function getProductDynamicGallery(product: Product): string[] {
  if (product.images && product.images.length >= 6) {
    return Array.from(new Set(product.images))
  }

  const list: string[] = []

  // 1. Primary branded packshot (standing pouch or jar with official cursive Nutytales logo)
  if (product.image) {
    list.push(product.image)
  }

  const cat = (product.categorySlug || '').toLowerCase()
  const slug = (product.slug || '').toLowerCase()

  // 2. Product-specific authentic raw harvest macro
  if (product.sensory?.secondaryImage) {
    list.push(product.sensory.secondaryImage)
  } else if (slug.includes('cranberr')) {
    list.push('/images/cranberries-macro.jpg')
  } else if (slug.includes('blueberr')) {
    list.push('/images/blueberries-macro.jpg')
  } else if (slug.includes('barberr') || slug.includes('zereshk')) {
    list.push('/images/barberries-macro.jpg')
  } else if (slug.includes('chilgoza') || slug.includes('pine-nut')) {
    list.push('/images/chilgoza-macro.jpg')
  } else if (slug.includes('pecan')) {
    list.push('/images/pecans-macro.jpg')
  } else if (slug.includes('pepper') && slug.includes('cashew')) {
    list.push('/images/pepper-cashews-macro.jpg')
  } else if (slug.includes('prune')) {
    list.push('/images/ajwa-dates-macro.jpg')
  } else if (slug.includes('mabroom')) {
    list.push('/images/mabroom-dates-macro.jpg')
  } else if (cat.includes('almond') || slug.includes('almond') || slug.includes('badam')) {
    list.push('/images/mamra-kernels-macro.jpg')
  } else if (slug.includes('w180') || (cat.includes('cashew') && !slug.includes('piece'))) {
    list.push('/images/cashews-w180-macro.jpg')
  } else if (cat.includes('cashew') || slug.includes('cashew')) {
    list.push('/images/cashews-walnuts-macro.jpg')
  } else if (cat.includes('walnut') || slug.includes('walnut') || slug.includes('akhrot')) {
    list.push('/images/cashews-walnuts-macro.jpg')
  } else if (slug.includes('sliver') || slug.includes('peeled') || cat.includes('pista')) {
    list.push('/images/pista-slivers-macro.jpg')
  } else if (cat.includes('anjeer') || cat.includes('fig') || slug.includes('anjeer') || slug.includes('fig')) {
    list.push('/images/anjeer-macro.jpg')
  } else if (slug.includes('black') || slug.includes('munakka')) {
    list.push('/images/black-munakka-macro.jpg')
  } else if (cat.includes('raisin') || slug.includes('kishmish') || slug.includes('abjosh')) {
    list.push('/images/raisins-pouch-250g.jpg')
  } else if (cat.includes('apricot') || slug.includes('apricot') || slug.includes('khubani')) {
    list.push('/images/apricot-halman-macro.jpg')
  } else if (slug.includes('ajwa') || cat.includes('date') || slug.includes('date')) {
    list.push('/images/ajwa-dates-macro.jpg')
  } else if (cat.includes('saffron') || slug.includes('saffron')) {
    list.push('/images/saffron-threads-macro.jpg')
  } else if (cat.includes('honey') || slug.includes('honey')) {
    list.push('/images/kashmir-honey-jar-500g.jpg')
  } else if (cat.includes('makhana') || slug.includes('makhana')) {
    list.push('/images/makhana-pouch-250g.jpg')
  } else {
    list.push('/images/seeds-mix-pouch-250g.jpg')
  }

  // 3. Culinary lifestyle presentation in artisan ceramic bowl
  list.push('/images/hero-lifestyle-bowl.png')

  // 4. Fine dining luxury table display
  if (cat === 'saffron' || cat === 'honey') {
    list.push('/images/crystal-gold-nut-bowls.jpg')
  } else {
    list.push('/images/dark-wood-gourmet-tray.jpg')
  }

  // 5. Nutytales Certified Purity & FSSAI Seal (Official Brand Badge)
  list.push('/images/nutytales-seal-quality.jpg')

  // 6. Nutytales Hermetic Freshness Lock & Resealable Zip Lock (Official Brand Badge)
  list.push('/images/nutytales-freshness-lock.jpg')

  // 7. Nutytales Nutritional Excellence Whole Foods Seal (Official Brand Badge)
  list.push('/images/nutytales-nutrition-seal.jpg')

  // 8. Luxury Festive Hamper Presentation Context
  if (cat === 'gifting' || slug.includes('box') || slug.includes('hamper')) {
    list.push('/images/luxury-hamper-jars.png')
    list.push('/images/long-festive-gift-box.jpg')
  } else {
    list.push('/images/luxury-teal-gift-box.jpg')
  }

  return Array.from(new Set(list))
}


