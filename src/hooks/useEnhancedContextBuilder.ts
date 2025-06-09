
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

export function useEnhancedContextBuilder() {
  const { buildProfileContext, hasProfile } = useProfileContextBuilder();
  const { buildKnowledgeContext, knowledgeCount } = useKnowledgeContextBuilder();
  const { buildContentContext, buildLearningContext, contentCount, learningCount } = useContentLearningContext();
  const { buildActivityContext, activityCount } = useUserActivityContext();
  const { buildConversationContext, conversationCount } = useConversationContext();

  const buildEnhancedContext = (userMessage: string): EnhancedContext => {
    return {
      profile: buildProfileContext(),
      knowledge: buildKnowledgeContext(),
      content: buildContentContext(),
      learning: buildLearningContext(),
      activity: buildActivityContext(),
      conversations: buildConversationContext(),
    };
  };

  const buildFullContextString = (userMessage: string): string => {
    const contexts = buildEnhancedContext(userMessage);
    
    let fullContext = '';
    if (contexts.profile) fullContext += contexts.profile;
    if (contexts.knowledge) fullContext += contexts.knowledge;
    if (contexts.content) fullContext += contexts.content;
    if (contexts.learning) fullContext += contexts.learning;
    if (contexts.activity) fullContext += contexts.activity;
    if (contexts.conversations) fullContext += contexts.conversations;
    
    return fullContext;
  };

  const getContextSummary = () => {
    return {
      hasProfile,
      knowledgeCount,
      contentCount,
      learningCount,
      activityCount,
      conversationCount,
    };
  };

  return {
    buildEnhancedContext,
    buildFullContextString,
    getContextSummary,
  };
}
