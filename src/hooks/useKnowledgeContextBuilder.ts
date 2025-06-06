
import { useKnowledgeContext } from '@/hooks/useKnowledgeContext';

export function useKnowledgeContextBuilder() {
  const { buildContext } = useKnowledgeContext();

  const buildKnowledgeContextString = async (userMessage: string): Promise<string> => {
    try {
      return buildContext(userMessage);
    } catch (error) {
      console.error('Error building knowledge context:', error);
      return '';
    }
  };

  return {
    buildKnowledgeContextString,
  };
}
