'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  getStoredRfqs,
  getStoredQuotes,
  getStoredPurchaseOrders,
  getStoredVendors,
  getStoredSavedLists,
  RFQRecord,
  QuotationRecord,
  PurchaseOrderRecord,
  VendorRecord,
  SavedListRecord,
} from '@/lib/b2b-procurement-store'
import { B2B_COMMODITIES } from '@/lib/b2b-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function B2BDashboardPage() {
  const [rfqs, setRfqs] = useState<RFQRecord[]>([])
  const [quotes, setQuotes] = useState<QuotationRecord[]>([])
  const [orders, setOrders] = useState<PurchaseOrderRecord[]>([])
  const [vendors, setVendors] = useState<VendorRecord[]>([])
  const [savedLists, setSavedLists] = useState<SavedListRecord[]>([])
  const [activeTab, setActiveTab] = useState<'vendors' | 'quotes' | 'orders'>('vendors')
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories')
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses')
  const [vendorSearch, setVendorSearch] = useState<string>('')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    setRfqs(getStoredRfqs())
    setQuotes(getStoredQuotes())
    setOrders(getStoredPurchaseOrders())
    setVendors(getStoredVendors())
    setSavedLists(getStoredSavedLists())
  }, [])

  // KPI Calculations
  const pendingQuotes = quotes.filter((q) => q.status === 'SUBMITTED')
  const activeOrders = orders.filter((o) => o.status === 'REEFER_TRANSIT' || o.status === 'PACKED')
  const pendingApprovalsCount = pendingQuotes.length + activeOrders.length
  const totalVendorsCount = vendors.length
  const totalPOsCount = orders.length

  // Filter vendors based on category & status & search
  const filteredVendors = vendors.filter((v) => {
    const matchesCat =
      selectedCategory === 'All Categories' || v.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesStatus =
      selectedStatus === 'All Statuses' || v.approvalStatus.toLowerCase() === selectedStatus.toLowerCase()
    const matchesSearch =
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.location.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.category.toLowerCase().includes(vendorSearch.toLowerCase())
    return matchesCat && matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Top Bar ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1">
            <Link href="/b2b/dashboard" className="hover:text-stone-900">
              Dashboard
            </Link>
            <span>&gt;</span>
            <span>Vendors</span>
            <span>&gt;</span>
            <span className="text-stone-900 font-bold">Procurement</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Procurement
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Source vendors, compare quotes, approve suppliers and generate Purchase Orders
          </p>
        </div>

        {/* Top Right Action Buttons (Matching Screenshot) */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/b2b/suppliers"
            className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-bold border border-stone-300 shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>+</span>
            <span>Add Vendor</span>
          </Link>
          <Link
            href="/b2b/rfq"
            className="px-4 py-2 bg-[#E36414] hover:bg-[#d0590e] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>⚡</span>
            <span>Generate PO / RFQ</span>
          </Link>
        </div>
      </div>

      {/* ── 4 KPI Summary Cards Strip (Matching Screenshot) ──────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL VENDORS */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">TOTAL VENDORS</span>
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-sm">
              👥
            </span>
          </div>
          <div>
            <div className="font-serif text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalVendorsCount}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <span>↑ +4</span>
              <span className="text-stone-500 font-normal">this month</span>
            </div>
          </div>
        </div>

        {/* Card 2: PENDING APPROVALS */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">PENDING APPROVALS</span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm">
              🕒
            </span>
          </div>
          <div>
            <div className="font-serif text-3xl font-extrabold text-stone-900 tracking-tight">
              {pendingApprovalsCount}
            </div>
            <div className="text-[11px] text-amber-700 font-bold mt-1 flex items-center gap-1">
              <span>↑ +2</span>
              <span className="text-stone-500 font-normal">since yesterday</span>
            </div>
          </div>
        </div>

        {/* Card 3: POS GENERATED */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">POS GENERATED</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
              📄
            </span>
          </div>
          <div>
            <div className="font-serif text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalPOsCount}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <span>↑ +6</span>
              <span className="text-stone-500 font-normal">this quarter</span>
            </div>
          </div>
        </div>

        {/* Card 4: AVG. LEAD TIME */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">AVG. LEAD TIME</span>
            <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center text-sm">
              ⏱️
            </span>
          </div>
          <div>
            <div className="font-serif text-3xl font-extrabold text-stone-900 tracking-tight">
              2.8 <span className="text-sm font-normal text-stone-500">days</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <span>↓ -1.1d</span>
              <span className="text-stone-500 font-normal">vs last quarter</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── "WHAT REQUIRES MY ATTENTION?" Action Center ─────────────────────── */}
      <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <span>🔔</span> WHAT REQUIRES YOUR IMMEDIATE ATTENTION (3 ITEMS)
          </span>
          <span className="text-[10px] text-amber-800 font-medium">Updated 5 mins ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[9px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Quote Expiry Warning
              </span>
              <strong className="block text-stone-900 text-xs mt-1.5">
                California Almonds RFQ-0089
              </strong>
              <p className="text-[11px] text-stone-600">
                Bid of ₹714/kg from Pacific Almonds expires in 48 hours.
              </p>
            </div>
            <Link
              href="/b2b/quotes"
              className="font-bold text-[#176B68] hover:underline text-[11px] pt-1"
            >
              Compare &amp; Lock Bid →
            </Link>
          </div>

          <div className="bg-white p-3 rounded-xl border border-blue-200 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[9px] uppercase font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                Live Reefer Transit
              </span>
              <strong className="block text-stone-900 text-xs mt-1.5">
                PO-0418 · Kashmiri Saffron (2 kg)
              </strong>
              <p className="text-[11px] text-stone-600">
                Truck #JK-01-AB-9844 is on highway. Temp: 16.2°C (Optimal).
              </p>
            </div>
            <Link
              href="/b2b/deliveries"
              className="font-bold text-blue-700 hover:underline text-[11px] pt-1"
            >
              Live GPS Reefer Tracker →
            </Link>
          </div>

          <div className="bg-white p-3 rounded-xl border border-emerald-200 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[9px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Scheduled Replenishment
              </span>
              <strong className="block text-stone-900 text-xs mt-1.5">
                Weekly Bakery Raw Mix
              </strong>
              <p className="text-[11px] text-stone-600">
                Current inventory low. 850 kg lot scheduled for Monday cycle.
              </p>
            </div>
            <Link
              href="/b2b/replenishment"
              className="font-bold text-emerald-700 hover:underline text-[11px] pt-1"
            >
              Trigger 1-Click Reorder →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Sub-Tabs Navigation (Vendor Database | Compare Quotes | Purchase Orders) ─ */}
      <div className="border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-3 border-b-2 transition-all ${
              activeTab === 'vendors'
                ? 'border-[#17233B] text-[#17233B] bg-stone-100/50 rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Vendor Database ({vendors.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'quotes'
                ? 'border-[#17233B] text-[#17233B] bg-stone-100/50 rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Compare Quotes</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full">
              {quotes.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#17233B] text-[#17233B] bg-stone-100/50 rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Purchase Orders</span>
            <span className="bg-stone-100 text-stone-600 text-[10px] px-1.5 py-0.2 rounded-full">
              {orders.length}
            </span>
          </button>
        </div>
      </div>

      {/* ── Tab Content: Vendor Database (Matching Screenshot Structure) ──────── */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          {/* Filter Bar: Search + Category + Status */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                placeholder="Search vendors by name, category, city..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white outline-none focus:ring-2 focus:ring-[#176B68] text-xs font-medium"
              />
              <span className="absolute left-3 top-2.5 text-stone-400">🔍</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium text-stone-800 outline-none focus:ring-2 focus:ring-[#176B68]"
              >
                <option value="All Categories">All Categories</option>
                <option value="Walnuts">Walnuts &amp; Mamra</option>
                <option value="Almonds">California Almonds</option>
                <option value="Makhana">Phool Makhana</option>
                <option value="Cashew">Cashews W240</option>
                <option value="Raisins">Afghan Raisins</option>
                <option value="Reefer">Reefer Logistics</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium text-stone-800 outline-none focus:ring-2 focus:ring-[#176B68]"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending Audit</option>
                <option value="New">New</option>
              </select>
            </div>
          </div>

          {/* Vendors Card Grid (Identical to reference screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor) => {
              const badgeColors =
                vendor.approvalStatus === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : vendor.approvalStatus === 'Pending'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-blue-100 text-blue-800 border-blue-300'

              return (
                <div
                  key={vendor.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 text-xs"
                >
                  <div className="space-y-3">
                    {/* Header: Code Avatar + Name + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#17233B] text-white flex items-center justify-center font-bold font-serif text-sm flex-shrink-0 shadow-xs">
                          {vendor.code}
                        </div>
                        <div>
                          <h3 className="font-bold text-stone-900 text-sm leading-snug">
                            {vendor.name}
                          </h3>
                          <span className="text-[11px] text-stone-500 font-medium">
                            {vendor.category}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColors}`}
                      >
                        {vendor.approvalStatus}
                      </span>
                    </div>

                    {/* Metadata Grid: Location, Rating, Deliveries, Total Spend */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-100 text-[11px]">
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase font-bold">
                          LOCATION
                        </span>
                        <span className="font-semibold text-stone-800">{vendor.location}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase font-bold">
                          RATING
                        </span>
                        <span className="font-bold text-emerald-700">★ {vendor.rating}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase font-bold">
                          DELIVERIES
                        </span>
                        <span className="font-semibold text-stone-800">{vendor.deliveriesCount}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase font-bold">
                          TOTAL SPEND
                        </span>
                        <span className="font-bold text-[#E36414]">{vendor.totalSpend}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {vendor.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions: View Profile & Get Quote */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <Link
                      href={`/b2b/suppliers?vendor=${vendor.id}`}
                      className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-center transition-colors text-[11px]"
                    >
                      View
                    </Link>
                    <Link
                      href={`/b2b/rfq?vendor=${vendor.id}`}
                      className="flex-1 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-center transition-colors text-[11px] shadow-xs"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Tab Content: Compare Quotes ───────────────────────────────────────── */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between text-xs">
            <span className="font-bold text-stone-900 uppercase tracking-wider">
              Submitted Quotations &amp; Comparative Bids
            </span>
            <Link href="/b2b/quotes" className="text-[#176B68] font-bold hover:underline">
              Open Full Comparison Matrix →
            </Link>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
                  <th className="py-3 px-4">Quote Ref</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Commodity</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Net Landed / kg</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Lead Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{q.quoteNumber}</td>
                    <td className="py-3 px-4 font-medium">{q.supplierName}</td>
                    <td className="py-3 px-4">{q.commodityName}</td>
                    <td className="py-3 px-4 font-bold">{q.quantityKg} kg</td>
                    <td className="py-3 px-4 font-serif font-bold text-[#17233B]">
                      ₹{q.netLandedPerKg.toLocaleString('en-IN')}/kg
                    </td>
                    <td className="py-3 px-4 font-bold">₹{q.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-stone-600">{q.leadTimeDays} Days</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/b2b/quotes?highlight=${q.id}`}
                        className="px-3 py-1 bg-[#17233B] hover:bg-[#176B68] text-white rounded-lg font-bold text-[11px]"
                      >
                        Accept &amp; PO
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab Content: Purchase Orders ──────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between text-xs">
            <span className="font-bold text-stone-900 uppercase tracking-wider">
              Purchase Orders &amp; Reefer Deliveries
            </span>
            <Link href="/b2b/orders" className="text-[#176B68] font-bold hover:underline">
              View All Purchase Orders →
            </Link>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Reefer / Dispatch</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Track</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {orders.map((po) => (
                  <tr key={po.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{po.poNumber}</td>
                    <td className="py-3 px-4 font-medium">{po.supplierName}</td>
                    <td className="py-3 px-4 text-stone-600">{po.orderDate}</td>
                    <td className="py-3 px-4 font-bold text-[#17233B]">
                      ₹{po.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold text-stone-700">{po.paymentTerms}</span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-stone-600">
                      {po.trackingNumber ? `${po.trackingNumber} (${po.reeferTempCelcius}°C)` : 'Hub Processing'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          po.status === 'REEFER_TRANSIT'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/b2b/deliveries?po=${po.poNumber}`}
                        className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold text-[11px]"
                      >
                        Track GPS
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Recurring Replenishment Quick Bar ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div>
            <h2 className="font-bold text-stone-900 text-sm">Saved Procurement Lists &amp; Repeat Orders</h2>
            <p className="text-stone-500 text-[11px]">
              Reorder consistent commercial ingredient batches without repeating manual RFQs
            </p>
          </div>
          <Link href="/b2b/replenishment" className="font-bold text-[#176B68] hover:underline text-xs">
            Manage Lists →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {savedLists.map((list) => (
            <div
              key={list.id}
              className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-stone-900">{list.name}</span>
                <span className="text-[11px] text-stone-500 block">
                  {list.items.length} items · {list.totalEstimatedKg} kg total · Last ordered {list.lastOrderedDate}
                </span>
              </div>
              <Link
                href={`/b2b/rfq?reorderList=${list.id}`}
                className="px-3 py-1.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-lg font-bold text-[11px] whitespace-nowrap"
              >
                1-Click Reorder
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
