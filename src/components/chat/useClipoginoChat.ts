
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCostMonitoring } from '@/hooks/useCostMonitoring';
import { useToast } from '@/hooks/use-toast';
import { useChatHistory } from './useChatHistory';
import { ChatMessage, ChatResponse } from './types';

export function useClipoginoChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { checkBeforeAction, refreshUsage } = useCostMonitoring();
  const { saveMessage, currentConversationId, loadConversationMessages } = useChatHistory();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gpt-4o-mini' | 'gpt-4o'>('gpt-4o-mini');

  // Load conversation when conversation ID changes
  useEffect(() => {
    const loadMessages = async () => {
      if (currentConversationId) {
        const loadedMessages = await loadConversationMessages(currentConversationId);
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
    };

    loadMessages();
  }, [currentConversationId, loadConversationMessages]);

  const sendMessage = async (input: string) => {
    if (!input.trim() || !user || isLoading) return;

    // Estimate cost based on model
    const estimatedCost = selectedModel === 'gpt-4o' ? 0.05 : 0.01;
    
    // Check cost limits before proceeding
    if (!checkBeforeAction(estimatedCost)) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Save user message to database
      await saveMessage(userMessage, currentConversationId);

      const { data, error } = await supabase.functions.invoke('clipogino-chat', {
        body: {
          message: userMessage.content,
          conversationHistory: messages.slice(-10), // Send last 10 messages for context
          model: selectedModel,
        },
      });

      if (error) {
        throw error;
      }

      const response = data as ChatResponse;
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save assistant message to database
      await saveMessage(assistantMessage, currentConversationId);
      
      // Refresh usage after successful request
      await refreshUsage();

      toast({
        title: 'CLIPOGINO Response',
        description: `Used ${response.usage.totalTokens} tokens (${response.model})`,
        variant: 'default',
      });

    } catch (error: any) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Failed to get response from CLIPOGINO';
      if (error.message?.includes('Usage limit reached')) {
        errorMessage = 'You have reached your daily AI usage limit';
      } else if (error.message?.includes('Cost limit exceeded')) {
        errorMessage = 'Request would exceed your usage limits';
      }

      toast({
        title: 'Chat Error',
        description: errorMessage,
        variant: 'destructive',
      });

      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again later.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
  };

  const selectConversation = async (conversationId: string) => {
    const loadedMessages = await loadConversationMessages(conversationId);
    setMessages(loadedMessages);
  };

  return {
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessage,
    startNewConversation,
    selectConversation,
  };
}
