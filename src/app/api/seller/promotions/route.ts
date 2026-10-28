import { NextRequest, NextResponse } from 'next/server'
import {
  getSellerPromotions,
  createSellerPromotion,
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
      return NextResponse.json({ success: true, promotions: [] })
    }

    const promotions = await getSellerPromotions(targetSellerId)
    return NextResponse.json({ success: true, promotions })
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

    if (!body.code || !body.discountValue) {
      return NextResponse.json(
        { success: false, error: 'Promo coupon code and discount value are required' },
        { status: 400 }
      )
    }

    const promo = await createSellerPromotion(targetSellerId, body)
    return NextResponse.json({ success: true, promotion: promo })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
