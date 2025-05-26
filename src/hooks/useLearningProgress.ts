
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface UserLearningProgress {
  id: string;
  user_id: string;
  learning_path_id: string;
  current_module_id?: string;
  enrollment_date: string;
  completion_date?: string;
  progress_percentage: number;
  time_spent_minutes: number;
  current_streak_days: number;
  best_streak_days: number;
  last_activity_at: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'dropped';
  performance_metrics: any;
  ai_recommendations: any;
  created_at: string;
  updated_at: string;
}

export interface ModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  learning_path_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  progress_percentage: number;
  time_spent_minutes: number;
  score?: number;
  attempts: number;
  first_accessed_at?: string;
  completed_at?: string;
  ai_feedback: any;
  interaction_data: any;
  created_at: string;
  updated_at: string;
}

export function useLearningProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: userProgress,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userLearningProgress', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_learning_progress')
        .select(`
          *,
          learning_paths:learning_path_id (
            title,
            description,
            difficulty_level,
            estimated_duration_hours
          )
        `)
        .eq('user_id', user?.id)
        .order('last_activity_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const enrollInPath = useMutation({
    mutationFn: async (learningPathId: string) => {
      const { data, error } = await supabase
        .from('user_learning_progress')
        .insert({
          user_id: user?.id,
          learning_path_id: learningPathId,
          status: 'in_progress',
          enrollment_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLearningProgress'] });
      toast({
        title: "Success",
        description: "Successfully enrolled in learning path",
      });
    },
  });

  const updateProgress = useMutation({
    mutationFn: async (updates: Partial<UserLearningProgress> & { learning_path_id: string }) => {
      const { data, error } = await supabase
        .from('user_learning_progress')
        .update({
          ...updates,
          last_activity_at: new Date().toISOString(),
        })
        .eq('user_id', user?.id)
        .eq('learning_path_id', updates.learning_path_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLearningProgress'] });
    },
  });

  const updateModuleProgress = useMutation({
    mutationFn: async (moduleProgress: Partial<ModuleProgress> & { module_id: string }) => {
      const { data, error } = await supabase
        .from('module_progress')
        .upsert({
          user_id: user?.id,
          ...moduleProgress,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLearningProgress'] });
      queryClient.invalidateQueries({ queryKey: ['moduleProgress'] });
    },
  });

  return {
    userProgress,
    isLoading,
    error,
    enrollInPath: enrollInPath.mutate,
    updateProgress: updateProgress.mutate,
    updateModuleProgress: updateModuleProgress.mutate,
    isEnrolling: enrollInPath.isPending,
    isUpdating: updateProgress.isPending,
  };
}
