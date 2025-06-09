
import { useKnowledgeRetrieval } from './useKnowledgeRetrieval';

export function useKnowledgeContextBuilder() {
  const { retrieveRelevantKnowledge } = useKnowledgeRetrieval();

  const buildKnowledgeContext = (): string => {
    // For now, return empty context as we don't have direct access to knowledge items
    // This would typically be populated by the knowledge retrieval system
    return '';
  };

  const buildKnowledgeContextString = async (userMessage: string): Promise<string> => {
    try {
      const relevantKnowledge = await retrieveRelevantKnowledge(userMessage);
      
      if (!relevantKnowledge || relevantKnowledge.length === 0) return '';

      let context = `
=== RELEVANT KNOWLEDGE BASE ===
`;
      relevantKnowledge.forEach((item, index) => {
        context += `${index + 1}. ${item.title}
   Category: ${item.category}
   Content: ${item.content.substring(0, 200)}${item.content.length > 200 ? '...' : ''}
`;
      });

      return context;
    } catch (error) {
      console.error('Error building knowledge context:', error);
      return '';
    }
  };

  return {
    buildKnowledgeContext,
    buildKnowledgeContextString,
    knowledgeCount: 0, // This would be populated by actual knowledge retrieval
  };
}
