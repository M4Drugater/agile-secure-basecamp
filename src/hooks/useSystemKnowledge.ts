
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SystemKnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  knowledge_type: string;
  tags?: string[];
  priority: number;
  usage_count: number;
  effectiveness_score: number;
  is_active: boolean;
  source_type?: string;
  version?: number;
  parent_id?: string;
  is_template?: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
  created_by?: string;
  last_updated_by?: string;
}

export function useSystemKnowledge() {
  const queryClient = useQueryClient();

  const {
    data: documents,
    isLoading,
    error
  } = useQuery({
    queryKey: ['systemKnowledge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_knowledge_base')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const incrementUsage = useMutation({
    mutationFn: async (documentId: string) => {
      // Use the new function we created in the migration
      const { error } = await supabase.rpc('increment_system_knowledge_usage', {
        doc_id: documentId
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemKnowledge'] });
    },
    onError: (error) => {
      console.error('Error updating usage stats:', error);
    },
  });

  return {
    documents,
    isLoading,
    error,
    incrementUsage: incrementUsage.mutate,
  };
}
