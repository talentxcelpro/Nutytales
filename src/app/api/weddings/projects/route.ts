import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { DEMO_PROJECT } from '@/lib/weddings/data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      let query = supabaseAdmin.from('wedding_projects').select('*')
      if (projectId) {
        query = query.eq('id', projectId)
      }
      const { data, error } = await query
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, projects: data })
      }
    }

    return NextResponse.json({
      success: true,
      mode: 'fallback',
      projects: [DEMO_PROJECT],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { coupleName, destination, weddingDate, guestCount, totalBudget, currency, weddingStyle } = body

    if (!coupleName || !weddingDate) {
      return NextResponse.json({ error: 'Couple name and wedding date are required' }, { status: 400 })
    }

    const projectId = `WED-2026-${Date.now().toString().slice(-4)}`

    const newProject = {
      id: projectId,
      couple_name: coupleName,
      destination: destination || 'Jaipur, Rajasthan',
      wedding_date: weddingDate,
      guest_count: guestCount || 200,
      total_budget: totalBudget || 5000000,
      currency: currency || 'INR',
      wedding_style: weddingStyle || 'Modern Festive',
      status: 'planning',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      await supabaseAdmin.from('wedding_projects').insert(newProject)
    }

    return NextResponse.json({
      success: true,
      project: newProject,
      message: 'Wedding project initialized.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
