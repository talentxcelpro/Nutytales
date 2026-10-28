import { NextRequest, NextResponse } from 'next/server'
import {
  getSellerOrderById,
  updateOrderFulfilment,
} from '@/lib/seller-portal/seller-service'
import { requireSellerAuth } from '@/lib/seller-portal/auth-server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSellerAuth(req)
  if ('errorResponse' in auth) return auth.errorResponse
  const { session } = auth

  try {
    const { id } = await params
    const order = await getSellerOrderById(id)
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Tenant Isolation: Sellers cannot view orders belonging to other sellers
    if (order.sellerId !== session.sellerId && !session.isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Access to another merchant order is restricted.' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, order })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSellerAuth(req)
  if ('errorResponse' in auth) return auth.errorResponse
  const { session } = auth

  try {
    const { id } = await params
    const order = await getSellerOrderById(id)
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Tenant Isolation
    if (order.sellerId !== session.sellerId && !session.isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You cannot modify orders for another merchant.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { status, carrierName, trackingNumber, awbCode, pickupScheduledAt } = body

    if (!status) {
      return NextResponse.json({ success: false, error: 'Target status is required' }, { status: 400 })
    }

    const updated = await updateOrderFulfilment(id, status, {
      carrierName,
      trackingNumber,
      awbCode,
      pickupScheduledAt,
    })

    return NextResponse.json({
      success: true,
      order: updated,
      message: `Order status transitioned to ${status}`,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
