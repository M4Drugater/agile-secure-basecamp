
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSecurityEvents } from './auth/useSecurityEvents';
import { useSessionValidation } from './auth/useSessionValidation';
import { useCSRFProtection } from './auth/useCSRFProtection';

export function useSecureAuth() {
  const { user, profile } = useAuth();
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { 
    securityEvents, 
    logSecurityEvent, 
    detectSuspiciousActivity, 
    clearSecurityEvents 
  } = useSecurityEvents();

  const { 
    validateSession, 
    resetSessionStartTime, 
    setNewSessionStartTime 
  } = useSessionValidation({ user, profile, logSecurityEvent });

  const { 
    csrfToken, 
    regenerateCSRFToken, 
    clearCSRFToken 
  } = useCSRFProtection();

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

    return () => subscription.unsubscribe();
  }, [user, profile]);

  return {
    isAuthenticated: !!user && isValidated,
    isLoading,
    user,
    profile,
    csrfToken,
    securityEvents,
    detectSuspiciousActivity,
    hasRole: (role: string) => {
      if (!profile) return false;
      return profile.role === role || 
             (role === 'user' && ['admin', 'super_admin'].includes(profile.role)) ||
             (role === 'admin' && profile.role === 'super_admin');
    }
  };
}
