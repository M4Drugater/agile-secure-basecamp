
import { useKnowledgeContext } from '@/hooks/useKnowledgeContext';

export function useKnowledgeContextBuilder() {
  const { buildKnowledgeContext } = useKnowledgeContext();

  const buildKnowledgeContextString = async (userMessage: string): Promise<string> => {
    try {
      return await buildKnowledgeContext(userMessage);
    } catch (error) {
      console.error('Error building knowledge context:', error);
      return '';
    }
  };

  return {
    buildKnowledgeContextString,
  };
}
