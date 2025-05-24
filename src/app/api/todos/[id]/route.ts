// app/api/todos/[id]/route.ts
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { title, is_complete } = await req.json()

  const { data, error } = await supabase
    .from('todos')
    .update({ title, is_complete })
    .eq('id', id)
    .select()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data[0])
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { error } = await supabase.from('todos').delete().eq('id', id)

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ message: 'Deleted' })
}
