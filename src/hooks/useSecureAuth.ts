
import { useSecurityEvents } from './auth/useSecurityEvents';
import { useOptimizedSessionValidation } from './auth/useOptimizedSessionValidation';
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
    authError,
    setupAuthStateListener,
    refreshProfile
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
  } = useOptimizedSessionValidation({ user, profile, logSecurityEvent });

  const { hasRole } = useRoleAccess(profile);

  useSessionManager({
    user,
    profile,
    validateSession,
    setIsValidated,
    setIsLoading,
    setupAuthStateListener,
    authError
  });

  return {
    isAuthenticated: !!user && isValidated,
    isLoading,
    user,
    profile,
    csrfToken,
    securityEvents,
    detectSuspiciousActivity,
    hasRole,
    authError,
    refreshProfile,
    validateSession
  };
}
