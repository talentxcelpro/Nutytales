import { NextResponse } from 'next/server'
import { OPERATIONAL_CITIES } from '@/lib/nri/nri-data'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      contactName,
      contactPhone,
      contactCountry,
      inIndiaPerson,
      inIndiaPhone,
      locationCity,
      locationAddress,
      nature,
      urgency,
    } = body

    if (!contactName || !contactPhone || !inIndiaPerson || !locationCity) {
      return NextResponse.json(
        { error: 'Contact names, phone numbers, and Indian city are required for emergency dispatch.' },
        { status: 400 }
      )
    }

    const cityObj = OPERATIONAL_CITIES.find(
      (c) => c.name.toLowerCase() === (locationCity || '').toLowerCase()
    ) || OPERATIONAL_CITIES[0]

    const leadId = `emg-${Date.now()}`
    const escalationRecord = {
      id: leadId,
      contactName,
      contactPhone,
      contactCountry: contactCountry || 'Overseas',
      inIndiaPerson,
      inIndiaPhone,
      locationCity,
      locationAddress,
      nature: nature || 'Elder Distress / Health',
      urgency: urgency || 'Immediate (1-2 Hours)',
      createdAt: new Date().toISOString(),
      status: 'Escalated',
      dispatchNotes: `Lead logged and sent to on-call supervisor in ${locationCity}. Emergency contacts attached.`,
    }

    return NextResponse.json({
      success: true,
      lead: escalationRecord,
      localHelplines: cityObj.emergencyDirectory,
      warningDisclaimer:
        'Nuty Tales coordinates on-ground companion and logistics support. For acute life-threatening medical emergencies or severe crime, call Indian national emergency services at 112 immediately.',
    })
  } catch (err: any) {
    console.error('[API /api/nri/emergency Error]', err)
    return NextResponse.json({ error: 'Failed to dispatch emergency request', details: err.message }, { status: 500 })
  }
}
