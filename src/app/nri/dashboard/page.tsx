'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { NriStore } from '@/lib/nri/nri-store'
import {
  NriRequest,
  FamilyMemberProfile,
  PropertyProfile,
  RequestStatus,
} from '@/lib/nri/types'

export default function MyIndiaDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'family' | 'properties' | 'requests' | 'documents' | 'timeline'
  >('overview')

  const [requests, setRequests] = useState<NriRequest[]>([])
  const [family, setFamily] = useState<FamilyMemberProfile[]>([])
  const [properties, setProperties] = useState<PropertyProfile[]>([])
  const [selectedRequest, setSelectedRequest] = useState<NriRequest | null>(null)
  const [disputeReason, setDisputeReason] = useState('')
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  // Modals for adding family and property
  const [addFamilyOpen, setAddFamilyOpen] = useState(false)
  const [newFamilyName, setNewFamilyName] = useState('')
  const [newFamilyRelation, setNewFamilyRelation] = useState('Parents')
  const [newFamilyCity, setNewFamilyCity] = useState('Srinagar')
  const [newFamilyPhone, setNewFamilyPhone] = useState('')
  const [newFamilyNotes, setNewFamilyNotes] = useState('')

  const [addPropOpen, setAddPropOpen] = useState(false)
  const [newPropName, setNewPropName] = useState('')
  const [newPropType, setNewPropType] = useState<PropertyProfile['propertyType']>('Independent House')
  const [newPropCity, setNewPropCity] = useState('Srinagar')
  const [newPropAddress, setNewPropAddress] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const reqs = NriStore.getRequests()
    const fam = NriStore.getFamilyMembers()
    const props = NriStore.getProperties()
    setRequests(reqs)
    setFamily(fam)
    setProperties(props)
    if (reqs.length > 0 && !selectedRequest) {
      setSelectedRequest(reqs[0])
    }
  }

  const handleApproveProof = (reqId: string) => {
    const updated = NriStore.approveProof(reqId)
    if (updated) {
      setActionMessage('✓ Service proof approved! Final milestone payment released to provider.')
      loadData()
      setSelectedRequest(updated)
      setTimeout(() => setActionMessage(null), 5000)
    }
  }

  const handleRaiseDispute = (reqId: string) => {
    if (!disputeReason.trim()) return
    const updated = NriStore.disputeProof(reqId, disputeReason)
    if (updated) {
      setActionMessage('⚠️ Dispute logged and escalated to Nuty Tales Operations Supervisor.')
      setDisputeReason('')
      loadData()
      setSelectedRequest(updated)
      setTimeout(() => setActionMessage(null), 5000)
    }
  }

  const handleSaveFamily = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFamilyName.trim() || !newFamilyPhone.trim()) return

    const newMember: FamilyMemberProfile = {
      id: `fam-${Date.now()}`,
      userId: 'current-user',
      name: newFamilyName,
      relation: newFamilyRelation,
      city: newFamilyCity,
      address: `${newFamilyCity}, India`,
      phone: newFamilyPhone,
      emergencyContact: true,
      notes: newFamilyNotes,
    }

    NriStore.saveFamilyMember(newMember)
    setAddFamilyOpen(false)
    setNewFamilyName('')
    setNewFamilyPhone('')
    setNewFamilyNotes('')
    loadData()
    setActionMessage('✓ Family member profile saved to My India!')
    setTimeout(() => setActionMessage(null), 4000)
  }

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPropName.trim() || !newPropAddress.trim()) return

    const newProp: PropertyProfile = {
      id: `prop-${Date.now()}`,
      userId: 'current-user',
      name: newPropName,
      propertyType: newPropType,
      city: newPropCity,
      state: newPropCity === 'Srinagar' ? 'Jammu & Kashmir' : 'Delhi NCR',
      pincode: '190001',
      address: newPropAddress,
      status: 'Routine Care',
      inspectionFrequency: 'Monthly',
      lastInspectionDate: new Date().toISOString().split('T')[0],
    }

    NriStore.saveProperty(newProp)
    setAddPropOpen(false)
    setNewPropName('')
    setNewPropAddress('')
    loadData()
    setActionMessage('✓ Property profile registered to My India!')
    setTimeout(() => setActionMessage(null), 4000)
  }

  // Aggregate Stats
  const activeReqs = requests.filter((r) => r.status !== 'completed' && r.status !== 'cancelled')
  const proofsAwaitingApproval = requests.filter((r) => r.status === 'proof_submitted')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ── Greeting & Command Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A45C] mb-1">
            <span>🏛️</span>
            <span>MY INDIA OPERATING SYSTEM</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Welcome back. Your India, all in one place.
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light mt-1">
            Overseas account for <strong className="text-white">Tariq Wani (London, UK)</strong> • Multi-city liaison active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#request-engine"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-xs font-bold shadow-md hover:shadow-[#C9A45C]/20 transition-all flex items-center gap-1.5"
          >
            <span>⚡</span>
            <span>New India Request</span>
          </Link>
          <Link
            href="/emergency"
            className="px-3.5 py-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-600 hover:text-white transition-colors"
          >
            🚨 Emergency
          </Link>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-medium animate-fadeIn">
          {actionMessage}
        </div>
      )}

      {/* ── Quick KPI Metric Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0E1524] p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Active Requests</span>
          <span className="font-serif text-2xl font-bold text-white mt-1 block">
            {activeReqs.length}
          </span>
          <span className="text-[10px] text-[#C9A45C]">Under ground coordination</span>
        </div>

        <div className="bg-[#0E1524] p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Family Protected</span>
          <span className="font-serif text-2xl font-bold text-white mt-1 block">{family.length}</span>
          <span className="text-[10px] text-emerald-400">Regular visits scheduled</span>
        </div>

        <div className="bg-[#0E1524] p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Properties Monitored</span>
          <span className="font-serif text-2xl font-bold text-white mt-1 block">{properties.length}</span>
          <span className="text-[10px] text-stone-400">Srinagar & Delhi NCR</span>
        </div>

        <div className="bg-[#0E1524] p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Proof Awaiting Sign-Off</span>
          <span className="font-serif text-2xl font-bold text-amber-400 mt-1 block">
            {proofsAwaitingApproval.length}
          </span>
          <span className="text-[10px] text-amber-300">Requires your inspection</span>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2 text-xs">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'requests', label: `Service Requests (${requests.length})`, icon: '⚡' },
          { id: 'family', label: `Family & Parents (${family.length})`, icon: '❤️' },
          { id: 'properties', label: `Properties (${properties.length})`, icon: '🏡' },
          { id: 'documents', label: 'Document Vault', icon: '📂' },
          { id: 'timeline', label: 'Activity Timeline', icon: '🕒' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[#C9A45C] text-[#0E1524] shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── TAB 1: OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Urgent Attention Box: Proofs Awaiting Review */}
          {proofsAwaitingApproval.length > 0 && (
            <div className="rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📸</span>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Service Proof Ready for Your Approval
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black uppercase">
                  Action Required
                </span>
              </div>

              {proofsAwaitingApproval.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#0E1524] rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-white text-sm">{req.extractedPlan.title}</h4>
                    <span className="text-xs text-stone-400">
                      Executed by {req.proof?.providerName} at {req.proof?.locationLabel}
                    </span>
                    <p className="text-xs text-stone-300 font-light mt-1">
                      {req.proof?.reportSummary}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRequest(req)
                      setActiveTab('requests')
                    }}
                    className="px-4 py-2 rounded-xl bg-[#C9A45C] text-[#0E1524] text-xs font-bold hover:bg-[#DFBC72] whitespace-nowrap"
                  >
                    Inspect Photo Proof Dossier →
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Two-Column Grid: Family Wellness + Property Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Family Status Card */}
            <div className="bg-[#0E1524] p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">❤️</span>
                  <h3 className="font-serif text-lg font-bold text-white">Family in India</h3>
                </div>
                <button
                  onClick={() => setActiveTab('family')}
                  className="text-xs text-[#C9A45C] hover:underline"
                >
                  Manage Profiles →
                </button>
              </div>

              <div className="space-y-3">
                {family.map((member) => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-sm">{member.name}</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {member.relation} ({member.city})
                      </span>
                    </div>
                    <p className="text-stone-300 text-xs font-light">{member.notes}</p>
                    {member.upcomingVisit && (
                      <span className="text-[11px] text-[#C9A45C] font-semibold block pt-1">
                        🗓️ {member.upcomingVisit}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Properties Status Card */}
            <div className="bg-[#0E1524] p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏡</span>
                  <h3 className="font-serif text-lg font-bold text-white">Properties Monitored</h3>
                </div>
                <button
                  onClick={() => setActiveTab('properties')}
                  className="text-xs text-[#C9A45C] hover:underline"
                >
                  View Dossiers →
                </button>
              </div>

              <div className="space-y-3">
                {properties.map((prop) => (
                  <div
                    key={prop.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-sm">{prop.name}</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        {prop.status}
                      </span>
                    </div>
                    <span className="text-stone-400 block text-[11px]">
                      📍 {prop.address}, {prop.city}
                    </span>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-stone-300">
                      <span>Inspection: {prop.inspectionFrequency}</span>
                      <span className="text-emerald-400">Last visited: {prop.lastInspectionDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: REQUESTS & PROOFS ── */}
      {activeTab === 'requests' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Request List (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Your Service Requests
              </h3>
              {requests.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRequest(r)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    selectedRequest?.id === r.id
                      ? 'bg-[#17233B] border-[#C9A45C] shadow-lg'
                      : 'bg-[#0E1524] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#C9A45C] font-semibold">
                      {r.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        r.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : r.status === 'proof_submitted'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {r.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-xs line-clamp-1">
                    {r.extractedPlan.title}
                  </h4>
                  <span className="text-[11px] text-stone-400 block">
                    📍 {r.extractedPlan.destination_city} • {r.extractedPlan.categoryLabel}
                  </span>
                </div>
              ))}
            </div>

            {/* Selected Request Detail & Proof Inspector (8 cols) */}
            <div className="lg:col-span-8 bg-[#0E1524] p-6 rounded-3xl border border-white/10 space-y-6">
              {selectedRequest ? (
                <>
                  <div className="border-b border-white/10 pb-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-serif text-2xl font-bold text-white">
                        {selectedRequest.extractedPlan.title}
                      </h3>
                      <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40 self-start">
                        Status: {selectedRequest.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 font-light">
                      {selectedRequest.extractedPlan.summary}
                    </p>
                  </div>

                  {/* Proof of Work Showcase if submitted */}
                  {selectedRequest.proof && (
                    <div className="space-y-4 bg-black/30 p-5 rounded-2xl border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-bold block">
                            Verified Ground Proof of Service
                          </span>
                          <h4 className="font-bold text-white text-sm">
                            Inspector: {selectedRequest.proof.providerName}
                          </h4>
                          <span className="text-xs text-stone-400">
                            Location: {selectedRequest.proof.locationLabel}
                          </span>
                        </div>
                        <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          GPS Timestamp Verified
                        </span>
                      </div>

                      {/* Photo Gallery */}
                      <div>
                        <span className="text-xs text-stone-400 font-semibold mb-2 block">
                          Inspection Photo Dossier:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {selectedRequest.proof.photos.map((ph, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl overflow-hidden border border-white/15 bg-black/40 space-y-1.5 p-1"
                            >
                              <img
                                src={ph.url}
                                alt={ph.caption}
                                className="w-full h-36 object-cover rounded-lg"
                              />
                              <div className="p-1">
                                <span className="text-[11px] text-white font-medium block line-clamp-1">
                                  {ph.caption}
                                </span>
                                <span className="text-[10px] text-stone-400 block font-mono">
                                  {ph.timestamp}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-1.5 pt-2">
                        <span className="text-xs text-stone-400 font-semibold block">
                          Completed Checklist:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {selectedRequest.proof.checklist.map((chk, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2"
                            >
                              <span className="text-emerald-400 font-bold">✓</span>
                              <div>
                                <strong className="text-white block">{chk.item}</strong>
                                {chk.note && <span className="text-stone-400 text-[11px]">{chk.note}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Supervisor Report */}
                      <div className="p-3 rounded-xl bg-white/5 text-xs text-stone-300">
                        <strong className="text-[#C9A45C] block">Supervisor Summary:</strong>
                        <p className="font-light">{selectedRequest.proof.reportSummary}</p>
                      </div>

                      {/* Customer Approval Actions */}
                      {selectedRequest.status === 'proof_submitted' && (
                        <div className="pt-4 border-t border-white/10 space-y-3">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <span className="text-xs text-stone-300">
                              Does this inspection meet your standards?
                            </span>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <button
                                onClick={() => handleApproveProof(selectedRequest.id)}
                                className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md"
                              >
                                ✓ Approve & Release Final Milestone
                              </button>
                            </div>
                          </div>

                          {/* Dispute Form */}
                          <div className="pt-2 border-t border-white/5 flex gap-2">
                            <input
                              type="text"
                              value={disputeReason}
                              onChange={(e) => setDisputeReason(e.target.value)}
                              placeholder="Need clarification or have an issue? Enter details here..."
                              className="flex-1 bg-[#1A263D] text-white text-xs rounded-xl px-3 py-2 border border-white/10"
                            />
                            <button
                              onClick={() => handleRaiseDispute(selectedRequest.id)}
                              className="px-4 py-2 rounded-xl bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold hover:bg-rose-600 hover:text-white"
                            >
                              Raise Dispute
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedRequest.status === 'completed' && (
                        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                          <span>✓</span>
                          <span>Service Completed & Approved. Final milestone released.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* History Timeline */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Request History:
                    </span>
                    <div className="space-y-1.5 text-xs text-stone-300">
                      {selectedRequest.history.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[#C9A45C]">●</span>
                            <span className="font-semibold capitalize">{h.status.replace('_', ' ')}</span>
                            {h.note && <span className="text-stone-400 text-[11px]">— {h.note}</span>}
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {new Date(h.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-stone-400 text-xs">
                  Select a request on the left to inspect its details and proof dossiers.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: FAMILY & PARENTS ── */}
      {activeTab === 'family' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Family Members in India</h3>
              <p className="text-xs text-stone-300 font-light">
                Registered beneficiaries for regular companion visits, doctor appointments, and grocery coordination.
              </p>
            </div>
            <button
              onClick={() => setAddFamilyOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#C9A45C] text-[#0E1524] text-xs font-bold shadow-md hover:bg-[#DFBC72]"
            >
              + Add Family Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {family.map((f) => (
              <div
                key={f.id}
                className="bg-[#0E1524] p-6 rounded-3xl border border-white/10 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-white">{f.name}</h4>
                    <span className="text-xs text-[#C9A45C] font-semibold">
                      {f.relation} • {f.city}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    Emergency Contact
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-300">
                  <p>
                    <strong className="text-stone-400">Address:</strong> {f.address}
                  </p>
                  <p>
                    <strong className="text-stone-400">Direct Phone:</strong> {f.phone}
                  </p>
                  {f.preferredDoctor && (
                    <p>
                      <strong className="text-stone-400">Preferred Physician:</strong> {f.preferredDoctor}
                    </p>
                  )}
                  {f.notes && (
                    <p className="p-2 rounded-xl bg-white/5 text-stone-300 font-light">
                      {f.notes}
                    </p>
                  )}
                </div>

                {f.upcomingVisit && (
                  <div className="p-3 rounded-2xl bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-xs text-stone-200">
                    <strong className="text-[#C9A45C] block">Upcoming Escort Visit:</strong>
                    <span>{f.upcomingVisit}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Family Modal */}
          {addFamilyOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-[#10192A] border border-white/20 rounded-3xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="font-serif text-lg font-bold text-white">Add Family Member Profile</h4>
                  <button onClick={() => setAddFamilyOpen(false)} className="text-stone-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSaveFamily} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newFamilyName}
                      onChange={(e) => setNewFamilyName(e.target.value)}
                      required
                      placeholder="e.g. Ghulam Mohammad"
                      className="w-full bg-[#1A263D] text-white p-2.5 rounded-xl border border-white/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-400 mb-1">Relationship</label>
                      <input
                        type="text"
                        value={newFamilyRelation}
                        onChange={(e) => setNewFamilyRelation(e.target.value)}
                        className="w-full bg-[#1A263D] text-white p-2.5 rounded-xl border border-white/10"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">City in India</label>
                      <input
                        type="text"
                        value={newFamilyCity}
                        onChange={(e) => setNewFamilyCity(e.target.value)}
                        className="w-full bg-[#1A263D] text-white p-2.5 rounded-xl border border-white/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Phone Number (+91...)</label>
                    <input
                      type="tel"
                      value={newFamilyPhone}
                      onChange={(e) => setNewFamilyPhone(e.target.value)}
                      required
                      placeholder="+91-9419012345"
                      className="w-full bg-[#1A263D] text-white p-2.5 rounded-xl border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Care Notes & Medical Context</label>
                    <textarea
                      rows={2}
                      value={newFamilyNotes}
                      onChange={(e) => setNewFamilyNotes(e.target.value)}
                      placeholder="e.g. Takes BP medication; needs staircase walking companion."
                      className="w-full bg-[#1A263D] text-white p-2.5 rounded-xl border border-white/10"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddFamilyOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 text-stone-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#C9A45C] text-[#0E1524] font-bold"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: PROPERTIES ── */}
      {activeTab === 'properties' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Properties Under Management</h3>
              <p className="text-xs text-stone-300 font-light">
                Ancestral estates, tenant apartments, and vacant properties monitored with GPS-timestamped inspections.
              </p>
            </div>
            <button
              onClick={() => setAddPropOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#C9A45C] text-[#0E1524] text-xs font-bold shadow-md hover:bg-[#DFBC72]"
            >
              + Register Property
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((p) => (
              <div
                key={p.id}
                className="bg-[#0E1524] p-6 rounded-3xl border border-white/10 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-white">{p.name}</h4>
                    <span className="text-xs text-[#C9A45C] font-semibold">
                      {p.propertyType} • {p.city}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                    {p.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-stone-300 font-light">
                  <p>
                    <strong className="text-stone-400">Address:</strong> {p.address}, {p.city}
                  </p>
                  {p.electricityConsumerNo && (
                    <p>
                      <strong className="text-stone-400">Electricity Account:</strong> {p.electricityConsumerNo}
                    </p>
                  )}
                  {p.notes && (
                    <p className="p-2 rounded-xl bg-white/5 text-stone-300 font-light mt-2">
                      {p.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-stone-400">
                    Schedule: <strong className="text-white">{p.inspectionFrequency}</strong>
                  </span>
                  <Link
                    href="/#request-engine"
                    className="text-[#C9A45C] font-semibold hover:underline"
                  >
                    Schedule Walkthrough →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Add Property Modal */}
          {addPropOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-[#10192A] border border-white/20 rounded-3xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="font-serif text-lg font-bold text-white">Register Property Profile</h4>
                  <button onClick={() => setAddPropOpen(false)} className="text-stone-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSaveProperty} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Property Name</label>
                    <input
                      type="text"
                      value={newPropName}
                      onChange={(e) => setNewPropName(e.target.value)}
                      required
                      placeholder="e.g. Harwan Ancestral House"
                      className="w-full bg-[#1A263D] text-white p-2.5 rounded-xl border border-white/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-400 mb-1">Property Type</label>
                      <select
                        value={newPropType}
                        onChange={(e) => setNewPropType(e.target.value as any)}
                        className="w-full bg-[#1A263D] text-white p-2.5 rounded-xl border border-white/10"
                      >
                        <option value="Independent House">Independent House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Orchard / Estate">Orchard / Estate</option>
                        <option value="Commercial Office">Commercial Office</option>
                        <option value="Plot / Land">Plot / Land</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-400 mb-1">City in India</label>
                      <input
                        type="text"
                        value={newPropCity}
                        onChange={(e) => setNewPropCity(e.target.value)}
                        className="w-full bg-[#1A263D] text-white p-2.5 rounded-xl border border-white/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Address / Landmark</label>
                    <textarea
                      rows={2}
                      value={newPropAddress}
                      onChange={(e) => setNewPropAddress(e.target.value)}
                      required
                      placeholder="e.g. Near Mughal Garden Canal, Harwan, Srinagar"
                      className="w-full bg-[#1A263D] text-white p-2.5 rounded-xl border border-white/10"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddPropOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 text-stone-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#C9A45C] text-[#0E1524] font-bold"
                    >
                      Register Property
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: DOCUMENT VAULT ── */}
      {activeTab === 'documents' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Private Document Vault</h3>
              <p className="text-xs text-stone-300 font-light">
                Encrypted storage for Power of Attorney drafts, Title Deeds, Mutation Fard, and CA Certifications.
              </p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-[#C9A45C] text-[#0E1524] text-xs font-bold">
              + Upload Confidential Document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Power of Attorney (Sub-Registrar Stamped)',
                type: 'Legal Document',
                date: '2026-08-12',
                size: '2.4 MB',
                badge: 'Verified Legal Deed',
              },
              {
                title: 'Jamabandi & Intiqal Mutation Copy (Srinagar)',
                type: 'Revenue Record',
                date: '2026-07-04',
                size: '1.8 MB',
                badge: 'Tehsildar Certified',
              },
              {
                title: 'Form 15CB CA Repatriation Certificate',
                type: 'Tax & FEMA',
                date: '2026-06-20',
                size: '850 KB',
                badge: 'ICAI Signed',
              },
            ].map((doc, i) => (
              <div
                key={i}
                className="bg-[#0E1524] p-5 rounded-2xl border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-xl">📄</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C]/20 text-[#C9A45C]">
                    {doc.badge}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs leading-snug">{doc.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-white/10">
                  <span>{doc.date}</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 6: ACTIVITY TIMELINE ── */}
      {activeTab === 'timeline' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white">Chronological Execution Log</h3>
            <p className="text-xs text-stone-300 font-light">
              Unified transparent audit record across requests, visits, payments, and document releases.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                date: '07 Oct 2026, 15:00 IST',
                event: 'Pre-Winter Inspection Completed & Proof Uploaded',
                actor: 'Farooq Ahmad Mir (Srinagar Ground Coordinator)',
                tag: 'Proof Submitted',
              },
              {
                date: '05 Oct 2026, 09:00 IST',
                event: 'Site Walkthrough Mobilized for Harwan Orchard Estate',
                actor: 'Mir Estate Solutions',
                tag: 'In Progress',
              },
              {
                date: '03 Oct 2026, 15:20 IST',
                event: 'Service Quotation (₹3,999) Accepted & Initial Milestone Authorized in Custody',
                actor: 'Tariq Wani (Customer)',
                tag: 'Milestone Authorized',
              },
              {
                date: '02 Oct 2026, 10:30 IST',
                event: 'Natural Language Request Submitted from London, UK',
                actor: 'Customer via Web Portal',
                tag: 'Request Created',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="bg-[#0E1524] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#C9A45C]">●</span>
                    <strong className="text-white">{t.event}</strong>
                  </div>
                  <span className="text-stone-400 text-[11px] block">{t.actor}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-stone-300">
                    {t.tag}
                  </span>
                  <span className="text-stone-400 text-[11px] font-mono">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
