// ─── Nuty Tales Crafts & Heritage — Product & Provenance Catalog ───────────────
// Fall / Winter 2026: Kashmir to the World
// Authenticity, Provenance, GI Certification & Try with SI

export type CraftCategory =
  | 'shawls'
  | 'stoles'
  | 'pherans'
  | 'jackets-coats'
  | 'winter-wear'
  | 'accessories'
  | 'home-heritage'
  | 'heritage-gifting'

export interface ProvenanceInfo {
  origin: string             // e.g. 'Kanihama, Kashmir' or 'Downtown Srinagar'
  artisanGroup: string       // e.g. 'Master Weaver Ghulam Hassan & Family'
  craftTradition: string     // e.g. 'Hand-Jacquard Kani Loom Weave'
  material: string           // e.g. '100% Changthangi Mountain Pashmina (14.5 microns)'
  technique: string          // e.g. 'Wooden Tujis needle interlock'
  artisanHours: number       // e.g. 240 hours
  giTagCertified: boolean    // Geographical Indication certified
  giCertificateNo?: string   // Official J&K Handicrafts GI code
  care: string               // Maintenance & storage
}

export interface CraftProduct {
  id: string
  name: string
  slug: string
  category: CraftCategory
  categoryLabel: string
  subCategory?: string
  gender: 'women' | 'men' | 'unisex'
  shortDesc: string
  longDesc: string
  editorialStory: string
  price: number              // Retail in INR
  mrp: number                // Comparative luxury showroom MRP
  image: string
  additionalImages?: string[]
  sizes: string[]            // ['Free Size (2m x 1m)'] or ['S', 'M', 'L', 'XL']
  colorOptions: { name: string; hex: string; image?: string }[]
  provenance: ProvenanceInfo
  tryWithSiSupported: boolean
  isFeatured: boolean
  warmthRating: 'Mild (10°C - 18°C)' | 'Warm (0°C - 10°C)' | 'Sub-Zero Heavy (-10°C - 0°C)'
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'MADE_TO_ORDER'
  tags: string[]
  pairWithSlug?: string      // Complete the Look pairing
}

