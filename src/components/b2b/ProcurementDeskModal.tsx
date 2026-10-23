'use client'

import React, { useState, useEffect } from 'react'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'
import {
  getStoredBusinessAccount,
  saveStoredRfq,
  RFQRecord,
} from '@/lib/b2b-procurement-store'

interface ProcurementDeskModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProcurementDeskModal({
  isOpen,
  onClose,
}: ProcurementDeskModalProps) {
  const { user, profile } = useAuth()
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [destination, setDestination] = useState('Delhi NCR')
  const [shoppingList, setShoppingList] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [specialNeeds, setSpecialNeeds] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      const acc = getStoredBusinessAccount()
      if (acc) {
        if (acc.companyName) setCompanyName(acc.companyName)
        if (acc.contactPerson) setContactName(acc.contactPerson)
        if (acc.email) setEmail(acc.email)
        if (acc.phone) setPhone(acc.phone)
        if (acc.city) setDestination(acc.city)
      } else if (user) {
        if (user.displayName || profile?.name) setContactName(user.displayName || profile?.name || '')
        if (user.email) setEmail(user.email)
        if (user.phoneNumber) setPhone(user.phoneNumber)
      }
    }
  }, [isOpen, user, profile])

  if (!isOpen) return null

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    const rfqNumber = `NT-RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName || 'Managed Procurement Lead',
          email,
          phone,
          businessName: companyName,
          city: destination,
          message: `[Quick B2B RFQ - ${rfqNumber}] Org: ${companyName} | Contact: ${contactName} | Dest: ${destination} | File Attached: ${fileName || 'None'} | Requirements: ${shoppingList} | Notes: ${specialNeeds}`,
          source: 'managed-procurement-desk',
        }),
      })

      const data = await res.json()
      if (res.ok && data.success && data.result?.success !== false) {
        // Save to real user RFQ store
        const newRfq: RFQRecord = {
          id: `rfq-${Date.now()}`,
          rfqNumber,
          title: shoppingList ? shoppingList.slice(0, 45) : `${companyName || 'Corporate'} Procurement BOM`,
          createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          deadline: 'Within 24 Hours',
          requiredByDate: 'Urgent Spot Dispatch',
          destinationHub: destination,
          status: 'OPEN',
          items: [
            {
              commodityId: 'custom-bom',
              commodityName: shoppingList || 'Commercial BOM Item',
              cut: 'Standard',
              packaging: 'Bulk Commercial Packaging',
              quantityKg: 250,
            },
          ],
          commercialTerms: 'Delivered Landed Cost with 5% GST input credit.',
          certificatesRequired: ['NABL Assay', 'FSSAI Lic. Verification'],
          invitations: [],
          notes: specialNeeds || shoppingList,
        }
        saveStoredRfq(newRfq)
        setIsSuccess(true)
      } else {
        setErrorMsg(data.error || 'Failed to submit procurement list. Please use WhatsApp.')
      }
    } catch {
      setErrorMsg('Network error. You can also send your list directly on WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappDeskUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nuty Tales Managed Procurement Desk! 📋\n\nI want to hand over our procurement shopping list for formal quotation:\n• Organisation: ${companyName || 'Corporate Client'}\n• Contact: ${contactName}\n• Destination: ${destination}\n• Shopping List / BOM:\n${shoppingList || 'Attached in chat'}\n\nPlease consolidate competing supplier quotes and coordinate delivered landed pricing!`,
  )}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#17233B] text-white p-6 sm:p-8 border-b border-[#C9A45C]/30 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white text-xl font-bold p-1 rounded-full hover:bg-white/10 w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-xs font-bold uppercase tracking-widest mb-2">
            <span>📋</span> NUTY TALES MANAGED PROCUREMENT DESK
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            We Sell a Completed Procurement Outcome
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light mt-1 max-w-lg leading-relaxed">
            Don’t waste time managing ten different wholesalers. Paste your shopping list or upload your spreadsheet. Our procurement desk consolidates options, verifies quality, and delivers right to your facility.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-stone-700">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-900 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Amber Confectionery Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-900 mb-1">Procurement Officer Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-900 mb-1">Official Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procurement@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-900 mb-1">WhatsApp / Direct Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-900 mb-1">Delivery Destination / Plant City *</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Greater Noida Factory / Bengaluru Depot"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-900 mb-1">
                  Procurement Shopping List or Bill of Materials (BOM):
                </label>
                <textarea
                  rows={4}
                  value={shoppingList}
                  onChange={(e) => setShoppingList(e.target.value)}
                  placeholder="e.g.&#10;1. 500 kg Sliced California Almonds 1.0mm&#10;2. 200 kg Kashmiri Walnut Halves Extra Light&#10;3. 50 kg Super Mongra Saffron with NABL COA&#10;4. 300 kg Makhana 6+ Sutra"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none font-mono"
                />
              </div>

              {/* Upload Spreadsheet Option */}
              <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-stone-300 border-dashed space-y-2 text-center">
                <span className="text-2xl block">📁</span>
                <span className="font-bold text-stone-800 block text-xs">
                  Or Upload Excel / CSV / PDF Procurement Sheet
                </span>
                <input
                  type="file"
                  id="excel-file-upload"
                  accept=".csv,.xlsx,.xls,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="excel-file-upload"
                  className="inline-block px-4 py-2 bg-white border border-stone-300 rounded-xl text-stone-700 font-bold hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  {fileName ? `✓ Selected: ${fileName}` : 'Choose Excel / PDF File'}
                </label>
                <p className="text-[10px] text-stone-500">
                  Supported formats: .xlsx, .csv, .pdf (Max 15MB)
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs border border-red-200">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting to Procurement Desk...' : '✓ Submit Shopping List for Consolidated Quote'}
                </button>
                <a
                  href={whatsappDeskUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Chat on WhatsApp</span>
                  <span>→</span>
                </a>
              </div>
            </form>
          ) : (
            <div className="space-y-4 p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 animate-fadeIn text-center">
              <span className="text-4xl block">🎉</span>
              <h3 className="font-serif text-2xl font-bold text-emerald-900">
                Procurement List Received!
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{companyName}</strong>. Our corporate procurement desk has begun matching your list with qualified suppliers across Kashmir, Bihar, and California import terminals.
              </p>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 max-w-sm mx-auto text-xs space-y-1">
                <div>Expected Turnaround: <strong>Under 4 Business Hours</strong></div>
                <div>Allocated Manager: <strong>Tariq Ahmad (+91 9717161809)</strong></div>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <a
                  href={whatsappDeskUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase"
                >
                  Expedite on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white border border-stone-300 text-stone-700 rounded-xl font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
