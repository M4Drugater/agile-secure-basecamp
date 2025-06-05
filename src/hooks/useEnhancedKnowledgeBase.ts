
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface KnowledgeRecommendation {
  id: string;
  title: string;
  description: string;
  content_snippet: string;
  knowledge_type: 'personal' | 'system';
  relevance_score: number;
}

export interface ProcessingQueueItem {
  id: string;
  file_id: string;
  file_type: string;
  processing_type: string;
  priority: number;
  status: string;
  attempts: number;
  max_attempts: number;
  error_message?: string;
  scheduled_for: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface KnowledgeConfig {
  id: string;
  config_key: string;
  config_value: any;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useEnhancedKnowledgeBase() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get knowledge recommendations based on search text
  const getRecommendations = async (searchText: string): Promise<KnowledgeRecommendation[]> => {
    if (!searchText.trim()) return [];

    const { data, error } = await supabase.rpc('get_knowledge_recommendations', {
      search_text: searchText,
      user_uuid: user?.id
    });

    if (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }

    // Type-cast the returned data to ensure proper typing
    return (data || []).map(item => ({
      ...item,
      knowledge_type: item.knowledge_type as 'personal' | 'system'
    }));
  };

  // Get processing queue for current user
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

  // Get knowledge base configuration (admin only)
  const {
    data: config,
    isLoading: isLoadingConfig
  } = useQuery({
    queryKey: ['knowledgeConfig'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_base_config')
        .select('*')
        .eq('is_active', true)
        .order('config_key');

      if (error) {
        // Non-admin users won't have access, that's expected
        console.log('Config access denied (expected for non-admin users)');
        return [];
      }
      return data || [];
    },
  });

  // Queue file for processing
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

  // Update knowledge base configuration (admin only)
  const updateConfig = useMutation({
    mutationFn: async ({
      configKey,
      configValue,
      description
    }: {
      configKey: string;
      configValue: any;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from('knowledge_base_config')
        .upsert({
          config_key: configKey,
          config_value: configValue,
          description: description,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeConfig'] });
      toast({
        title: "Configuration Updated",
        description: "Knowledge base configuration has been updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating config:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update configuration.",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    processingQueue,
    config,
    
    // Loading states
    isLoadingQueue,
    isLoadingConfig,
    
    // Actions
    getRecommendations,
    queueForProcessing: queueForProcessing.mutate,
    updateConfig: updateConfig.mutate,
    
    // Loading states for mutations
    isQueuingFile: queueForProcessing.isPending,
    isUpdatingConfig: updateConfig.isPending,
  };
}
