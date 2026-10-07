'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ConfirmationResult } from 'firebase/auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('callbackUrl') || searchParams.get('redirect') || '/'

  const { user, loading, loginWithGoogle, requestPhoneOtp, confirmPhoneOtp } = useAuth()

  const [activeTab, setActiveTab] = useState<'phone' | 'google'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectPath)
    }
  }, [user, loading, router, redirectPath])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // Handle Phone OTP Request
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    let cleanNumber = phoneNumber.replace(/\s+/g, '').replace(/-/g, '')
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = `+91${cleanNumber.replace(/^0+/, '')}`
    }

    if (cleanNumber.length < 12) {
      setErrorMessage('Please enter a valid 10-digit mobile number.')
      return
    }

    setIsSendingOtp(true)
    try {
      const result = await requestPhoneOtp(cleanNumber, 'login-page-recaptcha-container')
      setConfirmationResult(result)
      setResendTimer(60)
    } catch (err: any) {
      console.error('Phone OTP error:', err)
      setErrorMessage(
        err?.message || 'Failed to send SMS code. Please verify your mobile number.'
      )
    } finally {
      setIsSendingOtp(false)
    }
  }

  // Handle OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmationResult) return

    if (otpCode.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit code received on your phone.')
      return
    }

    setIsVerifyingOtp(true)
    setErrorMessage(null)
    try {
      await confirmPhoneOtp(confirmationResult, otpCode.trim())
      router.push(redirectPath)
    } catch (err: any) {
      console.error('Verify OTP error:', err)
      setErrorMessage('Invalid verification code. Please check and try again.')
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setErrorMessage(null)
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle()
      router.push(redirectPath)
    } catch (err: any) {
      console.error('Google Sign In error:', err)
      setErrorMessage(err?.message || 'Google sign in could not be completed.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        {/* Left Column: Visual & Perks */}
        <div className="lg:col-span-5 bg-[#17233B] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A45C] block">
                Taste · Stay · Explore
              </span>
              <h1 className="font-serif text-3xl font-bold mt-2">Nuty Tales Portal</h1>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Your gateway to direct orchard procurement, authenticated Kashmiri saffron, wholesale contract pricing, and private estate stays.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-start gap-3">
                <span className="text-[#C9A45C] text-sm">✦</span>
                <div>
                  <span className="font-bold block">Wholesale &amp; Retail Pricing</span>
                  <span className="text-stone-400 text-[11px]">Dynamic tiered rates for high-volume procurement.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#C9A45C] text-sm">✦</span>
                <div>
                  <span className="font-bold block">FSSAI Certified Testing</span>
                  <span className="text-stone-400 text-[11px]">Batch-specific laboratory certificates of analysis.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#C9A45C] text-sm">✦</span>
                <div>
                  <span className="font-bold block">Live Order &amp; RFQ Tracking</span>
                  <span className="text-stone-400 text-[11px]">Instant updates across Noida, Srinagar &amp; Patna hubs.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-[11px] text-stone-400 relative z-10">
            Official Support: +91 9717161809 · support@nutytales.com
          </div>
        </div>

        {/* Right Column: Auth Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#17233B]">Welcome to Nuty Tales</h2>
            <p className="text-xs text-stone-500 mt-1">
              Select your preferred login method to continue.
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl my-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('phone')
                setErrorMessage(null)
              }}
              className={`py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'phone'
                  ? 'bg-white text-[#17233B] shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>📱</span> Mobile Number OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('google')
                setErrorMessage(null)
              }}
              className={`py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'google'
                  ? 'bg-white text-[#17233B] shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🌐</span> Google Sign-In
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-2 mb-4">
              <span className="text-sm">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Phone tab */}
          {activeTab === 'phone' && (
            <div>
              {!confirmationResult ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Phone Number (India &amp; Global)
                    </label>
                    <div className="relative flex rounded-xl border border-stone-300 focus-within:ring-2 focus-within:ring-[#17233B] overflow-hidden">
                      <span className="bg-stone-100 text-stone-600 px-3 py-2.5 text-sm font-semibold border-r border-stone-300 flex items-center">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full px-3.5 py-2.5 text-sm font-medium focus:outline-none"
                      />
                    </div>
                    <span className="text-[11px] text-stone-500 block mt-1">
                      A real 6-digit OTP will be dispatched via SMS to verify your mobile identity.
                    </span>
                  </div>

                  <div id="login-page-recaptcha-container"></div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
                  >
                    {isSendingOtp ? 'Sending SMS Code...' : 'Send SMS Verification Code →'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-stone-700">
                        Enter 6-Digit SMS Code
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmationResult(null)
                          setOtpCode('')
                        }}
                        className="text-[11px] text-[#176B68] font-bold hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full px-4 py-3.5 text-center text-3xl tracking-[0.4em] font-mono font-bold rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#17233B] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpCode.length < 6}
                    className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
                  >
                    {isVerifyingOtp ? 'Verifying OTP...' : 'Verify & Enter Portal →'}
                  </button>

                  <div className="text-center pt-2">
                    {resendTimer > 0 ? (
                      <span className="text-xs text-stone-400">
                        Resend SMS code in {resendTimer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-xs font-bold text-[#704B32] hover:underline"
                      >
                        Resend SMS OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Google tab */}
          {activeTab === 'google' && (
            <div className="py-6 space-y-4 text-center">
              <p className="text-xs text-stone-600">
                Continue seamlessly with your Google workspace or personal account.
              </p>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm transition-all shadow-sm hover:shadow disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>
            </div>
          )}

          <div className="pt-6 border-t border-stone-200 text-center text-[11px] text-stone-400">
            🔒 Secure authentication powered by Firebase Auth &amp; Supabase Database.
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#17233B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
