'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getFirebaseErrorMessage } from '@/lib/firebase/client'
import Link from 'next/link'

function sanitizeCallbackUrl(url: string | null | undefined): string {
  if (!url) return '/'
  if (url.startsWith('//')) return '/'
  if (url.startsWith('/')) return url
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()
    const allowed = [
      'nutytales.com',
      'business.nutytales.com',
      'gifting.nutytales.com',
      'weddings.nutytales.com',
      'crafts.nutytales.com',
      'stays.nutytales.com',
      'travel.nutytales.com',
      'localhost',
    ]
    if (allowed.includes(hostname) || hostname.endsWith('.nutytales.com') || hostname.endsWith('.localhost')) {
      return parsed.pathname + parsed.search + parsed.hash
    }
  } catch {
    // Invalid URL fallback
  }
  return '/'
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get('callbackUrl') || searchParams.get('redirect')
  const redirectPath = sanitizeCallbackUrl(rawRedirect)

  const { user, loading, signInWithGoogle } = useAuth()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectPath)
    }
  }, [user, loading, router, redirectPath])

  const handleGoogleSignIn = async () => {
    setErrorMessage(null)
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle()
      router.push(redirectPath)
    } catch (err: any) {
      console.error('Google Sign In error:', err)
      setErrorMessage(getFirebaseErrorMessage(err))
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF6EE] pt-28 sm:pt-36 pb-20 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Brand & Security Overview */}
        <div className="lg:col-span-5 bg-[#17233B] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A45C]">
                Official Portal
              </span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-white">
                Nuty Tales
              </h1>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Single sign-on access across all 6 business verticals: Retail, Wholesale B2B, Corporate Gifting, Destination Weddings, Artisan Crafts &amp; Curated Stays.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-start gap-3">
                <span className="text-[#C9A45C] text-sm">✦</span>
                <div>
                  <span className="font-bold block">1-Click Express Access</span>
                  <span className="text-stone-400 text-[11px]">Instant Google authentication without passwords.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#C9A45C] text-sm">✦</span>
                <div>
                  <span className="font-bold block">Wholesale &amp; Member Pricing</span>
                  <span className="text-stone-400 text-[11px]">Dynamic tiered rates for high-volume procurement.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#C9A45C] text-sm">✦</span>
                <div>
                  <span className="font-bold block">Live Order &amp; RFQ Tracking</span>
                  <span className="text-stone-400 text-[11px]">Real-time dispatch updates from Kashmir, Noida &amp; Patna.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-[11px] text-stone-400 relative z-10">
            Official Concierge: +91 9717161809 · support@nutytales.com
          </div>
        </div>

        {/* Right Column: Google Auth */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#176B68]">
              Welcome Back
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] mt-1">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Continue seamlessly with your Google workspace or personal account.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-2.5" role="alert">
              <span className="text-sm">⚠️</span>
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3.5 px-6 py-4 rounded-2xl border-2 border-[#17233B]/15 bg-white hover:bg-stone-50 text-[#17233B] font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg hover:border-[#17233B]/40 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
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
            <p className="text-[11px] text-center text-stone-400">
              ⚡ Lightning fast sign-in · Automatic profile sync · 0 SMS codes required
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>Instant checkout with 1-click address autofill</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>Encrypted authentication backed by Google Identity</span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 text-center text-[11px] text-stone-400">
            By continuing, you accept our{' '}
            <Link href="/terms" className="text-[#17233B] underline font-medium">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#17233B] underline font-medium">Privacy Policy</Link>.
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
