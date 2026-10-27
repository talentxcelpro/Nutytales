// ─── Nuty Tales Gifting — Complete Marketplace Data Engine ────────────────────
// Real catalogue, categories, occasions, and recipients matching e-commerce design

export interface GiftingCategory {
  id: string
  name: string
  slug: string
  shortDesc: string
  image: string
  count: number
}

export interface GiftingOccasion {
  id: string
  name: string
  slug: string
  subtitle: string
  category: 'personal' | 'milestone' | 'festival' | 'corporate'
  image: string
  description: string
  popularPicks: string[]
}

export interface GiftingRecipient {
  id: string
  name: string
  slug: string
  description: string
  badge: string
  image: string
}

export interface GiftVariant {
  id: string
  name: string
  weightGrams?: number
  price: number
  mrp: number
  sku: string
}

export interface GiftingProduct {
  id: string
  slug: string
  sku: string
  name: string
  subtitle?: string
  categorySlug: string
  categoryName: string
  price: number
  mrp: number
  discountPercent?: number
  rating: number
  reviewCount: number
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  images: string[]
  primaryImage: string
  shortDesc: string
  longDesc: string
  contents: string[]
  specifications: Record<string, string>
  occasions: string[] // slugs
  recipients: string[] // slugs
  isBestseller: boolean
  isFeatured: boolean
  isPersonalizable: boolean
  personalizationOptions?: {
    allowsName: boolean
    allowsMessage: boolean
    allowsDate: boolean
    allowsPhoto?: boolean
    charLimit?: number
  }
  variants?: GiftVariant[]
  fssaiNumber?: string
  shelfLife?: string
  origin?: string
  badge?: string
}

// ─── 1. Gifting Categories (Matching Image 2 circular category list) ─────────────
export const GIFTING_CATEGORIES: GiftingCategory[] = [
  {
    id: 'cat-dry-fruits',
    name: 'Dry Fruits & Nuts',
    slug: 'dry-fruits-nuts',
    shortDesc: 'Hand-sorted Kashmiri Mamra, California Nonpareil & W180 Cashews',
    image: '/images/gifting/cat-dry-fruits.jpg',
    count: 24,
  },
  {
    id: 'cat-gift-hampers',
    name: 'Gift Hampers',
    slug: 'gift-hampers',
    shortDesc: 'Curated celebration and luxury wooden hampers',
    image: '/images/gifting/cat-hampers.jpg',
    count: 32,
  },
  {
    id: 'cat-sweets',
    name: 'Sweets & Chocolates',
    slug: 'sweets-chocolates',
    shortDesc: 'Artisanal truffles, saffron dates & Belgian gourmet chocolates',
    image: '/images/gifting/cat-sweets.jpg',
    count: 18,
  },
  {
    id: 'cat-personalized',
    name: 'Personalized Gifts',
    slug: 'personalized-gifts',
    shortDesc: 'Custom laser-engraved memory boxes, mugs & keepsake items',
    image: '/images/gifting/cat-personalized.jpg',
    count: 15,
  },
  {
    id: 'cat-home-living',
    name: 'Home & Living',
    slug: 'home-living',
    shortDesc: 'Brass samovars, antique nut bowls & hand-painted decor',
    image: '/images/gifting/cat-home-living.jpg',
    count: 20,
  },
  {
    id: 'cat-fashion',
    name: 'Fashion & Accessories',
    slug: 'fashion-accessories',
    shortDesc: 'Authentic Kashmir Pashmina shawls, stoles & silk wraps',
    image: '/images/gifting/cat-fashion.jpg',
    count: 16,
  },
  {
    id: 'cat-handicrafts',
    name: 'Handicrafts & Artisanal',
    slug: 'handicrafts-artisanal',
    shortDesc: 'Solid walnut wood carving & royal papier-mâché keepsakes',
    image: '/images/gifting/cat-handicrafts.jpg',
    count: 19,
  },
  {
    id: 'cat-winter',
    name: 'Winter Essentials',
    slug: 'winter-essentials',
    shortDesc: 'Pure wool pherans, thermal wraps & alpine honey jars',
    image: '/images/gifting/cat-winter.jpg',
    count: 12,
  },
  {
    id: 'cat-kashmiri',
    name: 'Kashmiri Specialties',
    slug: 'kashmiri-specialties',
    shortDesc: 'Pampore Mongra GI saffron, kehwa spice blends & walnut oil',
    image: '/images/gifting/cat-kashmiri.jpg',
    count: 22,
  },
  {
    id: 'cat-baby',
    name: 'Baby & Kids Gifts',
    slug: 'baby-kids-gifts',
    shortDesc: 'Gentle welcome hampers, memory boxes & milestone gifts',
    image: '/images/gifting/occ-new-baby.jpg',
    count: 10,
  },
]

