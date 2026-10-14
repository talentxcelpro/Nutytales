// ─── Nuty Tales Enterprise B2B Procurement Data & State Store ─────────────────
// Manages durable RFQs, multi-supplier quotations, purchase orders, reefer deliveries,
// verified vendor profiles, lot certificates, and recurring procurement lists.

export interface RFQItem {
  commodityId: string
  commodityName: string
  cut: string
  packaging: string
  quantityKg: number
  targetRate?: number
}

export interface SupplierInvitation {
  supplierId: string
  supplierName: string
  location: string
  status: 'PENDING' | 'QUOTED' | 'DECLINED'
  quotedLandedPerKg?: number
  quotedAt?: string
}

export interface RFQRecord {
  id: string
  rfqNumber: string
  title: string
  createdAt: string
  deadline: string
  requiredByDate: string
  destinationHub: string
  status: 'DRAFT' | 'OPEN' | 'QUOTES_RECEIVED' | 'EVALUATING' | 'PO_CREATED' | 'CLOSED'
  items: RFQItem[]
  commercialTerms: string
  certificatesRequired: string[]
  invitations: SupplierInvitation[]
  notes?: string
}

export interface QuotationRecord {
  id: string
  quoteNumber: string
  rfqId: string
  rfqNumber: string
  supplierId: string
  supplierName: string
  supplierLocation: string
  supplierRating: number
  verificationStatus: 'AUDITED_VERIFIED' | 'SELF_ATTESTED' | 'NABL_PARTNER'
  commodityName: string
  quantityKg: number
  cut: string
  packaging: string
  destinationHub: string
  exHubRatePerKg: number
  freightPerKg: number
  packagingFeePerKg: number
  gstPercent: number
  netLandedPerKg: number
  subtotal: number
  freightTotal: number
  gstTotal: number
  totalAmount: number
  leadTimeDays: number
  paymentTerms: string
  validUntil: string
  coaAvailable: boolean
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  createdAt: string
}

export interface PurchaseOrderRecord {
  id: string
  poNumber: string
  rfqNumber: string
  quoteId: string
  supplierId: string
  supplierName: string
  supplierLocation: string
  orderDate: string
  deliveryDeadline: string
  destination: string
  status: 'DRAFT' | 'ISSUED' | 'ACKNOWLEDGED' | 'PACKED' | 'REEFER_TRANSIT' | 'DELIVERED' | 'COMPLETED'
  items: {
    name: string
    quantityKg: number
    unitRate: number
    total: number
  }[]
  subtotal: number
  freightAmount: number
  gstAmount: number
  totalAmount: number
  paymentStatus: 'UNPAID' | 'NET_30_PENDING' | 'PAID'
  paymentTerms: string
  carrierName?: string
  trackingNumber?: string
  reeferTempCelcius?: number
  etaDays?: number
  invoiceNumber?: string
}

export interface VendorRecord {
  id: string
  code: string
  name: string
  category: string
  approvalStatus: 'Approved' | 'Pending' | 'New'
  location: string
  state: string
  rating: number
  deliveriesCount: number
  totalSpend: string
  tags: string[]
  contactPerson: string
  phone: string
  email: string
  fssaiNumber: string
  gstin: string
  primaryProducts: string[]
  leadTimeAvgDays: number
}

export interface CertificateRecord {
  id: string
  lotNumber: string
  commodityName: string
  origin: string
  harvestSeason: string
  labName: string
  accreditation: string
  testDate: string
  expiryDate: string
  purityPercent: string
  moistureContent: string
  aflatoxinReading: string
  oilContent?: string
  status: 'NABL_CERTIFIED' | 'GI_VERIFIED' | 'AUDIT_IN_PROGRESS'
  downloadUrl?: string
}

export interface SavedListRecord {
  id: string
  name: string
  frequency: 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Ad-Hoc'
  totalEstimatedKg: number
  lastOrderedDate: string
  items: {
    commodityName: string
    cut: string
    quantityKg: number
    estRatePerKg: number
  }[]
}

export interface EnterpriseNotification {
  id: string
  type: 'quote' | 'order' | 'delivery' | 'compliance'
  title: string
  message: string
  timestamp: string
  read: boolean
  link: string
}

// ─── INITIAL VERIFIED SEED DATA ───────────────────────────────────────────────

