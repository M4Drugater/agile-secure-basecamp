
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SystemKnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  knowledge_type: string;
  tags?: string[];
  priority: number;
  is_active: boolean;
  context_triggers?: string[];
  usage_count: number;
  effectiveness_score: number;
  metadata?: any;
  created_at: string;
  updated_at: string;
  created_by?: string;
  last_updated_by?: string;
}

export function useSystemKnowledge() {
  const { user } = useAuth();

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
    enabled: !!user,
  });

  return {
    documents,
    isLoading,
    error,
  };
}
