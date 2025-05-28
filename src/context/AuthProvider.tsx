'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@/lib/supabaseClient';

type AuthContextType = {
  session: Session | null;
};

const AuthContext = createContext<AuthContextType>({ session: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = createClient().auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    createClient()
      .auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
