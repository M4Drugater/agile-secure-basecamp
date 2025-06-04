
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SecurityEvent } from './types';

interface UseAuthStateProps {
  logSecurityEvent: (event: SecurityEvent) => void;
  clearSecurityEvents: () => void;
  resetSessionStartTime: () => void;
  clearCSRFToken: () => void;
  regenerateCSRFToken: () => string;
  setNewSessionStartTime: () => void;
}

export function useAuthState({
  logSecurityEvent,
  clearSecurityEvents,
  resetSessionStartTime,
  clearCSRFToken,
  regenerateCSRFToken,
  setNewSessionStartTime
}: UseAuthStateProps) {
  const { user, profile } = useAuth();
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setupAuthStateListener = () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsValidated(false);
          clearSecurityEvents();
          resetSessionStartTime();
          clearCSRFToken();
        } else if (event === 'TOKEN_REFRESHED') {
          logSecurityEvent({
            type: 'token_refresh',
            timestamp: new Date(),
            details: { userId: session?.user?.id }
          });
          setIsValidated(!!session);
        } else if (event === 'SIGNED_IN') {
          // Re-generate CSRF token on sign in
          regenerateCSRFToken();
          
          // Set session start time for new login
          setNewSessionStartTime();
          
          logSecurityEvent({
            type: 'login_attempt',
            timestamp: new Date(),
            details: { status: 'success', userId: session?.user?.id }
          });
        }
      }
    );

    return subscription;
  };

  return {
    user,
    profile,
    isValidated,
    setIsValidated,
    isLoading,
    setIsLoading,
    setupAuthStateListener
  };
}
