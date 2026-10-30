// ─── Nuty Tales — Admin WhatsApp CSV Export Route ───────────────────────────
// Enforces cryptographic administrative authentication independently of layout.
import { NextResponse } from 'next/server'
import { WhatsAppAnalyticsEngine } from '@/lib/whatsapp/analytics'
import { verifyAdminApiAuthorization } from '@/lib/auth/jwt-verifier'

export async function GET(request: Request) {
  const auth = await verifyAdminApiAuthorization(request)
  if (!auth.authorized) {
    return auth.errorResponse
  }

  try {
    const csvContent = await WhatsAppAnalyticsEngine.exportReportCsv()
    const fileName = `nutytales_whatsapp_report_${new Date().toISOString().slice(0, 10)}.csv`

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (err: any) {
    console.error('[Admin WhatsApp Export API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to generate export' }, { status: 500 })
  }
}
