
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useKnowledgeFileRetrieval } from './useKnowledgeFileRetrieval';
import { useMockContextBuilders } from './useMockContextBuilders';
import { useContextSummary, type ContextSummary } from './useContextSummary';

export interface ConsolidatedContext {
  profile: string;
  knowledge: string;
  content: string;
  learning: string;
  activity: string;
  conversations: string;
}

export type { ContextSummary };

export function useConsolidatedContext() {
  const { user } = useAuth();
  const { buildKnowledgeContext, knowledgeCount } = useKnowledgeFileRetrieval();
  const {
    buildContentContext,
    buildLearningContext,
    buildActivityContext,
    buildConversationContext,
    contentCount,
    learningCount,
    activityCount,
    conversationCount,
  } = useMockContextBuilders();

  // Profile Context
  const profileQuery = useQuery({
    queryKey: ['profileContext', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const buildProfileContext = (): string => {
    const profile = profileQuery.data;
    if (!profile) return '';

    return `
=== USER PROFILE CONTEXT ===
Professional Background:
- Name: ${profile.full_name || 'Not specified'}
- Current Position: ${profile.current_position || 'Not specified'}
- Company: ${profile.company || 'Not specified'}
- Industry: ${profile.industry || 'Not specified'}
- Experience Level: ${profile.experience_level || 'Not specified'}
- Years of Experience: ${profile.years_of_experience || 'Not specified'}

Career Goals:
- Target Position: ${profile.target_position || 'Not specified'}
- Target Industry: ${profile.target_industry || 'Not specified'}
- Career Goals: ${profile.career_goals?.join(', ') || 'Not specified'}

Learning Preferences:
- Learning Style: ${profile.learning_style || 'Not specified'}
- Communication Style: ${profile.communication_style || 'Not specified'}
- Feedback Preference: ${profile.feedback_preference || 'Not specified'}

Current Skills: ${profile.current_skills?.join(', ') || 'Not specified'}
Skill Gaps: ${profile.skill_gaps?.join(', ') || 'Not specified'}
`;
  };

  const buildFullContext = async (userMessage: string): Promise<ConsolidatedContext> => {
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
    const contexts = await buildFullContext(userMessage);
    
    let fullContext = '';
    if (contexts.profile) fullContext += contexts.profile;
    if (contexts.knowledge) fullContext += contexts.knowledge;
    if (contexts.content) fullContext += contexts.content;
    if (contexts.learning) fullContext += contexts.learning;
    if (contexts.activity) fullContext += contexts.activity;
    if (contexts.conversations) fullContext += contexts.conversations;
    
    return fullContext;
  };

  const contextSummary = useContextSummary({
    hasProfile: !!profileQuery.data,
    knowledgeCount,
    contentCount,
    learningCount,
    activityCount,
    conversationCount,
  });

  return {
    buildFullContext,
    buildFullContextString,
    buildKnowledgeContext,
    getContextSummary: () => contextSummary,
    hasProfileContext: !!profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
  };
}
