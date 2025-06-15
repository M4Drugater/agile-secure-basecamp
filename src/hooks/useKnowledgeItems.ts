
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface KnowledgeItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  type?: string;
  tags?: string[];
}

export function useKnowledgeItems() {
  const { user } = useAuth();

  const { data: knowledgeItems, isLoading, error } = useQuery({
    queryKey: ['knowledge-items'],
    queryFn: async () => {
      // Return mock data for now since table may not exist
      return [
        {
          id: '1',
          title: 'Strategic Leadership Framework',
          description: 'Comprehensive framework for strategic leadership development',
          content: 'Leadership content...',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: user?.id || '',
          type: 'framework',
          tags: ['leadership', 'strategy']
        },
        {
          id: '2',
          title: 'Digital Transformation Best Practices',
          description: 'Key practices for successful digital transformation',
          content: 'Digital transformation content...',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: user?.id || '',
          type: 'best-practices',
          tags: ['digital', 'transformation']
        }
      ] as KnowledgeItem[];
    },
    enabled: !!user,
  });

  return {
    knowledgeItems: knowledgeItems || [],
    isLoading,
    error
  };
}
