
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { RateLimiter } from '@/utils/inputSanitization';
import { SecurityEvent } from './types';

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
  const lastValidationRef = useRef<number>(0);
  const validationCacheRef = useRef<{ isValid: boolean; timestamp: number } | null>(null);

  // Cache validation results for 30 seconds to reduce redundant checks
  const VALIDATION_CACHE_DURATION = 30 * 1000; // 30 seconds
  const MIN_VALIDATION_INTERVAL = 10 * 1000; // 10 seconds minimum between validations

  const validateSession = useCallback(async (): Promise<{ isValid: boolean; shouldSignOut: boolean }> => {
    if (!user) {
      return { isValid: false, shouldSignOut: false };
    }

    const now = Date.now();

    // Check if we've validated too recently
    if (now - lastValidationRef.current < MIN_VALIDATION_INTERVAL) {
      return validationCacheRef.current || { isValid: true, shouldSignOut: false };
    }

    // Check cached validation result
    if (validationCacheRef.current && 
        now - validationCacheRef.current.timestamp < VALIDATION_CACHE_DURATION) {
      return { isValid: validationCacheRef.current.isValid, shouldSignOut: false };
    }

    try {
      // Rate limiting check
      const rateLimitKey = `session_check_${user.id}`;
      const rateLimit = RateLimiter.checkRateLimit(rateLimitKey, 5, 60000); // 5 attempts per minute

      if (!rateLimit.allowed) {
        logSecurityEvent({
          type: 'suspicious_activity',
          timestamp: new Date(),
          details: { reason: 'excessive_session_checks', userId: user.id }
        });
        
        toast({
          title: "Security Alert",
          description: "Too many session validation attempts. Please wait before trying again.",
          variant: "destructive",
        });
        
        return { isValid: false, shouldSignOut: true };
      }

      // Update last validation time
      lastValidationRef.current = now;

      // Verify the session is still valid
      const { data: session, error } = await supabase.auth.getSession();
      
      if (error || !session.session) {
        logSecurityEvent({
          type: 'failed_login',
          timestamp: new Date(),
          details: { reason: 'invalid_session', error: error?.message }
        });

        console.warn('Invalid session detected:', error);
        validationCacheRef.current = { isValid: false, timestamp: now };
        
        toast({
          title: "Session expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        
        return { isValid: false, shouldSignOut: true };
      }

      // Handle session expiration and auto-refresh logic
      const sessionExpiresAt = session.session.expires_at;
      if (sessionExpiresAt) {
        const expirationTime = sessionExpiresAt * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;
        
        // Set session start time if not already set
        if (!sessionStartTime) {
          setSessionStartTime(currentTime);
        }
        
        const minimumActiveTime = 10 * 60 * 1000; // 10 minutes
        const warningThreshold = 15 * 60 * 1000; // 15 minutes
        const maxActiveTime = 12 * 60 * 60 * 1000; // 12 hours
        const sessionActiveTime = sessionStartTime ? currentTime - sessionStartTime : 0;
        
        // Show warnings only when appropriate
        const shouldShowWarning = (
          (timeUntilExpiry < warningThreshold && sessionActiveTime > minimumActiveTime) ||
          (sessionActiveTime > maxActiveTime && timeUntilExpiry > 60 * 60 * 1000)
        );
        
        if (shouldShowWarning) {
          const warningType = timeUntilExpiry < warningThreshold ? 'session_near_expiry' : 'session_too_long';
          
          logSecurityEvent({
            type: 'suspicious_activity',
            timestamp: new Date(),
            details: { 
              reason: warningType, 
              timeUntilExpiry, 
              sessionActiveTime
            }
          });

          const message = warningType === 'session_near_expiry' 
            ? `Your session will expire in ${Math.round(timeUntilExpiry / (60 * 1000))} minutes. Please save your work.`
            : "Your session has been active for a long time. Consider signing out and back in for security.";

          // Only show toast if this is a new warning (not cached)
          if (!validationCacheRef.current || !validationCacheRef.current.isValid) {
            toast({
              title: "Session Warning",
              description: message,
              variant: "destructive",
            });
          }
        }
        
        // Auto-refresh token if expiring within 30 minutes and session is active
        if (timeUntilExpiry < 30 * 60 * 1000 && sessionActiveTime > minimumActiveTime) {
          try {
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (!refreshError) {
              logSecurityEvent({
                type: 'token_refresh',
                timestamp: new Date(),
                details: { reason: 'auto_refresh', timeUntilExpiry }
              });
            }
          } catch (refreshError) {
            console.warn('Failed to refresh session:', refreshError);
          }
        }
      }

      // Validate profile status
      if (profile && profile.is_active === false) {
        logSecurityEvent({
          type: 'failed_login',
          timestamp: new Date(),
          details: { reason: 'account_deactivated', userId: user.id }
        });

        validationCacheRef.current = { isValid: false, timestamp: now };
        
        toast({
          title: "Account deactivated",
          description: "Your account has been deactivated. Please contact support.",
          variant: "destructive",
        });
        
        return { isValid: false, shouldSignOut: true };
      }

      // Cache successful validation
      validationCacheRef.current = { isValid: true, timestamp: now };

      logSecurityEvent({
        type: 'login_attempt',
        timestamp: new Date(),
        details: { status: 'success', userId: user.id }
      });

      return { isValid: true, shouldSignOut: false };
    } catch (error) {
      logSecurityEvent({
        type: 'failed_login',
        timestamp: new Date(),
        details: { reason: 'validation_error', error: error instanceof Error ? error.message : 'Unknown error' }
      });

      console.error('Session validation error:', error);
      validationCacheRef.current = { isValid: false, timestamp: now };
      return { isValid: false, shouldSignOut: false };
    }
  }, [user, profile, sessionStartTime, logSecurityEvent]);

  const resetSessionStartTime = useCallback(() => {
    setSessionStartTime(null);
    validationCacheRef.current = null; // Clear validation cache
  }, []);

  const setNewSessionStartTime = useCallback(() => {
    setSessionStartTime(Date.now());
    validationCacheRef.current = null; // Clear validation cache
  }, []);

  return {
    sessionStartTime,
    validateSession,
    resetSessionStartTime,
    setNewSessionStartTime
  };
}
