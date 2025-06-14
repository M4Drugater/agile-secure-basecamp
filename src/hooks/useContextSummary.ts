
export interface ContextSummary {
  hasProfile: boolean;
  knowledgeCount: number;
  contentCount: number;
  learningCount: number;
  activityCount: number;
  conversationCount: number;
  totalItems: number;
  quality: 'basic' | 'good' | 'excellent';
}

interface ContextSummaryProps {
  hasProfile: boolean;
  knowledgeCount: number;
  contentCount: number;
  learningCount: number;
  activityCount: number;
  conversationCount: number;
}

export function useContextSummary({
  hasProfile,
  knowledgeCount,
  contentCount,
  learningCount,
  activityCount,
  conversationCount,
}: ContextSummaryProps): ContextSummary {
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
    totalItems,
    quality,
  };
}
