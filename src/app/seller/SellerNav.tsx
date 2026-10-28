'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSeller } from './SellerContext'

const NAV_SECTIONS = [
  {
    title: 'Core Operations',
    items: [
      { label: 'Overview', href: '/seller', icon: '🌐' },
      { label: 'Products', href: '/seller/products', icon: '📦' },
      { label: 'Add Product', href: '/seller/products/new', icon: '➕' },
      { label: 'Inventory', href: '/seller/inventory', icon: '📋' },
      { label: 'Orders', href: '/seller/orders', icon: '🛒' },
      { label: 'Shipping & Fulfilment', href: '/seller/shipping', icon: '✈️' },
      { label: 'Returns & Refunds', href: '/seller/returns', icon: '🔄' },
    ],
  },
  {
    title: 'Growth & Relationships',
    items: [
      { label: 'Promotions', href: '/seller/promotions', icon: '🏷️' },
      { label: 'Customers', href: '/seller/customers', icon: '👥' },
      { label: 'Reviews & Ratings', href: '/seller/reviews', icon: '⭐' },
      { label: 'Finance & Payouts', href: '/seller/finance', icon: '💳' },
      { label: 'Analytics', href: '/seller/analytics', icon: '📈' },
    ],
  },
  {
    title: 'Storefront & Presence',
    items: [
      { label: 'Storefront Profile', href: '/seller/storefront', icon: '🏬' },
      { label: 'Marketplace Reach', href: '/seller/marketplace-reach', icon: '🌍' },
      { label: 'Team & Permissions', href: '/seller/team', icon: '🛡️' },
      { label: 'Support & Disputes', href: '/seller/support', icon: '💬' },
      { label: 'Settings', href: '/seller/settings', icon: '⚙️' },
      { label: 'Global Admin Desk', href: '/seller/admin', icon: '🏛️' },
    ],
  },
]

