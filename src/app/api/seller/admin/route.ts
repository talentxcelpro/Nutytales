import { NextRequest, NextResponse } from 'next/server'
import {
  listAllSellers,
  updateSellerStatus,
} from '@/lib/seller-portal/seller-service'
import { requireAdminAuth } from '@/lib/seller-portal/auth-server'
import { sendSellerStatusChangedEmail } from '@/lib/seller-portal/email'

export async function GET(req: NextRequest) {
  // Enforce administrative authorization
  const authResult = await requireAdminAuth(req)
  if ('errorResponse' in authResult) return authResult.errorResponse

  try {
    const sellers = await listAllSellers()
    return NextResponse.json({
      success: true,
      sellers,
      counts: {
        total: sellers.length,
        approved: sellers.filter((s) => s.status === 'approved').length,
        submitted: sellers.filter((s) => s.status === 'submitted' || s.status === 'under_verification').length,
        rejected: sellers.filter((s) => s.status === 'rejected').length,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  // Enforce administrative authorization
  const authResult = await requireAdminAuth(req)
  if ('errorResponse' in authResult) return authResult.errorResponse

  try {
    const body = await req.json()
    const { sellerId, status, notes, rejectionReason } = body

    if (!sellerId || !status) {
      return NextResponse.json(
        { success: false, error: 'Seller ID and status are required' },
        { status: 400 }
      )
    }

    const updated = await updateSellerStatus(sellerId, status, notes, rejectionReason)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Seller not found' }, { status: 404 })
    }

    // Dispatch transactional email notification to seller
    try {
      await sendSellerStatusChangedEmail({
        storeName: updated.storeName,
        email: updated.email,
        id: updated.id,
        status: updated.status,
        rejectionReason: updated.rejectionReason,
        verificationNotes: updated.verificationNotes,
      })
    } catch (mailErr) {
      console.warn('[Admin API] Email dispatch failure (non-blocking):', mailErr)
    }

    return NextResponse.json({
      success: true,
      seller: updated,
      message: `Seller status updated to ${status}`,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
