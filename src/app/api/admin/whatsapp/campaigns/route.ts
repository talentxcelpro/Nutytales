// ─── Nuty Tales — Admin WhatsApp Campaigns Route ─────────────────────────────
// Enforces cryptographic administrative authentication independently of layout.
import { NextResponse } from 'next/server'
import { WhatsAppDbService } from '@/lib/whatsapp/db'
import { WhatsAppCampaignManager } from '@/lib/whatsapp/campaigns'
import { verifyAdminApiAuthorization } from '@/lib/auth/jwt-verifier'

export async function GET(request: Request) {
  const auth = await verifyAdminApiAuthorization(request)
  if (!auth.authorized) {
    return auth.errorResponse
  }

  try {
    const campaigns = await WhatsAppDbService.getCampaigns()
    return NextResponse.json({ success: true, campaigns })
  } catch (err: any) {
    console.error('[Admin WhatsApp Campaigns API] GET Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdminApiAuthorization(request)
  if (!auth.authorized) {
    return auth.errorResponse
  }

  try {
    const body = await request.json()
    const { action, name, category, targetSegment, templateName, scheduledFor, notes, campaignId } = body

    if (action === 'preview_audience') {
      const preview = await WhatsAppCampaignManager.previewAudience(targetSegment || 'all_opted_in')
      return NextResponse.json({ success: true, preview })
    }

    if (action === 'create_campaign') {
      const campaign = await WhatsAppCampaignManager.createCampaign({
        name,
        category,
        targetSegment,
        templateName,
        scheduledFor,
        notes,
      })
      return NextResponse.json({ success: true, campaign })
    }

    if (action === 'execute_campaign') {
      if (!campaignId) {
        return NextResponse.json({ error: 'Missing campaignId' }, { status: 400 })
      }
      const result = await WhatsAppCampaignManager.executeCampaign(campaignId)
      return NextResponse.json({ success: true, result })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    console.error('[Admin WhatsApp Campaigns API] POST Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
