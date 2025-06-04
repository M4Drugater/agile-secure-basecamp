
import { useState, useEffect } from 'react';
import { useChatHistory } from './useChatHistory';
import { useKnowledgeContext } from '@/hooks/useKnowledgeContext';
import { ChatMessage } from './types';

export function useConversationState() {
  const { saveMessage, currentConversationId, loadConversationMessages } = useChatHistory();
  const { getKnowledgeRecommendations } = useKnowledgeContext();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [knowledgeRecommendations, setKnowledgeRecommendations] = useState<any[]>([]);

  // Load conversation when conversation ID changes
  useEffect(() => {
    const loadMessages = async () => {
      if (currentConversationId) {
        try {
          const loadedMessages = await loadConversationMessages(currentConversationId);
          setMessages(loadedMessages);
        } catch (error) {
          console.error('Error loading conversation messages:', error);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    };

    loadMessages();
  }, [currentConversationId, loadConversationMessages]);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const saveMessageToHistory = async (message: ChatMessage, conversationId?: string) => {
    return await saveMessage(message, conversationId);
  };

  const updateKnowledgeRecommendations = async (userMessage: string) => {
    try {
      const recommendations = await getKnowledgeRecommendations(userMessage);
      setKnowledgeRecommendations(recommendations);
    } catch (error) {
      console.error('Error getting knowledge recommendations:', error);
      setKnowledgeRecommendations([]);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setKnowledgeRecommendations([]);
  };

  const selectConversation = async (conversationId: string) => {
    try {
      const loadedMessages = await loadConversationMessages(conversationId);
      setMessages(loadedMessages);
      setKnowledgeRecommendations([]);
    } catch (error) {
      console.error('Error selecting conversation:', error);
      setMessages([]);
      setKnowledgeRecommendations([]);
    }
  };

  return {
    messages,
    knowledgeRecommendations,
    currentConversationId,
    addMessage,
    saveMessageToHistory,
    updateKnowledgeRecommendations,
    startNewConversation,
    selectConversation,
  };
}
