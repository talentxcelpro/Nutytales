/**
 * NuttyTales.com — Prisma Seed
 * -----------------------------------------------
 * Seeds initial reference & catalogue data.
 * Safe to re-run: uses upsert on all top-level entities.
 *
 * Run:
 *   npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts
 *
 * Or via package.json:
 *   npm run prisma:seed
 */

import { PrismaClient, LocationCode } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

// ─── helpers ──────────────────────────────────────────────────────────────────

const FSSAI_LICENSE = '22724441000048';
const BRAND = 'Nutty Tales';
const STORAGE = 'Store in a cool, dry place away from direct sunlight. Keep the container tightly sealed after opening.';
const ALLERGEN = 'Contains tree nuts. May contain traces of other nuts and seeds processed in the same facility.';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ─── 1. Locations ─────────────────────────────────────────────────────────────

const LOCATIONS: {
  code: LocationCode;
  name: string;
  city: string;
  state: string;
  fssaiNumber?: string;
  gstin?: string;
  phoneSales: string;
  whatsapp: string;
  email: string;
}[] = [
  {
    code: 'NOIDA',
    name: 'Noida / Delhi NCR',
    city: 'Noida',
    state: 'Uttar Pradesh',
    fssaiNumber: FSSAI_LICENSE,
    gstin: undefined,
    phoneSales: process.env.NEXT_PUBLIC_PHONE_NOIDA ?? '+919999999901',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NOIDA ?? '+919999999901',
    email: 'noida@nuttytales.com',
  },
  {
    code: 'SRINAGAR',
    name: 'Kashmir / Srinagar',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    phoneSales: process.env.NEXT_PUBLIC_PHONE_KASHMIR ?? '+919999999902',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_KASHMIR ?? '+919999999902',
    email: 'kashmir@nuttytales.com',
  },
  {
    code: 'PATNA',
    name: 'Patna / Bihar',
    city: 'Patna',
    state: 'Bihar',
    phoneSales: process.env.NEXT_PUBLIC_PHONE_PATNA ?? '+919999999903',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_PATNA ?? '+919999999903',
    email: 'patna@nuttytales.com',
  },
];

// ─── 2. Categories ────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: 'Almonds',
    slug: 'almonds',
    description: 'Premium California and Indian almonds — raw, roasted, and flavoured varieties sourced directly for maximum freshness.',
    seoTitle: 'Buy Premium Almonds Online | Wholesale & Retail | Nutty Tales',
    seoDescription: 'Shop the finest California almonds at Nutty Tales. Bulk wholesale and retail packs available. Rich in vitamin E, magnesium, and healthy fats.',
    seoKeywords: 'buy almonds online, california almonds, badam wholesale, premium almonds india',
    sortOrder: 1,
  },
  {
    name: 'Cashews',
    slug: 'cashews',
    description: 'High-grade cashews (W180, W240, W320) sourced from India and Vietnam. Ideal for retail consumption and bulk B2B procurement.',
    seoTitle: 'Buy Premium Cashews Online | W240 W320 | Wholesale | Nutty Tales',
    seoDescription: 'Premium cashews in W180, W240, W320 grades. Wholesale and retail packs. Order online from Nutty Tales — India\'s trusted dry fruit brand.',
    seoKeywords: 'cashews wholesale, kaju online, W240 cashew, buy cashews bulk india',
    sortOrder: 2,
  },
  {
    name: 'Raisins',
    slug: 'raisins',
    description: 'Naturally sun-dried Afghan and Indian raisins, available in green seedless and dark black varieties. No added sugar or preservatives.',
    seoTitle: 'Buy Raisins Online | Afghan & Indian Raisins | Nutty Tales',
    seoDescription: 'Shop premium Afghan green raisins and Indian black raisins. Bulk wholesale pricing available. Order from Nutty Tales for best quality.',
    seoKeywords: 'raisins wholesale, afghan raisins, kishmish online, buy raisins india',
    sortOrder: 3,
  },
  {
    name: 'Pistachios',
    slug: 'pistachios',
    description: 'Authentic Iranian closed and Afghan open pistachios. Naturally salted and unsalted options available for retail and bulk orders.',
    seoTitle: 'Buy Pistachios Online | Iranian & Afghan | Wholesale | Nutty Tales',
    seoDescription: 'Premium pistachios — Iranian closed and Afghan open varieties. Wholesale bulk pricing available. Shop at Nutty Tales.',
    seoKeywords: 'pistachios wholesale, pista online, iranian pistachio, buy pista bulk india',
    sortOrder: 4,
  },
  {
    name: 'Walnuts',
    slug: 'walnuts',
    description: 'Kashmiri and Californian walnuts, available with shell and without shell. Naturally rich in omega-3 fatty acids.',
    seoTitle: 'Buy Walnuts Online | Kashmiri Walnuts | Wholesale | Nutty Tales',
    seoDescription: 'Premium Kashmiri and California walnuts — shelled and unshelled. Bulk B2B pricing available. Order from Nutty Tales.',
    seoKeywords: 'walnuts wholesale, akhrot online, kashmiri walnuts, buy walnuts india',
    sortOrder: 5,
  },
  {
    name: 'Anjeer / Dried Figs',
    slug: 'anjeer',
    description: 'Soft and naturally sweet dried figs sourced from Afghanistan and Iran. High in fibre and iron, great for health-conscious consumers.',
    seoTitle: 'Buy Anjeer / Dried Figs | Afghan & Iranian | Nutty Tales',
    seoDescription: 'Premium Afghan and Iranian dried figs (anjeer). Natural, no added sugar. Retail and bulk wholesale pricing at Nutty Tales.',
    seoKeywords: 'anjeer online, dried figs wholesale, afghan figs, buy anjeer india',
    sortOrder: 6,
  },
  {
    name: 'Dates',
    slug: 'dates',
    description: 'Premium Medjool and Kimia dates imported directly from Jordan, UAE, and Iran. Rich in natural sugars, iron, and potassium.',
    seoTitle: 'Buy Premium Dates Online | Medjool & Kimia | Nutty Tales',
    seoDescription: 'Shop authentic Medjool and Kimia dates. Wholesale and retail packs available. Order online at Nutty Tales for guaranteed freshness.',
    seoKeywords: 'buy dates online, medjool dates india, kimia dates wholesale, khajoor online',
    sortOrder: 7,
  },
  {
    name: 'Makhana / Fox Nuts',
    slug: 'makhana',
    description: 'Premium Grade A and B makhana (fox nuts) sourced from Bihar — the world\'s largest makhana-producing region. Low fat, high protein.',
    seoTitle: 'Buy Makhana / Fox Nuts | Grade A & B | Wholesale | Nutty Tales',
    seoDescription: 'Premium Bihar makhana in Grade A and B. Bulk wholesale and retail packs. Order online from Nutty Tales.',
    seoKeywords: 'makhana wholesale, fox nuts online, buy makhana bulk, bihar makhana',
    sortOrder: 8,
  },
  {
    name: 'Seeds',
    slug: 'seeds',
    description: 'Nutritious seeds including sunflower, pumpkin, flax, and chia — perfect for healthy snacking, baking, and smoothies.',
    seoTitle: 'Buy Seeds Online | Chia, Flax, Pumpkin, Sunflower | Nutty Tales',
    seoDescription: 'Shop premium sunflower, pumpkin, chia, and flax seeds at Nutty Tales. Retail and bulk wholesale pricing available.',
    seoKeywords: 'seeds wholesale india, chia seeds online, flax seeds buy, pumpkin seeds',
    sortOrder: 9,
  },
  {
    name: 'Mixed Nuts',
    slug: 'mixed-nuts',
    description: 'Thoughtfully curated mixed nut and trail mix assortments — ideal for gifting, snacking, and healthy meal additions.',
    seoTitle: 'Buy Mixed Nuts & Trail Mix | Healthy Snack | Nutty Tales',
    seoDescription: 'Premium mixed nuts and trail mixes by Nutty Tales. Great for health-conscious snacking and gifting. Retail and wholesale packs.',
    seoKeywords: 'mixed nuts online, trail mix india, dry fruit mix wholesale, premium mixed nuts',
    sortOrder: 10,
  },
  {
    name: 'Healthy Snacks',
    slug: 'healthy-snacks',
    description: 'Roasted, flavoured, and nutritious dry fruit snacks — better-for-you alternatives to processed foods.',
    seoTitle: 'Healthy Dry Fruit Snacks | Buy Online | Nutty Tales',
    seoDescription: 'Shop healthy dry fruit snacks at Nutty Tales. Roasted nuts, flavoured makhana, and more. No artificial ingredients.',
    seoKeywords: 'healthy snacks india, roasted dry fruits, nutritious snacks online, dry fruit snacks',
    sortOrder: 11,
  },
  {
    name: 'Gift Packs',
    slug: 'gift-packs',
    description: 'Elegantly packaged premium dry fruit gift boxes and hampers — perfect for festivals, corporate gifting, and special occasions.',
    seoTitle: 'Dry Fruit Gift Packs | Festival & Corporate Gifting | Nutty Tales',
    seoDescription: 'Premium dry fruit gift boxes and hampers by Nutty Tales. Ideal for Diwali, Eid, corporate gifting and weddings. Bulk orders welcome.',
    seoKeywords: 'dry fruit gift box, festival gift hamper, corporate gifting dry fruits, diwali dry fruit',
    sortOrder: 12,
  },
];

