
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
  document_category?: string;
}

export function useSystemKnowledge() {
  const queryClient = useQueryClient();

  const {
    data: documents,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['systemKnowledge'],
    queryFn: async () => {
      // First get traditional system knowledge
      const { data: systemData, error: systemError } = await supabase
        .from('system_knowledge_base')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('updated_at', { ascending: false });

      if (systemError) throw systemError;

      // Now get user files marked as system knowledge
      const { data: userFileSystemData, error: userFileError } = await supabase
        .from('user_knowledge_files')
        .select('*')
        .eq('document_category', 'system')
        .eq('processing_status', 'completed')
        .order('updated_at', { ascending: false });

      if (userFileError) throw userFileError;

      // Transform user files to match system knowledge format
      const transformedUserFiles = (userFileSystemData || []).map(file => ({
        id: file.id,
        title: file.title,
        content: file.content || file.extracted_content || file.ai_summary || file.description || '',
        category: 'User Contributed',
        subcategory: file.tags?.length > 0 ? file.tags[0] : undefined,
        knowledge_type: 'framework',
        tags: file.tags,
        priority: 5, // Medium priority
        usage_count: 0,
        effectiveness_score: 0,
        is_active: true,
        source_type: file.source_type || 'user',
        version: file.version || 1,
        parent_id: file.parent_id,
        is_template: file.is_template || false,
        metadata: file.metadata,
        created_at: file.created_at,
        updated_at: file.updated_at,
        created_by: null,
        last_updated_by: null,
        document_category: 'system'
      }));
      
      // Combine both sources of system knowledge
      return [...(systemData || []), ...transformedUserFiles];
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
    refetch
  };
}
