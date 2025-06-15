
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
}

export function useLearningPaths() {
  const { user } = useAuth();

  const { data: learningPaths, isLoading } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: async () => {
      // Return empty array for now since table may not exist
      return [] as LearningPath[];
    },
    enabled: !!user,
  });

  return {
    learningPaths: learningPaths || [],
    isLoading,
  };
}
