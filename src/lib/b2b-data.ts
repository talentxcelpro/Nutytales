// ─── Nuty Tales Business Supply — B2B Commodities & Wholesale Engine ─────────
// Dedicated to business.nutytales.com wholesale procurement platform

export interface SupplierProfile {
  id: string
  name: string
  type: 'Direct Grower Co-op' | 'Primary Processor' | 'Direct Importer' | 'Aggregator'
  location: string
  fssaiNumber: string
  gstinVerified: boolean
  physicalAuditStatus: 'Audited & Verified' | 'Audit in Progress'
  fulfillmentRate: string
  rating: number
  leadTimeDays: number
  annualCapacity: string
}

export interface QualityPassport {
  lotNumber: string
  harvestSeason: string
  labCertification: 'NABL Certified' | 'GI Tagged & NABL Tested' | 'Export Grade Tested' | 'FSSAI Standard'
  aflatoxinPpb: string
  purityPercent: string
  moistureContent: string
  oilContent?: string
  lastTestedDate: string
  coaAvailable: boolean
}

export interface PriceConfidence {
  status: 'Confirmed Spot Rate' | 'Indicative Supplier Quote'
  lastConfirmedHoursAgo: number
  validityDays: number
  confidenceScore: number // 0-100
}

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
  supplier?: SupplierProfile
  qualityPassport?: QualityPassport
  priceConfidence?: PriceConfidence
  suggestedAlternatives?: string[]
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
    supplier: {
      id: 'sup-kashmir-mamra',
      name: 'Kashmir Valley Orchard Federation',
      type: 'Direct Grower Co-op',
      location: 'Pulwama / Shopian, J&K',
      fssaiNumber: '11024001000492',
      gstinVerified: true,
      physicalAuditStatus: 'Audited & Verified',
      fulfillmentRate: '99.4% On-Time',
      rating: 4.9,
      leadTimeDays: 2,
      annualCapacity: '120 MT',
    },
    qualityPassport: {
      lotNumber: 'LOT-KMR-MAMRA-2026-A1',
      harvestSeason: 'Autumn 2025/2026 Season',
      labCertification: 'NABL Certified',
      aflatoxinPpb: '< 1.0 ppb (Compliant)',
      purityPercent: '99.85%',
      moistureContent: '3.9%',
      oilContent: '53.8% Pure Almond Oil',
      lastTestedDate: '06 Oct 2026',
      coaAvailable: true,
    },
    priceConfidence: {
      status: 'Confirmed Spot Rate',
      lastConfirmedHoursAgo: 2,
      validityDays: 7,
      confidenceScore: 98,
    },
    suggestedAlternatives: ['california-almonds-independence'],
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
    supplier: {
      id: 'sup-central-valley',
      name: 'Pacific Almond Aggregation & Import Terminal',
      type: 'Direct Importer',
      location: 'JNPT / Noida Cold Chain Port',
      fssaiNumber: '10021011000219',
      gstinVerified: true,
      physicalAuditStatus: 'Audited & Verified',
      fulfillmentRate: '98.8% On-Time',
      rating: 4.8,
      leadTimeDays: 1,
      annualCapacity: '650 MT',
    },
    qualityPassport: {
      lotNumber: 'LOT-CAL-IND-26-88B',
      harvestSeason: 'California New Crop 2025/2026',
      labCertification: 'NABL Certified',
      aflatoxinPpb: '< 1.5 ppb (US & FSSAI Compliant)',
      purityPercent: '99.9%',
      moistureContent: '4.4%',
      oilContent: '49.5%',
      lastTestedDate: '10 Oct 2026',
      coaAvailable: true,
    },
    priceConfidence: {
      status: 'Confirmed Spot Rate',
      lastConfirmedHoursAgo: 1,
      validityDays: 5,
      confidenceScore: 99,
    },
    suggestedAlternatives: ['kashmiri-mamra-almonds'],
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
    supplier: {
      id: 'sup-kashmir-walnut',
      name: 'North Kashmir Agro Producers Guild',
      type: 'Direct Grower Co-op',
      location: 'Kupwara / Baramulla, J&K',
      fssaiNumber: '11023002000812',
      gstinVerified: true,
      physicalAuditStatus: 'Audited & Verified',
      fulfillmentRate: '99.1% On-Time',
      rating: 4.9,
      leadTimeDays: 2,
      annualCapacity: '180 MT',
    },
    qualityPassport: {
      lotNumber: 'LOT-KMR-WAL-26-09C',
      harvestSeason: 'Fresh Autumn Harvest 2025/2026',
      labCertification: 'NABL Certified',
      aflatoxinPpb: 'Not Detected (< 0.5 ppb)',
      purityPercent: '99.7%',
      moistureContent: '4.1%',
      oilContent: '64.0% Omega-3 Rich',
      lastTestedDate: '08 Oct 2026',
      coaAvailable: true,
    },
    priceConfidence: {
      status: 'Confirmed Spot Rate',
      lastConfirmedHoursAgo: 3,
      validityDays: 7,
      confidenceScore: 97,
    },
    suggestedAlternatives: ['kashmiri-mamra-almonds'],
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
    supplier: {
      id: 'sup-pampore-saffron',
      name: 'Pampore GI Saffron Cultivators Society',
      type: 'Direct Grower Co-op',
      location: 'Pampore Plateau, Pulwama, J&K',
      fssaiNumber: '11024002000301',
      gstinVerified: true,
      physicalAuditStatus: 'Audited & Verified',
      fulfillmentRate: '100% On-Time',
      rating: 5.0,
      leadTimeDays: 1,
      annualCapacity: '1.2 MT',
    },
    qualityPassport: {
      lotNumber: 'LOT-GI-SAF-PAMPORE-26',
      harvestSeason: 'November 2025 Reserve Lot',
      labCertification: 'GI Tagged & NABL Tested',
      aflatoxinPpb: 'Nil',
      purityPercent: '100% All-Red Stigma',
      moistureContent: '6.8%',
      oilContent: 'Crocin 252 · Safranal 41.2',
      lastTestedDate: '12 Oct 2026',
      coaAvailable: true,
    },
    priceConfidence: {
      status: 'Confirmed Spot Rate',
      lastConfirmedHoursAgo: 4,
      validityDays: 10,
      confidenceScore: 100,
    },
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
    supplier: {
      id: 'sup-coastal-cashews',
      name: 'Konkan Coast Cashew Processors Consortium',
      type: 'Primary Processor',
      location: 'Mangalore / Goa Industrial Corridor',
      fssaiNumber: '11222333000541',
      gstinVerified: true,
      physicalAuditStatus: 'Audited & Verified',
      fulfillmentRate: '98.5% On-Time',
      rating: 4.8,
      leadTimeDays: 2,
      annualCapacity: '400 MT',
    },
    qualityPassport: {
      lotNumber: 'LOT-CSH-W240-2026-K1',
      harvestSeason: 'Spring 2026 Indian Crop',
      labCertification: 'NABL Certified',
      aflatoxinPpb: '< 1.1 ppb',
      purityPercent: '99.8%',
      moistureContent: '4.6%',
      oilContent: '46.8%',
      lastTestedDate: '09 Oct 2026',
      coaAvailable: true,
    },
    priceConfidence: {
      status: 'Confirmed Spot Rate',
      lastConfirmedHoursAgo: 2,
      validityDays: 5,
      confidenceScore: 98,
    },
    suggestedAlternatives: ['california-almonds-independence'],
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
    supplier: {
      id: 'sup-mithila-makhana',
      name: 'Mithila Lotus Agro Producer Company',
      type: 'Direct Grower Co-op',
      location: 'Darbhanga / Madhubani, Bihar',
      fssaiNumber: '10423001000189',
      gstinVerified: true,
      physicalAuditStatus: 'Audited & Verified',
      fulfillmentRate: '99.0% On-Time',
      rating: 4.9,
      leadTimeDays: 2,
      annualCapacity: '250 MT',
    },
    qualityPassport: {
      lotNumber: 'LOT-MAK-6SUT-26-04D',
      harvestSeason: 'Monsoon 2026 Fresh Puffs',
      labCertification: 'NABL Certified',
      aflatoxinPpb: 'Not Detected',
      purityPercent: '99.5% Hard Shell Free',
      moistureContent: '6.9%',
      oilContent: 'Low Fat (< 0.2%) · High Protein 9.7%',
      lastTestedDate: '11 Oct 2026',
      coaAvailable: true,
    },
    priceConfidence: {
      status: 'Confirmed Spot Rate',
      lastConfirmedHoursAgo: 1,
      validityDays: 7,
      confidenceScore: 99,
    },
    suggestedAlternatives: ['cashews-w240-king-jumbo'],
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
    supplier: {
      id: 'sup-afghan-raisins',
      name: 'Kandahar Sun-Dried Fruit Exporters',
      type: 'Direct Importer',
      location: 'Attari Border / Noida Central Depot',
      fssaiNumber: '10023011000954',
      gstinVerified: true,
      physicalAuditStatus: 'Audited & Verified',
      fulfillmentRate: '97.9% On-Time',
      rating: 4.7,
      leadTimeDays: 2,
      annualCapacity: '300 MT',
    },
    qualityPassport: {
      lotNumber: 'LOT-AFG-RAIS-26-11',
      harvestSeason: 'Autumn 2025/2026 Lot',
      labCertification: 'Export Grade Tested',
      aflatoxinPpb: '< 1.8 ppb',
      purityPercent: '99.4%',
      moistureContent: '13.2%',
      lastTestedDate: '04 Oct 2026',
      coaAvailable: true,
    },
    priceConfidence: {
      status: 'Confirmed Spot Rate',
      lastConfirmedHoursAgo: 5,
      validityDays: 5,
      confidenceScore: 95,
    },
    suggestedAlternatives: ['afghani-anjeer-jumbo-figs'],
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
    supplier: {
      id: 'sup-zabul-figs',
      name: 'Zabul Valley Horticulture Guild',
      type: 'Direct Importer',
      location: 'Noida Central Depot',
      fssaiNumber: '10023011000954',
      gstinVerified: true,
      physicalAuditStatus: 'Audited & Verified',
      fulfillmentRate: '98.2% On-Time',
      rating: 4.8,
      leadTimeDays: 2,
      annualCapacity: '150 MT',
    },
    qualityPassport: {
      lotNumber: 'LOT-FIG-AFG-26-7A',
      harvestSeason: 'Late Summer 2025/2026',
      labCertification: 'Export Grade Tested',
      aflatoxinPpb: '< 1.4 ppb',
      purityPercent: '99.6%',
      moistureContent: '15.1%',
      lastTestedDate: '07 Oct 2026',
      coaAvailable: true,
    },
    priceConfidence: {
      status: 'Confirmed Spot Rate',
      lastConfirmedHoursAgo: 6,
      validityDays: 7,
      confidenceScore: 96,
    },
    suggestedAlternatives: ['afghan-green-raisins-kishmish'],
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
    supplier: {
      id: 'sup-rafsanjan-pista',
      name: 'Rafsanjan Pistachio Growers Trading House',
      type: 'Direct Importer',
      location: 'Nhava Sheva / Noida Cold Storage',
      fssaiNumber: '10022011000678',
      gstinVerified: true,
      physicalAuditStatus: 'Audited & Verified',
      fulfillmentRate: '98.9% On-Time',
      rating: 4.9,
      leadTimeDays: 2,
      annualCapacity: '280 MT',
    },
    qualityPassport: {
      lotNumber: 'LOT-IRN-PIS-26-03',
      harvestSeason: 'Autumn 2025/2026 Batch',
      labCertification: 'NABL Certified',
      aflatoxinPpb: '< 1.0 ppb (Strict EU & FSSAI Standards)',
      purityPercent: '99.9%',
      moistureContent: '4.5%',
      oilContent: '52.1%',
      lastTestedDate: '05 Oct 2026',
      coaAvailable: true,
    },
    priceConfidence: {
      status: 'Confirmed Spot Rate',
      lastConfirmedHoursAgo: 2,
      validityDays: 5,
      confidenceScore: 98,
    },
    suggestedAlternatives: ['cashews-w240-king-jumbo'],
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

