'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { NriStore } from '@/lib/nri/nri-store'
import { NriProvider, NriRequest, EmergencyLead } from '@/lib/nri/types'

export default function NriAdminCommandCenterPage() {
  const [providers, setProviders] = useState<NriProvider[]>([])
  const [requests, setRequests] = useState<NriRequest[]>([])
  const [emergencyLeads, setEmergencyLeads] = useState<EmergencyLead[]>([])
  const [activeTab, setActiveTab] = useState<'verification' | 'requests' | 'emergency'>('verification')
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = () => {
    setProviders(NriStore.getProviders())
    setRequests(NriStore.getRequests())
    setEmergencyLeads(NriStore.getEmergencyLeads())
  }

  const handleApproveProvider = (provId: string) => {
    const provs = NriStore.getProviders()
    const p = provs.find((item) => item.id === provId)
    if (p) {
      p.verificationStatus = 'verified'
      p.verificationLevel = 'Licensed Professional'
      NriStore.saveProvider(p)
      loadAll()
      setActionNotice(`✓ Provider ${p.name} verified and activated in public marketplace!`)
      setTimeout(() => setActionNotice(null), 4000)
    }
  }

  const handleRejectProvider = (provId: string) => {
    const provs = NriStore.getProviders()
    const p = provs.find((item) => item.id === provId)
    if (p) {
      p.verificationStatus = 'rejected'
      NriStore.saveProvider(p)
      loadAll()
      setActionNotice(`⚠️ Provider ${p.name} marked as rejected.`)
      setTimeout(() => setActionNotice(null), 4000)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A45C] mb-1">
            <span>🛡️</span>
            <span>STAFF OPERATIONS & COMPLIANCE DESK</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
            Nuty Tales NRI Operations Command Center
          </h1>
          <p className="text-xs text-stone-300 font-light">
            Cross-border verification review, request auditing, dispute mediation & emergency escalation logs.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-xl bg-white/5 text-stone-300 text-xs font-semibold border border-white/10 hover:bg-white/10 self-start sm:self-auto"
        >
          View as Customer
        </Link>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-medium animate-fadeIn">
          {actionNotice}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#0E1524] p-4 rounded-2xl border border-white/10">
          <span className="text-[10px] text-stone-400 uppercase block">Pending Verifications</span>
          <span className="font-serif text-2xl font-bold text-[#C9A45C] mt-1 block">
            {providers.filter((p) => p.verificationStatus !== 'verified').length}
          </span>
          <span className="text-[10px] text-stone-400">Applications awaiting review</span>
        </div>

        <div className="bg-[#0E1524] p-4 rounded-2xl border border-white/10">
          <span className="text-[10px] text-stone-400 uppercase block">Active Service Requests</span>
          <span className="font-serif text-2xl font-bold text-white mt-1 block">
            {requests.length}
          </span>
          <span className="text-[10px] text-emerald-400">Under ground coordination</span>
        </div>

        <div className="bg-[#0E1524] p-4 rounded-2xl border border-white/10">
          <span className="text-[10px] text-stone-400 uppercase block">Disputes / Proof Reviews</span>
          <span className="font-serif text-2xl font-bold text-amber-400 mt-1 block">
            {requests.filter((r) => r.status === 'proof_submitted' || r.status === 'disputed').length}
          </span>
          <span className="text-[10px] text-stone-400">Supervisory sign-off</span>
        </div>

        <div className="bg-[#0E1524] p-4 rounded-2xl border border-white/10">
          <span className="text-[10px] text-stone-400 uppercase block">Emergency Escalations</span>
          <span className="font-serif text-2xl font-bold text-rose-400 mt-1 block">
            {emergencyLeads.length}
          </span>
          <span className="text-[10px] text-rose-300">Urgent ground dispatches</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 text-xs pb-2">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'verification' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-400 hover:text-white'
          }`}
        >
          Provider Verification Queue ({providers.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'requests' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-400 hover:text-white'
          }`}
        >
          Service Engagements ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'emergency' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-400 hover:text-white'
          }`}
        >
          Emergency Escalations ({emergencyLeads.length})
        </button>
      </div>

      {/* ── TAB 1: PROVIDER VERIFICATION QUEUE ── */}
      {activeTab === 'verification' && (
        <div className="space-y-4 animate-fadeIn">
          {providers.map((prov) => (
            <div
              key={prov.id}
              className="bg-[#0E1524] rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <strong className="text-white text-base">{prov.name}</strong>
                  <span className="text-stone-400">({prov.businessName})</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      prov.verificationStatus === 'verified'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : prov.verificationStatus === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {prov.verificationStatus.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-stone-300 font-light leading-relaxed max-w-2xl">
                  {prov.bio}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-stone-400 text-[11px]">
                  <span>📍 Hubs: <strong className="text-stone-300">{prov.cities.join(', ')}</strong></span>
                  <span>Categories: <strong className="text-stone-300">{prov.categories.join(', ')}</strong></span>
                  <span>Contact: <strong className="text-stone-300">{prov.phone}</strong> • {prov.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center">
                {prov.verificationStatus !== 'verified' && (
                  <button
                    onClick={() => handleApproveProvider(prov.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold whitespace-nowrap"
                  >
                    ✓ Approve & Verify
                  </button>
                )}
                {prov.verificationStatus !== 'rejected' && (
                  <button
                    onClick={() => handleRejectProvider(prov.id)}
                    className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-semibold border border-rose-500/30 whitespace-nowrap"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 2: REQUEST AUDIT LOG ── */}
      {activeTab === 'requests' && (
        <div className="space-y-4 animate-fadeIn">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-[#0E1524] rounded-2xl p-6 border border-white/10 space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-[#C9A45C] block text-[11px] font-bold">{r.id}</span>
                  <strong className="text-white text-sm">{r.extractedPlan.title}</strong>
                  <span className="text-stone-400 block mt-0.5">
                    Client: {r.userName || 'Overseas'} ({r.extractedPlan.country_of_residence}) • Hub: {r.extractedPlan.destination_city}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-blue-500/20 text-blue-300">
                    {r.status.replace('_', ' ')}
                  </span>
                  <Link
                    href={`/requests/${r.id}`}
                    className="px-3 py-1 rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold"
                  >
                    Open Inspector →
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-300 text-[11px]">
                <div>
                  <strong>Quotes Count:</strong> {r.quotes.length}
                </div>
                <div>
                  <strong>Proof Dossier:</strong> {r.proof ? '✓ Uploaded' : 'None yet'}
                </div>
                <div>
                  <strong>History Events:</strong> {r.history.length} logged
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 3: EMERGENCY ESCALATIONS ── */}
      {activeTab === 'emergency' && (
        <div className="space-y-4 animate-fadeIn text-xs">
          {emergencyLeads.length === 0 ? (
            <div className="p-8 text-center text-stone-400 bg-[#0E1524] rounded-2xl border border-white/10">
              No emergency escalations logged in this session.
            </div>
          ) : (
            emergencyLeads.map((emg) => (
              <div
                key={emg.id}
                className="bg-[#0E1524] rounded-2xl p-6 border border-rose-500/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">🚨 {emg.nature}</span>
                    <span className="font-mono text-stone-400">({emg.id})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                    {emg.urgency}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-300">
                  <div>
                    <strong className="text-stone-400 block">Overseas Caller:</strong>
                    <span>{emg.contactName} ({emg.contactPhone})</span>
                  </div>
                  <div>
                    <strong className="text-stone-400 block">Person in India:</strong>
                    <span>{emg.inIndiaPerson} ({emg.inIndiaPhone})</span>
                  </div>
                  <div className="sm:col-span-2">
                    <strong className="text-stone-400 block">Location in India:</strong>
                    <span>{emg.locationAddress}, {emg.locationCity}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-stone-400 text-[11px]">
                  Dispatch Note: {emg.dispatchNotes}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
