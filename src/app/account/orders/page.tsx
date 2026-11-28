'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

interface AccountOrder {
  id: string
  order_number: string
  total_amount: number
  currency: string
  payment_method: string
  payment_status: string
  order_status: string
  fulfillment_status: string
  created_at: string
}

const FILTERS = ['all', 'processing', 'shipped', 'delivered', 'cancelled'] as const

export default function AccountOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<AccountOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [unauthorized, setUnauthorized] = useState(false)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setUnauthorized(true)
      setLoading(false)
      return
    }
    setUnauthorized(false)
    user
      .getIdToken()
      .then((token) =>
        fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        })
      )
      .then(async (res) => {
        if (res.status === 401) {
          setUnauthorized(true)
          return
        }
        const data = await res.json()
        if (data.success) setOrders(data.orders || [])
      })
      .finally(() => setLoading(false))
  }, [user, authLoading])

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.order_status === filter)

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-normal text-[#17233B]">My Orders</h1>
            <p className="text-xs text-stone-600 mt-1">
              View your NutyTales order history and live shipment progress.
            </p>
          </div>
          <Link
            href="/track-order"
            className="px-4 py-2 rounded-full border border-stone-200 bg-white text-xs font-semibold text-[#17233B] self-start"
          >
            Track by Order Number →
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? 'bg-[#17233B] text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:text-[#17233B]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-[#EAE3D5] p-10 text-center text-xs text-stone-500">
            Loading your orders...
          </div>
        ) : unauthorized ? (
          <div className="bg-white rounded-3xl border border-[#EAE3D5] p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-[#17233B]">
              Sign in to view your account orders
            </p>
            <p className="text-xs text-stone-500">
              Or use guest tracking with your order number and email/phone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/login?redirect=/account/orders"
                className="px-5 py-2.5 rounded-full bg-[#17233B] text-white text-xs font-bold uppercase tracking-wider"
              >
                Sign In
              </Link>
              <Link
                href="/track-order"
                className="px-5 py-2.5 rounded-full border border-stone-200 bg-white text-xs font-bold uppercase tracking-wider text-[#17233B]"
              >
                Track Order
              </Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EAE3D5] p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-[#17233B]">No orders found</p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 rounded-full bg-[#17233B] text-white text-xs font-bold uppercase tracking-wider"
            >
              Explore Harvests
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#EAE3D5] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-[#17233B]">
                      {order.order_number}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FAF6EE] border border-[#EAE3D5] text-[#17233B]">
                      {order.order_status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    · Payment: {order.payment_status} · Total: ₹
                    {Number(order.total_amount).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/track-order?order=${encodeURIComponent(order.order_number)}`}
                    className="px-4 py-2 rounded-full border border-stone-200 text-xs font-semibold text-[#17233B]"
                  >
                    Track Order
                  </Link>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="px-4 py-2 rounded-full bg-[#17233B] text-white text-xs font-semibold"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
