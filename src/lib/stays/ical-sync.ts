// ─── Nuty Tales Stays — RFC 5545 Two-Way iCal Synchronization ─────────────
// Exports authoritative .ics feeds for Airbnb/Booking.com/VRBO
// Imports and parses external .ics calendar feeds to prevent double-booking across platforms.

import { STAY_PROPERTIES } from '@/lib/stays-data'

export interface BlockedDateRange {
  id: string
  propertySlug: string
  startDate: string // YYYY-MM-DD (inclusive check-in)
  endDate: string // YYYY-MM-DD (exclusive check-out)
  source: 'airbnb' | 'booking' | 'vrbo' | 'google' | 'manual' | 'nutytales' | 'custom'
  summary: string
  uid: string
  createdAt: string
}

export interface IcalFeedSubscription {
  id: string
  propertySlug: string
  feedUrl: string
  sourceName: 'airbnb' | 'booking' | 'vrbo' | 'google' | 'custom'
  lastSyncedAt: string
  active: boolean
  eventsCount: number
}

// In-memory calendar feed subscriptions & blocked dates
const BLOCKED_DATES_STORE: BlockedDateRange[] = [
  // Seed an external Airbnb sync block for Harwan Orchard demonstration
  {
    id: 'block-airbnb-01',
    propertySlug: 'harwan-orchard-estate',
    startDate: '2026-11-20',
    endDate: '2026-11-24',
    source: 'airbnb',
    summary: 'Reserved via Airbnb (Sync ID #AB-88219)',
    uid: 'ab-harwan-88219@airbnb.com',
    createdAt: new Date().toISOString(),
  },
  // Seed an external Booking.com sync block for Solang Cedar Chalet
  {
    id: 'block-bcom-01',
    propertySlug: 'solang-cedar-chalet',
    startDate: '2026-12-28',
    endDate: '2027-01-03',
    source: 'booking',
    summary: 'Reserved via Booking.com (Peak New Year Buyout)',
    uid: 'bcom-solang-99410@booking.com',
    createdAt: new Date().toISOString(),
  },
  // Seed an external VRBO block for Villa Siolim Casa Grande
  {
    id: 'block-vrbo-01',
    propertySlug: 'villa-siolim-casa-grande',
    startDate: '2026-11-15',
    endDate: '2026-11-18',
    source: 'vrbo',
    summary: 'Reserved via VRBO (Sync ID #VRBO-4412)',
    uid: 'vrbo-siolim-4412@vrbo.com',
    createdAt: new Date().toISOString(),
  },
]

const ICAL_SUBSCRIPTIONS_STORE: IcalFeedSubscription[] = [
  {
    id: 'sub-01',
    propertySlug: 'harwan-orchard-estate',
    feedUrl: 'https://www.airbnb.com/calendar/ical/harwan-orchard-estate.ics',
    sourceName: 'airbnb',
    lastSyncedAt: new Date().toISOString(),
    active: true,
    eventsCount: 1,
  },
]

/**
 * Format a Date object to YYYYMMDD string for RFC 5545 VALUE=DATE format.
 */
function toIcalDate(dateStr: string): string {
  return dateStr.replace(/-/g, '')
}

/**
 * Parses an iCal date string (e.g., "20261110" or "20261110T120000Z") to "YYYY-MM-DD".
 */
export function parseIcalDateToIso(raw: string): string | null {
  if (!raw) return null
  const clean = raw.trim()
  // Look for 8 consecutive digits YYYYMMDD
  const match = clean.match(/(\d{4})(\d{2})(\d{2})/)
  if (!match) return null
  const [, year, month, day] = match
  return `${year}-${month}-${day}`
}

/**
 * Unfolds RFC 5545 lines (lines beginning with space or tab are continuation of previous line).
 */
function unfoldIcalLines(raw: string): string[] {
  const rawLines = raw.split(/\r?\n/)
  const unfolded: string[] = []

  for (const line of rawLines) {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (unfolded.length > 0) {
        unfolded[unfolded.length - 1] += line.slice(1)
      }
    } else if (line.trim().length > 0) {
      unfolded.push(line)
    }
  }

  return unfolded
}

/**
 * Strict RFC 5545 parser that extracts VEVENT blocks into structured date ranges.
 */
