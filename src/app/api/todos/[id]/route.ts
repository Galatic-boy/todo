import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


// PUT /api/todos/[id]
export async function PUT(req: NextRequest, context: { params:Promise< { id: string }> }) {
  const { id } = await(context.params)
  const { title, is_complete } = await req.json()

  const { data, error } = await supabase
    .from('todos')
    .update({ title, is_complete })
    .eq('id', id)
    .select()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data?.[0])
}

// DELETE /api/todos/[id]
export async function DELETE(req: NextRequest, context: { params:Promise< { id: string }> }) {
  const { id } = await(context.params)

  const { error } = await supabase.from('todos').delete().eq('id', id)

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ message: 'Deleted' })
}
