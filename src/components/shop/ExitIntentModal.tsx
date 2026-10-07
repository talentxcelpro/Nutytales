'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface ExitIntentModalProps {
  onApplyVoucher?: (code: string) => void
}

export default function ExitIntentModal({ onApplyVoucher }: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Check if dismissed before in session
    if (sessionStorage.getItem('nt_exit_modal_dismissed')) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !hasTriggered) {
        setHasTriggered(true)
        setIsOpen(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    // Mobile fallback: trigger after 40 seconds of browsing
    const timer = setTimeout(() => {
      if (!hasTriggered && !sessionStorage.getItem('nt_exit_modal_dismissed')) {
        setHasTriggered(true)
        setIsOpen(true)
      }
    }, 45000)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timer)
    }
  }, [hasTriggered])

  const handleDismiss = () => {
    setIsOpen(false)
    sessionStorage.setItem('nt_exit_modal_dismissed', 'true')
  }

  const handleClaim = () => {
    navigator.clipboard?.writeText('HARVEST200')
    setCopied(true)
    if (onApplyVoucher) {
      onApplyVoucher('HARVEST200')
    }
    setTimeout(() => {
      handleDismiss()
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleDismiss}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 text-center p-8 space-y-5 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-sm transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>

        {/* Gift Icon / Image */}
        <div className="relative w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-4xl shadow-inner border border-amber-200">
          🎁
        </div>

        {/* Heading */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#704B32]">
            Wait! Don&apos;t Leave Empty Handed
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] leading-tight">
            Take ₹200 OFF Your First Harvest Box
          </h3>
          <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
            Experience unadulterated high-altitude dry fruits. Plus get a complimentary 100g Kashmiri Walnut sample on your order.
          </p>
        </div>

        {/* Voucher Code Box */}
        <div className="bg-white rounded-2xl p-4 border border-dashed border-[#176B68] flex items-center justify-between gap-3 shadow-xs">
          <div className="text-left">
            <span className="text-[10px] text-stone-400 uppercase font-bold block">
              Exclusive Welcome Voucher:
            </span>
            <span className="font-mono text-xl font-extrabold text-[#176B68] tracking-wider">
              HARVEST200
            </span>
          </div>
          <button
            type="button"
            onClick={handleClaim}
            className="px-4 py-2 rounded-xl bg-[#17233B] hover:bg-[#176B68] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            {copied ? '✓ Applied!' : 'Copy & Claim'}
          </button>
        </div>

        {/* Trust Points */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
          <span>✓ Free Express Shipping</span>
          <span>•</span>
          <span>✓ 100% Purity Guarantee</span>
        </div>

        {/* Dismiss subtle link */}
        <button
          type="button"
          onClick={handleDismiss}
          className="text-[11px] text-stone-400 hover:text-stone-600 underline block mx-auto"
        >
          No thanks, I will pay full price
        </button>
      </div>
    </div>
  )
}
