// ─── Nuty Tales Business Supply — Enterprise B2B Marketplace & Ingredients Catalog ─────────
// Connecting Foodservice, Food Production, Health/Wellness, Trade, Brands, and Enterprise Procurement

export interface IndustryProfile {
  id: string
  slug: string
  name: string
  category: 'food-service' | 'food-production' | 'health-wellness' | 'trade' | 'brands' | 'gifting'
  categoryLabel: string
  tagline: string
  icon: string
  tier: 1 | 2
  primaryProducts: string[]
  cutTypes: string[]
  typicalMonthlyKg: string
  useCases: string[]
  keyBenefits: string[]
  fssaiStandard: string
}

// ── 15 Comprehensive Industry Profiles (Tier 1 & Tier 2) ────────────────────────
export const INDUSTRIES: IndustryProfile[] = [
  // ── TIER 1: CORE COMMERCIAL VOLUMES ──────────────────────────────────────────
  {
    id: 'ind-hotel',
    slug: 'hotels-resorts',
    name: 'Hotels & Resorts',
    category: 'food-service',
    categoryLabel: 'Hospitality',
    tagline: 'Breakfast buffets · gourmet kitchens · in-room minibar · banquets & VIP gifting',
    icon: '🏨',
    tier: 1,
    primaryProducts: ['California Almonds', 'W240 Cashews', 'Iranian Pistachios', 'Medjool Dates', 'Walnut Halves'],
    cutTypes: ['Whole Jumbo', 'Roasted & Salted (Mini Bar Packs)', 'Sliced for Buffet'],
    typicalMonthlyKg: '100 kg - 1,000 kg',
    useCases: ['Executive breakfast cereals & yoghurt bars', 'Bespoke turndown amenities', 'VIP banquet catering', 'Lobby café patisserie'],
    keyBenefits: ['Consistent HACCP & FSSAI batch testing', 'Vacuum sealed 500g & 1kg packs', 'Scheduled monthly delivery', 'Credit terms for 5-star chains'],
    fssaiStandard: 'FSSAI Central & NABL Lab Certified',
  },
  {
    id: 'ind-sweet',
    slug: 'sweet-shops',
    name: 'Sweet Shops & Mithai Manufacturers',
    category: 'food-production',
    categoryLabel: 'Sweets & Mithai',
    tagline: 'Kaju katli · dry fruit barfi · laddoo · premium mithai · festive peak production',
    icon: '🍬',
    tier: 1,
    primaryProducts: ['W320 & W240 Cashews', 'Cashew Tukda (Splits & LWP)', 'Pampore Mongra Saffron', 'Pistachio Slivers', 'Chironji'],
    cutTypes: ['Whole Cashews', 'Splits (JH)', 'Pieces (LWP)', 'Pistachio Slivers (Pista Chipta)', 'Pure Saffron Filaments'],
    typicalMonthlyKg: '500 kg - 10,000 kg (Festive peak 25+ tons)',
    useCases: ['Ultra-smooth Kaju Katli paste', 'Pista roll fillings', 'Dodha barfi cashew crunch', 'Motichoor laddoo pistachio garnish', 'Festive corporate mithai boxes'],
    keyBenefits: ['Clean sorted white cashew splits with zero bitter kernel', 'Genuine crocin > 240 Kashmir saffron for rich yellow aroma', 'Bulk 25kg & 50kg vacuum bags', 'Guaranteed Diwali contract supply lock-in'],
    fssaiStandard: 'Agmark Grade 1 & FSSAI Certified',
  },
  {
    id: 'ind-bakery',
    slug: 'bakeries',
    name: 'Bakeries & Cake Manufacturers',
    category: 'food-production',
    categoryLabel: 'Bakery & Confectionery',
    tagline: 'Almonds · walnuts · pistachios · raisins · dates · sliced & blanched ingredients',
    icon: '🥐',
    tier: 1,
    primaryProducts: ['California Almonds', 'Kashmiri Walnuts', 'Afghan Green Raisins', 'Pistachio Kernels', 'Black Currants'],
    cutTypes: ['Slivered', 'Sliced / Flaked (0.8mm - 1.2mm)', 'Diced (3mm - 5mm)', 'Blanched Whole', 'Almond Flour (Fine Meal)'],
    typicalMonthlyKg: '250 kg - 2,500 kg',
    useCases: ['Croissant frangipane toppings', 'Sourdough walnut loaves', 'Plum cakes & stollen', 'Macarons & tea cakes', 'Biscotti & granola'],
    keyBenefits: ['Machine-sliced uniform thickness with zero dust', 'Moisture controlled < 5%', 'High-stability nitrogen-flushed 10kg tins/sacks', 'Pre-sorted zero shell fragments'],
    fssaiStandard: 'Direct Baker Ingredient Specification',
  },
  {
    id: 'ind-biscuit',
    slug: 'biscuit-manufacturers',
    name: 'Biscuit & Cookie Manufacturers',
    category: 'food-production',
    categoryLabel: 'Bakery & Confectionery',
    tagline: 'Bulk ingredients · consistent grades · monthly contracts · uniform mechanical cuts',
    icon: '🍪',
    tier: 1,
    primaryProducts: ['California Almond Dices', 'Cashew Dices', 'Seedless Raisins', 'Desi Ghee Makhana Powder'],
    cutTypes: ['Diced 3mm - 6mm', 'Coarse Chopped', 'Fine Nut Meal', 'Sorted Seedless Raisins'],
    typicalMonthlyKg: '1,000 kg - 20,000 kg',
    useCases: ['Nut butter cookies', 'Digestive biscuits with seed mixes', 'Dry fruit cake rusks', 'Artisan biscotti lines'],
    keyBenefits: ['Optical sorted for zero stone/foreign matter', 'Continuous multi-ton delivery schedule', 'Fixed quarterly/annual raw material pricing', 'COA (Certificate of Analysis) with every batch'],
    fssaiStandard: 'Industrial Food Safety Standard ISO 22000',
  },
  {
    id: 'ind-confectionery',
    slug: 'chocolates-confectionery',
    name: 'Chocolate & Confectionery Brands',
    category: 'food-production',
    categoryLabel: 'Bakery & Confectionery',
    tagline: 'Pistachios · almonds · hazelnuts · raisins · dried cranberries & berries',
    icon: '🍫',
    tier: 1,
    primaryProducts: ['Dry Roasted Almonds', 'Salted Pistachio Kernels', 'Turkish Hazelnuts', 'Medjool Date Paste', 'Dried Cranberries'],
    cutTypes: ['Whole Dry Roasted', 'Caramelized Praline Nibs', 'Nut Pastes & Pralines'],
    typicalMonthlyKg: '500 kg - 5,000 kg',
    useCases: ['Bean-to-bar dark chocolate nut inclusions', 'Pralines & bonbons', 'Energy date bites', 'Artisanal spreads'],
    keyBenefits: ['Even internal roasting with zero burnt bitterness', 'Microbiologically tested', 'Customizable roast profile (Light / Medium / Deep)'],
    fssaiStandard: 'Confectionery Grade Quality Assurance',
  },
  {
    id: 'ind-restaurant',
    slug: 'restaurants-cafes',
    name: 'Restaurants, Cafés & Cloud Kitchens',
    category: 'food-service',
    categoryLabel: 'Hospitality',
    tagline: 'Kitchen ingredients · desserts · breakfast bowls · garnishing & gravies',
    icon: '🍽️',
    tier: 1,
    primaryProducts: ['Cashew Tukda', 'Almond Slivers', 'Melon Seeds (Magaz)', 'Raisins', 'Saffron'],
    cutTypes: ['Cashew Tukda (Splits)', 'Slivered Garnish', 'Nut Powders for Gravies'],
    typicalMonthlyKg: '50 kg - 400 kg',
    useCases: ['Mughlai shahi korma white gravies', 'Biryani dry fruit garnishing', 'Smoothie bowl toppings', 'Dessert garnishes'],
    keyBenefits: ['Direct kitchen packaging (5kg & 10kg)', 'Low wastage pre-cleaned grades', 'Weekly replenishment via local warehouse'],
    fssaiStandard: 'Commercial Kitchen Certified',
  },
  {
    id: 'ind-caterer',
    slug: 'caterers-events',
    name: 'Caterers & Event Companies',
    category: 'food-service',
    categoryLabel: 'Hospitality',
    tagline: 'Weddings · corporate events · large-volume requirements · live dry fruit counters',
    icon: '🎪',
    tier: 1,
    primaryProducts: ['W240 Jumbo Cashews', 'Mamra Almonds', 'Salted Pistachios', 'Makhana', 'Afghani Anjeer'],
    cutTypes: ['Whole Jumbo', 'Snack Counter Packs', 'Gravy Grade Splits'],
    typicalMonthlyKg: '200 kg - 2,500 kg per event',
    useCases: ['Live cocktail dry fruit stations', 'Lavish wedding buffet desserts', 'VIP lounge refreshments'],
    keyBenefits: ['Rapid same-day dispatch for sudden event scale-ups', 'Pristine jumbo aesthetics', 'Credit billing for approved event agencies'],
    fssaiStandard: 'FSSAI Catering Grade Certified',
  },
  {
    id: 'ind-snack-mfg',
    slug: 'food-snack-manufacturers',
    name: 'Food & Snack Manufacturers',
    category: 'food-production',
    categoryLabel: 'Food Manufacturing',
    tagline: 'Trail mixes · energy bars · granola · cereals · healthy snacks · protein products',
    icon: '🥜',
    tier: 1,
    primaryProducts: ['Graded Phool Makhana (6 Suta)', 'Chia & Flax Seeds', 'Pumpkin Seeds', 'California Almonds', 'Dried Cranberries'],
    cutTypes: ['Whole Graded', 'Dehulled Seeds', 'Diced Nuts (2mm - 4mm)', 'Extrusion Nut Flours'],
    typicalMonthlyKg: '1,000 kg - 25,000 kg',
    useCases: ['Cold-pressed protein bars', 'Keto trail mixes', 'Roasted flavoured makhana snacks', 'Extruded breakfast cereals'],
    keyBenefits: ['Traceability to farm cooperatives in Bihar & Kashmir', 'Consistent density and moisture content', 'Automated bagging compatibility'],
    fssaiStandard: 'Export Quality ISO 22000',
  },

  // ── TIER 2: HIGH-GROWTH SPECIALIZED SECTORS ─────────────────────────────────
  {
    id: 'ind-ice-cream',
    slug: 'ice-cream-dairy',
    name: 'Ice Cream & Dairy Manufacturers',
    category: 'food-production',
    categoryLabel: 'Dairy & Desserts',
    tagline: 'Dry fruits for ice creams · authentic kulfi · thick shakes · flavoured dairy desserts',
    icon: '🍨',
    tier: 2,
    primaryProducts: ['Roasted Almond Dices', 'Iranian Pistachio Dices', 'Pure Saffron Mongra', 'Cashew Tukda'],
    cutTypes: ['Moisture-Resistant Roasted Dices', 'Blanched Slivers', 'Pure Saffron Concentrate'],
    typicalMonthlyKg: '500 kg - 6,000 kg',
    useCases: ['Shahi Kulfi interior chunks', 'Butterscotch & Roasted Almond tubs', 'Pista Kesar dairy beverages', 'Falooda toppings'],
    keyBenefits: ['Specific roasting profile prevents sogginess when frozen', 'Microbiological zero Salmonella guarantee', 'COA certified'],
    fssaiStandard: 'Dairy Industry Microbiological Grade',
  },
  {
    id: 'ind-cereal',
    slug: 'breakfast-cereal-brands',
    name: 'Breakfast & Cereal Brands',
    category: 'food-production',
    categoryLabel: 'Food Manufacturing',
    tagline: 'Granola · muesli · cereals · oats mixes · balanced trail blends',
    icon: '🥣',
    tier: 2,
    primaryProducts: ['Sliced Almonds', 'Pumpkin Seeds', 'Sunflower Seeds', 'Black Raisins', 'Dried Cranberries'],
    cutTypes: ['Flaked 1.0mm', 'Cleaned & Destoned Dried Fruits', 'Uniform Seed Mixes'],
    typicalMonthlyKg: '1,000 kg - 15,000 kg',
    useCases: ['Toasted honey granola blends', 'Swiss style muesli', 'Overnight oats inclusions'],
    keyBenefits: ['Moisture balanced to match cereal target AW (Water Activity)', 'No artificial preservatives', 'Custom premixes available'],
    fssaiStandard: 'FSSAI Breakfast Cereal Standards',
  },
  {
    id: 'ind-wellness',
    slug: 'health-wellness-brands',
    name: 'Health & Wellness Brands',
    category: 'health-wellness',
    categoryLabel: 'Health & Wellness',
    tagline: 'Protein mixes · energy products · seed/nut blends · superfood ingredients',
    icon: '🌿',
    tier: 2,
    primaryProducts: ['Raw Mamra Almonds', 'Kashmiri Walnut Kernels', 'Hemp & Chia Seeds', 'Raw Pumpkin Seeds'],
    cutTypes: ['Raw Unsalted Whole', 'Micro-Milled Powder', 'Cold-Pressed Nut Meal'],
    typicalMonthlyKg: '250 kg - 3,000 kg',
    useCases: ['Clean-label plant protein powders', 'Ayurvedic chyawanprash nut fortifiers', 'Omega-3 seed mixes'],
    keyBenefits: ['Zero chemical fumigants', 'Rich natural oil profile (> 50% in Mamra & Walnuts)', 'NABL certified nutritional panels'],
    fssaiStandard: 'Clean Label Verified',
  },
  {
    id: 'ind-nutraceutical',
    slug: 'nutraceutical-manufacturers',
    name: 'Nutraceutical & Supplement Manufacturers',
    category: 'health-wellness',
    categoryLabel: 'Health & Wellness',
    tagline: 'Strict ingredient supply · pure plant extracts · clean raw material sourcing',
    icon: '💊',
    tier: 2,
    primaryProducts: ['Pure Grade A1 Saffron', 'High-Oil Kashmiri Walnuts', 'Raw Flaxseeds', 'Pure Acacia Honey'],
    cutTypes: ['Standardized Whole Ingredients', 'Lab Tested Raw Extracts'],
    typicalMonthlyKg: '100 kg - 2,000 kg',
    useCases: ['Saffron carotenoid & crocin extraction', 'Plant-based Omega-3 formulations', 'Nutraceutical gummies & syrups'],
    keyBenefits: ['Zero synthetic adulteration', 'HPLC tested active botanical compounds', 'Strict pharma ingredient COA'],
    fssaiStandard: 'Nutraceutical Raw Material Standard',
  },
  {
    id: 'ind-private-label',
    slug: 'private-label-d2c',
    name: 'Private Label & D2C Food Brands',
    category: 'brands',
    categoryLabel: 'Private Label',
    tagline: 'We source. You brand. Bulk ingredients · custom blends · contract packaging · fulfilment',
    icon: '🏷️',
    tier: 2,
    primaryProducts: ['Almonds', 'Cashews', 'Walnuts', 'Makhana', 'Flavoured Nuts', 'Trial Packs'],
    cutTypes: ['Bulk Sacks', 'Finished Pouches (200g, 250g, 500g)', 'Custom Rigid Gift Boxes'],
    typicalMonthlyKg: '500 kg - 10,000 kg',
    useCases: ['New D2C brand launches on Amazon/Quick-Commerce', 'Boutique gourmet food labels', 'Corporate merchandise'],
    keyBenefits: ['Turnkey supply chain from farm sourcing to final nitrogen-flushed pouching', 'Small batch starter MOQs', 'Pan-India drop-shipping'],
    fssaiStandard: 'Contract Manufacturing FSSAI Ready',
  },
  {
    id: 'ind-retail',
    slug: 'retailers-supermarkets',
    name: 'Retailers & Supermarkets',
    category: 'trade',
    categoryLabel: 'Retail & Distribution',
    tagline: 'Dry-fruit specialty stores · general trade / Kirana · modern retail · regional distributors',
    icon: '🏪',
    tier: 2,
    primaryProducts: ['Pre-packed Retail Pouches', 'Bulk 10kg Display Tins', 'Festive Gift Trays'],
    cutTypes: ['Shelf-Ready Vacuum Packs', 'Loose Counter Bulk Sacks'],
    typicalMonthlyKg: '500 kg - 15,000 kg',
    useCases: ['Direct store shelf retail sales', 'High-margin festival counter displays', 'Regional wholesale redistribution'],
    keyBenefits: ['Attractive barcode-enabled packaging', 'High retail margins (25% - 40%)', 'Damaged goods return replacement policy'],
    fssaiStandard: 'Retail Standard Packaged Commodities Act Compliant',
  },
  {
    id: 'ind-gifting-agency',
    slug: 'gifting-wedding-planners',
    name: 'Gifting Companies & Wedding Planners',
    category: 'gifting',
    categoryLabel: 'Gifting & Events',
    tagline: 'Bulk dry fruits · empty/custom luxury boxes · ready hampers · custom corporate branding',
    icon: '🎁',
    tier: 2,
    primaryProducts: ['Jumbo Grade Cashews & Almonds', 'Kashmir Saffron Jars', 'Acacia Honey Jars', 'Lacquered Wooden Chests'],
    cutTypes: ['Hermetic Jars', 'Foil Stamped Pouches', 'Luxury Presentation Trays'],
    typicalMonthlyKg: '100 kg - 5,000 kg (Seasonal spikes)',
    useCases: ['Diwali corporate employee gifts', 'Royal wedding return favors', 'HNW client relationship hampers'],
    keyBenefits: ['Couple monogram & company logo hot foil stamping', 'Direct multi-city address delivery', 'Designer box options'],
    fssaiStandard: 'Luxury Gifting Compliant',
  },
]

