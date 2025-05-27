'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignUp = async () => {
    const supabase = supabaseBrowser()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    console.log('SIGNUP DATA:', data)
  console.log('SIGNUP ERROR:', error)

    if (error) {
      setError(error.message)
    } else {
      router.push('/auth/login')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Sign Up</h1>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp} className="bg-blue-600 text-white px-4 py-2 w-full">
        Sign Up
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
