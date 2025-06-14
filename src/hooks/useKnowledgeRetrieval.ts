
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  relevance_score?: number;
}

export interface KnowledgeSearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string;
  relevance_score?: number;
  difficulty_level?: string;
  estimated_duration_hours?: number;
  enrollment_count?: number;
  tags?: string[];
}

export function useKnowledgeRetrieval() {
  const { user } = useAuth();

  const retrieveRelevantKnowledge = useCallback(async (query: string): Promise<KnowledgeItem[]> => {
    if (!user || !query.trim()) return [];

    try {
      // First try to get relevant knowledge from user's personal files
      const { data: userKnowledge, error: userError } = await supabase
        .from('user_knowledge_files')
        .select('id, title, content, file_type')
        .eq('user_id', user.id)
        .eq('processing_status', 'completed')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(5);

      if (userError) {
        console.error('Error fetching user knowledge:', userError);
      }

      // Then try to get relevant system knowledge
      const { data: systemKnowledge, error: systemError } = await supabase
        .from('system_knowledge_base')
        .select('id, title, content, category')
        .eq('is_active', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5);

      if (systemError) {
        console.error('Error fetching system knowledge:', systemError);
      }

      // Combine and format the results
      const knowledge: KnowledgeItem[] = [];

      if (userKnowledge) {
        userKnowledge.forEach(item => {
          knowledge.push({
            id: item.id,
            title: item.title,
            content: item.content || '',
            category: item.file_type || 'personal',
          });
        });
      }

      if (systemKnowledge) {
        systemKnowledge.forEach(item => {
          knowledge.push({
            id: item.id,
            title: item.title,
            content: item.content,
            category: item.category,
          });
        });
      }

      return knowledge;
    } catch (error) {
      console.error('Error retrieving relevant knowledge:', error);
      return [];
    }
  }, [user]);

  return {
    retrieveRelevantKnowledge,
  };
}
