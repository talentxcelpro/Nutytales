import { NextResponse } from 'next/server'
import { interpretNaturalLanguageRequest } from '@/lib/nri/nlp-engine'
import { matchProvidersForPlan, generateIllustrativeQuote } from '@/lib/nri/matching-engine'
import { NriRequest } from '@/lib/nri/types'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt, userCountry, userCity, userName, userEmail } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'A natural language description is required.' }, { status: 400 })
    }

    // 1. Natural Language Parse
    const parsed = interpretNaturalLanguageRequest(prompt, userCountry, userCity)

    // 2. Provider Matching
    const matches = matchProvidersForPlan(parsed.plan)

    // 3. Assemble illustrative quotes from top 2 matches
    const quotes = matches.slice(0, 2).map((m) => generateIllustrativeQuote(m.provider, parsed.plan))

    // 4. Create structured request record
    const requestId = `req-${Date.now()}`
    const newRequest: NriRequest = {
      id: requestId,
      userName: userName || 'Overseas Client',
      userEmail: userEmail || 'client@overseas.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'submitted',
      rawPrompt: prompt,
      extractedPlan: parsed.plan,
      quotes: quotes as any,
      history: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          actor: 'customer',
          note: `Request initiated for ${parsed.plan.destination_city} (${parsed.plan.categoryLabel})`,
        },
        {
          status: 'matching',
          timestamp: new Date().toISOString(),
          actor: 'system',
          note: `Matched ${matches.length} verified regional providers`,
        },
      ],
    }

    return NextResponse.json({
      success: true,
      request: newRequest,
      parsedPlan: parsed.plan,
      matchingProviders: matches,
    })
  } catch (err: any) {
    console.error('[API /api/nri/request Error]', err)
    return NextResponse.json({ error: 'Failed to process request', details: err.message }, { status: 500 })
  }
}
