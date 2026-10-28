'use client'

import React, { useState } from 'react'
import { useSeller } from '../SellerContext'
import { SupportedCurrency, CURRENCY_SYMBOLS } from '@/lib/seller-portal/types'

export default function SellerSettingsPage() {
  const { seller, reportingCurrency, setReportingCurrency, refreshSeller } = useSeller()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  // Local settings state
  const [formData, setFormData] = useState({
    reportingCurrency: reportingCurrency as SupportedCurrency,
    pickupAddress: seller?.pickupAddress || '',
    city: seller?.city || '',
    state: seller?.state || '',
    pincode: seller?.pincode || '',
    country: seller?.country || 'United States',
    phone: seller?.phone || '',
    whatsapp: seller?.whatsapp || '',
    notifyNewOrderEmail: true,
    notifyNewOrderWhatsapp: true,
    notifyLowStock: true,
    notifyWeeklySettlement: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCurrencyChange = (curr: SupportedCurrency) => {
    setFormData((prev) => ({ ...prev, reportingCurrency: curr }))
    setReportingCurrency(curr)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    try {
      // In a real API this would PATCH /api/seller/settings or /api/seller/auth/me
      await new Promise((r) => setTimeout(r, 800))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-bold">
            Enterprise Preferences & Logistics
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#163326] mt-0.5">
            Seller Account Settings
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure global reporting currency, physical dispatch depots, notification triggers, and settlement banking.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <span>✓</span>
          <span>Account preferences and logistics configurations saved.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Global Currency & Reporting */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
            1. Global Currency & Financial Reporting
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Active Reporting Currency *
              </label>
              <select
                value={formData.reportingCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value as SupportedCurrency)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326] bg-white font-medium"
              >
                <option value="USD">USD ($) — United States Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="AED">AED — United Arab Emirates Dirham</option>
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="CAD">CAD (CA$) — Canadian Dollar</option>
                <option value="AUD">AUD (A$) — Australian Dollar</option>
                <option value="SGD">SGD (S$) — Singapore Dollar</option>
              </select>
              <span className="text-[10px] text-stone-500 mt-1 block">
                Controls the active conversion currency for your overview KPIs, payout ledger, and analytics.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Settlement Schedule & Hold Period
              </label>
              <input
                type="text"
                disabled
                value={`Net ${seller?.settlementHoldDays || 7} Days After Delivery (Standard T+7 SLA)`}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Dispatch Warehouse Address */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
            2. Primary Warehouse & Courier Collection Depot
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Warehouse Street Address *
              </label>
              <textarea
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  State / Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Postal Code / ZIP *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Notification Triggers */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
            3. Automated Notifications & Alerts
          </h3>

          <div className="space-y-3">
            {[
              { id: 'notifyNewOrderEmail', label: 'Instant Email Notification for New Orders', desc: 'Receive immediate order line items, buyer delivery address and customs invoice' },
              { id: 'notifyNewOrderWhatsapp', label: 'WhatsApp Dispatch Notifications', desc: 'Receive instant courier collection reminders and tracking updates' },
              { id: 'notifyLowStock', label: 'Low Inventory Threshold Alerts', desc: 'Get alerted before items run out of stock to preserve marketplace search ranking' },
              { id: 'notifyWeeklySettlement', label: 'Weekly Payout Settlement Statement', desc: 'Receive downloadable PDF invoice breakdown when funds transfer to your bank' },
            ].map((n) => (
              <label
                key={n.id}
                className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200/70 hover:bg-stone-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  name={n.id}
                  checked={(formData as any)[n.id]}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded text-[#163326] focus:ring-[#163326]"
                />
                <div>
                  <span className="font-semibold text-stone-800 text-xs block">{n.label}</span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">{n.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 4. Bank Account On File */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
            4. Settlement Bank Account On File
          </h3>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <div className="font-bold text-stone-900">{seller?.bankDetails?.bankName || 'JPMorgan Chase'}</div>
              <div className="font-mono text-stone-600 mt-1">
                Account: {seller?.bankDetails?.accountNumberMasked || '•••• •••• 9921'}
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                Routing / SWIFT: {seller?.bankDetails?.routingCode || 'CHASUS33'} · Beneficiary: {seller?.bankDetails?.beneficiaryName || seller?.storeName}
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-xs border border-emerald-200 self-start sm:self-auto">
              ✓ Verified Payout Account
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#163326] hover:bg-[#11291E] disabled:bg-stone-300 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            {saving ? 'Saving Preferences...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
