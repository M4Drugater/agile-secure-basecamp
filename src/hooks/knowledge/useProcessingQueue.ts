
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

      // First get the processing queue items
      const { data: queueItems, error: queueError } = await supabase
        .from('knowledge_processing_queue')
        .select('*')
        .order('created_at', { ascending: false });

      if (queueError) throw queueError;

      // Then get the user knowledge files separately and match them
      const { data: userFiles, error: filesError } = await supabase
        .from('user_knowledge_files')
        .select('id, title, user_id')
        .eq('user_id', user.id);

      if (filesError) throw filesError;

      // Create a map for quick lookup
      const filesMap = new Map(userFiles?.map(file => [file.id, file]) || []);

      // Combine the data
      const enrichedQueue = queueItems?.map(item => ({
        ...item,
        user_knowledge_files: filesMap.get(item.file_id) || null
      })).filter(item => item.user_knowledge_files !== null) || [];

      return enrichedQueue;
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
