'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  getStoredRfqs,
  getStoredQuotes,
  getStoredPurchaseOrders,
  getStoredVendors,
  saveStoredPurchaseOrder,
  RFQRecord,
  QuotationRecord,
  PurchaseOrderRecord,
  VendorRecord,
} from '@/lib/b2b-procurement-store'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

// Screenshot 6-Vendor Grid with Real Product Photos, Pricing, and Verified Registry
interface ScreenshotVendor {
  id: string
  code: string
  avatarBg: string
  image: string
  name: string
  category: string
  status: 'Approved' | 'Pending' | 'Under Review'
  location: string
  deliveriesCount: number
  rating: number
  totalSpend: string
  ratePerKg: number
  landedPerKg: number
  fssaiNumber: string
  lotNumber: string
  moqKg: number
  tags: string[]
}

const SCREENSHOT_VENDORS: ScreenshotVendor[] = [
  {
    id: 'v-walnuts',
    code: 'SC',
    avatarBg: 'bg-[#1E3A8A] text-white',
    image: '/images/kashmir-kagzi-akhrot-250g.webp',
    name: 'North Kashmir Agro Producers Guild',
    category: 'Kashmiri Kagzi Walnuts (Snow-White Halves 80%+)',
    status: 'Approved',
    location: 'Kupwara / Baramulla, J&K',
    deliveriesCount: 142,
    rating: 4.9,
    totalSpend: '₹42.5L',
    ratePerKg: 1080,
    landedPerKg: 1142,
    fssaiNumber: '11023002000812',
    lotNumber: 'LOT-KMR-WAL-26-09C',
    moqKg: 20,
    tags: ['Walnuts', 'Kagzi Halves', 'NABL Lot 09C'],
  },
  {
    id: 'v-almonds',
    code: 'PA',
    avatarBg: 'bg-[#0E7490] text-white',
    image: '/images/almonds-pouch-250g.webp',
    name: 'Pacific Almond Aggregation & Import Terminal',
    category: 'California Almonds (Extra #1, Sliced 1.0mm)',
    status: 'Approved',
    location: 'JNPT / Noida Cold Hub',
    deliveriesCount: 94,
    rating: 4.8,
    totalSpend: '₹35.2L',
    ratePerKg: 670,
    landedPerKg: 714,
    fssaiNumber: '10021011000219',
    lotNumber: 'LOT-CAL-IND-26-88B',
    moqKg: 50,
    tags: ['Almonds', 'Nonpareil 23/25', 'Sliced 1.0mm'],
  },
  {
    id: 'v-makhana',
    code: 'ML',
    avatarBg: 'bg-[#15803D] text-white',
    image: '/images/makhana-pouch-250g.webp',
    name: 'Mithila Lotus Agro Producer Company',
    category: 'GI Mithila Makhana (6+ Sutra Jumbo Puff)',
    status: 'Pending',
    location: 'Darbhanga, Bihar',
    deliveriesCount: 64,
    rating: 4.7,
    totalSpend: '₹28.4L',
    ratePerKg: 690,
    landedPerKg: 725,
    fssaiNumber: '10423001000184',
    lotNumber: 'LOT-MAK-6SUT-26-04D',
    moqKg: 20,
    tags: ['Makhana', '6+ Sutra', 'Hard-Shell Free'],
  },
  {
    id: 'v-reefer',
    code: 'NL',
    avatarBg: 'bg-[#C2410C] text-white',
    image: '/images/kashmir-orchard-estate.jpg',
    name: 'Northstar Reefer Logistics Line',
    category: '14°C Cold-Chain Reefer Line & Fleet Telemetry',
    status: 'Approved',
    location: 'Noida HQ Logistics Port',
    deliveriesCount: 310,
    rating: 4.9,
    totalSpend: '₹12.4L',
    ratePerKg: 12,
    landedPerKg: 12,
    fssaiNumber: '10022011000888',
    lotNumber: 'TRK-REEFER-9844-DEL',
    moqKg: 100,
    tags: ['14°C Reefer', 'GPS Track', 'POD Digital'],
  },
  {
    id: 'v-saffron',
    code: 'PS',
    avatarBg: 'bg-[#6D28D9] text-white',
    image: '/images/saffron-threads-macro.jpg',
    name: 'Pampore GI Saffron Cultivators Society',
    category: 'Royal Kashmiri Mongra Saffron (Crocin > 240)',
    status: 'Approved',
    location: 'Pampore Plateau, J&K',
    deliveriesCount: 38,
    rating: 5.0,
    totalSpend: '₹21.5L',
    ratePerKg: 260000,
    landedPerKg: 262500,
    fssaiNumber: '11024002000301',
    lotNumber: 'LOT-GI-SAF-PAMPORE-26',
    moqKg: 0.1,
    tags: ['GI Saffron', 'Crocin 252', 'Grade A1'],
  },
  {
    id: 'v-cashews',
    code: 'DI',
    avatarBg: 'bg-[#B91C1C] text-white',
    image: '/images/cashews-w180-macro.jpg',
    name: 'Konkan Coast Cashew Processors Consortium',
    category: 'King Jumbo W240 & Clean Splits (JH)',
    status: 'Approved',
    location: 'Mangalore / Goa Belt',
    deliveriesCount: 178,
    rating: 4.8,
    totalSpend: '₹19.8L',
    ratePerKg: 760,
    landedPerKg: 808,
    fssaiNumber: '11222333000541',
    lotNumber: 'LOT-CSH-W240-2026-K1',
    moqKg: 25,
    tags: ['Cashews W240', 'King Jumbo', 'Vacuum Tin'],
  },
]

