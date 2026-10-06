// ─── Nutty Tales Dynamic Warehouse & Inventory Allocation Engine ──────────────
// Multi-warehouse tracking across Noida (HQ), Srinagar (Valley), and Patna (Bihar)

export type WarehouseCode = 'NOIDA' | 'SRINAGAR' | 'PATNA'

export interface WarehouseLocation {
  code: WarehouseCode
  name: string
  city: string
  state: string
  pincodePrefixes: string[] // Regional fast delivery
  capabilities: string[]
  dispatchLeadHours: number
}

export const WAREHOUSES: Record<WarehouseCode, WarehouseLocation> = {
  NOIDA: {
    code: 'NOIDA',
    name: 'Noida Central Distribution & Processing Hub',
    city: 'Noida',
    state: 'Uttar Pradesh (Delhi NCR)',
    pincodePrefixes: ['11', '12', '13', '20', '24', '30'], // Delhi NCR, UP, Haryana, Rajasthan
    capabilities: [
      'Central E-commerce Dispatch',
      'Corporate Hamper Laser & Foil Personalization',
      'B2B Slicing & Dicing Cleanroom',
      'Pan-India Air & Surface Freight Aggregation',
    ],
    dispatchLeadHours: 12,
  },
  SRINAGAR: {
    code: 'SRINAGAR',
    name: 'Srinagar Valley Farm & Craft Hub',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    pincodePrefixes: ['19'], // Kashmir Valley
    capabilities: [
      'Direct Farm Gate Walnut & Badam Sorting',
      'Pampore Saffron Grade A1 GI Testing',
      'Raw Acacia & Sidr Honey Cold Extraction',
      'Master Artisan Loom & Craft Guild Inspection',
    ],
    dispatchLeadHours: 24,
  },
  PATNA: {
    code: 'PATNA',
    name: 'Patna Eastern Distribution & Makhana Hub',
    city: 'Patna',
    state: 'Bihar',
    pincodePrefixes: ['80', '81', '82', '84', '85'], // Bihar, Jharkhand, Eastern UP
    capabilities: [
      'Direct Mithila Fox Nut (Makhana) Aggregation',
      'Puffed Makhana 6+ Suta Grading',
      'Eastern India Regional B2B Supply',
    ],
    dispatchLeadHours: 24,
  },
}

export interface StockAllocation {
  sku: string
  totalInventoryKg: number
  warehouseDistribution: Record<WarehouseCode, number> // kg per warehouse
  minOrderKg: number
  reorderLevelKg: number
  batchCode: string
  harvestDate: string
  qcTestDate: string
  labReportNo: string
}

// ── Live Simulated Warehouse Inventory Registry ────────────────────────────────
export const INVENTORY_REGISTRY: Record<string, StockAllocation> = {
  'california-almonds-premium': {
    sku: 'NT-ALM-001',
    totalInventoryKg: 4850,
    warehouseDistribution: { NOIDA: 3400, SRINAGAR: 450, PATNA: 1000 },
    minOrderKg: 0.25,
    reorderLevelKg: 500,
    batchCode: 'CAL-2026-B81',
    harvestDate: 'August 2026',
    qcTestDate: 'September 2026',
    labReportNo: 'NABL-NT-ALM-9942',
  },
  'mamra-almonds-kashmiri-badam': {
    sku: 'NT-ALM-002',
    totalInventoryKg: 1240,
    warehouseDistribution: { NOIDA: 420, SRINAGAR: 750, PATNA: 70 },
    minOrderKg: 0.25,
    reorderLevelKg: 150,
    batchCode: 'MAM-KSH-2026-A1',
    harvestDate: 'September 2026',
    qcTestDate: 'October 2026',
    labReportNo: 'NABL-NT-MAM-1049',
  },
  'kashmiri-kagzi-badam-soft-shell': {
    sku: 'NT-ALM-004',
    totalInventoryKg: 2150,
    warehouseDistribution: { NOIDA: 650, SRINAGAR: 1350, PATNA: 150 },
    minOrderKg: 0.25,
    reorderLevelKg: 300,
    batchCode: 'KAG-BAD-2026-V1',
    harvestDate: 'September 2026',
    qcTestDate: 'October 2026',
    labReportNo: 'NABL-NT-KGB-8841',
  },
  'w240-premium-cashews': {
    sku: 'NT-CSW-001',
    totalInventoryKg: 5400,
    warehouseDistribution: { NOIDA: 3800, SRINAGAR: 400, PATNA: 1200 },
    minOrderKg: 0.25,
    reorderLevelKg: 600,
    batchCode: 'CSW-240-2026-C9',
    harvestDate: 'July 2026',
    qcTestDate: 'August 2026',
    labReportNo: 'NABL-NT-CSW-7718',
  },
  'kashmiri-kagzi-akhrot-paper-shell': {
    sku: 'NT-WLN-001',
    totalInventoryKg: 3600,
    warehouseDistribution: { NOIDA: 1100, SRINAGAR: 2200, PATNA: 300 },
    minOrderKg: 0.25,
    reorderLevelKg: 400,
    batchCode: 'AKH-KSH-2026-W4',
    harvestDate: 'September 2026',
    qcTestDate: 'October 2026',
    labReportNo: 'NABL-NT-AKH-6652',
  },
  'pure-kashmiri-mongra-saffron': {
    sku: 'NT-SAF-001',
    totalInventoryKg: 48, // in kg (saffron is high value)
    warehouseDistribution: { NOIDA: 18, SRINAGAR: 28, PATNA: 2 },
    minOrderKg: 0.001,
    reorderLevelKg: 5,
    batchCode: 'SAF-MNG-2026-P01',
    harvestDate: 'October 2026 (Fresh Pampore Flush)',
    qcTestDate: 'October 2026',
    labReportNo: 'NABL-NT-SAF-0021 (Crocin > 260)',
  },
  'pure-kashmiri-acacia-honey': {
    sku: 'NT-HNY-001',
    totalInventoryKg: 1850,
    warehouseDistribution: { NOIDA: 650, SRINAGAR: 1100, PATNA: 100 },
    minOrderKg: 0.25,
    reorderLevelKg: 200,
    batchCode: 'HNY-ACA-2026-H1',
    harvestDate: 'May-June 2026',
    qcTestDate: 'July 2026',
    labReportNo: 'NABL-NT-HNY-3391 (0% C4 Sugar)',
  },
  'makhana-grade-a-fox-nuts': {
    sku: 'NT-MKH-001',
    totalInventoryKg: 6200,
    warehouseDistribution: { NOIDA: 1900, SRINAGAR: 300, PATNA: 4000 },
    minOrderKg: 0.25,
    reorderLevelKg: 800,
    batchCode: 'MKH-MIT-2026-M6',
    harvestDate: 'August 2026',
    qcTestDate: 'September 2026',
    labReportNo: 'NABL-NT-MKH-5519',
  },
}

