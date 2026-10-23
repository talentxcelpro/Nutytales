// ─── /api/stays/messages ──────────────────────────────────────────────────────
// Host/Butler Messaging API for in-app messaging, pre-arrival tags, and real-time replies.

import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateThread, postHostMessage } from '@/lib/stays/messages-store'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    const phone = searchParams.get('phone') || '+91 98000 00000'
    const name = searchParams.get('name') || 'Guest'

    if (!slug) {
      return NextResponse.json({ error: 'Property slug is required.' }, { status: 400 })
    }

    const thread = getOrCreateThread(slug, name, phone)
    return NextResponse.json({ success: true, thread })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch conversation.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { propertySlug, guestName, guestPhone, message, preArrivalTags } = body

    if (!propertySlug || !message) {
      return NextResponse.json(
        { error: 'Property slug and message are required.' },
        { status: 400 },
      )
    }

    const res = postHostMessage({
      propertySlug,
      guestName: guestName || 'Guest',
      guestPhone: guestPhone || '+91 98000 00000',
      message,
      preArrivalTags: preArrivalTags || [],
    })

    return NextResponse.json({ success: true, ...res })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send message.' }, { status: 500 })
  }
}
