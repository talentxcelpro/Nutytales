'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getFirebaseErrorMessage } from '@/lib/firebase/client'
import { saveStoredBusinessAccount, BusinessAccountRecord } from '@/lib/b2b-procurement-store'

interface B2BAuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'register'
  onSuccess?: () => void
}

export default function B2BAuthModal({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
}: B2BAuthModalProps) {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    idToken,
  } = useAuth()

  const [mode, setMode] = useState<'signin' | 'register'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [businessType, setBusinessType] = useState('Commercial Bakery / Confectionery')
  const [destinationHub, setDestinationHub] = useState('Delhi NCR / Noida Hub')
  const [gstin, setGstin] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)
  const [showForgot, setShowForgot] = useState(false)

  if (!isOpen) return null

  // 1. One-Click Google Authentication
  const handleGoogleAuth = async () => {
    setErrorMessage(null)
    setIsLoading(true)
    try {
      await signInWithGoogle()

      // If user registered with google, initialize their business profile if provided
      if (companyName || contactName || phone) {
        const acc: BusinessAccountRecord = {
          companyName: companyName || 'Commercial Trade Buyer',
          contactPerson: contactName || 'Authorized Sourcing Officer',
          phone: phone || '',
          email,
          gstin: gstin.toUpperCase(),
          businessType,
          city: destinationHub.split('/')[0].trim(),
          state: '',
          isVerified: Boolean(gstin && gstin.length === 15),
          creditStatus: 'Net-30 Eligible upon trade verification',
        }
        saveStoredBusinessAccount(acc)

        // Post to backend
        await fetch('/api/business/account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
          },
          body: JSON.stringify(acc),
        }).catch(() => {})
      }

      onSuccess?.()
      onClose()
    } catch (err: any) {
      setErrorMessage(getFirebaseErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    try {
      await signInWithEmail(email, password)
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setErrorMessage(getFirebaseErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  // 3. Email & Password Registration (Complete Trade Onboarding)
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!companyName.trim()) {
      setErrorMessage('Please enter your business or legal firm name.')
      return
    }
    if (!contactName.trim()) {
      setErrorMessage('Please enter the contact person or procurement lead name.')
      return
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter a 10-digit mobile number for dispatch updates.')
      return
    }

    setIsLoading(true)
    try {
      await signUpWithEmail(email, password, contactName.trim())

      const acc: BusinessAccountRecord = {
        companyName: companyName.trim(),
        contactPerson: contactName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        gstin: gstin.trim().toUpperCase(),
        businessType,
        city: destinationHub.split('/')[0].trim(),
        state: '',
        isVerified: Boolean(gstin && gstin.length === 15),
        creditStatus: 'Net-30 Eligible upon trade verification',
      }
      saveStoredBusinessAccount(acc)

      // Post to backend
      await fetch('/api/business/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acc),
      }).catch(() => {})

      onSuccess?.()
      onClose()
    } catch (err: any) {
      setErrorMessage(getFirebaseErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  // 4. Password Reset
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setErrorMessage('Please enter your email address to receive reset instructions.')
      return
    }
    setIsLoading(true)
    try {
      await sendPasswordReset(email)
      setSuccessNotice('Password reset email sent! Please check your inbox.')
      setShowForgot(false)
    } catch (err: any) {
      setErrorMessage(getFirebaseErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#081830] text-white p-6 sm:p-7 relative border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition leading-none"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A45C]">
              NUTY TALES BUSINESS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
            {mode === 'signin' ? 'Sign In to Trade Desk' : 'Register Corporate Trade Account'}
          </h2>
          <p className="text-xs text-stone-300 mt-1 leading-relaxed max-w-md">
            Direct origin wholesale pricing, GST input tax credits, real-time reefer dispatch, and bespoke spot contracts.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-white/10 p-1 mt-5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                setErrorMessage(null)
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white text-[#081830] shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setErrorMessage(null)
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-[#FF6B00] text-white shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Create Trade Account
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-5 text-xs text-stone-700">
          {errorMessage && (
            <div className="p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-2.5">
              <span className="text-sm">⚠️</span>
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3 text-xs bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-start gap-2.5">
              <span className="text-sm">✓</span>
              <span className="leading-relaxed">{successNotice}</span>
            </div>
          )}

          {/* 1-Click Google Sign In */}
          <div>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-900 font-bold text-xs transition-all shadow-xs hover:border-stone-400 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google (1-Click)'}</span>
            </button>
            <div className="relative my-4 text-center">
              <span className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-stone-200" />
              </span>
              <span className="relative px-3 bg-white text-[11px] text-stone-400 font-medium">
                or use corporate email
              </span>
            </div>
          </div>

          {/* Form */}
          {mode === 'signin' ? (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="procurement@yourcompany.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-800">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(!showForgot)}
                    className="text-[11px] text-[#FF6B00] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                />
              </div>

              {showForgot && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <p className="text-[11px] text-amber-900">
                    Enter your email above and click below to receive a password reset link.
                  </p>
                  <button
                    type="button"
                    onClick={handleForgotSubmit}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-amber-700 text-white font-bold rounded-lg text-[11px]"
                  >
                    Send Reset Link
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#081830] hover:bg-[#12274A] text-white font-bold rounded-xl text-xs transition-colors shadow-xs disabled:opacity-50"
              >
                {isLoading ? 'Verifying Credentials...' : 'Sign In to Trade Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Company / Firm Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Imperial Bakeries Ltd"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Contact Officer Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procurement@company.com"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Create Account Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Industry / Entity Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none bg-white"
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
                  <label className="block font-bold text-stone-800 mb-1">Primary Destination Hub</label>
                  <select
                    value={destinationHub}
                    onChange={(e) => setDestinationHub(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#12274A] outline-none bg-white"
                  >
                    <option value="Delhi NCR / Noida Hub">Delhi NCR / Noida Central Hub</option>
                    <option value="Mumbai / Nhava Sheva (JNPT)">Mumbai / JNPT Port &amp; Cold Hub</option>
                    <option value="Bengaluru / Karnataka Hub">Bengaluru / Karnataka Hub</option>
                    <option value="Srinagar / Kashmir Hub">Srinagar / Kashmir Direct Valley</option>
                    <option value="Patna / Eastern Hub">Patna / Eastern Hub</option>
                    <option value="Dubai / GCC Export Hub">Dubai / GCC Export Hub</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  GSTIN (Optional, for 5% Input Credit Invoices)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="15-digit GSTIN (e.g. 07AAAAA0000A1Z5)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono uppercase focus:ring-2 focus:ring-[#12274A] outline-none"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <div className="font-bold text-stone-800">Trade Privileges Unlocked:</div>
                <div>✓ Tier-1 bulk pricing and volume breaks</div>
                <div>✓ Assigned Key Account Specialist (Tariq Ahmad, +91 9717161809)</div>
                <div>✓ Verified NABL laboratory assay certificate per batch</div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#E65100] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs disabled:opacity-50"
              >
                {isLoading ? 'Creating Account & Sourcing Profile...' : 'Create Trade Account'}
              </button>
            </form>
          )}

          <p className="text-[10px] text-center text-stone-400">
            FSSAI Central Lic. #22724441000048 · All dry fruit spot transactions comply with APEDA &amp; GSTIN norms.
          </p>
        </div>
      </div>
    </div>
  )
}