// ─── 2. Gifting Occasions (Matching Image 2 Occasions Grid + Extended) ─────────
export const GIFTING_OCCASIONS: GiftingOccasion[] = [
  {
    id: 'occ-birthday',
    name: 'Birthday Gifts',
    slug: 'birthday-gifts',
    subtitle: 'Make their day special',
    category: 'personal',
    image: '/images/gifting/occ-birthday.jpg',
    description: 'Celebrate another wonderful year with gourmet dry fruit boxes, custom engraved keepsakes, and sweet delights.',
    popularPicks: ['personalized-wooden-memory-box', 'personalized-coffee-mug', 'luxury-chocolate-gift-box'],
  },
  {
    id: 'occ-anniversary',
    name: 'Anniversary Gifts',
    slug: 'anniversary-gifts',
    subtitle: 'Celebrate your journey',
    category: 'personal',
    image: '/images/gifting/occ-anniversary.jpg',
    description: 'Express timeless love with royal wooden caskets, Pampore saffron, and personalized keepsake tokens.',
    popularPicks: ['the-royal-zabarwan-walnut-wood-casket', 'festive-mega-hamper', 'kashmiri-premium-dry-fruit-hamper'],
  },
  {
    id: 'occ-wedding',
    name: 'Wedding Gifts',
    slug: 'wedding-gifts',
    subtitle: 'Bless their new beginning',
    category: 'milestone',
    image: '/images/gifting/occ-wedding.jpg',
    description: 'Royal bridal trousseau gifts, silver-plated nut trays, and bespoke dry fruit favors for guests.',
    popularPicks: ['wedding-return-favors-box', 'the-royal-zabarwan-walnut-wood-casket', 'kashmiri-saffron-1g'],
  },
  {
    id: 'occ-festive',
    name: 'Festive Gifting',
    slug: 'festive-gifting',
    subtitle: 'Diwali, Eid, Christmas & more',
    category: 'festival',
    image: '/images/gifting/occ-festive.jpg',
    description: 'Celebrate the glow of festivals with golden caskets, vacuum-packed dry fruits, and hand-rolled dates.',
    popularPicks: ['festive-mega-hamper', 'kashmiri-premium-dry-fruit-hamper', 'the-chinar-gold-foil-rigid-gift-box'],
  },
  {
    id: 'occ-corporate',
    name: 'Corporate Gifts',
    slug: 'corporate-gifts',
    subtitle: 'Build stronger relationships',
    category: 'corporate',
    image: '/images/gifting/occ-corporate.jpg',
    description: 'Executive desk hampers with laser-etched company logos, 18% GST input credit, and multi-address air dispatch.',
    popularPicks: ['the-executive-vegan-leatherette-trunk', 'the-gulmarg-festive-celebration-casket', 'kashmiri-premium-dry-fruit-hamper'],
  },
  {
    id: 'occ-baby',
    name: 'New Baby Gifts',
    slug: 'new-baby-gifts',
    subtitle: 'Welcome little joys',
    category: 'personal',
    image: '/images/gifting/occ-new-baby.jpg',
    description: 'Gentle celebratory baskets with wholesome nutrition for the new mother and adorable keepsakes for the baby.',
    popularPicks: ['new-born-baby-welcome-keepsake', 'personalized-wooden-memory-box', 'kashmiri-saffron-1g'],
  },
  {
    id: 'occ-housewarming',
    name: 'Housewarming',
    slug: 'housewarming',
    subtitle: 'Bless a warm new home',
    category: 'milestone',
    image: '/images/crystal-gold-nut-bowls.webp',
    description: 'Traditional prosperity dry fruits, brass incense holders, and handcrafted tableware.',
    popularPicks: ['handcrafted-walnut-wood-bowl-set', 'kashmiri-premium-dry-fruit-hamper'],
  },
  {
    id: 'occ-thankyou',
    name: 'Thank You Gifts',
    slug: 'thank-you-gifts',
    subtitle: 'Express sincere gratitude',
    category: 'personal',
    image: '/images/luxury-teal-gift-box.webp',
    description: 'A gesture of appreciation featuring handcrafted tea blends, raw forest honey, and crunchy dry fruits.',
    popularPicks: ['organic-kashmir-forest-honey-tea-set', 'luxury-chocolate-gift-box'],
  },
  {
    id: 'occ-rakhi',
    name: 'Raksha Bandhan',
    slug: 'raksha-bandhan',
    subtitle: 'Honor the sibling bond',
    category: 'festival',
    image: '/images/long-festive-gift-box.webp',
    description: 'Ceremonial sweets, Mamra almonds, and custom message cards sent to brothers and sisters worldwide.',
    popularPicks: ['kashmiri-premium-dry-fruit-hamper', 'personalized-coffee-mug'],
  },
  {
    id: 'occ-justbecause',
    name: 'Just Because',
    slug: 'just-because',
    subtitle: 'Every day is worth celebrating',
    category: 'personal',
    image: '/images/corporate-diwali-gifting.jpg',
    description: 'Surprise someone special with a wholesome care package packed with love and health.',
    popularPicks: ['kashmiri-saffron-1g', 'personalized-coffee-mug', 'luxury-chocolate-gift-box'],
  },
]

