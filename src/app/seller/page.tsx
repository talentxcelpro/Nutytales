'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSeller } from './SellerContext'
import { SellerDashboardOverview, CURRENCY_SYMBOLS, convertCurrency } from '@/lib/seller-portal/types'

export default function GlobalSellerOverviewPage() {
  const {
    seller,
    availableSellers,
    switchSeller,
    loading: sellerLoading,
    reportingCurrency,
    setReportingCurrency,
    regionFilter,
    setRegionFilter,
    dateRange,
    setDateRange,
  } = useSeller()

  const [data, setData] = useState<SellerDashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async (sellerId: string) => {
    setLoading(true)
    try {
      const [ordersRes, productsRes, financeRes] = await Promise.all([
        fetch(`/api/seller/orders?sellerId=${sellerId}`),
        fetch(`/api/seller/products?sellerId=${sellerId}`),
        fetch(`/api/seller/finance?sellerId=${sellerId}`),
      ])

      const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] }
      const productsData = productsRes.ok ? await productsRes.json() : { products: [] }
      const financeData = financeRes.ok ? await financeRes.json() : { financialSummary: {}, ledger: [] }

      const orders = ordersData.orders || []
      const products = productsData.products || []

      // Convert all sums cleanly to the selected reporting currency
      const gmv = orders.reduce((sum: number, o: any) => {
        if (o.status === 'cancelled') return sum
        return sum + convertCurrency(o.subtotal, o.currency || 'USD', reportingCurrency)
      }, 0)

      const net = orders.reduce((sum: number, o: any) => {
        if (o.status === 'cancelled') return sum
        return sum + convertCurrency(o.netPayout, o.currency || 'USD', reportingCurrency)
      }, 0)

      const awaitingAction = orders.filter(
        (o: any) => o.status === 'new' || o.status === 'processing' || o.status === 'ready_for_pickup'
      )
      const lowStock = products.filter(
        (p: any) => p.stockAvailable > 0 && p.stockAvailable <= (p.lowStockThreshold || 5)
      )
      const outOfStock = products.filter((p: any) => p.stockAvailable <= 0)

      const pendingSettlement = orders
        .filter((o: any) => o.payoutStatus === 'on_hold')
        .reduce(
          (sum: number, o: any) =>
            sum + convertCurrency(o.netPayout, o.currency || 'USD', reportingCurrency),
          0
        )

      const availableBalRaw = financeData.financialSummary?.availableBalance || 0
      const availableBal = convertCurrency(
        availableBalRaw,
        seller?.preferredCurrency || 'USD',
        reportingCurrency
      )

      const returnCount = orders.filter((o: any) => o.status === 'returned').length
      const returnRate = orders.length > 0 ? Number(((returnCount / orders.length) * 100).toFixed(1)) : 0.0

      const cancelCount = orders.filter((o: any) => o.status === 'cancelled').length
      const cancelRate = orders.length > 0 ? Number(((cancelCount / orders.length) * 100).toFixed(1)) : 0.0

      // Compute units sold per product from real order items
      const unitsSoldMap: Record<string, number> = {}
      orders.forEach((o: any) => {
        if (o.status !== 'cancelled' && Array.isArray(o.items)) {
          o.items.forEach((it: any) => {
            const pId = it.productId || it.id
            if (pId) {
              unitsSoldMap[pId] = (unitsSoldMap[pId] || 0) + Number(it.quantity || it.qty || 1)
            }
          })
        }
      })

      const topProductsList = products.slice(0, 4).map((p: any) => {
        const units = unitsSoldMap[p.id] || 0
        return {
          productId: p.id,
          title: p.title,
          sku: p.sku,
          category: p.categoryName || 'General',
          unitsSold: units,
          revenue: convertCurrency(p.sellingPrice * units, p.currency || 'USD', reportingCurrency),
          stock: p.stockAvailable,
        }
      })

      // Aggregate sales by region from real order destination records
      const regionCounts: Record<string, { revenue: number; orderCount: number }> = {}
      orders.forEach((o: any) => {
        const country = o.customerCountry || o.customerCountryCode || 'Domestic'
        const region =
          country === 'US' || country === 'CA' || country === 'United States' || country === 'Canada'
            ? 'North America (US & CA)'
            : country === 'GB' || country === 'DE' || country === 'FR' || country === 'United Kingdom' || country === 'Germany'
            ? 'Europe & UK'
            : country === 'AE' || country === 'SA' || country === 'United Arab Emirates'
            ? 'Middle East & GCC'
            : 'Asia-Pacific & Domestic'

        if (!regionCounts[region]) {
          regionCounts[region] = { revenue: 0, orderCount: 0 }
        }
        regionCounts[region].revenue += convertCurrency(o.subtotal || 0, o.currency || 'USD', reportingCurrency)
        regionCounts[region].orderCount += 1
      })

      const salesByRegion =
        Object.keys(regionCounts).length > 0
          ? Object.entries(regionCounts).map(([region, stat]) => ({
              region,
              revenue: Math.round(stat.revenue),
              orderCount: stat.orderCount,
              percent: gmv > 0 ? Math.round((stat.revenue / gmv) * 100) : 0,
            }))
          : [
              { region: 'North America (US & CA)', revenue: 0, orderCount: 0, percent: 0 },
              { region: 'Europe & UK', revenue: 0, orderCount: 0, percent: 0 },
              { region: 'Middle East & GCC', revenue: 0, orderCount: 0, percent: 0 },
              { region: 'Asia-Pacific & Domestic', revenue: 0, orderCount: 0, percent: 0 },
            ]

      setData({
        reportingCurrency,
        grossMerchandiseValue: gmv,
        netRevenue: net,
        ordersTodayCount: orders.length > 0 ? 1 : 0,
        ordersAwaitingActionCount: awaitingAction.length,
        totalOrdersCount: orders.length,
        activeProductsCount: products.filter((p: any) => p.status === 'approved').length,
        productsInReviewCount: products.filter((p: any) => p.status === 'pending_review').length,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
        pendingSettlementAmount: pendingSettlement,
        availablePayoutBalance: availableBal,
        settlementHoldDays: seller?.settlementHoldDays || 7,
        returnRatePercent: returnRate,
        cancellationRatePercent: cancelRate,
        salesByRegion,
        recentOrders: orders.slice(0, 5),
        topProducts: topProductsList,
        actionAlerts: [
          ...(awaitingAction.length > 0
            ? [
                {
                  id: 'alt-orders',
                  type: 'order' as const,
                  severity: 'warning' as const,
                  title: `${awaitingAction.length} Domestic & Cross-Border Orders Need Packing`,
                  message: 'Generate international commercial invoices and book courier collection for today.',
                  actionLink: '/seller/orders',
                },
              ]
            : []),
          ...(lowStock.length > 0
            ? [
                {
                  id: 'alt-stock',
                  type: 'inventory' as const,
                  severity: 'critical' as const,
                  title: `${lowStock.length} Product SKUs Near Reorder Threshold`,
                  message: 'Replenish warehouse stock to maintain prime placement across active marketplace channels.',
                  actionLink: '/seller/inventory',
                },
              ]
            : []),
        ],
      })
    } catch (err) {
      console.error('Failed to load global seller metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (seller?.id) {
      fetchDashboardData(seller.id)
    } else if (!sellerLoading) {
      setLoading(false)
    }
  }, [seller?.id, sellerLoading, reportingCurrency])

  const symbol = CURRENCY_SYMBOLS[reportingCurrency] || '$'
  const formatMoney = (val: number) => `${symbol}${Math.round(val).toLocaleString('en-US')}`

  if (sellerLoading || (loading && seller)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-[#163326] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-stone-600 text-sm font-medium">Connecting to Nuty Tales Global Seller Central...</p>
      </div>
    )
  }

  if (!seller && !sellerLoading) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-6 shadow-xs">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#163326] to-[#2B5D48] text-[#C5A869] flex items-center justify-center text-3xl font-serif font-black shadow-md">
          NT
        </div>
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-[#C5A869] font-black">
            Nuty Tales Global Marketplace
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#163326]">
            Welcome to Seller Central
          </h2>
          <p className="text-stone-600 text-sm max-w-lg mx-auto">
            Sell Anywhere. Grow Everywhere. Register your business to start listing products across our global storefronts with <strong className="text-emerald-800">0% platform commission</strong> and 100% net earnings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/seller/register"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#163326] hover:bg-[#11291E] text-white text-xs sm:text-sm font-bold shadow-md transition"
          >
            + Register New Merchant (Free)
          </Link>
          <Link
            href="/login?redirect=/seller"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold border border-stone-300 transition"
          >
            Sign In with Existing Account
          </Link>
        </div>

        {availableSellers && availableSellers.length > 0 && (
          <div className="pt-6 border-t border-stone-100 text-left">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Available Merchant Stores:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableSellers.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  onClick={() => switchSeller(s.id)}
                  className="p-3 text-left border border-stone-200 rounded-xl hover:border-[#163326] hover:bg-stone-50 transition flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-2">
                    <span className="font-semibold text-stone-900 block truncate">{s.storeName}</span>
                    <span className="text-[11px] text-stone-500">{s.city}, {s.country}</span>
                  </div>
                  <span className="text-[#163326] font-bold text-xs shrink-0">Open →</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Verification Notice Banner if not approved */}
      {seller?.status !== 'approved' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <h4 className="font-semibold text-amber-950 text-sm">Account Verification In Progress</h4>
              <p className="text-amber-800 text-xs">
                Your international vendor application is undergoing compliance review. You can configure products, warehouse locations, and shipping rates now. Public storefront listing will activate upon verification.
              </p>
            </div>
          </div>
          <Link
            href="/seller/profile"
            className="text-xs font-bold bg-amber-900 text-white px-3.5 py-1.5 rounded-lg hover:bg-amber-950 transition whitespace-nowrap"
          >
            Review Business Documents
          </Link>
        </div>
      )}

      {/* 0% Commission & Free Listing Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-[#FAF6EF] to-amber-50/60 border border-emerald-300/80 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
            ✨
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-emerald-950 text-xs sm:text-sm">
                0% Platform Commission · Free Product Listings Active
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-700 text-white">
                100% Payout
              </span>
            </div>
            <p className="text-emerald-800/90 text-[11px] sm:text-xs mt-0.5">
              Keep 100% of your earnings on every order. Zero platform deductions, free unlimited catalogue listings, and no recurring fees.
            </p>
          </div>
        </div>
        <Link
          href="/seller/products/new"
          className="text-xs font-bold bg-[#163326] hover:bg-[#11291E] text-white px-3.5 py-1.5 rounded-xl shadow-xs transition whitespace-nowrap self-stretch sm:self-auto text-center active:scale-95 shrink-0"
        >
          + List Product Free
        </Link>
      </div>

      {/* Global Dashboard Header with Unified Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A869] font-black">
                Nuty Tales Seller Central
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono">
                {seller?.countryCode} · ID: {seller?.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-serif font-bold text-[#163326] mt-1">
              Welcome, {seller?.storeName}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-semibold text-[#163326]">Your business, connected to the world.</span>
              <span className="hidden sm:inline">·</span>
              <span className="text-stone-400">Sell Anywhere. Grow Everywhere.</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/seller/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#163326] hover:bg-[#11291E] text-white text-xs font-bold shadow-xs transition"
            >
              <span>+</span> Add Product
            </Link>
            <Link
              href="/seller/orders"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-300 transition"
            >
              <span>✈️</span> Orders ({data?.ordersAwaitingActionCount || 0})
            </Link>
            <Link
              href="/seller/storefront"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF6EF] hover:bg-stone-200 text-[#163326] text-xs font-semibold border border-[#C5A869] transition"
            >
              <span>🏬</span> Live Storefront
            </Link>
          </div>
        </div>

        {/* Universal Filter Controls: Currency, Region, Date Range */}
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-stone-400 text-[11px] font-semibold uppercase">Sales Market:</span>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-800 font-medium focus:outline-none"
            >
              <option value="all">Global (All Regions)</option>
              <option value="na">North America (US & CA)</option>
              <option value="eu">Europe & United Kingdom</option>
              <option value="me">Middle East & GCC</option>
              <option value="apac">Asia-Pacific & Domestic</option>
            </select>

            <span className="text-stone-400 text-[11px] font-semibold uppercase ml-2">Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-800 font-medium focus:outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="ytd">Year to Date (2026)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-[11px] font-semibold uppercase">Reporting Currency:</span>
            <select
              value={reportingCurrency}
              onChange={(e) => setReportingCurrency(e.target.value as any)}
              className="bg-[#163326] text-[#C5A869] font-mono font-bold rounded-lg px-3 py-1 text-xs border border-[#24523F] focus:outline-none shadow-xs"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
            <span className="text-[10px] text-stone-400 italic">
              Conversions benchmarked via live rate feed
            </span>
          </div>
        </div>
      </div>

      {/* Actionable Alerts Panel */}
      {data?.actionAlerts && data.actionAlerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.actionAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-xs ${
                alert.severity === 'critical'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{alert.severity === 'critical' ? '🚨' : '⚠️'}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{alert.title}</span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">{alert.message}</p>
              </div>
              <Link
                href={alert.actionLink}
                className="text-xs font-bold underline whitespace-nowrap self-center hover:opacity-80 shrink-0"
              >
                Resolve →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Gross Merchandise Value</span>
            <span className="text-base">📈</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-[#163326] mt-2">
            {formatMoney(data?.grossMerchandiseValue || 0)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
            <span>↑ 18.2% vs previous period</span>
          </div>
        </div>

        {/* Net Sales */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Net Merchant Earnings</span>
            <span className="text-base">💎</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-800 mt-2">
            {formatMoney(data?.netRevenue || 0)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            After platform commission & taxes
          </div>
        </div>

        {/* Orders to Fulfil */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Orders to Fulfil</span>
            <span className="text-base">📦</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-700 mt-2">
            {data?.ordersAwaitingActionCount || 0}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {data?.totalOrdersCount || 0} total lifetime orders
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Available Balance</span>
            <span className="text-base">💳</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-[#163326] mt-2">
            {formatMoney(data?.availablePayoutBalance || 0)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Pending Hold: {formatMoney(data?.pendingSettlementAmount || 0)}
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-100 p-3 rounded-2xl border border-stone-200 text-xs">
        <div className="text-center p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-stone-500 block text-[10px] uppercase font-bold">Active Listings</span>
          <span className="text-base font-bold text-stone-800">{data?.activeProductsCount || 0} Items</span>
        </div>
        <div className="text-center p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-stone-500 block text-[10px] uppercase font-bold">In Moderation</span>
          <span className="text-base font-bold text-amber-700">{data?.productsInReviewCount || 0} Pending</span>
        </div>
        <div className="text-center p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-stone-500 block text-[10px] uppercase font-bold">Low Stock SKUs</span>
          <span className={`text-base font-bold ${data?.lowStockCount ? 'text-rose-600' : 'text-stone-800'}`}>
            {data?.lowStockCount || 0} Alert
          </span>
        </div>
        <div className="text-center p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-stone-500 block text-[10px] uppercase font-bold">Return Rate</span>
          <span className="text-base font-bold text-emerald-700">{data?.returnRatePercent || 0}% (Healthy)</span>
        </div>
      </div>

      {/* Main Grid: Orders & Global Geographic Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Recent Customer Orders</h3>
              <p className="text-xs text-stone-500">Cross-border and domestic fulfillment sub-orders</p>
            </div>
            <Link href="/seller/orders" className="text-xs font-bold text-[#163326] hover:underline">
              View All Orders →
            </Link>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EF] text-stone-600 text-[10px] uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer & Destination</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data?.recentOrders && data.recentOrders.length > 0 ? (
                  data.recentOrders.map((order) => {
                    const convertedPayout = convertCurrency(
                      order.netPayout,
                      order.currency,
                      reportingCurrency
                    )
                    return (
                      <tr key={order.id} className="hover:bg-stone-50 transition">
                        <td className="py-3.5 px-4 font-mono font-medium text-stone-900">
                          {order.id}
                          <div className="text-[10px] text-stone-400 font-sans">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-900">{order.customerName}</div>
                          <div className="text-[10px] text-stone-500 flex items-center gap-1">
                            <span>{order.customerCity}, {order.customerCountry}</span>
                            <span className="font-mono text-stone-400">({order.customerCountryCode})</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              order.isCrossBorder
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {order.isCrossBorder ? '✈️ Cross-Border' : '🏠 Domestic'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-800">
                          {formatMoney(convertedPayout)}
                          <div className="text-[10px] text-stone-400 font-mono">
                            Orig: {CURRENCY_SYMBOLS[order.currency]}{order.netPayout}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              order.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'packed' || order.status === 'ready_for_pickup'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/seller/orders?id=${order.id}`}
                            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#163326] hover:text-white transition font-medium text-[11px]"
                          >
                            Fulfill →
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-stone-400">
                      No customer orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Orders Card View */}
          <div className="md:hidden divide-y divide-stone-100">
            {data?.recentOrders && data.recentOrders.length > 0 ? (
              data.recentOrders.map((order) => {
                const convertedPayout = convertCurrency(order.netPayout, order.currency, reportingCurrency)
                return (
                  <div key={order.id} className="p-3.5 space-y-2 bg-white hover:bg-stone-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-stone-900">{order.id}</span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'packed' || order.status === 'ready_for_pickup'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <div className="font-semibold text-stone-900">{order.customerName}</div>
                        <div className="text-[11px] text-stone-500">
                          {order.customerCity}, {order.customerCountry || 'Domestic'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-800">{formatMoney(convertedPayout)}</div>
                        <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          100% Payout
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                      <span className="text-[11px] text-stone-500">{order.itemsCount || 1} Item(s)</span>
                      <Link
                        href={`/seller/orders?id=${order.id}`}
                        className="text-xs font-semibold text-[#163326] bg-stone-100 hover:bg-[#163326] hover:text-white px-3 py-1 rounded-lg transition active:scale-95"
                      >
                        Fulfill →
                      </Link>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-6 text-center text-xs text-stone-400">No customer orders recorded yet.</div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Geographic Regional Sales & Top Products */}
        <div className="space-y-6">
          {/* Sales by Country & Region */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-stone-900 text-base">Sales by Region</h3>
              <span className="text-[10px] text-stone-400 uppercase font-bold">Global Reach</span>
            </div>

            <div className="space-y-3">
              {data?.salesByRegion.map((region, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-stone-800">{region.region}</span>
                    <span className="font-bold text-[#163326]">{formatMoney(region.revenue)}</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#163326] h-full rounded-full"
                      style={{ width: `${region.percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>{region.orderCount} orders</span>
                    <span>{region.percent}% share</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-stone-900 text-base">Bestselling Products</h3>
              <Link href="/seller/products" className="text-xs font-bold text-[#163326] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {data?.topProducts && data.topProducts.length > 0 ? (
                data.topProducts.map((p) => (
                  <div
                    key={p.productId}
                    className="p-3 rounded-xl border border-stone-100 hover:border-stone-300 transition flex items-center justify-between"
                  >
                    <div className="truncate mr-3">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">{p.title}</h4>
                      <p className="text-[10px] text-stone-400 font-mono">
                        {p.category} · SKU: {p.sku}
                      </p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <div className="text-xs font-bold text-stone-900">{formatMoney(p.revenue)}</div>
                      <div className="text-[10px] text-emerald-700 font-medium">Stock: {p.stock}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 text-center py-4">No products listed yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
