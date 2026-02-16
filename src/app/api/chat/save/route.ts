import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session_id, user_id, counselor_id, messages } = body

    let activeSessionId = session_id

    // Create session if not provided
    if (!activeSessionId) {
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({ user_id, counselor_id })
        .select()
        .single()

      if (sessionError) throw sessionError
      activeSessionId = session.id
    } else {
      // Update session timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeSessionId)
    }

    // Insert messages
    const rows = messages.map((m: { role: string; content: string }) => ({
      session_id: activeSessionId,
      role: m.role,
      content: m.content,
    }))

    const { data, error } = await supabase
      .from('chat_messages')
      .insert(rows)
      .select()

    if (error) throw error

    return NextResponse.json({ session_id: activeSessionId, messages: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
