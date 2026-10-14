'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getStoredVendors, VendorRecord } from '@/lib/b2b-procurement-store'
import BecomeSupplierModal from '@/components/b2b/BecomeSupplierModal'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function B2BSuppliersPage() {
  const [vendors, setVendors] = useState<VendorRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [selectedVendorDetails, setSelectedVendorDetails] = useState<VendorRecord | null>(null)
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    setVendors(getStoredVendors())
  }, [])

  const filteredVendors = vendors.filter((v) => {
    const matchesCat =
      selectedCategory === 'All Categories' || v.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesStatus =
      selectedStatus === 'All Statuses' || v.approvalStatus.toLowerCase() === selectedStatus.toLowerCase()
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-stone-900 font-bold">Vendors Database</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Verified Supplier Network
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Audited origin grower cooperatives, primary hulling plants, and cold-chain import terminals
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddVendorOpen(true)}
            className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>+</span>
            <span>Onboard New Supplier</span>
          </button>
        </div>
      </div>

      {/* ── Filter Bar (Matching Reference Screenshot) ────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendors by name, category, city..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 bg-stone-50 outline-none focus:ring-2 focus:ring-[#176B68] focus:bg-white text-xs font-medium"
          />
          <span className="absolute left-3 top-2 text-stone-400">🔍</span>
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

      {/* ── Vendor Cards Grid (Matching Reference Screenshot Layout) ─────────── */}
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
                {/* Header: Code Avatar + Name + Status Badge */}
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

                {/* Metadata Grid */}
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

                {/* Product Tags */}
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

              {/* Action Buttons: View Profile & Get Quote */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedVendorDetails(vendor)}
                  className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-center transition-colors text-[11px]"
                >
                  View
                </button>
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

      {/* ── Vendor Details Modal ─────────────────────────────────────────────── */}
      {selectedVendorDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="p-6 bg-[#17233B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                  Verified Supplier Dossier
                </span>
                <h3 className="font-serif text-xl font-bold">{selectedVendorDetails.name}</h3>
                <span className="text-[11px] text-stone-300">{selectedVendorDetails.category}</span>
              </div>
              <button
                onClick={() => setSelectedVendorDetails(null)}
                className="text-stone-400 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-stone-700">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 text-[11px]">
                <div>
                  <span className="text-stone-500 block">FSSAI License:</span>
                  <strong className="text-stone-900 font-mono">{selectedVendorDetails.fssaiNumber}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">GSTIN Status:</span>
                  <strong className="text-emerald-700 font-mono">✓ {selectedVendorDetails.gstin}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Contact Officer:</span>
                  <strong className="text-stone-900">{selectedVendorDetails.contactPerson}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Lead Time SLA:</span>
                  <strong className="text-stone-900">{selectedVendorDetails.leadTimeAvgDays} Days Average</strong>
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-900 block mb-1">Primary Commodities Handled:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVendorDetails.primaryProducts.map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-1 bg-stone-100 rounded-lg text-stone-800 font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-200">
                ✓ <strong>Facility Audit Record:</strong> Facility inspected by Nuty Tales Quality Directorate. Nitrogen packaging, optical sorting, and moisture assay compliance verified on-site.
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end gap-2">
              <Link
                href={`/b2b/rfq?vendor=${selectedVendorDetails.id}`}
                className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold uppercase tracking-wider text-[11px]"
              >
                Issue RFQ to Vendor
              </Link>
              <button
                type="button"
                onClick={() => setSelectedVendorDetails(null)}
                className="px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard Supplier Modal */}
      <BecomeSupplierModal isOpen={isAddVendorOpen} onClose={() => setIsAddVendorOpen(false)} />
    </div>
  )
}
