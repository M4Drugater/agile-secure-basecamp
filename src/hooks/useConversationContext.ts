
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

  const { data: recentConversations } = useQuery({
    queryKey: ['recent-conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('content, role, created_at')
        .eq('conversation_id', user.id) // Fixed: using conversation_id instead of user_id
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }
      
      return data as ChatMessageResult[];
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
