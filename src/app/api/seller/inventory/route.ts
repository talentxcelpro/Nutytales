import { NextRequest, NextResponse } from 'next/server'
import {
  getSellerProducts,
  getStockMovements,
  adjustProductStock,
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
      return NextResponse.json({ success: true, inventory: [], movements: [] })
    }

    const [products, movements] = await Promise.all([
      getSellerProducts(targetSellerId),
      getStockMovements(targetSellerId),
    ])

    return NextResponse.json({
      success: true,
      inventory: products.map((p) => ({
        productId: p.id,
        sku: p.sku,
        title: p.title,
        category: p.categoryName,
        stockAvailable: p.stockAvailable,
        stockReserved: p.stockReserved,
        lowStockThreshold: p.lowStockThreshold,
        status: p.status,
      })),
      movements,
    })
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
      return NextResponse.json(
        { success: false, error: 'Target seller account required.' },
        { status: 400 }
      )
    }

    const { productId, newStockQty, reason, notes } = body

    if (!productId || newStockQty === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product ID and new stock quantity are required' },
        { status: 400 }
      )
    }

    const updated = await adjustProductStock(
      targetSellerId,
      productId,
      Number(newStockQty),
      reason || 'manual_adjustment',
      notes
    )

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Product not found or does not belong to your store' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product: updated,
      message: `Stock level adjusted to ${newStockQty}`,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
