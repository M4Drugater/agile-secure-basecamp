
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface LearningModule {
  id: string;
  learning_path_id: string;
  title: string;
  description: string;
  content: string;
  module_type: 'video' | 'text' | 'interactive' | 'quiz' | 'assignment' | 'discussion';
  order_index: number;
  estimated_duration_minutes: number;
  is_required: boolean;
  passing_score: number;
  resources: any[];
  ai_enhanced_content?: string;
  personalization_data: any;
  created_at: string;
  updated_at: string;
}

export function useLearningModules(learningPathId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: modules,
    isLoading,
    error
  } = useQuery({
    queryKey: ['learningModules', learningPathId],
    queryFn: async () => {
      const query = supabase
        .from('learning_modules')
        .select('*')
        .order('order_index', { ascending: true });

      if (learningPathId) {
        query.eq('learning_path_id', learningPathId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as LearningModule[];
    },
    enabled: !!user,
  });

  const createModule = useMutation({
    mutationFn: async (moduleData: Partial<LearningModule>) => {
      const { data, error } = await supabase
        .from('learning_modules')
        .insert(moduleData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningModules'] });
      toast({
        title: "Success",
        description: "Learning module created successfully",
      });
    },
  });

  const updateModule = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LearningModule> & { id: string }) => {
      const { data, error } = await supabase
        .from('learning_modules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningModules'] });
      toast({
        title: "Success",
        description: "Learning module updated successfully",
      });
    },
  });

  const deleteModule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('learning_modules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningModules'] });
      toast({
        title: "Success",
        description: "Learning module deleted successfully",
      });
    },
  });

  return {
    modules,
    isLoading,
    error,
    createModule: createModule.mutate,
    updateModule: updateModule.mutate,
    deleteModule: deleteModule.mutate,
    isCreating: createModule.isPending,
    isUpdating: updateModule.isPending,
    isDeleting: deleteModule.isPending,
  };
}
