
import { useSecurityEvents } from './auth/useSecurityEvents';
import { useSessionValidation } from './auth/useSessionValidation';
import { useCSRFProtection } from './auth/useCSRFProtection';
import { useAuthState } from './auth/useAuthState';
import { useRoleAccess } from './auth/useRoleAccess';
import { useSessionManager } from './auth/useSessionManager';

export function useSecureAuth() {
  const { 
    securityEvents, 
    logSecurityEvent, 
    detectSuspiciousActivity, 
    clearSecurityEvents 
  } = useSecurityEvents();

  const { 
    csrfToken, 
    regenerateCSRFToken, 
    clearCSRFToken 
  } = useCSRFProtection();

  const {
    user,
    profile,
    isValidated,
    setIsValidated,
    isLoading,
    setIsLoading,
    setupAuthStateListener
  } = useAuthState({
    logSecurityEvent,
    clearSecurityEvents,
    resetSessionStartTime: () => resetSessionStartTime(),
    clearCSRFToken,
    regenerateCSRFToken,
    setNewSessionStartTime: () => setNewSessionStartTime()
  });

  const { 
    validateSession, 
    resetSessionStartTime, 
    setNewSessionStartTime 
  } = useSessionValidation({ user, profile, logSecurityEvent });

  const { hasRole } = useRoleAccess(profile);

  useSessionManager({
    user,
    profile,
    validateSession,
    setIsValidated,
    setIsLoading,
    setupAuthStateListener
  });

  return {
    isAuthenticated: !!user && isValidated,
    isLoading,
    user,
    profile,
    csrfToken,
    securityEvents,
    detectSuspiciousActivity,
    hasRole
  };
}