export const INITIAL_VENDORS: VendorRecord[] = [
  {
    id: 'v-kmr-agro',
    code: 'KA',
    name: 'Kashmir Valley Orchard Federation',
    category: 'Walnuts & Mamra Almonds',
    approvalStatus: 'Approved',
    location: 'Pulwama, J&K',
    state: 'Jammu & Kashmir',
    rating: 4.9,
    deliveriesCount: 142,
    totalSpend: '₹48.4L',
    tags: ['Single Origin', 'GI Saffron', 'NABL Audited'],
    contactPerson: 'Mohammad Shafi Mir',
    phone: '+91 9717161809',
    email: 'kashmir.orchards@nutytales.com',
    fssaiNumber: '11024001000492',
    gstin: '01AAAAA0000A1Z5',
    primaryProducts: ['Kashmiri Mamra Almonds', 'Kashmiri Kagzi Walnuts', 'Super Mongra Saffron'],
    leadTimeAvgDays: 3.2,
  },
  {
    id: 'v-pac-almond',
    code: 'PA',
    name: 'Pacific Almond Aggregation & Import Terminal',
    category: 'California Almonds Extra No. 1',
    approvalStatus: 'Approved',
    location: 'Noida HQ / JNPT Corridor',
    state: 'Uttar Pradesh',
    rating: 4.8,
    deliveriesCount: 203,
    totalSpend: '₹84.2L',
    tags: ['Mechanically Cut', 'Sliced 1.0mm', 'Container Runs'],
    contactPerson: 'Vikas Aggarwal',
    phone: '+91 9811234567',
    email: 'california.import@nutytales.com',
    fssaiNumber: '10021011000219',
    gstin: '07BBBBB1111B2Z6',
    primaryProducts: ['California Independence Whole', 'Sliced Almonds 0.8-1.2mm', 'Almond Flour'],
    leadTimeAvgDays: 1.5,
  },
  {
    id: 'v-mithila-mak',
    code: 'MM',
    name: 'Mithila Lotus Agro Producer Company',
    category: 'Phool Makhana Jumbo (6+ Sutra)',
    approvalStatus: 'Approved',
    location: 'Darbhanga, Bihar',
    state: 'Bihar',
    rating: 4.9,
    deliveriesCount: 88,
    totalSpend: '₹28.6L',
    tags: ['Hand Graded', '6+ Sutra Puffs', 'Direct Wetland'],
    contactPerson: 'Rameshwar Jha',
    phone: '+91 9431289012',
    email: 'mithila.makhana@nutytales.com',
    fssaiNumber: '10423001000189',
    gstin: '10CCCCC2222C3Z7',
    primaryProducts: ['Makhana 6+ Sutra Jumbo', 'Roasted Fox Nuts', 'Makhana Coarse Meal'],
    leadTimeAvgDays: 2.8,
  },
  {
    id: 'v-konkan-csh',
    code: 'KC',
    name: 'Konkan Coast Cashew Processors Guild',
    category: 'Cashew Kernels W240 / Tukda',
    approvalStatus: 'Approved',
    location: 'Mangalore / Goa Belt',
    state: 'Karnataka',
    rating: 4.7,
    deliveriesCount: 94,
    totalSpend: '₹34.1L',
    tags: ['King Jumbo W240', 'Splits JH', 'Vacuum Sealed'],
    contactPerson: 'Devendra Kamath',
    phone: '+91 9886012345',
    email: 'konkan.cashews@nutytales.com',
    fssaiNumber: '11222333000541',
    gstin: '29DDDDD3333D4Z8',
    primaryProducts: ['Cashews W240 King Jumbo', 'Cashew Splits JH', 'Broken LWP pieces'],
    leadTimeAvgDays: 3.5,
  },
  {
    id: 'v-kandahar-dry',
    code: 'KD',
    name: 'Kandahar & Zabul Horticulture Trading House',
    category: 'Afghan Raisins & Figs',
    approvalStatus: 'Approved',
    location: 'Attari Border / Noida Depot',
    state: 'Punjab / NCR',
    rating: 4.6,
    deliveriesCount: 62,
    totalSpend: '₹19.8L',
    tags: ['Seedless Green', 'Anjeer 101 Jumbo', 'Sun Dried'],
    contactPerson: 'Ahmad Wali',
    phone: '+91 9711098765',
    email: 'kandahar.trading@nutytales.com',
    fssaiNumber: '10023011000954',
    gstin: '03EEEEE4444E5Z9',
    primaryProducts: ['Afghan Green Kishmish', 'Afghani Anjeer Garland 101', 'Iranian Pistachios'],
    leadTimeAvgDays: 4.0,
  },
  {
    id: 'v-delhi-cold',
    code: 'DL',
    name: 'Northstar Reefer Freight & Cold Chain Logistics',
    category: 'Reefer Logistics Partner',
    approvalStatus: 'Approved',
    location: 'Noida Sector 63 Logistics Hub',
    state: 'Uttar Pradesh',
    rating: 4.9,
    deliveriesCount: 310,
    totalSpend: '₹12.4L',
    tags: ['Reefer 14°C', 'Same Day NCR', 'GPS Monitored'],
    contactPerson: 'Gurpreet Singh',
    phone: '+91 9810123499',
    email: 'logistics@nutytales.com',
    fssaiNumber: '10022011000888',
    gstin: '07FFFFF5555F6Z1',
    primaryProducts: ['Temperature Controlled Line Haul', 'Palletised Delivery', 'Proof of Delivery (POD)'],
    leadTimeAvgDays: 1.0,
  },
]

