'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface RecipientRow {
  id: string
  name: string
  company: string
  phone: string
  address: string
  city: string
  country: string
  hamperTier: 'royal' | 'heritage' | 'executive' | 'bespoke'
  customNote: string
}

const TIER_PRICING: Record<RecipientRow['hamperTier'], { name: string; price: number }> = {
  royal: { name: 'Royal Saffron & Mamra Hamper', price: 2999 },
  heritage: { name: 'Kashmir Valley Heritage Box', price: 1899 },
  executive: { name: 'Executive Dry Fruit Tray', price: 1299 },
  bespoke: { name: 'Bespoke Custom Hamper', price: 4500 },
}

export default function GiftingRecipientsPage() {
  const [deskMode, setDeskMode] = useState<'roster' | 'choice-link'>('roster')
  const [choiceLinkBudget, setChoiceLinkBudget] = useState(2450)
  const [choiceLinkQty, setChoiceLinkQty] = useState(100)
  const [copiedLink, setCopiedLink] = useState(false)

  const [occasion, setOccasion] = useState('Diwali & Festive Season')
  const [deliveryDate, setDeliveryDate] = useState('2026-10-20')
  const [brandLogoFile, setBrandLogoFile] = useState<string | null>(null)
  const [senderCompany, setSenderCompany] = useState('')
  const [senderContact, setSenderContact] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [senderGst, setSenderGst] = useState('')

  const [recipients, setRecipients] = useState<RecipientRow[]>([
    {
      id: 'rec-1',
      name: 'Aditya Verma',
      company: 'Peak XV Partners',
      phone: '+91 98112 34567',
      address: 'Suite 402, Embassy Golf Links',
      city: 'Bengaluru',
      country: 'India',
      hamperTier: 'royal',
      customNote: 'Wishing you and the Peak XV team prosperity and joy this Diwali.',
    },
    {
      id: 'rec-2',
      name: 'Sarah Al-Maktoum',
      company: 'Falcon Global Capital',
      phone: '+971 50 123 4567',
      address: 'DIFC Gate Tower 4, Level 18',
      city: 'Dubai',
      country: 'UAE',
      hamperTier: 'royal',
      customNote: 'With warm compliments from the leadership team.',
    },
    {
      id: 'rec-3',
      name: 'Rohan Deshmukh',
      company: 'Tech Mahindra',
      phone: '+91 99201 88765',
      address: 'Hinjewadi Phase 2, Tech Park',
      city: 'Pune',
      country: 'India',
      hamperTier: 'heritage',
      customNote: 'Thank you for an incredible year of partnership.',
    },
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderRef, setOrderRef] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const addRecipient = () => {
    const newId = `rec-${Date.now()}`
    setRecipients([
      ...recipients,
      {
        id: newId,
        name: '',
        company: '',
        phone: '',
        address: '',
        city: '',
        country: 'India',
        hamperTier: 'heritage',
        customNote: '',
      },
    ])
  }

  const removeRecipient = (id: string) => {
    if (recipients.length <= 1) return
    setRecipients(recipients.filter((r) => r.id !== id))
  }

  const updateRecipient = (id: string, field: keyof RecipientRow, val: any) => {
    setRecipients(
      recipients.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
    )
  }

  // Financial calculations
  const hampersTotal = recipients.reduce(
    (acc, r) => acc + TIER_PRICING[r.hamperTier].price,
    0,
  )
  const internationalRecipients = recipients.filter((r) => r.country !== 'India').length
  const domesticRecipients = recipients.length - internationalRecipients
  const logisticsTotal = domesticRecipients * 180 + internationalRecipients * 1400
  const brandingTotal = recipients.length * 90 // Laser engraving & card print
  const subtotal = hampersTotal + logisticsTotal + brandingTotal
  const gstTotal = Math.round(subtotal * 0.05) // 5% GST on dry fruit hampers
  const grandTotal = subtotal + gstTotal

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'corporate_gifting',
          vertical: 'gifting',
          customerName: senderCompany || 'Corporate Gifting Client',
          companyName: senderCompany,
          customerPhone: senderContact,
          customerEmail: senderEmail,
          deliveryCity: `${recipients.length} Multi-City Recipients (${domesticRecipients} Domestic, ${internationalRecipients} International)`,
          targetBudget: grandTotal,
          currency: 'INR',
          notes: `Occasion: ${occasion} | Target Date: ${deliveryDate} | GSTIN: ${senderGst} | Recipients: ${recipients.length} items | Logistics: ₹${logisticsTotal} | Breakdown: ${recipients
            .map((r) => `${r.name} (${r.city}, ${r.country}) -> ${TIER_PRICING[r.hamperTier].name}`)
            .join(' ; ')}`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setOrderRef(data.opportunityId)
      } else {
        setErrorMsg(data.error || 'Failed to submit order. Please retry.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Breadcrumb & Header ───────────────────────────────────────────────── */}
      <div className="space-y-2 border-b border-stone-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10192A] text-[#C9A45C] text-xs font-semibold tracking-wide">
          <span>🎁 NUTY TALES GIFTING — MULTI-RECIPIENT PROCUREMENT DESK</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          Corporate Multi-Recipient Upload &amp; Dispatch Engine
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          &quot;I need to send gifts to these people.&quot; Upload or configure recipient addresses across multiple cities and countries. Nuty Tales manages curation, custom laser foil branding, individual greeting cards, and white-glove air delivery with live tracking.
        </p>
      </div>

      {/* ── Mode Switcher: Roster vs Recipient Choice Link ─────────────────── */}
      <div id="choice-links" className="bg-[#FAF6EE] p-2 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDeskMode('roster')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all ${
              deskMode === 'roster'
                ? 'bg-[#17233B] text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📋 Master Address Roster ({recipients.length} entries)
          </button>
          <button
            type="button"
            onClick={() => setDeskMode('choice-link')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              deskMode === 'choice-link'
                ? 'bg-[#704B32] text-white shadow-md'
                : 'text-stone-600 hover:text-[#704B32]'
            }`}
          >
            <span>🔗</span>
            <span>Recipient Choice Links (Snappy Model)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#C9A45C] text-[#17233B] text-[9px] font-black uppercase">
              No Address Needed
            </span>
          </button>
        </div>

        <Link
          href="/gifting/designer"
          className="text-xs font-bold text-[#704B32] hover:text-[#17233B] flex items-center gap-1 px-3 py-1.5"
        >
          <span>Open SI Gift Designer Studio</span>
          <span>→</span>
        </Link>
      </div>

      {/* ── Mode B: Recipient Choice Link Engine (Snappy / Goody Parity) ────── */}
      {deskMode === 'choice-link' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
              Recipient Intelligence &amp; Autonomous Address Collection
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#17233B]">
              Generate Branded Recipient Choice Links
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm font-light">
              Don&apos;t waste time chasing colleagues or clients for their home addresses. Set your budget, create a single campaign link, and let recipients select their preferred dry fruit box, specify dietary needs, and provide their delivery address privately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Per-Recipient Budget Tier</label>
              <select
                value={choiceLinkBudget}
                onChange={(e) => setChoiceLinkBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#704B32] focus:outline-none"
              >
                <option value={1299}>₹1,299 / recipient (Executive Tray)</option>
                <option value={1899}>₹1,899 / recipient (Heritage Valley Box)</option>
                <option value={2450}>₹2,450 / recipient (Vegan Leatherette Trunk)</option>
                <option value={4950}>₹4,950 / recipient (Royal Walnut Casket)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Estimated Number of Recipients</label>
              <input
                type="number"
                min="10"
                max="5000"
                value={choiceLinkQty}
                onChange={(e) => setChoiceLinkQty(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#704B32] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Total Budget Allocation</label>
              <div className="px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono font-bold text-[#17233B]">
                ₹{(choiceLinkBudget * choiceLinkQty).toLocaleString('en-IN')} + GST
              </div>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-purple-50 via-stone-50 to-amber-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-[#17233B] block">Your Autonomous Choice Link is Active:</strong>
                <span className="text-[11px] text-stone-600 font-mono">
                  https://gifting.nutytales.com/choice/NT-2026-{choiceLinkBudget}?limit={choiceLinkQty}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCopiedLink(true)
                  setTimeout(() => setCopiedLink(false), 2000)
                }}
                className="px-4 py-2 bg-[#17233B] hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                {copiedLink ? '✓ Copied Link!' : 'Copy Choice Link'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <strong className="block text-purple-900">1. Share Link via Email/Slack</strong>
                <span className="text-[11px] text-stone-500">Recipients get a luxury unboxing experience on web.</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <strong className="block text-purple-900">2. Recipient Picks Options</strong>
                <span className="text-[11px] text-stone-500">Chooses dry fruits, roasted nuts, or saffron blends.</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <strong className="block text-purple-900">3. Nuty Tales Dispatches</strong>
                <span className="text-[11px] text-stone-500">Live courier tracking synced directly to your dashboard.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {orderRef ? (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl font-bold mx-auto shadow-lg">
            ✓
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-emerald-950">
            Multi-Recipient Campaign Generated Successfully!
          </h2>
          <div className="inline-block px-4 py-2 bg-emerald-100 rounded-xl font-mono text-sm font-bold text-emerald-900 border border-emerald-300">
            Campaign Order Ref: {orderRef}
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 max-w-xl mx-auto leading-relaxed">
            Our corporate fulfillment desk has received your {recipients.length} recipient addresses. A formal GST Proforma invoice and digital packaging proof have been structured and sent to your email.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/gifting/dashboard"
              className="px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              View in Gifting Dashboard →
            </Link>
            <button
              onClick={() => setOrderRef(null)}
              className="px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Submit Another Batch
            </button>
          </div>
        </div>
      ) : deskMode === 'roster' && (
        <form onSubmit={handleSubmitOrder} className="space-y-8">
          {/* ── 1. Campaign Parameters ────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3 flex items-center gap-2">
              <span>1.</span> Campaign &amp; Corporate Identity Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={senderCompany}
                  onChange={(e) => setSenderCompany(e.target.value)}
                  placeholder="e.g. Google India / KPMG"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">HR / Procurement Email *</label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="procurement@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={senderContact}
                  onChange={(e) => setSenderContact(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Corporate GSTIN (For 5% ITC)</label>
                <input
                  type="text"
                  value={senderGst}
                  onChange={(e) => setSenderGst(e.target.value)}
                  placeholder="07AAAAA0000A1Z5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Occasion / Gifting Theme</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-white"
                >
                  <option value="Diwali & Festive Season">Diwali &amp; Festive Celebration</option>
                  <option value="Executive Milestone">Executive &amp; Board Milestone</option>
                  <option value="Employee Appreciation">Employee Appreciation / Annual Day</option>
                  <option value="New Year & Christmas">New Year &amp; Christmas</option>
                  <option value="VIP Client Retention">VIP Client Retention</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Requested Dispatch Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Custom Branding Guidelines (Logo / Foil Stamp)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gold metallic foil logo on navy rigid box + personalized CEO note"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ── 2. Recipient List Grid ────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#17233B] flex items-center gap-2">
                  <span>2.</span> Recipient List &amp; Personalized Cards ({recipients.length} Recipients)
                </h3>
                <p className="text-xs text-stone-500">
                  Enter delivery locations below or edit tiers individually.
                </p>
              </div>

              <button
                type="button"
                onClick={addRecipient}
                className="px-4 py-2 bg-[#FAF6EE] hover:bg-[#17233B] text-[#17233B] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-stone-300 transition-colors"
              >
                + Add Another Recipient
              </button>
            </div>

            <div className="space-y-4">
              {recipients.map((rec, idx) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-2xl bg-[#FAF6EE]/60 border border-stone-200 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#704B32] bg-white px-2.5 py-0.5 rounded-md border border-stone-200">
                      Recipient #{idx + 1}
                    </span>

                    {recipients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRecipient(rec.id)}
                        className="text-stone-400 hover:text-red-600 text-xs font-bold"
                        title="Remove Recipient"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={rec.name}
                        onChange={(e) => updateRecipient(rec.id, 'name', e.target.value)}
                        placeholder="Recipient Name"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#176B68]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">Organization / Title</label>
                      <input
                        type="text"
                        value={rec.company}
                        onChange={(e) => updateRecipient(rec.id, 'company', e.target.value)}
                        placeholder="Company Name"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">Mobile for Delivery</label>
                      <input
                        type="tel"
                        value={rec.phone}
                        onChange={(e) => updateRecipient(rec.id, 'phone', e.target.value)}
                        placeholder="+91..."
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">City *</label>
                      <input
                        type="text"
                        required
                        value={rec.city}
                        onChange={(e) => updateRecipient(rec.id, 'city', e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">Country *</label>
                      <select
                        value={rec.country}
                        onChange={(e) => updateRecipient(rec.id, 'country', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
                      >
                        <option value="India">India (PAN-India)</option>
                        <option value="UAE">UAE (Dubai/Abu Dhabi)</option>
                        <option value="UK">United Kingdom</option>
                        <option value="USA">United States</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">Street Address / Floor / Landmark *</label>
                      <input
                        type="text"
                        required
                        value={rec.address}
                        onChange={(e) => updateRecipient(rec.id, 'address', e.target.value)}
                        placeholder="Address with Postal Code"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">Gift Box Tier</label>
                      <select
                        value={rec.hamperTier}
                        onChange={(e) => updateRecipient(rec.id, 'hamperTier', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white font-semibold text-[#17233B]"
                      >
                        <option value="royal">Royal (₹2,999)</option>
                        <option value="heritage">Heritage (₹1,899)</option>
                        <option value="executive">Executive (₹1,299)</option>
                        <option value="bespoke">Bespoke (₹4,500)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">Personalized Note on Greeting Card</label>
                      <input
                        type="text"
                        value={rec.customNote}
                        onChange={(e) => updateRecipient(rec.id, 'customNote', e.target.value)}
                        placeholder="Note printed on gold-leaf parchment"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. Live Financial Ledger & Corporate Order Approval ───────────── */}
          <div className="bg-[#10192A] text-white rounded-3xl p-6 sm:p-8 border border-[#C9A45C]/30 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C] block">
                  3. Transparent Corporate Procurement Ledger
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1">
                  Campaign Financial Summary ({recipients.length} Recipients)
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  Includes individual curation, laser-foil custom packaging, greeting cards, insured air freight, and 5% GST with ITC eligibility.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-stone-400 block uppercase">Estimated Total Cost</span>
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C9A45C]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-400 block">Avg. ₹{Math.round(grandTotal / recipients.length).toLocaleString('en-IN')} / recipient</span>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-stone-400 block text-[10px] uppercase">Gifts Base Value</span>
                <span className="font-bold text-lg text-white">₹{hampersTotal.toLocaleString('en-IN')}</span>
                <p className="text-[10px] text-stone-400">{recipients.length} hampers selected</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-stone-400 block text-[10px] uppercase">Packaging &amp; Branding</span>
                <span className="font-bold text-lg text-white">₹{brandingTotal.toLocaleString('en-IN')}</span>
                <p className="text-[10px] text-stone-400">Laser logos + gold parchment</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-stone-400 block text-[10px] uppercase">Insured Air Logistics</span>
                <span className="font-bold text-lg text-white">₹{logisticsTotal.toLocaleString('en-IN')}</span>
                <p className="text-[10px] text-stone-400">{domesticRecipients} Domestic · {internationalRecipients} Int&apos;l</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-stone-400 block text-[10px] uppercase">5% GST (Tax Invoice)</span>
                <span className="font-bold text-lg text-white">₹{gstTotal.toLocaleString('en-IN')}</span>
                <p className="text-[10px] text-stone-400">Full ITC tax claim enabled</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-900/60 border border-red-500 rounded-xl text-xs text-red-200">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <span>🛡️</span> Zero payment required at upload stage. Formal GST proforma invoice and sample box dispatched prior to billing.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? 'Structuring Campaign...' : '⚡ Submit Campaign for Formal Approval →'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