// ── Smart Warehouse Resolution Helper ──────────────────────────────────────────
export interface ResolvedWarehouseAvailability {
  primaryWarehouse: WarehouseLocation
  availableKg: number
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  transitDays: number
  shippingNotice: string
  batchInfo: {
    batchCode: string
    harvestDate: string
    labReportNo: string
  }
}

export function resolveWarehouseAvailability(
  productSlug: string,
  userPincodeOrCity?: string
): ResolvedWarehouseAvailability {
  const stock = INVENTORY_REGISTRY[productSlug] || {
    sku: 'NT-GEN-000',
    totalInventoryKg: 1000,
    warehouseDistribution: { NOIDA: 700, SRINAGAR: 200, PATNA: 100 },
    minOrderKg: 0.25,
    reorderLevelKg: 100,
    batchCode: 'BATCH-2026-STD',
    harvestDate: '2026 Fresh Harvest',
    qcTestDate: '2026 FSSAI Verified',
    labReportNo: 'NABL-2026-FSSAI',
  }

  // Pincode matching: default to NOIDA HQ for central dispatch
  let targetWarehouse: WarehouseCode = 'NOIDA'
  let transitDays = 2

  if (userPincodeOrCity) {
    const clean = userPincodeOrCity.trim().toLowerCase()
    if (clean.startsWith('19') || clean.includes('kashmir') || clean.includes('srinagar')) {
      targetWarehouse = 'SRINAGAR'
      transitDays = 1
    } else if (
      clean.startsWith('80') ||
      clean.startsWith('81') ||
      clean.startsWith('82') ||
      clean.startsWith('84') ||
      clean.startsWith('85') ||
      clean.includes('patna') ||
      clean.includes('bihar')
    ) {
      targetWarehouse = 'PATNA'
      transitDays = 1
    } else if (
      clean.startsWith('11') ||
      clean.startsWith('12') ||
      clean.startsWith('20') ||
      clean.includes('delhi') ||
      clean.includes('noida') ||
      clean.includes('gurgaon')
    ) {
      targetWarehouse = 'NOIDA'
      transitDays = 1
    }
  }

  // If local warehouse is out of stock, fallback to Noida or Srinagar
  let available = stock.warehouseDistribution[targetWarehouse]
  if (available < 5 && stock.warehouseDistribution.NOIDA >= 5) {
    targetWarehouse = 'NOIDA'
    available = stock.warehouseDistribution.NOIDA
    transitDays += 1
  }

  const warehouseObj = WAREHOUSES[targetWarehouse]
  const status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' =
    available > stock.reorderLevelKg * 0.5
      ? 'IN_STOCK'
      : available > 0
      ? 'LOW_STOCK'
      : 'OUT_OF_STOCK'

  const shippingNotice =
    transitDays === 1
      ? `Dispatched from ${warehouseObj.name} — Same-Day / Next-Day Delivery`
      : `Dispatched from ${warehouseObj.name} — Estimated ${transitDays} Business Days`

  return {
    primaryWarehouse: warehouseObj,
    availableKg: available,
    status,
    transitDays,
    shippingNotice,
    batchInfo: {
      batchCode: stock.batchCode,
      harvestDate: stock.harvestDate,
      labReportNo: stock.labReportNo,
    },
  }
}