export const INITIAL_RFQS: RFQRecord[] = [
  {
    id: 'rfq-2026-001',
    rfqNumber: 'NT-RFQ-2026-0089',
    title: 'Monthly Sliced California Almonds for Bakery Production',
    createdAt: '12 Oct 2026',
    deadline: '16 Oct 2026',
    requiredByDate: '20 Oct 2026',
    destinationHub: 'Delhi NCR / Noida Hub',
    status: 'QUOTES_RECEIVED',
    items: [
      {
        commodityId: 'california-almonds-independence',
        commodityName: 'California Almonds (Independence)',
        cut: 'Sliced 0.8–1.2mm',
        packaging: '25kg Vacuum Poly Liner',
        quantityKg: 500,
        targetRate: 700,
      },
    ],
    commercialTerms: 'Net-30 credit terms upon NABL COA batch clearance. Insured reefer delivery required.',
    certificatesRequired: ['NABL Batch Assay', 'FSSAI Compliance', 'Zero Foreign Matter Screen'],
    invitations: [
      {
        supplierId: 'v-pac-almond',
        supplierName: 'Pacific Almond Aggregation',
        location: 'Noida HQ Central Hub',
        status: 'QUOTED',
        quotedLandedPerKg: 712,
        quotedAt: '13 Oct 2026',
      },
      {
        supplierId: 'v-kmr-agro',
        supplierName: 'Kashmir Valley Orchard Federation',
        location: 'Pulwama, J&K',
        status: 'QUOTED',
        quotedLandedPerKg: 685,
        quotedAt: '13 Oct 2026',
      },
      {
        supplierId: 'v-konkan-csh',
        supplierName: 'Konkan Coast Cashew Processors',
        location: 'Mangalore',
        status: 'DECLINED',
      },
    ],
    notes: 'Standing monthly order. Volume will double in November for festive confectionery run.',
  },
  {
    id: 'rfq-2026-002',
    rfqNumber: 'NT-RFQ-2026-0088',
    title: 'Phool Makhana Jumbo 6+ Sutra for Retail Co-Packing',
    createdAt: '10 Oct 2026',
    deadline: '14 Oct 2026',
    requiredByDate: '18 Oct 2026',
    destinationHub: 'Patna / Kolkata Eastern Hub',
    status: 'QUOTES_RECEIVED',
    items: [
      {
        commodityId: 'phool-makhana-jumbo-6-sutra',
        commodityName: 'Phool Makhana Jumbo (Fox Nuts)',
        cut: 'Hand-Graded 6+ Sutra Jumbo',
        packaging: '10kg Corrugated Master Carton',
        quantityKg: 1000,
        targetRate: 680,
      },
    ],
    commercialTerms: '50% on PO dispatch confirmation, 50% on digital proof of delivery (POD).',
    certificatesRequired: ['Moisture < 7.5% Certificate', 'Hard Shell Free Assay'],
    invitations: [
      {
        supplierId: 'v-mithila-mak',
        supplierName: 'Mithila Lotus Agro Producer Company',
        location: 'Darbhanga, Bihar',
        status: 'QUOTED',
        quotedLandedPerKg: 695,
        quotedAt: '11 Oct 2026',
      },
    ],
  },
  {
    id: 'rfq-2026-003',
    rfqNumber: 'NT-RFQ-2026-0086',
    title: 'GI Kashmiri Super Mongra Saffron for Festive Packaging',
    createdAt: '08 Oct 2026',
    deadline: '12 Oct 2026',
    requiredByDate: '15 Oct 2026',
    destinationHub: 'Mumbai / Pune Industrial Corridor',
    status: 'PO_CREATED',
    items: [
      {
        commodityId: 'kashmir-super-mongra-saffron',
        commodityName: 'Royal Kashmiri Mongra Saffron',
        cut: 'Pure Red Stigma Only (Zero Style)',
        packaging: '500g Food-Grade Nitrogen Jar',
        quantityKg: 2.0,
        targetRate: 260000,
      },
    ],
    commercialTerms: 'Escrow bank transfer on NABL Crocin > 240 laboratory certificate confirmation.',
    certificatesRequired: ['GI Tagged Lot Seal', 'NABL Crocin/Safranal Assay'],
    invitations: [
      {
        supplierId: 'v-kmr-agro',
        supplierName: 'Kashmir Valley Orchard Federation',
        location: 'Pampore Plateau, J&K',
        status: 'QUOTED',
        quotedLandedPerKg: 260000,
        quotedAt: '09 Oct 2026',
      },
    ],
  },
]

