
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface KnowledgeFile {
  id: string;
  title: string;
  document_category: string;
  extracted_content: string | null;
}

export function useKnowledgeFileRetrieval() {
  const { user } = useAuth();
  const [knowledgeCount, setKnowledgeCount] = useState(0);

  const retrieveRelevantKnowledge = async (userMessage: string): Promise<KnowledgeFile[]> => {
    try {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_knowledge_files')
        .select(`
          id,
          title,
          document_category,
          extracted_content
        `)
        .eq('user_id', user.id)
        .eq('processing_status', 'completed')
        .limit(5);

      if (error) throw error;
      return (data || []) as KnowledgeFile[];
    } catch (error) {
      console.error('Error retrieving knowledge:', error);
      return [];
    }
  };

  const buildKnowledgeContext = async (userMessage: string): Promise<string> => {
    try {
      const relevantKnowledge = await retrieveRelevantKnowledge(userMessage);
      setKnowledgeCount(relevantKnowledge.length);
      
      if (!relevantKnowledge || relevantKnowledge.length === 0) return '';

      let context = `\n=== RELEVANT KNOWLEDGE BASE ===\n`;
      relevantKnowledge.forEach((item, index) => {
        context += `${index + 1}. ${item.title}
   Category: ${item.document_category}
   Content: ${item.extracted_content?.substring(0, 200)}${item.extracted_content && item.extracted_content.length > 200 ? '...' : ''}
`;
      });

      return context;
    } catch (error) {
      console.error('Error building knowledge context:', error);
      setKnowledgeCount(0);
      return '';
    }
  };

  return {
    buildKnowledgeContext,
    knowledgeCount,
    retrieveRelevantKnowledge,
  };
}
