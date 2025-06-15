
import { useAuth } from '@/contexts/AuthContext';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardData() {
  const { profile } = useAuth();
  const { documents } = useKnowledgeBase();

  const { data: chatStats } = useQuery({
    queryKey: ['chatStats', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return { messageCount: 0, conversationCount: 0 };
      
      const { data: conversations, error } = await supabase
        .from('chat_conversations')
        .select('message_count')
        .eq('user_id', profile.id);

      if (error) {
        console.error('Error fetching chat stats:', error);
        return { messageCount: 0, conversationCount: 0 };
      }

      const totalMessages = conversations?.reduce((sum, conv) => sum + conv.message_count, 0) || 0;
      
      return {
        messageCount: totalMessages,
        conversationCount: conversations?.length || 0
      };
    },
    enabled: !!profile?.id
  });

  const dashboardMetrics = {
    profileCompleteness: profile?.profile_completeness || 0,
    documentsUploaded: documents?.length || 0,
    chatInteractions: chatStats?.messageCount || 0
  };

  return {
    dashboardMetrics,
    profile,
    documents,
    chatStats
  };
}