// ── 2. Comprehensive Bulk Ingredients Catalog ────────────────────────────────────
// Moving from "dry-fruit seller" to "complete industrial ingredient supplier"

export interface BulkIngredientGroup {
  category: string
  tagline: string
  items: {
    name: string
    grades: string[]
    availableCuts: string[]
    origin: string
    moqKg: number
    packaging: string
  }[]
}

export const BULK_INGREDIENTS_CATALOG: BulkIngredientGroup[] = [
  {
    category: 'Whole Tree Nuts',
    tagline: 'Single-origin, hand-sorted and optically cleaned unbroken kernels',
    items: [
      {
        name: 'Almonds',
        grades: ['California Nonpareil 20/22', 'California Carmel 23/25', 'Kashmiri Mamra (Oil > 50%)', 'In-Shell Kagzi'],
        availableCuts: ['Whole Unroasted', 'Dry Roasted', 'Roasted & Salted'],
        origin: 'California / Kashmir Valley',
        moqKg: 25,
        packaging: '25kg Vacuum Bag in Carton / 10kg Nitrogen Tin',
      },
      {
        name: 'Cashews',
        grades: ['W180 (King Jumbo)', 'W240 (Standard Jumbo)', 'W320 (Universal Baking)', 'Splits (JH)', 'Pieces (LWP)'],
        availableCuts: ['Whole Raw', 'Dry Roasted', 'Fried & Salted', 'Splits'],
        origin: 'Mangalore / Goa / Benin',
        moqKg: 25,
        packaging: '10kg / 25kg Tin or Multi-layer Vacuum Sack',
      },
      {
        name: 'Pistachios',
        grades: ['Iranian Akbari Jumbo', 'Turkish Antep Kernels', 'California In-Shell Roasted'],
        availableCuts: ['In-Shell Roasted Salted', 'Raw Raw Green Kernels', 'Pistachio Slivers'],
        origin: 'Iran / California / Turkey',
        moqKg: 10,
        packaging: '10kg Vacuum Carton',
      },
      {
        name: 'Walnuts',
        grades: ['Kashmiri Kagzi Extra Light Halves (80%)', 'Light Amber Quarters', 'In-Shell Paper Walnut'],
        availableCuts: ['Halves', 'Quarters', 'Broken Bakers Grade'],
        origin: 'Kashmir Valley (Pahalgam & Kupwara)',
        moqKg: 10,
        packaging: '10kg Nitrogen Flush Carton',
      },
    ],
  },
  {
    category: 'Mechanically Processed Cuts',
    tagline: 'Precision laser & mechanical slicing for bakeries, confectionery & gravies',
    items: [
      {
        name: 'Sliced / Flaked Nuts',
        grades: ['Almond Slices (0.8mm - 1.2mm)', 'Cashew Flakes (1.0mm)', 'Pistachio Flakes'],
        availableCuts: ['Skin-on Slices', 'Blanched Pure White Slices'],
        origin: 'Noida Advanced Processing Facility',
        moqKg: 10,
        packaging: '5kg / 10kg Vacuum Bags (Zero Dust Screened)',
      },
      {
        name: 'Slivered (Matchsticks)',
        grades: ['Almond Slivers (2mm x 15mm)', 'Cashew Slivers', 'Pistachio Slivers (Pista Chipta)'],
        availableCuts: ['Uniform Blanched Strips'],
        origin: 'Noida Advanced Processing Facility',
        moqKg: 10,
        packaging: '5kg Multi-layer Foil Bags',
      },
      {
        name: 'Diced (Kibbled Chunks)',
        grades: ['Fine Dices (2mm - 4mm)', 'Medium Dices (4mm - 6mm)', 'Coarse Chunks (6mm - 8mm)'],
        availableCuts: ['Raw Dices', 'Golden Roasted Dices (Moisture < 3%)'],
        origin: 'Noida Advanced Processing Facility',
        moqKg: 25,
        packaging: '10kg / 25kg Vacuum Sacks',
      },
      {
        name: 'Nut Flour & Superfine Meal',
        grades: ['Ultra-Fine Almond Flour (100% De-skinned)', 'Walnut Flour', 'Cashew Powder'],
        availableCuts: ['Stone-Ground Gluten-Free Powder'],
        origin: 'Noida Advanced Processing Facility',
        moqKg: 10,
        packaging: '10kg Nitrogen Hermetic Bags',
      },
    ],
  },
  {
    category: 'Dried Fruits & Berries',
    tagline: 'Cleaned, destoned and graded for confectionery, desserts & health snacks',
    items: [
      {
        name: 'Raisins (Kishmish)',
        grades: ['Afghan Long Green Kishmish', 'Nashik Golden Raisins', 'Seedless Black Raisins'],
        availableCuts: ['Whole Destoned & Optical Cleared'],
        origin: 'Afghanistan / Maharashtra',
        moqKg: 25,
        packaging: '10kg / 15kg Heavy Corrugated Box',
      },
      {
        name: 'Dates (Khajoor)',
        grades: ['Saudi Medjool Jumbo', 'Iranian Kimia (Soft)', 'Omani Chopped Dates'],
        availableCuts: ['Whole Table Grade', 'Diced 5mm (Coated with Dextrose)', 'Date Paste'],
        origin: 'Middle East / Iran',
        moqKg: 10,
        packaging: '5kg / 10kg Master Carton',
      },
      {
        name: 'Figs & Berries',
        grades: ['Afghani Anjeer (Garland Thread)', 'Turkish Dried Apricots', 'Whole Dried Cranberries', 'Prunes'],
        availableCuts: ['Whole Graded', 'Diced Fig Pieces'],
        origin: 'Afghanistan / Turkey / USA',
        moqKg: 10,
        packaging: '10kg Vacuum Pack',
      },
    ],
  },
  {
    category: 'Super Seeds & Fox Nuts (Makhana)',
    tagline: 'Origin aggregation from Mithila wetlands and high-germination seed farms',
    items: [
      {
        name: 'Mithila Phool Makhana',
        grades: ['6+ Suta Jumbo', '5 Suta Standard', 'Hand-Sorted Cleaned'],
        availableCuts: ['Raw Graded Whole', 'Desi Ghee Roasted Bulk', 'Makhana Coarse Flour'],
        origin: 'Darbhanga & Madhubani, Bihar',
        moqKg: 50,
        packaging: '8kg / 10kg Moisture Barrier Poly Sacks',
      },
      {
        name: 'Super Seeds',
        grades: ['Pumpkin Seeds (AAA Grade Green)', 'Sunflower Seeds (Confectionery Grade)', 'Chia Seeds', 'Flax Seeds', 'Sesame Seeds (Hulled White)'],
        availableCuts: ['Raw Dehulled', 'Dry Roasted Super Mixes'],
        origin: 'Central India & Origin Imports',
        moqKg: 25,
        packaging: '25kg Double Lined Woven Bags',
      },
    ],
  },
]

