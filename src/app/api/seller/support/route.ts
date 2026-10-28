import { NextRequest, NextResponse } from 'next/server'
import {
  getSellerSupportTickets,
  createSupportTicket,
} from '@/lib/seller-portal/seller-service'
import { requireSellerAuth } from '@/lib/seller-portal/auth-server'

export async function GET(req: NextRequest) {
  const auth = await requireSellerAuth(req)
  if ('errorResponse' in auth) return auth.errorResponse
  const { session } = auth

  try {
    const targetSellerId = session.isSuperAdmin
      ? req.nextUrl.searchParams.get('sellerId') || session.sellerId
      : session.sellerId

    if (!targetSellerId) {
      return NextResponse.json({ success: true, tickets: [] })
    }

    const tickets = await getSellerSupportTickets(targetSellerId)
    return NextResponse.json({ success: true, tickets })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireSellerAuth(req)
  if ('errorResponse' in auth) return auth.errorResponse
  const { session } = auth

  try {
    const body = await req.json()
    const targetSellerId = session.isSuperAdmin
      ? body.sellerId || session.sellerId
      : session.sellerId

    if (!targetSellerId) {
      return NextResponse.json({ success: false, error: 'Target seller required' }, { status: 400 })
    }

    if (!body.subject || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Subject and message are required' },
        { status: 400 }
      )
    }

    const ticket = await createSupportTicket(targetSellerId, {
      subject: body.subject,
      category: body.category || 'order_fulfilment',
      message: body.message,
      orderId: body.orderId,
    })

    return NextResponse.json({ success: true, ticket })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
