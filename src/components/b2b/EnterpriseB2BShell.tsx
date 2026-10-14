'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  getStoredNotifications,
  EnterpriseNotification,
  markNotificationAsRead,
} from '@/lib/b2b-procurement-store'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

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
  const [userMenuOpen, setUserMenuOpen] = useState(false)

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

  // Active check matching the screenshot
  const isItemActive = (href: string, key: string) => {
    if (key === 'procurement') {
      return (
        pathname === '/b2b/dashboard' ||
        pathname === '/dashboard' ||
        pathname === '/b2b' ||
        pathname.includes('/procurement')
      )
    }
    return pathname.startsWith(href)
  }

  // Exact 10 navigation items as in reference screenshot
  const SIDEBAR_ITEMS = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      href: '/b2b/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      key: 'leads',
      label: 'Leads',
      href: '/b2b/desk',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      key: 'quotations',
      label: 'Quotations',
      href: '/b2b/quotes',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      href: '/b2b/orders',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      key: 'production',
      label: 'Production',
      href: '/b2b/replenishment',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      key: 'vendors',
      label: 'Vendors',
      href: '/b2b/suppliers',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      key: 'procurement',
      label: 'Procurement',
      href: '/b2b/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      key: 'stock-alerts',
      label: 'Stock Alerts',
      href: '/b2b/deliveries',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      key: 'reports',
      label: 'Reports',
      href: '/b2b/certificates',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      key: 'settings',
      label: 'Settings',
      href: '/b2b/account',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/b2b/catalog?search=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen bg-[#F3F6F9] text-stone-900 flex flex-col font-sans antialiased">
      {/* ── TOP APPLICATION BAR (Deep Navy, Full Width, Matching Screenshot) ── */}
      <header className="h-14 bg-[#081830] text-white flex items-center justify-between px-4 sm:px-6 border-b border-white/10 z-40 sticky top-0 shadow-sm">
        {/* Left: Mobile hamburger + Orange Logo & Name */}
        <div className="flex items-center gap-3 w-56 flex-shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1 text-stone-300 hover:text-white rounded"
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/b2b/dashboard" className="flex items-center gap-2">
            {/* Orange Square Logo Icon matching screenshot */}
            <div className="w-7 h-7 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-white text-sm tracking-tight lowercase">plasma</span>
              <span className="font-light text-stone-300 text-sm tracking-tight lowercase">workflow</span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar with dark navy background */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <form onSubmit={handleGlobalSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors, quotes, POs..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#12274A] hover:bg-[#16305A] focus:bg-[#16305A] border border-white/10 focus:border-white/30 rounded-lg text-xs text-white placeholder-stone-400 outline-none transition-all"
            />
            <span className="absolute left-3 top-2 text-stone-400 text-xs">🔍</span>
          </form>
        </div>

        {/* Right: Notifications Bell & User Profile Pill */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg relative"
              aria-label="Notifications"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B00] ring-2 ring-[#081830]" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-stone-800 rounded-2xl border border-stone-200 shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                  <span className="font-bold text-stone-900">Procurement Activity</span>
                  <span className="text-[10px] text-stone-500 font-mono">{unreadCount} new</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 cursor-pointer hover:bg-stone-50 transition-colors ${
                        !n.read ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="font-semibold text-stone-900 leading-snug">{n.title}</div>
                      <div className="text-[11px] text-stone-600 mt-0.5 line-clamp-2">{n.message}</div>
                      <div className="text-[9px] text-stone-400 mt-1 font-mono">{n.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill Avatar (Matching Screenshot: "AS Arvind Sharma ▾") */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-[10px]">
                AS
              </div>
              <span className="hidden sm:inline-block font-medium text-xs">Arvind Sharma</span>
              <span className="text-[9px] text-stone-400">▾</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-stone-800 rounded-2xl border border-stone-200 shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-stone-100">
                  <div className="font-bold text-stone-900">Arvind Sharma</div>
                  <div className="text-[10px] text-stone-500">arvind@confectionery.in</div>
                </div>
                <Link
                  href="/b2b/account"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-stone-50 text-stone-700"
                >
                  Commercial Account &amp; GSTIN
                </Link>
                <Link
                  href="/b2b"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-stone-50 text-stone-700"
                >
                  Public Storefront
                </Link>
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 hover:bg-stone-50 text-emerald-700 font-bold"
                >
                  Help Desk WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── WORKSPACE BODY: SIDEBAR + MAIN VIEW ─────────────────────────────── */}
      <div className="flex flex-1">
        {/* Left Sidebar (Deep Navy #081830) */}
        <aside
          className={`fixed inset-y-14 left-0 z-30 w-56 bg-[#081830] text-stone-300 flex flex-col border-r border-white/10 transition-transform duration-300 lg:static lg:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* User Badge: Sourcing Specialist / Arvind Sharma */}
          <div className="p-4 mx-3 my-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#78350F] text-[#FDE68A]">
              Sourcing Specialist
            </span>
            <div className="font-bold text-white text-xs">Arvind Sharma</div>
            <div className="text-[10px] text-stone-400">arvind@confectionery.in</div>
          </div>

          {/* Navigation Links (Matching Screenshot's 10 Items) */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 text-xs">
            {SIDEBAR_ITEMS.map((item) => {
              const active = isItemActive(item.href, item.key)
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#152D54] text-white shadow-xs font-bold border-l-2 border-[#FF6B00]'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`flex-shrink-0 ${active ? 'text-[#FF6B00]' : 'text-stone-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Storefront return link */}
          <div className="p-3 border-t border-white/10 bg-[#050F1E] text-[11px]">
            <Link
              href="/b2b"
              className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            >
              <span>Public Storefront</span>
              <span>↗</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="flex-1">{children}</div>

          {/* Footer matching screenshot */}
          <footer className="mt-12 pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
            <div>© 2026 Plasma Workflow. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-stone-800">
                Privacy Policy
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-stone-800">
                Terms of Use
              </Link>
              <span>·</span>
              <a href={`https://wa.me/${whatsappPhone}`} className="hover:text-stone-800">
                Support
              </a>
            </div>
            <div className="font-mono text-stone-400">v2.4.0</div>
          </footer>
        </main>
      </div>
    </div>
  )
}