// ── 3. Enterprise Supply & Contract Procurement Architecture ─────────────────────
export const ENTERPRISE_FEATURES = [
  {
    title: 'One Master Supplier, Multiple City Delivery',
    desc: 'Supply nationwide chains with uniform pricing, centralized billing, and local branch deliveries in Delhi NCR, Mumbai, Bengaluru, Kashmir, and Kolkata.',
    icon: '🌐',
  },
  {
    title: 'Annual Contract & Price Hedging',
    desc: 'Lock in seasonal agricultural prices for 6 to 12 months with predetermined monthly drawdown schedules to protect your margins against inflation.',
    icon: '📊',
  },
  {
    title: 'NABL Certified Lab COA on Every Batch',
    desc: 'Automated Certificate of Analysis covering moisture percentage, peroxide value, aflatoxin limits, and micro-biological safety with every consignment.',
    icon: '🔬',
  },
  {
    title: 'Dedicated Enterprise Account Desk',
    desc: 'Single relationship manager, automated re-ordering thresholds, custom cut adjustments, and priority emergency dispatches.',
    icon: '👔',
  },
]

export const NUT_PROCESSING_CUTS = [
  { name: 'Whole Premium', desc: 'Hand-sorted unbroken kernels, graded by size (W180, W240, 20/22 count).' },
  { name: 'Slivered (Matchstick)', desc: 'Skinless uniform matchsticks for biryani garnishes, kheer, and confectionery.' },
  { name: 'Sliced / Flaked', desc: 'Paper-thin wafers (0.8mm - 1.2mm) for cake toppings, pastries, and croissants.' },
  { name: 'Diced (Kibbled)', desc: 'Uniform 3mm - 6mm cubes for ice creams, chocolates, cookies, and energy bars.' },
  { name: 'Blanched Whole', desc: 'Skin removed using high-pressure steam; pure ivory color for luxury sweets.' },
  { name: 'Nut Flour / Meal', desc: 'Fine stone-ground gluten-free nut powder for macarons and keto baking.' },
]