// ─── CRAFT PRODUCTS COLLECTION ──────────────────────────────────────────────────
export const CRAFT_PRODUCTS: CraftProduct[] = [
  // ── 1. SHAWLS ────────────────────────────────────────────────────────────────
  {
    id: 'crf-shw-001',
    name: 'Royal Kani Pashmina Shawl (Floral Jamawar)',
    slug: 'royal-kani-pashmina-shawl-floral-jamawar',
    category: 'shawls',
    categoryLabel: 'Shawls',
    subCategory: 'Kani Weave',
    gender: 'women',
    shortDesc: 'Centuries-old Kani loom masterpiece woven with wooden spools (tujis). Pure Changthangi Pashmina with rich Persian floral trellis.',
    longDesc: `The pinnacle of Kashmiri textile heritage. The Kani shawl is woven on traditional handlooms using tiny wooden eyeless bobbins called 'tujis', guided by coded poetic script known as 'Talim'. Every centimeter requires immense patience, taking two master artisans over 4 months to weave.\n\nCrafted from the gossamer underfleece of Himalayan Changthangi goats living at 14,000 feet, this shawl offers featherlight weight with incomparable warmth. An heirloom investment destined to be treasured across generations.`,
    editorialStory: 'Woven in the misty village of Kanihama, where looms have hummed rhythmically since the 15th-century Mughal court of Zain-ul-Abidin.',
    price: 38500,
    mrp: 49000,
    image: '/images/crafts-shawls.jpg',
    additionalImages: [
      '/images/crafts-shawls.jpg',
      '/images/crafts-artisan-hands.jpg',
      '/images/crafts-winter-hero.jpg',
    ],
    sizes: ['Free Size (200 cm × 100 cm)'],
    colorOptions: [
      { name: 'Crimson Jamawar', hex: '#631B26' },
      { name: 'Royal Ivory Gold', hex: '#EAE1CE' },
      { name: 'Midnight Navy', hex: '#16223B' },
    ],
    provenance: {
      origin: 'Kanihama Weavers Colony, Kashmir',
      artisanGroup: 'Kanihama Artisans Cooperative #14',
      craftTradition: 'Traditional Kani Weave (Talim System)',
      material: '100% Pure Changthangi Cashmere / Pashmina (14.5 Microns)',
      technique: 'Handloom with carved walnut tujis (wooden spools)',
      artisanHours: 320,
      giTagCertified: true,
      giCertificateNo: 'JK-GI-KANI-2026-0891',
      care: 'Strictly professional dry clean. Store wrapped in pure unbleached muslin with natural cedar balls.',
    },
    tryWithSiSupported: true,
    isFeatured: true,
    warmthRating: 'Sub-Zero Heavy (-10°C - 0°C)',
    stockStatus: 'IN_STOCK',
    tags: ['pashmina', 'kani', 'shawl', 'jamawar', 'gi-certified', 'heirloom', 'winter'],
    pairWithSlug: 'royal-silk-velvet-tilla-pheran',
  },
  {
    id: 'crf-shw-002',
    name: 'Pure Pashmina Sozni Hand-Embroidered Shawl',
    slug: 'pure-pashmina-sozni-hand-embroidered-shawl',
    category: 'shawls',
    categoryLabel: 'Shawls',
    subCategory: 'Sozni Needlework',
    gender: 'unisex',
    shortDesc: 'Fine needle Sozni embroidery cascading across feather-soft pure Pashmina. Intricate Paisley and Chinar leaf motifs in vintage saffron hues.',
    longDesc: `Sozni is one of the most sophisticated needlework traditions on earth. Using microscopic needles and silk threads, the artisan creates identical needlework on both sides (Dorukha) or detailed floral paisleys along the margins (Hashidar).\n\nThe base fabric is hand-spun from Ladakh cashmere, known for its buttery drape, temperature-regulating breathability, and lifelong softness.`,
    editorialStory: 'Crafted in the quiet historic courtyards of Shehr-e-Khaas (Downtown Srinagar), where families have practiced the fine art of the needle for six generations.',
    price: 24500,
    mrp: 32000,
    image: '/images/crafts-winter-hero.jpg',
    additionalImages: [
      '/images/crafts-artisan-hands.jpg',
      '/images/crafts-shawls.jpg',
    ],
    sizes: ['Free Size (200 cm × 100 cm)'],
    colorOptions: [
      { name: 'Warm Charcoal & Saffron', hex: '#2A292E' },
      { name: 'Vintage Camel', hex: '#B89B72' },
      { name: 'Pampore Maroon', hex: '#581C25' },
    ],
    provenance: {
      origin: 'Downtown Srinagar (Shehr-e-Khaas), Kashmir',
      artisanGroup: 'Bashir Ahmad Dar & Master Guild Artisans',
      craftTradition: 'Sozni Needlework (Kashmiri Suzani)',
      material: '100% Pure Ladakhi Pashmina with Mulberry Silk Embroidery',
      technique: 'Single-strand needlepoint micro-stitching',
      artisanHours: 190,
      giTagCertified: true,
      giCertificateNo: 'JK-GI-SOZNI-2026-1142',
      care: 'Dry clean only. Air out in indirect morning sun twice a year. Keep away from perfumes.',
    },
    tryWithSiSupported: true,
    isFeatured: true,
    warmthRating: 'Sub-Zero Heavy (-10°C - 0°C)',
    stockStatus: 'IN_STOCK',
    tags: ['sozni', 'pashmina', 'shawl', 'needlework', 'kashmir', 'luxury'],
    pairWithSlug: 'classic-kashmiri-wool-tweed-pheran-men',
  },

  // ── 2. STOLES ────────────────────────────────────────────────────────────────
  {
    id: 'crf-stl-001',
    name: 'Kashmiri Hand-Embroidered Cashmere Stole (Floral Ivory)',
    slug: 'kashmiri-hand-embroidered-cashmere-stole-floral-ivory',
    category: 'stoles',
    categoryLabel: 'Stoles',
    subCategory: 'Sozni Stoles',
    gender: 'women',
    shortDesc: 'Lightweight, versatile cashmere stole adorned with vibrant multi-hued Kashmiri botanical embroidery. Perfect for travel and evening soirees.',
    longDesc: `Designed for the modern cosmopolitan traveler who cherishes heritage craftsmanship. This stole combines the heavenly softness of combed Himalayan cashmere with an all-over (Jaal) or border embroidery of wild iris, saffron crocus, and almond blossoms.\n\nCompact enough to roll into a travel tote yet insulative enough to ward off winter mountain chills. Drapes effortlessly over tailored coats, evening gowns, or traditional pherans.`,
    editorialStory: 'Inspired by the springtime blooming of Badamwari (the historic almond orchard of Srinagar) beneath the foothills of Hari Parbat.',
    price: 12800,
    mrp: 16500,
    image: '/images/crafts-stoles.jpg',
    additionalImages: [
      '/images/crafts-stoles.jpg',
      '/images/crafts-winterwear.jpg',
    ],
    sizes: ['Stole Size (200 cm × 70 cm)'],
    colorOptions: [
      { name: 'Floral Ivory', hex: '#FAF6EE' },
      { name: 'Blush Powder Pink', hex: '#E2C2C6' },
      { name: 'Pistachio Sage', hex: '#B2BCA2' },
    ],
    provenance: {
      origin: 'Budgam Valley, Kashmir',
      artisanGroup: 'Chadoora Women Craft Cooperative',
      craftTradition: 'Micro-Sozni Border Work',
      material: '100% Fine Combed Cashmere',
      technique: 'Handwoven diamond weave (Chashm-e-Bulbul) with fine needlework',
      artisanHours: 95,
      giTagCertified: true,
      giCertificateNo: 'JK-GI-STOLE-2026-0348',
      care: 'Dry clean recommended. Cool iron over a cotton cloth press.',
    },
    tryWithSiSupported: true,
    isFeatured: true,
    warmthRating: 'Warm (0°C - 10°C)',
    stockStatus: 'IN_STOCK',
    tags: ['stole', 'cashmere', 'ivory', 'floral', 'travel', 'versatile'],
    pairWithSlug: 'contemporary-aari-velvet-long-coat',
  },
  {
    id: 'crf-stl-002',
    name: 'Lightweight Ombre Merino & Cashmere Wrap',
    slug: 'lightweight-ombre-merino-cashmere-wrap',
    category: 'stoles',
    categoryLabel: 'Stoles',
    subCategory: 'Lightweight Wraps',
    gender: 'unisex',
    shortDesc: 'Featherweight ombre gradient stole blending ultra-fine merino with soft cashmere. Effortless day-to-evening drape.',
    longDesc: `A contemporary take on mountain warmth. Woven with an ultra-fine 70/30 blend of Australian Merino wool and Ladakhi cashmere, this scarf transitions smoothly from deep slate to soft cream.\n\nFinished with natural eyelash fringes. Ideal for autumn layering, air-conditioned executive suites, and brisk winter walks.`,
    editorialStory: 'Reflecting the changing colors of Dal Lake from dawn mist to twilight reflection.',
    price: 6400,
    mrp: 8500,
    image: '/images/crafts-accessories.jpg',
    additionalImages: [
      '/images/crafts-accessories.jpg',
      '/images/crafts-stoles.jpg',
    ],
    sizes: ['Stole Size (200 cm × 70 cm)'],
    colorOptions: [
      { name: 'Slate to Cream Ombre', hex: '#53565A' },
      { name: 'Burgundy to Rose', hex: '#632535' },
      { name: 'Forest to Olive', hex: '#264332' },
    ],
    provenance: {
      origin: 'Srinagar Craft Hub, Kashmir',
      artisanGroup: 'Valley Artisan Weavers Alliance',
      craftTradition: 'Dip-dyed Ombre Handloom',
      material: '70% Fine Merino Wool / 30% Ladakhi Cashmere',
      technique: 'Handloom plain weave with natural botanical dye gradations',
      artisanHours: 42,
      giTagCertified: false,
      care: 'Gentle hand wash in cold water with wool detergent or dry clean.',
    },
    tryWithSiSupported: true,
    isFeatured: false,
    warmthRating: 'Mild (10°C - 18°C)',
    stockStatus: 'IN_STOCK',
    tags: ['stole', 'merino', 'ombre', 'unisex', 'modern', 'lightweight'],
  },

  // ── 3. PHERANS ───────────────────────────────────────────────────────────────
  {
    id: 'crf-phr-001',
    name: 'Classic Kashmiri Pure Wool Tweed Pheran (Men)',
    slug: 'classic-kashmiri-wool-tweed-pheran-men',
    category: 'pherans',
    categoryLabel: 'Pherans',
    subCategory: 'Men’s Traditional Pherans',
    gender: 'men',
    shortDesc: 'Authentic Kashmiri winter silhouette hand-tailored in heavy local tweed with subtle Sozni neck and pocket embroidery. Deep pockets for Kangri warmth.',
    longDesc: `The legendary traditional garment of the Kashmir Valley. Cut in a generous, flowing silhouette to allow natural airflow and thermal insulation during severe sub-zero winters.\n\nTailored from dense mountain tweed woven in Kashmir, lined with soft thermal cotton flannel, and framed with tasteful Sozni needlework around the high Mandarin collar and side pockets. Designed to be worn over layers or directly with thermal innerwear.`,
    editorialStory: 'Worn with pride by valley residents for over five centuries across the snowy streets of Srinagar, Pahalgam, and Gulmarg.',
    price: 9800,
    mrp: 13500,
    image: '/images/crafts-pherans.jpg',
    additionalImages: [
      '/images/crafts-pherans.jpg',
      '/images/crafts-winterwear.jpg',
    ],
    sizes: ['M (Chest 42")', 'L (Chest 46")', 'XL (Chest 50")', 'Free Silhouette (Chest 48")'],
    colorOptions: [
      { name: 'Earthy Charcoal Tweed', hex: '#3B3835' },
      { name: 'Himalayan Walnut Brown', hex: '#523A28' },
      { name: 'Oatmeal Tweed', hex: '#C2B69D' },
    ],
    provenance: {
      origin: 'Baramulla & Downtown Srinagar, Kashmir',
      artisanGroup: 'Guild of Valley Master Dyers & Tailors',
      craftTradition: 'Traditional Tweed Hand-tailoring & Sozni Accents',
      material: '100% Pure Virgin Himalayan Sheep Wool with Cotton Flannel Lining',
      technique: 'Heavy tweed handloom weaving with needlework collar border',
      artisanHours: 65,
      giTagCertified: false,
      care: 'Dry clean only. Steam press on wool setting.',
    },
    tryWithSiSupported: true,
    isFeatured: true,
    warmthRating: 'Sub-Zero Heavy (-10°C - 0°C)',
    stockStatus: 'IN_STOCK',
    tags: ['pheran', 'men', 'kashmiri-pheran', 'wool-tweed', 'winter-wear', 'traditional'],
    pairWithSlug: 'pure-pashmina-sozni-hand-embroidered-shawl',
  },
  {
    id: 'crf-phr-002',
    name: 'Royal Silk-Velvet Tilla Zari Pheran (Women)',
    slug: 'royal-silk-velvet-tilla-pheran',
    category: 'pherans',
    categoryLabel: 'Pherans',
    subCategory: 'Women’s Luxury Pherans',
    gender: 'women',
    shortDesc: 'Regal micro-velvet pheran highlighted with genuine metallic Tilla gold thread embroidery around the placket, cuffs, and hem. Heirloom festive attire.',
    longDesc: `The epitome of royal Kashmiri bridal and winter celebration wear. Crafted from sumptuous, fluid micro-velvet that catches the light with a subtle sheen, this pheran features dense Tilla needlework—an ancient technique where genuine silver and gold metallic coils are stitched by master craftsmen into paisley (Badam) and floral traceries.\n\nGenerously cut for timeless grace, with wide bell sleeves and side slit pockets. Perfect for winter weddings, Diwali celebrations, and festive dinner evenings.`,
    editorialStory: 'Echoing the grandeur of royal Kashmiri darbars, where Tilla embroidery was reserved for court nobility.',
    price: 18500,
    mrp: 24000,
    image: '/images/crafts-winter-hero.jpg',
    additionalImages: [
      '/images/crafts-shawls.jpg',
      '/images/crafts-artisan-hands.jpg',
    ],
    sizes: ['S (Chest 38")', 'M (Chest 42")', 'L (Chest 46")', 'XL (Chest 50")'],
    colorOptions: [
      { name: 'Midnight Navy Velvet', hex: '#111D33' },
      { name: 'Emerald Forest', hex: '#1A3828' },
      { name: 'Deep Royal Wine', hex: '#4A1521' },
      { name: 'Jet Onyx Black', hex: '#1C1C1E' },
    ],
    provenance: {
      origin: 'Zadibal Craft Quarter, Srinagar, Kashmir',
      artisanGroup: 'Master Ustad Farooq Ahmad & Tilla Guild',
      craftTradition: 'Traditional Kashmiri Tilla Gold Wire Needlework',
      material: 'Imported Silk-Viscose Micro Velvet with Real Metallic Tilla Zari',
      technique: 'Point needle anchoring of gold-silver coils onto stretched velvet slate',
      artisanHours: 110,
      giTagCertified: true,
      giCertificateNo: 'JK-GI-TILLA-2026-0419',
      care: 'Strictly dry clean only. Store wrapped inside out in muslin fabric.',
    },
    tryWithSiSupported: true,
    isFeatured: true,
    warmthRating: 'Warm (0°C - 10°C)',
    stockStatus: 'IN_STOCK',
    tags: ['pheran', 'velvet', 'tilla', 'zari', 'festive', 'bridal', 'luxury'],
    pairWithSlug: 'royal-kani-pashmina-shawl-floral-jamawar',
  },

  // ── 4. JACKETS & COATS ───────────────────────────────────────────────────────
  {
    id: 'crf-jkt-001',
    name: 'Artisan Aari Embroidered Velvet Long Coat',
    slug: 'contemporary-aari-velvet-long-coat',
    category: 'jackets-coats',
    categoryLabel: 'Jackets & Coats',
    subCategory: 'Luxury Long Coats',
    gender: 'women',
    shortDesc: 'Structured longline winter coat in deep emerald green velvet with intricate Kashmiri Aari chain-stitch floral panels and front hook closure.',
    longDesc: `Where traditional Kashmiri artisanal embroidery meets contemporary high-fashion tailoring. This showstopping long coat is tailored from plush velvet and adorned along the front lapels, back panel, and cuffs with vibrant Aari needlework depicting blossoming autumn chinar leaves and valley vines.\n\nFeatures a tailored structured shoulder, clean mandarin neckline, concealed hook-and-eye closures, and functional in-seam pockets. Wear open over sleek trousers or fastened as an evening statement coat.`,
    editorialStory: 'Worn against the backdrop of snow-covered pines in Pahalgam and ancient walnut carved pavilions.',
    price: 16500,
    mrp: 22000,
    image: '/images/crafts-jackets.jpg',
    additionalImages: [
      '/images/crafts-jackets.jpg',
      '/images/crafts-winterwear.jpg',
    ],
    sizes: ['XS (34")', 'S (36")', 'M (38")', 'L (40")', 'XL (42")'],
    colorOptions: [
      { name: 'Imperial Emerald', hex: '#1C4A3A' },
      { name: 'Midnight Sapphire', hex: '#172745' },
      { name: 'Black Onyx', hex: '#1E1E1E' },
    ],
    provenance: {
      origin: 'Anantnag & Srinagar, Kashmir',
      artisanGroup: 'Valley Women Artisans Collective',
      craftTradition: 'Aari Chain-Stitch Embroidery',
      material: 'Deep Pile Cotton Velvet with Pure Silk Floss Thread Embroidery',
      technique: 'Hook needle (Aar) crewel chain-stitch embroidery on stretched frames',
      artisanHours: 85,
      giTagCertified: false,
      care: 'Dry clean only. Hang on wide contoured wooden hanger.',
    },
    tryWithSiSupported: true,
    isFeatured: true,
    warmthRating: 'Warm (0°C - 10°C)',
    stockStatus: 'IN_STOCK',
    tags: ['coat', 'jacket', 'velvet', 'aari', 'long-coat', 'contemporary', 'winter'],
    pairWithSlug: 'kashmiri-hand-embroidered-cashmere-stole-floral-ivory',
  },
  {
    id: 'crf-jkt-002',
    name: 'Kashmiri Tweed Embroidered Nehru Waistcoat (Men)',
    slug: 'kashmiri-tweed-embroidered-nehru-waistcoat-men',
    category: 'jackets-coats',
    categoryLabel: 'Jackets & Coats',
    subCategory: 'Men’s Waistcoats',
    gender: 'men',
    shortDesc: 'Sharp tailored Nehru jacket crafted from handspun Kashmiri sheep wool tweed, detailed with delicate Sozni stitch on the collar and welt pockets.',
    longDesc: `An essential wardrobe staple for the distinguished gentleman. Woven on village handlooms in Bandipora from 100% unbleached sheep wool tweed, then structured with canvas tailoring for a crisp, flattering silhouette.\n\nAccented with subtle tonal Sozni hand embroidery along the mandarin collar and pocket welts. Fastens with engraved horn-style buttons. Layers impeccably over kurtas for festive gatherings or over crisp collared shirts for executive winter wear.`,
    editorialStory: 'Combining the warmth of Himalayan wool with timeless Indian formal tailoring.',
    price: 7900,
    mrp: 11000,
    image: '/images/crafts-winterwear.jpg',
    additionalImages: [
      '/images/crafts-winterwear.jpg',
      '/images/crafts-pherans.jpg',
    ],
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
    colorOptions: [
      { name: 'Himalayan Granite Tweed', hex: '#484644' },
      { name: 'Earthy Walnut Khaki', hex: '#634E3A' },
      { name: 'Midnight Navy Tweed', hex: '#202636' },
    ],
    provenance: {
      origin: 'Bandipora & Srinagar, Kashmir',
      artisanGroup: 'Bandipora Handloom Weavers Society',
      craftTradition: 'Tweed Handloom Weaving & Tailored Sozni Accents',
      material: '100% Hand-spun Mountain Wool with Japanese Bemberg Lining',
      technique: 'Shuttle loom weaving and handcrafted bespoke tailoring',
      artisanHours: 48,
      giTagCertified: false,
      care: 'Dry clean only. Keep in a breathable suit cover.',
    },
    tryWithSiSupported: true,
    isFeatured: false,
    warmthRating: 'Mild (10°C - 18°C)',
    stockStatus: 'IN_STOCK',
    tags: ['jacket', 'waistcoat', 'nehru-jacket', 'men', 'tweed', 'formal'],
  },

  // ── 5. WINTER WEAR ───────────────────────────────────────────────────────────
  {
    id: 'crf-wtw-001',
    name: 'Kashmiri Embroidered Wool Cape Poncho',
    slug: 'kashmiri-embroidered-wool-cape-poncho',
    category: 'winter-wear',
    categoryLabel: 'Winter Wear',
    subCategory: 'Capes & Ponchos',
    gender: 'women',
    shortDesc: 'Asymmetrical winter cape poncho woven from soft boiled wool, detailed with Aari embroidered paisley borders and fringed edges.',
    longDesc: `The ultimate effortless winter layer. Slip this poncho over any sweater, dress, or denim to achieve instant high-fashion sophistication while staying cocooned in warmth.\n\nWoven from dense boiled merino wool that naturally repels mountain wind and moisture, framed by cascading Kashmiri floral embroidery and hand-knotted fringe.`,
    editorialStory: 'Worn while sipping steaming kehwa beside the fireplace at our Srinagar hillside property.',
    price: 8900,
    mrp: 12500,
    image: '/images/crafts-winterwear.jpg',
    additionalImages: [
      '/images/crafts-stoles.jpg',
      '/images/crafts-jackets.jpg',
    ],
    sizes: ['Free Size (Fits XS - XXL)'],
    colorOptions: [
      { name: 'Warm Camel Tan', hex: '#C19A6B' },
      { name: 'Rich Wine Maroon', hex: '#581C25' },
      { name: 'Smoky Charcoal', hex: '#343336' },
    ],
    provenance: {
      origin: 'Srinagar Craft Hub, Kashmir',
      artisanGroup: 'Valley Woolen Guild',
      craftTradition: 'Boiled Wool & Aari Hook Embroidery',
      material: '100% Pure Boiled Merino Wool',
      technique: 'Fulling process for thermal wind resistance with machine-finished Aari detailing',
      artisanHours: 36,
      giTagCertified: false,
      care: 'Dry clean or hand wash gently in cold water. Lay flat to dry.',
    },
    tryWithSiSupported: true,
    isFeatured: true,
    warmthRating: 'Warm (0°C - 10°C)',
    stockStatus: 'IN_STOCK',
    tags: ['cape', 'poncho', 'winter-wear', 'co-ord', 'merino-wool', 'versatile'],
  },

  // ── 6. WINTER ACCESSORIES ────────────────────────────────────────────────────
  {
    id: 'crf-acc-001',
    name: 'Artisan Embroidered Woolen Beanie & Glove Set',
    slug: 'artisan-embroidered-woolen-beanie-glove-set',
    category: 'accessories',
    categoryLabel: 'Accessories',
    subCategory: 'Winter Accessories',
    gender: 'unisex',
    shortDesc: 'Hand-knitted pure wool winter beanie cap with matching fleece-lined touchscreen gloves and floral crewel embroidery.',
    longDesc: `Keep your extremities toasty without sacrificing style. Hand-knitted by village craftswomen in the high valleys of Kashmir using thick, soft natural wool.\n\nAccented with colorful hand-embroidered floral motifs. The gloves feature conductive touchscreen yarn on index and thumb fingertips for effortless winter smartphone use.`,
    editorialStory: 'Crafted by women artisans working from home in rural Kashmir, providing sustainable year-round income.',
    price: 2450,
    mrp: 3500,
    image: '/images/crafts-accessories.jpg',
    additionalImages: [
      '/images/crafts-accessories.jpg',
      '/images/crafts-winter-hero.jpg',
    ],
    sizes: ['Standard Adult Stretch (Free Size)'],
    colorOptions: [
      { name: 'Winter Cream Floral', hex: '#F5EFE6' },
      { name: 'Burgundy Floral', hex: '#5E1B24' },
      { name: 'Charcoal Heather', hex: '#3B3B3D' },
    ],
    provenance: {
      origin: 'Kupwara & Ganderbal, Kashmir',
      artisanGroup: 'Himalayan Women Knitting Guild',
      craftTradition: 'Hand-knitting & Crewel Needlework',
      material: '100% Pure Mountain Wool with Thermal Fleece Lining',
      technique: 'Circular hand-knitting needles with embroidered embellishments',
      artisanHours: 18,
      giTagCertified: false,
      care: 'Gentle hand wash in lukewarm water. Do not tumble dry.',
    },
    tryWithSiSupported: true,
    isFeatured: false,
    warmthRating: 'Sub-Zero Heavy (-10°C - 0°C)',
    stockStatus: 'IN_STOCK',
    tags: ['beanie', 'gloves', 'caps', 'mufflers', 'winter-accessories', 'gifting'],
  },

  // ── 7. HOME & HERITAGE ───────────────────────────────────────────────────────
  {
    id: 'crf-hm-001',
    name: 'Master Carved Kashmiri Walnut Wood Dry Fruit Box',
    slug: 'master-carved-kashmiri-walnut-wood-dry-fruit-box',
    category: 'home-heritage',
    categoryLabel: 'Home & Heritage',
    subCategory: 'Walnut Wood Carving',
    gender: 'unisex',
    shortDesc: '4-compartment heirloom dry fruit box carved from seasoned Kashmiri walnut wood roots (Dun Kul). Intricate Chinar and Dragon relief motifs.',
    longDesc: `Carved exclusively from the root wood of matured Kashmiri walnut trees (Juglans regia) that have ceased bearing fruit. Walnut root wood is renowned worldwide for its deep brown grain, silky luster, and resistance to warping.\n\nHand-carved using hand chisels (Zamin/Jali work) by master carvers in Downtown Srinagar, then rubbed with natural wax and agate stone for a soft, lifelong patina without artificial varnish. Features 4 removable brass-hinged compartments—the ultimate centerpiece for serving Nuty Tales premium dry fruits to guests.`,
    editorialStory: 'Every swirl of the chisel reflects generations of woodcraft passed down through the guilds of Srinagar.',
    price: 6800,
    mrp: 9500,
    image: '/images/dark-wood-gourmet-tray.jpg',
    additionalImages: [
      '/images/dark-wood-gourmet-tray.jpg',
      '/images/crafts-artisan-hands.jpg',
    ],
    sizes: ['10" × 8" × 3.5" (4 Compartments)'],
    colorOptions: [
      { name: 'Natural Waxed Walnut', hex: '#4A3525' },
    ],
    provenance: {
      origin: 'Fateh Kadal, Downtown Srinagar, Kashmir',
      artisanGroup: 'Master Craftsman Nazir Ahmad Woodcarvers',
      craftTradition: 'Walnut Wood Carving (Deep Relief / Undercut)',
      material: '100% Seasoned Kashmiri Walnut Root Wood (Dun Kul)',
      technique: 'Hand-carved with steel chisels and polished with natural bee wax',
      artisanHours: 54,
      giTagCertified: true,
      giCertificateNo: 'JK-GI-WOOD-2026-0623',
      care: 'Wipe with dry microfiber cloth. Polish once a year with pure walnut oil.',
    },
    tryWithSiSupported: false,
    isFeatured: true,
    warmthRating: 'Mild (10°C - 18°C)',
    stockStatus: 'IN_STOCK',
    tags: ['walnut-wood', 'wood-carving', 'box', 'dry-fruit-box', 'kashmir', 'gi-certified'],
    pairWithSlug: 'kashmiri-heritage-luxury-hamper',
  },
  {
    id: 'crf-hm-002',
    name: 'Hand-Painted Kashmiri Papier-Mâché Keepsake Box',
    slug: 'hand-painted-kashmiri-papier-mache-keepsake-box',
    category: 'home-heritage',
    categoryLabel: 'Home & Heritage',
    subCategory: 'Papier-Mâché',
    gender: 'unisex',
    shortDesc: 'Artisanal lacquered box crafted from recycled paper pulp, hand-painted with genuine 24k gold leaf accents in the legendary Hazara Gulzar (Thousand Flowers) pattern.',
    longDesc: `Papier-mâché was introduced to Kashmir in the 14th century by Sufi saint Mir Sayyid Ali Hamadani from Persia. The craft involves two stages: Sakhtsazi (shaping the mashed paper pulp in wooden moulds) and Naqqashi (intricate painting by master artists).\n\nDecorated with the 'Hazara Gulzar' motif featuring miniature roses, nightingales, and gold dust, then coated with multiple layers of crystal-clear amber lacquer for waterproof durability. An exquisite container for saffron jars, fine jewelry, or celebratory dry fruit tokens.`,
    editorialStory: 'Hand-painted with brushes made from fine cat hair to achieve microscopic line accuracy.',
    price: 3200,
    mrp: 4500,
    image: '/images/crafts-gifting-box.jpg',
    additionalImages: [
      '/images/crafts-gifting-box.jpg',
      '/images/crafts-artisan-hands.jpg',
    ],
    sizes: ['6" × 4" × 2.5"'],
    colorOptions: [
      { name: 'Royal Emerald & Gold', hex: '#165B4C' },
      { name: 'Midnight Navy & Gold', hex: '#16223B' },
      { name: 'Ivory Floral Gold', hex: '#F7F3E9' },
    ],
    provenance: {
      origin: 'Zadibal, Srinagar, Kashmir',
      artisanGroup: 'Mir Papier-Mâché Guild',
      craftTradition: 'Sakhtsazi & Naqqashi Miniature Painting',
      material: 'Pulp of recycled paper, water-resistant lacquer, mineral pigments & gold leaf',
      technique: 'Multi-layer stone rubbing and fine hairbrush painting',
      artisanHours: 38,
      giTagCertified: true,
      giCertificateNo: 'JK-GI-PAPIER-2026-0177',
      care: 'Wipe with soft damp cloth. Keep away from direct excessive water immersion.',
    },
    tryWithSiSupported: false,
    isFeatured: true,
    warmthRating: 'Mild (10°C - 18°C)',
    stockStatus: 'IN_STOCK',
    tags: ['papier-mache', 'hand-painted', 'box', 'gold-leaf', 'heritage', 'decor'],
  },

  // ── 8. HERITAGE GIFTING ──────────────────────────────────────────────────────
  {
    id: 'crf-gft-001',
    name: 'Kashmir Heritage Luxury Hamper (Winter Edition)',
    slug: 'kashmiri-heritage-luxury-hamper',
    category: 'heritage-gifting',
    categoryLabel: 'Heritage Gifting',
    subCategory: 'Curated Gift Hampers',
    gender: 'unisex',
    shortDesc: 'The ultimate royal gift: Handcrafted Papier-Mâché keepsake box, 1g Pure Kashmiri Mongra Saffron, 500g Acacia Honey, 250g Kagzi Walnuts, and a Pure Cashmere Stole.',
    longDesc: `Where Nuty Tales Foods and Crafts & Heritage merge into an unforgettable experience. Presented in an exquisite emerald-and-gold keepsake box featuring:\n\n• 1 × Fine Kashmiri Cashmere Stole (Unisex Ivory / Slate)\n• 1 × 1g Pure Kashmiri Mongra Saffron Jar (Pampore Grade A1)\n• 1 × 500g Raw Kashmiri Acacia Honey Glass Jar\n• 1 × 250g In-Shell Kashmiri Kagzi Walnuts\n• 1 × Handcrafted Papier-Mâché dry-fruit serving bowl\n• 1 × Personalized calligraphy note on handmade flower-petal paper\n\nDesigned for heads of state, VIP clients, Diwali 2026 executive gifting, and memorable family milestones.`,
    editorialStory: 'Curated by Nuty Tales to celebrate the timeless elegance, warmth, and culinary treasures of the Kashmir Valley.',
    price: 18999,
    mrp: 25000,
    image: '/images/crafts-gifting-box.jpg',
    additionalImages: [
      '/images/crafts-gifting-box.jpg',
      '/images/luxury-hamper-jars.png',
      '/images/crafts-stoles.jpg',
      '/images/saffron-jar-5g.jpg',
    ],
    sizes: ['Executive Presentation Box (16" × 12" × 5")'],
    colorOptions: [
      { name: 'Heritage Emerald & Gold', hex: '#165B4C' },
      { name: 'Royal Midnight Navy', hex: '#16223B' },
    ],
    provenance: {
      origin: 'Curated in Srinagar & Packed at Nuty Tales Noida HQ',
      artisanGroup: 'Collaboration between Kashmir Weavers, Beekeepers & Saffron Farmers',
      craftTradition: 'Heritage Gifting Assembly',
      material: 'Silk-lined presentation box with authentic artisanal products',
      technique: 'Hand-curated single-origin selection',
      artisanHours: 120,
      giTagCertified: true,
      giCertificateNo: 'NT-HERITAGE-GIFT-2026',
      care: 'Store in a cool dry place. Dry clean stole.',
    },
    tryWithSiSupported: false,
    isFeatured: true,
    warmthRating: 'Warm (0°C - 10°C)',
    stockStatus: 'IN_STOCK',
    tags: ['hamper', 'gifting', 'kashmir-heritage', 'corporate-gifting', 'luxury', 'diwali-2026'],
  },
]

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────────
export function getAllCraftProducts(): CraftProduct[] {
  return CRAFT_PRODUCTS
}