export const INITIAL_QUOTES: QuotationRecord[] = [
  {
    id: 'quote-001',
    quoteNumber: 'NT-BID-2026-1044',
    rfqId: 'rfq-2026-001',
    rfqNumber: 'NT-RFQ-2026-0089',
    supplierId: 'v-pac-almond',
    supplierName: 'Pacific Almond Aggregation & Import Terminal',
    supplierLocation: 'Noida HQ Central Hub',
    supplierRating: 4.8,
    verificationStatus: 'AUDITED_VERIFIED',
    commodityName: 'California Almonds (Sliced 0.8–1.2mm)',
    quantityKg: 500,
    cut: 'Sliced 0.8–1.2mm',
    packaging: '25kg Vacuum Poly Liner',
    destinationHub: 'Delhi NCR / Noida Hub',
    exHubRatePerKg: 670,
    freightPerKg: 8,
    packagingFeePerKg: 2,
    gstPercent: 5,
    netLandedPerKg: 714,
    subtotal: 335000,
    freightTotal: 4000,
    gstTotal: 16750,
    totalAmount: 356750,
    leadTimeDays: 2,
    paymentTerms: 'Net-30 for GSTIN verified corporate accounts',
    validUntil: '18 Oct 2026',
    coaAvailable: true,
    status: 'SUBMITTED',
    createdAt: '13 Oct 2026',
  },
  {
    id: 'quote-002',
    quoteNumber: 'NT-BID-2026-1045',
    rfqId: 'rfq-2026-001',
    rfqNumber: 'NT-RFQ-2026-0089',
    supplierId: 'v-kmr-agro',
    supplierName: 'Kashmir Valley Orchard Federation',
    supplierLocation: 'Pulwama, J&K',
    supplierRating: 4.9,
    verificationStatus: 'NABL_PARTNER',
    commodityName: 'California Almonds (Direct Orchard Run)',
    quantityKg: 500,
    cut: 'Sliced 1.0mm',
    packaging: '25kg Vacuum Liner Sacks',
    destinationHub: 'Delhi NCR / Noida Hub',
    exHubRatePerKg: 645,
    freightPerKg: 14,
    packagingFeePerKg: 3,
    gstPercent: 5,
    netLandedPerKg: 695,
    subtotal: 322500,
    freightTotal: 7000,
    gstTotal: 16125,
    totalAmount: 347125,
    leadTimeDays: 4,
    paymentTerms: '50% Advance on PO, 50% on Lorry Receipt (LR)',
    validUntil: '17 Oct 2026',
    coaAvailable: true,
    status: 'SUBMITTED',
    createdAt: '13 Oct 2026',
  },
  {
    id: 'quote-003',
    quoteNumber: 'NT-BID-2026-1039',
    rfqId: 'rfq-2026-002',
    rfqNumber: 'NT-RFQ-2026-0088',
    supplierId: 'v-mithila-mak',
    supplierName: 'Mithila Lotus Agro Producer Company',
    supplierLocation: 'Darbhanga, Bihar',
    supplierRating: 4.9,
    verificationStatus: 'AUDITED_VERIFIED',
    commodityName: 'Phool Makhana Jumbo (6+ Sutra)',
    quantityKg: 1000,
    cut: 'Hand Graded Jumbo Puffs',
    packaging: '10kg Master Carton',
    destinationHub: 'Patna / Kolkata Eastern Hub',
    exHubRatePerKg: 650,
    freightPerKg: 11,
    packagingFeePerKg: 2,
    gstPercent: 5,
    netLandedPerKg: 696,
    subtotal: 650000,
    freightTotal: 11000,
    gstTotal: 32500,
    totalAmount: 695500,
    leadTimeDays: 3,
    paymentTerms: '50% on PO dispatch, 50% on POD',
    validUntil: '19 Oct 2026',
    coaAvailable: true,
    status: 'SUBMITTED',
    createdAt: '11 Oct 2026',
  },
]

