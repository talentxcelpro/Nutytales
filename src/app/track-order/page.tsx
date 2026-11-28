'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface TrackedOrder {
  orderNumber: string
  customerFirstName: string
  orderStatus: string
  paymentStatus: string
  fulfillmentStatus: string
  paymentMethod: string
  totalAmount: number
  currency: string
  createdAt: string
  confirmedAt?: string | null
  deliveredAt?: string | null
  shippingSummary: {
    city: string
    state: string
    pincode: string
  }
}

interface TrackedItem {
  id: string
  product_id: string
  product_name: string
  product_image: string
  product_variant: string
  quantity: number
  unit_price: number
  total_price: number
}

interface TrackedShipment {
  id: string
  courier_name: string
  tracking_number: string
  tracking_url: string
  shipment_status: string
  shipping_method: string
  estimated_delivery?: string | null
  shipped_at?: string | null
  delivered_at?: string | null
}

interface TrackingEvent {
  id: string
  shipment_id?: string | null
  status: string
  title: string
  description: string
  location?: string | null
  event_timestamp: string
}

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams?.get('order') || '')
  const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    order: TrackedOrder
    items: TrackedItem[]
    shipments: TrackedShipment[]
    events: TrackingEvent[]
  } | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!orderNumber.trim() || !contact.trim()) {
      setError('Please enter both your order number and email or mobile number.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: orderNumber.trim(), contact: contact.trim() }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setResult(null)
        setError(data.error || 'Order not found or verification details do not match.')
      } else {
        setResult({
          order: data.order,
          items: data.items || [],
          shipments: data.shipments || [],
          events: data.events || [],
        })
      }
    } catch {
      setError('Unable to reach order tracking service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#704B32]">
            NutyTales Order Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#17233B]">
            Track Your Order
          </h1>
          <p className="text-sm text-stone-600">
            Your NutyTales order, every step of the way.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-[#EAE3D5] p-6 sm:p-8 shadow-xs space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Order Number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. NT-ORD-2026-123456"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#176B68]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Email Address or Mobile Number
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Registered email or 10-digit mobile"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#176B68]"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying Order...' : 'Track Order'}
          </button>
        </form>

        {result && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-3xl border border-[#EAE3D5] p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                    Order Number
                  </p>
                  <p className="text-lg font-bold text-[#17233B] font-mono">
                    {result.order.orderNumber}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FAF6EE] text-[#17233B] border border-[#EAE3D5]">
                    {result.order.orderStatus.replace(/_/g, ' ')}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Payment: {result.order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-stone-500 block">Order Date</span>
                  <span className="font-semibold text-[#17233B]">
                    {new Date(result.order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Total Amount</span>
                  <span className="font-bold text-[#176B68]">
                    ₹{result.order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Destination</span>
                  <span className="font-semibold text-[#17233B]">
                    {[result.order.shippingSummary.city, result.order.shippingSummary.state]
                      .filter(Boolean)
                      .join(', ') || 'India'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Fulfillment</span>
                  <span className="font-semibold text-[#17233B] capitalize">
                    {result.order.fulfillmentStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Products Ordered */}
              {result.items.length > 0 && (
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Items in This Order
                  </h2>
                  <div className="divide-y divide-stone-100">
                    {result.items.map((item) => (
                      <div key={item.id} className="py-3 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-[#FAF6EE] border border-stone-100 overflow-hidden shrink-0">
                          {item.product_image && (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#17233B] truncate">
                            {item.product_name}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {item.product_variant ? `${item.product_variant} · ` : ''}Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#17233B]">
                          ₹{Number(item.total_price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shipments */}
            {result.shipments.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#EAE3D5] p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Shipment Details ({result.shipments.length})
                </h2>
                <div className="space-y-3">
                  {result.shipments.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-stone-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-[#17233B]">
                          {s.courier_name} ·{' '}
                          <span className="uppercase text-[#176B68]">
                            {s.shipment_status.replace(/_/g, ' ')}
                          </span>
                        </p>
                        {s.tracking_number && (
                          <p className="text-stone-600 font-mono">AWB: {s.tracking_number}</p>
                        )}
                        {s.estimated_delivery && (
                          <p className="text-stone-500">
                            Est. Delivery:{' '}
                            {new Date(s.estimated_delivery).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                      {s.tracking_url && (
                        <a
                          href={s.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-full bg-[#17233B] text-white text-[11px] font-bold uppercase tracking-wider text-center"
                        >
                          Track with Courier →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tracking Timeline */}
            <div className="bg-white rounded-3xl border border-[#EAE3D5] p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Tracking Timeline
              </h2>
              {result.events.length > 0 ? (
                <ol className="relative border-l border-[#EAE3D5] ml-2 space-y-5">
                  {result.events.map((ev) => (
                    <li key={ev.id} className="ml-5">
                      <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-[#176B68] ring-4 ring-[#FDFBF7]" />
                      <p className="text-xs font-bold text-[#17233B] capitalize">{ev.title}</p>
                      {ev.description && (
                        <p className="text-xs text-stone-600 mt-0.5">{ev.description}</p>
                      )}
                      <p className="text-[10px] text-stone-400 mt-1">
                        {new Date(ev.event_timestamp).toLocaleString('en-IN')}
                        {ev.location ? ` · ${ev.location}` : ''}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs text-stone-500">
                  Order received. Tracking events will appear here as your order is processed.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Order Support */}
        <div className="bg-[#FAF6EE] rounded-3xl border border-[#EAE3D5] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-bold text-[#17233B]">Need help with your order?</p>
            <p className="text-stone-600 mt-0.5">
              Our NutyTales concierge team is available for order &amp; delivery assistance.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/contact"
              className="px-4 py-2 rounded-full border border-[#17233B]/20 bg-white text-[#17233B] font-semibold"
            >
              Contact Support
            </Link>
            {whatsappPhone && (
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#176B68] text-white font-semibold"
              >
                WhatsApp Support
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackOrderContent />
    </Suspense>
  )
}
