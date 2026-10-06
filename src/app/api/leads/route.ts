import { NextResponse } from 'next/server'
import { insertLead, LeadSubmission } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body: LeadSubmission = await request.json()

    if (!body.phone && !body.email) {
      return NextResponse.json(
        { error: 'Either phone number or email is required.' },
        { status: 400 }
      )
    }

    const result = await insertLead(body)

    return NextResponse.json({
      success: true,
      message: 'Lead received successfully.',
      result,
    })
  } catch (error: any) {
    console.error('Error in /api/leads:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Nutty Tales Supabase Leads API',
    supabaseUrl: 'https://qezkjbzmtfjjmqgzgili.supabase.co',
  })
}
