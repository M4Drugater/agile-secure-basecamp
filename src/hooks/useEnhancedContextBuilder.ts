
import { useUserProfile } from './useUserProfile';
import { useUserKnowledgeFiles } from './useUserKnowledgeFiles';
import { useSystemKnowledge } from './useSystemKnowledge';
import { useContentItems } from './useContentItems';
import { useLearningProgress } from './useLearningProgress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedContext {
  profile: string;
  knowledge: string;
  content: string;
  learning: string;
  activity: string;
  conversations: string;
}

export function useEnhancedContextBuilder() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { files } = useUserKnowledgeFiles();
  const { documents } = useSystemKnowledge();
  const { data: contentItems } = useContentItems();
  const { data: learningData } = useLearningProgress();

  // Get recent user activity
  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('action, resource_type, details, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Get recent conversation history
  const { data: recentConversations } = useQuery({
    queryKey: ['recent-conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('content, role, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const buildEnhancedContext = (userMessage: string): EnhancedContext => {
    let context: EnhancedContext = {
      profile: '',
      knowledge: '',
      content: '',
      learning: '',
      activity: '',
      conversations: '',
    };

    // Build profile context
    if (profile) {
      context.profile = `=== USER PROFILE ===
Name: ${profile.full_name || 'User'}
Position: ${profile.current_position || 'Not specified'}
Company: ${profile.company || 'Not specified'}
Industry: ${profile.industry || 'Not specified'}
Experience: ${profile.experience_level || 'Not specified'}${profile.years_of_experience ? ` (${profile.years_of_experience} years)` : ''}
Skills: ${profile.current_skills?.join(', ') || 'Not specified'}
Goals: ${profile.career_goals?.join(', ') || 'Not specified'}
Learning Style: ${profile.learning_style || 'adaptive'}
Communication Style: ${profile.communication_style || 'adaptive'}

`;
    }

    // Build knowledge context
    if (files && files.length > 0) {
      context.knowledge += `=== PERSONAL KNOWLEDGE (${files.length} files) ===
`;
      files.slice(0, 5).forEach(file => {
        if (file.content || file.ai_summary) {
          context.knowledge += `• ${file.title}: ${file.ai_summary || file.description || 'No summary available'}
`;
          if (file.ai_key_points?.length) {
            context.knowledge += `  Key Points: ${file.ai_key_points.join(', ')}
`;
          }
        }
      });
    }

    if (documents && documents.length > 0) {
      context.knowledge += `
=== SYSTEM KNOWLEDGE (${documents.length} documents) ===
`;
      documents.slice(0, 3).forEach(doc => {
        context.knowledge += `• ${doc.title}: ${doc.content?.substring(0, 200)}...
`;
      });
    }

    // Build content creation context
    if (contentItems && contentItems.length > 0) {
      context.content = `
=== CREATED CONTENT (${contentItems.length} items) ===
Recent content created by user:
`;
      contentItems.slice(0, 5).forEach(item => {
        context.content += `• ${item.title} (${item.content_type}) - ${item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
  Status: ${item.status || 'Unknown'}
  Topics: ${item.tags?.join(', ') || 'No tags'}
`;
      });
    }

    // Build learning progress context
    if (learningData && learningData.length > 0) {
      context.learning = `
=== LEARNING PROGRESS ===
`;
      learningData.forEach(progress => {
        context.learning += `• Learning Path: Progress ${progress.progress_percentage || 0}%
  Status: ${progress.status || 'In progress'}
  Last Activity: ${progress.last_accessed ? new Date(progress.last_accessed).toLocaleDateString() : 'Never'}
`;
      });
    }

    // Build recent activity context
    if (recentActivity && recentActivity.length > 0) {
      context.activity = `
=== RECENT ACTIVITY (Last 10 actions) ===
`;
      recentActivity.forEach(activity => {
        context.activity += `• ${activity.action} on ${activity.resource_type} - ${new Date(activity.created_at).toLocaleDateString()}
`;
        if (activity.details) {
          const details = typeof activity.details === 'string' ? activity.details : JSON.stringify(activity.details);
          context.activity += `  Details: ${details.substring(0, 100)}${details.length > 100 ? '...' : ''}
`;
        }
      });
    }

    // Build conversation history context
    if (recentConversations && recentConversations.length > 0) {
      context.conversations = `
=== RECENT CONVERSATION HISTORY ===
`;
      recentConversations.slice(0, 6).forEach(msg => {
        if (msg.role === 'user') {
          context.conversations += `User: ${msg.content.substring(0, 150)}${msg.content.length > 150 ? '...' : ''}
`;
        } else if (msg.role === 'assistant') {
          context.conversations += `CLIPOGINO: ${msg.content.substring(0, 150)}${msg.content.length > 150 ? '...' : ''}
`;
        }
      });
    }

    return context;
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

  const getContextSummary = (): { 
    hasProfile: boolean;
    knowledgeCount: number;
    contentCount: number;
    learningCount: number;
    activityCount: number;
    conversationCount: number;
  } => {
    return {
      hasProfile: !!profile,
      knowledgeCount: (files?.length || 0) + (documents?.length || 0),
      contentCount: contentItems?.length || 0,
      learningCount: learningData?.length || 0,
      activityCount: recentActivity?.length || 0,
      conversationCount: recentConversations?.length || 0,
    };
  };

  return {
    buildEnhancedContext,
    buildFullContextString,
    getContextSummary,
  };
}
