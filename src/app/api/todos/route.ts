// app/api/todos/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title } = await req.json()

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title, user_id: session.user.id }])
      .select()
      .single()

    if (error) {
      console.error('Supabase Insert Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Unhandled POST Error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}

export async function GET() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json([], { status: 200 }) // 🛡️ Return empty array if unauthorized
  }

  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase Select Error:', error)
      return NextResponse.json([], { status: 200 }) // 🛡️ Return empty array on error
    }

    return NextResponse.json(data ?? []) // ✅ Ensure array is always returned
  } catch (err: any) {
    console.error('Unhandled GET Error:', err)
    return NextResponse.json([], { status: 200 }) // 🛡️ Catch all
  }
}