export default function SellerNav() {
  const pathname = usePathname()
  const { seller, availableSellers, switchSeller, loading, reportingCurrency, setReportingCurrency } = useSeller()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false)

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Verified Global Seller
          </span>
        )
      case 'submitted':
      case 'under_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-700/50">
            Verification Pending
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-950/80 text-rose-300 border border-rose-700/50">
            Action Required
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-stone-800 text-stone-300">
            Draft Account
          </span>
        )
    }
  }

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-[#163326] text-white px-3 py-2.5 shadow-md border-b border-[#24523F]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg hover:bg-[#204E3B] text-stone-200 focus:outline-none active:scale-95 transition"
            aria-label="Toggle Navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase tracking-wider text-[#C5A869] font-bold">Nutytales</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                0% Fee
              </span>
            </div>
            <div className="text-xs font-semibold truncate max-w-[150px] sm:max-w-[200px]">
              {seller?.storeName || 'Global Marketplace'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={reportingCurrency}
            onChange={(e) => setReportingCurrency(e.target.value as any)}
            className="text-[11px] bg-[#1F4A38] text-stone-100 rounded px-1.5 py-1 border border-[#2B5D48] font-mono font-bold"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
          <Link
            href="/seller/register"
            className="text-[11px] bg-[#C5A869] text-[#163326] px-2 py-1 rounded font-bold hover:bg-[#D4AF37] transition shrink-0 active:scale-95"
          >
            Onboard
          </Link>
        </div>
      </header>

      {/* Main Global Navigation Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#163326] text-stone-100 flex flex-col border-r border-[#24523F] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Global Brand Header */}
        <div className="p-5 border-b border-[#24523F] bg-[#11291E]">
          <div className="flex items-center justify-between mb-2">
            <Link href="/seller" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#997F29] flex items-center justify-center font-serif font-black text-[#163326] text-lg shadow-md">
                NT
              </div>
              <div>
                <span className="font-serif text-base tracking-tight font-bold text-white block leading-tight">
                  Nutytales
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A869] font-bold block">
                  Seller Central
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 text-stone-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="text-[10px] text-stone-300 font-medium italic mt-1 text-stone-400">
            Sell Anywhere. Grow Everywhere.
          </div>

          {/* Active Merchant Workspace Switcher */}
          <div className="relative mt-3">
            <button
              onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
              className="w-full text-left bg-[#1C4332] hover:bg-[#23533E] border border-[#2B5D48] rounded-xl p-2.5 transition flex items-center justify-between text-xs shadow-xs"
            >
              <div className="truncate mr-2">
                <div className="text-stone-400 text-[9px] uppercase tracking-wider font-semibold">Active Merchant</div>
                <div className="font-semibold text-white truncate text-xs mt-0.5 flex items-center gap-1.5">
                  <span className="truncate">{seller ? seller.storeName : loading ? 'Connecting...' : 'Select Merchant'}</span>
                  {seller?.countryCode && (
                    <span className="text-[10px] px-1 py-0.2 bg-[#2B5D48] rounded text-[#C5A869] shrink-0 font-mono">
                      {seller.countryCode}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-stone-400 text-xs">▾</span>
            </button>

            {storeDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#11291E] border border-[#2B5D48] rounded-xl shadow-2xl p-1 z-50 max-h-60 overflow-y-auto">
                <div className="text-[9px] uppercase tracking-wider text-stone-400 px-2 py-1 font-bold">
                  Select Seller Account
                </div>
                {availableSellers.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      switchSeller(s.id)
                      setStoreDropdownOpen(false)
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition flex flex-col ${
                      seller?.id === s.id
                        ? 'bg-[#23533E] text-white font-medium'
                        : 'text-stone-300 hover:bg-[#1C4332]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate font-semibold">{s.storeName}</span>
                      <span className="text-[10px] text-[#C5A869] font-mono">{s.countryCode}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 capitalize">
                      {s.businessType} · {s.city}, {s.country}
                    </span>
                  </button>
                ))}
                <div className="border-t border-[#24523F] mt-1 pt-1">
                  <Link
                    href="/seller/register"
                    onClick={() => setStoreDropdownOpen(false)}
                    className="block text-center text-xs text-[#C5A869] hover:underline py-1.5 font-semibold"
                  >
                    + Register International Merchant
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Status Bar */}
        <div className="px-5 py-2.5 bg-[#142F23] border-b border-[#24523F] flex items-center justify-between">
          <div className="text-[11px] text-stone-300">Account Status</div>
          {getStatusBadge(seller?.status)}
        </div>

        {/* Universal Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {NAV_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-0.5">
              <div className="text-[9px] uppercase tracking-widest text-[#C5A869] font-bold px-3 py-1">
                {section.title}
              </div>
              {section.items.map((item) => {
                const isActive =
                  item.href === '/seller'
                    ? pathname === '/seller'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-[#C5A869] text-[#163326] font-bold shadow-xs'
                        : 'text-stone-300 hover:bg-[#204E3B] hover:text-white'
                    }`}
                  >
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Global Marketplace Footer */}
        <div className="p-4 border-t border-[#24523F] bg-[#11291E] text-xs text-stone-300 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-400">Reporting Currency:</span>
            <select
              value={reportingCurrency}
              onChange={(e) => setReportingCurrency(e.target.value as any)}
              className="text-xs bg-[#1C4332] text-stone-100 rounded px-2 py-0.5 border border-[#2B5D48] font-mono font-semibold"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>
          <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-[#24523F]/60">
            <span>Market: {seller?.country || 'Global'}</span>
            <span className="text-[#C5A869] font-semibold">Rate: {seller?.defaultCommissionRate ?? 0}% (Free Listing)</span>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Mobile App Bottom Navigation Dock */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] px-2 py-1 flex items-center justify-around safe-bottom">
        <Link
          href="/seller"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            pathname === '/seller' ? 'text-[#163326] font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="text-lg leading-none">📊</span>
          <span className="text-[10px] tracking-tight mt-1">Overview</span>
        </Link>

        <Link
          href="/seller/orders"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition relative ${
            pathname.startsWith('/seller/orders') ? 'text-[#163326] font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="text-lg leading-none">📦</span>
          <span className="text-[10px] tracking-tight mt-1">Orders</span>
        </Link>

        {/* Center Elevated Quick Add Button */}
        <Link
          href="/seller/products/new"
          className="flex flex-col items-center justify-center -mt-5 transition active:scale-90"
          aria-label="Add Product Free"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#163326] to-[#25523F] text-white flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-2xl leading-none font-light">+</span>
          </div>
          <span className="text-[9px] font-bold text-[#163326] mt-0.5">List Free</span>
        </Link>

        <Link
          href="/seller/products"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            pathname === '/seller/products' ? 'text-[#163326] font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="text-lg leading-none">🏷️</span>
          <span className="text-[10px] tracking-tight mt-1">Products</span>
        </Link>

        <Link
          href="/seller/finance"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            pathname.startsWith('/seller/finance') ? 'text-[#163326] font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="text-lg leading-none">💳</span>
          <span className="text-[10px] tracking-tight mt-1">Finance</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-stone-500 hover:text-stone-800 transition active:scale-95"
          aria-label="More Menu"
        >
          <span className="text-lg leading-none">☰</span>
          <span className="text-[10px] tracking-tight mt-1">More</span>
        </button>
      </nav>
    </>
  )
}
