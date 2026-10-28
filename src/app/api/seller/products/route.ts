import { NextRequest, NextResponse } from 'next/server'
import {
  getSellerProducts,
  createSellerProduct,
  getSellerById,
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
      return NextResponse.json({ success: true, products: [] })
    }

    const products = await getSellerProducts(targetSellerId)
    return NextResponse.json({ success: true, products })
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
        { success: false, error: 'Target seller account not found.' },
        { status: 400 }
      )
    }

    const seller = await getSellerById(targetSellerId)
    if (!seller) {
      return NextResponse.json({ success: false, error: 'Seller not found' }, { status: 404 })
    }

    // Role check: Only approved merchants (or super admins) can publish products
    if (seller.status !== 'approved' && !session.isSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Unapproved sellers cannot list products. Your account must be verified and approved by marketplace operations first.',
        },
        { status: 403 }
      )
    }

    if (!body.title || !body.sku || !body.mrp || !body.sellingPrice) {
      return NextResponse.json(
        { success: false, error: 'Product title, SKU, MRP, and Selling Price are required.' },
        { status: 400 }
      )
    }

    const newProduct = await createSellerProduct(targetSellerId, body)
    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Product created and submitted for catalogue moderation.',
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
