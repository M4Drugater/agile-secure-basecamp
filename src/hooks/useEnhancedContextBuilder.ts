
import { useProfileContextBuilder } from './useProfileContextBuilder';
import { useKnowledgeContextBuilder } from './useKnowledgeContextBuilder';
import { useContentLearningContext } from './useContentLearningContext';
import { useUserActivityContext } from './useUserActivityContext';
import { useConversationContext } from './useConversationContext';

interface EnhancedContext {
  profile: string;
  knowledge: string;
  content: string;
  learning: string;
  activity: string;
  conversations: string;
}

interface ContextSummary {
  hasProfile: boolean;
  knowledgeCount: number;
  contentCount: number;
  learningCount: number;
  activityCount: number;
  conversationCount: number;
}

export function useEnhancedContextBuilder() {
  const { buildProfileContextString, hasProfileContext } = useProfileContextBuilder();
  const { buildKnowledgeContextString, knowledgeCount } = useKnowledgeContextBuilder();
  const { buildContentContext, buildLearningContext, contentCount, learningCount } = useContentLearningContext();
  const { buildActivityContext, activityCount } = useUserActivityContext();
  const { buildConversationContext, conversationCount } = useConversationContext();

  const buildEnhancedContext = async (userMessage: string): Promise<EnhancedContext> => {
    const knowledgeContext = await buildKnowledgeContextString(userMessage);
    
    return {
      profile: buildProfileContextString(),
      knowledge: knowledgeContext,
      content: buildContentContext(),
      learning: buildLearningContext(),
      activity: buildActivityContext(),
      conversations: buildConversationContext(),
    };
  };

  const buildFullContextString = async (userMessage: string): Promise<string> => {
    const contexts = await buildEnhancedContext(userMessage);
    
    let fullContext = '';
    if (contexts.profile) fullContext += contexts.profile;
    if (contexts.knowledge) fullContext += contexts.knowledge;
    if (contexts.content) fullContext += contexts.content;
    if (contexts.learning) fullContext += contexts.learning;
    if (contexts.activity) fullContext += contexts.activity;
    if (contexts.conversations) fullContext += contexts.conversations;
    
    return fullContext;
  };

  const getContextSummary = (): ContextSummary => {
    return {
      hasProfile: hasProfileContext || false,
      knowledgeCount: knowledgeCount || 0,
      contentCount: contentCount || 0,
      learningCount: learningCount || 0,
      activityCount: activityCount || 0,
      conversationCount: conversationCount || 0,
    };
  };

  return {
    buildEnhancedContext,
    buildFullContextString,
    getContextSummary,
  };
}
