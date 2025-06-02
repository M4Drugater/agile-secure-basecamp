
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useSecureAuth() {
  const { user, profile } = useAuth();
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateUserSession = async () => {
      if (!user) {
        setIsValidated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verify the session is still valid
        const { data: session, error } = await supabase.auth.getSession();
        
        if (error || !session.session) {
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

        // Check if profile exists and is active
        if (profile && profile.is_active === false) {
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

        setIsValidated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Session validation error:', error);
        setIsValidated(false);
        setIsLoading(false);
      }
    };

    validateUserSession();

    // Set up auth state change listener for real-time session validation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setIsValidated(!!session);
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
    hasRole: (role: string) => {
      if (!profile) return false;
      return profile.role === role || 
             (role === 'user' && ['admin', 'super_admin'].includes(profile.role)) ||
             (role === 'admin' && profile.role === 'super_admin');
    }
  };
}
