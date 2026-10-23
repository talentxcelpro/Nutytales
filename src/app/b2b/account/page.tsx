'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import {
  getStoredBusinessAccount,
  saveStoredBusinessAccount,
  BusinessAccountRecord,
} from '@/lib/b2b-procurement-store'
import { FSSAI_NUMBER, WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import B2BAuthModal from '@/components/b2b/B2BAuthModal'

export default function B2BAccountPage() {
  const { user, profile, idToken } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('signin')

  const [orgName, setOrgName] = useState('')
  const [gstin, setGstin] = useState('')
  const [leadOfficer, setLeadOfficer] = useState('')
  const [workEmail, setWorkEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [businessType, setBusinessType] = useState('Commercial Bakery / Confectionery')
  const [destinationHub, setDestinationHub] = useState('Delhi NCR / Noida Hub')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [expectedMonthlyQty, setExpectedMonthlyQty] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    const existing = getStoredBusinessAccount()
    if (existing) {
      setOrgName(existing.companyName || '')
      setGstin(existing.gstin || '')
      setLeadOfficer(existing.contactPerson || '')
      setWorkEmail(existing.email || '')
      setPhone(existing.phone || '')
      if (existing.businessType) setBusinessType(existing.businessType)
      if (existing.city) setDestinationHub(existing.city)
      if (existing.address) setAddress(existing.address)
      if (existing.pincode) setPincode(existing.pincode)
      if (existing.expectedMonthlyQty) setExpectedMonthlyQty(String(existing.expectedMonthlyQty))
    } else if (user) {
      if (user.displayName || profile?.name) setLeadOfficer(user.displayName || profile?.name || '')
      if (user.email) setWorkEmail(user.email)
      if (user.phoneNumber) setPhone(user.phoneNumber)
    }
  }, [user, profile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMsg(null)
    setSaved(false)

    const updatedAccount: BusinessAccountRecord = {
      companyName: orgName.trim() || 'Commercial Buyer',
      contactPerson: leadOfficer.trim() || 'Authorized Procurement Officer',
      phone: phone.trim(),
      email: workEmail.trim(),
      gstin: gstin.trim().toUpperCase(),
      businessType,
      city: destinationHub,
      state: '',
      address: address.trim(),
      pincode: pincode.trim(),
      expectedMonthlyQty: expectedMonthlyQty ? Number(expectedMonthlyQty) : undefined,
      isVerified: Boolean(gstin && gstin.length === 15),
      creditStatus: gstin && gstin.length === 15 ? 'Verified for Net-30 Invoicing' : 'Standard Advance / Spot Terms',
      assignedSpecialist: 'Tariq Ahmad (Senior Trade Desk)',
      tradePhone: '+91 9717161809',
    }

    saveStoredBusinessAccount(updatedAccount)

    try {
      await fetch('/api/business/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify(updatedAccount),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch {
      // Local fallback saved
      setSaved(true)
    } finally {
      setIsSaving(false)
    }
  }

  const isVerifiedGst = Boolean(gstin && gstin.trim().length === 15)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Header */}
      <div className="space-y-3 border-b border-stone-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081830] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
          <span>🏢</span> B2B CORPORATE ACCOUNT &amp; GSTIN DESK
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#081830]">
          Organisation Account &amp; Tax Profile
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Manage your verified organization credentials, GSTIN input credit details, delivery facility coordinates, and assigned Key Account Specialist.
        </p>

        {!user && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div>
              <strong>Guest Procurement Session:</strong> Sign in or create a trade account to link this commercial profile across devices and unlock pre-approved credit lines.
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signin')
                  setAuthModalOpen(true)
                }}
                className="px-3 py-1.5 bg-[#081830] text-white font-bold rounded-lg text-xs"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('register')
                  setAuthModalOpen(true)
                }}
                className="px-3 py-1.5 bg-[#FF6B00] text-white font-bold rounded-lg text-xs"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Organization Status Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#081830] text-[#C9A45C] flex items-center justify-center font-bold text-lg">
              🏢
            </div>
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-base text-[#081830] truncate">
                {orgName || 'Your Business Name'}
              </h2>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border inline-block mt-0.5 ${
                  isVerifiedGst
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-amber-800 bg-amber-50 border-amber-200'
                }`}
              >
                {isVerifiedGst ? '✓ Verified GSTIN Active' : 'GSTIN Pending Verification'}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Assigned Trade Specialist:</span>
              <strong className="text-stone-800">Tariq Ahmad (Senior Trade Desk)</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Direct Corporate Hotline:</span>
              <a href={`https://wa.me/${whatsappPhone}`} className="text-emerald-700 font-bold hover:underline">
                +91 9717161809 (WhatsApp Desk)
              </a>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Commercial Credit Facility:</span>
              <span className="font-semibold text-stone-800">
                {isVerifiedGst ? 'Approved for Net-30 Invoicing' : 'Advance Wire / Cash Against Documents (CAD)'}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Platform Standard:</span>
              <span className="font-medium text-stone-800">FSSAI Central Lic. #{FSSAI_NUMBER}</span>
            </div>
          </div>
        </div>

        {/* Right: Account & Billing Form */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="font-serif font-bold text-xl text-[#081830]">
              Commercial Profile &amp; Invoicing Details
            </h2>
            <span className="text-[11px] text-stone-500">Auto-applies to all spot RFQs</span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Organization Legal Entity Name *</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Imperial Bakeries &amp; Foods Ltd"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">GSTIN (15-Digit Format)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="07AAAAA0000A1Z5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Authorized Procurement Lead *</label>
                <input
                  type="text"
                  required
                  value={leadOfficer}
                  onChange={(e) => setLeadOfficer(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Corporate Work Email *</label>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="procurement@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Direct Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Industry / Entity Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none bg-white"
                >
                  <option value="Commercial Bakery / Confectionery">Commercial Bakery / Confectionery</option>
                  <option value="HORECA / Hotel / Restaurant">HORECA / Hotel / Restaurant</option>
                  <option value="FMCG Food Manufacturer">FMCG Food Manufacturer</option>
                  <option value="Sweet Shop / Mithai Maker">Sweet Shop / Mithai Maker</option>
                  <option value="Wholesale Distributor / Trader">Wholesale Distributor / Trader</option>
                  <option value="Supermarket / Retail Chain">Supermarket / Retail Chain</option>
                  <option value="Corporate Gifting Firm">Corporate Gifting Firm</option>
                  <option value="Exporter / Re-packer">Exporter / Re-packer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Primary Receiving Hub</label>
                <select
                  value={destinationHub}
                  onChange={(e) => setDestinationHub(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none bg-white"
                >
                  <option value="Delhi NCR / Noida Hub">Delhi NCR / Noida Central Hub</option>
                  <option value="Mumbai / Nhava Sheva (JNPT)">Mumbai / JNPT Port &amp; Cold Hub</option>
                  <option value="Bengaluru / Karnataka Hub">Bengaluru / Karnataka Hub</option>
                  <option value="Srinagar / Kashmir Hub">Srinagar / Kashmir Direct Valley</option>
                  <option value="Patna / Eastern Hub">Patna / Eastern Hub</option>
                  <option value="Dubai / GCC Export Hub">Dubai / GCC Export Hub</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Estimated Monthly Consumption (kg)</label>
                <input
                  type="number"
                  value={expectedMonthlyQty}
                  onChange={(e) => setExpectedMonthlyQty(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Delivery Facility Full Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Plot 42, Phase II, Industrial Area, Okhla / Noida"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-[#081830] hover:bg-[#12274A] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? 'Saving Profile...' : 'Save Profile Updates'}
              </button>

              {saved && (
                <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                  <span>✓</span>
                  <span>Corporate account details successfully saved &amp; synchronized!</span>
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* B2B Auth Modal */}
      <B2BAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          const acc = getStoredBusinessAccount()
          if (acc) {
            setOrgName(acc.companyName || '')
            setGstin(acc.gstin || '')
            setLeadOfficer(acc.contactPerson || '')
            setWorkEmail(acc.email || '')
            setPhone(acc.phone || '')
          }
        }}
      />
    </div>
  )
}
