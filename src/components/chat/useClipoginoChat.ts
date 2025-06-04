
import { useAuth } from '@/contexts/AuthContext';
import { useMessageHandling } from './useMessageHandling';
import { useContextBuilder } from './useContextBuilder';
import { useConversationState } from './useConversationState';
import { ChatMessage } from './types';

export function useClipoginoChat() {
  const { user } = useAuth();
  const { isLoading, selectedModel, setSelectedModel, sendMessageToAI } = useMessageHandling();
  const { buildFullContext, hasProfileContext } = useContextBuilder();
  const {
    messages,
    knowledgeRecommendations,
    currentConversationId,
    addMessage,
    saveMessageToHistory,
    updateKnowledgeRecommendations,
    startNewConversation: startNewConv,
    selectConversation: selectConv,
  } = useConversationState();

  const sendMessage = async (input: string) => {
    if (!input.trim() || !user || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    addMessage(userMessage);

    try {
      // Save user message to database and get conversation ID
      const conversationId = await saveMessageToHistory(userMessage, currentConversationId);
      
      // Build full context (profile + knowledge)
      const fullContext = await buildFullContext(userMessage.content);
      
      // Update knowledge recommendations for the sidebar
      await updateKnowledgeRecommendations(userMessage.content);
      
      // Send message to AI and get response
      const assistantMessage = await sendMessageToAI(userMessage, fullContext, messages);
      
      // Add assistant message to UI
      addMessage(assistantMessage);
      
      // Save assistant message to database
      await saveMessageToHistory(assistantMessage, conversationId);

    } catch (error) {
      console.error('Error in sendMessage:', error);
      // Error handling is done in sendMessageToAI
    }
  };

  const startNewConversation = () => {
    startNewConv();
  };

  const selectConversation = async (conversationId: string) => {
    await selectConv(conversationId);
  };

  return {
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessage,
    startNewConversation,
    selectConversation,
    hasProfileContext,
    knowledgeRecommendations,
  };
}
