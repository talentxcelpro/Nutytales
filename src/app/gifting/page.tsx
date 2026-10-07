'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import DemandCaptureModal from '@/components/demand/DemandCaptureModal'
import SourcingRequestBanner from '@/components/demand/SourcingRequestBanner'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

// ── Flagship Hamper Collections ──────────────────────────────────────────────
const FLAGSHIP_HAMPERS = [
  {
    id: 'zabarwan-royal',
    title: 'The Royal Zabarwan Walnut Wood Casket',
    subtitle: 'Hand-Carved Kashmir Walnut Wood · Pure Saffron',
    tier: 'Executive / CXO Luxury',
    price: 4950,
    minQty: 25,
    image: '/images/luxury-hamper-jars.png',
    badge: 'KASHMIR HERITAGE',
    contents: [
      'Pure Pampore Mongra Saffron (1g GI-Tagged)',
      'Hand-Graded Kashmiri Mamra Badam (250g)',
      'Jumbo Jumbo W180 Roasted Cashews (250g)',
      'Raw Wild High-Altitude Forest Honey (200g)',
      'Solid Walnut Wood Keepsake Box with Brass Lock',
    ],
    customization: 'Laser-engraved company emblem & personalized CXO wax letter',
  },
  {
    id: 'corporate-executive-trunk',
    title: 'The Executive Vegan Leatherette Trunk',
    subtitle: 'Diwali 2026 Bestseller · Multi-Address Favorite',
    tier: 'Management & Client Appreciation',
    price: 2450,
    minQty: 50,
    image: '/images/corporate-diwali-gifting.jpg',
    badge: 'DIWALI 2026 BESTSELLER',
    contents: [
      'California Nonpareil Roasted Salted Almonds (200g)',
      'Premium W240 Whole Cashews (200g)',
      'Green Long Indian Kishmish (200g)',
      'Afghan Shakarpara Dried Figs / Anjeer (200g)',
      'Custom Foil Embossed Outer Sleeve & Gold Ribbon',
    ],
    customization: 'Hot-foil logo stamping on lid, QR video greetings inside',
  },
  {
    id: 'artisan-chinar-rigid',
    title: 'The Chinar Gold Foil Rigid Gift Box',
    subtitle: 'Elegant 4-Jar Presentation · ESG Paperboard',
    tier: 'Pan-Company Festive Rollout',
    price: 1350,
    minQty: 100,
    image: '/images/luxury-teal-gift-box.jpg',
    badge: 'BEST VALUE AT SCALE',
    contents: [
      'Light Halves Kashmiri Kagzi Walnuts (150g)',
      'Chilean Roasted Pistachios in Shell (150g)',
      'Roasted & Flavored Makhana Herbs & Spices (80g)',
      'Arabian Royal Medjool Dates (150g)',
      'Food-Grade Recyclable Glass Jars with Gold Caps',
    ],
    customization: 'Custom Pantone-matched brand sleeve & bilingual greeting card',
  },
  {
    id: 'festive-long-casket',
    title: 'The Gulmarg Festive Celebration Casket',
    subtitle: 'Compact Luxury · Perfect for Courier Dispatch',
    tier: 'Employee Multi-City Dispatch',
    price: 890,
    minQty: 150,
    image: '/images/long-festive-gift-box.jpg',
    badge: 'LIGHTWEIGHT AIR-READY',
    contents: [
      'Selected California Almonds (100g)',
      'Crunchy Roasted Cashews (100g)',
      'Golden Seedless Raisins (100g)',
      'Chatpata Peri Peri Makhana (50g)',
      'Magnetic Closure Rigid Gift Pack with Satin Pull',
    ],
    customization: 'Direct laser logo printing and individual courier delivery labels',
  },
]

