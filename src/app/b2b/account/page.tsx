'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FSSAI_NUMBER, WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function B2BAccountPage() {
  const [orgName, setOrgName] = useState('Premier Confectionery Works')
  const [gstin, setGstin] = useState('07AAAAA0000A1Z5')
  const [leadOfficer, setLeadOfficer] = useState('Vikram Malhotra')
  const [workEmail, setWorkEmail] = useState('procurement@premierconfectionery.com')
  const [phone, setPhone] = useState('+91 98111 22334')
  const [saved, setSaved] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="space-y-3 border-b border-stone-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
          <span>🏢</span> B2B CORPORATE ACCOUNT &amp; GSTIN DESK
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B]">
          Organisation Account &amp; Tax Profile
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Manage your verified organization credentials, GSTIN input credit details, billing addresses, and assigned Key Account Specialist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Organization Status Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-5 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#17233B] text-[#C9A45C] flex items-center justify-center font-bold text-lg">
              🏢
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#17233B]">{orgName}</h2>
              <span className="text-emerald-700 font-bold text-[10px] uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified B2B Tier Active
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Assigned Key Account Specialist:</span>
              <strong className="text-stone-800">Tariq Ahmad (Senior Trade Desk)</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Direct Corporate Phone:</span>
              <a href={`https://wa.me/${whatsappPhone}`} className="text-emerald-700 font-bold hover:underline">
                +91 9717161809 (WhatsApp)
              </a>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Commercial Credit Facility:</span>
              <span className="font-semibold text-[#176B68]">Approved for Net-30 Invoicing</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Quality Standard:</span>
              <span className="font-medium text-stone-800">FSSAI Central Lic. {FSSAI_NUMBER}</span>
            </div>
          </div>
        </div>

        {/* Right: Account & Billing Form */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-xs">
          <h2 className="font-serif font-bold text-xl text-[#17233B]">
            Commercial Profile &amp; Invoicing Details
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Organization Legal Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">GSTIN (15-Digit Format)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Authorized Procurement Lead</label>
                <input
                  type="text"
                  value={leadOfficer}
                  onChange={(e) => setLeadOfficer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Corporate Work Email</label>
                <input
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Direct Phone / Mobile</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm"
              >
                Save Profile Updates
              </button>

              {saved && (
                <span className="text-emerald-700 font-bold text-xs">
                  ✓ Profile successfully updated!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