// ─── 3. Gifting Recipients (Image 2 Section E) ──────────────────────────────
export const GIFTING_RECIPIENTS: GiftingRecipient[] = [
  {
    id: 'rec-her',
    name: 'Gifts for Her',
    slug: 'gifts-for-her',
    description: 'Pashmina stoles, saffron skincare, artisan treats & custom memory chests.',
    badge: 'Popular',
    image: '/images/crafts-shawls.jpg',
  },
  {
    id: 'rec-him',
    name: 'Gifts for Him',
    slug: 'gifts-for-him',
    description: 'Executive leatherette boxes, roasted savory nuts & handcrafted desk decor.',
    badge: 'Trending',
    image: '/images/dark-wood-gourmet-tray.webp',
  },
  {
    id: 'rec-parents',
    name: 'Gifts for Parents',
    slug: 'gifts-for-parents',
    description: 'Pure GI saffron, low-sodium walnuts, wild forest honey & health packs.',
    badge: 'Pure Care',
    image: '/images/kashmir-honey-jar-500g.webp',
  },
  {
    id: 'rec-children',
    name: 'Gifts for Children',
    slug: 'gifts-for-children',
    description: 'Nutritious chocolate treats, berry mixes & personalized keepsake mugs.',
    badge: 'Healthy Treats',
    image: '/images/gifting/prod-chocolate-box.webp',
  },
  {
    id: 'rec-couples',
    name: 'Gifts for Couples',
    slug: 'gifts-for-couples',
    description: 'Dual walnut chalets, celebration tea sets & matching artisanal keepsakes.',
    badge: 'Celebration',
    image: '/images/gifting/occ-anniversary.jpg',
  },
  {
    id: 'rec-friends',
    name: 'Gifts for Friends',
    slug: 'gifts-for-friends',
    description: 'Personalized mugs, peri-peri cashews, party hampers & warm greetings.',
    badge: 'Memories',
    image: '/images/gifting/prod-personalized-mug.webp',
  },
  {
    id: 'rec-colleagues',
    name: 'Gifts for Colleagues',
    slug: 'gifts-for-colleagues',
    description: 'Work desk snack assortments, wellness jars & farewell celebration packs.',
    badge: 'Desk Friendly',
    image: '/images/long-festive-gift-box.webp',
  },
  {
    id: 'rec-employees',
    name: 'Gifts for Employees',
    slug: 'gifts-for-employees',
    description: 'Festival rollouts, milestone rewards, pan-India direct doorstep delivery.',
    badge: 'Bulk Ready',
    image: '/images/gifting/prod-kashmiri-hamper.webp',
  },
  {
    id: 'rec-clients',
    name: 'Gifts for Clients',
    slug: 'gifts-for-clients',
    description: 'Luxury handcrafted boxes, gold-leaf branding & VIP executive presentations.',
    badge: 'High Impact',
    image: '/images/luxury-hamper-jars.webp',
  },
  {
    id: 'rec-families',
    name: 'Gifts for Families',
    slug: 'gifts-for-families',
    description: 'Mega celebration hampers packed with whole dry fruits and assorted sweets.',
    badge: 'All Ages',
    image: '/images/gifting/prod-festive-mega-hamper.webp',
  },
]

