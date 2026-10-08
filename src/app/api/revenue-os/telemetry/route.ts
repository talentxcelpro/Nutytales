import { NextRequest, NextResponse } from 'next/server'
import { getRevenueOSMetrics, TimeframeFilter, RevenueTelemetryEvent } from '@/lib/revenue-os'

// In-memory telemetry buffer for real-time edge aggregation
const recentEventsBuffer: RevenueTelemetryEvent[] = []

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const timeframe = (searchParams.get('timeframe') || '7d') as TimeframeFilter
    const metrics = getRevenueOSMetrics(timeframe)

    // Blend any live real-time ingested events into recentEvents
    if (recentEventsBuffer.length > 0) {
      metrics.recentEvents = [...recentEventsBuffer.slice(0, 5), ...metrics.recentEvents].slice(0, 10)
    }

    return NextResponse.json({
      success: true,
      timeframe,
      data: metrics,
    })
  } catch (error) {
    console.error('Error in Revenue OS API:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to compute revenue metrics' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const event = (await req.json()) as RevenueTelemetryEvent

    if (!event.type || !event.vertical) {
      return NextResponse.json({ success: false, error: 'Invalid event payload' }, { status: 400 })
    }

    // Keep up to 100 recent live events in memory
    recentEventsBuffer.unshift(event)
    if (recentEventsBuffer.length > 100) {
      recentEventsBuffer.pop()
    }

    return NextResponse.json({ success: true, recordedId: event.id })
  } catch (error) {
    console.error('Error recording revenue event:', error)
    return NextResponse.json({ success: false, error: 'Telemetry ingestion failed' }, { status: 500 })
  }
}
