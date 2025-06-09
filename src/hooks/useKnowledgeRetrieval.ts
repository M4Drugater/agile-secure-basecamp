
import { useKnowledgeBase } from './useKnowledgeBase';

interface KnowledgeItem {
  title: string;
  category: string;
  content: string;
}

export function useKnowledgeRetrieval() {
  const { searchKnowledge } = useKnowledgeBase();

  const retrieveRelevantKnowledge = async (userMessage: string): Promise<KnowledgeItem[]> => {
    try {
      const results = await searchKnowledge(userMessage, 5);
      
      return results.map(result => ({
        title: result.title,
        category: result.category || 'General',
        content: result.content || result.summary || '',
      }));
    } catch (error) {
      console.error('Error retrieving relevant knowledge:', error);
      return [];
    }
  };

  return {
    retrieveRelevantKnowledge,
  };
}
