'use client'

import React, { useState, useEffect } from 'react'
import { BlockedDateRange, IcalFeedSubscription } from '@/lib/stays/ical-sync'

interface StayIcalSyncModalProps {
  propertySlug: string
  propertyName: string
  isOpen: boolean
  onClose: () => void
}

export default function StayIcalSyncModal({
  propertySlug,
  propertyName,
  isOpen,
  onClose,
}: StayIcalSyncModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export')
  const [copied, setCopied] = useState(false)
  
  // Import state
  const [icalUrl, setIcalUrl] = useState('')
  const [sourceName, setSourceName] = useState<'airbnb' | 'booking' | 'vrbo' | 'google' | 'custom'>('airbnb')
  const [isSyncing, setIsSyncing] = useState(false)
  const [importResult, setImportResult] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Status state
  const [blockedDates, setBlockedDates] = useState<BlockedDateRange[]>([])
  const [subscriptions, setSubscriptions] = useState<IcalFeedSubscription[]>([])

  // Base domain
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nutytales.com'
  const exportUrl = `${baseUrl}/api/stays/ical/export?slug=${encodeURIComponent(propertySlug)}`

  // Fetch current sync status
  useEffect(() => {
    if (!isOpen) return

    fetch(`/api/stays/ical/import?slug=${encodeURIComponent(propertySlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlockedDates(data.blockedDates || [])
          setSubscriptions(data.subscriptions || [])
        }
      })
      .catch(() => {})
  }, [isOpen, propertySlug])

  const handleCopyExportUrl = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(exportUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleImportFeed = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!icalUrl.trim()) return

    setIsSyncing(true)
    setErrorMessage(null)
    setImportResult(null)

    try {
      const res = await fetch('/api/stays/ical/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertySlug,
          icalUrl: icalUrl.trim(),
          sourceName,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setImportResult(data.message || 'Calendar successfully synchronized!')
        if (data.blockedRanges) {
          setBlockedDates(data.blockedRanges)
        }
        setIcalUrl('')
      } else {
        setErrorMessage(data.error || 'Failed to import iCal feed. Please verify the URL.')
      }
    } catch {
      setErrorMessage('Network error while synchronizing calendar.')
    } finally {
      setIsSyncing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl border border-[#E7E2D9] shadow-2xl overflow-hidden animate-fadeIn space-y-5 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-stone-100 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#176B68] tracking-widest block">
              Two-Way Channel Sync
            </span>
            <h3 className="font-serif font-bold text-xl text-[#17233B]">
              Calendar Sync &amp; Double-Booking Shield
            </h3>
            <p className="text-xs text-stone-500">{propertyName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-black text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-1 bg-[#FAF8F5] rounded-xl border border-stone-200 flex text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'export'
                ? 'bg-[#17233B] text-white shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            Export to Airbnb / Booking.com
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'import'
                ? 'bg-[#17233B] text-white shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            Import External Feed
          </button>
        </div>

        {/* ── TAB 1: EXPORT ─────────────────────────────────────────────────── */}
        {activeTab === 'export' && (
          <div className="space-y-4 text-xs">
            <p className="text-stone-600 leading-relaxed">
              Export this residence&apos;s confirmed reservation calendar to external platforms. When a guest books on Nuty Tales, Airbnb and Booking.com will automatically block those dates within seconds.
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Your Unique RFC 5545 iCal Feed URL:
              </label>
              <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded-xl border border-stone-200">
                <input
                  type="text"
                  readOnly
                  value={exportUrl}
                  className="w-full bg-transparent text-stone-800 font-mono text-[11px] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyExportUrl}
                  className="px-3 py-1.5 bg-[#17233B] hover:bg-[#1E3048] text-white font-bold rounded-lg flex-shrink-0"
                >
                  {copied ? 'Copied!' : 'Copy Feed'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <strong className="block text-stone-900 font-bold text-xs">
                How to add this to Airbnb:
              </strong>
              <ol className="list-decimal list-inside space-y-1 text-stone-600 leading-relaxed text-[11px]">
                <li>Go to your <strong>Airbnb Host Calendar</strong> → Listing Settings.</li>
                <li>Scroll down to <strong>Pricing and Availability</strong> → <strong>Sync Calendars</strong>.</li>
                <li>Click <strong>Import Calendar</strong> and paste the Nuty Tales feed URL above.</li>
                <li>Name the calendar <strong>&ldquo;Nuty Tales Stays&rdquo;</strong>.</li>
              </ol>
            </div>

            <a
              href={exportUrl}
              download={`nutytales-${propertySlug}.ics`}
              className="inline-block text-[#176B68] font-bold text-xs hover:underline"
            >
              ↓ Download raw .ics file for offline calendar apps
            </a>
          </div>
        )}

        {/* ── TAB 2: IMPORT ─────────────────────────────────────────────────── */}
        {activeTab === 'import' && (
          <form onSubmit={handleImportFeed} className="space-y-4 text-xs">
            <p className="text-stone-600 leading-relaxed">
              Paste your external iCal feed from Airbnb, VRBO, or Booking.com. Nuty Tales will import all booked dates and instantly block them on our site to prevent double-booking.
            </p>

            {importResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold">
                ✓ {importResult}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-800 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Source Channel
                </label>
                <select
                  value={sourceName}
                  onChange={(e: any) => setSourceName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5]"
                >
                  <option value="airbnb">Airbnb</option>
                  <option value="booking">Booking.com</option>
                  <option value="vrbo">VRBO</option>
                  <option value="google">Google Calendar</option>
                  <option value="custom">Custom iCal (.ics)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  External iCal Feed URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.airbnb.com/calendar/ical/..."
                  value={icalUrl}
                  onChange={(e) => setIcalUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-xs font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSyncing}
              className="w-full py-3.5 bg-[#17233B] hover:bg-[#1E3048] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>{isSyncing ? 'Synchronizing Dates...' : 'Sync & Auto-Block Dates'}</span>
            </button>

            {/* Currently Blocked Syncs */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-stone-800 text-[11px] font-bold uppercase tracking-wider">
                  Active Channel Date Blocks ({blockedDates.length}):
                </strong>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5">
                {blockedDates.map((b) => (
                  <div
                    key={b.id}
                    className="p-2 bg-[#FAF8F5] rounded-xl border border-stone-200 flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-bold text-[#17233B] block">
                        {b.startDate} → {b.endDate}
                      </span>
                      <span className="text-stone-500 text-[10px]">{b.summary}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 font-bold uppercase text-[9px]">
                      {b.source}
                    </span>
                  </div>
                ))}
                {blockedDates.length === 0 && (
                  <p className="text-stone-400 italic text-xs">No external sync blocks registered yet.</p>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
