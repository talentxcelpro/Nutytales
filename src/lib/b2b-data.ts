// ─── Nuty Tales Business Supply — B2B Commodities & Wholesale Engine ─────────
// Dedicated to business.nutytales.com wholesale procurement portal

export interface B2BCommodity {
  id: string
  name: string
  code: string
  category: 'Tree Nuts' | 'Saffron' | 'Makhana' | 'Dried Fruits' | 'Seeds & Honey'
  origin: string
  grade: string
  moisture: string
  packaging: string[]
  cuts: string[]
  moqKg: number
  tierPrices: {
    tier1: { minKg: number; maxKg: number; pricePerKg: number; label: string }
    tier2: { minKg: number; maxKg: number; pricePerKg: number; label: string; savingsPercent: number }
    tier3: { minKg: number; maxKg: number; pricePerKg: number; label: string; savingsPercent: number }
    container: { minKg: number; pricePerKg: number; label: string; savingsPercent: number }
  }
  inStockKg: number
  dispatchHub: string
  gstPercent: number
  hsnCode: string
  featured?: boolean
}

export const B2B_COMMODITIES: B2BCommodity[] = [
  {
    id: 'kashmiri-mamra-almonds',
    name: 'Kashmiri Mamra Almonds (Giri)',
    code: 'NT-B2B-MAMRA-01',
    category: 'Tree Nuts',
    origin: 'Pulwama & Shopian, Kashmir',
    grade: 'Single Tree Harvest · High Oil Content (>52%)',
    moisture: '< 4.2%',
    packaging: ['25kg Multi-Layer Vacuum Sack', '10kg Nitrogen Tin', 'Private-Label 250g Pouch'],
    cuts: ['Whole Giri (100% Intact)', 'Coarse Halves'],
    moqKg: 25,
    tierPrices: {
      tier1: { minKg: 25, maxKg: 99, pricePerKg: 2450, label: 'Starter Lot (25-99 kg)' },
      tier2: { minKg: 100, maxKg: 499, pricePerKg: 2280, label: 'Wholesale Tier (100-499 kg)', savingsPercent: 7 },
      tier3: { minKg: 500, maxKg: 2499, pricePerKg: 2150, label: 'Commercial Bulk (500-2499 kg)', savingsPercent: 12 },
      container: { minKg: 2500, pricePerKg: 2020, label: 'Container Run (2.5 MT+)', savingsPercent: 18 },
    },
    inStockKg: 14500,
    dispatchHub: 'Kashmir Valley & Noida Hub',
    gstPercent: 5,
    hsnCode: '08021200',
    featured: true,
  },
  {
    id: 'california-almonds-independence',
    name: 'California Almonds (Independence / Nonpareil)',
    code: 'NT-B2B-ALM-CAL-23',
    category: 'Tree Nuts',
    origin: 'Central Valley, California, USA',
    grade: 'Extra No. 1 · Size 23/25 Count',
    moisture: '< 4.8%',
    packaging: ['25kg Standard Box', '25kg Vacuum Poly Liner', 'Private-Label 500g Bag'],
    cuts: ['Whole Jumbo', 'Sliced 0.8–1.2mm', 'Slivered', 'Diced 3–5mm', 'Almond Meal / Flour'],
    moqKg: 50,
    tierPrices: {
      tier1: { minKg: 50, maxKg: 199, pricePerKg: 780, label: '50-199 kg' },
      tier2: { minKg: 200, maxKg: 999, pricePerKg: 720, label: '200-999 kg', savingsPercent: 8 },
      tier3: { minKg: 1000, maxKg: 4999, pricePerKg: 670, label: '1 - 5 MT', savingsPercent: 14 },
      container: { minKg: 5000, pricePerKg: 635, label: 'Full Container (5 MT+)', savingsPercent: 19 },
    },
    inStockKg: 48000,
    dispatchHub: 'Noida HQ Central Processing',
    gstPercent: 5,
    hsnCode: '08021200',
    featured: true,
  },
  {
    id: 'kashmiri-kagzi-walnut-halves',
    name: 'Kashmiri Kagzi Walnut Kernels (Akhrot Giri)',
    code: 'NT-B2B-WAL-KAG-01',
    category: 'Tree Nuts',
    origin: 'Uri & Kupwara, Kashmir',
    grade: 'Extra Light Snow-White Halves (80%+ Halves)',
    moisture: '< 4.5%',
    packaging: ['10kg Nitrogen-Flushed Tin', '20kg Vacuum Corrugated Box'],
    cuts: ['Extra Light Halves (80%)', 'Light Halves & Quarters (LH&Q)', 'Bakery Broken Pieces (LWP)'],
    moqKg: 20,
    tierPrices: {
      tier1: { minKg: 20, maxKg: 99, pricePerKg: 1250, label: '20-99 kg' },
      tier2: { minKg: 100, maxKg: 499, pricePerKg: 1150, label: '100-499 kg', savingsPercent: 8 },
      tier3: { minKg: 500, maxKg: 1999, pricePerKg: 1080, label: '500-1999 kg', savingsPercent: 14 },
      container: { minKg: 2000, pricePerKg: 990, label: 'Pallet / Truckload (2 MT+)', savingsPercent: 21 },
    },
    inStockKg: 22000,
    dispatchHub: 'Kashmir Valley & Noida Hub',
    gstPercent: 5,
    hsnCode: '08023200',
    featured: true,
  },
  {
    id: 'kashmir-super-mongra-saffron',
    name: 'Royal Kashmiri Mongra Saffron (Kesar)',
    code: 'NT-B2B-SAF-MNG-01',
    category: 'Saffron',
    origin: 'Pampore Plateau, Kashmir (GI Tag Certified)',
    grade: 'Grade 1 Super Mongra · Crocin > 240 · Safranal > 38',
    moisture: '< 8.0%',
    packaging: ['100g Airtight Glass Carafes', '500g Food-Grade Nitrogen Jar', '1kg Commercial Sealed Tin'],
    cuts: ['Whole Deep Red Filaments (Pure Stigma Only - Zero Style)'],
    moqKg: 0.1, // 100g
    tierPrices: {
      tier1: { minKg: 0.1, maxKg: 0.49, pricePerKg: 320000, label: '100g - 499g (₹320/g)' },
      tier2: { minKg: 0.5, maxKg: 1.99, pricePerKg: 285000, label: '500g - 1.99kg (₹285/g)', savingsPercent: 11 },
      tier3: { minKg: 2.0, maxKg: 4.99, pricePerKg: 260000, label: '2kg - 4.99kg (₹260/g)', savingsPercent: 19 },
      container: { minKg: 5.0, pricePerKg: 240000, label: '5kg+ Bulk Lot (₹240/g)', savingsPercent: 25 },
    },
    inStockKg: 180,
    dispatchHub: 'Srinagar / Noida Vault',
    gstPercent: 5,
    hsnCode: '09102010',
    featured: true,
  },
  {
    id: 'cashews-w240-king-jumbo',
    name: 'Cashew Kernels W240 (King Jumbo)',
    code: 'NT-B2B-CSH-W240',
    category: 'Tree Nuts',
    origin: 'Goa & Coastal Karnataka',
    grade: 'White Whole 240 Count / lb',
    moisture: '< 5.0%',
    packaging: ['10kg Tin Vacuum Sealed', '25kg Vacuum Liner Sacks'],
    cuts: ['Whole King Jumbo', 'Cashew Splits (JH)', 'Cashew Pieces (LWP for Gravies)'],
    moqKg: 25,
    tierPrices: {
      tier1: { minKg: 25, maxKg: 99, pricePerKg: 890, label: '25-99 kg' },
      tier2: { minKg: 100, maxKg: 499, pricePerKg: 820, label: '100-499 kg', savingsPercent: 8 },
      tier3: { minKg: 500, maxKg: 2499, pricePerKg: 760, label: '500-2499 kg', savingsPercent: 15 },
      container: { minKg: 2500, pricePerKg: 710, label: 'Container Run (2.5 MT+)', savingsPercent: 20 },
    },
    inStockKg: 35000,
    dispatchHub: 'Noida HQ Central Hub',
    gstPercent: 5,
    hsnCode: '08013210',
    featured: true,
  },
  {
    id: 'phool-makhana-jumbo-6-sutra',
    name: 'Phool Makhana Jumbo (Fox Nuts 6+ Sutra)',
    code: 'NT-B2B-MAK-6SUT',
    category: 'Makhana',
    origin: 'Darbhanga & Madhubani, Bihar',
    grade: 'Hand-Graded 6+ Sutra · Super Jumbo Puff',
    moisture: '< 7.5%',
    packaging: ['10kg Corrugated Carton with Poly Barrier', '25kg Gunny Bale'],
    cuts: ['Whole Jumbo Round Puffs', 'Roasted & Desi Ghee Popped', 'Makhana Meal'],
    moqKg: 20,
    tierPrices: {
      tier1: { minKg: 20, maxKg: 99, pricePerKg: 840, label: '20-99 kg' },
      tier2: { minKg: 100, maxKg: 499, pricePerKg: 760, label: '100-499 kg', savingsPercent: 10 },
      tier3: { minKg: 500, maxKg: 2499, pricePerKg: 690, label: '500-2499 kg', savingsPercent: 18 },
      container: { minKg: 2500, pricePerKg: 630, label: 'Truckload (2.5 MT+)', savingsPercent: 25 },
    },
    inStockKg: 28000,
    dispatchHub: 'Patna / Bihar & Noida Hub',
    gstPercent: 5,
    hsnCode: '19041090',
    featured: true,
  },
  {
    id: 'afghan-green-raisins-kishmish',
    name: 'Afghan Seedless Green Raisins (Kishmish)',
    code: 'NT-B2B-RAIS-AFG',
    category: 'Dried Fruits',
    origin: 'Kandahar, Afghanistan',
    grade: 'Extra Long AAA Grade Seedless',
    moisture: '< 14.0%',
    packaging: ['10kg Export Carton with Liner', '25kg Poly Woven Sacks'],
    cuts: ['Whole Seedless Long Green'],
    moqKg: 50,
    tierPrices: {
      tier1: { minKg: 50, maxKg: 199, pricePerKg: 460, label: '50-199 kg' },
      tier2: { minKg: 200, maxKg: 999, pricePerKg: 410, label: '200-999 kg', savingsPercent: 11 },
      tier3: { minKg: 1000, maxKg: 4999, pricePerKg: 370, label: '1 - 5 MT', savingsPercent: 20 },
      container: { minKg: 5000, pricePerKg: 335, label: 'Container (5 MT+)', savingsPercent: 27 },
    },
    inStockKg: 32000,
    dispatchHub: 'Noida HQ Central Hub',
    gstPercent: 5,
    hsnCode: '08062010',
  },
  {
    id: 'afghani-anjeer-jumbo-figs',
    name: 'Afghani Dried Figs (Anjeer Jumbo Garland)',
    code: 'NT-B2B-FIG-AFG-01',
    category: 'Dried Fruits',
    origin: 'Kandahar & Zabul, Afghanistan',
    grade: '101 Grade Jumbo Blonde Disc Garland',
    moisture: '< 16.0%',
    packaging: ['10kg Wooden Master Crate', '15kg Lined Export Carton'],
    cuts: ['Whole Garland Discs', 'Diced Figs for Bakery'],
    moqKg: 30,
    tierPrices: {
      tier1: { minKg: 30, maxKg: 99, pricePerKg: 1480, label: '30-99 kg' },
      tier2: { minKg: 100, maxKg: 499, pricePerKg: 1350, label: '100-499 kg', savingsPercent: 9 },
      tier3: { minKg: 500, maxKg: 1999, pricePerKg: 1240, label: '500-1999 kg', savingsPercent: 16 },
      container: { minKg: 2000, pricePerKg: 1140, label: 'Pallet Run (2 MT+)', savingsPercent: 23 },
    },
    inStockKg: 19000,
    dispatchHub: 'Noida HQ Central Hub',
    gstPercent: 5,
    hsnCode: '08042000',
  },
  {
    id: 'iranian-super-long-pistachios',
    name: 'Iranian Pistachios (Akbari / Ahmad Aghaei)',
    code: 'NT-B2B-PIS-IRN-01',
    category: 'Tree Nuts',
    origin: 'Rafsanjan, Iran',
    grade: 'Naturally Open Shell · Extra Long 22/24',
    moisture: '< 5.0%',
    packaging: ['25kg Heavy Duty Jute Sack with Liner', '10kg Vacuum Bags'],
    cuts: ['Roasted & Lightly Salted In-Shell', 'Raw Kernels', 'Slivered (Pista Chipta for Mithai)'],
    moqKg: 25,
    tierPrices: {
      tier1: { minKg: 25, maxKg: 99, pricePerKg: 1380, label: '25-99 kg' },
      tier2: { minKg: 100, maxKg: 499, pricePerKg: 1270, label: '100-499 kg', savingsPercent: 8 },
      tier3: { minKg: 500, maxKg: 1999, pricePerKg: 1180, label: '500-1999 kg', savingsPercent: 14 },
      container: { minKg: 2000, pricePerKg: 1090, label: 'Container (2 MT+)', savingsPercent: 21 },
    },
    inStockKg: 24000,
    dispatchHub: 'Noida HQ Central Hub',
    gstPercent: 5,
    hsnCode: '08025100',
  },
]

