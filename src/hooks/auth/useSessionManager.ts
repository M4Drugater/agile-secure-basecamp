
import { useEffect } from 'react';
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
}

export function useSessionManager({
  user,
  profile,
  validateSession,
  setIsValidated,
  setIsLoading,
  setupAuthStateListener
}: UseSessionManagerProps) {
  const performValidation = async () => {
    if (!user) {
      setIsValidated(false);
      setIsLoading(false);
      return;
    }

    const { isValid, shouldSignOut } = await validateSession();

    if (shouldSignOut) {
      await supabase.auth.signOut();
      setIsValidated(false);
      setIsLoading(false);
      return;
    }

    setIsValidated(isValid);
    setIsLoading(false);
  };

  useEffect(() => {
    performValidation();

    // Set up auth state change listener for real-time session validation
    const subscription = setupAuthStateListener();

    return () => subscription.unsubscribe();
  }, [user, profile]);

  return {
    performValidation
  };
}
