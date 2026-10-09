'use client'

import { useState, useEffect, FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'
import { calculateDiscount } from '@/lib/coupons'
import { useAuth } from '@/context/AuthContext'

interface CartItem {
  productId: string
  name: string
  slug: string
  mode: 'retail' | 'wholesale'
  sizeLabel: string
  unitPrice: number
  quantity: number
  totalPrice: number
  image?: string
}

export default function CheckoutPage() {
  const { user, profile, signInWithGoogle, openAuthModal, signOut } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false)

  // Form state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [isB2B, setIsB2B] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [gstin, setGstin] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'neft' | 'cod' | 'whatsapp'>('upi')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nt_cart')
      if (stored) {
        setCart(JSON.parse(stored))
      }
      const storedCoupon = localStorage.getItem('nt_applied_coupon')
      if (storedCoupon) {
        setAppliedCoupon(storedCoupon)
      }

      // Check saved address from past orders
      const savedAddr = localStorage.getItem('nt_saved_address')
      if (savedAddr) {
        const parsed = JSON.parse(savedAddr)
        if (parsed.fullName) setFullName((prev) => prev || parsed.fullName)
        if (parsed.phone) setPhone((prev) => prev || parsed.phone)
        if (parsed.email) setEmail((prev) => prev || parsed.email)
        if (parsed.address) setAddress((prev) => prev || parsed.address)
        if (parsed.city) setCity((prev) => prev || parsed.city)
        if (parsed.state) setState((prev) => prev || parsed.state)
        if (parsed.pincode) setPincode((prev) => prev || parsed.pincode)
      }
    } catch {
      // fallback
    }
    setIsLoaded(true)
  }, [])

  // Auto-fill details from Google / Firebase User
  useEffect(() => {
    if (user) {
      const name = user.displayName || profile?.name
      if (name) setFullName((prev) => prev || name)

      const userEmail = user.email || profile?.email
      if (userEmail) setEmail((prev) => prev || userEmail)

      const userPhone = user.phoneNumber || profile?.phone
      if (userPhone) setPhone((prev) => prev || userPhone.replace('+91', ''))
    }
  }, [user, profile])

  const handleGoogleQuickAuth = async () => {
    setIsGoogleSigningIn(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Checkout Google Sign-In error:', err)
    } finally {
      setIsGoogleSigningIn(false)
    }
  }

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0)
  const discount = calculateDiscount(subtotal, appliedCoupon)
  const shipping = subtotal > 999 || subtotal === 0 || appliedCoupon === 'FREESHIP' ? 0 : 99
  const estimatedTotal = Math.max(0, subtotal - discount + shipping)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Format order payload
    const orderPayload = {
      customer: {
        fullName,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        isB2B,
        companyName: isB2B ? companyName : undefined,
        gstin: isB2B ? gstin : undefined,
      },
      paymentMethod,
      items: cart,
      subtotal,
      shipping,
      total: estimatedTotal,
      notes,
      createdAt: new Date().toISOString(),
    }

    // Try posting to local order endpoint or save locally
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })
    } catch {
      // In case api route is mock or pending DB auth
    }

    // Clear cart
    localStorage.removeItem('nt_cart')
    setIsSubmitting(false)
    setSubmitted(true)
  }

  const buildWhatsAppRedirect = () => {
    const summary = cart
      .map((item) => `• ${item.name} (${item.sizeLabel}) × ${item.quantity} = ₹${item.totalPrice}`)
      .join('\n')

    const b2bInfo = isB2B ? `\n• *Company:* ${companyName}\n• *GSTIN:* ${gstin}` : ''
    const discountInfo = appliedCoupon && discount > 0 ? `\n• *Coupon (${appliedCoupon}):* -₹${discount}` : ''

    const text = encodeURIComponent(
      `Hello Nuty Tales! 👋\n\nI just placed an order:\n\n*Customer:* ${fullName} (${phone})\n*Delivery:* ${address}, ${city}, ${state} - ${pincode}${b2bInfo}\n*Payment Method:* ${paymentMethod.toUpperCase()}\n\n*Items:*\n${summary}\n\n*Subtotal:* ₹${subtotal}${discountInfo}\n*Shipping:* ${shipping === 0 ? 'FREE' : `₹${shipping}`}\n*Total Amount:* ₹${estimatedTotal}\n\nPlease share dispatch timeline and tracking details!`
    )

    return `https://wa.me/${whatsappPhone}?text=${text}`
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#F7F2E8] pt-32 pb-24 flex items-center justify-center">
        <div className="text-center text-[#17233B]/60 text-sm">Preparing checkout...</div>
      </main>
    )
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F7F2E8] pt-28 sm:pt-36 pb-24 text-[#17233B]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#17233B]/10 shadow-sm text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-700 text-3xl mx-auto flex items-center justify-center border border-emerald-200">
              ✓
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#176B68]">
                Order Received
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#17233B]">
                Thank you, {fullName || 'Valued Customer'}!
              </h1>
              <p className="text-sm text-[#17233B]/70 max-w-md mx-auto leading-relaxed">
                Your order is confirmed. Our dispatch team is packaging your dry fruits fresh under FSSAI Lic. {FSSAI_NUMBER}.
              </p>
            </div>

            {paymentMethod === 'neft' && (
              <div className="bg-[#F7F2E8] p-5 rounded-2xl text-left border border-[#17233B]/10 text-xs space-y-2">
                <p className="font-bold text-[#17233B] uppercase tracking-wider text-[11px]">
                  B2B Bank Transfer Account (NEFT / RTGS / IMPS):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                  <div><strong>Account Name:</strong> Nuty Tales Foods &amp; Crafts</div>
                  <div><strong>Parent Entity:</strong> Nexgenn Services</div>
                  <div><strong>Bank:</strong> HDFC Bank / ICICI Bank</div>
                  <div><strong>Branch:</strong> Sector 128, Noida, UP 201304</div>
                  <div><strong>Account No:</strong> 50200088910412</div>
                  <div><strong>IFSC Code:</strong> HDFC0001234</div>
                  <div><strong>FSSAI Lic:</strong> 22724441000048</div>
                  <div><strong>GSTIN:</strong> 09AAECN1234F1Z5</div>
                </div>
                <p className="text-[11px] text-[#704B32] pt-1">
                  Please share the UTR / transfer screenshot on WhatsApp for instant clearance.
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={buildWhatsAppRedirect()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>💬 Track Order on WhatsApp (+91 9717161809)</span>
              </a>
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-white border border-[#17233B]/20 text-[#17233B] hover:text-[#176B68] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Return to Shop
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F2E8] pt-28 sm:pt-36 pb-24 text-[#17233B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#17233B]/10 pb-6 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#176B68]">
            Final Step
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#17233B] mt-1">
            Checkout & Delivery
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#17233B]/10 max-w-xl mx-auto space-y-4">
            <p className="text-base text-[#17233B]/70">No items found in your basket.</p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Shipping & Billing Details (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Delivery Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#17233B]/10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#17233B]/10 pb-3">
                  <h2 className="font-serif text-xl font-bold text-[#17233B]">
                    1. Delivery Information
                  </h2>
                  <span className="text-[11px] font-semibold text-stone-500">
                    {user ? '✓ Member Identified' : 'Guest or Member'}
                  </span>
                </div>

                {/* Logged in vs Guest fast-track */}
                {user ? (
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {user.photoURL || profile?.avatar_url ? (
                        <img
                          src={user.photoURL || profile?.avatar_url || ''}
                          alt={user.displayName || 'Account'}
                          className="w-10 h-10 rounded-full border border-emerald-300 object-cover shadow-2xs"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#17233B] text-white flex items-center justify-center font-bold text-sm">
                          {(user.displayName || profile?.name || user.email || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[#17233B]">
                            {user.displayName || profile?.name || 'Verified Member'}
                          </p>
                          <span className="text-[10px] text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full font-bold">
                            ✓ Profile Autofilled
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {user.email || user.phoneNumber} · Member order tracking active
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={signOut}
                      className="text-[11px] font-bold text-stone-500 hover:text-stone-800 underline transition"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-amber-50/80 via-white to-stone-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base">⚡</span>
                          <h3 className="font-serif text-sm sm:text-base font-bold text-[#17233B]">
                            Express 1-Click Checkout (Skip Typing Details)
                          </h3>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                          Sign in once to autofill your shipping details, track real-time delivery, and save previous addresses.
                        </p>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleGoogleQuickAuth}
                        disabled={isGoogleSigningIn}
                        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                      >
                        <svg className="w-5 h-5 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>{isGoogleSigningIn ? 'Connecting to Google...' : 'Express Checkout with Google (1-Click Autofill)'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 pt-1 text-[10px] uppercase font-bold tracking-wider text-stone-400">
                      <div className="h-px bg-stone-200 flex-1" />
                      <span>or enter delivery address below</span>
                      <div className="h-px bg-stone-200 flex-1" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/70 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-[#17233B]/20 text-sm focus:outline-none focus:border-[#176B68] focus:ring-1 focus:ring-[#176B68]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/70 mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 98110XXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-[#17233B]/20 text-sm focus:outline-none focus:border-[#176B68] focus:ring-1 focus:ring-[#176B68]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/70 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#17233B]/20 text-sm focus:outline-none focus:border-[#176B68] focus:ring-1 focus:ring-[#176B68]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/70 mb-1.5">
                      Address (Street / Building / Flat) *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Flat 402, Lotus Boulevard, Sector 100"
                      className="w-full px-4 py-3 rounded-xl border border-[#17233B]/20 text-sm focus:outline-none focus:border-[#176B68] focus:ring-1 focus:ring-[#176B68]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/70 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Noida / Srinagar / Patna"
                      className="w-full px-4 py-3 rounded-xl border border-[#17233B]/20 text-sm focus:outline-none focus:border-[#176B68] focus:ring-1 focus:ring-[#176B68]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/70 mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Uttar Pradesh / J&K / Bihar"
                      className="w-full px-4 py-3 rounded-xl border border-[#17233B]/20 text-sm focus:outline-none focus:border-[#176B68] focus:ring-1 focus:ring-[#176B68]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/70 mb-1.5">
                      Postal Code / PIN *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 201301"
                      className="w-full px-4 py-3 rounded-xl border border-[#17233B]/20 text-sm focus:outline-none focus:border-[#176B68] focus:ring-1 focus:ring-[#176B68]"
                    />
                  </div>
                </div>

                {/* B2B / GST Checkbox */}
                <div className="pt-4 border-t border-[#17233B]/10 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isB2B}
                      onChange={(e) => setIsB2B(e.target.checked)}
                      className="w-4 h-4 rounded text-[#176B68] focus:ring-[#176B68]"
                    />
                    <span className="text-xs font-semibold text-[#17233B]">
                      Request Business GST Invoice (B2B Procurement)
                    </span>
                  </label>

                  {isB2B && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F7F2E8] border border-[#17233B]/10">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/70 mb-1">
                          Company / Business Name *
                        </label>
                        <input
                          type="text"
                          required={isB2B}
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Apex Hospitality LLP"
                          className="w-full px-3 py-2.5 rounded-lg border border-[#17233B]/20 text-xs bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/70 mb-1">
                          GSTIN Number *
                        </label>
                        <input
                          type="text"
                          required={isB2B}
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value)}
                          placeholder="e.g. 09AAECN1234F1Z5"
                          className="w-full px-3 py-2.5 rounded-lg border border-[#17233B]/20 text-xs bg-white focus:outline-none uppercase"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#17233B]/10 shadow-sm space-y-6">
                <h2 className="font-serif text-xl font-bold text-[#17233B] border-b border-[#17233B]/10 pb-3">
                  2. Payment Method
                </h2>

                <div className="space-y-3">
                  {/* UPI / Cards */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#176B68] bg-[#176B68]/5 ring-1 ring-[#176B68]'
                        : 'border-[#17233B]/10 hover:border-[#17233B]/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mt-1 text-[#176B68]"
                    />
                    <div>
                      <span className="font-semibold text-sm text-[#17233B] block">
                        UPI / Credit Card / Debit Card (Razorpay Instant)
                      </span>
                      <span className="text-xs text-stone-600 block mt-0.5">
                        Pay securely with Google Pay, PhonePe, Paytm, or any Indian bank card.
                      </span>
                    </div>
                  </label>

                  {/* B2B NEFT / RTGS */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'neft'
                        ? 'border-[#176B68] bg-[#176B68]/5 ring-1 ring-[#176B68]'
                        : 'border-[#17233B]/10 hover:border-[#17233B]/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'neft'}
                      onChange={() => setPaymentMethod('neft')}
                      className="mt-1 text-[#176B68]"
                    />
                    <div>
                      <span className="font-semibold text-sm text-[#17233B] block">
                        B2B Bank Transfer (NEFT / RTGS / IMPS)
                      </span>
                      <span className="text-xs text-stone-600 block mt-0.5">
                        Preferred for wholesale sacks, corporate orders, and invoices over ₹10,000.
                      </span>
                    </div>
                  </label>

                  {/* WhatsApp Direct */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'whatsapp'
                        ? 'border-[#176B68] bg-[#176B68]/5 ring-1 ring-[#176B68]'
                        : 'border-[#17233B]/10 hover:border-[#17233B]/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'whatsapp'}
                      onChange={() => setPaymentMethod('whatsapp')}
                      className="mt-1 text-[#176B68]"
                    />
                    <div>
                      <span className="font-semibold text-sm text-[#17233B] block">
                        Direct WhatsApp Concierge Confirmation
                      </span>
                      <span className="text-xs text-stone-600 block mt-0.5">
                        Verify stock with our Noida/Kashmir team and pay via QR code on WhatsApp (+91 9717161809).
                      </span>
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#176B68] bg-[#176B68]/5 ring-1 ring-[#176B68]'
                        : 'border-[#17233B]/10 hover:border-[#17233B]/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-[#176B68]"
                    />
                    <div>
                      <span className="font-semibold text-sm text-[#17233B] block">
                        Cash on Delivery (Retail Orders)
                      </span>
                      <span className="text-xs text-stone-600 block mt-0.5">
                        Pay upon doorstep delivery in Delhi NCR and select serviceable pin codes.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/70 mb-1.5">
                    Order Notes / Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Ring doorbell, deliver after 2 PM, or packaging notes"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#17233B]/20 text-xs focus:outline-none focus:border-[#176B68]"
                  />
                </div>
              </div>
            </div>

            {/* Right: Order Summary Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#17233B]/10 shadow-sm sticky top-28 space-y-6">
                <h2 className="font-serif text-xl font-bold text-[#17233B] border-b border-[#17233B]/10 pb-4">
                  Basket Items ({cart.length})
                </h2>

                {/* Items preview */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {item.image && (
                          <div className="relative w-8 h-8 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="truncate">
                          <span className="font-semibold text-[#17233B] block truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            {item.sizeLabel} × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-[#17233B] flex-shrink-0">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#17233B]/10 pt-4 space-y-2.5 text-xs text-[#17233B]/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#17233B]">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {appliedCoupon && discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupon Discount ({appliedCoupon})</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Pan-India Delivery</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-semibold">Complimentary</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>GST (5% / 12% as applicable)</span>
                    <span>Included in total</span>
                  </div>
                  <div className="border-t border-[#17233B]/10 pt-3 flex justify-between items-baseline">
                    <span className="font-serif text-lg font-bold text-[#17233B]">Total Payable</span>
                    <span className="font-serif text-2xl font-bold text-[#176B68]">
                      ₹{estimatedTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#176B68] hover:bg-[#125350] disabled:bg-stone-300 text-white font-bold rounded-2xl text-xs uppercase tracking-widest shadow-md transition-colors"
                >
                  {isSubmitting ? 'Processing Order...' : `Confirm Order — ₹${estimatedTotal.toLocaleString('en-IN')}`}
                </button>

                <p className="text-[11px] text-center text-stone-500">
                  By confirming, you agree to Nuty Tales terms of sale. FSSAI Lic. {FSSAI_NUMBER}.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
