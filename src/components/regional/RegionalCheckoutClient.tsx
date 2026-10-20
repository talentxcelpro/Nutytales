'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  RegionalConfig,
  formatRegionalPrice,
  getRegionalProductPrice,
  cleanRegionalSlug,
} from '@/lib/regional-data'
import { CurrencyCode, SUPPORTED_CURRENCIES } from '@/lib/global-config'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  price?: number
  formattedPrice?: string
  currency?: CurrencyCode
  image?: string
  quantity: number
  variant?: string
  region?: string
}

export default function RegionalCheckoutClient({
  config,
  initialCurrency,
}: {
  config: RegionalConfig
  initialCurrency?: CurrencyCode
}) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(
    initialCurrency || config.defaultCurrency
  )

  // Form Fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState(config.supportedCountries[0]?.name || '')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [stateRegion, setStateRegion] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [giftNote, setGiftNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'whatsapp' | 'wire'>('card')

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null)

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nt_cart')
      if (stored) {
        const parsed = JSON.parse(stored)
        setCart(parsed)
      }
    } catch {
      setCart([])
    }
    setIsLoaded(true)
  }, [])

  // Calculate Subtotal in active currency
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.price || 0
    return sum + itemPrice * item.quantity
  }, 0)

  // Shipping calculation
  const isFreeShipping = subtotal >= config.freeShippingThreshold || subtotal === 0
  const standardShippingFee = config.key === 'me' ? 35 : config.key === 'eu' ? 10 : 12
  const shippingFee = isFreeShipping ? 0 : standardShippingFee
  const grandTotal = subtotal + shippingFee

  const formattedSubtotal = formatRegionalPrice(subtotal, activeCurrency)
  const formattedShipping = isFreeShipping
    ? 'FREE (Pre-Paid Cargo)'
    : formatRegionalPrice(shippingFee, activeCurrency)
  const formattedGrandTotal = formatRegionalPrice(grandTotal, activeCurrency)

  const handleRemoveItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index)
    setCart(updated)
    try {
      localStorage.setItem('nt_cart', JSON.stringify(updated))
      window.dispatchEvent(new Event('nt_cart_updated'))
    } catch {
      // Ignore
    }
  }

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Generate regional order identifier
    const randDigits = Math.floor(100000 + Math.random() * 900000)
    const orderId = `NT-${config.key.toUpperCase()}-${new Date().getFullYear()}-${randDigits}`

    // Construct WhatsApp message if user chooses WhatsApp or wants backup copy
    const itemsSummary = cart
      .map(
        (i) =>
          `• ${i.name} [${i.variant || 'Standard'}] × ${i.quantity} = ${
            i.formattedPrice || formatRegionalPrice((i.price || 0) * i.quantity, activeCurrency)
          }`
      )
      .join('\n')

    const orderPayload = {
      orderId,
      region: config.key,
      brandName: config.brandName,
      customer: {
        fullName,
        phone,
        email,
        country,
        address,
        city,
        stateRegion,
        postalCode,
        giftNote,
      },
      currency: activeCurrency,
      subtotal,
      shippingFee,
      grandTotal,
      paymentMethod,
      items: cart,
      createdAt: new Date().toISOString(),
    }

    try {
      // Store past order details locally
      localStorage.setItem('nt_last_order', JSON.stringify(orderPayload))
      localStorage.removeItem('nt_cart')
      window.dispatchEvent(new Event('nt_cart_updated'))
    } catch {
      // Ignore
    }

    // Set order placed state
    setTimeout(() => {
      setSubmittedOrderId(orderId)
      setIsSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 700)
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nuty Tales International Desk! ✈️\n\nI have placed an international order for delivery to ${country}.\n\n*Order ID:* ${submittedOrderId || 'Pending'}\n*Region Portal:* ${config.subdomain}\n*Recipient:* ${fullName}\n*Phone:* ${phone}\n*Address:* ${address}, ${city}, ${stateRegion} ${postalCode}, ${country}\n\n*Items Ordered:*\n${cart
      .map(
        (i) =>
          `• ${i.name} (${i.variant || '1kg'}) × ${i.quantity} = ${
            i.formattedPrice || formatRegionalPrice((i.price || 0) * i.quantity, activeCurrency)
          }`
      )
      .join('\n')}\n\n*Total Amount:* ${formattedGrandTotal} (${activeCurrency})\n*Customs Clearance:* 100% Pre-Paid (DDP)\n\nPlease confirm dispatch flight and tracking number!`
  )}`

  // ── Render: Order Confirmed Screen ───────────────────────────────────────────
  if (submittedOrderId) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-8 animate-in fade-in duration-500">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-4xl shadow-xl">
          ✈️
        </div>

        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
            Order Reference: {submittedOrderId}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            International Order Dispatched to Hub
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto font-light leading-relaxed">
            Thank you, <strong className="text-white font-medium">{fullName}</strong>. Your harvest consignment has been registered with our{' '}
            <strong className="text-amber-300">{config.regionalHub}</strong> for cold-chain packaging and direct carrier clearance via{' '}
            <strong className="text-white">{config.shippingCarriers.join(' & ')}</strong>.
          </p>
        </div>

        {/* Dispatch Guarantee Card */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left space-y-3 text-xs text-stone-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-bold uppercase tracking-wider text-amber-400">
              Delivery Itinerary &amp; DDP Verification
            </span>
            <span className="font-mono text-emerald-400 font-bold">100% Pre-Paid Customs</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-stone-400 block text-[11px]">Destination Country:</span>
              <span className="text-white font-bold text-sm">{country}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Delivery Timeframe:</span>
              <span className="text-white font-bold text-sm">{config.deliveryEstimate}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Consignment Value:</span>
              <span className="text-white font-bold text-sm">{formattedGrandTotal}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Air Carrier Assigned:</span>
              <span className="text-white font-bold text-sm">{config.shippingCarriers[0]} Express Priority</span>
            </div>
          </div>
        </div>

        {/* WhatsApp & Catalog Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition"
          >
            <span>💬</span>
            <span>Receive WhatsApp Flight Tracking Updates</span>
          </a>

          <Link
            href={`${config.pathPrefix}/store`}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition"
          >
            Return to {config.brandName} Catalog
          </Link>
        </div>
      </div>
    )
  }

  // ── Render: Empty Cart Screen ───────────────────────────────────────────────
  if (isLoaded && cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl">
          🧺
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-white">
            Your {config.packagingBadge} Bag is Empty
          </h1>
          <p className="text-sm text-stone-300 font-light max-w-md mx-auto">
            Select from our single-origin Kashmiri Kagzi walnuts, Mongra saffron, high-oil Mamra almonds, and signature {config.packagingBadge.toLowerCase()} selections.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href={`${config.pathPrefix}/store`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-xl transition"
          >
            <span>Browse {config.brandName} Catalog</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    )
  }

  // ── Render: Active Checkout Form ────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-400">
        <Link href={config.pathPrefix} className="hover:text-white transition">
          {config.brandName}
        </Link>
        <span>/</span>
        <Link href={`${config.pathPrefix}/store`} className="hover:text-white transition">
          Catalog
        </Link>
        <span>/</span>
        <span className="text-amber-400 font-medium">International Checkout</span>
      </nav>

      {/* Header Banner */}
      <div className="border-b border-white/10 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <span>{config.subdomain}</span>
            <span>·</span>
            <span>Cross-Border Air Dispatch</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
            Secure International Checkout
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light mt-1">
            Customs pre-paid (DDP), cold-chain air freight, and doorstep delivery across {config.supportedCountries.length} countries.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs">
          <span className="text-stone-400">Billing Currency:</span>
          <div className="flex items-center gap-1 bg-[#121B2D] p-1 rounded-xl border border-white/10">
            {config.supportedCurrencies.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCurrency(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                  activeCurrency === c
                    ? 'bg-amber-500 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Form (7 cols) + Order Summary (5 cols) */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Recipient Details, Shipping & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Destination Country & Recipient */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>1.</span>
                <span>Destination Country &amp; Recipient Details</span>
              </h2>
              <span className="text-[11px] text-amber-300 font-mono font-bold">
                {config.deliveryEstimate}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Country Picker */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-stone-300">
                  Destination Country / Territory *
                </label>
                <select
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#121B2D] border border-white/15 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 font-medium"
                >
                  {config.supportedCountries.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Full Name */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-stone-300">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tariq Al-Mansoor / Sarah Jenkins"
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* WhatsApp / Mobile Number */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-stone-300">
                  Mobile Number (with Country Code) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={
                    config.key === 'me'
                      ? '+971 50 XXX XXXX'
                      : config.key === 'eu'
                      ? '+44 7XXX XXXXXX'
                      : '+1 (555) XXX-XXXX'
                  }
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Email Address */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-stone-300">
                  Email Address (for Air Waybill &amp; Courier Tracking) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Street Address / Villa / Apartment */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-stone-300">
                  Street Address (Villa, Apartment, Building, Street) *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Villa 14, Al Safa 2, Jumeirah / 45 Kensington High St"
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* City / Emirate */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-stone-300">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dubai / London / New York"
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* State / Province / County */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-stone-300">
                  State / Emirate / Province *
                </label>
                <input
                  type="text"
                  required
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="e.g. Dubai / Greater London / California"
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Postal Code / ZIP */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-stone-300">
                  Postal / ZIP Code {config.key === 'me' ? '(Optional)' : '*'}
                </label>
                <input
                  type="text"
                  required={config.key !== 'me'}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder={config.key === 'me' ? '00000 or P.O. Box' : 'e.g. SW1A 1AA / 10001'}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Gift Message Note */}
              <div className="sm:col-span-2 space-y-1.5 pt-2">
                <label className="block font-bold uppercase tracking-wider text-stone-300">
                  Custom Gift Hamper Message / Delivery Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Printed on gold-foil parchment placed inside the presentation hamper..."
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment & Settlement Method */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <span>2.</span>
              <span>Settlement &amp; Verification Method</span>
            </h2>

            <div className="space-y-3 text-xs">
              {/* Option 1: Global Card */}
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition ${
                  paymentMethod === 'card'
                    ? 'bg-amber-500/15 border-amber-400 text-white'
                    : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-0.5 text-amber-500"
                />
                <div className="space-y-1">
                  <span className="font-bold text-white block">
                    International Credit / Debit Card (Visa, Mastercard, Amex)
                  </span>
                  <span className="text-[11px] text-stone-400 block font-light">
                    Processed in {activeCurrency} with 3D-Secure 2 authentication. Pre-clears import duties automatically.
                  </span>
                </div>
              </label>

              {/* Option 2: WhatsApp Express Order */}
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition ${
                  paymentMethod === 'whatsapp'
                    ? 'bg-emerald-500/15 border-emerald-400 text-white'
                    : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'whatsapp'}
                  onChange={() => setPaymentMethod('whatsapp')}
                  className="mt-0.5 text-emerald-500"
                />
                <div className="space-y-1">
                  <span className="font-bold text-white block">
                    Instant WhatsApp Concierge Booking &amp; Payment Link
                  </span>
                  <span className="text-[11px] text-stone-400 block font-light">
                    Connect directly with our {config.brandName} desk. Receive an instant payment invoice via Apple Pay / Card / Bank Link.
                  </span>
                </div>
              </label>

              {/* Option 3: Corporate Bank Wire */}
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition ${
                  paymentMethod === 'wire'
                    ? 'bg-blue-500/15 border-blue-400 text-white'
                    : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'wire'}
                  onChange={() => setPaymentMethod('wire')}
                  className="mt-0.5 text-blue-500"
                />
                <div className="space-y-1">
                  <span className="font-bold text-white block">
                    International Wire / SEPA / ACH (Corporate &amp; Large Gift Orders)
                  </span>
                  <span className="text-[11px] text-stone-400 block font-light">
                    Direct wire transfer details will be generated upon confirmation with pro-forma invoice.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Action (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/15 space-y-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif text-lg font-bold text-white">
                Consignment Summary ({cart.reduce((n, i) => n + i.quantity, 0)} items)
              </h3>
              <span className="text-xs text-amber-400 font-mono font-bold">
                {activeCurrency}
              </span>
            </div>

            {/* Cart Items List */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1 text-xs">
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-900 border border-white/10 flex-shrink-0">
                    <Image
                      src={item.image || '/images/luxury-hamper-jars.png'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white truncate text-xs">{item.name}</h4>
                    <p className="text-[10px] text-stone-400 truncate">
                      {item.variant || 'Standard 1kg Pack'} · Qty: {item.quantity}
                    </p>
                    <span className="text-amber-400 font-mono font-bold text-xs">
                      {item.formattedPrice ||
                        formatRegionalPrice((item.price || 0) * item.quantity, activeCurrency)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-stone-400 hover:text-rose-400 text-xs px-2 py-1"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Financial Calculations */}
            <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono text-white font-semibold">{formattedSubtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>International Air Cargo</span>
                <span className="font-mono text-emerald-400 font-semibold">{formattedShipping}</span>
              </div>

              <div className="flex justify-between">
                <span>Import Customs &amp; Taxes (DDP)</span>
                <span className="text-emerald-400 font-bold">100% Pre-Paid</span>
              </div>

              <div className="border-t border-white/15 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-base font-bold text-white block">
                    Total Amount
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Taxes &amp; direct delivery fees included
                  </span>
                </div>
                <span className="font-mono text-2xl font-bold text-amber-400">
                  {formattedGrandTotal}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering Flight Consignment...</span>
              ) : (
                <>
                  <span>Confirm &amp; Place International Order</span>
                  <span>✈️</span>
                </>
              )}
            </button>

            {/* Trust Footer */}
            <div className="space-y-1 text-[11px] text-stone-400 pt-1 font-light text-center">
              <p>🔒 256-Bit Encrypted International Checkout</p>
              <p>📦 Packed under nitrogen seal at {config.regionalHub}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
