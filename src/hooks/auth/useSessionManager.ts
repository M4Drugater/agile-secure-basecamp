
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UseSessionManagerProps {
  user: User | null;
  profile: Profile | null;
  validateSession: () => Promise<{ isValid: boolean; shouldSignOut: boolean }>;
  setIsValidated: (validated: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setupAuthStateListener: () => any;
  authError?: string | null;
}

export function useSessionManager({
  user,
  profile,
  validateSession,
  setIsValidated,
  setIsLoading,
  setupAuthStateListener,
  authError
}: UseSessionManagerProps) {
  
  const performValidation = useCallback(async () => {
    if (!user) {
      setIsValidated(false);
      setIsLoading(false);
      return;
    }

    try {
      const { isValid, shouldSignOut } = await validateSession();

      if (shouldSignOut) {
        await supabase.auth.signOut();
        setIsValidated(false);
        setIsLoading(false);
        return;
      }

      setIsValidated(isValid);
    } catch (error) {
      console.error('Session validation failed:', error);
      setIsValidated(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, validateSession, setIsValidated, setIsLoading]);

  useEffect(() => {
    // Only perform validation if there's no auth error
    if (!authError) {
      performValidation();
    } else {
      setIsLoading(false);
      setIsValidated(false);
    }

    // Set up auth state change listener for real-time session validation
    const subscription = setupAuthStateListener();

    return () => subscription?.unsubscribe?.();
  }, [user, profile, authError, performValidation, setupAuthStateListener]);

  return {
    performValidation
  };
}
