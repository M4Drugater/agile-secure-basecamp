
import { useConversationContext as useConversationContextBase } from '../useConversationContext';

export function useConversationContext() {
  const { buildConversationContext, conversationCount } = useConversationContextBase();

  return {
    buildConversationContext,
    conversationCount: conversationCount || 0,
  };
}