export const BULK_PACKAGING_TIERS = [
  { label: '5 KG Sealed Box', desc: 'Food-grade multi-layer pouch in heavy corrugated box' },
  { label: '10 KG Nitrogen Tin', desc: 'Hermetically sealed for 18-month shelf stability in humid environments' },
  { label: '25 KG Vacuum Sack', desc: 'Heavy-gauge multi-layer vacuum barrier bag inside export carton' },
  { label: '50 KG Fiber Barrel', desc: 'Food-grade lined drum for automated confectionery production' },
  { label: '500 KG - 1 Ton Pallet', desc: 'Shrink-wrapped palletized freight with batch COA and GST invoice' },
]

export const SUPPLY_HUBS = [
  {
    city: 'Noida / Delhi NCR (Official Registered HQ)',
    role: 'Central Processing & Rapid B2B Dispatch',
    reach: 'Delhi NCR, Punjab, Haryana, Rajasthan, Western UP (Same-Day / Next-Day Delivery)',
    address: 'PC-12, 003, Jaypee Wishtown, Sector 128, Noida, Uttar Pradesh 201304',
    mapUrl: 'https://www.google.com/maps/place/Nuty+Tales+(Dry+fruits)/@28.5209169,77.3539445,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce7f48d890b99:0x17d4f4be831d96c1!8m2!3d28.5209122!4d77.3565248!16s%2Fg%2F11vyp7r8k6?entry=ttu&g_ep=EgoyMDI2MTAwNi4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    city: 'Kashmir (Arshid House)',
    role: 'Direct Valley Farm & Craft Aggregation',
    reach: 'Kashmiri Walnuts, Kagzi Badam, Pampore Saffron & Artisanal Crafts Sourcing',
    address: 'Arshid House, Budgam–Gojra Road, Dadna, Budgam, Jammu and Kashmir 191111',
    mapUrl: 'https://www.google.com/maps/place/Arshid+House/@34.0087558,74.7060736,17z/data=!4m6!3m5!1s0x38e191f6e26e2615:0x437d1ccd908b0d4a!8m2!3d34.0087701!4d74.7086101!16s%2Fg%2F11t2ssyygj?entry=ttu&g_ep=EgoyMDI2MTAwNi4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    city: 'Patna, Bihar (Nafis Colony)',
    role: 'Makhana Wetland & Eastern India Distribution',
    reach: 'Mithila Fox Nut Harvest + Eastern Regional Logistics',
    address: 'Nafis Colony, near Noor Plaza, Bari Path, Lalbagh, Patna, Bihar 800004',
    mapUrl: 'https://www.mappls.com/place-noor+plaza-bari+path-lalbagh-patna-bihar-800004-VOK1WN@zdata=MjUuNjE2MzI0Kzg1LjE3MDQxNysxNytWT0sxV04rKw==ed',
  },
]

