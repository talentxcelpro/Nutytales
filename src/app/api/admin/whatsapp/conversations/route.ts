// ─── Nuty Tales — Admin WhatsApp Conversations & Inbox Route ─────────────────
// Enforces cryptographic administrative authentication independently of layout.
import { NextResponse } from 'next/server'
import { WhatsAppDbService } from '@/lib/whatsapp/db'
import { getWhatsAppProvider } from '@/lib/whatsapp/provider'
import { verifyAdminApiAuthorization } from '@/lib/auth/jwt-verifier'

export async function GET(request: Request) {
  const auth = await verifyAdminApiAuthorization(request)
  if (!auth.authorized) {
    return auth.errorResponse
  }

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
  const auth = await verifyAdminApiAuthorization(request)
  if (!auth.authorized) {
    return auth.errorResponse
  }

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

      if (!sendRes.success) {
        return NextResponse.json({ error: sendRes.error || 'Failed to dispatch WhatsApp message' }, { status: 502 })
      }

      // Save to conversation history
      const saved = await WhatsAppDbService.saveMessage({
        conversationId,
        contactId,
        direction: 'OUTBOUND',
        type: 'TEXT',
        body: text,
        providerMessageId: sendRes.messageId,
        status: 'SENT',
      })

      return NextResponse.json({ success: true, message: saved, providerResponse: sendRes })
    }

    if (action === 'update_conversation') {
      if (!conversationId) {
        return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 })
      }

      const updated = await WhatsAppDbService.updateConversation(conversationId, {
        status,
        assignedTo,
        internalNotes,
      })

      return NextResponse.json({ success: true, conversation: updated })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    console.error('[Admin WhatsApp Conversations API] POST Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
