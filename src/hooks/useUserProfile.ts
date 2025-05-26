
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  current_position?: string;
  company?: string;
  industry?: string;
  experience_level?: string;
  years_of_experience?: number;
  management_level?: string;
  team_size?: number;
  leadership_experience?: boolean;
  target_position?: string;
  target_industry?: string;
  target_salary_range?: string;
  career_goals?: string[];
  current_skills?: string[];
  skill_gaps?: string[];
  learning_priorities?: string[];
  learning_style?: string;
  communication_style?: string;
  feedback_preference?: string;
  work_environment?: string;
  certifications?: string[];
  profile_completeness?: number;
  last_updated?: string;
  created_at: string;
  updated_at: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });

  const createOrUpdateProfile = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...profileData,
          last_updated: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: createOrUpdateProfile.mutate,
    isUpdating: createOrUpdateProfile.isPending,
  };
}
