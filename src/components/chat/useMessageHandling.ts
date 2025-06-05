
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
          conversationHistory: messages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
          })), // Send last 10 messages for context
          model: selectedModel,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('CLIPOGINO response data:', data);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || data.reply || 'Lo siento, no pude generar una respuesta.',
        timestamp: new Date(),
      };

      // Refresh usage after successful request
      await refreshUsage();

      const contextInfo = [];
      if (fullContext.includes('USER PROFILE')) contextInfo.push('personalización');
      if (fullContext.includes('KNOWLEDGE')) contextInfo.push('base de conocimiento');
      
      toast({
        title: 'Respuesta de CLIPOGINO',
        description: `Usados ${data.usage?.totalTokens || 0} tokens (${data.model || selectedModel})${contextInfo.length > 0 ? ` con ${contextInfo.join(' y ')}` : ''}`,
        variant: 'default',
      });

      return assistantMessage;

    } catch (error: any) {
      console.error('Chat error:', error);
      
      let errorMessage = 'No se pudo obtener respuesta de CLIPOGINO';
      if (error.message?.includes('Usage limit reached')) {
        errorMessage = 'Has alcanzado tu límite diario de uso de IA';
      } else if (error.message?.includes('Cost limit exceeded')) {
        errorMessage = 'La solicitud excedería tus límites de uso';
      }

      toast({
        title: 'Error de Chat',
        description: errorMessage,
        variant: 'destructive',
      });

      // Return error message
      return {
        role: 'assistant',
        content: `Lo siento, encontré un error: ${errorMessage}. Por favor intenta de nuevo más tarde.`,
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
