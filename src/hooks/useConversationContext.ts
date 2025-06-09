
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessageResult {
  content: string;
  role: string;
  created_at: string;
}

export function useConversationContext() {
  const { user } = useAuth();

  const { data: recentConversations } = useQuery<ChatMessageResult[]>({
    queryKey: ['recent-conversations', user?.id],
    queryFn: async (): Promise<ChatMessageResult[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('content, role, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const buildConversationContext = (): string => {
    if (!recentConversations || recentConversations.length === 0) return '';

    let context = `
=== RECENT CONVERSATION HISTORY ===
`;
    recentConversations.slice(0, 6).forEach(msg => {
      if (msg.role === 'user') {
        context += `User: ${msg.content.substring(0, 150)}${msg.content.length > 150 ? '...' : ''}
`;
      } else if (msg.role === 'assistant') {
        context += `CLIPOGINO: ${msg.content.substring(0, 150)}${msg.content.length > 150 ? '...' : ''}
`;
      }
    });

    return context;
  };

  return {
    recentConversations,
    buildConversationContext,
    conversationCount: recentConversations?.length || 0,
  };
}
