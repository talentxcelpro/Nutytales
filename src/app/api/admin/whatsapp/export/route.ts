// ─── Nuty Tales — Admin WhatsApp CSV Export Route ───────────────────────────
import { WhatsAppAnalyticsEngine } from '@/lib/whatsapp/analytics'

export async function GET() {
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
    return new Response('Failed to generate export', { status: 500 })
  }
}
