'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface RecentOrder {
  name: string
  city: string
  product: string
  weight: string
  image: string
  timeAgo: string
}

const RECENT_ORDERS: RecentOrder[] = [
  {
    name: 'Aarav S.',
    city: 'Bengaluru',
    product: 'Kashmiri Mamra Almonds',
    weight: '500g',
    image: '/images/mamra-almonds-pouch-250g.jpg',
    timeAgo: '3 minutes ago',
  },
  {
    name: 'Pooja M.',
    city: 'Mumbai',
    product: 'Pure Kashmiri Mongra Saffron',
    weight: '5g Jar',
    image: '/images/saffron-jar-5g.jpg',
    timeAgo: '7 minutes ago',
  },
  {
    name: 'Vikram R.',
    city: 'New Delhi',
    product: 'W240 Jumbo Cashews',
    weight: '1 kg',
    image: '/images/cashews-pouch-250g.jpg',
    timeAgo: '12 minutes ago',
  },
  {
    name: 'Sunita D.',
    city: 'Pune',
    product: 'Dried Anjeer (Turkish Figs)',
    weight: '500g',
    image: '/images/anjeer-pouch-250g.jpg',
    timeAgo: '18 minutes ago',
  },
  {
    name: 'Dr. Rajesh K.',
    city: 'Hyderabad',
    product: 'Kashmiri Kagzi Akhrot',
    weight: '1 kg',
    image: '/images/kashmir-kagzi-akhrot-250g.jpg',
    timeAgo: '24 minutes ago',
  },
]

export default function SocialProofToast() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (isDismissed) return

    // Show first toast after 4 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true)
    }, 4000)

    // Cycle every 14 seconds
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % RECENT_ORDERS.length)
        setIsVisible(true)
      }, 1000)
    }, 14000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [isDismissed])

  if (isDismissed || !isVisible) return null

  const order = RECENT_ORDERS[currentIdx]

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-6 z-[90] max-w-sm bg-white rounded-2xl p-3.5 shadow-2xl border border-stone-200/90 flex items-center gap-3.5 animate-slideUp backdrop-blur-xs transition-all duration-300"
    >
      {/* Product thumbnail */}
      <div className="relative w-12 h-12 rounded-xl bg-[#FAF6EE] overflow-hidden flex-shrink-0 border border-stone-200">
        <Image
          src={order.image}
          alt={order.product}
          fill
          className="object-contain p-1"
          sizes="48px"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[#17233B]">
            {order.name} ({order.city})
          </span>
          <span>•</span>
          <span>{order.timeAgo}</span>
        </div>
        <p className="text-xs font-serif font-bold text-[#17233B] truncate leading-tight mt-0.5">
          Ordered {order.product}
        </p>
        <span className="text-[10px] text-stone-500 font-medium">
          Pack size: {order.weight} · Verified Buyer ✓
        </span>
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="text-stone-400 hover:text-stone-700 text-xs font-bold p-1"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  )
}