// ─── 3. Nutrition data (per 100g) ─────────────────────────────────────────────

const nutrition = {
  almond: {
    calories: 579,
    protein: 21.2,
    fat: 49.9,
    saturatedFat: 3.8,
    carbohydrates: 21.6,
    fiber: 12.5,
    sugar: 4.4,
    sodium: 1,
    calcium: 264,
    iron: 3.7,
    magnesium: 270,
    vitaminE: 25.6,
    unit: 'per 100g',
  },
  cashew: {
    calories: 553,
    protein: 18.2,
    fat: 43.9,
    saturatedFat: 7.8,
    carbohydrates: 30.2,
    fiber: 3.3,
    sugar: 5.9,
    sodium: 12,
    calcium: 37,
    iron: 6.7,
    magnesium: 292,
    unit: 'per 100g',
  },
  raisin: {
    calories: 299,
    protein: 3.1,
    fat: 0.5,
    saturatedFat: 0.1,
    carbohydrates: 79.2,
    fiber: 3.7,
    sugar: 59.2,
    sodium: 11,
    calcium: 50,
    iron: 1.9,
    potassium: 749,
    unit: 'per 100g',
  },
  pistachio: {
    calories: 562,
    protein: 20.2,
    fat: 45.4,
    saturatedFat: 5.6,
    carbohydrates: 27.5,
    fiber: 10.3,
    sugar: 7.7,
    sodium: 1,
    calcium: 107,
    iron: 3.9,
    magnesium: 121,
    vitaminB6: 1.7,
    unit: 'per 100g',
  },
  walnut: {
    calories: 654,
    protein: 15.2,
    fat: 65.2,
    saturatedFat: 6.1,
    carbohydrates: 13.7,
    fiber: 6.7,
    sugar: 2.6,
    sodium: 2,
    calcium: 98,
    iron: 2.9,
    magnesium: 158,
    omega3: 9.1,
    unit: 'per 100g',
  },
  anjeer: {
    calories: 249,
    protein: 3.3,
    fat: 0.9,
    saturatedFat: 0.1,
    carbohydrates: 63.9,
    fiber: 9.8,
    sugar: 47.9,
    sodium: 10,
    calcium: 162,
    iron: 2,
    potassium: 680,
    unit: 'per 100g',
  },
  dates: {
    calories: 277,
    protein: 1.8,
    fat: 0.2,
    saturatedFat: 0,
    carbohydrates: 75,
    fiber: 6.7,
    sugar: 63.4,
    sodium: 1,
    calcium: 64,
    iron: 0.9,
    potassium: 696,
    unit: 'per 100g',
  },
  makhana: {
    calories: 347,
    protein: 9.7,
    fat: 0.1,
    saturatedFat: 0,
    carbohydrates: 76.9,
    fiber: 14.5,
    sugar: 0,
    sodium: 1,
    calcium: 60,
    iron: 1.4,
    magnesium: 67,
    unit: 'per 100g',
  },
  sunflowerSeed: {
    calories: 584,
    protein: 20.8,
    fat: 51.5,
    saturatedFat: 4.5,
    carbohydrates: 20,
    fiber: 8.6,
    sugar: 2.6,
    sodium: 9,
    calcium: 78,
    iron: 5.3,
    vitaminE: 35.2,
    unit: 'per 100g',
  },
  pumpkinSeed: {
    calories: 559,
    protein: 30.2,
    fat: 49,
    saturatedFat: 8.7,
    carbohydrates: 10.7,
    fiber: 6,
    sugar: 1.3,
    sodium: 7,
    calcium: 46,
    iron: 8.8,
    magnesium: 592,
    zinc: 7.8,
    unit: 'per 100g',
  },
  flaxSeed: {
    calories: 534,
    protein: 18.3,
    fat: 42.2,
    saturatedFat: 3.7,
    carbohydrates: 28.9,
    fiber: 27.3,
    sugar: 1.6,
    sodium: 30,
    calcium: 255,
    iron: 5.7,
    omega3: 22.8,
    unit: 'per 100g',
  },
  chiaSeed: {
    calories: 486,
    protein: 16.5,
    fat: 30.7,
    saturatedFat: 3.3,
    carbohydrates: 42.1,
    fiber: 34.4,
    sugar: 0,
    sodium: 16,
    calcium: 631,
    iron: 7.7,
    omega3: 17.8,
    unit: 'per 100g',
  },
};

// ─── 4. Products ──────────────────────────────────────────────────────────────

interface ProductSeed {
  name: string;
  slug: string;
  sku: string;
  categorySlug: string;
  description: string;
  shortDesc: string;
  origin: string;
  grade?: string;
  gstPercent: number;
  nutritionInfo?: Record<string, unknown>;
  storageInstructions: string;
  allergenInfo: string;
  shelfLifeDays: number;
  isFeatured: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  /** B2C retail price per 1 kg (used to derive all variant prices) */
  pricePerKgRetail: number;
}

