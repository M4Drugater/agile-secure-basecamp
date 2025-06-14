
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserJourney } from './types';

export function useJourneyData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userJourney, isLoading } = useQuery({
    queryKey: ['userJourney', user?.id],
    queryFn: async () => {
      if (!user) return null;

      try {
        const { data, error } = await supabase
          .from('user_journey')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user journey:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Error in userJourney query:', error);
        return null;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Reduce unnecessary refetches
  });

  const updateJourney = useMutation({
    mutationFn: async (updates: Partial<UserJourney>) => {
      if (!user) throw new Error('User not authenticated');

      try {
        // Use the safe upsert function to prevent constraint violations
        const { data, error } = await supabase.rpc('upsert_user_journey', {
          p_user_id: user.id,
          p_current_step: updates.current_step,
          p_completed_steps: updates.completed_steps,
          p_profile_completed: updates.profile_completed,
          p_knowledge_setup: updates.knowledge_setup,
          p_first_chat_completed: updates.first_chat_completed,
          p_first_content_created: updates.first_content_created,
          p_cdv_introduced: updates.cdv_introduced
        });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating user journey:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userJourney', user?.id] });
    },
    onError: (error) => {
      console.error('Journey update failed:', error);
    }
  });

  return {
    userJourney,
    isLoading,
    updateJourney
  };
}
