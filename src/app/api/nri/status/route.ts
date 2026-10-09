import { NextResponse } from 'next/server'
import { VALID_REQUEST_TRANSITIONS } from '@/lib/nri/nlp-engine'
import { RequestStatus } from '@/lib/nri/types'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { requestId, targetStatus, currentStatus, note, actor, disputeReason } = body

    if (!requestId || !targetStatus) {
      return NextResponse.json({ error: 'requestId and targetStatus are required.' }, { status: 400 })
    }

    // Verify valid state transition if currentStatus is provided
    if (currentStatus) {
      const allowed = VALID_REQUEST_TRANSITIONS[currentStatus as RequestStatus] || []
      if (!allowed.includes(targetStatus as RequestStatus)) {
        return NextResponse.json(
          {
            error: `Invalid transition from ${currentStatus} to ${targetStatus}`,
            allowedTransitions: allowed,
          },
          { status: 400 }
        )
      }
    }

    const event = {
      status: targetStatus,
      timestamp: new Date().toISOString(),
      actor: actor || 'customer',
      note: note || (targetStatus === 'completed' ? 'Customer confirmed completion & released milestone' : `Status changed to ${targetStatus}`),
      disputeReason,
    }

    return NextResponse.json({
      success: true,
      requestId,
      status: targetStatus,
      event,
    })
  } catch (err: any) {
    console.error('[API /api/nri/status Error]', err)
    return NextResponse.json({ error: 'Failed to update request status', details: err.message }, { status: 500 })
  }
}
