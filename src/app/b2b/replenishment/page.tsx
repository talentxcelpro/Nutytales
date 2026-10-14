'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  getStoredSavedLists,
  saveStoredSavedList,
  saveStoredRfq,
  SavedListRecord,
  RFQRecord,
} from '@/lib/b2b-procurement-store'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function B2BReplenishmentPage() {
  const router = useRouter()
  const [savedLists, setSavedLists] = useState<SavedListRecord[]>([])
  const [selectedList, setSelectedList] = useState<SavedListRecord | null>(null)
  const [isCreatingList, setIsCreatingList] = useState(false)
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState<string | null>(null)

  // New list form state
  const [newListName, setNewListName] = useState('')
  const [newFrequency, setNewFrequency] = useState<'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Ad-Hoc'>('Monthly')
  const [commodity1, setCommodity1] = useState('California Almonds (Sliced 1.0mm)')
  const [qty1, setQty1] = useState(500)
  const [rate1, setRate1] = useState(720)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    setSavedLists(getStoredSavedLists())
  }, [])

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) return

    const newList: SavedListRecord = {
      id: `list-${Date.now()}`,
      name: newListName.trim(),
      frequency: newFrequency,
      totalEstimatedKg: Number(qty1),
      lastOrderedDate: 'Not ordered yet',
      items: [
        {
          commodityName: commodity1,
          cut: 'Master Food Grade Pack',
          quantityKg: Number(qty1),
          estRatePerKg: Number(rate1),
        },
      ],
    }

    saveStoredSavedList(newList)
    const updated = getStoredSavedLists()
    setSavedLists(updated)
    setIsCreatingList(false)
    setNewListName('')
  }

  // 1-Click Reorder handler: creates an instant RFQ and redirects to quote comparison
  const handleReorderNow = (list: SavedListRecord) => {
    const rfqId = `rfq-${Date.now()}`
    const rfqNumber = `NT-RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`

    const newRfq: RFQRecord = {
      id: rfqId,
      rfqNumber,
      title: `Standing Reorder: ${list.name}`,
      createdAt: 'Just now',
      deadline: '48 Hours',
      requiredByDate: 'Within 7 Business Days',
      destinationHub: 'Delhi NCR / Noida Hub',
      status: 'QUOTES_RECEIVED',
      items: list.items.map((i, idx) => ({
        commodityId: `item-${idx}`,
        commodityName: i.commodityName,
        cut: i.cut,
        packaging: '25kg Multi-layer Vacuum Pack',
        quantityKg: i.quantityKg,
        targetRate: i.estRatePerKg,
      })),
      commercialTerms: 'Net-30 verified commercial terms. Inspection at receiving dock.',
      certificatesRequired: ['NABL Lot Assay', 'Moisture < 5% COA'],
      invitations: [
        {
          supplierId: 'v-pac-almond',
          supplierName: 'Pacific Almond Aggregation & Import Terminal',
          location: 'Noida HQ Central Hub',
          status: 'QUOTED',
          quotedLandedPerKg: list.items[0]?.estRatePerKg || 714,
          quotedAt: 'Just now',
        },
      ],
    }

    saveStoredRfq(newRfq)
    setReorderSuccessMsg(`Reorder RFQ ${rfqNumber} successfully initiated from list "${list.name}".`)
    setTimeout(() => {
      router.push('/b2b/quotes')
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#17233B] text-[#C9A45C]">
              Procurement Automation
            </span>
            <span className="text-xs text-stone-500 font-medium">Standing Orders · JIT Factory Supply</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1322] mt-1">
            Saved Purchase Lists &amp; Replenishment
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Maintain standing ingredient bills of materials, lock quarterly prices, and trigger repeat production replenishment in one click.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreatingList(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A1322] hover:bg-[#17233B] text-xs font-bold text-white shadow-sm"
          >
            <span>+</span> Create New Saved List
          </button>
        </div>
      </div>

      {reorderSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>✓ {reorderSuccessMsg} Opening Quote Workspace...</span>
          <span className="text-[10px] uppercase tracking-wider text-emerald-700">Redirecting...</span>
        </div>
      )}

      {/* Benefits Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex items-start gap-3 text-xs">
          <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
            🔒
          </span>
          <div>
            <div className="font-bold text-stone-900">Quarterly Price Lock</div>
            <div className="text-stone-500 text-[11px] mt-0.5">
              Shield against market spot fluctuations with pre-agreed contract pricing.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex items-start gap-3 text-xs">
          <span className="w-8 h-8 rounded-lg bg-[#C9A45C]/20 text-[#704B32] flex items-center justify-center font-bold text-sm flex-shrink-0">
            ❄️
          </span>
          <div>
            <div className="font-bold text-stone-900">Dedicated Buffer in Noida Hub</div>
            <div className="text-stone-500 text-[11px] mt-0.5">
              15 days reserve held at 15°C cold storage specifically tagged for your plant.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex items-start gap-3 text-xs">
          <span className="w-8 h-8 rounded-lg bg-[#17233B] text-[#C9A45C] flex items-center justify-center font-bold text-sm flex-shrink-0">
            ⚡
          </span>
          <div>
            <div className="font-bold text-stone-900">1-Click JIT Dispatch</div>
            <div className="text-stone-500 text-[11px] mt-0.5">
              Skip renegotiations. Reorder directly against your verified Net-30 credit limit.
            </div>
          </div>
        </div>
      </div>

      {/* Saved Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedLists.map((list) => {
          const totalEstimatedSpend = list.items.reduce(
            (acc, it) => acc + it.quantityKg * it.estRatePerKg,
            0,
          )

          return (
            <div
              key={list.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4 text-xs hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-base text-[#0A1322]">{list.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                        {list.frequency}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Last reordered: <strong className="text-stone-700">{list.lastOrderedDate}</strong>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-900">
                    {list.totalEstimatedKg.toLocaleString('en-IN')} kg total
                  </span>
                </div>

                {/* Items in list */}
                <div className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50/50">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="p-2.5">Commodity &amp; Cut</th>
                        <th className="p-2.5 text-right">Volume</th>
                        <th className="p-2.5 text-right">Target Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {list.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white transition-colors">
                          <td className="p-2.5">
                            <div className="font-semibold text-stone-900">{item.commodityName}</div>
                            <div className="text-[10px] text-stone-500">{item.cut}</div>
                          </td>
                          <td className="p-2.5 text-right font-mono font-medium text-stone-700">
                            {item.quantityKg} kg
                          </td>
                          <td className="p-2.5 text-right font-mono text-stone-900">
                            ₹{item.estRatePerKg}/kg
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-stone-500">Estimated Batch Landed Cost:</span>
                  <span className="font-bold font-mono text-[#0A1322] text-sm">
                    ₹{totalEstimatedSpend.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <button
                  onClick={() => handleReorderNow(list)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0A1322] hover:bg-[#17233B] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all text-center"
                >
                  ⚡ Reorder Batch Now
                </button>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Trade Desk! I want to lock quarterly standing supply for "${list.name}" (${list.totalEstimatedKg} kg total).`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs"
                >
                  Adjust Terms
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Create New Saved List */}
      {isCreatingList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                  Procurement Template
                </span>
                <h3 className="font-serif text-xl font-bold text-[#0A1322]">
                  Create Saved Purchase List
                </h3>
              </div>
              <button
                onClick={() => setIsCreatingList(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateList} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">List Name / Production Batch</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly Almond Slices & Walnut Halves"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#17233B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Replenishment Frequency</label>
                <select
                  value={newFrequency}
                  onChange={(e) =>
                    setNewFrequency(e.target.value as 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Ad-Hoc')
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#17233B] outline-none"
                >
                  <option value="Weekly">Weekly (High throughput)</option>
                  <option value="Bi-Weekly">Bi-Weekly (Standard bakery run)</option>
                  <option value="Monthly">Monthly (Fixed production cycle)</option>
                  <option value="Ad-Hoc">Ad-Hoc (Seasonal reserve)</option>
                </select>
              </div>

              <div className="space-y-3 pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wider">
                  Primary Commodity
                </span>

                <div>
                  <label className="block text-stone-600 mb-1">Commodity &amp; Grade</label>
                  <input
                    type="text"
                    required
                    value={commodity1}
                    onChange={(e) => setCommodity1(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#17233B] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 mb-1">Quantity (Kg)</label>
                    <input
                      type="number"
                      required
                      min={50}
                      value={qty1}
                      onChange={(e) => setQty1(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#17233B] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Target Landed Rate (₹/Kg)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={rate1}
                      onChange={(e) => setRate1(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#17233B] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingList(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0A1322] hover:bg-[#17233B] text-white font-bold"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
