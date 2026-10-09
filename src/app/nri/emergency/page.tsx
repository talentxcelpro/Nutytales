'use client'

import React, { useState } from 'react'
import { OPERATIONAL_CITIES } from '@/lib/nri/nri-data'
import { NriStore } from '@/lib/nri/nri-store'
import { EmergencyLead } from '@/lib/nri/types'

export default function EmergencyAssistancePage() {
  const [selectedCity, setSelectedCity] = useState('Srinagar')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [inIndiaPerson, setInIndiaPerson] = useState('')
  const [inIndiaPhone, setInIndiaPhone] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [nature, setNature] = useState<EmergencyLead['nature']>('Elder Distress / Health')
  const [urgency, setUrgency] = useState<EmergencyLead['urgency']>('Immediate (1-2 Hours)')
  const [permissionGiven, setPermissionGiven] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [leadRecord, setLeadRecord] = useState<EmergencyLead | null>(null)

  const cityData =
    OPERATIONAL_CITIES.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase()) ||
    OPERATIONAL_CITIES[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName.trim() || !contactPhone.trim() || !inIndiaPerson.trim()) return

    const lead: EmergencyLead = {
      id: `emg-${Date.now()}`,
      contactName,
      contactPhone,
      contactCountry: 'Overseas Client',
      inIndiaPerson,
      inIndiaPhone,
      locationCity: selectedCity,
      locationAddress,
      nature,
      urgency,
      createdAt: new Date().toISOString(),
      status: 'Escalated',
      dispatchNotes: `Urgent lead recorded for ${selectedCity}. Alert dispatched to on-call ground supervisor.`,
    }

    NriStore.saveEmergencyLead(lead)
    setLeadRecord(lead)
    setSubmitted(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Red Alert Header */}
      <div className="rounded-3xl bg-rose-950/40 border-2 border-rose-500/40 p-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-widest">
          <span>🚨</span>
          <span>URGENT ON-GROUND COORDINATION</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          India Emergency Assistance Desk
        </h1>
        <p className="text-xs sm:text-sm text-rose-200 max-w-2xl mx-auto leading-relaxed">
          Urgent family assistance, senior distress, or sudden property compromise in India? Submit an expedited dispatch request to mobilize local ground coordinators.
        </p>

        {/* Vital Government Helplines Notice */}
        <div className="p-4 rounded-2xl bg-black/50 border border-rose-500/30 text-xs text-stone-200 max-w-xl mx-auto space-y-1">
          <strong className="text-white block">CRITICAL STATUTORY DISCLAIMER:</strong>
          <p className="font-light text-stone-300">
            Nuty Tales provides logistical and companion coordination. We are <strong>not</strong> a substitute for official state emergency services. In life-threatening medical emergencies or criminal incidents, immediately dial Indian National Emergency: <span className="text-rose-400 font-bold font-mono text-sm">112</span>.
          </p>
        </div>
      </div>

      {/* Localized Official Hotlines Directory */}
      <div className="bg-[#0E1524] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h2 className="font-serif text-xl font-bold text-white">
            Official Government Helplines for: {cityData.name} ({cityData.state})
          </h2>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-[#1A263D] text-white text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none"
          >
            {OPERATIONAL_CITIES.map((c) => (
              <option key={c.id} value={c.name}>
                📍 {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Police</span>
            <strong className="text-white text-sm block mt-0.5">{cityData.emergencyDirectory.police}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Ambulance</span>
            <strong className="text-rose-400 text-sm block mt-0.5">{cityData.emergencyDirectory.ambulance}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Senior Citizen</span>
            <strong className="text-[#C9A45C] text-sm block mt-0.5">{cityData.emergencyDirectory.seniorHelpline}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">NRI / Fire Desk</span>
            <strong className="text-stone-300 text-xs block mt-0.5">{cityData.emergencyDirectory.nriCell || cityData.emergencyDirectory.fire}</strong>
          </div>
        </div>
      </div>

      {/* Expedited Ground Dispatch Request Form */}
      {submitted && leadRecord ? (
        <div className="bg-[#0E1524] rounded-3xl p-8 border border-emerald-500/40 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-2xl mx-auto">
            ✓
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Emergency Dispatch Logged & Escalated
          </h2>
          <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
            Dispatch ID: <span className="font-mono text-[#C9A45C] font-bold">{leadRecord.id}</span>. Our on-call supervisor in {leadRecord.locationCity} has received this escalation and will initiate contact with your local reference immediately.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0E1524] rounded-3xl p-8 border border-white/10 space-y-6 text-xs"
        >
          <h3 className="font-serif text-xl font-bold text-white border-b border-white/10 pb-3">
            Expedited Ground Coordination Form
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 font-semibold mb-1">Your Name (Overseas Caller) *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Tariq Wani"
                className="w-full bg-[#1A263D] text-white p-3 rounded-xl border border-white/10"
              />
            </div>

            <div>
              <label className="block text-stone-400 font-semibold mb-1">Your Direct Phone / WhatsApp *</label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +44-7911-123456"
                className="w-full bg-[#1A263D] text-white p-3 rounded-xl border border-white/10"
              />
            </div>

            <div>
              <label className="block text-stone-400 font-semibold mb-1">Person in India Requiring Assistance *</label>
              <input
                type="text"
                required
                value={inIndiaPerson}
                onChange={(e) => setInIndiaPerson(e.target.value)}
                placeholder="e.g. Ghulam Mohammad (Father)"
                className="w-full bg-[#1A263D] text-white p-3 rounded-xl border border-white/10"
              />
            </div>

            <div>
              <label className="block text-stone-400 font-semibold mb-1">Their Local Phone Number in India *</label>
              <input
                type="tel"
                required
                value={inIndiaPhone}
                onChange={(e) => setInIndiaPhone(e.target.value)}
                placeholder="e.g. +91-9419012345"
                className="w-full bg-[#1A263D] text-white p-3 rounded-xl border border-white/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-400 font-semibold mb-1">Full Address / Landmark in India *</label>
            <textarea
              rows={2}
              required
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="e.g. House No. 42, Near Mughal Garden Upper Canal, Harwan, Srinagar"
              className="w-full bg-[#1A263D] text-white p-3 rounded-xl border border-white/10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 font-semibold mb-1">Nature of Situation</label>
              <select
                value={nature}
                onChange={(e) => setNature(e.target.value as any)}
                className="w-full bg-[#1A263D] text-white p-3 rounded-xl border border-white/10"
              >
                <option value="Elder Distress / Health">Elder Distress / Health Check</option>
                <option value="Emergency Property Damage">Emergency Property Damage / Flood / Fire</option>
                <option value="Urgent Legal / Police Verification">Urgent Legal / Verification Need</option>
                <option value="Travel Disruption">Family Travel Disruption</option>
                <option value="Other Urgent">Other Urgent Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 font-semibold mb-1">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full bg-[#1A263D] text-white p-3 rounded-xl border border-white/10"
              >
                <option value="Immediate (1-2 Hours)">Immediate Mobilization (1-2 Hours)</option>
                <option value="Same Day">Same Day Priority</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="permCheck"
              checked={permissionGiven}
              onChange={(e) => setPermissionGiven(e.target.checked)}
              className="mt-0.5"
            />
            <label htmlFor="permCheck" className="text-stone-300 font-light leading-relaxed">
              I grant permission to Nuty Tales authorized ground coordinators to contact the named individuals and verify physical safety.
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg transition-all"
            >
              Dispatch Emergency Request →
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
