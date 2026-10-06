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
function buildVariants(pricePerKg: number, mrpMultiplier = 1.1): ProductVariant[] {
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
    longDesc: `Our California Almonds are sourced directly from certified farms in the San Joaquin Valley. Every batch is hand-selected for uniform size, superior crunch, and rich natural flavour. Free from artificial additives and preservatives. These almonds are perfect for daily snacking, baking, smoothies, milk preparation, and corporate gifting.\n\nNutty Tales almonds are FSSAI-certified, vacuum-packed to preserve freshness, and available in retail packs as well as wholesale sacks for businesses, cloud kitchens, and HORECA buyers.`,
    retailPrice: 980,
    b2bPricePerKg: 890,
    mrp: 1099,
    variants: buildVariants(980),
    b2bTiers: buildTiers(890),
    stockStatus: 'IN_STOCK',
    image: '/images/almonds-pouch-250g.png',
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
    longDesc: `Mamra Almonds (also called Kashmiri Badam) are considered the finest variety of almonds in the world. Unlike California almonds, Mamra almonds are cultivated in the high altitudes of Kashmir and Afghanistan. They are smaller, wrinkled, and oil-rich — containing up to 50% more oil than California almonds.\n\nTraditionally used in Unani and Ayurvedic medicine, they are prized for brain health, skin nourishment, and energy. Nutty Tales sources these directly from farms in the Kashmir Valley, ensuring zero adulteration.`,
    retailPrice: 2200,
    b2bPricePerKg: 1950,
    mrp: 2499,
    variants: buildVariants(2200),
    b2bTiers: buildTiers(1950),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 1050,
    b2bPricePerKg: 950,
    mrp: 1199,
    variants: buildVariants(1050),
    b2bTiers: buildTiers(950),
    stockStatus: 'IN_STOCK',
    isFeatured: false,
    shelfLifeMonths: 6,
    storage: 'Store in a cool, dry place. Once opened, consume within 30 days.',
    allergens: 'Tree Nuts (Almonds), Salt. May contain traces of peanuts.',
    nutrition: { servingSize: '30g', calories: 178, protein: 6, carbs: 6.5, fat: 15, fiber: 3.5, sodium: 95 },
    tags: ['almonds', 'roasted', 'salted', 'snacking'],
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
    retailPrice: 1100,
    b2bPricePerKg: 980,
    mrp: 1249,
    variants: buildVariants(1100),
    b2bTiers: buildTiers(980),
    stockStatus: 'IN_STOCK',
    image: '/images/cashews-pouch-250g.jpg',
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
    retailPrice: 820,
    b2bPricePerKg: 740,
    mrp: 950,
    variants: buildVariants(820),
    b2bTiers: buildTiers(740),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 1180,
    b2bPricePerKg: 1060,
    mrp: 1350,
    variants: buildVariants(1180),
    b2bTiers: buildTiers(1060),
    stockStatus: 'LOW_STOCK',
    isFeatured: false,
    shelfLifeMonths: 6,
    storage: 'Store in an airtight container. Consume within 45 days of opening.',
    allergens: 'Tree Nuts (Cashews). Processed in a facility handling other tree nuts.',
    nutrition: { servingSize: '30g', calories: 168, protein: 5, carbs: 9.5, fat: 13.5, fiber: 0.9, sodium: 0 },
    tags: ['cashews', 'roasted', 'unsalted', 'health', 'keto'],
  },

  // ── Walnuts (2) ──────────────────────────────────────────────────────────────
  {
    id: 'wln-001',
    name: 'Kashmiri Walnuts (In-Shell)',
    slug: 'kashmiri-walnuts-in-shell',
    category: 'Walnuts',
    categorySlug: 'walnuts',
    origin: 'Kashmir, India',
    grade: 'Grade A',
    shortDesc: 'Freshly harvested thin-shelled Kashmiri walnuts — brain-shaped goodness in its most natural form.',
    longDesc: `Kashmiri walnuts are world-renowned for their thin shells, light colour, and rich, buttery kernel. Harvested from walnut orchards in the beautiful Kashmir Valley, these walnuts are packed within days of harvest to ensure maximum freshness.\n\nIn-shell walnuts have a longer shelf life and the freshest taste. Great for households, bakers, and gift hampers.`,
    retailPrice: 700,
    b2bPricePerKg: 630,
    mrp: 799,
    variants: buildVariants(700),
    b2bTiers: buildTiers(630),
    stockStatus: 'IN_STOCK',
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Store in a cool, dry place. Keep away from strong odours.',
    allergens: 'Tree Nuts (Walnuts). Processed in a facility handling other tree nuts.',
    nutrition: { servingSize: '30g', calories: 196, protein: 4.5, carbs: 4, fat: 19, fiber: 2, sodium: 0 },
    tags: ['walnuts', 'kashmir', 'in-shell', 'fresh'],
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
    retailPrice: 950,
    b2bPricePerKg: 860,
    mrp: 1099,
    variants: buildVariants(950),
    b2bTiers: buildTiers(860),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 1350,
    b2bPricePerKg: 1200,
    mrp: 1550,
    variants: buildVariants(1350),
    b2bTiers: buildTiers(1200),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 1280,
    b2bPricePerKg: 1140,
    mrp: 1450,
    variants: buildVariants(1280),
    b2bTiers: buildTiers(1140),
    stockStatus: 'IN_STOCK',
    isFeatured: false,
    shelfLifeMonths: 12,
    storage: 'Store in an airtight container in a cool, dry place.',
    allergens: 'Tree Nuts (Pistachios). Processed in a facility handling other tree nuts.',
    nutrition: { servingSize: '30g', calories: 173, protein: 6, carbs: 8, fat: 14, fiber: 3, sodium: 0 },
    tags: ['pistachios', 'raw', 'unsalted', 'health', 'afghanistan'],
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
    retailPrice: 520,
    b2bPricePerKg: 460,
    mrp: 599,
    variants: buildVariants(520),
    b2bTiers: buildTiers(460),
    stockStatus: 'IN_STOCK',
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
    longDesc: `Munakka (large black raisins) are the traditional form of dried grapes used extensively in Ayurvedic medicine. Unlike regular raisins, Munakka are larger, contain seeds, and have a more complex, tangy-sweet flavour.\n\nHigh in iron and antioxidants, they are commonly soaked overnight and consumed first thing in the morning. Nutty Tales sources Munakka directly from Afghanistan and Kashmir.`,
    retailPrice: 580,
    b2bPricePerKg: 510,
    mrp: 680,
    variants: buildVariants(580),
    b2bTiers: buildTiers(510),
    stockStatus: 'IN_STOCK',
    isFeatured: false,
    shelfLifeMonths: 18,
    storage: 'Store in a cool, dry place in an airtight container.',
    allergens: 'May contain traces of tree nuts from shared facility.',
    nutrition: { servingSize: '40g', calories: 128, protein: 1.2, carbs: 34, fat: 0.2, fiber: 1.8, sodium: 5 },
    tags: ['raisins', 'munakka', 'black', 'ayurvedic', 'seeded'],
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
    retailPrice: 850,
    b2bPricePerKg: 750,
    mrp: 999,
    variants: buildVariants(850),
    b2bTiers: buildTiers(750),
    stockStatus: 'IN_STOCK',
    isFeatured: false,
    shelfLifeMonths: 24,
    storage: 'Store in a cool, dry place. Refrigerate after opening.',
    allergens: 'No known allergens. Produced in a facility handling tree nuts.',
    nutrition: { servingSize: '40g', calories: 122, protein: 0.7, carbs: 33, fat: 0.1, fiber: 2.8, sodium: 1 },
    tags: ['dates', 'safawi', 'saudi', 'ramadan', 'natural'],
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
    retailPrice: 650,
    b2bPricePerKg: 575,
    mrp: 749,
    variants: buildVariants(650),
    b2bTiers: buildTiers(575),
    stockStatus: 'IN_STOCK',
    isFeatured: false,
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
    retailPrice: 850,
    b2bPricePerKg: 760,
    mrp: 999,
    variants: buildVariants(850),
    b2bTiers: buildTiers(760),
    stockStatus: 'LOW_STOCK',
    isFeatured: false,
    shelfLifeMonths: 12,
    storage: 'Store in an airtight container. Refrigerate for extended shelf life.',
    allergens: 'No known allergens. Wild harvested.',
    nutrition: { servingSize: '40g', calories: 112, protein: 1.5, carbs: 29, fat: 0.4, fiber: 4.5, sodium: 3 },
    tags: ['anjeer', 'figs', 'afghanistan', 'wild', 'rare'],
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
    longDesc: `Makhana (Fox Nuts / Lotus Seeds) is a superfood cultivated in the wetlands of Bihar, India. Nutty Tales sources Grade A Makhana directly from farmers in Darbhanga and Madhubani — the heart of India's Makhana belt.\n\nGrade A Makhana are characterised by large, uniform size (Sutta 6 grade), brilliant white colour, and exceptional crispness. Zero additives, zero processing, straight from the farm.\n\nPerfect for roasting with ghee and spices, making Makhana kheer, trail mixes, and baby food. Our Makhana is sourced fresh at harvest season and vacuum-packed for maximum shelf life.`,
    retailPrice: 480,
    b2bPricePerKg: 420,
    mrp: 549,
    variants: buildVariants(480),
    b2bTiers: buildTiers(420),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 360,
    b2bPricePerKg: 310,
    mrp: 420,
    variants: buildVariants(360),
    b2bTiers: buildTiers(310),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 560,
    b2bPricePerKg: 490,
    mrp: 650,
    variants: buildVariants(560),
    b2bTiers: buildTiers(490),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 450,
    b2bPricePerKg: 395,
    mrp: 520,
    variants: buildVariants(450),
    b2bTiers: buildTiers(395),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 1500,
    b2bPricePerKg: 1350,
    mrp: 1750,
    variants: buildVariants(1500),
    b2bTiers: buildTiers(1350),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 1050,
    b2bPricePerKg: 940,
    mrp: 1199,
    variants: buildVariants(1050),
    b2bTiers: buildTiers(940),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 750,
    b2bPricePerKg: 660,
    mrp: 880,
    variants: buildVariants(750),
    b2bTiers: buildTiers(660),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 380,
    b2bPricePerKg: 330,
    mrp: 449,
    variants: buildVariants(380),
    b2bTiers: buildTiers(330),
    stockStatus: 'IN_STOCK',
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
    longDesc: `The Nutty Tales Premium Diwali Gift Box is the ultimate gifting statement. A hand-crafted wooden box with satin lining, containing 8 premium dry fruits in individual compartments: Mamra Almonds, W240 Cashews, Iranian Pistachios, Kashmiri Walnuts, Medjool Dates, Afghan Kishmish, Turkish Figs, and Masala Makhana.\n\nCustom branding available for corporate orders of 50+ boxes. GST invoice provided. Pan-India delivery with special festive packaging.`,
    retailPrice: 2999,
    b2bPricePerKg: 2600,
    mrp: 3499,
    variants: [
      { sizeG: 1000, label: '1 kg (8×125g)', retailPrice: 2999, mrp: 3499 },
      { sizeG: 2000, label: '2 kg (8×250g)', retailPrice: 5799, mrp: 6999 },
    ],
    b2bTiers: buildTiers(2600),
    stockStatus: 'IN_STOCK',
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
    retailPrice: 1299,
    b2bPricePerKg: 1150,
    mrp: 1499,
    variants: [
      { sizeG: 1000, label: '1 kg (5-in-1)', retailPrice: 1299, mrp: 1499 },
      { sizeG: 2000, label: '2 kg (5-in-1)', retailPrice: 2499, mrp: 2999 },
    ],
    b2bTiers: buildTiers(1150),
    stockStatus: 'IN_STOCK',
    isFeatured: false,
    shelfLifeMonths: 6,
    storage: 'Store in a cool, dry place. Each individual pouch is resealable.',
    allergens: 'Contains multiple tree nuts. Not suitable for nut allergy sufferers.',
    nutrition: { servingSize: '30g', calories: 158, protein: 4, carbs: 14, fat: 10, fiber: 2, sodium: 15 },
    tags: ['gift', 'family-pack', 'value', 'everyday', 'indian', 'eid', 'diwali'],
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
