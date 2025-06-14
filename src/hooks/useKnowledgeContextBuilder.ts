
import { useState, useEffect } from 'react';
import { useKnowledgeRetrieval } from './useKnowledgeRetrieval';

export function useKnowledgeContextBuilder() {
  const { retrieveRelevantKnowledge } = useKnowledgeRetrieval();
  const [knowledgeCount, setKnowledgeCount] = useState(0);

  const buildKnowledgeContextString = async (userMessage: string): Promise<string> => {
    try {
      const relevantKnowledge = await retrieveRelevantKnowledge(userMessage);
      setKnowledgeCount(relevantKnowledge.length);
      
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
      setKnowledgeCount(0);
      return '';
    }
  };

  return {
    buildKnowledgeContextString,
    knowledgeCount,
  };
}
