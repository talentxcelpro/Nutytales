import { NextRequest, NextResponse } from 'next/server'
import { getSellerById } from '@/lib/seller-portal/seller-service'
import { getVerifiedSellerSession } from '@/lib/seller-portal/auth-server'

export async function GET(req: NextRequest) {
  try {
    const session = await getVerifiedSellerSession(req)

    if (!session) {
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
    if (session.sellerId) {
      seller = await getSellerById(session.sellerId)
    } else if (session.isSuperAdmin) {
      // Super admins can view any specific merchant via query param
      const targetSellerId = req.nextUrl.searchParams.get('sellerId')
      if (targetSellerId) {
        seller = await getSellerById(targetSellerId)
      }
    }

    return NextResponse.json({
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
    })
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

    if (!session) {
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

    // Tenant Isolation: Only administrators with superuser permissions may switch context
    if (!session.isSuperAdmin) {
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

    return NextResponse.json({
      success: true,
      message: `Admin switched context to seller ${sellerId}`,
      seller,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
