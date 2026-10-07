import { NextResponse } from 'next/server'
import { getSupabaseAdmin, getSupabaseClient } from '@/lib/supabase'
import { CommercialOpportunity, OpportunityStatus, OpportunityType, PlatformVertical } from '@/lib/platform-core'

// In-memory persistent cache for high-availability access in local and serverless environments
let inMemoryOpportunities: CommercialOpportunity[] = [
  {
    id: 'OPP-2026-9412',
    type: 'b2b_rfq',
    vertical: 'business',
    customerName: 'Aditya Singhania',
    customerEmail: 'a.singhania@delhi-bakeries.com',
    customerPhone: '+91 98110 44221',
    companyName: 'Delhi Artisan Bakeries',
    itemOrService: 'California Almond Slices 1.0mm (500kg)',
    quantity: '500 kg',
    budget: 350000,
    currency: 'INR',
    requiredDate: '15 Oct 2026',
    deliveryCity: 'Noida HQ Hub',
    intentScore: 92,
    status: 'QUOTE_SENT',
    source: 'business.nutytales.com/rfq',
    assignedTo: 'Tariq Ahmad (Senior Trade Desk)',
    notes: 'Requires 1.0mm machine sliced with NABL moisture COA under 4.5%. Delivery needed at Greater Noida loading bay.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'OPP-2026-9408',
    type: 'corporate_gifting',
    vertical: 'gifting',
    customerName: 'Priya Narang',
    customerEmail: 'priya.n@techcorp-dubai.ae',
    customerPhone: '+971 50 123 4567',
    companyName: 'TechCorp Middle East',
    itemOrService: 'Royal Kashmiri Saffron & Walnut Luxury Gift Boxes',
    quantity: '250 Boxes',
    budget: 750000,
    currency: 'AED',
    requiredDate: '28 Oct 2026',
    deliveryCity: 'Dubai Internet City & Abu Dhabi',
    intentScore: 88,
    status: 'QUALIFIED',
    source: 'gifting.nutytales.com',
    assignedTo: 'Sameer Wani (Gifting Director)',
    notes: 'Corporate Diwali & Q4 executive hampers. Gold foiled packaging with laser-etched wooden logo tag.',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'OPP-2026-9395',
    type: 'wedding_inquiry',
    vertical: 'weddings',
    customerName: 'Kavita Kapoor',
    customerEmail: 'kapoor.wedding2026@gmail.com',
    customerPhone: '+91 98711 00223',
    companyName: 'Kapoor & Mehra Destination Wedding',
    itemOrService: 'Kashmiri Silver Carafes with Pampore Mongra Saffron & Anjeer',
    quantity: '400 Favours',
    budget: 600000,
    currency: 'INR',
    requiredDate: '10 Nov 2026',
    deliveryCity: 'Srinagar & New Delhi',
    intentScore: 95,
    status: 'MATCHING',
    source: 'weddings.nutytales.com',
    assignedTo: 'Zafraan Wedding Desk',
    notes: 'Destination wedding in Dal Lake Srinagar. Delivery split: 150 favours to Delhi, 250 favours to Srinagar.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'OPP-2026-9382',
    type: 'hotel_booking',
    vertical: 'stays',
    customerName: 'David Sterling',
    customerEmail: 'd.sterling@uk-consulting.co.uk',
    customerPhone: '+44 7700 900123',
    companyName: 'Sterling Executive Group',
    itemOrService: 'The Heritage Chinar Luxury Stays (Entire Orchard Estate)',
    quantity: '6 Suites / 5 Nights',
    budget: 450000,
    currency: 'GBP',
    requiredDate: '20 Nov 2026',
    deliveryCity: 'Srinagar, Kashmir',
    intentScore: 85,
    status: 'CONTACTED',
    source: 'stays.nutytales.com',
    assignedTo: 'Hospitality Concierge Desk',
    notes: 'Executive leadership retreat. Requires private chef Wazwan sessions and Gulmarg transfers.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.customerPhone && !body.customerEmail) {
      return NextResponse.json(
        { error: 'Contact phone or work email is required to generate a commercial opportunity.' },
        { status: 400 }
      )
    }

    // Dynamic Intent Scoring (1 to 100)
    let intentScore = 30
    if (body.quantity) intentScore += 20
    if (body.budget && body.budget > 0) intentScore += 20
    if (body.customerPhone && body.customerEmail) intentScore += 15
    if (body.requiredDate) intentScore += 15
    intentScore = Math.min(100, intentScore)

    const opportunityId = `OPP-2026-${Math.floor(1000 + Math.random() * 9000)}`

    const newOpp: CommercialOpportunity = {
      id: opportunityId,
      type: (body.type as OpportunityType) || 'b2b_rfq',
      vertical: (body.vertical as PlatformVertical) || 'business',
      customerName: body.customerName || 'Institutional Client',
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      companyName: body.companyName || 'Corporate Partner',
      businessId: body.businessId,
      itemOrService: body.itemOrService || body.message || 'Commercial Sourcing Request',
      quantity: body.quantity || 'As Specified',
      budget: Number(body.budget) || undefined,
      currency: body.currency || 'INR',
      requiredDate: body.requiredDate,
      deliveryCity: body.deliveryCity || body.city || 'India',
      intentScore,
      status: 'QUALIFIED',
      source: body.source || 'global-platform-core',
      assignedTo: 'Senior Commercial Accounts Desk',
      notes: body.notes || body.message || 'Direct digital opportunity recorded.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Prepend to in-memory cache
    inMemoryOpportunities.unshift(newOpp)

    // Persist to Supabase if credentials available
    const admin = getSupabaseAdmin() || getSupabaseClient()
    if (admin) {
      try {
        await admin.from('leads').insert([
          {
            name: newOpp.customerName,
            phone: newOpp.customerPhone,
            email: newOpp.customerEmail,
            city: newOpp.deliveryCity,
            business_name: newOpp.companyName,
            source: `${newOpp.vertical}:${newOpp.type}`,
            message: `[Opportunity ${newOpp.id}] Item: ${newOpp.itemOrService} | Qty: ${newOpp.quantity} | Budget: ${newOpp.budget || 'Open'} ${newOpp.currency} | Score: ${newOpp.intentScore} | Notes: ${newOpp.notes}`,
            metadata: newOpp,
            created_at: newOpp.createdAt,
          },
        ])
      } catch (err) {
        console.warn('[Opportunities API] Supabase persistence note:', err)
      }
    }

    return NextResponse.json({
      success: true,
      opportunityId,
      intentScore,
      status: newOpp.status,
      assignedDesk: newOpp.assignedTo,
      message: 'Commercial opportunity successfully registered with senior trade desk.',
      opportunity: newOpp,
    })
  } catch (error: any) {
    console.error('Error in /api/opportunities:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error while registering opportunity' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    totalOpportunities: inMemoryOpportunities.length,
    activePipelineValue: inMemoryOpportunities.reduce((acc, curr) => acc + (curr.budget || 100000), 0),
    opportunities: inMemoryOpportunities,
  })
}
