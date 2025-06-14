
import { useProfileContext } from './useProfileContext';
import { useKnowledgeContext } from './useKnowledgeContext';
import { useContentContext } from './useContentContext';
import { useActivityContext } from './useActivityContext';
import { useConversationContext } from './useConversationContext';
import { useContextSummaryBuilder } from './useContextSummaryBuilder';
import { EnhancedContext, ContextSummary } from './types';

export function useContextBuilder() {
  const { buildProfileContext, hasProfileContext } = useProfileContext();
  const { buildKnowledgeContext, knowledgeCount } = useKnowledgeContext();
  const { buildContentContext, buildLearningContext, contentCount, learningCount } = useContentContext();
  const { buildActivityContext, activityCount } = useActivityContext();
  const { buildConversationContext, conversationCount } = useConversationContext();

  const buildEnhancedContext = async (userMessage: string): Promise<EnhancedContext> => {
    const knowledgeContext = await buildKnowledgeContext(userMessage);
    
    return {
      profile: buildProfileContext(),
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
    return useContextSummaryBuilder({
      hasProfile: hasProfileContext,
      knowledgeCount,
      contentCount,
      learningCount,
      activityCount,
      conversationCount,
    });
  };

  return {
    buildEnhancedContext,
    buildFullContextString,
    getContextSummary,
  };
}
