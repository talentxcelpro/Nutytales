'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getFirebaseErrorMessage } from '@/lib/firebase/client'
import Link from 'next/link'

export default function AuthModal() {
  const { isModalOpen, closeAuthModal, signInWithGoogle } = useAuth()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isModalOpen) return null

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      aria-modal="true"
      role="dialog"
      aria-labelledby="auth-modal-title"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#17233B] text-white p-7 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 text-stone-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition leading-none"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A45C]">
              Nuty Tales Membership
            </span>
          </div>
          <h2 id="auth-modal-title" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Sign In or Register
          </h2>
          <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
            One-click instant access to member harvest pricing, order tracking, and bespoke quotes.
          </p>
        </div>

        {/* Body */}
        <div className="p-7 space-y-6">
          {errorMessage && (
            <div className="p-3.5 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-2.5" role="alert">
              <span className="text-sm">⚠️</span>
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Primary Action: One-Click Google Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3.5 px-5 py-4 rounded-2xl border-2 border-[#17233B]/15 bg-white hover:bg-stone-50 text-[#17233B] font-bold text-sm transition-all shadow-md hover:shadow-lg hover:border-[#17233B]/40 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google (1-Click)'}</span>
            </button>
            <p className="text-[11px] text-center text-stone-500">
              Lightning fast · Instant autofill of name and email · 0 passwords to memorize
            </p>
          </div>

          {/* Member Benefits */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Membership Perks
            </p>
            <div className="grid grid-cols-1 gap-2 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Fast 1-click checkout with saved delivery addresses</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Real-time harvest dispatch tracking &amp; order history</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Wholesale &amp; corporate tier eligibility</span>
              </div>
            </div>
          </div>

          {/* Legal Trust Footnote */}
          <p className="text-[11px] text-center text-stone-400 leading-relaxed">
            By signing in, you agree to our{' '}
            <Link href="/terms" onClick={closeAuthModal} className="text-[#17233B] underline font-medium hover:text-[#176B68]">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" onClick={closeAuthModal} className="text-[#17233B] underline font-medium hover:text-[#176B68]">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