export const INITIAL_PURCHASE_ORDERS: PurchaseOrderRecord[] = [
  {
    id: 'po-2026-001',
    poNumber: 'NT-PO-2026-0418',
    rfqNumber: 'NT-RFQ-2026-0086',
    quoteId: 'quote-saffron-01',
    supplierId: 'v-kmr-agro',
    supplierName: 'Kashmir Valley Orchard Federation',
    supplierLocation: 'Pampore Plateau, J&K',
    orderDate: '09 Oct 2026',
    deliveryDeadline: '15 Oct 2026',
    destination: 'Mumbai / Pune Industrial Corridor',
    status: 'REEFER_TRANSIT',
    items: [
      {
        name: 'Royal Kashmiri Mongra Saffron (Grade 1 Super Mongra)',
        quantityKg: 2.0,
        unitRate: 260000,
        total: 520000,
      },
    ],
    subtotal: 520000,
    freightAmount: 3500,
    gstAmount: 26000,
    totalAmount: 549500,
    paymentStatus: 'NET_30_PENDING',
    paymentTerms: 'Net-30 Credit',
    carrierName: 'Northstar Reefer Line (Truck #JK-01-AB-9844)',
    trackingNumber: 'TRK-REEFER-9844-MUM',
    reeferTempCelcius: 16.2,
    etaDays: 1,
    invoiceNumber: 'NT-INV-2026-0712',
  },
  {
    id: 'po-2026-002',
    poNumber: 'NT-PO-2026-0412',
    rfqNumber: 'NT-RFQ-2026-0082',
    quoteId: 'quote-walnut-01',
    supplierId: 'v-kmr-agro',
    supplierName: 'Kashmir Valley Orchard Federation',
    supplierLocation: 'Uri & Kupwara, Kashmir',
    orderDate: '28 Sep 2026',
    deliveryDeadline: '05 Oct 2026',
    destination: 'Delhi NCR / Noida Hub',
    status: 'DELIVERED',
    items: [
      {
        name: 'Kashmiri Kagzi Walnut Kernels (Snow-White Halves 80%)',
        quantityKg: 300,
        unitRate: 1080,
        total: 324000,
      },
    ],
    subtotal: 324000,
    freightAmount: 3200,
    gstAmount: 16200,
    totalAmount: 343400,
    paymentStatus: 'PAID',
    paymentTerms: 'Immediate Bank Wire',
    carrierName: 'Delhi-Kashmir Air Freight',
    trackingNumber: 'AWB-KMR-8831-DEL',
    invoiceNumber: 'NT-INV-2026-0689',
  },
]

