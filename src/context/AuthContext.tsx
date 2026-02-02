import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import * as authService from '../services/authService';
import { trackSignIn, trackSignOut } from '../services/analyticsService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAnonymous: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session
    authService.getSession().then((s) => {
      setSession(s);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  const isAnonymous = user?.is_anonymous === true;

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await authService.signInWithGoogle();
      trackSignIn('google');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    try {
      await authService.signInWithApple();
      trackSignIn('apple');
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = async () => {
    setIsLoading(true);
    try {
      await authService.signInAnonymously();
      trackSignIn('anonymous');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    trackSignOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAnonymous,
        isLoading,
        signInWithGoogle,
        signInWithApple,
        continueAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
