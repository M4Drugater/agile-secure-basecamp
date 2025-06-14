
import { useContentLearningContext } from '../useContentLearningContext';

export function useContentContext() {
  const { buildContentContext, buildLearningContext, contentCount, learningCount } = useContentLearningContext();

  return {
    buildContentContext,
    buildLearningContext,
    contentCount: contentCount || 0,
    learningCount: learningCount || 0,
  };
}
