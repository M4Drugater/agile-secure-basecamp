
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function useProcessingQueue() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: processingQueue,
    isLoading: isLoadingQueue
  } = useQuery({
    queryKey: ['processingQueue', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('knowledge_processing_queue')
        .select(`
          *,
          user_knowledge_files!inner(user_id, title)
        `)
        .eq('user_knowledge_files.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const queueForProcessing = useMutation({
    mutationFn: async ({
      fileId,
      fileType,
      processingType = 'full',
      priority = 0
    }: {
      fileId: string;
      fileType: string;
      processingType?: string;
      priority?: number;
    }) => {
      const { data, error } = await supabase
        .from('knowledge_processing_queue')
        .insert({
          file_id: fileId,
          file_type: fileType,
          processing_type: processingType,
          priority: priority,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processingQueue'] });
      toast({
        title: "Queued for Processing",
        description: "Your file has been queued for AI processing.",
      });
    },
    onError: (error) => {
      console.error('Error queuing file:', error);
      toast({
        title: "Queue Error",
        description: "Failed to queue file for processing.",
        variant: "destructive",
      });
    },
  });

  return {
    processingQueue,
    isLoadingQueue,
    queueForProcessing: queueForProcessing.mutate,
    isQueuingFile: queueForProcessing.isPending,
  };
}
