import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user, saju } = body

    // Upsert user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        name: user.name,
        gender: user.gender,
        birth_year: user.birth_year,
        birth_month: user.birth_month,
        birth_day: user.birth_day,
        birth_hour: user.birth_hour,
        calendar_type: user.calendar_type,
      }, { onConflict: 'id' })
      .select()
      .single()

    if (userError) throw userError

    // Insert saju result
    const { data: sajuData, error: sajuError } = await supabase
      .from('saju_results')
      .insert({
        user_id: userData.id,
        ...saju,
      })
      .select()
      .single()

    if (sajuError) throw sajuError

    return NextResponse.json({ user: userData, saju: sajuData })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
