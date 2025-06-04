
import React, { createContext, useContext } from 'react';
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { User } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface SimplifiedAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  profile: Profile | null;
  hasRole: (role: string) => boolean;
  validateSession: () => Promise<boolean>;
}

const SimplifiedAuthContext = createContext<SimplifiedAuthContextType | null>(null);

export function useSimplifiedAuthContext() {
  const context = useContext(SimplifiedAuthContext);
  if (!context) {
    throw new Error('useSimplifiedAuthContext must be used within SimplifiedAuthProvider');
  }
  return context;
}

interface SimplifiedAuthProviderProps {
  children: React.ReactNode;
}

export function SimplifiedAuthProvider({ children }: SimplifiedAuthProviderProps) {
  const auth = useSimplifiedAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <SimplifiedAuthContext.Provider value={auth}>
      {children}
    </SimplifiedAuthContext.Provider>
  );
}
