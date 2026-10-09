'use client'

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NriStore } from '@/lib/nri/nri-store'
import { NriRequest } from '@/lib/nri/types'

export default function RequestTrackerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const resolvedParams = use(params)
  const requestId = resolvedParams.id

  const [req, setReq] = useState<NriRequest | null>(null)
  const [disputeReason, setDisputeReason] = useState('')
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  useEffect(() => {
    const found = NriStore.getRequestById(requestId)
    setReq(found)
  }, [requestId])

  const handleApprove = () => {
    if (!req) return
    const updated = NriStore.approveProof(req.id)
    if (updated) {
      setReq(updated)
      setActionNotice('✓ Service proof approved! Final milestone released to provider.')
      setTimeout(() => setActionNotice(null), 5000)
    }
  }

  const handleDispute = () => {
    if (!req || !disputeReason.trim()) return
    const updated = NriStore.disputeProof(req.id, disputeReason)
    if (updated) {
      setReq(updated)
      setDisputeReason('')
      setActionNotice('⚠️ Dispute submitted. Escalated to Nuty Tales Operations Supervisor.')
      setTimeout(() => setActionNotice(null), 5000)
    }
  }

  if (!req) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-white">Request Not Found</h2>
        <p className="text-xs text-stone-400">
          Request ID <span className="font-mono text-[#C9A45C]">{requestId}</span> was not found in your local session.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#C9A45C] text-[#0E1524] text-xs font-bold"
        >
          Return to My India Dashboard
        </Link>
      </div>
    )
  }

  const steps = [
    { key: 'submitted', label: 'Submitted' },
    { key: 'matching', label: 'Matching' },
    { key: 'quotes_received', label: 'Quote Sent' },
    { key: 'accepted', label: 'Accepted & Escrow' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'proof_submitted', label: 'Proof Ready' },
    { key: 'completed', label: 'Completed' },
  ]

  const currentIdx = steps.findIndex((s) => s.key === req.status)
  const activeStepIdx = currentIdx >= 0 ? currentIdx : 3

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-stone-400">
        <Link href="/dashboard" className="hover:text-white flex items-center gap-1">
          <span>← Back to My India Dashboard</span>
        </Link>
        <span className="font-mono text-stone-400">ID: {req.id}</span>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-medium animate-fadeIn">
          {actionNotice}
        </div>
      )}

      {/* Main Request Header */}
      <div className="bg-[#0E1524] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C]/20 text-[#C9A45C] uppercase tracking-wider">
                {req.extractedPlan.categoryLabel}
              </span>
              <span className="text-xs text-stone-400">
                📍 {req.extractedPlan.destination_city}, {req.extractedPlan.destination_state}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              {req.extractedPlan.title}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Current Status</span>
            <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block mt-1">
              {req.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* State Machine Stepper */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
            Execution Progress:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center text-xs">
            {steps.map((st, i) => {
              const isPast = i <= activeStepIdx
              const isCurrent = i === activeStepIdx
              return (
                <div
                  key={st.key}
                  className={`p-2 rounded-xl border text-[11px] transition-all ${
                    isCurrent
                      ? 'bg-[#C9A45C] text-[#0E1524] font-bold border-[#C9A45C] shadow-md'
                      : isPast
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 font-medium'
                      : 'bg-white/5 text-stone-400 border-white/10'
                  }`}
                >
                  <span className="block">{st.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
          {req.extractedPlan.summary}
        </p>
      </div>

      {/* Proof of Work Inspector (if present) */}
      {req.proof && (
        <div className="bg-[#0E1524] rounded-3xl p-6 sm:p-8 border-2 border-[#C9A45C]/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📸</span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Verified Inspection & Proof Dossier
                </h2>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Executed by {req.proof.providerName} • {req.proof.locationLabel}
              </p>
            </div>

            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 self-start">
              GPS Verified
            </span>
          </div>

          {/* Photo Gallery */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#C9A45C] font-bold block">
              High-Resolution Inspection Photos:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {req.proof.photos.map((ph, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 p-2 space-y-2"
                >
                  <img
                    src={ph.url}
                    alt={ph.caption}
                    className="w-full h-44 object-cover rounded-xl"
                  />
                  <div>
                    <strong className="text-white text-xs block">{ph.caption}</strong>
                    <span className="text-[10px] text-stone-400 font-mono">{ph.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2 pt-2">
            <span className="text-xs uppercase tracking-wider text-[#C9A45C] font-bold block">
              Itemized Physical Audit Checklist:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {req.proof.checklist.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5"
                >
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <span className="text-white font-medium block">{c.item}</span>
                    {c.note && <span className="text-stone-400 text-[11px]">{c.note}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supervisor Summary */}
          <div className="p-4 rounded-2xl bg-white/5 text-xs text-stone-300 space-y-1">
            <strong className="text-white block font-semibold">Supervisor Written Report:</strong>
            <p className="font-light">{req.proof.reportSummary}</p>
          </div>

          {/* Approval Bar */}
          {req.status === 'proof_submitted' && (
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-white text-sm">Customer Approval Checkpoint</h4>
                  <p className="text-xs text-stone-400">
                    Reviewing the photos and checklist above. Approving releases the held milestone payment.
                  </p>
                </div>

                <button
                  onClick={handleApprove}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-lg whitespace-nowrap"
                >
                  ✓ Approve Dossier & Release Payment
                </button>
              </div>

              {/* Dispute Input */}
              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Have an issue with this proof? Enter concerns for operations review..."
                  className="flex-1 bg-[#1A263D] text-white text-xs rounded-xl px-3 py-2 border border-white/10"
                />
                <button
                  onClick={handleDispute}
                  className="px-4 py-2 rounded-xl bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold hover:bg-rose-600 hover:text-white"
                >
                  Raise Dispute
                </button>
              </div>
            </div>
          )}

          {req.status === 'completed' && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <span>✓</span>
              <span>This engagement has been approved and completed. Milestone escrow released.</span>
            </div>
          )}
        </div>
      )}

      {/* Quote & Milestone Breakdown */}
      {req.quotes.length > 0 && (
        <div className="bg-[#0E1524] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="font-serif text-xl font-bold text-white">Contracted Quotation & Milestones</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-xs">
              <strong className="text-stone-400 block uppercase tracking-wider text-[11px]">
                Contracted Specialist:
              </strong>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-[#C9A45C] text-[#0E1524] flex items-center justify-center font-bold">
                  {req.quotes[0].providerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{req.quotes[0].providerName}</h4>
                  <span className="text-[11px] text-[#C9A45C]">{req.quotes[0].providerBadge}</span>
                </div>
              </div>
              <p className="text-stone-300 font-light italic">
                "{req.quotes[0].proposalNote}"
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <strong className="text-stone-400 block uppercase tracking-wider text-[11px]">
                Milestone Schedule:
              </strong>
              <div className="space-y-2">
                {req.quotes[0].milestones.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-white block">{m.title}</strong>
                      <span className="text-[10px] text-stone-400">{m.due_condition}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold block">₹{m.amount.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-[#C9A45C] uppercase">{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
