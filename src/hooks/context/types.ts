
export interface EnhancedContext {
  profile: string;
  knowledge: string;
  content: string;
  learning: string;
  activity: string;
  conversations: string;
}

export interface ContextSummary {
  hasProfile: boolean;
  knowledgeCount: number;
  contentCount: number;
  learningCount: number;
  activityCount: number;
  conversationCount: number;
}
