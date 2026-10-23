'use client'

import React, { useState } from 'react'
import { useGiftingStore, PIN_LOCATION_DATABASE } from '@/hooks/useGiftingStore'

interface PincodeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PincodeModal({ isOpen, onClose }: PincodeModalProps) {
  const { deliveryPincode, setPincode, deliveryLocation } = useGiftingStore()
  const [inputPin, setInputPin] = useState(deliveryPincode)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'info'; text: string } | null>(null)

  if (!isOpen) return null

  const handleApply = (pin: string) => {
    const clean = pin.trim().replace(/\D/g, '').slice(0, 6)
    if (clean.length < 6) {
      setStatusMsg({ type: 'info', text: 'Please enter a valid 6-digit Indian PIN code.' })
      return
    }

    setPincode(clean)
    const matched = PIN_LOCATION_DATABASE[clean]
    if (matched) {
      setStatusMsg({
        type: 'success',
        text: `✓ Deliverable to ${matched.city}, ${matched.state}! Estimated transit: ${matched.days} days via Express Air.`,
      })
    } else {
      setStatusMsg({
        type: 'success',
        text: `✓ Pan-India Serviceable: Delivery to PIN ${clean} in 2-4 business days via Bluedart / Delhivery Express.`,
      })
    }

    setTimeout(() => {
      onClose()
      setStatusMsg(null)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#10192A]/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#17233B]">Choose Delivery Location</h3>
              <p className="text-[11px] text-stone-500">Check delivery availability &amp; express air timeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-[#17233B] block">
            Enter 6-digit Postal PIN Code:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 110001"
              className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-sm tracking-wider focus:outline-hidden focus:border-[#0B2521]"
            />
            <button
              type="button"
              onClick={() => handleApply(inputPin)}
              className="px-5 py-2.5 bg-[#0B2521] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Check
            </button>
          </div>

          {statusMsg && (
            <p
              className={`text-xs p-3 rounded-xl ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {statusMsg.text}
            </p>
          )}

          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Popular Gifting Hubs:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Delhi NCR (110001)', pin: '110001' },
                { label: 'Mumbai (400001)', pin: '400001' },
                { label: 'Bengaluru (560001)', pin: '560001' },
                { label: 'Srinagar (190001)', pin: '190001' },
                { label: 'Hyderabad (500081)', pin: '500081' },
                { label: 'Patna (800001)', pin: '800001' },
              ].map((item) => (
                <button
                  key={item.pin}
                  type="button"
                  onClick={() => {
                    setInputPin(item.pin)
                    handleApply(item.pin)
                  }}
                  className="px-3 py-2 text-left bg-stone-50 hover:bg-[#FAF7F2] border border-stone-200 rounded-xl text-[11px] font-medium text-stone-700 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200 text-[11px] text-stone-600 flex items-center gap-2">
            <span>✈️</span>
            <span>
              <strong>International Delivery:</strong> Supported to UAE, UK, and USA via express air cargo.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
