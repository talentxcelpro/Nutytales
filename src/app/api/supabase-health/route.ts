import { NextResponse } from 'next/server'
import { SUPABASE_URL, SUPABASE_ANON_KEY, getSupabaseClient } from '@/lib/supabase'

export async function GET() {
  const isKeyConfigured = Boolean(SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20)
  const client = getSupabaseClient()

  return NextResponse.json({
    status: 'healthy',
    supabaseProject: 'qezkjbzmtfjjmqgzgili',
    supabaseUrl: SUPABASE_URL,
    isAnonKeyConfigured: isKeyConfigured,
    clientInitialized: Boolean(client),
    timestamp: new Date().toISOString(),
  })
}
