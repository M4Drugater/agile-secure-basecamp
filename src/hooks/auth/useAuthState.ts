
import { useAuth } from '@/contexts/AuthContext';
import { useAuthStateManager } from './useAuthStateManager';
import { SecurityEvent } from './types';

interface UseAuthStateProps {
  logSecurityEvent: (event: SecurityEvent) => void;
  clearSecurityEvents: () => void;
  resetSessionStartTime: () => void;
  clearCSRFToken: () => void;
  regenerateCSRFToken: () => string;
  setNewSessionStartTime: () => void;
}

export function useAuthState(props: UseAuthStateProps) {
  const { user: contextUser, profile: contextProfile } = useAuth();
  
  // Use the optimized auth state manager
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
  } = useAuthStateManager(props);

  // Fallback to context values if manager values are not ready
  const finalUser = user || contextUser;
  const finalProfile = profile || contextProfile;

  return {
    user: finalUser,
    profile: finalProfile,
    isValidated,
    setIsValidated,
    isLoading,
    setIsLoading,
    authError,
    setupAuthStateListener,
    refreshProfile
  };
}
