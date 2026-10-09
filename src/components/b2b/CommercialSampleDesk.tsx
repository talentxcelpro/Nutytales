'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FSSAI_NUMBER, WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function CommercialSampleDesk() {
  const [activeTab, setActiveTab] = useState<'sample' | 'proforma'>('sample')

  // Sample Pack Order State
  const [sampleCompany, setSampleCompany] = useState('')
  const [sampleGstin, setSampleGstin] = useState('')
  const [sampleContact, setSampleContact] = useState('')
  const [samplePhone, setSamplePhone] = useState('')
  const [sampleEmail, setSampleEmail] = useState('')
  const [sampleAddress, setSampleAddress] = useState('')
  const [sampleHub, setSampleHub] = useState('Noida Sector 63 Central Cold-Chain Hub')
  const [isOrderingSample, setIsOrderingSample] = useState(false)
  const [sampleOrderSuccess, setSampleOrderSuccess] = useState<string | null>(null)
  const [sampleError, setSampleError] = useState<string | null>(null)

  // Proforma Invoice State
  const [piCommodity, setPiCommodity] = useState('California Almonds (Sliced 0.8–1.2mm)')
  const [piVolumeKg, setPiVolumeKg] = useState(500)
  const [piRatePerKg, setPiRatePerKg] = useState(590)
  const [piDestination, setPiDestination] = useState('Delhi-NCR (Noida Dispatch)')
  const [isGeneratingPi, setIsGeneratingPi] = useState(false)
  const [generatedPi, setGeneratedPi] = useState<{
    piNumber: string
    subtotal: number
    gstAmount: number
    totalWithGst: number
    date: string
  } | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleSampleOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setSampleError(null)
    setIsOrderingSample(true)

    const orderRef = `SAMPLE-B2B-${Date.now().toString().slice(-6)}`

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sample_pack',
          vertical: 'business',
          referenceId: orderRef,
          customer: {
            fullName: sampleContact,
            companyName: sampleCompany,
            phone: samplePhone,
            email: sampleEmail,
            address: sampleAddress,
            gstin: sampleGstin,
            city: sampleHub,
          },
          items: [
            { name: '5kg Commercial Quality Sample Pack (Mamra, Walnuts, Makhana, Almonds, Saffron)', qty: 1, price: 3499 }
          ],
          total: 3499,
          paymentMethod: 'razorpay_instant',
          notes: `Fulfillment Hub: ${sampleHub} | GSTIN: ${sampleGstin || 'Not provided'} | 100% PO Credit eligible`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSampleOrderSuccess(orderRef)
      } else {
        setSampleError(data.error || 'Failed to place sample order.')
      }
    } catch {
      setSampleError('Network error. Please try again.')
    } finally {
      setIsOrderingSample(false)
    }
  }

  const handleGeneratePi = (e: React.FormEvent) => {
    e.preventDefault()
    setIsGeneratingPi(true)

    setTimeout(() => {
      const subtotal = piVolumeKg * piRatePerKg
      const gstAmount = Math.round(subtotal * 0.05) // 5% GST
      const totalWithGst = subtotal + gstAmount
      const piNumber = `PI-2026-${Math.floor(10000 + Math.random() * 90000)}`

      setGeneratedPi({
        piNumber,
        subtotal,
        gstAmount,
        totalWithGst,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      })
      setIsGeneratingPi(false)
    }, 400)
  }

  return (
    <div id="sample-desk" className="bg-gradient-to-br from-[#10192A] via-[#17233B] to-[#0D1524] text-white rounded-3xl p-6 sm:p-10 border border-[#C9A45C]/40 shadow-2xl space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/20 text-[#C9A45C] text-xs font-bold uppercase tracking-widest border border-[#C9A45C]/30">
            <span>⚡</span> IMMEDIATE B2B COMMERCE &amp; CASHFLOW DESK
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            Evaluate Before Contracting: <span className="text-[#C9A45C]">Instant Dispatch &amp; Proforma Desk</span>
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-3xl leading-relaxed font-light">
            Commercial bakeries, hotel chains, and FMCG brands verify physical quality before wiring bulk capital. Order our certified 5kg quality test pack with <strong>100% bulk PO credit</strong>, or generate a formal institutional Proforma Invoice for immediate bank wire.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/10 p-1 rounded-2xl border border-white/15 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('sample')}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'sample'
                ? 'bg-[#C9A45C] text-[#17233B] shadow-lg'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            📦 5kg Quality Pack (₹3,499)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('proforma')}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'proforma'
                ? 'bg-[#C9A45C] text-[#17233B] shadow-lg'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            📄 Instant Proforma Wire Desk
          </button>
        </div>
      </div>

      {/* ── Tab 1: 5kg Sample Pack Order ─────────────────────────────────────── */}
      {activeTab === 'sample' && (
        <div>
          {sampleOrderSuccess ? (
            <div className="bg-[#17233B] border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold mx-auto">
                ✓
              </div>
              <h3 className="text-xl font-bold font-serif text-white">
                5kg Quality Sample Pack Confirmed &amp; Queued for Dispatch!
              </h3>
              <p className="font-mono text-sm text-[#C9A45C] bg-white/5 py-1.5 px-4 rounded-lg inline-block border border-white/10">
                Order Ref: {sampleOrderSuccess} · ₹3,499 (100% PO Credit Guaranteed)
              </p>
              <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
                Your sample kit will be dispatched within 24 hours via Blue Dart Air from our <strong>{sampleHub}</strong>. Includes comprehensive NABL Laboratory Certificate of Analysis (COA) and a ₹3,499 credit voucher valid on your first bulk PO (&gt;100kg).
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nuty Tales Trade Desk! I just ordered 5kg Sample Pack (Ref: ${sampleOrderSuccess}). Please confirm dispatch details and share Blue Dart AWB when generated.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  WhatsApp Dispatch Desk →
                </a>
                <button
                  type="button"
                  onClick={() => setSampleOrderSuccess(null)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-bold rounded-xl"
                >
                  Order Another Kit
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: What's inside the Sample Pack */}
              <div className="lg:col-span-5 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C9A45C]">
                    Commercial Evaluation Pack
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-bold">
                    Next-Day Air Dispatch
                  </span>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-serif text-white">₹3,499</span>
                    <span className="text-xs text-stone-400">All-Inclusive (Door-Delivered)</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                    ✓ 100% (₹3,499) deducted against your first commercial PO (&gt;100kg)
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-stone-200">
                  <span className="font-bold text-white block text-[11px] uppercase tracking-wider">
                    Contents (Machine-Graded &amp; Moisture Sealed):
                  </span>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>1kg Kashmiri Mamra Kernels</strong> — Harwan origin, high oil fraction (&gt;52%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>1kg Kagzi Walnuts (Extra-Light Halves)</strong> — Crisp unbroken grade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>1kg Mithila Phool Makhana (Jumbo 6-Suta)</strong> — Direct Patna depot harvest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>1kg California Almonds (Specified Cut)</strong> — Sliced or whole bakery grade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>10g GI-Tagged Pampore Mongra Saffron</strong> — Grade A1 sealed laboratory blister</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>NABL Certificate of Analysis (COA)</strong> + FSSAI Central License Dossier</span>
                    </li>
                  </ul>
                </div>

                {/* Tri-Hub Dispatch Tag */}
                <div className="pt-3 border-t border-white/10 text-[11px] text-stone-300 space-y-1">
                  <div className="text-[#C9A45C] font-bold">Fulfillment Corridor:</div>
                  <div>• Delhi/NCR Hub: Noida Sector 63 (Rapid Pan-India Air)</div>
                  <div>• Eastern Hub: Patna Makhana Terminal (Direct Farmer Depots)</div>
                  <div>• Origin Hub: Kashmir Pampore &amp; Harwan Orchards</div>
                </div>
              </div>

              {/* Right: Fast Order Form */}
              <div className="lg:col-span-7 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center justify-between">
                  <span>Enter Delivery Details for Immediate Dispatch</span>
                  <span className="text-xs font-mono text-[#C9A45C]">Step 1 of 1</span>
                </h3>

                <form onSubmit={handleSampleOrder} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Company / Organization *</label>
                      <input
                        type="text"
                        required
                        value={sampleCompany}
                        onChange={(e) => setSampleCompany(e.target.value)}
                        placeholder="e.g. Oberoi Patisserie / Delhi Bakes"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">GSTIN (For 100% Credit Voucher)</label>
                      <input
                        type="text"
                        value={sampleGstin}
                        onChange={(e) => setSampleGstin(e.target.value)}
                        placeholder="07AAAAA0000A1Z5"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Procurement Officer / Chef Name *</label>
                      <input
                        type="text"
                        required
                        value={sampleContact}
                        onChange={(e) => setSampleContact(e.target.value)}
                        placeholder="Contact Name"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Mobile / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={samplePhone}
                        onChange={(e) => setSamplePhone(e.target.value)}
                        placeholder="+91 98110 00000"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Official Work Email *</label>
                      <input
                        type="email"
                        required
                        value={sampleEmail}
                        onChange={(e) => setSampleEmail(e.target.value)}
                        placeholder="procurement@company.com"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Preferred Dispatch Logistics Hub</label>
                      <select
                        value={sampleHub}
                        onChange={(e) => setSampleHub(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#17233B] border border-white/20 text-white focus:outline-none focus:border-[#C9A45C]"
                      >
                        <option value="Noida Sector 63 Central Cold-Chain Hub">Delhi-NCR: Noida Sector 63 Hub</option>
                        <option value="Patna Mithila Makhana Depot">Eastern Hub: Patna Depot</option>
                        <option value="Kashmir Pampore & Harwan Farmgate">Origin Hub: Kashmir Farmgate</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Factory / Office Delivery Address *</label>
                    <textarea
                      rows={2}
                      required
                      value={sampleAddress}
                      onChange={(e) => setSampleAddress(e.target.value)}
                      placeholder="Street address, city, state, pincode for express courier delivery..."
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>

                  {sampleError && (
                    <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs">
                      {sampleError}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isOrderingSample}
                      className="w-full py-3.5 bg-gradient-to-r from-[#C9A45C] to-[#E6CA85] hover:from-[#b5924d] hover:to-[#C9A45C] text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <span>⚡</span>
                      <span>
                        {isOrderingSample ? 'Processing Dispatch Queue...' : 'Confirm Sample Pack (₹3,499) — Dispatched in 24h →'}
                      </span>
                    </button>
                    <p className="text-[11px] text-stone-400 text-center mt-2">
                      FSSAI Central Lic: {FSSAI_NUMBER} · 100% of ₹3,499 credited back on bulk PO · Razorpay / UPI / NetBanking / Cards
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 2: Instant Proforma Invoice (PI) & Bank Wire Generator ──────── */}
      {activeTab === 'proforma' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="font-serif text-lg font-bold text-white">
                Generate Institutional Proforma Invoice (PI)
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Need a formal Proforma Invoice with GST, HSN code, and bank routing before releasing an RTGS / NEFT advance? Select your specifications below for instant generation:
              </p>

              <form onSubmit={handleGeneratePi} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Select Commodity &amp; Grade</label>
                  <select
                    value={piCommodity}
                    onChange={(e) => setPiCommodity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#17233B] border border-white/20 text-white"
                  >
                    <option value="California Almonds (Sliced 0.8–1.2mm)">California Almonds (Sliced 0.8–1.2mm)</option>
                    <option value="Kashmiri Kagzi Walnuts (Extra-Light Halves)">Kashmiri Kagzi Walnuts (Extra-Light Halves)</option>
                    <option value="Mithila Phool Makhana (Jumbo 6-Suta)">Mithila Phool Makhana (Jumbo 6-Suta Grade)</option>
                    <option value="Kashmiri Mamra Kernels (Cold-Press Selected)">Kashmiri Mamra Kernels (Cold-Press Selected)</option>
                    <option value="Pampore GI Mongra Saffron (Grade A1)">Pampore GI Mongra Saffron (Grade A1)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Order Volume (kg)</label>
                    <input
                      type="number"
                      min={50}
                      step={50}
                      value={piVolumeKg}
                      onChange={(e) => setPiVolumeKg(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Target Contract Rate (₹/kg)</label>
                    <input
                      type="number"
                      value={piRatePerKg}
                      onChange={(e) => setPiRatePerKg(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Destination Logistics Corridor</label>
                  <select
                    value={piDestination}
                    onChange={(e) => setPiDestination(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#17233B] border border-white/20 text-white"
                  >
                    <option value="Delhi-NCR (Noida Sector 63 Hub)">Delhi-NCR (Noida Sector 63 Hub)</option>
                    <option value="Patna Eastern Depot (Mithila Logistics)">Patna Eastern Depot (Mithila Logistics)</option>
                    <option value="Kashmir Srinagar Origin Gate">Kashmir Srinagar Origin Gate</option>
                    <option value="Mumbai / Nhava Sheva Port">Mumbai / Nhava Sheva Port</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingPi}
                  className="w-full py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  {isGeneratingPi ? 'Generating Proforma Invoice...' : '📄 Generate Proforma Invoice Now →'}
                </button>
              </form>
            </div>

            {/* Generated Proforma Document Preview */}
            <div className="lg:col-span-6 bg-white text-stone-900 rounded-2xl p-6 shadow-xl space-y-4 text-xs font-mono border-2 border-[#C9A45C]">
              {generatedPi ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                    <div>
                      <div className="font-serif font-extrabold text-base text-[#17233B]">
                        NUTY TALES AGRI-COMMODITIES PVT LTD
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Noida Sec 62/63 Executive Corridor, UP · FSSAI: {FSSAI_NUMBER}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#704B32]">{generatedPi.piNumber}</div>
                      <div className="text-[10px] text-stone-500">{generatedPi.date}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-[11px]">
                    <div className="font-bold text-[#17233B]">COMMERCIAL LINE ITEM:</div>
                    <div className="flex justify-between">
                      <span>{piCommodity} × {piVolumeKg} kg @ ₹{piRatePerKg}/kg</span>
                      <span>₹{generatedPi.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>GST (5% Agricultural Produce)</span>
                      <span>₹{generatedPi.gstAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-stone-900 border-t border-stone-300 pt-1">
                      <span>TOTAL LANDED COMMERCIAL VALUE</span>
                      <span className="text-[#176B68]">₹{generatedPi.totalWithGst.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Bank Wire Details */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-[11px]">
                    <div className="font-bold text-amber-900">INSTITUTIONAL BANK WIRE ROUTING (RTGS / NEFT):</div>
                    <div className="text-stone-700">Account Name: Nuty Tales Foods &amp; Crafts (Nexgenn Services)</div>
                    <div className="text-stone-700">Bank: HDFC Bank Ltd, Sector 128 Noida Branch</div>
                    <div className="text-stone-700">A/C Number: 50200084920194 (Current) · IFSC: HDFC0001576</div>
                    <div className="text-stone-700">FSSAI Lic: 22724441000048</div>
                  </div>

                  <div className="pt-2 flex gap-3 font-sans">
                    <a
                      href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                        `Hello Nuty Tales Trade Desk! Generated Proforma Invoice ${generatedPi.piNumber} for ${piVolumeKg}kg of ${piCommodity} (Total: ₹${generatedPi.totalWithGst}). Please route to senior trade executive for purchase order lock.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white text-center rounded-xl font-bold uppercase tracking-wider text-[11px] transition-colors"
                    >
                      Authorize via Trade Desk →
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center text-stone-400 space-y-2">
                  <span className="text-3xl">📄</span>
                  <p className="text-xs font-sans">
                    Configure your required commodity volume and destination on the left to render your authenticated Proforma Invoice with bank wire instructions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
