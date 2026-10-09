'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { NriStore } from '@/lib/nri/nri-store'
import { NriRequest, ServiceProofItem } from '@/lib/nri/types'

export default function ProviderWorkspacePage() {
  const [requests, setRequests] = useState<NriRequest[]>([])
  const [activeTab, setActiveTab] = useState<'assigned' | 'proof_upload' | 'earnings'>('assigned')
  const [selectedReq, setSelectedReq] = useState<NriRequest | null>(null)

  // Proof upload form state
  const [proofSummary, setProofSummary] = useState('')
  const [photoCaption, setPhotoCaption] = useState('Boundary Wall & Main Gate Checked')
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=600&auto=format&fit=crop&q=80')
  const [check1, setCheck1] = useState(true)
  const [check2, setCheck2] = useState(true)
  const [check3, setCheck3] = useState(true)
  const [successNote, setSuccessNote] = useState<string | null>(null)

  useEffect(() => {
    const all = NriStore.getRequests()
    setRequests(all)
    if (all.length > 0) setSelectedReq(all[0])
  }, [])

  const handleUploadProof = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReq) return

    const proof: ServiceProofItem = {
      id: `proof-${Date.now()}`,
      requestId: selectedReq.id,
      providerId: 'prov-kash-prop-01',
      providerName: 'Farooq Ahmad Mir (Mir Estate Solutions)',
      timestamp: new Date().toISOString(),
      locationLabel: `${selectedReq.extractedPlan.destination_city} Site (GPS Tagged: 34.1526° N, 74.8994° E)`,
      checklist: [
        { item: 'Boundary & main entrance security check', completed: check1, note: 'Confirmed locked and secure.' },
        { item: 'Plumbing & pipe thermal insulation', completed: check2, note: 'Wrapped exterior lines.' },
        { item: 'Electricity & utility meter record', completed: check3, note: 'Meter reading photographed and logged.' },
      ],
      photos: [
        {
          url: photoUrl,
          caption: photoCaption,
          timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
          type: 'after',
        },
      ],
      reportSummary: proofSummary || 'Ground physical walkthrough completed with zero anomalies found.',
      customerApproval: 'pending',
    }

    selectedReq.proof = proof
    selectedReq.status = 'proof_submitted'
    selectedReq.history.push({
      status: 'proof_submitted',
      timestamp: new Date().toISOString(),
      actor: 'provider',
      note: 'Ground coordinator uploaded photo dossier and checklist proof.',
    })

    NriStore.saveRequest(selectedReq)
    setSuccessNote('✓ Proof Dossier uploaded successfully! The overseas customer has been notified for sign-off.')
    setTimeout(() => setSuccessNote(null), 5000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#0E1524] text-white rounded-3xl p-6 sm:p-10 border border-[#1E293B] shadow-2xl space-y-8">
        {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <span>🛠️</span>
            <span>PROVIDER OPERATING WORKSPACE</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
            Farooq Ahmad Mir • Mir Estate Solutions
          </h1>
          <p className="text-xs text-stone-300 font-light">
            Verified Premier Partner • Coverage: Srinagar, Kashmir Valley • Active Jobs: {requests.length}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-white/5 text-stone-300 text-xs font-semibold border border-white/10 hover:bg-white/10"
          >
            Switch to Customer View
          </Link>
        </div>
      </div>

      {successNote && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-medium animate-fadeIn">
          {successNote}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 text-xs pb-2">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'assigned' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-400 hover:text-white'
          }`}
        >
          Assigned Engagements ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('proof_upload')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'proof_upload' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-400 hover:text-white'
          }`}
        >
          Upload Service Proof Dossier 📸
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'earnings' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-400 hover:text-white'
          }`}
        >
          Milestones & Earnings 💰
        </button>
      </div>

      {/* ── TAB 1: ASSIGNED ENGAGEMENTS ── */}
      {activeTab === 'assigned' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-[#0E1524] rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C9A45C] font-semibold">{r.id}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300">
                    {r.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-white">{r.extractedPlan.title}</h3>
                <p className="text-xs text-stone-300 font-light leading-relaxed">
                  {r.extractedPlan.summary}
                </p>

                <div className="p-3 rounded-2xl bg-white/5 text-xs text-stone-300 space-y-1">
                  <div>Client Location: <strong className="text-white">{r.extractedPlan.country_of_residence}</strong></div>
                  <div>Indian Hub: <strong className="text-white">{r.extractedPlan.destination_city}</strong></div>
                  <div>Contract Value: <strong className="text-[#C9A45C]">₹{r.quotes[0]?.totalAmount.toLocaleString('en-IN') || '3,999'}</strong></div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedReq(r)
                    setActiveTab('proof_upload')
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C9A45C] text-[#0E1524] text-xs font-bold hover:bg-[#DFBC72]"
                >
                  Upload Proof of Work →
                </button>
                <Link href={`/requests/${r.id}`} className="text-xs text-stone-400 hover:text-white">
                  Inspect Public Record
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 2: PROOF UPLOAD ── */}
      {activeTab === 'proof_upload' && selectedReq && (
        <form
          onSubmit={handleUploadProof}
          className="bg-[#0E1524] rounded-3xl p-8 border border-white/10 space-y-6 max-w-3xl mx-auto animate-fadeIn text-xs"
        >
          <div className="border-b border-white/10 pb-4">
            <span className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-bold block">
              Proof of Execution Submission
            </span>
            <h3 className="font-serif text-xl font-bold text-white mt-1">
              {selectedReq.extractedPlan.title} ({selectedReq.id})
            </h3>
          </div>

          <div className="space-y-2">
            <label className="block text-stone-400 font-semibold">
              Ground Checklist Verification:
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <input type="checkbox" checked={check1} onChange={(e) => setCheck1(e.target.checked)} />
                <span className="text-stone-200">Main gate perimeter & boundary security verified</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <input type="checkbox" checked={check2} onChange={(e) => setCheck2(e.target.checked)} />
                <span className="text-stone-200">Plumbing lines drained & winter thermal wrap installed</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <input type="checkbox" checked={check3} onChange={(e) => setCheck3(e.target.checked)} />
                <span className="text-stone-200">Utility meters photographed and verified</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-stone-400 font-semibold">
              High-Resolution Photographic Proof URL:
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full bg-[#1A263D] text-white p-3 rounded-xl border border-white/10 font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-stone-400 font-semibold">
              Photo Caption / Notes:
            </label>
            <input
              type="text"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              className="w-full bg-[#1A263D] text-white p-3 rounded-xl border border-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-stone-400 font-semibold">
              Detailed Written Supervisor Report:
            </label>
            <textarea
              rows={3}
              value={proofSummary}
              onChange={(e) => setProofSummary(e.target.value)}
              placeholder="e.g. Conducted site audit on 07 Oct. The caretaker was present. Boundary walls are clean. No moisture damage on ceiling."
              className="w-full bg-[#1A263D] text-white p-3 rounded-xl border border-white/10"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-lg transition-all"
            >
              Submit Proof to Overseas Customer →
            </button>
          </div>
        </form>
      )}

      {/* ── TAB 3: EARNINGS ── */}
      {activeTab === 'earnings' && (
        <div className="bg-[#0E1524] rounded-3xl p-8 border border-white/10 space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Total Dispatched</span>
              <span className="font-serif text-2xl font-bold text-white mt-1 block">₹58,400</span>
              <span className="text-[10px] text-emerald-400">14 Engagements completed</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">In Milestone Custody</span>
              <span className="font-serif text-2xl font-bold text-[#C9A45C] mt-1 block">₹6,399</span>
              <span className="text-[10px] text-stone-400">Releases upon customer sign-off</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Average Satisfaction</span>
              <span className="font-serif text-2xl font-bold text-amber-400 mt-1 block">4.96 ★</span>
              <span className="text-[10px] text-stone-400">48 Verified reviews</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
