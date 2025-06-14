
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ConsolidatedContext {
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
  totalItems: number;
  quality: 'basic' | 'good' | 'excellent';
}

interface KnowledgeFile {
  id: string;
  title: string;
  document_category: string;
  extracted_content: string | null;
}

export function useConsolidatedContext() {
  const { user } = useAuth();
  const [knowledgeCount, setKnowledgeCount] = useState(0);
  const [contentCount, setContentCount] = useState(0);
  const [learningCount, setLearningCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [conversationCount, setConversationCount] = useState(0);

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

  const retrieveRelevantKnowledge = async (userMessage: string): Promise<KnowledgeFile[]> => {
    try {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_knowledge_files')
        .select(`
          id,
          title,
          document_category,
          extracted_content
        `)
        .eq('user_id', user.id)
        .eq('processing_status', 'completed')
        .limit(5);

      if (error) throw error;
      return (data || []) as KnowledgeFile[];
    } catch (error) {
      console.error('Error retrieving knowledge:', error);
      return [];
    }
  };

  const buildKnowledgeContext = async (userMessage: string): Promise<string> => {
    try {
      const relevantKnowledge = await retrieveRelevantKnowledge(userMessage);
      setKnowledgeCount(relevantKnowledge.length);
      
      if (!relevantKnowledge || relevantKnowledge.length === 0) return '';

      let context = `\n=== RELEVANT KNOWLEDGE BASE ===\n`;
      relevantKnowledge.forEach((item, index) => {
        context += `${index + 1}. ${item.title}
   Category: ${item.document_category}
   Content: ${item.extracted_content?.substring(0, 200)}${item.extracted_content && item.extracted_content.length > 200 ? '...' : ''}
`;
      });

      return context;
    } catch (error) {
      console.error('Error building knowledge context:', error);
      setKnowledgeCount(0);
      return '';
    }
  };

  const buildContentContext = (): string => {
    // Simplified content context - would connect to actual content data
    setContentCount(3); // Mock data
    return `\n=== CONTENT CREATION CONTEXT ===\nRecent content types: Blog posts, Social media, Marketing copy\n`;
  };

  const buildLearningContext = (): string => {
    // Simplified learning context - would connect to actual learning data
    setLearningCount(2); // Mock data
    return `\n=== LEARNING CONTEXT ===\nActive learning paths: Professional Development, AI Skills\n`;
  };

  const buildActivityContext = (): string => {
    // Simplified activity context - would connect to actual activity data
    setActivityCount(5); // Mock data
    return `\n=== USER ACTIVITY CONTEXT ===\nRecent activities: Chat sessions, Content generation, Knowledge uploads\n`;
  };

  const buildConversationContext = (): string => {
    // Simplified conversation context - would connect to actual conversation data
    setConversationCount(3); // Mock data
    return `\n=== CONVERSATION CONTEXT ===\nRecent topics: Professional development, Content strategy, Learning goals\n`;
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

  const getContextSummary = (): ContextSummary => {
    const totalItems = knowledgeCount + contentCount + learningCount + activityCount + conversationCount;
    let quality: 'basic' | 'good' | 'excellent' = 'basic';
    
    if (totalItems >= 10) quality = 'excellent';
    else if (totalItems >= 5) quality = 'good';

    return {
      hasProfile: !!profileQuery.data,
      knowledgeCount,
      contentCount,
      learningCount,
      activityCount,
      conversationCount,
      totalItems,
      quality,
    };
  };

  return {
    buildFullContext,
    buildFullContextString,
    buildKnowledgeContext,
    getContextSummary,
    hasProfileContext: !!profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
  };
}
