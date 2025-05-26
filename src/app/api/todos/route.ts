// app/api/todos/route.ts
import { createServerSupabaseClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient()
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
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', session.user.id) // 🔐 Fetch only current user's todos
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase Select Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Unhandled GET Error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