export default function B2BProcurementDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'vendors' | 'quotes' | 'orders'>('vendors')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')

  // Data Store
  const [rfqs, setRfqs] = useState<RFQRecord[]>([])
  const [quotes, setQuotes] = useState<QuotationRecord[]>([])
  const [orders, setOrders] = useState<PurchaseOrderRecord[]>([])

  // Modals
  const [selectedVendorForQuote, setSelectedVendorForQuote] = useState<ScreenshotVendor | null>(null)
  const [addVendorModalOpen, setAddVendorModalOpen] = useState(false)
  const [newVendorName, setNewVendorName] = useState('')
  const [newVendorCategory, setNewVendorCategory] = useState('Tree Nuts & Kernels')
  const [newVendorLocation, setNewVendorLocation] = useState('')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    setRfqs(getStoredRfqs())
    setQuotes(getStoredQuotes())
    setOrders(getStoredPurchaseOrders())
  }, [])

  // Filter vendors
  const filteredVendors = SCREENSHOT_VENDORS.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCat =
      selectedCategory === 'All Categories' ||
      v.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()))

    const matchesStatus =
      selectedStatus === 'All Statuses' ||
      v.status.toLowerCase() === selectedStatus.toLowerCase()

    return matchesSearch && matchesCat && matchesStatus
  })

  // Accept quote handler
  const handleAcceptQuote = (quote: QuotationRecord) => {
    const newPO: PurchaseOrderRecord = {
      id: `po-${Date.now()}`,
      poNumber: `NT-PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      rfqNumber: quote.rfqNumber,
      quoteId: quote.id,
      supplierId: quote.supplierId,
      supplierName: quote.supplierName,
      supplierLocation: quote.supplierLocation,
      orderDate: 'Today',
      deliveryDeadline: 'Within 3 Business Days',
      destination: quote.destinationHub,
      status: 'ISSUED',
      items: [
        {
          name: quote.commodityName,
          quantityKg: quote.quantityKg,
          unitRate: quote.netLandedPerKg,
          total: quote.totalAmount,
        },
      ],
      subtotal: quote.subtotal,
      freightAmount: quote.freightTotal,
      gstAmount: quote.gstTotal,
      totalAmount: quote.totalAmount,
      paymentStatus: 'NET_30_PENDING',
      paymentTerms: quote.paymentTerms,
      carrierName: 'Northstar Cold-Chain Logistics',
      trackingNumber: `TRK-PO-${Date.now().toString().slice(-6)}`,
      etaDays: quote.leadTimeDays,
      invoiceNumber: `NT-INV-${Date.now().toString().slice(-6)}`,
    }

    saveStoredPurchaseOrder(newPO)
    setOrders(getStoredPurchaseOrders())
    setActiveTab('orders')
  }

  return (
    <div className="space-y-5">
      {/* ── BREADCRUMB, TITLE & ACTIONS (Matching Screenshot) ───────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumbs: Dashboard > Vendors > Procurement */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-1">
            <Link href="/b2b/dashboard" className="hover:text-stone-800">
              Dashboard
            </Link>
            <span className="text-stone-400">&gt;</span>
            <Link href="/b2b/suppliers" className="hover:text-stone-800">
              Vendors
            </Link>
            <span className="text-stone-400">&gt;</span>
            <span className="text-stone-700 font-semibold">Procurement</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1830] tracking-tight">
            Procurement
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Source vendors, compare quotes, approve suppliers and generate purchase orders.
          </p>
        </div>

        {/* Action Buttons: + Add Vendor & Generate PO */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setAddVendorModalOpen(true)}
            className="px-4 py-2 bg-white hover:bg-stone-50 text-[#0F172A] rounded-lg text-xs font-semibold border border-stone-300 shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>+</span>
            <span>Add Vendor</span>
          </button>

          <Link
            href="/b2b/rfq"
            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#E66000] text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>⚡</span>
            <span>Generate PO</span>
          </Link>
        </div>
      </div>

      {/* ── 4 KPI CARDS STRIP (Matching Screenshot Exact Color Accents) ──────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL VENDORS (Blue Top Accent) */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden border-t-4 border-t-[#1E40AF]">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500">
              TOTAL VENDORS
            </span>
            <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs">
              👥
            </span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-[#0A1830] tracking-tight">34</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>↑ +2</span>
              <span className="text-stone-400 font-normal">this month</span>
            </div>
          </div>
        </div>

        {/* Card 2: PENDING APPROVALS (Orange Top Accent) */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden border-t-4 border-t-[#FF6B00]">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500">
              PENDING APPROVALS
            </span>
            <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
              🕒
            </span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-[#0A1830] tracking-tight">12</div>
            <div className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
              <span>• 2</span>
              <span className="text-stone-400 font-normal">need review</span>
            </div>
          </div>
        </div>

        {/* Card 3: POS GENERATED (Green Top Accent) */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden border-t-4 border-t-[#10B981]">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500">
              POS GENERATED
            </span>
            <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
              📄
            </span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-[#0A1830] tracking-tight">37</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>↑ +4</span>
              <span className="text-stone-400 font-normal">this quarter</span>
            </div>
          </div>
        </div>

        {/* Card 4: AVG. LEAD TIME (Purple Top Accent) */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden border-t-4 border-t-[#8B5CF6]">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500">
              AVG. LEAD TIME
            </span>
            <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xs">
              ⏱️
            </span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-[#0A1830] tracking-tight">
              8.4 <span className="text-sm font-normal text-stone-400">days</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>↓ -0.4d</span>
              <span className="text-stone-400 font-normal">vs last quarter</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUB-TABS SEGMENTED PILL BAR (Matching Screenshot) ────────────────── */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'vendors'
              ? 'bg-[#081830] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 font-medium'
          }`}
        >
          Vendor Database
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'quotes'
              ? 'bg-[#081830] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 font-medium'
          }`}
        >
          Compare Quotes
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-[#081830] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 font-medium'
          }`}
        >
          Purchase Orders
        </button>
      </div>

      {/* ── TAB 1: VENDOR DATABASE (Matching Screenshot's 6-Card Grid) ──────── */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          {/* Search Input & Dropdowns Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors by name, category, city..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-1 focus:ring-[#081830]"
              />
              <span className="absolute left-3 top-2.5 text-stone-400 text-xs">🔍</span>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 outline-none focus:ring-1 focus:ring-[#081830]"
              >
                <option value="All Categories">All Categories</option>
                <option value="Tree Nuts">Tree Nuts &amp; Kernels</option>
                <option value="Saffron">Pampore Saffron</option>
                <option value="Makhana">GI Makhana</option>
                <option value="Logistics">Reefer Cold-Chain</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 outline-none focus:ring-1 focus:ring-[#081830]"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* 6 Vendor Cards Grid: 2 rows of 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
              >
                {/* Top Row: Avatar + Real Product Photo + Name + Status */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Real Product Photo Thumbnail */}
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200 flex-shrink-0 bg-stone-100 shadow-2xs group">
                        <Image
                          src={vendor.image}
                          alt={vendor.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                        <span
                          className={`absolute bottom-0 right-0 px-1 py-0.2 rounded-tl text-[8px] font-bold ${vendor.avatarBg}`}
                        >
                          {vendor.code}
                        </span>
                      </div>

                      {/* Name & Category */}
                      <div>
                        <div className="font-bold text-stone-900 text-xs sm:text-sm leading-snug">
                          {vendor.name}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                          {vendor.category}
                        </div>
                        <div className="text-[9px] text-[#C9A45C] font-mono mt-0.5">
                          FSSAI Lic. #{vendor.fssaiNumber} · {vendor.lotNumber}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                        vendor.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </div>

                  {/* 2x2 Details Grid (Location, Deliveries, Rating, Total Spend) */}
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-3 mt-2.5 border-t border-stone-100 text-xs">
                    <div>
                      <div className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                        LOCATION
                      </div>
                      <div className="font-semibold text-stone-800 text-[11px]">
                        {vendor.location}
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                        RATING
                      </div>
                      <div className="font-semibold text-stone-800 text-[11px] flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span>{vendor.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                        DELIVERIES
                      </div>
                      <div className="font-bold font-mono text-stone-900 text-xs">
                        {vendor.deliveriesCount} orders
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                        TOTAL SPEND
                      </div>
                      <div className="font-bold font-mono text-stone-900 text-xs">
                        {vendor.totalSpend}
                      </div>
                    </div>
                  </div>

                  {/* Real Pricing Strip (Ex-Hub & Landed 5% GST) */}
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs bg-stone-50/70 p-2 rounded-lg">
                    <div>
                      <span className="text-[9px] text-stone-400 uppercase font-bold block">Ex-Hub Spot Rate</span>
                      <span className="font-mono font-bold text-stone-900 text-xs">
                        ₹{vendor.ratePerKg.toLocaleString('en-IN')}/kg
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-emerald-800 uppercase font-bold block">Est. Landed (5% GST)</span>
                      <span className="font-mono font-bold text-emerald-700 text-xs">
                        ₹{vendor.landedPerKg.toLocaleString('en-IN')}/kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Tags + "Get Quote" Button */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {vendor.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[9px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedVendorForQuote(vendor)}
                    className="px-3.5 py-1.5 bg-[#081830] hover:bg-[#12274A] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex-shrink-0"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: COMPARE QUOTES ────────────────────────────────────────────── */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="font-bold text-base text-[#0A1830]">Landed Cost Quote Comparison</h2>
              <p className="text-xs text-stone-500">
                Multi-supplier bids benchmarked with freight, GST input credit, and lead time SLA.
              </p>
            </div>
            <Link
              href="/b2b/quotes"
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              Open Full Quote Terminal →
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {quotes.map((q) => (
              <div key={q.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-stone-900">{q.supplierName}</div>
                  <div className="text-stone-500 text-[11px]">
                    {q.commodityName} · {q.quantityKg} kg ({q.packaging})
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                    Lead time: {q.leadTimeDays}d · Valid until: {q.validUntil}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold font-mono text-sm text-stone-900">
                    ₹{q.netLandedPerKg} <span className="text-[10px] text-stone-500 font-normal">/ kg landed</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono">
                    Total: ₹{q.totalAmount.toLocaleString('en-IN')} (incl. GST)
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptQuote(q)}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-2xs"
                >
                  Accept &amp; Issue PO
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: PURCHASE ORDERS ───────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="font-bold text-base text-[#0A1830]">Generated Purchase Orders</h2>
              <p className="text-xs text-stone-500">
                Active orders, commercial terms, and cold-chain reefer delivery telemetry.
              </p>
            </div>
            <Link
              href="/b2b/orders"
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              Open Orders Desk →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">PO Number</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Item &amp; Volume</th>
                  <th className="p-3 text-right">Total Landed</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Logistics Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((po) => (
                  <tr key={po.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-stone-900">{po.poNumber}</td>
                    <td className="p-3 font-medium text-stone-800">{po.supplierName}</td>
                    <td className="p-3 text-stone-600">
                      {po.items[0]?.name} ({po.items[0]?.quantityKg} kg)
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-stone-900">
                      ₹{po.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {po.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-[11px] text-stone-600">
                      {po.trackingNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: GET QUOTE DIRECTLY FROM VENDOR CARD ──────────────────────── */}
      {selectedVendorForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${selectedVendorForQuote.avatarBg}`}
                >
                  {selectedVendorForQuote.code}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0A1830]">
                    Request Quotation: {selectedVendorForQuote.name}
                  </h3>
                  <div className="text-[11px] text-stone-500">
                    {selectedVendorForQuote.location} · Rating: ★{selectedVendorForQuote.rating}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedVendorForQuote(null)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-stone-600">
                Submit an instant RFQ directly to this supplier. You will receive an assay-backed quote with landed freight rates within 4 hours.
              </p>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Target Commodity</label>
                <input
                  type="text"
                  readOnly
                  value={selectedVendorForQuote.tags.join(' / ')}
                  className="w-full px-3 py-2 rounded-lg bg-stone-100 border border-stone-300 text-xs font-medium text-stone-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Required Volume (Kg)</label>
                  <input
                    type="number"
                    defaultValue={500}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Delivery Destination</label>
                  <input
                    type="text"
                    defaultValue="Noida Plant / NCR"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <div className="flex justify-between">
                  <span>Assigned Trade Desk Specialist:</span>
                  <strong className="text-stone-800">Tariq Ahmad</strong>
                </div>
                <div className="flex justify-between">
                  <span>Payment Facility:</span>
                  <span className="text-emerald-700 font-bold">Net-30 Approved</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedVendorForQuote(null)}
                className="flex-1 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Quotation request dispatched to ${selectedVendorForQuote.name}!`)
                  setSelectedVendorForQuote(null)
                  router.push('/b2b/quotes')
                }}
                className="flex-1 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#E66000] text-white text-xs font-bold shadow-xs"
              >
                Submit RFQ to Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: + ADD VENDOR ─────────────────────────────────────────────── */}
      {addVendorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-base text-[#0A1830]">Onboard New Vendor</h3>
              <button
                onClick={() => setAddVendorModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Malabar Cashew Exports Pvt Ltd"
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Category &amp; Products</label>
                <input
                  type="text"
                  placeholder="e.g. Tree Nuts, Kernels &amp; Slices"
                  value={newVendorCategory}
                  onChange={(e) => setNewVendorCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">City / Processing Hub</label>
                <input
                  type="text"
                  placeholder="e.g. Mangalore, Karnataka"
                  value={newVendorLocation}
                  onChange={(e) => setNewVendorLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs outline-none"
                />
              </div>

              <div className="text-[11px] text-stone-500">
                New vendors undergo automated FSSAI verification and NABL lot assay audits before receiving quotation requests.
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setAddVendorModalOpen(false)}
                className="flex-1 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Vendor "${newVendorName || 'New Vendor'}" registered for compliance review.`)
                  setAddVendorModalOpen(false)
                }}
                className="flex-1 py-2 rounded-lg bg-[#081830] hover:bg-[#12274A] text-white text-xs font-bold shadow-xs"
              >
                Register Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
