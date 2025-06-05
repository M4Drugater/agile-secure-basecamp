
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { KnowledgeRecommendation } from './types';

export function useKnowledgeRecommendations() {
  const { user } = useAuth();

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

  return {
    getRecommendations,
  };
}
