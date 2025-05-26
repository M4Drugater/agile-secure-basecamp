import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration_hours: number;
  prerequisites: string[];
  learning_objectives: string[];
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  enrollment_count: number;
  completion_rate: number;
  average_rating: number;
  metadata: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLearningPathData {
  title?: string;
  description?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration_hours?: number;
  prerequisites?: string[];
  learning_objectives?: string[];
  tags?: string[];
  is_published?: boolean;
  is_featured?: boolean;
  metadata?: any;
}

export interface UpdateLearningPathData {
  id: string;
  title?: string;
  description?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration_hours?: number;
  prerequisites?: string[];
  learning_objectives?: string[];
  tags?: string[];
  is_published?: boolean;
  is_featured?: boolean;
  metadata?: any;
}

export function useLearningPaths() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: learningPaths,
    isLoading,
    error
  } = useQuery({
    queryKey: ['learningPaths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LearningPath[];
    },
    enabled: !!user,
  });

  const createPath = useMutation({
    mutationFn: async (pathData: CreateLearningPathData) => {
      const { data, error } = await supabase
        .from('learning_paths')
        .insert({
          ...pathData,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningPaths'] });
      toast({
        title: "Success",
        description: "Learning path created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create learning path",
        variant: "destructive",
      });
    },
  });

  const updatePath = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateLearningPathData) => {
      const { data, error } = await supabase
        .from('learning_paths')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningPaths'] });
      toast({
        title: "Success",
        description: "Learning path updated successfully",
      });
    },
  });

  const deletePath = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('learning_paths')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningPaths'] });
      toast({
        title: "Success",
        description: "Learning path deleted successfully",
      });
    },
  });

  return {
    learningPaths,
    isLoading,
    error,
    createPath: createPath.mutate,
    updatePath: updatePath.mutate,
    deletePath: deletePath.mutate,
    isCreating: createPath.isPending,
    isUpdating: updatePath.isPending,
    isDeleting: deletePath.isPending,
  };
}
