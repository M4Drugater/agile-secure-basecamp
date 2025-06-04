
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SecurityEvent } from './types';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UseAuthStateManagerProps {
  logSecurityEvent: (event: SecurityEvent) => void;
  clearSecurityEvents: () => void;
  resetSessionStartTime: () => void;
  clearCSRFToken: () => void;
  regenerateCSRFToken: () => string;
  setNewSessionStartTime: () => void;
}

export function useAuthStateManager({
  logSecurityEvent,
  clearSecurityEvents,
  resetSessionStartTime,
  clearCSRFToken,
  regenerateCSRFToken,
  setNewSessionStartTime
}: UseAuthStateManagerProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Fetch user profile with error handling
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        setAuthError('Failed to load user profile');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected profile fetch error:', error);
      setAuthError('Unexpected error loading profile');
      return null;
    }
  }, []);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session initialization error:', error);
        setAuthError('Failed to initialize session');
        setUser(null);
        setProfile(null);
        setIsValidated(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
        
        if (userProfile) {
          logSecurityEvent({
            type: 'login_attempt',
            timestamp: new Date(),
            details: { status: 'success', userId: session.user.id }
          });
        }
      } else {
        setUser(null);
        setProfile(null);
        setIsValidated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthError('Failed to initialize authentication');
      setUser(null);
      setProfile(null);
      setIsValidated(false);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile, logSecurityEvent]);

  // Setup auth state change listener
  const setupAuthStateListener = useCallback(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setAuthError(null);

          switch (event) {
            case 'SIGNED_OUT':
              setUser(null);
              setProfile(null);
              setIsValidated(false);
              clearSecurityEvents();
              resetSessionStartTime();
              clearCSRFToken();
              break;

            case 'TOKEN_REFRESHED':
              if (session?.user) {
                setUser(session.user);
                logSecurityEvent({
                  type: 'token_refresh',
                  timestamp: new Date(),
                  details: { userId: session.user.id }
                });
                setIsValidated(!!session);
              }
              break;

            case 'SIGNED_IN':
              if (session?.user) {
                setUser(session.user);
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
                
                // Re-generate CSRF token on sign in
                regenerateCSRFToken();
                setNewSessionStartTime();
                
                logSecurityEvent({
                  type: 'login_attempt',
                  timestamp: new Date(),
                  details: { status: 'success', userId: session.user.id }
                });
              }
              break;

            case 'USER_UPDATED':
              if (session?.user) {
                setUser(session.user);
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
              }
              break;

            default:
              break;
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setAuthError('Authentication state error occurred');
        }
      }
    );

    return subscription;
  }, [
    fetchProfile,
    logSecurityEvent,
    clearSecurityEvents,
    resetSessionStartTime,
    clearCSRFToken,
    regenerateCSRFToken,
    setNewSessionStartTime
  ]);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    profile,
    isValidated,
    setIsValidated,
    isLoading,
    setIsLoading,
    authError,
    setupAuthStateListener,
    refreshProfile: () => user ? fetchProfile(user.id) : Promise.resolve(null)
  };
}
