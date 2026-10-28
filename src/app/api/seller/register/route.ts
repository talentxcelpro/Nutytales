import { NextRequest, NextResponse } from 'next/server'
import { registerNewSeller } from '@/lib/seller-portal/seller-service'
import { getVerifiedSellerSession } from '@/lib/seller-portal/auth-server'
import { sendSellerRegistrationReceivedEmail } from '@/lib/seller-portal/email'

export async function POST(req: NextRequest) {
  try {
    const session = await getVerifiedSellerSession(req)
    const body = await req.json()
    const {
      storeName,
      legalName,
      businessType,
      email,
      phone,
      whatsapp,
      website,
      pickupAddress,
      city,
      state,
      pincode,
      country,
      countryCode,
      preferredCurrency,
      supportedMarkets,
      taxIdentifiers,
      panNumber,
      gstin,
      fssaiNumber,
      einOrSsn,
      vatNumber,
      trnNumber,
      giCertifications,
      bankDetails,
      approvedCategories,
      approvedStorefronts,
    } = body

    if (!storeName || !businessType || !email || !phone || !pickupAddress || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, error: 'Please provide all mandatory business and pickup address fields.' },
        { status: 400 }
      )
    }

    const resolvedCountry = country || 'United States'
    const resolvedCountryCode =
      countryCode ||
      (resolvedCountry === 'United States'
        ? 'US'
        : resolvedCountry === 'United Kingdom'
        ? 'GB'
        : resolvedCountry === 'United Arab Emirates'
        ? 'AE'
        : resolvedCountry === 'Germany'
        ? 'DE'
        : resolvedCountry === 'India'
        ? 'IN'
        : 'US')

    // Harmonize tax identifiers
    const finalTax: any = taxIdentifiers || {
      countryCode: resolvedCountryCode,
      panNumber,
      gstin,
      fssaiNumber,
      einOrSsn,
      vatNumber,
      trnNumber,
    }

    const newSeller = await registerNewSeller({
      userId: session?.userId,
      storeName,
      legalName: legalName || storeName,
      businessType,
      email,
      phone,
      whatsapp: whatsapp || phone,
      website,
      pickupAddress,
      city,
      state,
      pincode,
      country: resolvedCountry,
      countryCode: resolvedCountryCode,
      preferredCurrency: preferredCurrency || (resolvedCountryCode === 'US' ? 'USD' : resolvedCountryCode === 'GB' ? 'GBP' : resolvedCountryCode === 'AE' ? 'AED' : resolvedCountryCode === 'DE' ? 'EUR' : resolvedCountryCode === 'IN' ? 'INR' : 'USD'),
      supportedMarkets: supportedMarkets || ['Domestic', 'Global'],
      taxIdentifiers: finalTax,
      bankDetails: bankDetails || {
        bankName: '',
        accountNumberMasked: '',
        routingCode: '',
        beneficiaryName: storeName,
        countryCode: resolvedCountryCode,
        currency: preferredCurrency || 'USD',
      },
      approvedCategories: approvedCategories || ['food-pantry'],
      approvedStorefronts: approvedStorefronts || ['nutytales.com'],
      defaultCommissionRate:
        businessType === 'farmer' ? 5.0 : businessType === 'artisan' ? 12.0 : businessType === 'wholesaler' ? 4.5 : 8.0,
      settlementHoldDays: businessType === 'artisan' ? 14 : 7,
    })

    // Dispatch acknowledgment email
    try {
      await sendSellerRegistrationReceivedEmail({
        storeName: newSeller.storeName,
        email: newSeller.email,
        id: newSeller.id,
      })
    } catch (mailErr) {
      console.warn('[Register API] Registration email dispatch failed (non-blocking):', mailErr)
    }

    return NextResponse.json({
      success: true,
      seller: newSeller,
      message: 'Seller registration submitted successfully. Application is queued for compliance verification.',
    })
  } catch (err: any) {
    console.error('Error registering seller:', err)
    return NextResponse.json({ success: false, error: err.message || 'Registration failed' }, { status: 500 })
  }
}
