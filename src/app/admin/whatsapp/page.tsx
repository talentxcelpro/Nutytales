'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  WhatsAppAnalyticsOverview,
  WhatsAppConversation,
  WhatsAppMessage,
  WhatsAppCampaign,
  WhatsAppConversationStatus,
} from '@/lib/whatsapp/types'
import { BusinessPerformanceMetrics } from '@/lib/whatsapp/analytics'
import { ProviderHealthCheck } from '@/lib/whatsapp/provider'

type ActiveTab = 'overview' | 'inbox' | 'campaigns' | 'contacts' | 'automations' | 'settings'

export default function AdminWhatsAppCommerceOSPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')
  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | '7d' | '30d' | 'all'>('30d')
  const [loading, setLoading] = useState(true)

  // Telemetry & State
  const [overview, setOverview] = useState<WhatsAppAnalyticsOverview | null>(null)
  const [performance, setPerformance] = useState<BusinessPerformanceMetrics | null>(null)
  const [providerHealth, setProviderHealth] = useState<ProviderHealthCheck | null>(null)

  // Inbox State
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<WhatsAppConversation | null>(null)
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [inboxStatusFilter, setInboxStatusFilter] = useState<'ALL' | 'OPEN' | 'AI_ACTIVE' | 'HUMAN_TAKEOVER' | 'RESOLVED'>('ALL')

  // Campaigns State
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([])
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false)
  const [campaignName, setCampaignName] = useState('')
  const [campaignCategory, setCampaignCategory] = useState('dry_fruits_nuts')
  const [campaignSegment, setCampaignSegment] = useState('all_opted_in')
  const [campaignTemplate, setCampaignTemplate] = useState('repeat_purchase_v1')
  const [audiencePreview, setAudiencePreview] = useState<any>(null)
  const [creatingCampaign, setCreatingCampaign] = useState(false)

  // Load Overview Data
  useEffect(() => {
    fetchOverview()
    fetchConversations()
    fetchCampaigns()
  }, [dateRange])

  const fetchOverview = async () => {
    try {
      const res = await fetch(`/api/admin/whatsapp/overview?range=${dateRange}`)
      const data = await res.json()
      if (data.success) {
        setOverview(data.overview)
        setPerformance(data.businessPerformance)
        setProviderHealth(data.providerHealth)
      }
    } catch (err) {
      console.error('Failed loading WhatsApp overview:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/admin/whatsapp/conversations')
      const data = await res.json()
      if (data.success) {
        setConversations(data.conversations || [])
        if (!selectedConversation && data.conversations?.length > 0) {
          selectConversation(data.conversations[0])
        }
      }
    } catch (err) {
      console.error('Failed loading conversations:', err)
    }
  }

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/admin/whatsapp/campaigns')
      const data = await res.json()
      if (data.success) {
        setCampaigns(data.campaigns || [])
      }
    } catch (err) {
      console.error('Failed loading campaigns:', err)
    }
  }

  const selectConversation = async (conv: WhatsAppConversation) => {
    setSelectedConversation(conv)
    try {
      const res = await fetch(`/api/admin/whatsapp/conversations?conversationId=${conv.id}`)
      const data = await res.json()
      if (data.success) {
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Failed loading messages:', err)
    }
  }

  const handleSendAgentReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedConversation) return

    setSendingReply(true)
    try {
      const res = await fetch('/api/admin/whatsapp/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          conversationId: selectedConversation.id,
          contactId: selectedConversation.contactId,
          text: replyText.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setReplyText('')
        // Refresh message thread
        selectConversation(selectedConversation)
        fetchConversations()
      }
    } catch (err) {
      console.error('Failed sending message:', err)
    } finally {
      setSendingReply(false)
    }
  }

  const handleUpdateConversationStatus = async (status: WhatsAppConversationStatus) => {
    if (!selectedConversation) return
    try {
      await fetch('/api/admin/whatsapp/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          conversationId: selectedConversation.id,
          status,
        }),
      })
      setSelectedConversation({ ...selectedConversation, status })
      fetchConversations()
    } catch (err) {
      console.error('Failed updating status:', err)
    }
  }

  const handlePreviewAudience = async () => {
    try {
      const res = await fetch('/api/admin/whatsapp/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'preview_audience',
          targetSegment: campaignSegment,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setAudiencePreview(data.preview)
      }
    } catch (err) {
      console.error('Failed previewing audience:', err)
    }
  }

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!campaignName.trim()) return

    setCreatingCampaign(true)
    try {
      const res = await fetch('/api/admin/whatsapp/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_campaign',
          name: campaignName.trim(),
          category: campaignCategory,
          targetSegment: campaignSegment,
          templateName: campaignTemplate,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowNewCampaignModal(false)
        setCampaignName('')
        setAudiencePreview(null)
        fetchCampaigns()
      }
    } catch (err) {
      console.error('Failed creating campaign:', err)
    } finally {
      setCreatingCampaign(false)
    }
  }

  const handleExecuteCampaign = async (campaignId: string) => {
    if (!confirm('Execute this WhatsApp promotional broadcast to opted-in customers now?')) return
    try {
      const res = await fetch('/api/admin/whatsapp/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute_campaign',
          campaignId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        alert(`Campaign Dispatched! Sent: ${data.result.dispatchedCount}, Failed: ${data.result.failedCount}`)
        fetchCampaigns()
        fetchOverview()
      }
    } catch (err) {
      console.error('Failed executing campaign:', err)
    }
  }

  const filteredConversations = conversations.filter((c) => {
    if (inboxStatusFilter === 'ALL') return true
    return c.status === inboxStatusFilter
  })

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#17233B] pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── Top Header Bar ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-300 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NUTY TALES WHATSAPP COMMERCE OS</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
              WhatsApp Command &amp; Conversational Commerce
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Meta Cloud API operations, automated order confirmations, AI shopping concierge, and revenue telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Date Range Selector */}
            <div className="bg-white border border-stone-300 rounded-xl p-1 flex shadow-sm">
              {(['today', '7d', '30d', 'all'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    dateRange === r ? 'bg-[#17233B] text-[#C9A45C]' : 'text-stone-600 hover:text-black'
                  }`}
                >
                  {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'All Time'}
                </button>
              ))}
            </div>

            <a
              href="/api/admin/whatsapp/export"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-xl font-bold hover:bg-stone-50 shadow-sm flex items-center gap-1.5"
            >
              <span>📥</span> Export CSV
            </a>

            <Link
              href="/admin/revenue-os"
              className="px-4 py-2 bg-[#17233B] text-white rounded-xl font-bold hover:bg-[#203050] shadow-sm flex items-center gap-1.5"
            >
              <span>📊</span> Revenue OS ↗
            </Link>
          </div>
        </div>

        {/* ── Sub-Navigation Tabs ── */}
        <div className="flex border-b border-stone-300 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#C9A45C] text-[#17233B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>📈</span> Overview &amp; ROI
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              activeTab === 'inbox'
                ? 'border-[#C9A45C] text-[#17233B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>💬</span> Live Inbox
            {conversations.some((c) => c.unreadCount > 0) && (
              <span className="px-1.5 py-0.5 text-[10px] bg-emerald-600 text-white rounded-full">
                {conversations.filter((c) => c.unreadCount > 0).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              activeTab === 'campaigns'
                ? 'border-[#C9A45C] text-[#17233B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>📢</span> Campaigns
          </button>
          <button
            onClick={() => setActiveTab('automations')}
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              activeTab === 'automations'
                ? 'border-[#C9A45C] text-[#17233B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>⚡</span> Commerce Automations
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              activeTab === 'settings'
                ? 'border-[#C9A45C] text-[#17233B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>⚙️</span> Provider &amp; Meta Settings
          </button>
        </div>

        {/* ── TAB 1: OVERVIEW & TELEMETRY ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* ₹10 Lakh Monthly Sales Objective Progress Bar */}
            <div className="bg-[#17233B] text-white p-6 rounded-2xl shadow-md border border-stone-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#C9A45C] uppercase">
                    Commercial Growth Target
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif">
                    ₹10 Lakh Monthly Sales Acceleration
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#C9A45C]">
                    ₹{(performance?.whatsappAttributedSales || 0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-stone-300">
                    of ₹10,00,000 Target ({performance?.targetProgressPercent || 0}%)
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#C9A45C] to-emerald-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(3, performance?.targetProgressPercent || 0))}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-stone-800/80 text-stone-300">
                <div>
                  <span className="text-stone-400 block">Avg Order Value (AOV):</span>
                  <strong className="text-white">₹{(performance?.averageOrderValue || 0).toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">Lead Conversion:</span>
                  <strong className="text-white">{performance?.leadToOrderConversionRate || 0}%</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">Cost / Acquired Buyer:</span>
                  <strong className="text-white">₹{performance?.costPerAcquiredCustomer || 0}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">ROI Multiple:</span>
                  <strong className="text-emerald-400 font-bold">{overview?.roiMultiple || 0}x</strong>
                </div>
              </div>
            </div>

            {/* Core KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
                <span className="text-xs font-medium text-stone-500">Total WhatsApp Contacts</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#17233B]">
                  {overview?.totalContacts || 0}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Verified phone identities</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
                <span className="text-xs font-medium text-stone-500">Delivered Messages</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#17233B]">
                  {overview?.deliveredMessages || 0}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">
                  {overview?.deliveryRatePercent || 100}% Delivery Rate
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
                <span className="text-xs font-medium text-stone-500">Orders Attributed</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#17233B]">
                  {overview?.ordersAttributed || 0}
                </div>
                <span className="text-[11px] text-[#C9A45C] font-bold">Via notifications &amp; recovery</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
                <span className="text-xs font-medium text-stone-500">WhatsApp Sales (₹)</span>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
                  ₹{(overview?.revenueAttributed || 0).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-stone-500">
                  Cost: ₹{(overview?.estimatedCosts || 0).toFixed(0)}
                </span>
              </div>
            </div>

            {/* Operational Health & Active Automations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Provider Status */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base flex items-center gap-2">
                    <span>📡</span> Provider Connectivity
                  </h4>
                  <span
                    className={`px-2.5 py-1 text-xs rounded-full font-bold uppercase ${
                      providerHealth?.status === 'ONLINE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {providerHealth?.status || 'ONLINE'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span>Active Adapter:</span>
                    <strong className="text-stone-900">{providerHealth?.provider || 'meta_cloud_api'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span>Phone Number ID:</span>
                    <span className="font-mono text-stone-700">{providerHealth?.phoneNumberId || 'Pending Env Config'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span>Display Phone:</span>
                    <strong className="text-stone-900">{providerHealth?.displayPhoneNumber || '+91 97171 61809'}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Status Message:</span>
                    <span className="text-stone-500">{providerHealth?.message || 'Meta Cloud API ready'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition"
                  >
                    Configure Meta Business Credentials →
                  </button>
                </div>
              </div>

              {/* Quick Actions & AI Assistant Status */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base flex items-center gap-2">
                    <span>🤖</span> AI Concierge &amp; Human Handover
                  </h4>
                  <span className="px-2.5 py-1 text-xs rounded-full font-bold bg-emerald-100 text-emerald-800">
                    ACTIVE
                  </span>
                </div>

                <p className="text-xs text-stone-600">
                  Nuty Tales AI is actively responding to bilingual enquiries (English &amp; Hindi), quoting real catalogue prices from <code>products-data.ts</code>, and qualifying wedding hampers.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-stone-50 rounded-xl flex items-center justify-between">
                    <span>Human Escalation Trigger:</span>
                    <span className="font-bold text-amber-700">Keyword "Agent" or Grievance</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl flex items-center justify-between">
                    <span>Catalogue Grounding:</span>
                    <span className="font-bold text-emerald-700">25 Products + B2B Tiers</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('inbox')}
                  className="w-full py-2 bg-[#17233B] hover:bg-[#203050] text-[#C9A45C] rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Open Live Team Inbox ({conversations.length} Threads) →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: UNIFIED LIVE INBOX ── */}
        {activeTab === 'inbox' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
            {/* Left Column: Conversation List */}
            <div className="md:col-span-4 border-r border-stone-200 flex flex-col">
              {/* Inbox Header & Filters */}
              <div className="p-4 border-b border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#17233B]">Customer Conversations</h3>
                  <span className="text-xs text-stone-400">{filteredConversations.length} total</span>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1.5 overflow-x-auto text-[11px] pb-1">
                  {(['ALL', 'OPEN', 'AI_ACTIVE', 'HUMAN_TAKEOVER', 'RESOLVED'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setInboxStatusFilter(s)}
                      className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition ${
                        inboxStatusFilter === s
                          ? 'bg-[#17233B] text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Threads List */}
              <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400">
                    No active conversations match this filter.
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const isSelected = selectedConversation?.id === conv.id
                    return (
                      <button
                        key={conv.id}
                        onClick={() => selectConversation(conv)}
                        className={`w-full p-4 text-left transition flex flex-col gap-1.5 ${
                          isSelected ? 'bg-amber-50/70 border-l-4 border-[#C9A45C]' : 'hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#17233B] truncate">
                            {conv.contact?.name || 'Valued Customer'}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-stone-500">
                          {conv.contact?.formattedPhone || conv.contact?.phoneNumber}
                        </span>

                        <p className="text-xs text-stone-600 line-clamp-1">
                          {conv.lastMessagePreview || 'New interaction started'}
                        </p>

                        <div className="flex items-center gap-1.5 pt-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              conv.status === 'HUMAN_TAKEOVER'
                                ? 'bg-rose-100 text-rose-800'
                                : conv.status === 'AI_ACTIVE'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {conv.status.replace('_', ' ')}
                          </span>

                          {conv.contact?.segment && (
                            <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[9px]">
                              {conv.contact.segment.replace('_', ' ')}
                            </span>
                          )}

                          {conv.unreadCount > 0 && (
                            <span className="ml-auto px-1.5 py-0.5 bg-emerald-600 text-white rounded-full text-[9px] font-bold">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Right Column: Chat Window & Customer Drawer */}
            <div className="md:col-span-8 flex flex-col h-full bg-stone-50/50">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#17233B]">
                          {selectedConversation.contact?.name || 'Valued Customer'}
                        </h4>
                        <span className="text-xs text-stone-500 font-mono">
                          {selectedConversation.contact?.phoneNumber}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500">
                        Total Orders: {selectedConversation.contact?.totalOrders || 0} (₹
                        {(selectedConversation.contact?.totalSpend || 0).toLocaleString('en-IN')}) · Consent:{' '}
                        <strong className="text-emerald-700">
                          {selectedConversation.contact?.consentStatus || 'PENDING'}
                        </strong>
                      </span>
                    </div>

                    {/* Mode Toggle Controls */}
                    <div className="flex items-center gap-2 text-xs">
                      {selectedConversation.status === 'HUMAN_TAKEOVER' ? (
                        <button
                          onClick={() => handleUpdateConversationStatus('AI_ACTIVE')}
                          className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-bold hover:bg-blue-100"
                        >
                          Handover to AI Assistant 🤖
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateConversationStatus('HUMAN_TAKEOVER')}
                          className="px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg font-bold hover:bg-rose-100"
                        >
                          Take Over Conversation 👨‍💼
                        </button>
                      )}

                      <button
                        onClick={() => handleUpdateConversationStatus('RESOLVED')}
                        className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg font-bold hover:bg-stone-200"
                      >
                        Mark Resolved ✓
                      </button>
                    </div>
                  </div>

                  {/* Messages Timeline */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-xs text-stone-400 py-12">
                        No previous messages in this conversation.
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isInbound = msg.direction === 'INBOUND'
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isInbound ? 'items-start' : 'items-end'}`}
                          >
                            <span className="text-[10px] text-stone-400 mb-1 px-1">
                              {msg.senderName || (isInbound ? 'Customer' : 'Nuty Tales')} ·{' '}
                              {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>

                            <div
                              className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm whitespace-pre-line ${
                                isInbound
                                  ? 'bg-white text-stone-800 rounded-tl-sm border border-stone-200'
                                  : msg.senderType === 'AI'
                                  ? 'bg-[#17233B] text-[#F7F2E8] rounded-tr-sm'
                                  : 'bg-[#C9A45C] text-black font-medium rounded-tr-sm'
                              }`}
                            >
                              {msg.body}

                              {/* Message Delivery Status Ticks */}
                              {!isInbound && (
                                <div className="text-[9px] text-right mt-1 text-stone-300">
                                  {msg.deliveryStatus === 'READ'
                                    ? '✓✓ Read'
                                    : msg.deliveryStatus === 'DELIVERED'
                                    ? '✓✓ Delivered'
                                    : msg.deliveryStatus === 'FAILED'
                                    ? '⚠️ Failed'
                                    : '✓ Sent'}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Reply Composer */}
                  <form onSubmit={handleSendAgentReply} className="p-4 bg-white border-t border-stone-200 flex gap-3">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type a human response or template notice..."
                      className="flex-1 px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A45C]"
                    />
                    <button
                      type="submit"
                      disabled={sendingReply || !replyText.trim()}
                      className="px-6 py-2.5 bg-[#17233B] hover:bg-[#203050] text-[#C9A45C] rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
                    >
                      {sendingReply ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-stone-400">
                  Select a conversation from the left drawer to view messages.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: CAMPAIGN MANAGER ── */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#17233B]">WhatsApp Promotional Campaigns</h3>
                <p className="text-xs text-stone-600">
                  Launch targeted dry fruit restock nudges and seasonal campaigns with strict opt-out suppression.
                </p>
              </div>
              <button
                onClick={() => setShowNewCampaignModal(true)}
                className="px-4 py-2 bg-[#17233B] hover:bg-[#203050] text-[#C9A45C] rounded-xl text-xs font-bold transition shadow-sm"
              >
                + New Campaign
              </button>
            </div>

            {/* Campaigns Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Campaign Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Target Segment</th>
                    <th className="p-4">Audience</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Cost / Revenue</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {campaigns.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-stone-400">
                        No campaigns created yet. Click "+ New Campaign" to draft your first broadcast.
                      </td>
                    </tr>
                  ) : (
                    campaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-stone-50/70">
                        <td className="p-4 font-bold text-[#17233B]">{camp.name}</td>
                        <td className="p-4 text-stone-600 capitalize">{camp.category.replace(/_/g, ' ')}</td>
                        <td className="p-4 font-mono text-[11px] text-stone-600">{camp.targetSegment}</td>
                        <td className="p-4">{camp.audienceCount} contacts</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              camp.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : camp.status === 'RUNNING'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {camp.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>Est: ₹{camp.estimatedCost}</div>
                          <div className="font-bold text-emerald-700">Rev: ₹{camp.totalRevenueAttributed}</div>
                        </td>
                        <td className="p-4 text-right">
                          {camp.status === 'DRAFT' && (
                            <button
                              onClick={() => handleExecuteCampaign(camp.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                            >
                              Dispatch Now 🚀
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* New Campaign Creation Modal */}
            {showNewCampaignModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h4 className="font-bold text-base text-[#17233B]">Create WhatsApp Promotional Campaign</h4>
                    <button
                      onClick={() => setShowNewCampaignModal(false)}
                      className="text-stone-400 hover:text-stone-700 text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold block text-stone-700 mb-1">Campaign Name</label>
                      <input
                        type="text"
                        required
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="e.g. Kashmiri Mamra Badam Fresh Harvest Launch"
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A45C]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold block text-stone-700 mb-1">Category</label>
                        <select
                          value={campaignCategory}
                          onChange={(e) => setCampaignCategory(e.target.value)}
                          className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                        >
                          <option value="dry_fruits_nuts">Dry Fruits &amp; Nuts</option>
                          <option value="kashmiri_products">Kashmiri Products</option>
                          <option value="wedding_hampers">Wedding Hampers</option>
                          <option value="seasonal_promotion">Seasonal Promotion</option>
                          <option value="repeat_purchase">Repeat Purchase</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold block text-stone-700 mb-1">Target Segment</label>
                        <select
                          value={campaignSegment}
                          onChange={(e) => setCampaignSegment(e.target.value)}
                          className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                        >
                          <option value="all_opted_in">All Opted-In Customers</option>
                          <option value="repeat_customer">Repeat Buyers</option>
                          <option value="first_time_buyer">First-Time Buyers</option>
                          <option value="high_value">High-Value (₹5000+)</option>
                          <option value="abandoned_checkout">Abandoned Checkouts</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold block text-stone-700 mb-1">Approved Template</label>
                      <select
                        value={campaignTemplate}
                        onChange={(e) => setCampaignTemplate(e.target.value)}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      >
                        <option value="repeat_purchase_v1">repeat_purchase_v1 (Restock Reminder)</option>
                        <option value="abandoned_cart_v1">abandoned_cart_v1 (Cart Recovery with 10% Off)</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handlePreviewAudience}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold"
                      >
                        Preview Audience &amp; Cost 🔍
                      </button>

                      {audiencePreview && (
                        <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                          <div className="flex justify-between">
                            <span>Eligible (Opted-In):</span>
                            <strong className="text-emerald-700">{audiencePreview.eligibleOptedInCount} contacts</strong>
                          </div>
                          <div className="flex justify-between text-stone-500">
                            <span>Suppressed (Opted-Out):</span>
                            <span>{audiencePreview.suppressedOptOutCount} excluded</span>
                          </div>
                          <div className="flex justify-between border-t border-stone-200 pt-1 font-bold">
                            <span>Estimated Meta Cost:</span>
                            <span>₹{audiencePreview.estimatedCostInr}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setShowNewCampaignModal(false)}
                        className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={creatingCampaign}
                        className="px-6 py-2 bg-[#17233B] hover:bg-[#203050] text-[#C9A45C] rounded-xl font-bold transition shadow-sm disabled:opacity-50"
                      >
                        {creatingCampaign ? 'Saving...' : 'Save Campaign'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: COMMERCE AUTOMATIONS ── */}
        {activeTab === 'automations' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-[#17233B]">Event-Driven Commerce Automation Workflows</h3>
              <p className="text-xs text-stone-600">
                Idempotent transaction triggers connected directly to checkout, verified Razorpay webhooks, and courier dispatches.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                {
                  title: 'Order Confirmation',
                  trigger: 'POST /api/orders (Verified Order)',
                  template: 'order_confirmation_v1',
                  category: 'UTILITY',
                  status: 'Active · Non-Blocking',
                  desc: 'Dispatches instant order summary and shipment tracking link.',
                },
                {
                  title: 'Payment Receipt',
                  trigger: 'Razorpay HMAC-SHA256 Signature',
                  template: 'payment_received_v1',
                  category: 'UTILITY',
                  status: 'Active · Cryptographic',
                  desc: 'Never trusts client redirect; validates server-side webhook.',
                },
                {
                  title: 'Courier Dispatch Notice',
                  trigger: 'Fulfillment AWB Assigned',
                  template: 'order_dispatched_v1',
                  category: 'UTILITY',
                  status: 'Active',
                  desc: 'Sends tracking URL and estimated delivery window.',
                },
                {
                  title: 'Delivery & Review Request',
                  trigger: 'Delivered Callback + 2 Hours',
                  template: 'delivery_feedback_v1',
                  category: 'UTILITY',
                  status: 'Active',
                  desc: 'Gathers customer ratings and routes issues to concierge.',
                },
                {
                  title: 'Abandoned Cart Recovery',
                  trigger: 'Cart Inactive 60 Min',
                  template: 'abandoned_cart_v1',
                  category: 'MARKETING',
                  status: 'Active · Consent Required',
                  desc: 'Sends single reminder with code NUTY10; suppressed after purchase.',
                },
                {
                  title: '30-Day Fresh Restock Nudge',
                  trigger: 'Customer Last Order + 30 Days',
                  template: 'repeat_purchase_v1',
                  category: 'MARKETING',
                  status: 'Active',
                  desc: 'Recommends previous dry fruit selections for routine re-ordering.',
                },
              ].map((auto, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#17233B]">{auto.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {auto.status}
                    </span>
                  </div>
                  <p className="text-stone-600">{auto.desc}</p>
                  <div className="p-3 bg-stone-50 rounded-xl space-y-1 font-mono text-[11px] text-stone-500">
                    <div>Trigger: {auto.trigger}</div>
                    <div>Template: {auto.template} ({auto.category})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: SETTINGS & META BUSINESS CREDENTIALS ── */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-xs">
            <div>
              <h3 className="font-bold text-lg text-[#17233B]">Official Meta WhatsApp Business Cloud API Configuration</h3>
              <p className="text-stone-600">
                Configure your Meta Graph API credentials to switch from Mock Sandbox to live production delivery.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <strong className="text-amber-900 block font-bold">🔒 Zero-Secrets-in-Frontend Architecture</strong>
              <p className="text-amber-800 text-[11px]">
                Credentials must be set exclusively in server-side environment variables (Vercel Project Settings or <code>.env.local</code>). Never hardcode access tokens into source code or git repositories.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm text-stone-800 border-b border-stone-200 pb-2">Required Server Environment Variables</h4>

              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-3 bg-stone-50 rounded-xl flex flex-col gap-1">
                  <strong className="text-stone-800">META_WHATSAPP_PHONE_NUMBER_ID</strong>
                  <span className="text-stone-500">Found in Meta App Dashboard &gt; WhatsApp &gt; API Setup &gt; Phone number ID</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl flex flex-col gap-1">
                  <strong className="text-stone-800">META_WHATSAPP_BUSINESS_ACCOUNT_ID</strong>
                  <span className="text-stone-500">WhatsApp Business Account ID (WABA ID) for template management</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl flex flex-col gap-1">
                  <strong className="text-stone-800">META_WHATSAPP_ACCESS_TOKEN</strong>
                  <span className="text-stone-500">System User Permanent Access Token with <code>whatsapp_business_messaging</code> permissions</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl flex flex-col gap-1">
                  <strong className="text-stone-800">META_APP_SECRET</strong>
                  <span className="text-stone-500">Used to cryptographically verify <code>x-hub-signature-256</code> on incoming webhooks</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl flex flex-col gap-1">
                  <strong className="text-stone-800">META_WHATSAPP_WEBHOOK_VERIFY_TOKEN</strong>
                  <span className="text-stone-500">Custom string (default: <code>nutytales_meta_verify_2026</code>) entered in Meta Webhook Callback URL configuration</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
                <strong>Webhook Callback URL for Meta Dashboard:</strong>
                <code className="block bg-white p-2 rounded border border-emerald-300 font-bold select-all">
                  https://nutytales.com/api/whatsapp/webhook
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
