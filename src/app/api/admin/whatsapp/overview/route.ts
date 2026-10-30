// ─── Nuty Tales — Admin WhatsApp Analytics & Health Route ─────────────────────
// GET /api/admin/whatsapp/overview
import { NextResponse } from 'next/server'
import { WhatsAppAnalyticsEngine } from '@/lib/whatsapp/analytics'
import { getWhatsAppProvider } from '@/lib/whatsapp/provider'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = (searchParams.get('range') || '30d') as any

    const [overview, businessPerformance, providerHealth] = await Promise.all([
      WhatsAppAnalyticsEngine.getOverview(filter),
      WhatsAppAnalyticsEngine.getBusinessPerformance(),
      getWhatsAppProvider().getHealthStatus(),
    ])

    return NextResponse.json({
      success: true,
      overview,
      businessPerformance,
      providerHealth,
      generatedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('[Admin WhatsApp Overview API] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve WhatsApp analytics' },
      { status: 500 }
    )
  }
}
