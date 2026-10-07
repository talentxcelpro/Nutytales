'use client'

import React, { useState, useEffect } from 'react'
import { DYNAMIC_COUPONS, Coupon } from '@/lib/coupons'

interface DynamicCouponStripProps {
  onCouponApplied?: (code: string) => void
}

export default function DynamicCouponStrip({ onCouponApplied }: DynamicCouponStripProps) {
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nt_applied_coupon')
      if (stored) setActiveCoupon(stored)
    } catch {
      // ignore
    }

    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('nt_applied_coupon')
        setActiveCoupon(stored)
      } catch {
        // ignore
      }
    }

    window.addEventListener('nt_coupon_applied', handleUpdate)
    return () => window.removeEventListener('nt_coupon_applied', handleUpdate)
  }, [])

  const applyCoupon = (coupon: Coupon) => {
    try {
      localStorage.setItem('nt_applied_coupon', coupon.code)
      setActiveCoupon(coupon.code)
      window.dispatchEvent(new Event('nt_coupon_applied'))
      window.dispatchEvent(new Event('nt_cart_updated'))

      if (onCouponApplied) onCouponApplied(coupon.code)

      setToastMessage(`✓ ${coupon.code} applied! ${coupon.title}`)
      setTimeout(() => setToastMessage(null), 3000)
    } catch {
      // fallback
    }
  }

  const removeCoupon = () => {
    try {
      localStorage.removeItem('nt_applied_coupon')
      setActiveCoupon(null)
      window.dispatchEvent(new Event('nt_coupon_applied'))
      window.dispatchEvent(new Event('nt_cart_updated'))

      setToastMessage('Coupon removed')
      setTimeout(() => setToastMessage(null), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <span className="text-[#8C7E70] font-medium flex items-center gap-1.5">
          <span className="text-[#B8934A]">🎟️</span>
          <span>Quick Perks &amp; Dynamic Coupons:</span>
        </span>
        {activeCoupon ? (
          <span className="text-emerald-800 font-semibold flex items-center gap-1 text-[11px]">
            <span>Active: <strong>{activeCoupon}</strong></span>
            <button
              type="button"
              onClick={removeCoupon}
              className="text-stone-400 hover:text-red-600 underline font-normal ml-1"
            >
              (Remove)
            </button>
          </span>
        ) : (
          <span className="text-[11px] text-[#7A6D5E]">Tap to apply at checkout</span>
        )}
      </div>

      {/* Coupons horizontal scroll strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide items-center">
        {DYNAMIC_COUPONS.map((coupon) => {
          const isApplied = activeCoupon === coupon.code
          return (
            <div
              key={coupon.code}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                isApplied
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs ring-1 ring-emerald-300'
                  : 'bg-white border-[#EAE3D5] text-[#5C4F41] hover:border-[#B8934A]'
              }`}
            >
              <span className="font-mono font-bold tracking-wider text-[#17233B]">
                {coupon.code}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-[11px] text-[#7A6D5E] hidden sm:inline truncate max-w-[140px]">
                {coupon.title}
              </span>
              <button
                type="button"
                onClick={() => (isApplied ? removeCoupon() : applyCoupon(coupon))}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  isApplied
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#17233B] hover:bg-[#176B68] text-white'
                }`}
              >
                {isApplied ? '✓ Active' : 'Apply'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[130] bg-[#17233B] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl animate-fadeIn flex items-center gap-2 border border-white/10">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
