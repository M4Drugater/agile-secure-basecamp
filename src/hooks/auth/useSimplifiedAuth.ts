
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useSimplifiedAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected profile fetch error:', error);
      return null;
    }
  }, []);

  // Validate session and profile
  const validateSession = useCallback(async () => {
    if (!user) {
      setIsValidated(false);
      return false;
    }

    try {
      const { data: session, error } = await supabase.auth.getSession();
      
      if (error || !session.session) {
        console.warn('Invalid session detected:', error);
        setIsValidated(false);
        return false;
      }

      // Check if profile is active
      if (profile && profile.is_active === false) {
        toast({
          title: "Account deactivated",
          description: "Your account has been deactivated. Please contact support.",
          variant: "destructive",
        });
        setIsValidated(false);
        return false;
      }

      setIsValidated(true);
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      setIsValidated(false);
      return false;
    }
  }, [user, profile]);

  // Role checking function
  const hasRole = useCallback((role: string) => {
    if (!profile) return false;
    return profile.role === role || 
           (role === 'user' && ['admin', 'super_admin'].includes(profile.role)) ||
           (role === 'admin' && profile.role === 'super_admin');
  }, [profile]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session initialization error:', error);
          if (mounted) {
            setUser(null);
            setProfile(null);
            setIsValidated(false);
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          setUser(session.user);
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        } else if (mounted) {
          setUser(null);
          setProfile(null);
          setIsValidated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setIsValidated(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [fetchProfile]);

  // Set up auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);

        switch (event) {
          case 'SIGNED_OUT':
            setUser(null);
            setProfile(null);
            setIsValidated(false);
            break;

          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
            if (session?.user) {
              setUser(session.user);
              const userProfile = await fetchProfile(session.user.id);
              setProfile(userProfile);
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
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Validate session when user or profile changes
  useEffect(() => {
    if (user && profile) {
      validateSession();
    }
  }, [user, profile, validateSession]);

  return {
    isAuthenticated: !!user && isValidated,
    isLoading,
    user,
    profile,
    hasRole,
    validateSession
  };
}
