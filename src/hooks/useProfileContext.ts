
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProfileContext {
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
}

export function useProfileContext() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profileContext', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          full_name,
          current_position,
          company,
          industry,
          experience_level,
          years_of_experience,
          management_level,
          team_size,
          leadership_experience,
          target_position,
          target_industry,
          target_salary_range,
          career_goals,
          current_skills,
          skill_gaps,
          learning_priorities,
          learning_style,
          communication_style,
          feedback_preference,
          work_environment,
          certifications
        `)
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile context:', error);
        return null;
      }

      return data as ProfileContext;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
