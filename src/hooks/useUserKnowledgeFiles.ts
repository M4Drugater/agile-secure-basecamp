
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface UserKnowledgeFile {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  content?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  tags?: string[];
  summary?: string;
  key_insights?: string[];
  is_ai_processed?: boolean;
  processing_status?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export function useUserKnowledgeFiles() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: files,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userKnowledgeFiles', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_knowledge_files')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const createFile = useMutation({
    mutationFn: async (fileData: Omit<UserKnowledgeFile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_knowledge_files')
        .insert({
          user_id: user.id,
          ...fileData,
          processing_status: 'completed',
          is_ai_processed: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userKnowledgeFiles', user?.id] });
      toast({
        title: "Knowledge file created",
        description: "Your knowledge file has been added successfully.",
      });
    },
    onError: (error) => {
      console.error('Knowledge file creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create knowledge file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateFile = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<UserKnowledgeFile> & { id: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_knowledge_files')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userKnowledgeFiles', user?.id] });
      toast({
        title: "Knowledge file updated",
        description: "Your knowledge file has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Knowledge file update error:', error);
      toast({
        title: "Error",
        description: "Failed to update knowledge file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_knowledge_files')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userKnowledgeFiles', user?.id] });
      toast({
        title: "Knowledge file deleted",
        description: "Your knowledge file has been removed successfully.",
      });
    },
    onError: (error) => {
      console.error('Knowledge file deletion error:', error);
      toast({
        title: "Error",
        description: "Failed to delete knowledge file. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    files,
    isLoading,
    error,
    createFile: createFile.mutate,
    updateFile: updateFile.mutate,
    deleteFile: deleteFile.mutate,
    isCreating: createFile.isPending,
    isUpdating: updateFile.isPending,
    isDeleting: deleteFile.isPending,
  };
}
