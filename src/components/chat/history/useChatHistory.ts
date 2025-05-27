
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage } from '../types';
import { ChatConversation } from './types';
import { ConversationsService } from './conversationsService';
import { MessagesService } from './messagesService';

export function useChatHistory() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const loadedConversations = await ConversationsService.loadUserConversations(user.id);
      setConversations(loadedConversations);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load messages for a conversation - memoized to prevent infinite loops
  const loadConversationMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    if (!user) return [];
    return MessagesService.loadConversationMessages(conversationId);
  }, [user]);

  // Save a message to current conversation
  const saveMessage = async (message: ChatMessage, conversationId?: string) => {
    if (!user) return null;

    let activeConversationId = conversationId || currentConversationId;

    // Create new conversation if none exists
    if (!activeConversationId) {
      const title = message.role === 'user' 
        ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
        : 'New Conversation';

      activeConversationId = await ConversationsService.createConversation(user.id, title);
      
      if (!activeConversationId) {
        return null;
      }

      setCurrentConversationId(activeConversationId);
      await loadConversations(); // Refresh list
    }

    // Save the message
    const success = await MessagesService.saveMessage(message, activeConversationId);
    
    if (success) {
      // Update conversation timestamp and message count
      await ConversationsService.updateConversationTimestamp(activeConversationId);
      await ConversationsService.incrementMessageCount(activeConversationId);
      
      // Refresh conversations to update message count
      await loadConversations();
    }

    return activeConversationId;
  };

  // Delete a conversation
  const deleteConversation = async (conversationId: string) => {
    if (!user) return;
    
    const success = await ConversationsService.deleteConversation(conversationId, user.id);
    
    if (success) {
      await loadConversations();
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  return {
    conversations,
    currentConversationId,
    isLoading,
    loadConversations,
    loadConversationMessages,
    saveMessage,
    deleteConversation,
    setCurrentConversationId
  };
}

export type { ChatConversation } from './types';
