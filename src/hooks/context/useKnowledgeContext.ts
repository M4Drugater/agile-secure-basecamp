
import { useKnowledgeContextBuilder } from '../useKnowledgeContextBuilder';

export function useKnowledgeContext() {
  const { buildKnowledgeContextString, knowledgeCount } = useKnowledgeContextBuilder();

  return {
    buildKnowledgeContext: buildKnowledgeContextString,
    knowledgeCount: knowledgeCount || 0,
  };
}