export function getCraftBySlug(slug: string): CraftProduct | undefined {
  return CRAFT_PRODUCTS.find((p) => p.slug === slug)
}

export function getCraftsByCategory(category: CraftCategory): CraftProduct[] {
  return CRAFT_PRODUCTS.filter((p) => p.category === category)
}

export function getFeaturedCrafts(): CraftProduct[] {
  return CRAFT_PRODUCTS.filter((p) => p.isFeatured)
}

export function getClothingCrafts(): CraftProduct[] {
  return CRAFT_PRODUCTS.filter((p) => p.tryWithSiSupported)
}

export const CRAFT_CATEGORIES = [
  { slug: 'shawls', label: 'Shawls', sub: 'Pashmina · Kani · Sozni', image: '/images/crafts-shawls.jpg' },
  { slug: 'stoles', label: 'Stoles', sub: 'Cashmere · Wool · Embroidered', image: '/images/crafts-stoles.jpg' },
  { slug: 'pherans', label: 'Pherans', sub: 'Tweed · Velvet · Tilla · Aari', image: '/images/crafts-pherans.jpg' },
  { slug: 'jackets-coats', label: 'Jackets & Coats', sub: 'Embroidered Velvet · Nehru · Wool', image: '/images/crafts-jackets.jpg' },
  { slug: 'winter-wear', label: 'Winter Wear', sub: 'Capes · Ponchos · Co-ords', image: '/images/crafts-winterwear.jpg' },
  { slug: 'accessories', label: 'Accessories', sub: 'Beanies · Gloves · Mufflers', image: '/images/crafts-accessories.jpg' },
  { slug: 'home-heritage', label: 'Home & Heritage', sub: 'Walnut Wood · Papier-Mâché · Carpets', image: '/images/dark-wood-gourmet-tray.jpg' },
  { slug: 'heritage-gifting', label: 'Heritage Gifting', sub: 'Curated Keepsake Hampers', image: '/images/crafts-gifting-box.jpg' },
] as const
