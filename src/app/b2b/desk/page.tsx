'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'
import {
  getStoredBusinessAccount,
  saveStoredRfq,
  RFQRecord,
} from '@/lib/b2b-procurement-store'

interface ProcurementMandate {
  id: string
  title: string
  submittedAt: string
  slaDeadline: string
  assignedSpecialist: string
  itemsCount: number
  targetBudget: string
  status: 'ANALYZING' | 'BIDS_READY' | 'PO_ISSUED'
  notes: string
}

export default function B2BProcurementDeskPage() {
  const { user } = useAuth()
  const [mandates, setMandates] = useState<ProcurementMandate[]>([])
  const [bomText, setBomText] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [targetBudget, setTargetBudget] = useState('')
  const [deliveryPincode, setDeliveryPincode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nt_b2b_mandates_v1')
      if (raw) {
        setMandates(JSON.parse(raw))
      }
    } catch {
      // ignore
    }
  }, [])

  const handleSubmitBOM = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bomText.trim()) return

    setIsSubmitting(true)
    const newId = `DESK-2026-${Math.floor(100 + Math.random() * 900)}`
    const acc = getStoredBusinessAccount()

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.displayName || acc?.contactPerson || 'Managed BOM Buyer',
          phone: acc?.phone || user?.phoneNumber || '',
          email: user?.email || acc?.email || '',
          businessName: acc?.companyName || projectTitle.trim() || 'Commercial Buyer',
          city: deliveryPincode || acc?.city || 'Delhi NCR',
          message: `[Managed Desk BOM Mandate - ${newId}] Title: ${projectTitle} | Target Budget: ${targetBudget || 'Flexible'} | Pincode: ${deliveryPincode} | BOM Spec:\n${bomText}`,
          source: 'managed-procurement-desk',
        }),
      }).catch(() => {})

      const newMandate: ProcurementMandate = {
        id: newId,
        title: projectTitle.trim() || 'Custom Multi-Commodity BOM',
        submittedAt: 'Just now',
        slaDeadline: 'Within 4 business hours',
        assignedSpecialist: 'Tariq Ahmad (Senior Trade Desk)',
        itemsCount: bomText.split('\n').filter((l) => l.trim().length > 0).length || 1,
        targetBudget: targetBudget.trim() ? `₹${targetBudget}` : 'Flexible / Best Market Rate',
        status: 'ANALYZING',
        notes: bomText.trim(),
      }

      const updated = [newMandate, ...mandates]
      setMandates(updated)
      try {
        localStorage.setItem('nt_b2b_mandates_v1', JSON.stringify(updated))
      } catch {
        // ignore
      }

      // Also register as an RFQ in the quotes system
      const newRfq: RFQRecord = {
        id: `rfq-${Date.now()}`,
        rfqNumber: `NT-RFQ-${newId}`,
        title: projectTitle.trim() || 'Custom Bill of Materials (BOM)',
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        deadline: 'Within 24 Hours',
        requiredByDate: 'Commercial Batch Schedule',
        destinationHub: deliveryPincode || acc?.city || 'Delhi NCR / Noida Hub',
        status: 'OPEN',
        items: [
          {
            commodityId: 'custom-bom',
            commodityName: projectTitle.trim() || 'Custom BOM Commodity Batch',
            cut: 'Commercial Custom Cut',
            packaging: 'Factory Bulk Packs',
            quantityKg: 500,
          },
        ],
        commercialTerms: 'Delivered Landed Cost with 5% GST input credit.',
        certificatesRequired: ['NABL Batch Assay', 'FSSAI Lic. Verification'],
        invitations: [],
        notes: bomText.trim(),
      }
      saveStoredRfq(newRfq)

      setSubmittedSuccess(true)
      setBomText('')
      setProjectTitle('')
      setTargetBudget('')
      setDeliveryPincode('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#17233B] text-[#C9A45C]">
              Enterprise Sourcing Concierge
            </span>
            <span className="text-xs text-stone-500 font-medium">Guaranteed 4-Hour SLA · NABL Assays Included</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1322] mt-1">
            Managed Procurement Desk
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Hand off complex multi-commodity BOMs, private-label packaging mandates, or custom grade requirements to our senior dry fruit trade desk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Trade Desk! I have an urgent procurement mandate for factory production. Can we speak immediately?',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white shadow-sm"
          >
            <span>💬</span> WhatsApp Senior Desk
          </a>
        </div>
      </div>

      {/* SLA & Desk Features Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#C9A45C]/20 text-[#704B32] flex items-center justify-center font-bold text-sm">
            ⏱️
          </div>
          <div className="font-bold text-stone-900 text-sm">4-Hour Commercial SLA</div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Submit any multi-item requirement before 3 PM on business days, and receive benchmarked quotes with landed logistics rates before close of business.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            📑
          </div>
          <div className="font-bold text-stone-900 text-sm">BOM &amp; Custom Specs Routing</div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Upload your factory bill of materials or paste specifications directly. Our algorithms and commodity specialists match certified farms and cold chains.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#17233B] text-[#C9A45C] flex items-center justify-center font-bold text-sm">
            🔬
          </div>
          <div className="font-bold text-stone-900 text-sm">Pre-Dispatch NABL Verification</div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every mandate executed via the Desk includes pre-dispatch moisture, count-per-ounce, and aflatoxin assay certificates uploaded directly to your dossier.
          </p>
        </div>
      </div>

      {/* Main Grid: Submit BOM Form & Active Mandates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Submit Mandate / BOM Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
              Direct Desk Intake
            </span>
            <h2 className="font-serif text-xl font-bold text-[#0A1322]">
              Submit Bill of Materials or Custom Sourcing Mandate
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Paste your raw requirement or paste rows directly from your production ERP.
            </p>
          </div>

          {submittedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-2">
                <span>✓</span> Mandate Successfully Dispatched to Trade Desk
              </div>
              <p>
                Specialist Tariq Ahmad has received your specification. You will receive an automated comparison sheet and email notification within 4 hours.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmitBOM} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Project / Manufacturing Batch Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. November Roasted Granola Production Batch A-4"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#17233B] outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Paste BOM / Product Specifications (One commodity per line)
              </label>
              <textarea
                rows={6}
                required
                placeholder={`Example:
1. California Almonds Nonpareil Extra #1 (23/25) - 1,200 kg - Sliced 1.0mm
2. Kashmiri Organic Walnut Kernels (Grade 1 Light Halves) - 500 kg - Nitrogen flushed
3. GI Mithila Makhana 6 Suta Jumbo - 800 kg - Cleaned & graded
4. Green Cardamom 8mm bold - 50 kg - Master export carton`}
                value={bomText}
                onChange={(e) => setBomText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#17233B] outline-none text-xs font-mono leading-relaxed"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Include variety, cut/size, volume in kg or metric tons, and packaging preferences.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Target Landed Budget (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15,00,000 or Best Market"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#17233B] outline-none text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Plant / Delivery Hub Pincode
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 201301 (Greater Noida)"
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#17233B] outline-none text-xs font-mono"
                />
              </div>
            </div>

            {/* Optional Excel Upload drag area */}
            <div className="p-4 rounded-xl border-2 border-dashed border-stone-200 hover:border-stone-400 bg-stone-50/50 flex flex-col items-center justify-center text-center cursor-pointer">
              <span className="text-xl mb-1">📄</span>
              <span className="font-bold text-stone-700 text-xs">
                Or drag and drop Excel (.xlsx, .csv) / PDF Procurement Schedule
              </span>
              <span className="text-[10px] text-stone-500">Max file size 25MB · ERP exports supported</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#0A1322] hover:bg-[#17233B] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Routing to Senior Sourcing Specialist...</span>
              ) : (
                <>
                  <span>🚀</span> Dispatch Mandate to Trade Desk (4h SLA)
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Active Mandates & Dedicated Specialist Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Assigned Specialist Card */}
          <div className="bg-[#0A1322] text-stone-300 rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A45C]">
                Your Key Account Desk
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg font-bold text-white">
                TA
              </div>
              <div>
                <div className="font-bold text-white text-sm">Tariq Ahmad</div>
                <div className="text-xs text-stone-400">Head of Commodity Procurement &amp; Hedging</div>
                <div className="text-[10px] text-[#E7CBA8] mt-0.5">14+ Years in Agri-Dry Fruit Import Trade</div>
              </div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-400">Direct Phone:</span>
                <span className="font-mono text-white">+91 9717161809</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Email:</span>
                <span className="font-mono text-white">tariq@nutytales.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Assay Verification:</span>
                <span className="text-emerald-400 font-medium">NABL Accredited</span>
              </div>
            </div>
          </div>

          {/* Active Custom Mandates */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-sm text-[#0A1322]">Recent Sourcing Mandates</h3>
              <span className="text-[11px] text-stone-500 font-mono">{mandates.length} logged</span>
            </div>

            <div className="space-y-3">
              {mandates.length === 0 ? (
                <div className="py-8 text-center text-stone-400 space-y-1">
                  <div className="text-2xl">📋</div>
                  <div className="font-medium text-xs text-stone-600">No active custom mandates yet</div>
                  <div className="text-[11px] text-stone-400">Submit your production Bill of Materials on the left to receive audited bids.</div>
                </div>
              ) : (
                mandates.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-stone-900 leading-snug">{m.title}</div>
                      <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                        ID: {m.id} · {m.submittedAt}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                        m.status === 'ANALYZING'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : m.status === 'BIDS_READY'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {m.status === 'ANALYZING' ? 'SLA In-Progress' : 'Quotes Ready'}
                    </span>
                  </div>

                  <p className="text-stone-600 line-clamp-2 text-[11px] bg-white p-2 rounded-lg border border-stone-100">
                    {m.notes}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-stone-500">
                      SLA: <strong className="text-stone-800">{m.slaDeadline}</strong>
                    </span>
                    {m.status === 'BIDS_READY' && (
                      <Link
                        href="/b2b/quotes"
                        className="text-[#176B68] font-bold hover:underline"
                      >
                        Inspect Quotes →
                      </Link>
                    )}
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
