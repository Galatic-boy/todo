'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { createClient } from '@/lib/supabaseClient';

export default function SignInPage() {
  const { session } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (session) {
      router.push('/'); // Redirect to home/dashboard if already logged in
    }
  }, [session]);

  const handleLogin = async () => {
    const { error } = await createClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      return;
    }

    // Successful login will trigger useEffect to redirect
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Sign In</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="block mb-2 border p-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="block mb-2 border p-2"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
        Sign In
      </button>
    </div>
  );
}
