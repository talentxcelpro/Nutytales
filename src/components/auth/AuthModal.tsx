'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ConfirmationResult } from 'firebase/auth'
import { getFirebaseErrorMessage } from '@/lib/firebase/client'

export default function AuthModal() {
  const { isModalOpen, closeAuthModal, signInWithGoogle, sendPhoneOtp, confirmOtp } = useAuth()

  const [activeTab, setActiveTab] = useState<'phone' | 'google'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  if (!isModalOpen) return null

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
      const result = await sendPhoneOtp(cleanNumber, 'modal-recaptcha-container')
      setConfirmationResult(result)
      setResendTimer(60)
    } catch (err: any) {
      console.error('Phone OTP error:', err)
      setErrorMessage(getFirebaseErrorMessage(err))
    } finally {
      setIsSendingOtp(false)
    }
  }

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
      await confirmOtp(confirmationResult, otpCode.trim())
      closeAuthModal()
    } catch (err: any) {
      console.error('Verify OTP error:', err)
      setErrorMessage(getFirebaseErrorMessage(err))
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setErrorMessage(null)
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle()
      closeAuthModal()
    } catch (err: any) {
      console.error('Google Sign In error:', err)
      setErrorMessage(getFirebaseErrorMessage(err))
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" aria-modal="true" role="dialog" aria-labelledby="auth-modal-title">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#17233B] text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-stone-400 hover:text-white text-xl leading-none"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A45C]">
              Nuty Tales Membership
            </span>
          </div>
          <h2 id="auth-modal-title" className="font-serif text-2xl font-bold">Sign In or Register</h2>
          <p className="text-xs text-stone-300 mt-1">
            Access member-only wholesale pricing, order tracking, and bespoke quotes.
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="grid grid-cols-2 border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => {
              setActiveTab('phone')
              setErrorMessage(null)
            }}
            className={`py-3.5 text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'phone'
                ? 'bg-white text-[#17233B] border-b-2 border-[#17233B]'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <span>📱</span> Phone OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('google')
              setErrorMessage(null)
            }}
            className={`py-3.5 text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'google'
                ? 'bg-white text-[#17233B] border-b-2 border-[#17233B]'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <span>🌐</span> Google
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-2" role="alert">
              <span className="text-sm">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: PHONE OTP */}
          {activeTab === 'phone' && (
            <div>
              {!confirmationResult ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label htmlFor="phone-input" className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Mobile Number (India &amp; Global)
                    </label>
                    <div className="relative flex rounded-xl border border-stone-300 focus-within:ring-2 focus-within:ring-[#17233B] overflow-hidden">
                      <span className="bg-stone-100 text-stone-600 px-3 py-2.5 text-sm font-semibold border-r border-stone-300 flex items-center">
                        🇮🇳 +91
                      </span>
                      <input
                        id="phone-input"
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full px-3 py-2.5 text-sm font-medium focus:outline-none"
                      />
                    </div>
                  </div>

                  <div id="modal-recaptcha-container"></div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
                  >
                    {isSendingOtp ? 'Sending SMS Code...' : 'Get OTP Code →'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="otp-input" className="block text-xs font-semibold text-stone-700">
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
                      id="otp-input"
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full px-4 py-3 text-center text-2xl tracking-[0.4em] font-mono font-bold rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#17233B] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpCode.length < 6}
                    className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Verify & Continue →'}
                  </button>

                  <div className="text-center pt-2">
                    {resendTimer > 0 ? (
                      <span className="text-xs text-stone-400">
                        Resend code in {resendTimer}s
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

          {/* TAB 2: GOOGLE AUTH */}
          {activeTab === 'google' && (
            <div className="py-4 space-y-4 text-center">
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
        </div>
      </div>
    </div>
  )
}
