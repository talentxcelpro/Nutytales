'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function CraftsSwatchAndConsignmentDesk() {
  const [boutiqueName, setBoutiqueName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [destinationRegion, setDestinationRegion] = useState('United Kingdom / London')
  const [selectedFocus, setSelectedFocus] = useState('GI Pashmina Shawls & Stoles')
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsOrdering(true)

    const ref = `SWATCH-CRAFT-${Date.now().toString().slice(-6)}`

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'wholesale_swatch_box',
          vertical: 'crafts',
          referenceId: ref,
          customer: {
            fullName: contactName,
            companyName: boutiqueName,
            phone,
            email,
            address: shippingAddress,
            city: destinationRegion,
          },
          items: [
            {
              name: 'Boutique Wholesale Swatch Box & Cashmere Authenticity Kit',
              qty: 1,
              price: 2999,
            },
          ],
          total: 2999,
          paymentMethod: 'razorpay_instant',
          notes: `Focus: ${selectedFocus} | Region: ${destinationRegion} | 100% PO Consignment Credit eligible`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setOrderSuccess(ref)
      } else {
        setErrorMsg(data.error || 'Failed to place swatch box order.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsOrdering(false)
    }
  }

  return (
    <div id="swatch-desk" className="bg-gradient-to-br from-[#10192A] via-[#1E2B3E] to-[#121B2B] text-white rounded-3xl p-6 sm:p-10 border border-[#C9A45C]/40 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/20 text-[#C9A45C] text-xs font-bold uppercase tracking-widest border border-[#C9A45C]/30">
            <span>🧣</span> BOUTIQUE WHOLESALE SWATCH &amp; CASHFLOW DESK
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            Inspect Fibers &amp; Weaves Before Contracting: <span className="text-[#C9A45C]">Order Swatch Box</span>
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-3xl leading-relaxed font-light">
            Luxury fashion buyers in London, Milan, Dubai, and New York never purchase handloom consignments unseen. Order our <strong>Boutique Wholesale Swatch Box &amp; Cashmere Authenticity Kit for ₹2,999 ($39 / £29)</strong> with <strong>100% credit on your first order</strong>.
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-xs uppercase font-bold text-[#C9A45C] tracking-wider">Air Express Courier</div>
          <div className="text-lg font-serif font-bold text-white">Dispatched in 24 Hours</div>
        </div>
      </div>

      {orderSuccess ? (
        <div className="bg-[#17233B] border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold mx-auto">
            ✓
          </div>
          <h3 className="text-xl font-bold font-serif text-white">
            Boutique Swatch Box Confirmed &amp; Queued for Express Air Courier!
          </h3>
          <p className="font-mono text-sm text-[#C9A45C] bg-white/5 py-1.5 px-4 rounded-lg inline-block border border-white/10">
            Order Ref: {orderSuccess} · ₹2,999 (100% Consignment Credit Guaranteed)
          </p>
          <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
            Your physical swatch dossier is prepared by our master guild curators and dispatched via DHL / Blue Dart Air within 24 hours. Includes certified 14.5µm Pashmina yarn specimens, Sozni needlework swatches, and a ₹2,999 credit voucher valid on your first boutique purchase order (&gt;25 units).
          </p>
          <div className="pt-3 flex justify-center gap-3">
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                `Hello Nutty Tales Crafts Export Desk! I just ordered Boutique Swatch Box (Ref: ${orderSuccess}) for ${boutiqueName || 'our boutique'}. Please share courier AWB.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              WhatsApp Export Desk →
            </a>
            <button
              type="button"
              onClick={() => setOrderSuccess(null)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-bold rounded-xl"
            >
              Order Another Box
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: What's inside the Swatch Box */}
          <div className="lg:col-span-5 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A45C]">
                Artisan Quality Evaluation Kit
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-bold">
                100% PO Credit
              </span>
            </div>

            <div className="border-b border-white/10 pb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-serif text-white">₹2,999</span>
                <span className="text-xs text-stone-400">($39 USD / £29 GBP) Delivered</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                ✓ 100% of ₹2,999 credited back against your first wholesale consignment (&gt;25 units)
              </p>
            </div>

            <div className="space-y-2 text-xs text-stone-200">
              <span className="font-bold text-white block text-[11px] uppercase tracking-wider">
                Contents of Your Swatch Dossier:
              </span>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold">•</span>
                  <span><strong>6 Tactile Fiber Swatches:</strong> 14.5µm Changthangi Pashmina, Semi-Pashmina, Fine Merino, Silk-Pashmina blend</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold">•</span>
                  <span><strong>Embroidery Technique Cards:</strong> Sozni fine needlework, Kani jacquard-loom weave, Aari hook chain-stitch</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold">•</span>
                  <span><strong>Walnut Wood Finish Blocks:</strong> Hand-carved Chinar leaf &amp; dragon motifs in raw, beeswax, and walnut oil polish</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold">•</span>
                  <span><strong>Govt. GI Tag Verification Kit:</strong> Sample holographic QR tag with laboratory micro-testing certificate</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-stone-300 space-y-1">
              <div className="text-[#C9A45C] font-bold">Provenance &amp; Logistics Axis:</div>
              <div>• Srinagar Guilds: Kanihama &amp; Zadibal Master Artisans</div>
              <div>• Export Inspection Hub: Noida Executive Logistics Corridor</div>
              <div>• Eastern Traditional Weaves: Mithila Artisan Connections</div>
            </div>
          </div>

          {/* Right: Quick Order Form */}
          <div className="lg:col-span-7 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white flex items-center justify-between">
              <span>Enter Boutique Address for Express Swatch Dispatch</span>
              <span className="text-xs font-mono text-[#C9A45C]">Step 1 of 1</span>
            </h3>

            <form onSubmit={handleOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Boutique / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={boutiqueName}
                    onChange={(e) => setBoutiqueName(e.target.value)}
                    placeholder="e.g. Mayfair Luxury Label"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Buyer / Curator Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 20 7123 4567"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buyer@brand.com"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Target Product Line</label>
                  <select
                    value={selectedFocus}
                    onChange={(e) => setSelectedFocus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#17233B] border border-white/20 text-white"
                  >
                    <option value="GI Pashmina Shawls & Stoles">GI Pashmina Shawls &amp; Stoles (14.5µm)</option>
                    <option value="Hand-Embroidered Velvet Pherans">Hand-Embroidered Velvet Pherans</option>
                    <option value="Carved Walnut Wood Decor & Boxes">Carved Walnut Wood Decor &amp; Boxes</option>
                    <option value="Hand-Knotted Silk Carpets">Hand-Knotted Silk Carpets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Destination Region</label>
                  <select
                    value={destinationRegion}
                    onChange={(e) => setDestinationRegion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#17233B] border border-white/20 text-white"
                  >
                    <option value="United Kingdom / London">United Kingdom / London</option>
                    <option value="UAE / Dubai & Abu Dhabi">UAE / Dubai &amp; Abu Dhabi</option>
                    <option value="United States / New York">United States / New York &amp; CA</option>
                    <option value="European Union / Paris & Milan">European Union / Paris &amp; Milan</option>
                    <option value="India / Domestic Commercial">India / Domestic Commercial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Courier Delivery Address *</label>
                <textarea
                  rows={2}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street address, suite/apartment, postal code, country..."
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isOrdering}
                  className="w-full py-3.5 bg-gradient-to-r from-[#C9A45C] to-[#E6CA85] hover:from-[#b5924d] hover:to-[#C9A45C] text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl disabled:opacity-50"
                >
                  {isOrdering
                    ? 'Preparing Swatch Kit...'
                    : 'Order Swatch Box (₹2,999 / $39) — Dispatched in 24h →'}
                </button>
                <p className="text-[11px] text-stone-400 text-center mt-2">
                  100% of ₹2,999 credited on your wholesale PO · International cards &amp; UPI accepted
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
