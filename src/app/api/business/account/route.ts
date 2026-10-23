import { NextResponse } from 'next/server'
import { getSupabaseAdmin, getSupabaseClient } from '@/lib/supabase'
import { verifyIdToken } from '@/lib/firebase/admin'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    const idToken = authHeader?.replace(/^Bearer\s+/i, '').trim()

    let uid: string | null = null
    if (idToken) {
      try {
        const verified = await verifyIdToken(idToken)
        uid = verified?.uid || null
      } catch {
        // Continue with unverified request
      }
    }

    const admin = getSupabaseAdmin() || getSupabaseClient()
    if (admin && uid) {
      const { data } = await admin
        .from('business_accounts')
        .select('*')
        .eq('user_id', uid)
        .single()

      if (data) {
        return NextResponse.json({ success: true, account: data })
      }
    }

    return NextResponse.json({
      success: true,
      account: null,
      message: 'No registered business account found for this user',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      companyName,
      contactPerson,
      phone,
      email,
      gstin,
      businessType = 'COMMERCIAL_BUYER',
      address = '',
      city = 'PAN-India',
      state = '',
      pincode = '',
      expectedMonthlyQty,
    } = body

    if (!companyName || (!phone && !email)) {
      return NextResponse.json(
        { success: false, error: 'Business legal name and contact phone or email are required.' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('Authorization')
    const idToken = authHeader?.replace(/^Bearer\s+/i, '').trim()
    let uid: string | null = null

    if (idToken) {
      try {
        const verified = await verifyIdToken(idToken)
        uid = verified?.uid || null
      } catch {
        // optional auth
      }
    }

    const admin = getSupabaseAdmin() || getSupabaseClient()

    // 1. Log as high-priority corporate registration lead for the sales desk
    if (admin) {
      await admin.from('leads').insert({
        name: contactPerson || companyName,
        phone: phone || '',
        email: email || '',
        business_name: `[CORPORATE B2B] ${companyName}`,
        city: city || 'PAN-India',
        message: `[New Trade Account Registered] Entity: ${companyName} | Contact: ${contactPerson} | Type: ${businessType} | GSTIN: ${gstin || 'Pending'} | City: ${city} | Pin: ${pincode} | Address: ${address} | Est. Qty: ${expectedMonthlyQty || 'Not specified'} kg/mo`,
        source: 'business.nutytales.com/account-onboarding',
      })

      // 2. If business_accounts table exists in Supabase, upsert it
      if (uid) {
        try {
          await admin.from('business_accounts').upsert({
            user_id: uid,
            business_name: companyName,
            owner_name: contactPerson || companyName,
            business_type: businessType,
            gstin: gstin || null,
            city: city || '',
            state: state || '',
            expected_monthly_qty: expectedMonthlyQty ? Number(expectedMonthlyQty) : null,
            is_verified: Boolean(gstin && gstin.length === 15),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })
        } catch {
          // graceful fallback if table not migrated yet
        }
      }
    }

    const accountRecord = {
      companyName,
      contactPerson,
      phone,
      email,
      gstin: gstin || null,
      businessType,
      city,
      state,
      address,
      pincode,
      expectedMonthlyQty: expectedMonthlyQty || null,
      isVerified: Boolean(gstin && gstin.length === 15),
      creditStatus: 'Net-30 Eligible upon trade verification',
      assignedSpecialist: 'Tariq Ahmad (Senior Trade Desk)',
      tradePhone: '+91 9717161809',
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: 'Business account details updated successfully.',
      account: accountRecord,
    })
  } catch (error: any) {
    console.error('Error in /api/business/account:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
