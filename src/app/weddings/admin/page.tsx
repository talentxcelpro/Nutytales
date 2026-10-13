'use client'

import React, { useState } from 'react'
import { INITIAL_VENUES, INITIAL_VENDORS } from '@/lib/weddings/data'
import { getAllProjects } from '@/lib/weddings/storage'

export default function WeddingAdminDeskPage() {
  const [venues, setVenues] = useState(INITIAL_VENUES)
  const [vendors, setVendors] = useState(INITIAL_VENDORS)
  const projects = getAllProjects()

  const toggleVendorVerification = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, verified: !v.verified } : v))
    )
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-[#17233B]">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1520] text-[#C9A45C] text-xs font-semibold tracking-wide">
          <span>🛡️ PLATFORM ADMINISTRATION &amp; TRUST DESK</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#17233B]">
          Wedding Governance &amp; Partner Verification Desk
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Operational oversight across registered wedding projects, partner verification compliance, dispute resolutions, and platform audit logs.
        </p>
      </div>

      {/* ── Governance Statistics ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Total Projects Monitored
          </span>
          <span className="font-serif text-3xl font-extrabold text-[#17233B]">
            {projects.length} Active
          </span>
          <p className="text-[11px] text-stone-500">Zero data breach incidents</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Verified Venues
          </span>
          <span className="font-serif text-3xl font-extrabold text-[#8E2848]">
            {venues.filter((v) => v.verified).length} / {venues.length}
          </span>
          <p className="text-[11px] text-stone-500">Sound permit &amp; capacity verified</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Partner Guilds
          </span>
          <span className="font-serif text-3xl font-extrabold text-[#17233B]">
            {vendors.filter((v) => v.verified).length} / {vendors.length}
          </span>
          <p className="text-[11px] text-emerald-700 font-medium">Licensed &amp; Insured</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Active Disputes
          </span>
          <span className="font-serif text-3xl font-extrabold text-emerald-800">0 Open</span>
          <p className="text-[11px] text-stone-500">100% on-time milestone compliance</p>
        </div>
      </div>

      {/* ── Partner Verification Matrix ──────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#17233B]">
          Vendor Partner Verification Registry
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Operating Territory</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Verification State</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {vendors.map((vnd) => (
                <tr key={vnd.id} className="hover:bg-stone-50">
                  <td className="py-3.5 px-4 font-bold text-[#17233B]">{vnd.businessName}</td>
                  <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-stone-500">
                    {vnd.category}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">{vnd.destination}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#8E2848]">★ {vnd.rating}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        vnd.verified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {vnd.verified ? '✓ VETTED & ACTIVE' : 'PENDING AUDIT'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleVendorVerification(vnd.id)}
                      className="text-xs font-bold text-[#8E2848] hover:underline"
                    >
                      {vnd.verified ? 'Revoke State' : 'Approve Partner'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
