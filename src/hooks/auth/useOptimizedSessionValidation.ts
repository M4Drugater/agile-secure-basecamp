
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SecurityEvent } from './types';
import { SessionValidationCache } from './utils/validationCache';
import { SessionExpirationHandler } from './utils/sessionExpirationHandler';
import { ProfileValidator } from './utils/profileValidator';
import { SessionValidationRateLimit } from './utils/sessionValidationRateLimit';

interface UseOptimizedSessionValidationProps {
  user: any;
  profile: any;
  logSecurityEvent: (event: SecurityEvent) => void;
}

export function useOptimizedSessionValidation({ 
  user, 
  profile, 
  logSecurityEvent 
}: UseOptimizedSessionValidationProps) {
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  
  // Utility instances
  const validationCacheRef = useRef(new SessionValidationCache());
  const expirationHandlerRef = useRef(new SessionExpirationHandler());
  const profileValidatorRef = useRef(new ProfileValidator());
  const rateLimitRef = useRef(new SessionValidationRateLimit());

  const validateSession = useCallback(async (): Promise<{ isValid: boolean; shouldSignOut: boolean }> => {
    if (!user) {
      return { isValid: false, shouldSignOut: false };
    }

    // Check rate limiting
    const rateLimitCheck = rateLimitRef.current.checkRateLimit(user.id, logSecurityEvent);
    
    if (!rateLimitCheck.allowed) {
      if (rateLimitCheck.shouldCache) {
        // Return cached result if available
        const cached = validationCacheRef.current.get('session_validation');
        return cached || { isValid: true, shouldSignOut: false };
      }
      return { isValid: false, shouldSignOut: true };
    }

    // Check cached validation result
    const cachedResult = validationCacheRef.current.get('session_validation');
    if (cachedResult) {
      return { 
        isValid: cachedResult.isValid, 
        shouldSignOut: cachedResult.shouldSignOut 
      };
    }

    try {
      // Verify the session is still valid
      const { data: session, error } = await supabase.auth.getSession();
      
      if (error || !session.session) {
        logSecurityEvent({
          type: 'failed_login',
          timestamp: new Date(),
          details: { reason: 'invalid_session', error: error?.message }
        });

        console.warn('Invalid session detected:', error);
        const result = { isValid: false, shouldSignOut: true };
        validationCacheRef.current.set(result);
        
        toast({
          title: "Session expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        
        return result;
      }

      // Set session start time if not already set
      if (!sessionStartTime) {
        setSessionStartTime(Date.now());
      }

      // Handle session expiration and auto-refresh logic
      await expirationHandlerRef.current.handleSessionExpiration(
        session.session,
        sessionStartTime,
        logSecurityEvent
      );

      // Validate profile status
      const profileValidation = profileValidatorRef.current.validateProfile(
        profile,
        user,
        logSecurityEvent
      );

      if (!profileValidation.isValid) {
        validationCacheRef.current.set(profileValidation);
        return profileValidation;
      }

      // Cache successful validation
      const result = { isValid: true, shouldSignOut: false };
      validationCacheRef.current.set(result);

      logSecurityEvent({
        type: 'login_attempt',
        timestamp: new Date(),
        details: { status: 'success', userId: user.id }
      });

      return result;
    } catch (error) {
      logSecurityEvent({
        type: 'failed_login',
        timestamp: new Date(),
        details: { reason: 'validation_error', error: error instanceof Error ? error.message : 'Unknown error' }
      });

      console.error('Session validation error:', error);
      const result = { isValid: false, shouldSignOut: false };
      validationCacheRef.current.set(result);
      return result;
    }
  }, [user, profile, sessionStartTime, logSecurityEvent]);

  const resetSessionStartTime = useCallback(() => {
    setSessionStartTime(null);
    validationCacheRef.current.clear();
  }, []);

  const setNewSessionStartTime = useCallback(() => {
    setSessionStartTime(Date.now());
    validationCacheRef.current.clear();
  }, []);

  return {
    sessionStartTime,
    validateSession,
    resetSessionStartTime,
    setNewSessionStartTime
  };
}
