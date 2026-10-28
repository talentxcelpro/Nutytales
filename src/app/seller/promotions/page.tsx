'use client'

import React, { useState, useEffect } from 'react'
import { useSeller } from '../SellerContext'
import { SellerPromotion } from '@/lib/seller-portal/types'

export default function SellerPromotionsPage() {
  const { seller, reportingCurrency, formatCurrencyAmount } = useSeller()
  const [promotions, setPromotions] = useState<SellerPromotion[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    code: '',
    title: '',
    promoType: 'percentage_discount',
    discountValue: 10,
    minOrderValue: 2000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  })

  const fetchPromotions = async (sellerId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/seller/promotions?sellerId=${sellerId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.promotions) setPromotions(data.promotions)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (seller?.id) {
      fetchPromotions(seller.id)
    }
  }, [seller?.id])

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!seller?.id) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/seller/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller.id,
          code: form.code,
          title: form.title,
          promoType: form.promoType,
          discountValue: Number(form.discountValue),
          minOrderValue: Number(form.minOrderValue),
          startDate: form.startDate,
          endDate: form.endDate,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.promotion) {
          setPromotions([data.promotion, ...promotions])
          setShowModal(false)
          setForm({
            code: '',
            title: '',
            promoType: 'percentage_discount',
            discountValue: 10,
            minOrderValue: 2000,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          })
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C5A869] font-bold">Growth & Marketing</span>
          <h1 className="text-2xl font-serif font-bold text-[#1A3E2F] mt-1">Promotions & Discounts</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Create merchant-funded discounts and participate in cross-storefront seasonal campaigns.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1A3E2F] hover:bg-[#143226] text-white text-xs font-semibold rounded-lg shadow-xs transition"
        >
          <span>+</span> Create Coupon Code
        </button>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-stone-900 text-base">Active Campaigns & Coupon Codes</h3>
          <span className="text-xs text-stone-500">{promotions.length} Configured</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6EF] text-stone-600 text-[10px] uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Title / Campaign</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Order Value</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4">Funded By</th>
                <th className="py-3 px-4 text-right">Redemptions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-stone-400">Loading promotions...</td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-stone-400">
                    No active discount campaigns configured yet.
                  </td>
                </tr>
              ) : (
                promotions.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900 bg-stone-50/50">
                      {p.code}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-800">{p.title}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-800">
                      {p.promoType === 'percentage_discount' ? `${p.discountValue}% Off` : `${formatCurrencyAmount(p.discountValue)} Off`}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-mono">
                      {formatCurrencyAmount(p.minOrderValue)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {p.startDate} to {p.endDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                          p.fundedBy === 'seller' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {p.fundedBy} Funded
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold font-mono text-stone-800">
                      {p.usageCount} orders
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePromo}
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif font-bold text-stone-900 text-base">Create Discount Coupon</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required
                placeholder="e.g. SAFFRON10"
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg uppercase font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Campaign Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="e.g. Harvest Festival 10% Off"
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Discount (% or ₹) *</label>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                  required
                  min="1"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Min Order Value (₹)</label>
                <input
                  type="number"
                  value={form.minOrderValue}
                  onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                  min="0"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs text-stone-600 font-semibold hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs bg-[#1A3E2F] hover:bg-[#143226] text-white font-bold rounded-lg shadow-xs"
              >
                {submitting ? 'Creating...' : 'Activate Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
