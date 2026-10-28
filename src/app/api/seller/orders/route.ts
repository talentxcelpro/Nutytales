import { NextRequest, NextResponse } from 'next/server'
import { getSellerOrders } from '@/lib/seller-portal/seller-service'
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
      return NextResponse.json({ success: true, orders: [] })
    }

    const status = req.nextUrl.searchParams.get('status') || 'all'
    const orders = await getSellerOrders(targetSellerId, status)
    return NextResponse.json({ success: true, orders })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