export interface B2BHub {
  id: string
  name: string
  state: string
  address: string
  role: string
  transitDays: Record<string, string>
}

export const B2B_HUBS: B2BHub[] = [
  {
    id: 'hub-noida',
    name: 'Noida Central Processing & NCR Fulfillment Hub',
    state: 'Uttar Pradesh (Delhi NCR)',
    address: 'Noida Sector 63 / Greater Noida Logistics Corridor, UP 201301',
    role: 'Central mechanical cutting, optical sorting, nitro packaging & PAN-India dispatch',
    transitDays: {
      'Delhi NCR': 'Same Day / 24h',
      'Punjab / Haryana': '24 - 48h',
      'Mumbai / Pune': '48 - 72h',
      'Bengaluru / Chennai': '3 - 4 Days',
      'Kolkata / East': '3 - 4 Days',
    },
  },
  {
    id: 'hub-kashmir',
    name: 'Kashmir Valley Orchard Aggregation Center',
    state: 'Jammu & Kashmir',
    address: 'Pampore National Highway Corridor, Pulwama / Srinagar, J&K 192121',
    role: 'Direct orchard walnut hulling, Mamra almond sorting & GI Saffron lab testing',
    transitDays: {
      'Srinagar / J&K': 'Same Day',
      'Noida Hub': '36 - 48h (Direct Reefer Transit)',
      'Chandigarh': '48h',
    },
  },
  {
    id: 'hub-patna',
    name: 'Patna / Mithila Makhana Aggregation Depot',
    state: 'Bihar',
    address: 'Anisabad Logistics Industrial Area, Patna, Bihar 800002',
    role: 'Direct wetland lotus seed collection, grading (6+ sutra) and eastern regional shipments',
    transitDays: {
      'Bihar / Jharkhand': '24h',
      'Kolkata / WB': '24 - 36h',
      'Noida Central Hub': '48h',
    },
  },
]

export const B2B_NAV_LINKS = [
  { label: 'Overview', href: '/' },
  { label: 'B2B Catalog', href: '/catalog', badge: 'Live Rates' },
  { label: 'RFQ Terminal', href: '/rfq', badge: 'Instant Freight' },
  { label: 'Quotes', href: '/quotes' },
  { label: 'Orders & POs', href: '/orders' },
  { label: 'Replenishment', href: '/replenishment', badge: 'Contracts' },
  { label: 'CEO Dashboard', href: '/dashboard', badge: 'KPIs' },
  { label: 'Business Account', href: '/account' },
]
