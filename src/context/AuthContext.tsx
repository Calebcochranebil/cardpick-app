import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../services/authService';
import { UserProfile } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signUp: (profile: Omit<UserProfile, 'createdAt'>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.getUserProfile()
      .then((profile) => {
        setUser(profile);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const signUp = async (profile: Omit<UserProfile, 'createdAt'>) => {
    setIsLoading(true);
    try {
      const fullProfile = await authService.signUp(profile);
      setUser(fullProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signOut }}>
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
