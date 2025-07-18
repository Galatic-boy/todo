// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(req.url)

  const code = searchParams.get('code')
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/', req.url)) // 👈 Redirect home or any other page
}
