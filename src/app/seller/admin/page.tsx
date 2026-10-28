'use client'

import React, { useState, useEffect } from 'react'
import { SellerProfile } from '@/lib/seller-portal/types'

export default function SellerAdminControlPage() {
  const [sellers, setSellers] = useState<SellerProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedSeller, setSelectedSeller] = useState<SellerProfile | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const fetchSellers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/seller/admin')
      if (res.ok) {
        const data = await res.json()
        if (data.sellers) {
          setSellers(data.sellers)
          if (!selectedSeller && data.sellers.length > 0) {
            setSelectedSeller(data.sellers[0])
          }
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSellers()
  }, [])

  const handleUpdateStatus = async (sellerId: string, status: SellerProfile['status']) => {
    setActionLoading(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/seller/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId,
          status,
          notes: adminNotes || undefined,
          rejectionReason: status === 'rejected' ? rejectionReason : undefined,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.seller) {
          setSellers((prev) => prev.map((s) => (s.id === sellerId ? data.seller : s)))
          setSelectedSeller(data.seller)
          setFeedback(`Seller ${data.seller.storeName} is now ${status.toUpperCase()}`)
          setAdminNotes('')
          setRejectionReason('')
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const filtered = sellers.filter((s) => {
    if (filter === 'all') return true
    if (filter === 'pending') return s.status === 'submitted' || s.status === 'under_verification'
    return s.status === filter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C5A869] font-bold">Admin Control Centre</span>
          <h1 className="text-2xl font-serif font-bold text-[#1A3E2F] mt-1">Merchant Verification & Review</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Operational governance, KYC compliance verification, category moderation, and payout authorisation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1A3E2F] text-white">
            Super Admin Access
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
          ✓ {feedback}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-xs flex flex-wrap gap-1 text-xs">
        {[
          { key: 'all', label: 'All Merchants', count: sellers.length },
          {
            key: 'pending',
            label: 'Pending Verification',
            count: sellers.filter((s) => s.status === 'submitted' || s.status === 'under_verification').length,
          },
          {
            key: 'approved',
            label: 'Approved Sellers',
            count: sellers.filter((s) => s.status === 'approved').length,
          },
          {
            key: 'rejected',
            label: 'Rejected',
            count: sellers.filter((s) => s.status === 'rejected').length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === tab.key
                ? 'bg-[#1A3E2F] text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Grid: Seller List & Verification Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Merchant Cards */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden divide-y divide-stone-100 max-h-[700px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-xs text-stone-400">Loading merchant applications...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">No sellers in this queue.</div>
          ) : (
            filtered.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSeller(s)}
                className={`p-4 cursor-pointer transition text-xs space-y-1 ${
                  selectedSeller?.id === s.id ? 'bg-[#FAF6EF]' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-stone-500">{s.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      s.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {s.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 truncate">{s.storeName}</h4>
                <div className="text-[11px] text-stone-500 flex items-center justify-between">
                  <span className="capitalize">{s.businessType} · {s.city}</span>
                  <span>{s.defaultCommissionRate}% Commission</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Verification & Action Review Panel */}
        {selectedSeller && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-5">
            <div className="border-b border-stone-100 pb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C5A869]">Application Review</span>
                <h3 className="font-serif font-bold text-xl text-stone-900 mt-0.5">
                  {selectedSeller.storeName}
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  {selectedSeller.legalName} · ID: {selectedSeller.id}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  selectedSeller.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedSeller.status === 'rejected'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {selectedSeller.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Regulatory Credentials by Country */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Operating Country</span>
                <span className="font-bold text-stone-900">{selectedSeller.country} ({selectedSeller.countryCode})</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Primary Tax / EIN / CRN</span>
                <span className="font-mono font-bold text-stone-900 truncate block">
                  {selectedSeller.taxIdentifiers?.einOrSsn || selectedSeller.taxIdentifiers?.companyNumber || selectedSeller.taxIdentifiers?.tradeLicenseNumber || (selectedSeller as any).panNumber || selectedSeller.taxIdentifiers?.taxIdNumber || 'Verified'}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Secondary VAT / Sales Tax</span>
                <span className="font-mono font-bold text-stone-900 truncate block">
                  {selectedSeller.taxIdentifiers?.vatNumber || selectedSeller.taxIdentifiers?.stateTaxPermit || selectedSeller.taxIdentifiers?.trnNumber || (selectedSeller as any).gstin || 'Standard'}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Settlement Currency</span>
                <span className="font-mono font-bold text-emerald-800">{selectedSeller.preferredCurrency}</span>
              </div>
            </div>

            {/* Address & Bank Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Pickup Warehouse</span>
                <div className="font-semibold text-stone-900">{selectedSeller.pickupAddress}</div>
                <div className="text-stone-600">{selectedSeller.city}, {selectedSeller.state} - {selectedSeller.pincode}</div>
                <div className="text-stone-500 pt-1">Phone: {selectedSeller.phone} | Email: {selectedSeller.email}</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Settlement Bank</span>
                <div className="font-semibold text-stone-900">{selectedSeller.bankDetails?.bankName}</div>
                <div className="font-mono text-stone-700">A/C: {selectedSeller.bankDetails?.accountNumberMasked}</div>
                <div className="font-mono text-stone-700">Routing / SWIFT: {selectedSeller.bankDetails?.routingCode || (selectedSeller.bankDetails as any)?.ifscCode}</div>
                <div className="text-stone-500 pt-1">Beneficiary: {selectedSeller.bankDetails?.beneficiaryName}</div>
              </div>
            </div>

            {/* Internal Admin Audit Notes */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-stone-800">Internal Audit & Verification Notes</label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Log physical inspection notes, verification call summary, or compliance status..."
                className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            {/* Approval / Rejection Controls */}
            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedSeller.id, 'approved')}
                  disabled={actionLoading || selectedSeller.status === 'approved'}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition"
                >
                  ✓ Approve Marketplace Account
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedSeller.id, 'under_verification')}
                  disabled={actionLoading}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition"
                >
                  Mark Under Verification
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="text-xs p-2 border border-stone-300 rounded-lg w-44"
                />
                <button
                  onClick={() => handleUpdateStatus(selectedSeller.id, 'rejected')}
                  disabled={actionLoading || selectedSeller.status === 'rejected'}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