export interface BuyerPersona {
  id: string
  role: string
  whatTheyNeed: string
  nutyTalesOffer: string
  typicalMoq: string
  keyBenefit: string
  icon: string
}

export const BUYER_PERSONAS: BuyerPersona[] = [
  {
    id: 'small-retailer',
    role: 'Small Retailer & Grocery',
    whatTheyNeed: 'Low initial commitment & fresh inventory',
    nutyTalesOffer: 'Smaller wholesale lots (20-50 kg) & pre-tested sample kits',
    typicalMoq: '20 - 50 kg',
    keyBenefit: 'Preserve working capital without paying retail distributor markups',
    icon: '🏪',
  },
  {
    id: 'wholesaler',
    role: 'Wholesaler or Distributor',
    whatTheyNeed: 'Better gross margins & repeat availability',
    nutyTalesOffer: 'Tiered volume pricing, container/truckload runs & repeat contracts',
    typicalMoq: '1,000 - 5,000 kg',
    keyBenefit: 'Guaranteed supply allocations with predictable price locks',
    icon: '🚛',
  },
  {
    id: 'horeca',
    role: 'Hotel, Restaurant or Bakery (HORECA)',
    whatTheyNeed: 'Consistent mechanical cuts & zero rancidity',
    nutyTalesOffer: 'Precision sliced, slivered & diced cuts with recurring deliveries',
    typicalMoq: '100 - 500 kg',
    keyBenefit: 'Zero kitchen prep labor + certified moisture specs for baking stability',
    icon: '🥐',
  },
  {
    id: 'private-label',
    role: 'D2C or Private-Label Brand',
    whatTheyNeed: 'Turnkey product sourcing & custom packaging',
    nutyTalesOffer: 'Custom pouch sizes, nitrogen tins, label specifications & co-packing',
    typicalMoq: '250 - 1,000 kg',
    keyBenefit: 'Launch consumer brand SKUs with certified lab COA on back-of-pack',
    icon: '🏷️',
  },
  {
    id: 'corporate',
    role: 'Corporate Gifting Buyer',
    whatTheyNeed: 'Multiple commodities & predictable fulfilment',
    nutyTalesOffer: 'Consolidated multi-SKU quotation, business invoicing & pan-India logistics',
    typicalMoq: '50 - 500 kg',
    keyBenefit: '100% GST input tax credit + premium aesthetic packaging',
    icon: '🎁',
  },
  {
    id: 'international',
    role: 'International Importer',
    whatTheyNeed: 'Export documentation & freight clarity',
    nutyTalesOffer: 'Export-ready phytosanitary certificates, Incoterms (FOB/CIF) & port stuffing',
    typicalMoq: '2,500 - 10,000 kg',
    keyBenefit: 'Direct Indian-origin supply with complete origin provenance proof',
    icon: '🌐',
  },
]

export const B2B_NAV_LINKS = [
  { label: 'Products', href: '/catalog', badge: 'Live Rates' },
  { label: 'Suppliers', href: '/#suppliers' },
  { label: 'Categories', href: '/#categories' },
  { label: 'RFQ Comparison', href: '/rfq', badge: 'Instant Freight' },
  { label: 'Orders', href: '/orders' },
  { label: 'Procurement Desk', href: '/replenishment', badge: 'White Glove' },
]