export const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-001',
    lotNumber: 'LOT-KMR-WAL-26-09C',
    commodityName: 'Kashmiri Kagzi Walnut Kernels (Akhrot Giri)',
    origin: 'Uri & Kupwara, Kashmir Valley',
    harvestSeason: 'Autumn 2025/2026 Crop',
    labName: 'National Accreditation Board for Testing Labs (NABL)',
    accreditation: 'TC-8492 / ISO 17025 Certified',
    testDate: '08 Oct 2026',
    expiryDate: '08 Oct 2027',
    purityPercent: '99.7% Whole Halves',
    moistureContent: '4.1% (< 4.5% Standard)',
    aflatoxinReading: 'Not Detected (< 0.5 ppb)',
    oilContent: '64.0% Omega-3 Healthy Lipids',
    status: 'NABL_CERTIFIED',
  },
  {
    id: 'cert-002',
    lotNumber: 'LOT-GI-SAF-PAMPORE-26',
    commodityName: 'Royal Kashmiri Mongra Saffron (Pure Stigma)',
    origin: 'Pampore Plateau, Kashmir',
    harvestSeason: 'Reserve November 2025 Crop',
    labName: 'Sher-e-Kashmir Agri University Saffron Lab',
    accreditation: 'GI Tag Registration #JK-SAF-001 / NABL ISO 3632',
    testDate: '12 Oct 2026',
    expiryDate: '12 Oct 2028',
    purityPercent: '100% Pure Stigma (Zero Style)',
    moistureContent: '6.8% (< 8.0% Standard)',
    aflatoxinReading: 'Zero Residual Trace',
    oilContent: 'Crocin 252 (Grade 1 Super) · Safranal 41.2',
    status: 'GI_VERIFIED',
  },
  {
    id: 'cert-003',
    lotNumber: 'LOT-CAL-IND-26-88B',
    commodityName: 'California Almonds (Independence 23/25)',
    origin: 'Central Valley, California, USA',
    harvestSeason: 'California New Crop 2025/2026',
    labName: 'TUV India Food Analytical Lab',
    accreditation: 'NABL ISO 17025 / US FDA Tested',
    testDate: '10 Oct 2026',
    expiryDate: '10 Oct 2027',
    purityPercent: '99.9% Extra No. 1 Intact',
    moistureContent: '4.4% (< 4.8% Standard)',
    aflatoxinReading: '< 1.5 ppb (Strict US & EU Standard)',
    oilContent: '49.5% Monounsaturated Oleic Acid',
    status: 'NABL_CERTIFIED',
  },
  {
    id: 'cert-004',
    lotNumber: 'LOT-MAK-6SUT-26-04D',
    commodityName: 'Phool Makhana Jumbo (6+ Sutra)',
    origin: 'Darbhanga & Madhubani, Bihar',
    harvestSeason: 'Monsoon 2026 Fresh Puffs',
    labName: 'National Food Research Institute Testing Desk',
    accreditation: 'FSSAI Central Lab Partner',
    testDate: '11 Oct 2026',
    expiryDate: '11 Oct 2027',
    purityPercent: '99.5% Hard Shell Free',
    moistureContent: '6.9% (< 7.5% Standard)',
    aflatoxinReading: 'Not Detected',
    oilContent: 'High Protein (9.7%) · Low Fat (<0.2%)',
    status: 'NABL_CERTIFIED',
  },
]

export const INITIAL_SAVED_LISTS: SavedListRecord[] = [
  {
    id: 'list-001',
    name: 'Weekly Commercial Bakery Raw Mix',
    frequency: 'Weekly',
    totalEstimatedKg: 850,
    lastOrderedDate: '07 Oct 2026',
    items: [
      {
        commodityName: 'California Almonds (Sliced 1.0mm)',
        cut: 'Sliced 0.8–1.2mm',
        quantityKg: 500,
        estRatePerKg: 712,
      },
      {
        commodityName: 'Kashmiri Kagzi Walnut Pieces (LWP for Brownies)',
        cut: 'Bakery Broken Halves & Pieces',
        quantityKg: 250,
        estRatePerKg: 950,
      },
      {
        commodityName: 'Cashew Splits (JH Grade for Pastry Paste)',
        cut: 'Cashew Splits',
        quantityKg: 100,
        estRatePerKg: 740,
      },
    ],
  },
  {
    id: 'list-002',
    name: 'Monthly Premium Sweets & Mithai Reserve',
    frequency: 'Monthly',
    totalEstimatedKg: 1202,
    lastOrderedDate: '25 Sep 2026',
    items: [
      {
        commodityName: 'Cashew Kernels W240 (King Jumbo)',
        cut: 'Whole King Jumbo',
        quantityKg: 1000,
        estRatePerKg: 760,
      },
      {
        commodityName: 'Royal Kashmiri Mongra Saffron',
        cut: 'Pure Stigma Filament',
        quantityKg: 2.0,
        estRatePerKg: 260000,
      },
      {
        commodityName: 'Iranian Pistachios (Slivered Pista Chipta)',
        cut: 'Slivered Flakes',
        quantityKg: 200,
        estRatePerKg: 1240,
      },
    ],
  },
]

