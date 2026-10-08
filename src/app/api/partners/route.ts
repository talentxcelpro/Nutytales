import { NextRequest, NextResponse } from 'next/server'
import {
  PartnerApplication,
  INITIAL_PARTNER_APPLICATIONS,
  PARTNER_TYPE_META,
  PartnerType,
} from '@/lib/seller-partner-system'

// In-memory persistent store for applications during server session
const applicationsStore: PartnerApplication[] = [...INITIAL_PARTNER_APPLICATIONS]

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const partnerType = searchParams.get('type') as PartnerType | null

    let filtered = [...applicationsStore]
    if (status && status !== 'all') {
      filtered = filtered.filter((app) => app.status === status)
    }
    if (partnerType && partnerType in PARTNER_TYPE_META) {
      filtered = filtered.filter((app) => app.partnerType === partnerType)
    }

    return NextResponse.json({
      success: true,
      applications: filtered,
      totalCount: applicationsStore.length,
      pendingCount: applicationsStore.filter((a) => a.status === 'PENDING_REVIEW' || a.status === 'KYC_SUBMITTED').length,
      approvedCount: applicationsStore.filter((a) => a.status === 'APPROVED').length,
    })
  } catch (error) {
    console.error('Failed to fetch partner applications:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      businessName,
      contactPerson,
      email,
      phone,
      whatsapp,
      partnerType,
      country,
      city,
      address,
      websiteOrCatalog,
      taxId,
      fssaiNumber,
      annualTurnover,
      craftCertifications,
    } = body

    if (!businessName || !contactPerson || !email || !phone || !partnerType) {
      return NextResponse.json(
        { success: false, error: 'Missing required partner fields' },
        { status: 400 }
      )
    }

    const typeMeta = PARTNER_TYPE_META[partnerType as PartnerType] || PARTNER_TYPE_META.farmer

    const newApplication: PartnerApplication = {
      id: `partner-app-${Date.now()}`,
      businessName,
      contactPerson,
      email,
      phone,
      whatsapp: whatsapp || phone,
      partnerType: partnerType as PartnerType,
      verticals: typeMeta.verticals,
      country: country || 'India',
      countryCode: country === 'United Arab Emirates' ? 'AE' : country === 'United States' ? 'US' : 'IN',
      city: city || '',
      address: address || '',
      websiteOrCatalog,
      taxId,
      fssaiNumber,
      annualTurnover,
      craftCertifications: Array.isArray(craftCertifications) ? craftCertifications : [],
      status: 'PENDING_REVIEW',
      commissionTier: {
        standardTakeRatePercent: typeMeta.commissionPercent,
        payoutCycleDays: 14,
        listingFeeINR: 0,
        minimumOrderValueINR: 10000,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    applicationsStore.unshift(newApplication)

    return NextResponse.json({
      success: true,
      application: newApplication,
      message: 'Application submitted successfully. Our vendor verification desk will review your credentials within 24-48 business hours.',
    })
  } catch (error) {
    console.error('Error submitting partner application:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit application' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, notes, rejectionReason } = body

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status are required' }, { status: 400 })
    }

    const appIndex = applicationsStore.findIndex((a) => a.id === id)
    if (appIndex === -1) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 })
    }

    applicationsStore[appIndex] = {
      ...applicationsStore[appIndex],
      status,
      notes: notes !== undefined ? notes : applicationsStore[appIndex].notes,
      rejectionReason: rejectionReason !== undefined ? rejectionReason : applicationsStore[appIndex].rejectionReason,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      application: applicationsStore[appIndex],
      message: `Partner application ${status.toLowerCase()} successfully`,
    })
  } catch (error) {
    console.error('Error updating partner application:', error)
    return NextResponse.json({ success: false, error: 'Failed to update application' }, { status: 500 })
  }
}