export function parseIcalContent(icsText: string): {
  startDate: string
  endDate: string
  summary: string
  uid: string
}[] {
  const lines = unfoldIcalLines(icsText)
  const events: { startDate: string; endDate: string; summary: string; uid: string }[] = []

  let inEvent = false
  let curStart = ''
  let curEnd = ''
  let curSummary = 'Reserved via External Channel'
  let curUid = ''

  for (const line of lines) {
    const [header, ...rest] = line.split(':')
    const value = rest.join(':').trim()
    const propName = header.split(';')[0].toUpperCase().trim()

    if (line.toUpperCase() === 'BEGIN:VEVENT') {
      inEvent = true
      curStart = ''
      curEnd = ''
      curSummary = 'Reserved via External Channel'
      curUid = `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    } else if (line.toUpperCase() === 'END:VEVENT') {
      if (inEvent && curStart && curEnd) {
        const startIso = parseIcalDateToIso(curStart)
        const endIso = parseIcalDateToIso(curEnd)
        if (startIso && endIso) {
          events.push({
            startDate: startIso,
            endDate: endIso,
            summary: curSummary,
            uid: curUid,
          })
        }
      }
      inEvent = false
    } else if (inEvent) {
      if (propName === 'DTSTART') {
        curStart = value
      } else if (propName === 'DTEND') {
        curEnd = value
      } else if (propName === 'SUMMARY') {
        curSummary = value || 'Reserved'
      } else if (propName === 'UID') {
        curUid = value
      }
    }
  }

  return events
}

/**
 * Generates an authoritative RFC 5545 .ics text export for a property.
 * Ready for ingestion by Airbnb, Booking.com, VRBO, or Google/Apple Calendar.
 */
export function generatePropertyIcalFeed(
  propertySlug: string,
  nutytalesBookings: { bookingRef: string; checkIn: string; checkOut: string; guestName?: string }[],
): string {
  const property = STAY_PROPERTIES.find((p) => p.slug === propertySlug)
  const propName = property ? property.name : 'Nuty Tales Luxury Stay'
  const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  // Combine Nuty Tales reservations with external blocks
  const propertyBlocks = BLOCKED_DATES_STORE.filter((b) => b.propertySlug === propertySlug)

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nuty Tales//Luxury Residences Calendar Engine 2.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${propName} Availability Feed`,
    'X-WR-TIMEZONE:Asia/Kolkata',
  ]

  // Add confirmed Nuty Tales bookings
  nutytalesBookings.forEach((b) => {
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${b.bookingRef}@nutytales.com`)
    lines.push(`DTSTAMP:${nowIso}`)
    lines.push(`DTSTART;VALUE=DATE:${toIcalDate(b.checkIn)}`)
    lines.push(`DTEND;VALUE=DATE:${toIcalDate(b.checkOut)}`)
    lines.push(`SUMMARY:Reserved (Nuty Tales Stay: ${b.bookingRef})`)
    lines.push('DESCRIPTION:Confirmed luxury stay reservation on Nuty Tales')
    lines.push('STATUS:CONFIRMED')
    lines.push('END:VEVENT')
  })

  // Add external blocks so downstream channels don't double book
  propertyBlocks.forEach((block) => {
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${block.uid}`)
    lines.push(`DTSTAMP:${nowIso}`)
    lines.push(`DTSTART;VALUE=DATE:${toIcalDate(block.startDate)}`)
    lines.push(`DTEND;VALUE=DATE:${toIcalDate(block.endDate)}`)
    lines.push(`SUMMARY:${block.summary}`)
    lines.push(`DESCRIPTION:Blocked calendar via ${block.source.toUpperCase()} sync`)
    lines.push('STATUS:CONFIRMED')
    lines.push('END:VEVENT')
  })

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

/**
 * Retrieves all blocked date ranges (both Nuty Tales bookings and external syncs) for a property.
 */
export function getBlockedDatesForProperty(propertySlug: string): BlockedDateRange[] {
  return BLOCKED_DATES_STORE.filter((b) => b.propertySlug === propertySlug)
}

/**
 * Checks if a requested date window conflicts with any externally blocked iCal dates.
 */
export function checkIcalConflict(
  propertySlug: string,
  checkIn: string,
  checkOut: string,
): { conflict: boolean; reason?: string } {
  const reqStart = new Date(checkIn).getTime()
  const reqEnd = new Date(checkOut).getTime()

  if (isNaN(reqStart) || isNaN(reqEnd) || reqEnd <= reqStart) {
    return { conflict: true, reason: 'Invalid date range.' }
  }

  const conflict = BLOCKED_DATES_STORE.find((b) => {
    if (b.propertySlug !== propertySlug) return false
    const bStart = new Date(b.startDate).getTime()
    const bEnd = new Date(b.endDate).getTime()
    return reqStart < bEnd && reqEnd > bStart
  })

  if (conflict) {
    return {
      conflict: true,
      reason: `Dates overlap with existing calendar block (${conflict.startDate} to ${conflict.endDate} via ${conflict.source.toUpperCase()}).`,
    }
  }

  return { conflict: false }
}

/**
 * Imports an external iCal feed (from URL or raw content) and registers blocked ranges.
 */
export async function importExternalIcalFeed(
  propertySlug: string,
  feedUrlOrIcsText: string,
  sourceName: 'airbnb' | 'booking' | 'vrbo' | 'google' | 'custom' = 'airbnb',
): Promise<{ success: boolean; importedCount: number; blockedRanges: BlockedDateRange[]; error?: string }> {
  let icsText = feedUrlOrIcsText.trim()

  // If this is an HTTP/HTTPS URL, fetch the feed
  if (icsText.startsWith('http://') || icsText.startsWith('https://') || icsText.startsWith('webcal://')) {
    const fetchUrl = icsText.replace(/^webcal:\/\//i, 'https://')
    try {
      const res = await fetch(fetchUrl, {
        headers: { 'User-Agent': 'NutyTales-iCal-Sync/2.0' },
      })
      if (!res.ok) {
        return { success: false, importedCount: 0, blockedRanges: [], error: `Failed to fetch feed: HTTP ${res.status}` }
      }
      icsText = await res.text()
    } catch (err: any) {
      return { success: false, importedCount: 0, blockedRanges: [], error: `Could not reach feed URL: ${err.message}` }
    }
  }

  const parsedEvents = parseIcalContent(icsText)
  if (parsedEvents.length === 0) {
    return { success: false, importedCount: 0, blockedRanges: [], error: 'No valid calendar events found in this iCal feed.' }
  }

  // Remove previous blocks from this source to avoid duplicates
  const filteredBlocks = BLOCKED_DATES_STORE.filter(
    (b) => !(b.propertySlug === propertySlug && b.source === sourceName),
  )
  BLOCKED_DATES_STORE.length = 0
  BLOCKED_DATES_STORE.push(...filteredBlocks)

  const newRanges: BlockedDateRange[] = parsedEvents.map((evt) => ({
    id: `block-${sourceName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    propertySlug,
    startDate: evt.startDate,
    endDate: evt.endDate,
    source: sourceName,
    summary: evt.summary || `Reserved on ${sourceName}`,
    uid: evt.uid,
    createdAt: new Date().toISOString(),
  }))

  BLOCKED_DATES_STORE.push(...newRanges)

  // Track subscription
  const existingSub = ICAL_SUBSCRIPTIONS_STORE.find(
    (s) => s.propertySlug === propertySlug && s.sourceName === sourceName,
  )
  if (existingSub) {
    existingSub.lastSyncedAt = new Date().toISOString()
    existingSub.eventsCount = newRanges.length
  } else {
    ICAL_SUBSCRIPTIONS_STORE.push({
      id: `sub-${Date.now()}`,
      propertySlug,
      feedUrl: feedUrlOrIcsText,
      sourceName,
      lastSyncedAt: new Date().toISOString(),
      active: true,
      eventsCount: newRanges.length,
    })
  }

  return {
    success: true,
    importedCount: newRanges.length,
    blockedRanges: newRanges,
  }
}

/**
 * Returns active iCal subscriptions for a property.
 */
export function getIcalSubscriptions(propertySlug: string): IcalFeedSubscription[] {
  return ICAL_SUBSCRIPTIONS_STORE.filter((s) => s.propertySlug === propertySlug)
}
