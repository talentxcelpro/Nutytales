'use client'

import React, { useState, useEffect } from 'react'
import { useSeller } from '../SellerContext'
import { SellerCustomer } from '@/lib/seller-portal/types'

export default function SellerCustomersPage() {
  const { seller, reportingCurrency, formatCurrencyAmount } = useSeller()
  const [customers, setCustomers] = useState<SellerCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')

  const fetchCustomers = async (sellerId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/seller/customers?sellerId=${sellerId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.customers) setCustomers(data.customers)
      }
    } catch (err) {
      console.error('Failed to load customers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (seller?.id) {
      fetchCustomers(seller.id)
    }
  }, [seller?.id])

  const filtered = customers.filter((c) => {
    const emailStr = c.email || c.emailMasked || ''
    const matchesSearch =
      search.trim() === ''
        ? true
        : c.name.toLowerCase().includes(search.toLowerCase()) ||
          emailStr.toLowerCase().includes(search.toLowerCase()) ||
          c.city.toLowerCase().includes(search.toLowerCase())

    const matchesCountry =
      selectedCountry === 'all' ? true : (c.country || 'Global') === selectedCountry

    return matchesSearch && matchesCountry
  })

  const countries = Array.from(new Set(customers.map((c) => c.country || 'Global')))
  const totalLtv = customers.reduce((sum, c) => sum + (c.totalSpent || c.totalSpend || 0), 0)
  const totalOrders = customers.reduce((sum, c) => sum + (c.ordersCount || c.totalOrders || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-bold">
            Customer Directory & Audience Intelligence
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#163326] mt-0.5">
            Global Customers & Repeat Buyers
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Track buyer engagement across international jurisdictions, monitor lifetime value (LTV), and identify high-value repeat clients.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Unique Buyers</span>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">{customers.length}</div>
          <span className="text-[11px] text-stone-500 mt-1 block">Across {countries.length} countries</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Total Customer Spend</span>
          <div className="text-2xl font-bold font-serif text-emerald-900 mt-1">
            {formatCurrencyAmount(totalLtv)}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">In {reportingCurrency}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Repeat Orders</span>
          <div className="text-2xl font-bold font-serif text-blue-900 mt-1">{totalOrders}</div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            {(totalOrders / (customers.length || 1)).toFixed(1)} orders / customer
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">VIP Merchants / Clients</span>
          <div className="text-2xl font-bold font-serif text-purple-900 mt-1">
            {customers.filter((c) => (c.ordersCount ?? c.totalOrders ?? 0) >= 3).length}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">High frequency patrons</span>
        </div>
      </div>

      {/* Search & Country Filter */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email or city..."
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Country:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="text-xs px-3 py-2.5 rounded-xl border border-stone-300 bg-white"
          >
            <option value="all">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">Loading customer records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">No customer records matching your filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Customer Name & ID</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Orders Placed</th>
                  <th className="py-3.5 px-4">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Last Order</th>
                  <th className="py-3.5 px-4 text-right">Loyalty Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((cust) => {
                  const ordersNum = cust.ordersCount ?? cust.totalOrders ?? 0
                  const isVip = ordersNum >= 3
                  const spentNum = cust.totalSpent ?? cust.totalSpend ?? 0
                  const dateStr = cust.lastOrderAt ?? cust.lastOrderDate
                  return (
                    <tr key={cust.id} className="hover:bg-stone-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#163326] to-[#24523F] text-stone-100 flex items-center justify-center font-bold text-xs shrink-0">
                            {cust.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900">{cust.name}</div>
                            <div className="text-[10px] font-mono text-stone-400">{cust.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-stone-700">{cust.email}</div>
                        <div className="text-[10px] text-stone-400">{cust.phone || 'Phone on file'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-800">{cust.country}</div>
                        <div className="text-[10px] text-stone-400">{cust.city}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        {ordersNum} orders
                      </td>

                      <td className="py-3.5 px-4 font-bold text-emerald-800">
                        {formatCurrencyAmount(spentNum)}
                      </td>

                      <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                        {dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isVip ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                            ★ VIP Patron
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] text-stone-500 bg-stone-100">
                            Verified Buyer
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
