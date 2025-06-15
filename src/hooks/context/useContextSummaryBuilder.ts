
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
  const totalItems = knowledgeCount + contentCount + learningCount + activityCount + conversationCount;
  let quality: 'basic' | 'good' | 'excellent' = 'basic';
  
  if (totalItems >= 10) quality = 'excellent';
  else if (totalItems >= 5) quality = 'good';

  return {
    hasProfile,
    knowledgeCount,
    contentCount,
    learningCount,
    activityCount,
    conversationCount,
    quality,
  };
}