export const INITIAL_NOTIFICATIONS: EnterpriseNotification[] = [
  {
    id: 'notif-1',
    type: 'quote',
    title: 'New Bid Received for RFQ-0089',
    message: 'Pacific Almond Aggregation submitted a bid of ₹714/kg landed for 500 kg Sliced Almonds.',
    timestamp: '2 hours ago',
    read: false,
    link: '/b2b/quotes',
  },
  {
    id: 'notif-2',
    type: 'delivery',
    title: 'Reefer Shipment In-Transit',
    message: 'Order NT-PO-2026-0418 (Saffron) is currently in reefer transit with temperature logged at 16.2°C.',
    timestamp: '5 hours ago',
    read: false,
    link: '/b2b/orders',
  },
  {
    id: 'notif-3',
    type: 'compliance',
    title: 'NABL Batch Certificate Uploaded',
    message: 'Certificate for Lot LOT-KMR-WAL-26-09C is now verified and available for PDF download.',
    timestamp: 'Yesterday',
    read: true,
    link: '/b2b/certificates',
  },
]

// ─── LOCAL STORAGE KEYS ───────────────────────────────────────────────────────
const STORAGE_KEYS = {
  RFQS: 'nt_b2b_rfqs_v2',
  QUOTES: 'nt_b2b_quotes_v2',
  POS: 'nt_b2b_pos_v2',
  VENDORS: 'nt_b2b_vendors_v2',
  SAVED_LISTS: 'nt_b2b_saved_lists_v2',
  NOTIFS: 'nt_b2b_notifs_v2',
}

// ─── STATE PERSISTENCE HELPERS ────────────────────────────────────────────────

export function getStoredRfqs(): RFQRecord[] {
  if (typeof window === 'undefined') return INITIAL_RFQS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RFQS)
    return raw ? JSON.parse(raw) : INITIAL_RFQS
  } catch {
    return INITIAL_RFQS
  }
}

export function saveStoredRfq(rfq: RFQRecord): void {
  if (typeof window === 'undefined') return
  try {
    const list = getStoredRfqs()
    const updated = [rfq, ...list.filter((r) => r.id !== rfq.id)]
    localStorage.setItem(STORAGE_KEYS.RFQS, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save RFQ to local storage:', err)
  }
}

export function getStoredQuotes(): QuotationRecord[] {
  if (typeof window === 'undefined') return INITIAL_QUOTES
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUOTES)
    return raw ? JSON.parse(raw) : INITIAL_QUOTES
  } catch {
    return INITIAL_QUOTES
  }
}

export function saveStoredQuote(quote: QuotationRecord): void {
  if (typeof window === 'undefined') return
  try {
    const list = getStoredQuotes()
    const updated = [quote, ...list.filter((q) => q.id !== quote.id)]
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save Quote to local storage:', err)
  }
}

export function getStoredPurchaseOrders(): PurchaseOrderRecord[] {
  if (typeof window === 'undefined') return INITIAL_PURCHASE_ORDERS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POS)
    return raw ? JSON.parse(raw) : INITIAL_PURCHASE_ORDERS
  } catch {
    return INITIAL_PURCHASE_ORDERS
  }
}

export function saveStoredPurchaseOrder(po: PurchaseOrderRecord): void {
  if (typeof window === 'undefined') return
  try {
    const list = getStoredPurchaseOrders()
    const updated = [po, ...list.filter((p) => p.id !== po.id)]
    localStorage.setItem(STORAGE_KEYS.POS, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save PO to local storage:', err)
  }
}

export function getStoredVendors(): VendorRecord[] {
  if (typeof window === 'undefined') return INITIAL_VENDORS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VENDORS)
    return raw ? JSON.parse(raw) : INITIAL_VENDORS
  } catch {
    return INITIAL_VENDORS
  }
}

export function getStoredSavedLists(): SavedListRecord[] {
  if (typeof window === 'undefined') return INITIAL_SAVED_LISTS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_LISTS)
    return raw ? JSON.parse(raw) : INITIAL_SAVED_LISTS
  } catch {
    return INITIAL_SAVED_LISTS
  }
}

export function saveStoredSavedList(list: SavedListRecord): void {
  if (typeof window === 'undefined') return
  try {
    const lists = getStoredSavedLists()
    const updated = [list, ...lists.filter((l) => l.id !== list.id)]
    localStorage.setItem(STORAGE_KEYS.SAVED_LISTS, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save list to local storage:', err)
  }
}

export function getStoredNotifications(): EnterpriseNotification[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFS)
    return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS
  } catch {
    return INITIAL_NOTIFICATIONS
  }
}

export function markNotificationAsRead(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const list = getStoredNotifications()
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n))
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to update notification state:', err)
  }
}
