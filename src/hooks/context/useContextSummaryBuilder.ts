
import { ContextSummary } from './types';

interface ContextSummaryBuilderProps {
  hasProfile: boolean;
  knowledgeCount: number;
  contentCount: number;
  learningCount: number;
  activityCount: number;
  conversationCount: number;
}

export function useContextSummaryBuilder({
  hasProfile,
  knowledgeCount,
  contentCount,
  learningCount,
  activityCount,
  conversationCount,
}: ContextSummaryBuilderProps): ContextSummary {
  return {
    hasProfile,
    knowledgeCount,
    contentCount,
    learningCount,
    activityCount,
    conversationCount,
  };
}
