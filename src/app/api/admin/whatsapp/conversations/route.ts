// ─── Nuty Tales — Admin WhatsApp Conversations & Inbox Route ─────────────────
import { NextResponse } from 'next/server'
import { WhatsAppDbService } from '@/lib/whatsapp/db'
import { getWhatsAppProvider } from '@/lib/whatsapp/provider'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const status = searchParams.get('status') as any
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    if (conversationId) {
      const messages = await WhatsAppDbService.getConversationMessages(conversationId)
      return NextResponse.json({ success: true, messages })
    }

    const conversations = await WhatsAppDbService.getConversations({ status, limit })
    return NextResponse.json({ success: true, conversations })
  } catch (err: any) {
    console.error('[Admin WhatsApp Conversations API] GET Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, conversationId, contactId, text, status, assignedTo, internalNotes } = body

    if (action === 'send_message') {
      if (!conversationId || !contactId || !text) {
        return NextResponse.json({ error: 'Missing conversationId, contactId or text' }, { status: 400 })
      }

      // Look up contact phone
      const conversations = await WhatsAppDbService.getConversations()
      const conv = conversations.find((c) => c.id === conversationId)
      const phone = conv?.contact?.phoneNumber

      if (!phone) {
        return NextResponse.json({ error: 'Contact phone not found' }, { status: 404 })
      }

      // Send outbound message via active provider
      const provider = getWhatsAppProvider()
      const sendRes = await provider.sendTextMessage({
        to: phone,
        text,
      })

      // Record message in ledger
      const recorded = await WhatsAppDbService.recordMessage({
        conversationId,
        contactId,
        direction: 'OUTBOUND',
        senderType: 'AGENT',
        senderName: 'Nuty Tales Support Concierge',
        messageType: 'text',
        body: text,
        metaMessageId: sendRes.messageId,
      })

      // If agent manually replied, set conversation to HUMAN_TAKEOVER
      await WhatsAppDbService.updateConversationStatus(conversationId, 'HUMAN_TAKEOVER')

      return NextResponse.json({ success: true, message: recorded, sendResult: sendRes })
    }

    if (action === 'update_status') {
      if (!conversationId || !status) {
        return NextResponse.json({ error: 'Missing conversationId or status' }, { status: 400 })
      }

      await WhatsAppDbService.updateConversationStatus(
        conversationId,
        status,
        assignedTo,
        internalNotes
      )

      return NextResponse.json({ success: true, conversationId, status })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    console.error('[Admin WhatsApp Conversations API] POST Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
