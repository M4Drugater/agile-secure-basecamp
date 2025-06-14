
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useJourneyData } from './useJourneyData';
import { supabase } from '@/integrations/supabase/client';

export function useJourneyInitialization() {
  const { user, profile } = useAuth();
  const { userJourney, updateJourney } = useJourneyData();
  const initializationRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Reset initialization flag when user changes
    if (userIdRef.current !== user?.id) {
      initializationRef.current = false;
      userIdRef.current = user?.id || null;
    }

    // Skip if no user, already initialized, or journey already exists
    if (!user || initializationRef.current || userJourney !== null) {
      return;
    }

    const initializeJourney = async () => {
      try {
        // Mark as initializing to prevent duplicate attempts
        initializationRef.current = true;

        // Use the new safe upsert function to prevent constraint violations
        const { data, error } = await supabase.rpc('upsert_user_journey', {
          p_user_id: user.id,
          p_current_step: 0,
          p_completed_steps: [],
          p_profile_completed: false,
          p_knowledge_setup: false,
          p_first_chat_completed: false,
          p_first_content_created: false,
          p_cdv_introduced: false
        });

        if (error) {
          console.error('Journey initialization error:', error);
          initializationRef.current = false; // Reset on error
          return;
        }

        // Optionally trigger a refetch of journey data
        // The updateJourney mutation will handle cache invalidation
      } catch (error) {
        console.error('Journey initialization failed:', error);
        initializationRef.current = false; // Reset on error
      }
    };

    initializeJourney();
  }, [user, userJourney, updateJourney, profile]);

  return { isInitialized: userJourney !== null };
}
