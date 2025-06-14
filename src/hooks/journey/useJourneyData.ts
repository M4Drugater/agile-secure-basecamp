
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
  });

  const updateJourney = useMutation({
    mutationFn: async (updates: Partial<UserJourney>) => {
      if (!user) throw new Error('User not authenticated');

      try {
        const { data, error } = await supabase
          .from('user_journey')
          .upsert({
            user_id: user.id,
            ...updates,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

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
  });

  return {
    userJourney,
    isLoading,
    updateJourney
  };
}