const PRODUCTS: ProductSeed[] = [
  // ── Almonds ──────────────────────────────────────────────────────────────────
  {
    name: 'California Almonds (Regular)',
    slug: 'california-almonds-regular',
    sku: 'NT-ALM-CAL-001',
    categorySlug: 'almonds',
    description:
      'California Regular almonds are a staple of healthy eating — sourced from certified orchards in the Central Valley of California. These all-natural, non-pareil variety almonds are thin-skinned, mildly sweet, and ideal for daily consumption, cooking, or making almond milk. Each batch is carefully cleaned and processed to preserve its natural nutritional value.',
    shortDesc: 'Fresh, all-natural California almonds. Perfect for daily snacking and cooking.',
    origin: 'California, USA',
    grade: 'Regular',
    gstPercent: 5,
    nutritionInfo: nutrition.almond,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 365,
    isFeatured: true,
    sortOrder: 1,
    seoTitle: 'Buy California Almonds Regular | Nutty Tales',
    seoDescription: 'California Regular Almonds — fresh, natural, and nutritious. Buy online at Nutty Tales in 250g, 500g, 1kg retail and bulk B2B packs.',
    seoKeywords: 'california almonds, regular almonds, badam online india, buy almonds',
    pricePerKgRetail: 799,
  },
  {
    name: 'California Almonds (Premium)',
    slug: 'california-almonds-premium',
    sku: 'NT-ALM-CAL-002',
    categorySlug: 'almonds',
    description:
      'Our Premium California Almonds are hand-selected from the finest non-pareil crop — larger in size, richer in flavour, and with minimal broken pieces. Ideal for premium gifting, confectionery, and health-focused consumers who demand the best. Sourced directly from California orchards and processed under strict hygiene standards.',
    shortDesc: 'Hand-selected premium large-grade California almonds. Ideal for gifting and gourmet use.',
    origin: 'California, USA',
    grade: 'Premium',
    gstPercent: 5,
    nutritionInfo: nutrition.almond,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 365,
    isFeatured: true,
    sortOrder: 2,
    seoTitle: 'Buy California Almonds Premium | Large Grade | Nutty Tales',
    seoDescription: 'Premium large-grade California almonds. Hand-selected for superior quality. Shop at Nutty Tales for retail and wholesale orders.',
    seoKeywords: 'premium california almonds, large almonds, badam premium, buy almonds bulk',
    pricePerKgRetail: 949,
  },
  // ── Cashews ───────────────────────────────────────────────────────────────────
  {
    name: 'Cashews W240',
    slug: 'cashews-w240',
    sku: 'NT-CSH-W240-001',
    categorySlug: 'cashews',
    description:
      'W240 cashews are a popular medium-grade cashew with 240 kernels per pound, prized for their uniform ivory colour and firm bite. Sourced from trusted processing units across India and Vietnam, these cashews are ideal for retail snacking, mithai making, and food manufacturing. W240 offers an excellent balance of size, flavour, and price.',
    shortDesc: 'Medium-grade W240 cashews. Perfect for snacking, sweets, and cooking.',
    origin: 'India / Vietnam',
    grade: 'W240',
    gstPercent: 5,
    nutritionInfo: nutrition.cashew,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 270,
    isFeatured: true,
    sortOrder: 3,
    seoTitle: 'Buy W240 Cashews | Wholesale & Retail | Nutty Tales',
    seoDescription: 'Premium W240 cashews in retail and bulk packs. Sourced from India and Vietnam. Shop at Nutty Tales.',
    seoKeywords: 'W240 cashew, kaju wholesale, cashew nuts india, buy cashews online',
    pricePerKgRetail: 849,
  },
  {
    name: 'Cashews W320',
    slug: 'cashews-w320',
    sku: 'NT-CSH-W320-001',
    categorySlug: 'cashews',
    description:
      'W320 cashews are one of the most traded cashew grades globally, with approximately 320 kernels per pound. These cashews have a creamy white colour, a slightly smaller size than W240, and a rich buttery flavour. An excellent everyday cashew for snacking, curries, and desserts, available at the most competitive bulk and retail prices.',
    shortDesc: 'Everyday W320 cashews. Best-value grade for snacking and cooking.',
    origin: 'India / Vietnam',
    grade: 'W320',
    gstPercent: 5,
    nutritionInfo: nutrition.cashew,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 270,
    isFeatured: false,
    sortOrder: 4,
    seoTitle: 'Buy W320 Cashews | Best Value | Wholesale | Nutty Tales',
    seoDescription: 'High-quality W320 cashews at the best prices. Bulk wholesale and retail packs. Order from Nutty Tales today.',
    seoKeywords: 'W320 cashew, cashew W320 wholesale, kaju W320, buy cashews bulk',
    pricePerKgRetail: 749,
  },
  {
    name: 'Jumbo Cashews W180',
    slug: 'cashews-w180-jumbo',
    sku: 'NT-CSH-W180-001',
    categorySlug: 'cashews',
    description:
      'W180 Jumbo cashews are the largest commonly available cashew grade — with only 180 kernels per pound — making each kernel noticeably bigger, meatier, and more impressive. Prized for premium gifting and high-end confectionery. Our W180 cashews are sourced from select processing units in India for exceptional quality control.',
    shortDesc: 'Jumbo W180 cashews — the largest, meatiest grade. Premium gifting quality.',
    origin: 'India',
    grade: 'W180',
    gstPercent: 5,
    nutritionInfo: nutrition.cashew,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 270,
    isFeatured: true,
    sortOrder: 5,
    seoTitle: 'Buy Jumbo Cashews W180 | Premium Grade | Nutty Tales',
    seoDescription: 'Jumbo W180 cashews — large, premium grade. Perfect for gifting and gourmet use. Shop at Nutty Tales.',
    seoKeywords: 'W180 cashew, jumbo cashew, premium kaju, large cashew nuts',
    pricePerKgRetail: 1149,
  },
  // ── Raisins ───────────────────────────────────────────────────────────────────
  {
    name: 'Afghan Raisins (Green Seedless)',
    slug: 'afghan-raisins-green-seedless',
    sku: 'NT-RAS-AFG-001',
    categorySlug: 'raisins',
    description:
      'Sourced from the renowned vineyards of Kandahar and Herat in Afghanistan, these green seedless raisins are naturally sun-dried and free of artificial colouring or preservatives. Their distinctive pale green colour, intense sweetness, and plump texture make them among the most prized raisins in the world. Excellent for direct consumption, baking, and biryani.',
    shortDesc: 'Naturally sweet Afghan green seedless raisins. No artificial colour or preservatives.',
    origin: 'Afghanistan',
    grade: 'Premium',
    gstPercent: 5,
    nutritionInfo: nutrition.raisin,
    storageInstructions: STORAGE,
    allergenInfo: 'May contain traces of tree nuts processed in the same facility.',
    shelfLifeDays: 365,
    isFeatured: false,
    sortOrder: 6,
    seoTitle: 'Buy Afghan Green Raisins | Seedless | Nutty Tales',
    seoDescription: 'Premium Afghan green seedless raisins — naturally sun-dried, no preservatives. Shop at Nutty Tales.',
    seoKeywords: 'afghan raisins, green seedless raisins, kishmish wholesale, buy raisins india',
    pricePerKgRetail: 449,
  },
  {
    name: 'Indian Raisins (Black)',
    slug: 'indian-raisins-black',
    sku: 'NT-RAS-IND-001',
    categorySlug: 'raisins',
    description:
      'Indian black raisins are made from dark-skinned grapes grown primarily in Maharashtra and Andhra Pradesh. They have a rich, deep flavour with a higher natural iron content compared to golden raisins. A household staple in Indian cuisine, used in desserts, biryanis, kheer, and as a health supplement. No added sugar or sulphites.',
    shortDesc: 'Rich and nutritious Indian black raisins. High in iron and natural sweetness.',
    origin: 'India',
    grade: 'Standard',
    gstPercent: 5,
    nutritionInfo: nutrition.raisin,
    storageInstructions: STORAGE,
    allergenInfo: 'May contain traces of tree nuts processed in the same facility.',
    shelfLifeDays: 365,
    isFeatured: false,
    sortOrder: 7,
    seoTitle: 'Buy Indian Black Raisins | Kishmish | Nutty Tales',
    seoDescription: 'Natural Indian black raisins — rich in iron, no added sugar. Retail and bulk wholesale at Nutty Tales.',
    seoKeywords: 'indian black raisins, kali kishmish, raisins wholesale, munakka',
    pricePerKgRetail: 349,
  },
  // ── Pistachios ────────────────────────────────────────────────────────────────
  {
    name: 'Iranian Pistachios (Closed)',
    slug: 'iranian-pistachios-closed',
    sku: 'NT-PST-IRN-001',
    categorySlug: 'pistachios',
    description:
      'Iranian Closed pistachios are a round, small-to-medium variety with naturally closed shells — known for their intense flavour and lower moisture content. Sourced from the pistachio orchards of Kerman and Rafsanjan provinces in Iran — the world\'s top pistachio origin. These are lightly salted and roasted to bring out their distinctive, earthy flavour.',
    shortDesc: 'Lightly roasted and salted Iranian closed pistachios from Kerman orchards.',
    origin: 'Iran',
    grade: 'Standard',
    gstPercent: 5,
    nutritionInfo: nutrition.pistachio,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 180,
    isFeatured: false,
    sortOrder: 8,
    seoTitle: 'Buy Iranian Pistachios | Closed Shell | Nutty Tales',
    seoDescription: 'Premium Iranian closed pistachios — lightly salted and roasted. Shop at Nutty Tales.',
    seoKeywords: 'iranian pistachio, pista wholesale, roasted pistachio india, buy pista online',
    pricePerKgRetail: 999,
  },
  {
    name: 'Afghan Pistachios (Open)',
    slug: 'afghan-pistachios-open',
    sku: 'NT-PST-AFG-001',
    categorySlug: 'pistachios',
    description:
      'Afghan Open pistachios are a longer, slim variety with naturally split-open shells that make them easy to eat. Sourced from the pistachio-growing regions of Samangan and Baghlan in Afghanistan, these have a bold, savoury flavour distinct from Iranian varieties. A favourite at festive occasions and as a healthy everyday snack.',
    shortDesc: 'Bold-flavoured Afghan open pistachios — naturally split shell, easy to eat.',
    origin: 'Afghanistan',
    grade: 'Premium',
    gstPercent: 5,
    nutritionInfo: nutrition.pistachio,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 180,
    isFeatured: false,
    sortOrder: 9,
    seoTitle: 'Buy Afghan Pistachios Open | Premium | Nutty Tales',
    seoDescription: 'Premium Afghan open pistachios — naturally split, bold flavour. Shop retail and bulk at Nutty Tales.',
    seoKeywords: 'afghan pistachio, open pista, buy pistachios online, pista bulk india',
    pricePerKgRetail: 1099,
  },
  // ── Walnuts ───────────────────────────────────────────────────────────────────
  {
    name: 'Walnuts (Without Shell)',
    slug: 'walnuts-without-shell',
    sku: 'NT-WLN-001',
    categorySlug: 'walnuts',
    description:
      'Premium shelled walnuts sourced from Kashmiri orchards and Californian farms. These light-coloured, whole walnut kernels have a rich, buttery flavour with a mild bitterness characteristic of high-quality walnuts. Excellent for snacking, baking, salads, and cooking. Packed in airtight pouches to preserve freshness and natural oils.',
    shortDesc: 'Premium shelled walnut kernels — light colour, rich flavour. Ideal for snacking and baking.',
    origin: 'India / California',
    grade: 'Premium',
    gstPercent: 5,
    nutritionInfo: nutrition.walnut,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 270,
    isFeatured: true,
    sortOrder: 10,
    seoTitle: 'Buy Shelled Walnuts | Kashmiri & California | Nutty Tales',
    seoDescription: 'Premium shelled walnut kernels from Kashmir and California. Rich in omega-3. Shop at Nutty Tales.',
    seoKeywords: 'shelled walnuts, akhrot kernels, walnut without shell, buy walnuts online india',
    pricePerKgRetail: 899,
  },
  {
    name: 'Walnuts (With Shell)',
    slug: 'walnuts-with-shell',
    sku: 'NT-WLN-SHL-001',
    categorySlug: 'walnuts',
    description:
      'Whole unshelled walnuts sourced from the orchards of Jammu & Kashmir — India\'s premier walnut growing region. The hard shell naturally protects the kernel, extending freshness and shelf life without any artificial treatment. Popular as a festive gift item and for households who prefer freshly cracked walnuts for maximum flavour.',
    shortDesc: 'Whole in-shell Kashmiri walnuts — naturally protected, maximum freshness.',
    origin: 'India (Kashmir)',
    grade: 'Standard',
    gstPercent: 5,
    nutritionInfo: nutrition.walnut,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 365,
    isFeatured: false,
    sortOrder: 11,
    seoTitle: 'Buy Walnuts With Shell | Kashmiri Akhrot | Nutty Tales',
    seoDescription: 'Whole in-shell Kashmiri walnuts — naturally fresh and ideal for gifting. Buy at Nutty Tales.',
    seoKeywords: 'walnut with shell, kashmiri akhrot, akhrot with shell, whole walnuts india',
    pricePerKgRetail: 549,
  },
  // ── Anjeer ────────────────────────────────────────────────────────────────────
  {
    name: 'Afghan Anjeer (Dried Figs)',
    slug: 'afghan-anjeer-dried-figs',
    sku: 'NT-ANJ-AFG-001',
    categorySlug: 'anjeer',
    description:
      'Afghan dried figs (anjeer) are prized for their soft texture, rich golden colour, and intense natural sweetness. Sourced from the fertile valleys of Kandahar, these figs are sun-dried without any added sugar or preservatives. High in dietary fibre, iron, and calcium — a powerhouse of nutrition enjoyed across Indian households.',
    shortDesc: 'Soft and sweet Afghan dried figs. No added sugar, high in fibre and iron.',
    origin: 'Afghanistan',
    grade: 'Premium',
    gstPercent: 5,
    nutritionInfo: nutrition.anjeer,
    storageInstructions: STORAGE,
    allergenInfo: 'May contain traces of tree nuts processed in the same facility.',
    shelfLifeDays: 270,
    isFeatured: false,
    sortOrder: 12,
    seoTitle: 'Buy Afghan Anjeer | Dried Figs | Nutty Tales',
    seoDescription: 'Premium Afghan dried figs (anjeer) — soft, sweet, no preservatives. Shop at Nutty Tales.',
    seoKeywords: 'afghan anjeer, dried figs wholesale, buy anjeer online, fig india',
    pricePerKgRetail: 699,
  },
  {
    name: 'Iranian Anjeer (Dried Figs)',
    slug: 'iranian-anjeer-dried-figs',
    sku: 'NT-ANJ-IRN-001',
    categorySlug: 'anjeer',
    description:
      'Iranian dried figs from the Estahban region are among the world\'s finest — distinguished by their round shape, dense texture, and deep, honey-like sweetness. Naturally dried under the Persian sun, these figs have a slightly firmer bite compared to Afghan varieties and are widely used in traditional medicine and everyday nutrition.',
    shortDesc: 'Dense and honey-sweet Iranian Estahban dried figs. Naturally sun-dried.',
    origin: 'Iran',
    grade: 'Standard',
    gstPercent: 5,
    nutritionInfo: nutrition.anjeer,
    storageInstructions: STORAGE,
    allergenInfo: 'May contain traces of tree nuts processed in the same facility.',
    shelfLifeDays: 270,
    isFeatured: false,
    sortOrder: 13,
    seoTitle: 'Buy Iranian Anjeer | Dried Figs | Nutty Tales',
    seoDescription: 'Iranian dried figs (anjeer) — dense, honey-sweet, naturally dried. Buy at Nutty Tales.',
    seoKeywords: 'iranian anjeer, estahban figs, dried figs india, buy anjeer bulk',
    pricePerKgRetail: 649,
  },
  // ── Dates ─────────────────────────────────────────────────────────────────────
  {
    name: 'Medjool Dates',
    slug: 'medjool-dates',
    sku: 'NT-DTS-MEJ-001',
    categorySlug: 'dates',
    description:
      'Often called the "King of Dates", Medjool dates are large, fleshy, and naturally caramel-sweet — a premium variety imported directly from Jordan and the UAE. Each date is soft, moist, and filled with rich natural sugars, making them a perfect natural sweetener and energy booster. Ideal for gifting, snacking, and health-conscious consumers.',
    shortDesc: '"King of Dates" — large, caramel-sweet Medjool dates from Jordan/UAE.',
    origin: 'Jordan / UAE',
    grade: 'Premium',
    gstPercent: 5,
    nutritionInfo: nutrition.dates,
    storageInstructions: 'Store in a cool, dry place or refrigerate for extended freshness. Consume within 3 months of opening.',
    allergenInfo: 'May contain traces of nuts processed in the same facility.',
    shelfLifeDays: 180,
    isFeatured: true,
    sortOrder: 14,
    seoTitle: 'Buy Medjool Dates | King of Dates | Nutty Tales',
    seoDescription: 'Premium Medjool dates from Jordan and UAE — large, soft, caramel-sweet. Shop at Nutty Tales.',
    seoKeywords: 'medjool dates india, buy medjool dates online, khajoor premium, king of dates',
    pricePerKgRetail: 999,
  },
  {
    name: 'Kimia Dates',
    slug: 'kimia-dates',
    sku: 'NT-DTS-KIM-001',
    categorySlug: 'dates',
    description:
      'Kimia (also known as Mazafati) dates from Iran are known for their rich dark colour, incredibly soft texture, and intense sweetness with a hint of caramel. One of the most popular date varieties in India, Kimia dates are moist and almost chocolate-like in flavour. Naturally free of added sugar, preservatives, or artificial colour.',
    shortDesc: 'Soft, dark, and intensely sweet Kimia (Mazafati) dates from Iran.',
    origin: 'Iran',
    grade: 'Premium',
    gstPercent: 5,
    nutritionInfo: nutrition.dates,
    storageInstructions: 'Refrigerate upon opening. Consume within 2 months for best quality.',
    allergenInfo: 'May contain traces of nuts processed in the same facility.',
    shelfLifeDays: 180,
    isFeatured: false,
    sortOrder: 15,
    seoTitle: 'Buy Kimia Dates | Mazafati Dates | Nutty Tales',
    seoDescription: 'Premium Iranian Kimia (Mazafati) dates — intensely sweet, soft texture. Buy at Nutty Tales.',
    seoKeywords: 'kimia dates, mazafati dates india, buy dates online, iranian dates wholesale',
    pricePerKgRetail: 699,
  },
  // ── Makhana ───────────────────────────────────────────────────────────────────
  {
    name: 'Makhana Grade A',
    slug: 'makhana-grade-a',
    sku: 'NT-MKH-A-001',
    categorySlug: 'makhana',
    description:
      'Grade A Makhana (fox nuts) from the Mithila region of Bihar — India\'s heartland of makhana cultivation — are the largest and most uniform kernels in the premium category. With a crispy, puffed texture and a neutral flavour that pairs perfectly with any seasoning, Grade A Makhana is ideal for premium snacking, restaurant menus, and health-focused product lines.',
    shortDesc: 'Premium Grade A Makhana from Bihar — large, crispy, and ideal for gourmet snacking.',
    origin: 'Bihar, India',
    grade: 'Grade A',
    gstPercent: 5,
    nutritionInfo: nutrition.makhana,
    storageInstructions: 'Store in an airtight container in a cool, dry place. Keep away from moisture.',
    allergenInfo: 'Naturally nut-free. Processed in a facility that also handles tree nuts.',
    shelfLifeDays: 270,
    isFeatured: true,
    sortOrder: 16,
    seoTitle: 'Buy Grade A Makhana | Fox Nuts Bihar | Wholesale | Nutty Tales',
    seoDescription: 'Premium Grade A Makhana (fox nuts) from Bihar. Bulk wholesale and retail packs. Shop at Nutty Tales.',
    seoKeywords: 'grade A makhana, fox nuts wholesale, makhana bihar, buy makhana bulk',
    pricePerKgRetail: 799,
  },
  {
    name: 'Makhana Grade B',
    slug: 'makhana-grade-b',
    sku: 'NT-MKH-B-001',
    categorySlug: 'makhana',
    description:
      'Grade B Makhana from Bihar consists of medium-sized fox nut kernels — slightly smaller than Grade A but equally nutritious and flavourful. An economical option for food manufacturers, packaged snack companies, and households looking for the same health benefits at a more accessible price point. Ideal for recipes, kheer, raita, and makhana chaat.',
    shortDesc: 'Medium-sized Grade B Makhana from Bihar. Economical and equally nutritious.',
    origin: 'Bihar, India',
    grade: 'Grade B',
    gstPercent: 5,
    nutritionInfo: nutrition.makhana,
    storageInstructions: 'Store in an airtight container in a cool, dry place. Keep away from moisture.',
    allergenInfo: 'Naturally nut-free. Processed in a facility that also handles tree nuts.',
    shelfLifeDays: 270,
    isFeatured: false,
    sortOrder: 17,
    seoTitle: 'Buy Grade B Makhana | Fox Nuts | Wholesale | Nutty Tales',
    seoDescription: 'Grade B Makhana (fox nuts) from Bihar — economical, nutritious, perfect for recipes. Shop at Nutty Tales.',
    seoKeywords: 'grade B makhana, makhana wholesale bulk, fox nuts india, buy makhana',
    pricePerKgRetail: 599,
  },
  // ── Seeds ─────────────────────────────────────────────────────────────────────
  {
    name: 'Sunflower Seeds (Roasted)',
    slug: 'sunflower-seeds-roasted',
    sku: 'NT-SDS-SFW-001',
    categorySlug: 'seeds',
    description:
      'Lightly dry-roasted sunflower seeds without shell — a convenient and nutritious snack loaded with vitamin E, selenium, and healthy unsaturated fats. These Indian-origin sunflower seeds are roasted without oil, preserving their natural flavour and crunch. Great as a standalone snack, salad topping, or bread and muffin ingredient.',
    shortDesc: 'Dry-roasted Indian sunflower seeds. Rich in vitamin E. No oil, no preservatives.',
    origin: 'India',
    grade: 'Standard',
    gstPercent: 5,
    nutritionInfo: nutrition.sunflowerSeed,
    storageInstructions: STORAGE,
    allergenInfo: 'Contains sunflower seeds. May contain traces of other seeds and tree nuts.',
    shelfLifeDays: 180,
    isFeatured: false,
    sortOrder: 18,
    seoTitle: 'Buy Roasted Sunflower Seeds | No Shell | Nutty Tales',
    seoDescription: 'Dry-roasted sunflower seeds — rich in vitamin E, no oil or preservatives. Shop at Nutty Tales.',
    seoKeywords: 'roasted sunflower seeds, surajmukhi beej, buy seeds online india, sunflower seeds snack',
    pricePerKgRetail: 249,
  },
  {
    name: 'Pumpkin Seeds',
    slug: 'pumpkin-seeds',
    sku: 'NT-SDS-PMP-001',
    categorySlug: 'seeds',
    description:
      'Premium raw pumpkin seeds (pepitas) — hulled and cleaned for immediate consumption. Pumpkin seeds are one of the richest plant-based sources of zinc, magnesium, and protein. Our Indian-origin pumpkin seeds are naturally green, mildly nutty in flavour, and perfect for salads, trail mixes, and smoothie bowls.',
    shortDesc: 'Raw hulled pumpkin seeds — high in zinc and magnesium. Perfect for salads and snacking.',
    origin: 'India',
    grade: 'Standard',
    gstPercent: 5,
    nutritionInfo: nutrition.pumpkinSeed,
    storageInstructions: STORAGE,
    allergenInfo: 'Contains pumpkin seeds. May contain traces of other seeds and tree nuts.',
    shelfLifeDays: 180,
    isFeatured: false,
    sortOrder: 19,
    seoTitle: 'Buy Pumpkin Seeds | Pepitas | Raw | Nutty Tales',
    seoDescription: 'Raw hulled pumpkin seeds — high in zinc, magnesium, and protein. Shop at Nutty Tales.',
    seoKeywords: 'pumpkin seeds india, pepitas online, kaddu ke beej, buy pumpkin seeds',
    pricePerKgRetail: 349,
  },
  {
    name: 'Flax Seeds',
    slug: 'flax-seeds',
    sku: 'NT-SDS-FLX-001',
    categorySlug: 'seeds',
    description:
      'Golden brown flax seeds (also called linseed) sourced from Indian farms — one of the oldest and most nutritionally dense seeds known to humankind. An exceptional source of plant-based omega-3 fatty acids, lignans, and dietary fibre. Can be consumed whole or ground. Ideal for adding to rotis, smoothies, and yogurt for a daily health boost.',
    shortDesc: 'Nutrient-dense Indian flax seeds. Excellent source of omega-3 and dietary fibre.',
    origin: 'India',
    grade: 'Standard',
    gstPercent: 5,
    nutritionInfo: nutrition.flaxSeed,
    storageInstructions: STORAGE,
    allergenInfo: 'Contains flax seeds. May contain traces of other seeds and tree nuts.',
    shelfLifeDays: 270,
    isFeatured: false,
    sortOrder: 20,
    seoTitle: 'Buy Flax Seeds | Linseed | Alsi | Nutty Tales',
    seoDescription: 'Premium Indian flax seeds — rich in omega-3 and fibre. Retail and bulk at Nutty Tales.',
    seoKeywords: 'flax seeds india, linseed buy, alsi online, flaxseed wholesale',
    pricePerKgRetail: 199,
  },
  {
    name: 'Chia Seeds',
    slug: 'chia-seeds',
    sku: 'NT-SDS-CHI-001',
    categorySlug: 'seeds',
    description:
      'Premium raw chia seeds — sourced from India and Mexico — are a superfood powerhouse packed with omega-3 fatty acids, calcium, protein, and antioxidants. When soaked, they form a gel-like consistency ideal for puddings, smoothies, and overnight oats. Our chia seeds are raw, unprocessed, and free of any additives.',
    shortDesc: 'Raw chia seeds — omega-3, calcium, and protein-rich superfood.',
    origin: 'India / Mexico',
    grade: 'Premium',
    gstPercent: 5,
    nutritionInfo: nutrition.chiaSeed,
    storageInstructions: STORAGE,
    allergenInfo: 'Contains chia seeds. May contain traces of other seeds and tree nuts.',
    shelfLifeDays: 270,
    isFeatured: false,
    sortOrder: 21,
    seoTitle: 'Buy Chia Seeds | Superfood | Raw | Nutty Tales',
    seoDescription: 'Premium raw chia seeds — high in omega-3, calcium, and protein. Shop at Nutty Tales.',
    seoKeywords: 'chia seeds india, buy chia seeds online, chia seeds wholesale, superfood seeds',
    pricePerKgRetail: 399,
  },
  // ── Mixed Nuts ────────────────────────────────────────────────────────────────
  {
    name: 'Premium Mixed Nuts',
    slug: 'premium-mixed-nuts',
    sku: 'NT-MIX-PMX-001',
    categorySlug: 'mixed-nuts',
    description:
      'A carefully curated blend of our finest almonds, cashews, walnuts, pistachios, and raisins — bringing together the best of each category in one convenient pack. Ideal for daily snacking, gifting, and health-conscious households. Each batch is freshly assembled and packed in airtight, resealable packaging for maximum freshness.',
    shortDesc: 'Premium blend of almonds, cashews, walnuts, pistachios, and raisins. Perfect daily mix.',
    origin: 'Mixed',
    grade: 'Premium',
    gstPercent: 5,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 180,
    isFeatured: true,
    sortOrder: 22,
    seoTitle: 'Buy Premium Mixed Nuts | Healthy Snack | Nutty Tales',
    seoDescription: 'Premium mixed nuts — almonds, cashews, walnuts, pistachios, and raisins. Shop at Nutty Tales.',
    seoKeywords: 'mixed nuts india, premium dry fruit mix, buy mixed nuts, healthy snack mix',
    pricePerKgRetail: 899,
  },
  {
    name: 'Trail Mix',
    slug: 'trail-mix',
    sku: 'NT-MIX-TRL-001',
    categorySlug: 'mixed-nuts',
    description:
      'Our Trail Mix combines roasted nuts, seeds, dried fruits, and cranberries into an energy-dense, on-the-go snack. Inspired by hiker and athlete nutrition, this mix delivers a balanced combination of protein, healthy fats, and natural carbohydrates. A great lunchbox addition, desk snack, or post-workout bite.',
    shortDesc: 'Energy-packed trail mix — nuts, seeds, and dried fruits. Perfect on-the-go snack.',
    origin: 'Mixed',
    grade: 'Standard',
    gstPercent: 5,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 180,
    isFeatured: false,
    sortOrder: 23,
    seoTitle: 'Buy Trail Mix | Healthy On-The-Go Snack | Nutty Tales',
    seoDescription: 'Energy-packed trail mix with nuts, seeds, and dried fruits. Healthy and delicious. Shop at Nutty Tales.',
    seoKeywords: 'trail mix india, healthy snack mix, nut and fruit mix, buy trail mix',
    pricePerKgRetail: 699,
  },
  // ── Gift Packs ────────────────────────────────────────────────────────────────
  {
    name: 'Festival Dry Fruit Box',
    slug: 'festival-dry-fruit-box',
    sku: 'NT-GFT-FES-001',
    categorySlug: 'gift-packs',
    description:
      'Celebrate festivals and special moments with our elegantly packaged Festival Dry Fruit Box. Each box contains a thoughtfully selected assortment of premium almonds, cashews, raisins, pistachios, and dates — beautifully presented in a festive magnetic-closure gift box. Ideal for Diwali, Eid, Holi, Raksha Bandhan, and corporate events.',
    shortDesc: 'Elegant festival gift box with premium almonds, cashews, pistachios, raisins, and dates.',
    origin: 'Mixed',
    grade: 'Premium',
    gstPercent: 5,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 180,
    isFeatured: false,
    sortOrder: 24,
    seoTitle: 'Festival Dry Fruit Gift Box | Diwali Gifting | Nutty Tales',
    seoDescription: 'Premium festival dry fruit gift box — elegant packaging, curated selection. Order for Diwali, Eid, and corporate gifting at Nutty Tales.',
    seoKeywords: 'dry fruit gift box diwali, festival dry fruit hamper, corporate gift dry fruit, buy dry fruit box',
    pricePerKgRetail: 1299,
  },
  {
    name: 'Premium Gift Hamper',
    slug: 'premium-gift-hamper',
    sku: 'NT-GFT-HAM-001',
    categorySlug: 'gift-packs',
    description:
      'The Nutty Tales Premium Gift Hamper is our most prestigious offering — a hand-curated selection of top-grade almonds, jumbo cashews, walnuts, Medjool dates, Afghan anjeer, and Iranian pistachios, presented in a luxury wooden or premium fabric-lined hamper box. Designed for corporate gifting, weddings, anniversaries, and VIP clients who expect nothing but the best.',
    shortDesc: 'Luxury hamper with jumbo cashews, Medjool dates, premium almonds, walnuts, and more.',
    origin: 'Mixed',
    grade: 'Premium',
    gstPercent: 5,
    storageInstructions: STORAGE,
    allergenInfo: ALLERGEN,
    shelfLifeDays: 180,
    isFeatured: false,
    sortOrder: 25,
    seoTitle: 'Premium Gift Hamper | Corporate & Wedding Gifting | Nutty Tales',
    seoDescription: 'Luxury dry fruit gift hamper with premium selection. Perfect for weddings and corporate gifts. Order at Nutty Tales.',
    seoKeywords: 'premium gift hamper, dry fruit hamper, luxury gift box, corporate dry fruit hamper',
    pricePerKgRetail: 1999,
  },
];

