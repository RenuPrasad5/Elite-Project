'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (credentials: SignInWithPasswordCredentials) => Promise<{ error: any }>;
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const setSessionCookie = (session: Session | null) => {
  if (session) {
    const maxAge = session.expires_in || 3600;
    // Set cookie for proxy middleware checks
    document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
  } else {
    // Clear cookie
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setSessionCookie(session);
      } catch (err) {
        console.error('Error fetching initial Supabase session:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setSessionCookie(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: SignInWithPasswordCredentials) => {
    try {
      const result = await supabase.auth.signInWithPassword(credentials);
      if (result.data.session) {
        setSessionCookie(result.data.session);
      }
      return { error: result.error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (credentials: SignUpWithPasswordCredentials) => {
    try {
      const result = await supabase.auth.signUp(credentials);
      if (result.data.session) {
        setSessionCookie(result.data.session);
      }
      return { error: result.error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const result = await supabase.auth.signOut();
      setSessionCookie(null);
      return { error: result.error };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