// ─── 4. Full Gifting Catalogue (Products matching Image 2 & More) ────────────
export const GIFTING_PRODUCTS: GiftingProduct[] = [
  // ── Product 1: Kashmiri Premium Dry Fruit Hamper (Image 2 Bestseller #1) ──
  {
    id: 'gft-001',
    slug: 'kashmiri-premium-dry-fruit-hamper',
    sku: 'NT-GFT-KASH-HAMPER',
    name: 'Kashmiri Premium Dry Fruit Hamper',
    subtitle: 'Signature 4-Compartment Wooden Chest with Royal Nuts',
    categorySlug: 'dry-fruits-nuts',
    categoryName: 'Dry Fruits & Nuts',
    price: 2499,
    mrp: 3200,
    discountPercent: 22,
    rating: 5.0,
    reviewCount: 124,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/gifting/prod-kashmiri-hamper.webp',
    images: [
      '/images/gifting/prod-kashmiri-hamper.webp',
      '/images/luxury-hamper-jars.webp',
      '/images/corporate-diwali-gifting.jpg',
      '/images/cashews-walnuts-macro.jpg',
    ],
    shortDesc: 'A majestic gift box featuring hand-graded Kashmiri Mamra Almonds, W180 Jumbo Cashews, Afghan Anjeer, and Golden Raisins.',
    longDesc: 'Crafted for discerning palates and cherished occasions, the Kashmiri Premium Dry Fruit Hamper brings the royal heritage of Kashmir right to your loved ones. Each batch is hand-sorted in Srinagar, vacuum-sealed for mountain freshness, and presented in an elegant gold-accented keepsake box with a personalized greeting card.',
    contents: [
      'Authentic Kashmiri Mamra Badam (200g)',
      'Jumbo Roasted W180 Cashews (200g)',
      'Sun-Dried Afghan Shakarpara Anjeer (200g)',
      'Golden Long Indian Kishmish (200g)',
      'Velvet-lined presentation casket with golden latch',
    ],
    specifications: {
      'Net Weight': '800 grams of pure harvest',
      'Box Dimensions': '28 cm × 22 cm × 7 cm',
      'Packaging': 'Food-grade vacuum sealed foil packets',
      'Shelf Life': '9 Months from dispatch',
      'FSSAI Certified': 'Central Lic. #22724441000048',
    },
    occasions: ['festive-gifting', 'corporate-gifts', 'anniversary-gifts', 'wedding-gifts', 'birthday-gifts'],
    recipients: ['gifts-for-parents', 'gifts-for-clients', 'gifts-for-employees', 'gifts-for-families'],
    isBestseller: true,
    isFeatured: true,
    isPersonalizable: true,
    personalizationOptions: {
      allowsName: true,
      allowsMessage: true,
      allowsDate: true,
      charLimit: 250,
    },
    variants: [
      { id: 'v1', name: 'Standard Keepsake Box (800g)', price: 2499, mrp: 3200, sku: 'NT-GFT-KASH-800' },
      { id: 'v2', name: 'Grand Luxury Wooden Casket (1.2kg)', price: 3499, mrp: 4500, sku: 'NT-GFT-KASH-1200' },
    ],
    fssaiNumber: '22724441000048',
    shelfLife: '9 Months',
    origin: 'Kashmir Valley & Bihar',
    badge: 'BESTSELLER',
  },

  // ── Product 2: Personalized Wooden Memory Box (Image 2 Bestseller #2) ─────
  {
    id: 'gft-002',
    slug: 'personalized-wooden-memory-box',
    sku: 'NT-GFT-WOOD-BOX',
    name: 'Personalized Wooden Memory Box',
    subtitle: 'Hand-Carved Kashmir Walnut Wood with Custom Laser Name',
    categorySlug: 'personalized-gifts',
    categoryName: 'Personalized Gifts',
    price: 1499,
    mrp: 1999,
    discountPercent: 25,
    rating: 5.0,
    reviewCount: 86,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/gifting/prod-wooden-memory-box.webp',
    images: [
      '/images/gifting/prod-wooden-memory-box.webp',
      '/images/crafts-gifting-box.webp',
      '/images/crafts-artisan-hands.jpg',
    ],
    shortDesc: 'A cherished keepsake chest carved from genuine seasoned walnut wood with your custom name, monogram, or anniversary date laser-etched on the lid.',
    longDesc: 'Each wooden memory box is sculpted by master walnut wood artisans in Srinagar. Seasoned for over three years to prevent warping, the wood reveals rich natural grain patterns. Personalize with your recipient’s name or heartfelt quote, transforming this into an heirloom they will treasure forever.',
    contents: [
      'Solid Seasoned Walnut Wood Keepsake Box',
      'Precision Brass Antique Hinges and Clasp',
      'Complimentary Custom Laser Engraving (Up to 30 characters)',
      'Choice of Silk or Velvet Internal Lining',
      'Certificate of Kashmir Handloom & Handicrafts Authenticity',
    ],
    specifications: {
      'Material': '100% Genuine Kashmir Walnut Wood',
      'Dimensions': '20 cm × 14 cm × 8 cm',
      'Engraving Method': 'High-precision CO2 laser etching',
      'Care': 'Wipe with soft dry cloth, nourish with walnut oil',
    },
    occasions: ['birthday-gifts', 'anniversary-gifts', 'wedding-gifts', 'corporate-gifts', 'new-baby-gifts'],
    recipients: ['gifts-for-her', 'gifts-for-him', 'gifts-for-couples', 'gifts-for-friends'],
    isBestseller: true,
    isFeatured: true,
    isPersonalizable: true,
    personalizationOptions: {
      allowsName: true,
      allowsMessage: true,
      allowsDate: true,
      charLimit: 60,
    },
    origin: 'Srinagar, Jammu & Kashmir',
    badge: 'PERSONALIZED',
  },

  // ── Product 3: Luxury Chocolate Gift Box (Image 2 Bestseller #3) ───────────
  {
    id: 'gft-003',
    slug: 'luxury-chocolate-gift-box',
    sku: 'NT-GFT-CHOC-BOX',
    name: 'Luxury Chocolate Gift Box',
    subtitle: '16 Handcrafted Belgian Truffles Infused with Saffron & Pistachio',
    categorySlug: 'sweets-chocolates',
    categoryName: 'Sweets & Chocolates',
    price: 1299,
    mrp: 1699,
    discountPercent: 23,
    rating: 5.0,
    reviewCount: 92,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/gifting/prod-chocolate-box.webp',
    images: [
      '/images/gifting/prod-chocolate-box.webp',
      '/images/luxury-teal-gift-box.webp',
      '/images/crystal-gold-nut-bowls.webp',
    ],
    shortDesc: 'A delectable curation of gourmet chocolates: dark cocoa truffles, roasted almond crunch, and Kashmiri saffron-cardamom pralines.',
    longDesc: 'Delight any sweet tooth with our artisanal luxury chocolate box. Combining imported single-origin Belgian cocoa with Himalayan natural ingredients like Mongra saffron and roasted nut slivers, this box is an exquisite sensory indulgence.',
    contents: [
      '4 × Saffron Infused Dark Chocolate Truffles',
      '4 × Salted Caramel Roasted Cashew Pralines',
      '4 × Roasted Pistachio Gianduja Cubes',
      '4 × Milk Chocolate Almond Crunch Shells',
      'Gold foil embossed luxury rigid box with satin pull',
    ],
    specifications: {
      'Piece Count': '16 Artisanal chocolates',
      'Net Weight': '320 grams',
      'Dietary': 'Vegetarian, Eggless, FSSAI Certified',
      'Storage': 'Store in cool, dry place between 15°C – 20°C',
    },
    occasions: ['birthday-gifts', 'anniversary-gifts', 'festive-gifting', 'thank-you-gifts', 'just-because'],
    recipients: ['gifts-for-her', 'gifts-for-friends', 'gifts-for-children', 'gifts-for-colleagues'],
    isBestseller: true,
    isFeatured: true,
    isPersonalizable: true,
    personalizationOptions: {
      allowsName: true,
      allowsMessage: true,
      allowsDate: true,
      charLimit: 200,
    },
    origin: 'Crafted in India with imported Belgian Cocoa',
    badge: 'GOURMET',
  },

  // ── Product 4: Festive Mega Hamper (Image 2 Bestseller #4) ─────────────────
  {
    id: 'gft-004',
    slug: 'festive-mega-hamper',
    sku: 'NT-GFT-MEGA-HAMPER',
    name: 'Festive Mega Hamper',
    subtitle: 'The Grand Celebration Ensemble for Families & Teams',
    categorySlug: 'gift-hampers',
    categoryName: 'Gift Hampers',
    price: 3999,
    mrp: 5200,
    discountPercent: 23,
    rating: 5.0,
    reviewCount: 156,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/gifting/prod-festive-mega-hamper.webp',
    images: [
      '/images/gifting/prod-festive-mega-hamper.webp',
      '/images/luxury-hamper-jars.webp',
      '/images/corporate-diwali-gifting.jpg',
      '/images/royal-tradition-box.webp',
    ],
    shortDesc: 'Our flagship grand celebration basket featuring 6 premium glass jars of dry fruits, wild honey, Kashmiri saffron, and celebratory brass diyas.',
    longDesc: 'When only the best will do, the Festive Mega Hamper delivers unmistakable grandeur. Featuring six gold-capped airtight glass jars filled with our highest-grade harvest nuts, a sealed 1g jar of GI Mongra saffron, natural honey, and ceremonial diyas, this is the ultimate gift for family and valued partners.',
    contents: [
      'Pampore Mongra GI Saffron (1g)',
      'Kashmiri Mamra Almonds (150g)',
      'Jumbo Roasted Pepper Cashews (150g)',
      'Roasted In-Shell Pistachios (150g)',
      'Afghan Green Raisins (150g)',
      'Raw High-Altitude Forest Honey (150g)',
      'Handcrafted Brass Diya Duo with Wax Lights',
      'Rigid luxury trunk with gold foil seal',
    ],
    specifications: {
      'Total Net Weight': '1,400 grams',
      'Box Dimensions': '35 cm × 26 cm × 11 cm',
      'Packaging': 'Reusable glass jars & gold tin covers',
      'Shelf Life': '12 Months',
    },
    occasions: ['festive-gifting', 'wedding-gifts', 'corporate-gifts', 'housewarming', 'anniversary-gifts'],
    recipients: ['gifts-for-families', 'gifts-for-clients', 'gifts-for-parents', 'gifts-for-employees'],
    isBestseller: true,
    isFeatured: true,
    isPersonalizable: true,
    personalizationOptions: {
      allowsName: true,
      allowsMessage: true,
      allowsDate: true,
      charLimit: 300,
    },
    origin: 'Pampore, Srinagar, Mithila',
    badge: 'GRAND LUXURY',
  },

  // ── Product 5: Kashmiri Saffron 1g (Image 2 Bestseller #5) ─────────────────
  {
    id: 'gft-005',
    slug: 'kashmiri-saffron-1g',
    sku: 'NT-GFT-SAFFRON-1G',
    name: 'Kashmiri Saffron (1g)',
    subtitle: 'GI-Tagged Pure Pampore Grade-A Mongra Stigmas',
    categorySlug: 'kashmiri-specialties',
    categoryName: 'Kashmiri Specialties',
    price: 699,
    mrp: 899,
    discountPercent: 22,
    rating: 5.0,
    reviewCount: 74,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/gifting/prod-saffron-1g.webp',
    images: [
      '/images/gifting/prod-saffron-1g.webp',
      '/images/saffron-jar-5g.webp',
      '/images/saffron-threads-macro.jpg',
      '/images/iran-saffron-jar-5g.webp',
    ],
    shortDesc: 'Certified 100% pure Kashmiri Mongra saffron from the purple saffron fields of Pampore. Highest crocin and safranal content for culinary and wellness gifting.',
    longDesc: 'Gift the golden spice of Kashmir. Hand-harvested during autumn dawn in Pampore, this Grade A Mongra saffron carries the official Geographical Indication (GI) seal. Packaged in an airtight acrylic jar with a golden metal lid and a royal presentation envelope.',
    contents: [
      '1 Gram Pure Kashmiri Mongra Saffron (GI Tagged)',
      'Airtight UV-protected glass jar with gold seal',
      'Certificate of purity with laboratory batch test QR',
      'Artisan saffron recipe booklet',
    ],
    specifications: {
      'Grade': 'Grade 1 Mongra (Stigmas Only)',
      'Crocin Reading': '> 240 (Grade A Certified)',
      'Harvest': 'New Season Fresh Crop',
      'Usage': 'Kheer, Biryani, Kehwa, Ayurvedic Milk, Puja',
    },
    occasions: ['wedding-gifts', 'festive-gifting', 'new-baby-gifts', 'housewarming', 'thank-you-gifts'],
    recipients: ['gifts-for-parents', 'gifts-for-her', 'gifts-for-couples', 'gifts-for-friends'],
    isBestseller: true,
    isFeatured: true,
    isPersonalizable: true,
    personalizationOptions: {
      allowsName: true,
      allowsMessage: true,
      allowsDate: true,
      charLimit: 150,
    },
    variants: [
      { id: 'saf-1g', name: '1 Gram Pure Mongra', price: 699, mrp: 899, sku: 'NT-SAF-1G' },
      { id: 'saf-2g', name: '2 Grams Value Pack', price: 1349, mrp: 1798, sku: 'NT-SAF-2G' },
      { id: 'saf-5g', name: '5 Grams Royal Crystal Tin', price: 3199, mrp: 4495, sku: 'NT-SAF-5G' },
    ],
    origin: 'Pampore, Kashmir, India',
    badge: 'GI TAGGED',
  },

  // ── Product 6: Personalized Coffee Mug (Image 2 Bestseller #6) ────────────
  {
    id: 'gft-006',
    slug: 'personalized-coffee-mug',
    sku: 'NT-GFT-CERAMIC-MUG',
    name: 'Personalized Coffee Mug',
    subtitle: 'Ceramic Mug with Custom Calligraphy & Name Print',
    categorySlug: 'personalized-gifts',
    categoryName: 'Personalized Gifts',
    price: 599,
    mrp: 799,
    discountPercent: 25,
    rating: 5.0,
    reviewCount: 63,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/gifting/prod-personalized-mug.webp',
    images: [
      '/images/gifting/prod-personalized-mug.webp',
      '/images/gifting/cat-personalized.jpg',
    ],
    shortDesc: 'A glossy ceramic mug customized with recipient name, custom message ("Best Wishes", "Happy Birthday"), or photo in crisp vibrant color.',
    longDesc: 'Warm their mornings with a gift made just for them. Crafted from premium microwave-safe ceramic with an ergonomic handle, this mug can be customized with your choice of elegant typography, name, and special greeting.',
    contents: [
      '1 × 350ml Gloss White Ceramic Mug',
      'Customized Fade-Proof High Gloss Print',
      'Corrugated Foam-Padded Gift Box for Zero Breakage',
      'Greeting Card with Custom Hand-Written Note',
    ],
    specifications: {
      'Capacity': '350 ml (11.8 oz)',
      'Material': 'High-fired bone-china grade ceramic',
      'Safety': '100% Dishwasher & Microwave Safe',
      'Dispatch SLA': 'Custom printed & shipped in 24 hours',
    },
    occasions: ['birthday-gifts', 'anniversary-gifts', 'thank-you-gifts', 'corporate-gifts', 'just-because'],
    recipients: ['gifts-for-friends', 'gifts-for-colleagues', 'gifts-for-him', 'gifts-for-her'],
    isBestseller: true,
    isFeatured: true,
    isPersonalizable: true,
    personalizationOptions: {
      allowsName: true,
      allowsMessage: true,
      allowsDate: false,
      charLimit: 40,
    },
    origin: 'Crafted in India',
    badge: 'CUSTOM PRINT',
  },

  // ── Product 7: The Royal Zabarwan Walnut Wood Casket ─────────────────────────
  {
    id: 'gft-007',
    slug: 'the-royal-zabarwan-walnut-wood-casket',
    sku: 'NT-GFT-ZABARWAN',
    name: 'The Royal Zabarwan Walnut Wood Casket',
    subtitle: 'Executive Luxury Hand-Carved Casket with GI Saffron & Mamra',
    categorySlug: 'gift-hampers',
    categoryName: 'Gift Hampers',
    price: 4950,
    mrp: 6500,
    discountPercent: 24,
    rating: 5.0,
    reviewCount: 48,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/luxury-hamper-jars.webp',
    images: [
      '/images/luxury-hamper-jars.webp',
      '/images/crafts-artisan-hands.jpg',
      '/images/crafts-gifting-box.webp',
    ],
    shortDesc: 'The apex of executive gifting. Hand-carved Kashmir walnut wood casket, GI Pampore Mongra saffron, Mamra almonds, and wild forest honey.',
    longDesc: 'Designed for VIP clients, CXOs, and heirloom family gifts. The Royal Zabarwan is created by third-generation walnut wood carvers in Srinagar. Inside lies a curated selection of Kashmir’s most prized harvests.',
    contents: [
      'Hand-Carved Walnut Wood Chest with Brass Lock',
      'Pure Pampore Mongra Saffron (1g GI)',
      'Hand-Graded Kashmiri Mamra Badam (250g)',
      'Jumbo W180 Roasted Cashews (250g)',
      'Raw Wild High-Altitude Forest Honey (200g)',
      'Custom Wax Seal Letter & Certificate of Origin',
    ],
    specifications: {
      'Casket Material': 'Seasoned Kashmiri Walnut Wood',
      'Dimensions': '32 cm × 24 cm × 12 cm',
      'Net Harvest Weight': '850 grams',
    },
    occasions: ['corporate-gifts', 'wedding-gifts', 'anniversary-gifts', 'festive-gifting'],
    recipients: ['gifts-for-clients', 'gifts-for-parents', 'gifts-for-couples'],
    isBestseller: false,
    isFeatured: true,
    isPersonalizable: true,
    personalizationOptions: {
      allowsName: true,
      allowsMessage: true,
      allowsDate: true,
      charLimit: 300,
    },
    origin: 'Srinagar & Pampore, Kashmir',
    badge: 'EXECUTIVE LUXURY',
  },

  // ── Product 8: The Executive Vegan Leatherette Trunk ────────────────────────
  {
    id: 'gft-008',
    slug: 'the-executive-vegan-leatherette-trunk',
    sku: 'NT-GFT-EXEC-TRUNK',
    name: 'The Executive Vegan Leatherette Trunk',
    subtitle: 'Contemporary Luxury Gift Trunk with Gold Latches',
    categorySlug: 'gift-hampers',
    categoryName: 'Gift Hampers',
    price: 2450,
    mrp: 3200,
    discountPercent: 23,
    rating: 4.9,
    reviewCount: 110,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/corporate-diwali-gifting.jpg',
    images: [
      '/images/corporate-diwali-gifting.jpg',
      '/images/luxury-teal-gift-box.webp',
    ],
    shortDesc: 'Sophisticated handcrafted faux-leather trunk containing 4 premium dry fruit jars. Designed for corporate clients and festive greetings.',
    longDesc: 'Modern elegance meets wholesome harvest. The vegan leatherette trunk features rich stitching, gold hardware, and four vacuum-sealed dry fruit canisters.',
    contents: [
      'California Nonpareil Roasted Salted Almonds (200g)',
      'Premium W240 Whole Cashews (200g)',
      'Green Long Indian Kishmish (200g)',
      'Afghan Shakarpara Dried Figs (200g)',
      'Vegan Leather Trunk with Suede Lining',
    ],
    specifications: {
      'Dimensions': '26 cm × 20 cm × 9 cm',
      'Net Weight': '800 grams',
    },
    occasions: ['corporate-gifts', 'festive-gifting', 'birthday-gifts'],
    recipients: ['gifts-for-employees', 'gifts-for-clients', 'gifts-for-him'],
    isBestseller: false,
    isFeatured: true,
    isPersonalizable: true,
    personalizationOptions: {
      allowsName: true,
      allowsMessage: true,
      allowsDate: true,
      charLimit: 200,
    },
    origin: 'Crafted in India',
    badge: 'FESTIVE FAVORITE',
  },

  // ── Product 9: The Chinar Gold Foil Rigid Gift Box ────────────────────────
  {
    id: 'gft-009',
    slug: 'the-chinar-gold-foil-rigid-gift-box',
    sku: 'NT-GFT-CHINAR-BOX',
    name: 'The Chinar Gold Foil Rigid Gift Box',
    subtitle: 'Artisanal 4-Jar Presentation in Deep Teal & Gold',
    categorySlug: 'gift-hampers',
    categoryName: 'Gift Hampers',
    price: 1350,
    mrp: 1800,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 95,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/luxury-teal-gift-box.webp',
    images: [
      '/images/luxury-teal-gift-box.webp',
      '/images/crystal-gold-nut-bowls.webp',
    ],
    shortDesc: 'A rich teal rigid box embossed with Kashmiri Chinar leaf motifs in hot-stamped gold foil. Holds four gourmet treats.',
    longDesc: 'Ideal for large team distributions, festive gifts, and thoughtful personal gestures. Packaged in eco-friendly FSC certified paperboard with satin ribbon closure.',
    contents: [
      'Kashmiri Kagzi Walnuts Halves (150g)',
      'Roasted Pistachios in Shell (150g)',
      'Flavored Roasted Makhana Herb Mix (80g)',
      'Arabian Royal Medjool Dates (150g)',
    ],
    specifications: {
      'Net Weight': '530 grams',
      'Box Style': 'Magnetic flap rigid box',
    },
    occasions: ['festive-gifting', 'corporate-gifts', 'thank-you-gifts'],
    recipients: ['gifts-for-employees', 'gifts-for-friends', 'gifts-for-colleagues'],
    isBestseller: false,
    isFeatured: true,
    isPersonalizable: true,
    personalizationOptions: {
      allowsName: true,
      allowsMessage: true,
      allowsDate: true,
      charLimit: 150,
    },
    origin: 'Kashmir & Mithila',
    badge: 'BEST VALUE',
  },

  // ── Product 10: Pure Handloom Pashmina Stole Hamper ────────────────────────
  {
    id: 'gft-010',
    slug: 'pure-handloom-pashmina-stole-hamper',
    sku: 'NT-GFT-PASH-STOLE',
    name: 'Pure Handloom Pashmina Stole Hamper',
    subtitle: 'GI-Certified Changthangi Cashmere with Saffron & Kehwa',
    categorySlug: 'fashion-accessories',
    categoryName: 'Fashion & Accessories',
    price: 3499,
    mrp: 4800,
    discountPercent: 27,
    rating: 5.0,
    reviewCount: 52,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/crafts-shawls.jpg',
    images: [
      '/images/crafts-shawls.jpg',
      '/images/crafts-stoles.jpg',
      '/images/crafts-artisan-hands.jpg',
    ],
    shortDesc: 'A soft, featherlight handloom Pashmina stole paired with a vial of GI saffron and authentic green tea kehwa blend.',
    longDesc: 'Spun from high-altitude Ladakhi cashmere and woven on wooden looms in Srinagar Old City. Accompanied by fragrant Kashmiri kehwa tea in a silver tin.',
    contents: [
      'Pure Handwoven Pashmina Stole (70 cm × 200 cm)',
      'Pampore Mongra Saffron Vial (0.5g)',
      'Royal Kashmiri Shahi Kehwa Green Tea (100g)',
      'Handcrafted Papier-Mâché Keepsake Box',
    ],
    specifications: {
      'Weave': 'Traditional Diamond Weave (Chashm-e-Bulbul)',
      'Fibre': '100% Raw Pashmina (Changthangi Goat)',
    },
    occasions: ['anniversary-gifts', 'birthday-gifts', 'wedding-gifts'],
    recipients: ['gifts-for-her', 'gifts-for-parents'],
    isBestseller: false,
    isFeatured: true,
    isPersonalizable: true,
    personalizationOptions: {
      allowsName: true,
      allowsMessage: true,
      allowsDate: true,
      charLimit: 200,
    },
    origin: 'Kashmir',
    badge: 'HEIRLOOM CRAFT',
  },

  // ── Product 11: Handcrafted Walnut Wood Bowl Set ───────────────────────────
  {
    id: 'gft-011',
    slug: 'handcrafted-walnut-wood-bowl-set',
    sku: 'NT-GFT-WALNUT-BOWLS',
    name: 'Handcrafted Walnut Wood Bowl Set',
    subtitle: 'Twin Carved Chinar Leaf Bowls with Serving Spoon',
    categorySlug: 'home-living',
    categoryName: 'Home & Living',
    price: 2199,
    mrp: 2899,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 41,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/dark-wood-gourmet-tray.webp',
    images: [
      '/images/dark-wood-gourmet-tray.webp',
      '/images/crystal-gold-nut-bowls.webp',
    ],
    shortDesc: 'Sculpted from dark Himalayan walnut wood, these twin serving bowls feature hand-carved floral leaves and a smooth beeswax food-safe finish.',
    longDesc: 'A functional work of art for any dining table. Serve dry fruits, appetizers, or display as a centerpiece. Carved from a single piece of walnut wood.',
    contents: [
      '2 × Hand-Carved Walnut Wood Bowls (6-inch diameter)',
      '1 × Carved Walnut Wood Serving Spoon',
      'Sample Pouch of Roasted Kashmiri Almonds (100g)',
    ],
    specifications: {
      'Finish': 'Natural Organic Beeswax (Food Contact Safe)',
      'Diameter': '15 cm each',
    },
    occasions: ['housewarming', 'anniversary-gifts', 'wedding-gifts'],
    recipients: ['gifts-for-parents', 'gifts-for-couples', 'gifts-for-families'],
    isBestseller: false,
    isFeatured: false,
    isPersonalizable: false,
    origin: 'Srinagar, Kashmir',
  },

  // ── Product 12: Wedding Return Favors Velvet Pouch Box (Pack of 5) ────────
  {
    id: 'gft-012',
    slug: 'wedding-return-favors-box',
    sku: 'NT-GFT-WEDD-FAVORS',
    name: 'Wedding Return Favors Velvet Box (Pack of 5)',
    subtitle: 'Bespoke Luxury Return Favors with Couple Monogram',
    categorySlug: 'gift-hampers',
    categoryName: 'Gift Hampers',
    price: 2250,
    mrp: 3000,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 38,
    stockStatus: 'IN_STOCK',
    primaryImage: '/images/royal-tradition-box.webp',
    images: [
      '/images/royal-tradition-box.webp',
      '/images/long-festive-gift-box.webp',
    ],
    shortDesc: 'A pack of 5 luxurious velvet-padded favor boxes filled with Mamra almonds and silver-dusted cardamom pods for wedding guests.',
    longDesc: 'Make your wedding memorable for every guest. Each box is wrapped in rich emerald or maroon velvet, customized with couple initials and wedding date.',
    contents: [
      '5 × Velvet Embroidered Gift Boxes',
      'Each box contains 150g Premium Roasted Almonds & Cashews',
      'Custom gold-foil crest card with couple names',
    ],
    specifications: {
      'Units': 'Pack of 5 individual gift boxes',
      'Dimensions': '14 cm × 14 cm × 5 cm per box',
    },
    occasions: ['wedding-gifts', 'anniversary-gifts'],
    recipients: ['gifts-for-families', 'gifts-for-friends'],
    isBestseller: false,
    isFeatured: true,
    isPersonalizable: true,
    personalizationOptions: {
      allowsName: true,
      allowsMessage: true,
      allowsDate: true,
      charLimit: 80,
    },
    origin: 'Crafted in India',
    badge: 'WEDDING FAVORS',
  },
]

