'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Wholesale', href: '/wholesale-dry-fruits' },
  { label: 'Corporate Gifting', href: '/corporate-gifting' },
  { label: 'Stays', href: '/stays' },
  { label: 'Travel', href: '/travel/kashmir' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F7F2E8]/95 backdrop-blur-md shadow-sm border-b border-[#17233B]/10'
            : 'bg-[#F7F2E8]/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Left */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-[#17233B]/10 bg-white p-0.5 flex-shrink-0 shadow-sm">
                <Image
                  src="/images/logo.jpg"
                  alt="Nutty Tales"
                  width={44}
                  height={44}
                  priority
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#17233B] group-hover:text-[#176B68] transition-colors leading-none">
                  Nutty Tales
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#704B32] font-medium mt-1">
                  Wholesome Nutty Delights
                </span>
              </div>
            </Link>

            {/* Navigation Center */}
            <nav className="hidden md:flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-widest font-semibold transition-colors py-1 relative ${
                    isActive(link.href)
                      ? 'text-[#176B68] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#176B68]'
                      : 'text-[#17233B]/80 hover:text-[#176B68]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions Right */}
            <div className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-wider font-semibold text-[#17233B]">
              <Link
                href="/bulk-quote"
                className="text-[#704B32] hover:text-[#176B68] transition-colors"
              >
                Bulk Quote
              </Link>
              <Link
                href="/business"
                className="text-[#704B32] hover:text-[#176B68] transition-colors"
              >
                B2B Account
              </Link>
              <Link
                href="/cart"
                className="text-base text-[#17233B] hover:text-[#176B68] transition-colors"
                aria-label="Cart"
              >
                🛒
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#176B68] hover:bg-[#125350] text-white rounded-md text-[11px] font-semibold tracking-wider uppercase transition-colors"
              >
                +91 9717161809
              </a>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-3 md:hidden">
              <Link href="/cart" className="text-xl" aria-label="Cart">
                🛒
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-[#17233B] text-2xl focus:outline-none p-1"
                aria-label="Toggle menu"
              >
                {mobileOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#F7F2E8] border-b border-[#17233B]/10 px-6 py-6 space-y-4">
            <nav className="space-y-3 text-sm font-semibold tracking-wide text-[#17233B]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 border-b border-[#17233B]/5 hover:text-[#176B68]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/bulk-quote"
                className="block py-2 border-b border-[#17233B]/5 hover:text-[#176B68]"
              >
                Request Bulk Quote
              </Link>
              <Link
                href="/business"
                className="block py-2 border-b border-[#17233B]/5 hover:text-[#176B68]"
              >
                Business Account
              </Link>
            </nav>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-[#176B68] text-white text-center rounded-md font-semibold text-xs uppercase tracking-wider"
              >
                WhatsApp Concierge (+91 9717161809)
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Floating subtle WhatsApp icon */}
      <a
        href={`https://wa.me/${whatsappPhone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-13 h-13 bg-[#176B68] hover:bg-[#125350] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 border border-white/40"
      >
        <span className="text-xl">💬</span>
      </a>
    </>
  )
}
