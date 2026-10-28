import { NextRequest, NextResponse } from 'next/server'
import { getSellerById, updateStorefrontProfile } from '@/lib/seller-portal/seller-service'
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
      return NextResponse.json({ success: false, error: 'Seller not found' }, { status: 404 })
    }

    const seller = await getSellerById(targetSellerId)
    if (!seller) {
      return NextResponse.json({ success: false, error: 'Seller not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      storefront: seller.storefront,
      seller,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireSellerAuth(req)
  if ('errorResponse' in auth) return auth.errorResponse
  const { session } = auth

  try {
    const body = await req.json()
    const targetSellerId = session.isSuperAdmin
      ? body.sellerId || session.sellerId
      : session.sellerId

    if (!targetSellerId) {
      return NextResponse.json({ success: false, error: 'Seller not found' }, { status: 404 })
    }

    const updated = await updateStorefrontProfile(targetSellerId, body.storefront || body)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Seller not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      seller: updated,
      message: 'Storefront brand profile updated successfully.',
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
