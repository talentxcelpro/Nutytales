// ─── Nutty Tales Business Supply — B2B Ingredients & Recurring Supply ─────────
// For businesses that make, serve, and gift: Hotels, Bakeries, Sweet Shops, Biscuit & Food Manufacturers

export interface IndustryProfile {
  id: string
  slug: string
  name: string
  tagline: string
  icon: string
  primaryProducts: string[]
  cutTypes: string[]
  typicalMonthlyKg: string
  useCases: string[]
  keyBenefits: string[]
  fssaiStandard: string
}

export const INDUSTRIES: IndustryProfile[] = [
  {
    id: 'ind-hotel',
    slug: 'hotels',
    name: 'Hotels & Hospitality',
    tagline: 'Breakfast buffets · gourmet kitchens · in-room minibar · banquets & VIP gifting',
    icon: '🏨',
    primaryProducts: ['California Almonds', 'W240 Cashews', 'Iranian Pistachios', 'Medjool Dates', 'Walnut Halves'],
    cutTypes: ['Whole Jumbo', 'Roasted & Salted (Mini Bar Packs)', 'Sliced for Buffet'],
    typicalMonthlyKg: '100 kg - 500 kg',
    useCases: ['Executive breakfast cereals & yoghurt bars', 'Bespoke turndown amenities', 'VIP banquet catering', 'Lobby café patisserie'],
    keyBenefits: ['Consistent HACCP & FSSAI batch testing', 'Vacuum sealed 500g & 1kg packs', 'Scheduled monthly delivery', 'Credit terms for 5-star chains'],
    fssaiStandard: 'FSSAI Central & NABL Lab Certified',
  },
  {
    id: 'ind-bakery',
    slug: 'bakeries',
    name: 'Bakeries & Artisanal Patisseries',
    tagline: 'Almonds · walnuts · pistachios · raisins · dates · sliced & blanched ingredients',
    icon: '🥐',
    primaryProducts: ['California Almonds', 'Kashmiri Walnuts', 'Afghan Green Raisins', 'Pistachio Kernels', 'Black Currants'],
    cutTypes: ['Slivered', 'Sliced / Flaked (0.8mm - 1.2mm)', 'Diced (3mm - 5mm)', 'Blanched Whole', 'Almond Flour (Fine Meal)'],
    typicalMonthlyKg: '250 kg - 2,000 kg',
    useCases: ['Croissant frangipane toppings', 'Sourdough walnut loaves', 'Plum cakes & stollen', 'Macarons & tea cakes', 'Biscotti & granola'],
    keyBenefits: ['Machine-sliced uniform thickness with zero dust', 'Moisture controlled < 5%', 'High-stability nitrogen-flushed 10kg tins/sacks', 'Pre-sorted zero shell fragments'],
    fssaiStandard: 'Direct Baker Ingredient Specification',
  },
  {
    id: 'ind-sweet',
    slug: 'sweet-shops',
    name: 'Sweet Shops & Mithai Manufacturers',
    tagline: 'Kaju katli · dry fruit barfi · laddoo · mawa sweets · festive gifting hampers',
    icon: '🍬',
    primaryProducts: ['W320 & W240 Cashews', 'Cashew Tukda (Splits & LWP)', 'Pampore Mongra Saffron', 'Pistachio Slivers', 'Chironji'],
    cutTypes: ['Whole Cashews', 'Splits (JH)', 'Pieces (LWP)', 'Pistachio Slivers (Pista Chipta)', 'Pure Saffron Filaments'],
    typicalMonthlyKg: '500 kg - 10,000 kg (Festive peak 25+ tons)',
    useCases: ['Ultra-smooth Kaju Katli paste', 'Pista roll fillings', 'Dodha barfi cashew crunch', 'Motichoor laddoo pistachio garnish', 'Festive corporate mithai boxes'],
    keyBenefits: ['Clean sorted white cashew splits with zero bitter kernel', 'Genuine crocin > 240 Kashmir saffron for rich yellow aroma', 'Bulk 25kg & 50kg vacuum bags', 'Guaranteed Diwali contract supply lock-in'],
    fssaiStandard: 'Agmark Grade 1 & FSSAI Certified',
  },
  {
    id: 'ind-biscuit',
    slug: 'biscuit-manufacturers',
    name: 'Biscuit & Cookie Manufacturers',
    tagline: 'Bulk ingredients · uniform mechanical cuts · recurring supply contracts',
    icon: '🍪',
    primaryProducts: ['California Almond Dices', 'Cashew Dices', 'Seedless Raisins', 'Desi Ghee Makhana Powder'],
    cutTypes: ['Diced 3mm - 6mm', 'Coarse Chopped', 'Fine Nut Meal', 'Sorted Seedless Raisins'],
    typicalMonthlyKg: '1,000 kg - 20,000 kg',
    useCases: ['Nut butter cookies', 'Digestive biscuits with seed mixes', 'Dry fruit cake rusks', 'Artisan biscotti lines'],
    keyBenefits: ['Optical sorted for zero stone/foreign matter', 'Continuous multi-ton delivery schedule', 'Fixed quarterly/annual raw material pricing', 'COA (Certificate of Analysis) with every batch'],
    fssaiStandard: 'Industrial Food Safety Standard ISO 22000',
  },
  {
    id: 'ind-confectionery',
    slug: 'confectionery',
    name: 'Chocolate & Confectionery Brands',
    tagline: 'Pistachios · whole roasted hazelnuts · almonds · cranberries · dates',
    icon: '🍫',
    primaryProducts: ['Dry Roasted Almonds', 'Salted Pistachio Kernels', 'Turkish Hazelnuts', 'Medjool Date Paste'],
    cutTypes: ['Whole Dry Roasted', 'Caramelized Praline Nibs', 'Nut Pastes & Pralines'],
    typicalMonthlyKg: '500 kg - 5,000 kg',
    useCases: ['Bean-to-bar dark chocolate nut inclusions', 'Pralines & bonbons', 'Energy date bites', 'Artisanal spreads'],
    keyBenefits: ['Even internal roasting with zero burnt bitterness', 'Microbiologically tested', 'Customizable roast profile (Light / Medium / Deep)'],
    fssaiStandard: 'Confectionery Grade Quality Assurance',
  },
  {
    id: 'ind-food-mfg',
    slug: 'food-manufacturers',
    name: 'D2C Brands, Granola & Cereal Manufacturers',
    tagline: 'Makhana ingredients · super seed blends · trail mix contract packing',
    icon: '🥣',
    primaryProducts: ['Mithila Phool Makhana Jumbo (6+ Suta)', 'Chia Seeds', 'Pumpkin Seeds', 'Sunflower Seeds', 'Kashmiri Walnuts'],
    cutTypes: ['Whole Graded', 'Sorted Seeds', 'Custom Trail Mix Formulations'],
    typicalMonthlyKg: '1,000 kg - 15,000 kg',
    useCases: ['High-protein breakfast granolas', 'Flavoured roasted makhana pouches', 'Keto nut butter blends', 'Meal replacement smoothies'],
    keyBenefits: ['Direct origin farm aggregation in Bihar & Kashmir', 'Custom bulk blending under certified cleanroom', 'Private label ready sacks & bulk cartons'],
    fssaiStandard: 'Export Quality & FSSAI Central',
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
    city: 'Noida / Delhi NCR',
    role: 'Central Processing & Rapid B2B Dispatch',
    reach: 'Delhi NCR, Punjab, Haryana, Rajasthan, Western UP (Same-Day / Next-Day Delivery)',
    address: 'Sector 62, Noida, Uttar Pradesh',
  },
  {
    city: 'Srinagar, Kashmir',
    role: 'Direct Valley Farm Aggregation',
    reach: 'Kashmiri Walnuts, Kagzi Badam, Pampore Saffron & Acacia Honey Sourcing',
    address: 'Boulevard Road & Industrial Estate, Srinagar, J&K',
  },
  {
    city: 'Patna, Bihar',
    role: 'Makhana Wetland & Eastern India Distribution',
    reach: 'Darbhanga & Madhubani Fox Nut Harvest + Eastern Regional Logistics',
    address: 'Patna Industrial Area, Bihar',
  },
]
