'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)

  // Suppress completely on seller portal
  const isSellerPortal =
    pathname === '/seller' ||
    pathname?.startsWith('/seller/') ||
    (typeof window !== 'undefined' && /^seller\./i.test(window.location.hostname))

  // Sync cart count with localStorage
  useEffect(() => {
    const updateCart = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('nt_cart') || '[]')
        const total = stored.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0)
        setCartCount(total)
      } catch {
        setCartCount(0)
      }
    }

    updateCart()
    window.addEventListener('nt_cart_updated', updateCart)
    window.addEventListener('storage', updateCart)
    return () => {
      window.removeEventListener('nt_cart_updated', updateCart)
      window.removeEventListener('storage', updateCart)
    }
  }, [])

  if (isSellerPortal) {
    return null
  }

  const handleOpenCart = () => {
    window.dispatchEvent(new Event('nt_open_cart'))
  }

  const isHome = pathname === '/'
  const isShop = pathname === '/shop' || pathname.startsWith('/shop/')
  const isSearch = pathname === '/search'
  const isGifting = pathname.startsWith('/gifting') || pathname.startsWith('/corporate-gifts') || pathname.startsWith('/weddings')

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FDFBF7]/96 backdrop-blur-xl border-t border-[#EAE3D5] shadow-[0_-6px_25px_rgba(23,35,59,0.08)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 transition-transform duration-300 select-none"
    >
      <div className="grid grid-cols-5 items-center px-1">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition-all active:scale-90 ${
            isHome ? 'text-[#17233B]' : 'text-[#8C7E70] hover:text-[#17233B]'
          }`}
        >
          <div className="relative">
            <svg
              className="w-5 h-5 transition-transform"
              viewBox="0 0 24 24"
              fill={isHome ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isHome ? '2.2' : '1.8'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z" />
            </svg>
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A45C]" />
            )}
          </div>
          <span className={`text-[10px] mt-1 font-semibold tracking-tight ${isHome ? 'text-[#17233B] font-bold' : ''}`}>
            Home
          </span>
        </Link>

        {/* 2. Shop Catalog */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center py-1 transition-all active:scale-90 ${
            isShop ? 'text-[#17233B]' : 'text-[#8C7E70] hover:text-[#17233B]'
          }`}
        >
          <div className="relative">
            <svg
              className="w-5 h-5 transition-transform"
              viewBox="0 0 24 24"
              fill={isShop ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isShop ? '2.2' : '1.8'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            {isShop && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A45C]" />
            )}
          </div>
          <span className={`text-[10px] mt-1 font-semibold tracking-tight ${isShop ? 'text-[#17233B] font-bold' : ''}`}>
            Harvests
          </span>
        </Link>

        {/* 3. Search */}
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center py-1 transition-all active:scale-90 ${
            isSearch ? 'text-[#17233B]' : 'text-[#8C7E70] hover:text-[#17233B]'
          }`}
        >
          <div className="relative">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={isSearch ? '2.4' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {isSearch && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A45C]" />
            )}
          </div>
          <span className={`text-[10px] mt-1 font-semibold tracking-tight ${isSearch ? 'text-[#17233B] font-bold' : ''}`}>
            Search
          </span>
        </Link>

        {/* 4. Gifting & Hampers */}
        <Link
          href="/gifting"
          className={`flex flex-col items-center justify-center py-1 transition-all active:scale-90 ${
            isGifting ? 'text-[#17233B]' : 'text-[#8C7E70] hover:text-[#17233B]'
          }`}
        >
          <div className="relative">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill={isGifting ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isGifting ? '2.2' : '1.8'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
            {isGifting && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A45C]" />
            )}
          </div>
          <span className={`text-[10px] mt-1 font-semibold tracking-tight ${isGifting ? 'text-[#17233B] font-bold' : ''}`}>
            Gifting
          </span>
        </Link>

        {/* 5. Cart / Bag with Live Count Badge */}
        <button
          type="button"
          onClick={handleOpenCart}
          className="flex flex-col items-center justify-center py-1 text-[#8C7E70] hover:text-[#17233B] transition-all active:scale-90 cursor-pointer"
          aria-label={`View shopping cart with ${cartCount} items`}
        >
          <div className="relative">
            <svg
              className="w-5 h-5 text-[#17233B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#17233B] text-[#F3E5C8] border-2 border-[#FDFBF7] text-[9.5px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-semibold tracking-tight text-[#17233B]">
            Bag
          </span>
        </button>
      </div>
    </nav>
  )
}