// ─── Filter & Search Helpers ────────────────────────────────────────────────
export function getAllGifts(): GiftingProduct[] {
  return GIFTING_PRODUCTS
}

export function getGiftBySlug(slug: string): GiftingProduct | undefined {
  return GIFTING_PRODUCTS.find((p) => p.slug === slug)
}

export function getGiftsByCategory(categorySlug: string): GiftingProduct[] {
  return GIFTING_PRODUCTS.filter((p) => p.categorySlug === categorySlug)
}

export function getGiftsByOccasion(occasionSlug: string): GiftingProduct[] {
  return GIFTING_PRODUCTS.filter((p) => p.occasions.includes(occasionSlug))
}

export function getGiftsByRecipient(recipientSlug: string): GiftingProduct[] {
  return GIFTING_PRODUCTS.filter((p) => p.recipients.includes(recipientSlug))
}

export function getBestsellingGifts(tab: string = 'All'): GiftingProduct[] {
  if (tab === 'All' || !tab) {
    return GIFTING_PRODUCTS.filter((p) => p.isBestseller)
  }
  if (tab === 'Gift Hampers') {
    return GIFTING_PRODUCTS.filter((p) => p.categorySlug === 'gift-hampers')
  }
  if (tab === 'Dry Fruits') {
    return GIFTING_PRODUCTS.filter((p) => p.categorySlug === 'dry-fruits-nuts')
  }
  if (tab === 'Personalized') {
    return GIFTING_PRODUCTS.filter((p) => p.isPersonalizable)
  }
  if (tab === 'Kashmiri Special') {
    return GIFTING_PRODUCTS.filter((p) => p.categorySlug === 'kashmiri-specialties' || p.origin?.includes('Kashmir'))
  }
  if (tab === 'Corporate') {
    return GIFTING_PRODUCTS.filter((p) => p.occasions.includes('corporate-gifts'))
  }
  return GIFTING_PRODUCTS.filter((p) => p.isBestseller)
}

export interface GiftFilterParams {
  query?: string
  category?: string
  occasion?: string
  recipient?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'bestselling'
}

export function searchGifts(filters: GiftFilterParams): GiftingProduct[] {
  let results = [...GIFTING_PRODUCTS]

  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim()
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.contents.some((c) => c.toLowerCase().includes(q)) ||
        p.occasions.some((o) => o.includes(q))
    )
  }

  if (filters.category && filters.category !== 'all') {
    results = results.filter((p) => p.categorySlug === filters.category)
  }

  if (filters.occasion && filters.occasion !== 'all') {
    results = results.filter((p) => p.occasions.includes(filters.occasion!))
  }

  if (filters.recipient && filters.recipient !== 'all') {
    results = results.filter((p) => p.recipients.includes(filters.recipient!))
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!)
  }

  switch (filters.sortBy) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      results.sort((a, b) => b.rating - a.rating)
      break
    case 'bestselling':
      results.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
      break
    default:
      results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
  }

  return results
}
