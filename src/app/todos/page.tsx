import { createClient } from '@/lib/supabaseClient'
import { redirect } from 'next/navigation'

export default async function TodosPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return <div>TODO Page (protected)</div>
}
