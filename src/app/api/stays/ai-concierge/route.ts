import { NextResponse } from 'next/server'
import { parseTripQuery, executeConciergeDiscovery } from '@/lib/stays/ai-concierge'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query, existingIntent } = body

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Travel inquiry query is required.' }, { status: 400 })
    }

    // 1. Parse natural language query
    const parsed = parseTripQuery(query)

    // Merge with any existing multi-turn intent
    const mergedIntent = {
      ...parsed,
      destination: parsed.destination || existingIntent?.destination,
      guestsCount: parsed.guestsCount || existingIntent?.guestsCount,
      nights: parsed.nights || existingIntent?.nights,
      maxBudget: parsed.maxBudget || existingIntent?.maxBudget,
      amenitiesRequired: Array.from(
        new Set([...(existingIntent?.amenitiesRequired || []), ...parsed.amenitiesRequired]),
      ),
    }

    // 2. Discover and score matching inventory
    const response = executeConciergeDiscovery(mergedIntent)

    return NextResponse.json({
      success: true,
      ...response,
    })
  } catch (err: any) {
    console.error('[API Stays AI Concierge] Error:', err)
    return NextResponse.json({ error: err.message || 'AI concierge processing failed.' }, { status: 500 })
  }
}
