export const runtime = 'nodejs'          // ensure Node.js runtime
export const dynamic = 'force-dynamic'
import { createServerSupabaseClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


interface Params {
  params:Promise< { id: string }>
}

// PUT /api/todos/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, is_complete } = await req.json()

    const { data, error } = await supabase
      .from('todos')
      .update({ title, is_complete })
      .eq('id', (await params).id)
      .eq('user_id', session.user.id) // 🔐 Only update if user owns it
      .select()
      .single()

    if (error) {
      console.error('Update Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Unhandled PUT Error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}

// DELETE /api/todos/[id]
export async function DELETE(_: NextRequest, { params }: Params) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', (await params).id)
      .eq('user_id', session.user.id) // 🔐 Only delete if owned by user

    if (error) {
      console.error('Delete Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Deleted' })
  } catch (err: any) {
    console.error('Unhandled DELETE Error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
