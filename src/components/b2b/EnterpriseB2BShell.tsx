'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  getStoredNotifications,
  EnterpriseNotification,
  markNotificationAsRead,
} from '@/lib/b2b-procurement-store'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface EnterpriseB2BShellProps {
  children: React.ReactNode
}

export default function EnterpriseB2BShell({ children }: EnterpriseB2BShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<EnterpriseNotification[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false)
  const [currentOrg, setCurrentOrg] = useState('Royal Confectionery Ltd · Noida Plant')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    setNotifications(getStoredNotifications())
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = (n: EnterpriseNotification) => {
    markNotificationAsRead(n.id)
    setNotifications(getStoredNotifications())
    setNotificationsOpen(false)
    router.push(n.link)
  }

  // Active link check
  const isActive = (href: string) => {
    if (href === '/b2b/dashboard') {
      return pathname === '/b2b/dashboard' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  // Normalize link for subdomain routing or root
  const getHref = (href: string) => href

  // Navigation Schema based on Enterprise Procurement Specs
  const NAV_MODULES = [
    {
      group: 'WORKSPACE',
      items: [
        { label: 'Overview', href: '/b2b/dashboard', icon: '📊' },
        { label: 'Product Catalogue', href: '/b2b/catalog', icon: '📦' },
        { label: 'Saved Purchase Lists', href: '/b2b/replenishment', icon: '📑' },
      ],
    },
    {
      group: 'PROCUREMENT',
      items: [
        { label: 'New RFQ', href: '/b2b/rfq', icon: '⚡', badge: 'Draft' },
        { label: 'Quote Comparison', href: '/b2b/quotes', icon: '⚖️', badge: '3 Bids' },
        { label: 'Purchase Orders', href: '/b2b/orders', icon: '📋' },
        { label: 'Deliveries & Reefer', href: '/b2b/deliveries', icon: '🚚', badge: 'Live' },
        { label: 'Invoices & Credit', href: '/b2b/invoices', icon: '💳' },
      ],
    },
    {
      group: 'SUPPLY NETWORK',
      items: [
        { label: 'Vendors Database', href: '/b2b/suppliers', icon: '🏢' },
        { label: 'Quality & Certificates', href: '/b2b/certificates', icon: '🔬', badge: 'NABL' },
      ],
    },
    {
      group: 'MANAGEMENT',
      items: [
        { label: 'Procurement Desk', href: '/b2b/desk', icon: '💼' },
        { label: 'Business Settings', href: '/b2b/account', icon: '⚙️' },
      ],
    },
  ]

  // Global search handler
  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/b2b/catalog?search=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-stone-900 flex flex-col font-sans antialiased">
      <div className="flex flex-1">
        {/* ── 1. ENTERPRISE LEFT SIDEBAR ────────────────────────────────────── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A1322] text-stone-300 flex flex-col border-r border-white/10 transition-transform duration-300 lg:static lg:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Brand & Platform Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <Link href="/b2b/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#C9A45C] text-[#0A1322] flex items-center justify-center font-serif font-black text-lg shadow-sm">
                N
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-serif font-bold text-white text-base tracking-tight">
                    nuty tales
                  </span>
                  <span className="font-serif italic font-bold text-[#C9A45C] text-sm">
                    workflow
                  </span>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400 block -mt-0.5">
                  Procurement OS
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* User Profile Card (Matching Screenshot "Sourcing Specialist / Arvind Sharma") */}
          <div className="p-4 mx-3 my-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-[#704B32]/60 text-[#E7CBA8] text-[9px] font-bold uppercase tracking-wider border border-[#704B32]">
                Sourcing Specialist
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active Session" />
            </div>
            <div>
              <div className="font-bold text-white text-xs tracking-tight">Arvind Sharma</div>
              <div className="text-[10px] text-stone-400 truncate">arvind@confectionery.in</div>
            </div>
          </div>

          {/* Navigation Modules */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6 text-xs">
            {NAV_MODULES.map((module) => (
              <div key={module.group} className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block">
                  {module.group}
                </span>
                <div className="space-y-0.5">
                  {module.items.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={getHref(item.href)}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                          active
                            ? 'bg-[#17233B] text-white border-l-3 border-[#C9A45C] shadow-xs'
                            : 'text-stone-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm opacity-80">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              active
                                ? 'bg-[#C9A45C] text-[#0A1322]'
                                : 'bg-white/10 text-stone-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer: Public Discovery Link & FSSAI Badge */}
          <div className="p-3 border-t border-white/10 bg-[#070D18] space-y-2 text-[11px]">
            <Link
              href="/b2b"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            >
              <span>Public Storefront</span>
              <span>↗</span>
            </Link>
            <div className="text-[9px] text-stone-400 px-3">
              FSSAI Central Lic. {FSSAI_NUMBER}
            </div>
          </div>
        </aside>

        {/* ── 2. MAIN APPLICATION CONTENT AREA ──────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Enterprise Application Bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg"
                aria-label="Open navigation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Global Search & Command Entry */}
              <form onSubmit={handleGlobalSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vendors, POs, quotes, lots (Press ⌘K)..."
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:bg-white outline-none transition-all"
                />
                <span className="absolute left-3 top-2.5 text-stone-400 text-xs">🔍</span>
              </form>
            </div>

            {/* Right Quick Controls */}
            <div className="flex items-center gap-3">
              {/* Organization Switcher Dropdown */}
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-800 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="max-w-[200px] truncate">{currentOrg}</span>
                  <span className="text-[10px] text-stone-400">▼</span>
                </button>

                {orgDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-stone-200 shadow-xl py-2 z-50 text-xs animate-fadeIn">
                    <span className="px-3 py-1 font-bold text-[10px] uppercase text-stone-400 block">
                      Select Procurement Unit
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentOrg('Royal Confectionery Ltd · Noida Plant')
                        setOrgDropdownOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-stone-50 text-stone-900 font-medium"
                    >
                      Royal Confectionery · Noida Plant
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentOrg('Amber Foods Corp · Mumbai Depot')
                        setOrgDropdownOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-stone-50 text-stone-900 font-medium"
                    >
                      Amber Foods Corp · Mumbai Depot
                    </button>
                  </div>
                )}
              </div>

              {/* Context Primary Action: Generate RFQ / PO */}
              <Link
                href="/b2b/rfq"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
              >
                <span>+</span>
                <span>New RFQ</span>
              </Link>

              {/* Notification Bell with Badge & Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                  aria-label="View notifications"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden z-50 text-xs animate-fadeIn">
                    <div className="p-3.5 bg-[#17233B] text-white flex items-center justify-between">
                      <span className="font-bold">Enterprise Notifications</span>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                        {unreadCount} unread
                      </span>
                    </div>
                    <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3.5 hover:bg-stone-50 cursor-pointer transition-colors space-y-1 ${
                            !n.read ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <strong className="text-stone-900 text-xs">{n.title}</strong>
                            <span className="text-[10px] text-stone-400 whitespace-nowrap">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 leading-snug">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* WhatsApp Support Desk Link */}
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  'Hello Nuty Tales B2B Support! Need assistance with our corporate procurement account.',
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1.5 text-xs text-stone-600 hover:text-emerald-700 font-semibold"
                title="B2B Support Desk"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>B2B Desk</span>
              </a>

              {/* User Avatar Initials */}
              <Link
                href="/b2b/account"
                className="w-9 h-9 rounded-xl bg-[#17233B] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-[#C9A45C] transition-all"
                title="Arvind Sharma (Sourcing Lead)"
              >
                AS
              </Link>
            </div>
          </header>

          {/* Main Application Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>

          {/* Enterprise Application Footer (Compact, matching screenshot) */}
          <footer className="border-t border-stone-200 bg-white py-3 px-6 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-3">
            <div>© 2026 Nuty Tales Business Supply. All rights reserved.</div>
            <div className="flex items-center gap-4 text-[11px]">
              <Link href="/privacy" className="hover:text-stone-800">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-stone-800">
                Terms of Use
              </Link>
              <span>•</span>
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-700"
              >
                Support
              </a>
              <span>•</span>
              <span className="font-mono text-stone-400">v1.2.0</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
