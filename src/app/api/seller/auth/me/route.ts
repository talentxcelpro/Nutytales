import { NextRequest, NextResponse } from 'next/server'
import { getSellerById, listAllSellers } from '@/lib/seller-portal/seller-service'
import { getVerifiedSellerSession } from '@/lib/seller-portal/auth-server'

export async function GET(req: NextRequest) {
  try {
    const session = await getVerifiedSellerSession(req)
    const cookieSellerId = req.cookies.get('seller_portal_active_merchant')?.value
    const querySellerId = req.nextUrl.searchParams.get('sellerId')

    if (!session) {
      // In development / local testing:
      // Provide seamless fallback so browsing localhost:3000/seller connects immediately
      if (process.env.NODE_ENV !== 'production') {
        const allSellers = await listAllSellers()
        const targetId = querySellerId || cookieSellerId || allSellers[0]?.id || 'SLR-GLOBAL-101'
        const seller = (await getSellerById(targetId)) || allSellers[0] || null

        const res = NextResponse.json({
          success: true,
          authenticated: true,
          isDevMode: true,
          session: {
            userId: 'dev-merchant-admin',
            email: 'admin@nutytales.com',
            name: 'Local Merchant Desk (Dev)',
            role: 'SUPER_ADMIN',
            isSuperAdmin: true,
          },
          seller,
          availableSellers: allSellers,
        })
        if (seller?.id) {
          res.cookies.set('seller_portal_active_merchant', seller.id, { path: '/', maxAge: 60 * 60 * 24 * 30 })
        }
        return res
      }

      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Unauthorized: Authentication required.',
        },
        { status: 401 }
      )
    }

    let seller = null
    let availableSellers: any[] = []

    if (session.isSuperAdmin) {
      // Super admins have access to all marketplace merchants and can switch context
      allSellers_block: {
        const allSellers = await listAllSellers()
        availableSellers = allSellers
        const targetSellerId = querySellerId || cookieSellerId || session.sellerId || allSellers[0]?.id
        if (targetSellerId) {
          seller = (await getSellerById(targetSellerId)) || allSellers[0] || null
        }
      }
    } else if (session.sellerId) {
      seller = await getSellerById(session.sellerId)
    }

    const res = NextResponse.json({
      success: true,
      authenticated: true,
      session: {
        userId: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
        isSuperAdmin: session.isSuperAdmin,
      },
      seller,
      availableSellers,
    })

    if (seller?.id) {
      res.cookies.set('seller_portal_active_merchant', seller.id, { path: '/', maxAge: 60 * 60 * 24 * 30 })
    }
    return res
  } catch (err: any) {
    console.error('[Seller Auth/Me] Error resolving verified session:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error resolving session' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getVerifiedSellerSession(req)
    const isDev = process.env.NODE_ENV !== 'production'

    if (!session && !isDev) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { sellerId } = body

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Target sellerId is required' },
        { status: 400 }
      )
    }

    // Tenant Isolation: Only administrators or local dev environment may switch context
    if (!isDev && session && !session.isSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: Cross-tenant switching is restricted to authorized marketplace administrators.',
        },
        { status: 403 }
      )
    }

    const seller = await getSellerById(sellerId)
    if (!seller) {
      return NextResponse.json(
        { success: false, error: 'Seller not found' },
        { status: 404 }
      )
    }

    const res = NextResponse.json({
      success: true,
      message: `Active merchant switched to ${seller.storeName} (${sellerId})`,
      seller,
    })
    res.cookies.set('seller_portal_active_merchant', seller.id, { path: '/', maxAge: 60 * 60 * 24 * 30 })
    return res
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