export default function GiftingPage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const whatsappPhone = (WHATSAPP_NUMBERS.CORPORATE || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // ── Interactive Hamper Estimator State ──
  const [estRecipients, setEstRecipients] = useState(250)
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<number>(2450)
  const [brandingOption, setBrandingOption] = useState<'laser' | 'foil' | 'custom-box'>('foil')
  const [dispatchMode, setDispatchMode] = useState<'multi-city' | 'single-hub'>('multi-city')

  // Calculated Estimates
  const brandingUnitCost = brandingOption === 'laser' ? 120 : brandingOption === 'custom-box' ? 180 : 60
  const deliveryUnitCost = dispatchMode === 'multi-city' ? 140 : 25
  const subtotalPerUnit = selectedBudgetTier + brandingUnitCost + deliveryUnitCost
  const totalOrderValue = subtotalPerUnit * estRecipients
  const gstCreditSavings = Math.round(totalOrderValue * 0.12) // Estimated 12% GST recoverable
  const earlyBirdSavings = Math.round(totalOrderValue * 0.15) // 15% Early Bird discount

  return (
    <div className="bg-[#FAF7F2] text-[#17233B]">
      {/* ── 1. Diwali 2026 Early Bird Flash Alert ────────────────────────────── */}
      <div id="diwali-2026" className="bg-[#17233B] text-white border-b border-[#C9A45C]/30 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#C9A45C] text-[#17233B] font-bold text-[10px] uppercase tracking-wider">
              Early Bird 2026
            </span>
            <span className="font-medium text-stone-200">
              Diwali Corporate Booking Window Open: Lock Q3/Q4 festive harvest inventory with <strong>15% Early-Bird Advantage</strong> &amp; Guaranteed Dispatch.
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-[#C9A45C]">
            <span>Dispatch Window: Oct 15 – Nov 05, 2026</span>
            <Link href="/gifting/recipients" className="hover:underline text-white flex items-center gap-1">
              <span>Launch Multi-Recipient Desk</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] py-16 sm:py-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-bold uppercase tracking-widest shadow-sm">
                <span>🎁</span> NUTTY TALES GIFTING · GLOBAL CORPORATE DESK
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17233B] tracking-tight leading-[1.15]">
                Corporate Gifting, <br />
                <span className="italic text-[#704B32]">Executed Flawlessly</span> at Scale.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-2xl">
                Elevate your Diwali, client milestones, and executive rewards. Direct high-altitude Kashmiri dry fruits, artisanal walnut wood boxes, precision laser branding, and door-to-door multi-address delivery across 19,000+ Indian PIN codes, Dubai, and London.
              </p>

              {/* Wedge Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm flex items-center gap-2.5">
                  <span className="text-lg text-[#C9A45C]">⚡</span>
                  <div>
                    <strong className="block text-[#17233B]">Multi-Recipient Desk</strong>
                    <span className="text-stone-500 text-[11px]">CSV / Excel 1-Click Upload</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm flex items-center gap-2.5">
                  <span className="text-lg text-[#C9A45C]">🏢</span>
                  <div>
                    <strong className="block text-[#17233B]">Custom Laser Branding</strong>
                    <span className="text-stone-500 text-[11px]">Lid foil, metal tag &amp; cards</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <span className="text-lg text-[#C9A45C]">🧾</span>
                  <div>
                    <strong className="block text-[#17233B]">100% GST Invoicing</strong>
                    <span className="text-stone-500 text-[11px]">Full input tax recovery</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/gifting/recipients"
                  className="px-7 py-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <span>⚡</span>
                  <span>Upload Recipient Roster</span>
                </Link>

                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="px-7 py-4 bg-[#17233B] hover:bg-stone-800 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
                >
                  <span>📋</span>
                  <span>Request Corporate Proposal</span>
                </button>

                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    'Hello Nutty Tales Gifting! I need a corporate quotation for Diwali 2026 hampers.',
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-4 border border-stone-300 hover:border-stone-400 bg-white text-stone-700 font-semibold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-sm"
                >
                  <span className="text-emerald-600">💬</span>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
                <Image
                  src="/images/corporate-diwali-gifting.jpg"
                  alt="Nutty Tales Corporate Gifting Luxury Hampers"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10192A]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#C9A45C] text-[#17233B] font-bold text-[10px] uppercase tracking-wider">
                    Diwali 2026 Edition
                  </div>
                  <h3 className="font-serif text-xl font-bold">The Royal Corporate Heritage Trunk</h3>
                  <p className="text-xs text-stone-200">
                    Hand-carved walnut wood accents, vacuum-sealed Kashmir Mamra almonds, and laser brass insignia.
                  </p>
                </div>
              </div>

              {/* Floating Stat Widget */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl border border-stone-200 shadow-xl max-w-xs hidden sm:flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  ✓
                </div>
                <div className="text-xs">
                  <strong className="block text-[#17233B] text-sm">45,000+ Hampers</strong>
                  <span className="text-stone-500">Delivered across 48 enterprise accounts in FY25-26</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Hamper Budget & ROI Estimator ─────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Transparent Corporate Pricing
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B]">
              Interactive Corporate Hamper Estimator
            </h2>
            <p className="text-stone-600 text-sm font-light">
              Simulate budget, packaging choice, and logistics mode to see instantaneous total order cost and GST input savings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#FAF6EE] p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Recipient Count Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-[#17233B]">Total Recipients / Quantity:</span>
                  <span className="text-[#704B32] font-mono text-base px-3 py-1 bg-white rounded-lg border border-stone-200">
                    {estRecipients.toLocaleString('en-IN')} Units
                  </span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="2000"
                  step="25"
                  value={estRecipients}
                  onChange={(e) => setEstRecipients(Number(e.target.value))}
                  className="w-full accent-[#704B32] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>25 Units (Min)</span>
                  <span>500 Units</span>
                  <span>1,000 Units</span>
                  <span>2,000+ Units (Enterprise)</span>
                </div>
              </div>

              {/* Per-Hamper Budget Tier */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#17233B] uppercase tracking-wider block">
                  Select Hamper Tier:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Essential', price: 890, sub: '₹890 / box' },
                    { label: 'Premium', price: 1350, sub: '₹1,350 / box' },
                    { label: 'Executive', price: 2450, sub: '₹2,450 / box' },
                    { label: 'Royal Casket', price: 4950, sub: '₹4,950 / box' },
                  ].map((t) => (
                    <button
                      key={t.price}
                      type="button"
                      onClick={() => setSelectedBudgetTier(t.price)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        selectedBudgetTier === t.price
                          ? 'border-[#17233B] bg-[#17233B] text-white shadow-md'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <strong className="block text-xs">{t.label}</strong>
                      <span className={`text-[11px] font-mono ${selectedBudgetTier === t.price ? 'text-[#C9A45C]' : 'text-stone-500'}`}>
                        {t.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Branding Customization */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#17233B] uppercase tracking-wider block">
                  Corporate Branding Level:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    { id: 'foil', label: 'Hot-Foil Gold Logo', cost: '+₹60 / box' },
                    { id: 'laser', label: 'Laser-Etched Wood/Brass', cost: '+₹120 / box' },
                    { id: 'custom-box', label: 'Full Bespoke Trunk', cost: '+₹180 / box' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBrandingOption(b.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        brandingOption === b.id
                          ? 'border-[#704B32] bg-[#704B32] text-white'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <span className="block font-semibold">{b.label}</span>
                      <span className={`text-[10px] ${brandingOption === b.id ? 'text-[#C9A45C]' : 'text-stone-500'}`}>
                        {b.cost}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Logistics */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#17233B] uppercase tracking-wider block">
                  Dispatch Logistics:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setDispatchMode('multi-city')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      dispatchMode === 'multi-city'
                        ? 'border-[#176B68] bg-[#176B68] text-white'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    <span className="block font-bold">Multi-City Doorstep Dispatch</span>
                    <span className="text-[11px] opacity-80">Shipped direct to employee/client homes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchMode('single-hub')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      dispatchMode === 'single-hub'
                        ? 'border-[#176B68] bg-[#176B68] text-white'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    <span className="block font-bold">Single Centralized Office Drop</span>
                    <span className="text-[11px] opacity-80">Pallet delivery to your corporate HQ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-lg space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C]">
                  Live Quotation Preview
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                  Estimated Investment
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Base Hamper Unit Price:</span>
                  <span className="font-mono font-bold text-[#17233B]">₹{selectedBudgetTier.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Branding Customization:</span>
                  <span className="font-mono font-bold text-[#17233B]">₹{brandingUnitCost}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Logistics &amp; Packing:</span>
                  <span className="font-mono font-bold text-[#17233B]">₹{deliveryUnitCost}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-sm bg-stone-50 p-2 rounded-lg">
                  <span className="text-[#17233B]">All-Inclusive Per Box:</span>
                  <span className="font-mono text-[#704B32]">₹{subtotalPerUnit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-4 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-stone-700">Estimated Total Order:</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#17233B]">
                    ₹{totalOrderValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 space-y-0.5">
                  <div className="flex items-center gap-1 font-bold">
                    <span>✓</span> 18% GST Input Credit Recovery: ~₹{gstCreditSavings.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-1 font-bold text-[#704B32]">
                    <span>✦</span> Diwali 2026 Early-Bird Benefit: ~₹{earlyBirdSavings.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href={`/gifting/recipients?tier=${selectedBudgetTier}&qty=${estRecipients}&brand=${brandingOption}`}
                  className="block w-full text-center py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Proceed with {estRecipients} Recipients →
                </Link>
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="block w-full text-center py-3 bg-[#17233B] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Download Formal PDF Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Flagship Hamper Collections Showcase ─────────────────────────── */}
      <section id="hampers" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Bespoke Catalog
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B]">
              The 2026 Corporate Collection
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm font-light max-w-2xl">
              From executive walnut wood caskets to featherlight multi-city postal mailers, each box is filled with FSSAI-certified fresh harvest dry fruits and vacuum-fresh packaging.
            </p>
          </div>
          <Link
            href="/gifting/recipients"
            className="px-6 py-3.5 bg-[#17233B] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-stone-800 transition-colors shadow-sm flex-shrink-0"
          >
            Open Multi-Recipient Desk →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FLAGSHIP_HAMPERS.map((hamper) => (
            <div
              key={hamper.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={hamper.image}
                    alt={hamper.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#17233B]/90 backdrop-blur-sm text-[#C9A45C] px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {hamper.badge}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/95 text-[#17233B] px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-md">
                    ₹{hamper.price.toLocaleString('en-IN')} <span className="text-[10px] text-stone-500 font-sans">/ unit</span>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                      {hamper.tier} · MOQ {hamper.minQty} units
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#17233B] leading-tight">
                      {hamper.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">{hamper.subtitle}</p>
                  </div>

                  {/* Contents Pill List */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
                      Included Ingredients:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-700">
                      {hamper.contents.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-[#C9A45C]">✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-[#FAF6EE] rounded-xl text-[11px] text-[#704B32] font-medium border border-stone-200">
                    <strong>Branding Option:</strong> {hamper.customization}
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0 flex flex-wrap gap-3">
                <Link
                  href={`/gifting/recipients?selectedHamper=${hamper.id}`}
                  className="flex-1 py-3 px-5 text-center bg-[#17233B] hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Configure For Recipients
                </Link>
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="py-3 px-5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Request Sample Box
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Enterprise Capabilities Banner ────────────────────────────────── */}
      <section className="bg-[#10192A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Enterprise Infrastructure
            </span>
            <h2 className="font-serif text-3xl font-bold">
              Built for Fortune 500 Procurement Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <span className="text-2xl">📋</span>
              <h4 className="font-bold text-white text-sm">Centralized Excel Ingestion</h4>
              <p className="text-stone-400 font-light leading-relaxed">
                Upload your master employee or client address spreadsheet. Our system automatically validates pin codes and normalizes phone numbers.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <span className="text-2xl">📦</span>
              <h4 className="font-bold text-white text-sm">Live Dispatch Tracking</h4>
              <p className="text-stone-400 font-light leading-relaxed">
                Real-time dashboard tracking air-waybills (AWB) across Blue Dart, Delhivery, and DHL with automated delivery confirmation to HR.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <span className="text-2xl">🏅</span>
              <h4 className="font-bold text-white text-sm">NABL Lab Certification</h4>
              <p className="text-stone-400 font-light leading-relaxed">
                Every batch is tested for zero aflatoxins, precise moisture levels, and chemical residue compliance under FSSAI Central License standards.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <span className="text-2xl">🛡️</span>
              <h4 className="font-bold text-white text-sm">Escrow &amp; Net-30 Invoicing</h4>
              <p className="text-stone-400 font-light leading-relaxed">
                Seamless corporate onboarding for enterprise vendors with registered MSME/GSTIN compliance, purchase order (PO) terms, and vendor approvals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Sourcing Banner ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SourcingRequestBanner
          vertical="gifting"
          contextText="Need custom logo-embossed leatherette trunks, silver carafes, multi-city recipient uploads, or custom-roast dry fruit curation for your brand?"
        />
      </div>

      <DemandCaptureModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultVertical="gifting"
        title="Request Corporate Diwali 2026 Proposal"
        subtitle="Share your target quantity, per-box budget, and delivery timeline. Our corporate gifting studio will dispatch physical samples and formal quotation within 4 hours."
      />
    </div>
  )
}
