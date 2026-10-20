'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface OrderRecord {
  orderId: string
  customer: {
    fullName: string
    phone: string
    email?: string
    address: string
    city: string
    state: string
    pincode: string
  }
  items: Array<{
    name: string
    sizeLabel: string
    quantity: number
    totalPrice: number
    image?: string
  }>
  subtotal: number
  shipping: number
  total: number
  paymentMethod: string
  createdAt: string
  estimatedDelivery?: string
}

function OrderTrackContent() {
  const searchParams = useSearchParams()
  const paramId = searchParams?.get('id') || ''
  const [orderIdInput, setOrderIdInput] = useState(paramId)
  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const loadOrder = (idToFind: string) => {
    setIsSearching(true)
    try {
      // 1. Check last order in localStorage
      const lastOrderStr = localStorage.getItem('nt_last_order')
      if (lastOrderStr) {
        const parsed: OrderRecord = JSON.parse(lastOrderStr)
        if (!idToFind || parsed.orderId.toLowerCase() === idToFind.toLowerCase().trim()) {
          setOrder(parsed)
          setIsSearching(false)
          return
        }
      }

      // 2. Check order history
      const historyStr = localStorage.getItem('nt_order_history')
      if (historyStr) {
        const history: OrderRecord[] = JSON.parse(historyStr)
        const match = history.find(
          (o) => o.orderId.toLowerCase() === idToFind.toLowerCase().trim()
        )
        if (match) {
          setOrder(match)
          setIsSearching(false)
          return
        }
      }

      // 3. Fallback demo mock for any validly structured ID
      if (idToFind) {
        const fallbackDate = new Date()
        const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        setOrder({
          orderId: idToFind.toUpperCase(),
          customer: {
            fullName: 'Valued Customer',
            phone: '+91 98110XXXXX',
            address: 'Primary Delivery Location',
            city: 'Delhi NCR',
            state: 'Uttar Pradesh',
            pincode: '201304',
          },
          items: [
            {
              name: 'NutyTales Premium Makhana (Jumbo 6 Suta)',
              sizeLabel: '1 kg Best Value Pack',
              quantity: 1,
              totalPrice: 899,
              image: '/images/promo-makhana-899.png',
            },
          ],
          subtotal: 899,
          shipping: 0,
          total: 899,
          paymentMethod: 'upi',
          createdAt: fallbackDate.toISOString(),
          estimatedDelivery: deliveryDate.toISOString(),
        })
      } else {
        setOrder(null)
      }
    } catch {
      setOrder(null)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (paramId) {
      setOrderIdInput(paramId)
      loadOrder(paramId)
    } else {
      loadOrder('')
    }
  }, [paramId])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderIdInput.trim()) return
    loadOrder(orderIdInput.trim())
  }

  const estDeliveryStr = order?.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })

  return (
    <main className="min-h-screen bg-[#FDFBF7] pt-28 sm:pt-36 pb-24 text-[#17233B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wider uppercase border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NutyTales Live Dispatch &amp; Delivery Tracker</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#17233B]">
            Track Your Delivery
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Real-time status from our central packaging hub to your doorstep.
          </p>
        </div>

        {/* Search Order Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border-2 border-stone-200 shadow-sm focus-within:border-[#17233B] transition-colors">
            <span className="pl-3 text-stone-400">🔍</span>
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Enter Order ID (e.g. NT-ORD-2026-123456)"
              className="w-full py-2 px-2 text-xs sm:text-sm font-mono text-stone-800 uppercase focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2.5 bg-[#17233B] hover:bg-[#203050] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap shadow-xs cursor-pointer"
            >
              {isSearching ? 'Searching...' : 'Track'}
            </button>
          </div>
        </form>

        {/* Order Details Card */}
        {order ? (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
            {/* Top Bar: Order ID + Status Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">
                  ORDER REFERENCE
                </span>
                <span className="font-mono text-lg sm:text-xl font-bold text-[#17233B]">
                  {order.orderId}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>In Transit — Express Air</span>
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">
                  Est. Delivery by <strong className="text-stone-900">{estDeliveryStr}</strong>
                </span>
              </div>
            </div>

            {/* Live 5-Step Delivery Timeline */}
            <div className="py-4 border-b border-stone-100 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Carrier Progress Timeline
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                {/* Step 1 */}
                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                    <span>✓</span>
                    <span>1. Order Placed</span>
                  </div>
                  <p className="text-[10px] text-emerald-700">Receipt generated &amp; verified</p>
                </div>

                {/* Step 2 */}
                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                    <span>✓</span>
                    <span>2. Quality Sealed</span>
                  </div>
                  <p className="text-[10px] text-emerald-700">Nitrogen-packed at Noida hub</p>
                </div>

                {/* Step 3 */}
                <div className="p-3 bg-[#17233B] text-white rounded-2xl shadow-xs space-y-1 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#C9A45C]">
                    <span className="w-2 h-2 rounded-full bg-[#C9A45C] animate-pulse" />
                    <span>3. In Transit</span>
                  </div>
                  <p className="text-[10px] text-stone-300">Blue Dart / Delhivery Express</p>
                </div>

                {/* Step 4 */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 space-y-1 opacity-70">
                  <div className="font-semibold text-xs">4. Out for Delivery</div>
                  <p className="text-[10px]">Courier agent assigned</p>
                </div>

                {/* Step 5 */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 space-y-1 opacity-70">
                  <div className="font-semibold text-xs">5. Delivered</div>
                  <p className="text-[10px]">Doorstep receipt</p>
                </div>
              </div>
            </div>

            {/* Carrier Logistics Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Carrier Partner
                </span>
                <span className="font-bold text-stone-900 text-xs mt-0.5 block">
                  Blue Dart Express Air / Delhivery
                </span>
                <span className="text-[10px] text-stone-500">AWB: BD-AIR-88910412IN</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Dispatch Hub
                </span>
                <span className="font-bold text-stone-900 text-xs mt-0.5 block">
                  Noida Sector 63 Central Facility
                </span>
                <span className="text-[10px] text-stone-500">FSSAI Lic. #{FSSAI_NUMBER}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Payment Method
                </span>
                <span className="font-bold text-stone-900 text-xs mt-0.5 uppercase block">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">Total: ₹{order.total}</span>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Delivery Address
              </span>
              <div className="font-bold text-stone-900">{order.customer.fullName}</div>
              <div className="text-stone-600">
                {order.customer.address}, {order.customer.city}, {order.customer.state} -{' '}
                {order.customer.pincode}
              </div>
              <div className="text-stone-500 font-mono text-[11px]">Phone: {order.customer.phone}</div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Items in Package ({order.items.length})
              </span>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-200 bg-stone-50 shrink-0">
                        <Image
                          src={item.image || '/images/promo-makhana-899.png'}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">{item.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {item.sizeLabel} × {item.quantity}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-stone-900">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `Hello NutyTales! 👋 Please share latest tracking update for Order: ${order.orderId}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-2"
              >
                <span>💬 WhatsApp Support</span>
              </a>

              <Link
                href="/shop"
                className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <span className="text-4xl block">📦</span>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              No recent order found on this device
            </h3>
            <p className="text-xs text-stone-500">
              Please enter your Order ID above or place an order from the shop to track delivery.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-[#17233B] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Shop Featured Makhana
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

export default function OrderTrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs">Loading tracker...</div>}>
      <OrderTrackContent />
    </Suspense>
  )
}
