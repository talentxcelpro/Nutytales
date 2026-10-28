'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSeller } from '../SellerContext'
import { SellerReturnRequest } from '@/lib/seller-portal/types'

export default function SellerReturnsPage() {
  const { seller, reportingCurrency, formatCurrencyAmount } = useSeller()
  const [returns, setReturns] = useState<SellerReturnRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedReturn, setSelectedReturn] = useState<SellerReturnRequest | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [sellerNote, setSellerNote] = useState('')

  const fetchReturns = async (sellerId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/seller/returns?sellerId=${sellerId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.returns) setReturns(data.returns)
      }
    } catch (err) {
      console.error('Failed to load returns:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (seller?.id) {
      fetchReturns(seller.id)
    }
  }, [seller?.id])

  const handleUpdateStatus = async (returnId: string, newStatus: SellerReturnRequest['status']) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/seller/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnId, status: newStatus, sellerNote }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.returnRequest) {
          setReturns((prev) =>
            prev.map((r) => (r.id === returnId ? data.returnRequest : r))
          )
          setSelectedReturn(data.returnRequest)
          setSellerNote('')
        }
      }
    } catch (err) {
      console.error('Failed to update return:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const filtered = returns.filter((r) => {
    if (statusFilter === 'all') return true
    return r.status === statusFilter
  })

  const getStatusBadge = (status: SellerReturnRequest['status']) => {
    switch (status) {
      case 'requested':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Action Required</span>
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Return Authorized</span>
      case 'received':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">Depot Inspected</span>
      case 'refunded':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Refund Settled</span>
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">Declined</span>
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-bold">
            Customer Assurance & Reverse Logistics
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#163326] mt-0.5">
            Returns, Replacements & Refunds
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Process international return authorizations, depot inspection sign-offs, and automated buyer refund credits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#FAF6EF] text-[#163326] px-3 py-1.5 rounded-xl border border-[#C5A869]/30 font-semibold">
            Merchant Return Policy: {seller?.storefront?.returnPolicyDays || 30} Days Worldwide
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Returns</span>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">{returns.length}</div>
          <span className="text-[11px] text-stone-500 mt-1 block">Lifetime RMA requests</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Action Required</span>
          <div className="text-2xl font-bold font-serif text-amber-900 mt-1">
            {returns.filter((r) => r.status === 'requested').length}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Awaiting merchant RMA approval</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">In Transit</span>
          <div className="text-2xl font-bold font-serif text-blue-900 mt-1">
            {returns.filter((r) => r.status === 'approved').length}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Inbound return tracking active</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Total Refunded</span>
          <div className="text-2xl font-bold font-serif text-emerald-900 mt-1">
            {formatCurrencyAmount(
              returns
                .filter((r) => r.status === 'refunded')
                .reduce((sum, r) => sum + r.refundAmount, 0)
            )}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">In {reportingCurrency}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        {['all', 'requested', 'approved', 'received', 'refunded', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition whitespace-nowrap ${
              statusFilter === st
                ? 'bg-[#163326] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {st === 'all' ? 'All RMA Requests' : st}
          </button>
        ))}
      </div>

      {/* Main Table & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-stone-500">Loading reverse logistics records...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500">No return requests found under this filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">RMA ID / Date</th>
                    <th className="py-3 px-4">Customer & Order</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Refund Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedReturn(item)}
                      className={`hover:bg-stone-50 transition cursor-pointer ${
                        selectedReturn?.id === item.id ? 'bg-[#FAF6EF]' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-[#163326]">{item.id}</div>
                        <div className="text-[10px] text-stone-400">
                          {new Date(item.createdAt || item.requestedAt || Date.now()).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{item.customerName}</div>
                        <div className="text-[10px] text-stone-500 font-mono">Order #{item.orderId}</div>
                      </td>

                      <td className="py-3 px-4 text-stone-700">
                        <div className="truncate max-w-[150px]">{item.reason}</div>
                      </td>

                      <td className="py-3 px-4 font-bold text-stone-900">
                        {formatCurrencyAmount(item.refundAmount)}
                      </td>

                      <td className="py-3 px-4">{getStatusBadge(item.status)}</td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedReturn(item)
                          }}
                          className="px-2.5 py-1 text-xs text-[#163326] hover:bg-stone-200 rounded-lg font-medium transition"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Return Drawer */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
            RMA Inspection & Action
          </h3>

          {selectedReturn ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-stone-400 font-semibold">{selectedReturn.id}</span>
                {getStatusBadge(selectedReturn.status)}
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <div className="text-stone-500">Customer:</div>
                <div className="font-bold text-stone-900">{selectedReturn.customerName}</div>
                <div className="text-[11px] text-stone-500">Order ID: {selectedReturn.orderId}</div>
              </div>

              <div>
                <span className="text-stone-500 block mb-1">Customer Reason & Notes:</span>
                <div className="p-3 bg-[#FAF6EF] rounded-xl border border-[#C5A869]/30 text-stone-800">
                  {selectedReturn.reason}
                </div>
              </div>

              <div>
                <span className="text-stone-500 block mb-1">Return Shipping Tracking:</span>
                <div className="font-mono font-bold text-stone-700">
                  {selectedReturn.trackingNumber || 'Pending Customer Shipment'}
                </div>
              </div>

              <div className="border-t border-stone-100 pt-3">
                <span className="text-stone-500 block mb-1">Eligible Refund Amount:</span>
                <div className="text-xl font-bold font-serif text-[#163326]">
                  {formatCurrencyAmount(selectedReturn.refundAmount)}
                </div>
              </div>

              {selectedReturn.sellerNote && (
                <div>
                  <span className="text-stone-500 block mb-1">Merchant Assessment Note:</span>
                  <div className="p-2 bg-stone-100 rounded-lg text-stone-600 italic">
                    {selectedReturn.sellerNote}
                  </div>
                </div>
              )}

              {/* Action Buttons based on status */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <textarea
                  value={sellerNote}
                  onChange={(e) => setSellerNote(e.target.value)}
                  placeholder="Optional note to customer or depot reason..."
                  rows={2}
                  className="w-full text-xs p-2 rounded-xl border border-stone-300"
                />

                {selectedReturn.status === 'requested' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedReturn.id, 'approved')}
                      disabled={actionLoading}
                      className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs shadow-xs"
                    >
                      Authorize RMA & Send Label
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedReturn.id, 'rejected')}
                      disabled={actionLoading}
                      className="py-2 px-3 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl font-semibold text-xs"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {selectedReturn.status === 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedReturn.id, 'received')}
                    disabled={actionLoading}
                    className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow-xs"
                  >
                    Confirm Warehouse Receipt & Inspection
                  </button>
                )}

                {selectedReturn.status === 'received' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedReturn.id, 'refunded')}
                    disabled={actionLoading}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs"
                  >
                    Release {formatCurrencyAmount(selectedReturn.refundAmount)} Buyer Refund
                  </button>
                )}

                {selectedReturn.status === 'refunded' && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-center font-semibold">
                    ✓ Buyer Refund Executed
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-stone-400">
              Select an RMA record from the list to review inspection details and issue refunds.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
