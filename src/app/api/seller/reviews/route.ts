import { NextRequest, NextResponse } from 'next/server'
import { getSellerReviews, addReviewReply } from '@/lib/seller-portal/seller-service'
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
      return NextResponse.json({ success: true, reviews: [] })
    }

    const reviews = await getSellerReviews(targetSellerId)
    return NextResponse.json({ success: true, reviews })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireSellerAuth(req)
  if ('errorResponse' in auth) return auth.errorResponse

  try {
    const body = await req.json()
    const { reviewId, replyText } = body

    if (!reviewId || !replyText) {
      return NextResponse.json(
        { success: false, error: 'reviewId and replyText are required' },
        { status: 400 }
      )
    }

    const updated = await addReviewReply(reviewId, replyText)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      review: updated,
      message: 'Seller response posted successfully.',
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
