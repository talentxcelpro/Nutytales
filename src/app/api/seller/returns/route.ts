import { NextRequest, NextResponse } from 'next/server'
import {
  getSellerReturns,
  updateReturnRequest,
} from '@/lib/seller-portal/seller-service'
import { SellerReturnRequest } from '@/lib/seller-portal/types'
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
      return NextResponse.json({ success: true, returns: [] })
    }

    const returns = await getSellerReturns(targetSellerId)
    return NextResponse.json({ success: true, returns })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireSellerAuth(req)
  if ('errorResponse' in auth) return auth.errorResponse

  try {
    const body = await req.json()
    const { returnId, status, sellerNote } = body

    if (!returnId || !status) {
      return NextResponse.json(
        { success: false, error: 'returnId and status are required' },
        { status: 400 }
      )
    }

    const updated = await updateReturnRequest(
      returnId,
      status as SellerReturnRequest['status'],
      sellerNote
    )

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Return request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      returnRequest: updated,
      message: `Return request ${returnId} transitioned to ${status}`,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
