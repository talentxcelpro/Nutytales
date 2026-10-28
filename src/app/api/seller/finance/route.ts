import { NextRequest, NextResponse } from 'next/server'
import {
  getSellerLedger,
  getSellerPayouts,
  requestPayoutSettlement,
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
      return NextResponse.json({
        success: true,
        financialSummary: { availableBalance: 0, holdPeriodDays: 7, bankDetails: null, commissionRate: 8.0 },
        ledger: [],
        payouts: [],
      })
    }

    const [ledger, payouts, seller] = await Promise.all([
      getSellerLedger(targetSellerId),
      getSellerPayouts(targetSellerId),
      getSellerById(targetSellerId),
    ])

    const availableBalance = ledger.length > 0 ? Math.max(0, ledger[0].balanceAfter) : 0

    return NextResponse.json({
      success: true,
      financialSummary: {
        availableBalance,
        holdPeriodDays: seller?.settlementHoldDays || 7,
        bankDetails: seller?.bankDetails,
        commissionRate: seller?.defaultCommissionRate || 8.0,
      },
      ledger,
      payouts,
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
    const targetSellerId = session.isSuperAdmin
      ? (await req.json().catch(() => ({}))).sellerId || session.sellerId
      : session.sellerId

    if (!targetSellerId) {
      return NextResponse.json(
        { success: false, error: 'Target seller account required.' },
        { status: 400 }
      )
    }

    const payout = await requestPayoutSettlement(targetSellerId)
    if (!payout) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Insufficient balance for payout settlement. Minimum eligible threshold is $50 (or local equivalent).',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      payout,
      message: `Payout batch ${payout.id} requested for ${payout.currency} ${payout.amount.toLocaleString('en-US')}`,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
