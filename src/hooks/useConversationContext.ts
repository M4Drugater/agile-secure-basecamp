
import { useChatHistory } from '@/components/chat/useChatHistory';

export function useConversationContext() {
  const { conversations } = useChatHistory();

  const buildConversationContext = (): string => {
    if (!conversations || conversations.length === 0) return '';

    let context = `
=== RECENT CONVERSATIONS ===
Chat history context:
`;
    
    conversations.slice(0, 3).forEach((conv, index) => {
      context += `${index + 1}. ${conv.title}
   Messages: ${conv.message_count}
   Last updated: ${new Date(conv.updated_at).toLocaleDateString()}
`;
    });

    return context;
  };

  return {
    buildConversationContext,
    conversationCount: conversations?.length || 0,
  };
}