// ─── 5. Variants ──────────────────────────────────────────────────────────────

interface VariantSeed {
  name: string;
  suffix: string;
  weightGrams: number;
  packType: string;
  priceMultiplier: number; // relative to pricePerKgRetail (e.g. 0.25 for 250g)
  b2bDiscountPercent: number; // e.g. 0.17 = 17% off retail
  moq: number;
  sortOrder: number;
}

const VARIANT_SEEDS: VariantSeed[] = [
  // B2C
  { name: '250g', suffix: '-250G', weightGrams: 250,  packType: 'Pouch', priceMultiplier: 0.25, b2bDiscountPercent: 0, moq: 1, sortOrder: 1 },
  { name: '500g', suffix: '-500G', weightGrams: 500,  packType: 'Pouch', priceMultiplier: 0.50, b2bDiscountPercent: 0, moq: 1, sortOrder: 2 },
  { name: '1kg',  suffix: '-1KG',  weightGrams: 1000, packType: 'Pouch', priceMultiplier: 1.00, b2bDiscountPercent: 0, moq: 1, sortOrder: 3 },
  // B2B
  { name: '5kg',  suffix: '-5KG',  weightGrams: 5000,  packType: 'Bag', priceMultiplier: 5.00, b2bDiscountPercent: 0.17, moq: 1, sortOrder: 4 },
  { name: '10kg', suffix: '-10KG', weightGrams: 10000, packType: 'Bag', priceMultiplier: 10.00, b2bDiscountPercent: 0.18, moq: 1, sortOrder: 5 },
  { name: '25kg', suffix: '-25KG', weightGrams: 25000, packType: 'Sack', priceMultiplier: 25.00, b2bDiscountPercent: 0.19, moq: 1, sortOrder: 6 },
  { name: '50kg', suffix: '-50KG', weightGrams: 50000, packType: 'Sack', priceMultiplier: 50.00, b2bDiscountPercent: 0.20, moq: 1, sortOrder: 7 },
];

