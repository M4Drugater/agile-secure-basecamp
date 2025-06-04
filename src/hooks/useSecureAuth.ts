
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { RateLimiter } from '@/utils/inputSanitization';
import { SecurityHeaders } from '@/utils/securityHeaders';

interface SecurityEvent {
  type: 'login_attempt' | 'failed_login' | 'token_refresh' | 'suspicious_activity';
  timestamp: Date;
  details: Record<string, any>;
}

export function useSecureAuth() {
  const { user, profile } = useAuth();
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Generate and store CSRF token on mount
  useEffect(() => {
    const token = SecurityHeaders.generateCSRFToken();
    SecurityHeaders.storeCSRFToken(token);
    setCsrfToken(token);
    
    // Apply security headers
    SecurityHeaders.applySecurityHeaders();
  }, []);

  const logSecurityEvent = (event: SecurityEvent) => {
    setSecurityEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events
    
    // Log critical events
    if (['failed_login', 'suspicious_activity'].includes(event.type)) {
      console.warn('Security Event:', event);
    }
  };

  const validateSession = async () => {
    if (!user) {
      setIsValidated(false);
      setIsLoading(false);
      return;
    }

    try {
      // Check rate limiting for session validation
      const rateLimitKey = `session_check_${user.id}`;
      const rateLimit = RateLimiter.checkRateLimit(rateLimitKey, 10, 60000); // 10 attempts per minute

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
        
        await supabase.auth.signOut();
        setIsValidated(false);
        setIsLoading(false);
        return;
      }

      // Verify the session is still valid
      const { data: session, error } = await supabase.auth.getSession();
      
      if (error || !session.session) {
        logSecurityEvent({
          type: 'failed_login',
          timestamp: new Date(),
          details: { reason: 'invalid_session', error: error?.message }
        });

        console.warn('Invalid session detected:', error);
        toast({
          title: "Session expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        setIsValidated(false);
        setIsLoading(false);
        return;
      }

      // Improved session expiration handling
      const sessionExpiresAt = session.session.expires_at;
      if (sessionExpiresAt) {
        const expirationTime = sessionExpiresAt * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;
        
        // Set session start time if not already set (for new sessions)
        if (!sessionStartTime) {
          setSessionStartTime(currentTime);
        }
        
        // Only show warning if:
        // 1. Session expires in less than 15 minutes (reduced from 1 hour)
        // 2. Session has been active for at least 10 minutes (prevents immediate warnings)
        // 3. More than 1 hour until expiry but session has been active for more than 12 hours
        const minimumActiveTime = 10 * 60 * 1000; // 10 minutes
        const warningThreshold = 15 * 60 * 1000; // 15 minutes
        const maxActiveTime = 12 * 60 * 60 * 1000; // 12 hours
        const sessionActiveTime = sessionStartTime ? currentTime - sessionStartTime : 0;
        
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
              sessionActiveTime,
              warningThreshold,
              minimumActiveTime
            }
          });

          const message = warningType === 'session_near_expiry' 
            ? `Your session will expire in ${Math.round(timeUntilExpiry / (60 * 1000))} minutes. Please save your work.`
            : "Your session has been active for a long time. Consider signing out and back in for security.";

          toast({
            title: "Session Warning",
            description: message,
            variant: "destructive",
          });
        }
        
        // Auto-refresh token if expiring within 30 minutes and session is active
        if (timeUntilExpiry < 30 * 60 * 1000 && sessionActiveTime > minimumActiveTime) {
          console.log('Attempting to refresh session token...');
          try {
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (!refreshError) {
              console.log('Session token refreshed successfully');
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

      // Check if profile exists and is active
      if (profile && profile.is_active === false) {
        logSecurityEvent({
          type: 'failed_login',
          timestamp: new Date(),
          details: { reason: 'account_deactivated', userId: user.id }
        });

        toast({
          title: "Account deactivated",
          description: "Your account has been deactivated. Please contact support.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        setIsValidated(false);
        setIsLoading(false);
        return;
      }

      // Validate user permissions haven't changed
      if (profile) {
        const { data: currentProfile, error: profileError } = await supabase
          .from('profiles')
          .select('role, is_active')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile validation error:', profileError);
        } else if (currentProfile && (
          currentProfile.role !== profile.role || 
          currentProfile.is_active !== profile.is_active
        )) {
          logSecurityEvent({
            type: 'suspicious_activity',
            timestamp: new Date(),
            details: { 
              reason: 'profile_permissions_changed', 
              oldRole: profile.role,
              newRole: currentProfile.role,
              oldActive: profile.is_active,
              newActive: currentProfile.is_active
            }
          });

          toast({
            title: "Permissions Updated",
            description: "Your account permissions have been updated. Please sign in again.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          setIsValidated(false);
          setIsLoading(false);
          return;
        }
      }

      logSecurityEvent({
        type: 'login_attempt',
        timestamp: new Date(),
        details: { status: 'success', userId: user.id }
      });

      setIsValidated(true);
      setIsLoading(false);
    } catch (error) {
      logSecurityEvent({
        type: 'failed_login',
        timestamp: new Date(),
        details: { reason: 'validation_error', error: error instanceof Error ? error.message : 'Unknown error' }
      });

      console.error('Session validation error:', error);
      setIsValidated(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateSession();

    // Set up auth state change listener for real-time session validation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsValidated(false);
          setSecurityEvents([]);
          setSessionStartTime(null);
          SecurityHeaders.storeCSRFToken(''); // Clear CSRF token
        } else if (event === 'TOKEN_REFRESHED') {
          logSecurityEvent({
            type: 'token_refresh',
            timestamp: new Date(),
            details: { userId: session?.user?.id }
          });
          setIsValidated(!!session);
        } else if (event === 'SIGNED_IN') {
          // Re-generate CSRF token on sign in
          const newToken = SecurityHeaders.generateCSRFToken();
          SecurityHeaders.storeCSRFToken(newToken);
          setCsrfToken(newToken);
          
          // Set session start time for new login
          setSessionStartTime(Date.now());
          
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

  // Security monitoring
  const detectSuspiciousActivity = () => {
    const recentEvents = securityEvents.filter(
      event => Date.now() - event.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    const failedLogins = recentEvents.filter(event => event.type === 'failed_login').length;
    const suspiciousEvents = recentEvents.filter(event => event.type === 'suspicious_activity').length;

    return {
      isSuspicious: failedLogins > 3 || suspiciousEvents > 1,
      failedLogins,
      suspiciousEvents,
      recentEvents: recentEvents.length
    };
  };

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
