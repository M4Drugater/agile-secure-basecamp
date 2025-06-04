
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCostMonitoring } from '@/hooks/useCostMonitoring';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, ChatResponse } from './types';

export function useMessageHandling() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { checkBeforeAction, refreshUsage } = useCostMonitoring();
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gpt-4o-mini' | 'gpt-4o'>('gpt-4o-mini');

  const sendMessageToAI = async (
    userMessage: ChatMessage,
    fullContext: string,
    messages: ChatMessage[]
  ): Promise<ChatMessage> => {
    // Estimate cost based on model
    const estimatedCost = selectedModel === 'gpt-4o' ? 0.05 : 0.01;
    
    // Check cost limits before proceeding
    if (!checkBeforeAction(estimatedCost)) {
      throw new Error('Usage limit reached');
    }

    setIsLoading(true);

    try {
      console.log('Sending message to CLIPOGINO with enhanced context:', {
        messageLength: userMessage.content.length,
        historyLength: messages.length,
        contextLength: fullContext.length,
        model: selectedModel
      });

      const { data, error } = await supabase.functions.invoke('clipogino-chat', {
        body: {
          message: userMessage.content,
          context: fullContext,
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

      // Refresh usage after successful request
      await refreshUsage();

      const contextInfo = [];
      if (fullContext.includes('User Profile Context:')) contextInfo.push('personalization');
      if (fullContext.includes('KNOWLEDGE CONTEXT')) contextInfo.push('knowledge context');
      
      toast({
        title: 'CLIPOGINO Response',
        description: `Used ${response.usage.totalTokens} tokens (${response.model})${contextInfo.length > 0 ? ` with ${contextInfo.join(' & ')}` : ''}`,
        variant: 'default',
      });

      return assistantMessage;

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

      // Return error message
      return {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again later.`,
        timestamp: new Date(),
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessageToAI,
  };
}