// ─── Inventory quantities for Noida warehouse ──────────────────────────────────

const INVENTORY_BY_SKU: Record<string, number> = {
  'NT-ALM-CAL-001': 500,
  'NT-ALM-CAL-002': 300,
  'NT-CSH-W240-001': 450,
  'NT-CSH-W320-001': 400,
  'NT-CSH-W180-001': 200,
  'NT-RAS-AFG-001': 350,
  'NT-RAS-IND-001': 300,
  'NT-PST-IRN-001': 150,
  'NT-PST-AFG-001': 120,
  'NT-WLN-001': 250,
  'NT-WLN-SHL-001': 200,
  'NT-ANJ-AFG-001': 180,
  'NT-ANJ-IRN-001': 160,
  'NT-DTS-MEJ-001': 120,
  'NT-DTS-KIM-001': 200,
  'NT-MKH-A-001': 350,
  'NT-MKH-B-001': 300,
  'NT-SDS-SFW-001': 250,
  'NT-SDS-PMP-001': 220,
  'NT-SDS-FLX-001': 300,
  'NT-SDS-CHI-001': 200,
  'NT-MIX-PMX-001': 150,
  'NT-MIX-TRL-001': 120,
  'NT-GFT-FES-001': 100,
  'NT-GFT-HAM-001': 80,
};

// Products that get B2B price tiers (on 5kg variant)
const TIERED_PRODUCTS = new Set([
  'NT-ALM-CAL-001',
  'NT-ALM-CAL-002',
  'NT-CSH-W240-001',
  'NT-CSH-W320-001',
  'NT-CSH-W180-001',
  'NT-MKH-A-001',
  'NT-MKH-B-001',
]);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Starting NuttyTales seed...\n');

  // ── 1. Locations ─────────────────────────────────────────────────────────────

  console.log('📍  Seeding locations...');
  const locationMap: Record<LocationCode, string> = {} as Record<LocationCode, string>;

  for (const loc of LOCATIONS) {
    const created = await prisma.location.upsert({
      where: { code: loc.code },
      update: {
        name: loc.name,
        city: loc.city,
        state: loc.state,
        fssaiNumber: loc.fssaiNumber ?? null,
        gstin: loc.gstin ?? null,
        phoneSales: loc.phoneSales,
        whatsapp: loc.whatsapp,
        email: loc.email,
        isActive: true,
      },
      create: {
        code: loc.code,
        name: loc.name,
        city: loc.city,
        state: loc.state,
        fssaiNumber: loc.fssaiNumber ?? null,
        gstin: loc.gstin ?? null,
        phoneSales: loc.phoneSales,
        whatsapp: loc.whatsapp,
        email: loc.email,
        isActive: true,
      },
    });
    locationMap[loc.code] = created.id;
    console.log(`   ✓ ${loc.name} (${loc.code})`);
  }

  // ── 2. Warehouses ─────────────────────────────────────────────────────────────

  console.log('\n🏭  Seeding warehouses...');
  const warehouseMap: Record<LocationCode, string> = {} as Record<LocationCode, string>;

  const warehouseDefs: { code: LocationCode; name: string; address: string }[] = [
    {
      code: 'NOIDA',
      name: 'Noida Main Warehouse',
      address: 'Sector 63, Noida, Uttar Pradesh, India - 201301',
    },
    {
      code: 'SRINAGAR',
      name: 'Kashmir / Srinagar Warehouse',
      address: 'Rajbagh, Srinagar, Jammu & Kashmir, India - 190008',
    },
    {
      code: 'PATNA',
      name: 'Patna Warehouse',
      address: 'Bailey Road, Patna, Bihar, India - 800001',
    },
  ];

  for (const wh of warehouseDefs) {
    const locationId = locationMap[wh.code];
    // Use findFirst then upsert-style create/update to avoid needing a unique key beyond locationId
    const existing = await prisma.warehouse.findFirst({
      where: { locationId, name: wh.name },
    });
    let warehouse;
    if (existing) {
      warehouse = await prisma.warehouse.update({
        where: { id: existing.id },
        data: { address: wh.address, isActive: true },
      });
    } else {
      warehouse = await prisma.warehouse.create({
        data: {
          locationId,
          name: wh.name,
          address: wh.address,
          isActive: true,
        },
      });
    }
    warehouseMap[wh.code] = warehouse.id;
    console.log(`   ✓ ${wh.name}`);
  }

  // ── 3. Categories ─────────────────────────────────────────────────────────────

  console.log('\n📂  Seeding categories...');
  const categoryMap: Record<string, string> = {};

  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        seoTitle: cat.seoTitle,
        seoDescription: cat.seoDescription,
        seoKeywords: cat.seoKeywords,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        seoTitle: cat.seoTitle,
        seoDescription: cat.seoDescription,
        seoKeywords: cat.seoKeywords,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoryMap[cat.slug] = created.id;
    console.log(`   ✓ ${cat.name}`);
  }

  // ── 4 & 5. Products + Variants ─────────────────────────────────────────────

  console.log('\n📦  Seeding products and variants...');
  const noida5kgVariantIds: Map<string, string> = new Map(); // productSku → variantId for 5kg

  for (const prod of PRODUCTS) {
    const categoryId = categoryMap[prod.categorySlug];
    if (!categoryId) {
      console.warn(`   ⚠  Category "${prod.categorySlug}" not found for ${prod.sku}`);
      continue;
    }

    // Upsert product
    const product = await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {
        name: prod.name,
        slug: prod.slug,
        categoryId,
        description: prod.description,
        shortDesc: prod.shortDesc,
        origin: prod.origin,
        grade: prod.grade,
        brand: BRAND,
        gstPercent: prod.gstPercent,
        nutritionInfo: (prod.nutritionInfo as any) ?? undefined,
        storageInstructions: prod.storageInstructions,
        allergenInfo: prod.allergenInfo,
        shelfLifeDays: prod.shelfLifeDays,
        isFeatured: prod.isFeatured,
        sortOrder: prod.sortOrder,
        fssaiInfo: FSSAI_LICENSE,
        isActive: true,
        seoTitle: prod.seoTitle,
        seoDescription: prod.seoDescription,
        seoKeywords: prod.seoKeywords,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku,
        categoryId,
        description: prod.description,
        shortDesc: prod.shortDesc,
        origin: prod.origin,
        grade: prod.grade,
        brand: BRAND,
        gstPercent: prod.gstPercent,
        nutritionInfo: (prod.nutritionInfo as any) ?? undefined,
        storageInstructions: prod.storageInstructions,
        allergenInfo: prod.allergenInfo,
        shelfLifeDays: prod.shelfLifeDays,
        isFeatured: prod.isFeatured,
        sortOrder: prod.sortOrder,
        fssaiInfo: FSSAI_LICENSE,
        isActive: true,
        seoTitle: prod.seoTitle,
        seoDescription: prod.seoDescription,
        seoKeywords: prod.seoKeywords,
      },
    });

    // Upsert variants
    for (const vs of VARIANT_SEEDS) {
      const variantSku = prod.sku + vs.suffix;
      const rawRetailPrice = prod.pricePerKgRetail * vs.priceMultiplier;
      // Round to nearest ₹1
      const retailPrice = Math.round(rawRetailPrice);
      const b2bPrice = vs.b2bDiscountPercent > 0
        ? Math.round(rawRetailPrice * (1 - vs.b2bDiscountPercent))
        : null;

      const variant = await prisma.productVariant.upsert({
        where: { sku: variantSku },
        update: {
          name: vs.name,
          weightGrams: vs.weightGrams,
          packType: vs.packType,
          retailPrice,
          b2bPrice: b2bPrice ?? undefined,
          mrp: retailPrice,
          moq: vs.moq,
          isActive: true,
          sortOrder: vs.sortOrder,
        },
        create: {
          productId: product.id,
          name: vs.name,
          sku: variantSku,
          weightGrams: vs.weightGrams,
          packType: vs.packType,
          retailPrice,
          b2bPrice: b2bPrice ?? undefined,
          mrp: retailPrice,
          moq: vs.moq,
          isActive: true,
          sortOrder: vs.sortOrder,
        },
      });

      // Track 5kg variant for tiered pricing
      if (vs.name === '5kg') {
        noida5kgVariantIds.set(prod.sku, variant.id);
      }
    }

    console.log(`   ✓ ${prod.name} (${prod.sku}) + ${VARIANT_SEEDS.length} variants`);
  }

  // ── 6. B2B Price Tiers (5kg variant) ─────────────────────────────────────────

  console.log('\n💰  Seeding B2B price tiers...');

  for (const [productSku, variantId] of noida5kgVariantIds.entries()) {
    if (!TIERED_PRODUCTS.has(productSku)) continue;

    const prod = PRODUCTS.find((p) => p.sku === productSku)!;
    // Base B2B 5kg price (same formula as variant seed above)
    const baseB2bPrice5kg = prod.pricePerKgRetail * 5 * (1 - 0.17);
    const pricePerUnit = baseB2bPrice5kg; // per 5kg unit

    // Delete existing tiers for idempotency
    await prisma.b2bPriceTier.deleteMany({ where: { variantId } });

    // Create tiers (price here is per variant unit — i.e. per 5kg pack)
    await prisma.b2bPriceTier.createMany({
      data: [
        {
          variantId,
          minQty: 1,
          maxQty: 1.99,
          price: Math.round(pricePerUnit),
          label: 'Tier 1 (1–1.99 units)',
        },
        {
          variantId,
          minQty: 2,
          maxQty: 4.99,
          price: Math.round(pricePerUnit * 0.97),
          label: 'Tier 2 (2–4.99 units / 10–24.9kg)',
        },
        {
          variantId,
          minQty: 5,
          maxQty: 9.99,
          price: Math.round(pricePerUnit * 0.94),
          label: 'Tier 3 (5–9.99 units / 25–49.9kg)',
        },
        {
          variantId,
          minQty: 10,
          maxQty: null,
          price: Math.round(pricePerUnit * 0.91),
          label: 'Tier 4 (10+ units / 50kg+)',
        },
      ],
    });

    console.log(`   ✓ Price tiers for ${productSku} (5kg variant)`);
  }

  // ── 7. Inventory (Noida warehouse) ───────────────────────────────────────────

  console.log('\n📊  Seeding Noida inventory...');
  const noidaWarehouseId = warehouseMap['NOIDA'];

  for (const prod of PRODUCTS) {
    const product = await prisma.product.findUnique({ where: { sku: prod.sku } });
    if (!product) continue;

    const baseQty = INVENTORY_BY_SKU[prod.sku] ?? 100;

    await prisma.inventory.upsert({
      where: { productId_warehouseId: { productId: product.id, warehouseId: noidaWarehouseId } },
      update: {},
      create: {
        productId: product.id,
        warehouseId: noidaWarehouseId,
        available: baseQty,
        reserved: 0,
        incoming: 0,
        reorderPoint: Math.round(baseQty * 0.2),
        reorderQty: Math.round(baseQty * 0.5),
      },
    });

    console.log(`   ✓ ${prod.name}: ${baseQty} kg available`);
  }

  // ── 8. FSSAI Record ──────────────────────────────────────────────────────────

  console.log('\n📋  Seeding FSSAI record...');

  const existingFssai = await prisma.fssaiRecord.findFirst({
    where: { licenseNumber: FSSAI_LICENSE },
  });

  if (!existingFssai) {
    await prisma.fssaiRecord.create({
      data: {
        licenseNumber: FSSAI_LICENSE,
        businessName: BRAND,
        licenseType: 'Registration',
        category: 'Trader / Wholesaler',
        isActive: true,
        documents: [],
      },
    });
  } else {
    await prisma.fssaiRecord.update({
      where: { id: existingFssai.id },
      data: {
        businessName: BRAND,
        licenseType: 'Registration',
        category: 'Trader / Wholesaler',
        isActive: true,
      },
    });
  }
  console.log(`   ✓ FSSAI ${FSSAI_LICENSE}`);

  // ── 9. Admin User ────────────────────────────────────────────────────────────

  console.log('\n👤  Seeding admin user...');

  const ADMIN_EMAIL = 'admin@nuttytales.com';
  const ADMIN_PASSWORD = 'NuttyTales@Admin2026';
  const passwordHash = await bcryptjs.hash(ADMIN_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: 'Nutty Tales Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
      // Only update passwordHash if it was missing (don't overwrite if admin changed it)
      passwordHash,
    },
    create: {
      name: 'Nutty Tales Admin',
      email: ADMIN_EMAIL,
      role: 'SUPER_ADMIN',
      isActive: true,
      passwordHash,
    },
  });

  console.log(`   ✓ Admin user: ${ADMIN_EMAIL}`);

  // ─────────────────────────────────────────────────────────────────────────────

  console.log('\n✅  NuttyTales seed completed successfully!');
  console.log('   Locations: 3');
  console.log('   Warehouses: 3');
  console.log(`   Categories: ${CATEGORIES.length}`);
  console.log(`   Products: ${PRODUCTS.length}`);
  console.log(`   Variants per product: ${VARIANT_SEEDS.length} (${PRODUCTS.length * VARIANT_SEEDS.length} total)`);
  console.log(`   B2B Price Tiers: ${TIERED_PRODUCTS.size} products × 4 tiers`);
  console.log('   Inventory: Noida warehouse seeded');
  console.log('   FSSAI: 1 record');
  console.log('   Admin User: admin@nuttytales.com');
  console.log('\n⚠️   SECURITY: Change the admin password immediately after first login!');
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
