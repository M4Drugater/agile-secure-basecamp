
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompetitiveContext } from './useCompetitiveContext';
import { useAgentPrompts } from './useAgentPrompts';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  messageType?: 'text' | 'analysis' | 'report' | 'insight';
  metadata?: any;
}

export function useAgentMessageHandling() {
  const { user } = useAuth();
  const { buildFullCompetitiveContext } = useCompetitiveContext();
  const { getSystemPrompt } = useAgentPrompts();
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessageToAgent = async (
    userMessage: string,
    agentType: string,
    sessionConfig: any,
    conversationHistory: Message[]
  ): Promise<Message> => {
    if (!user) throw new Error('User not authenticated');

    setIsProcessing(true);

    try {
      // Build comprehensive context
      const userContext = buildFullCompetitiveContext(sessionConfig);
      
      // Get specialized system prompt
      const systemPrompt = getSystemPrompt(agentType, userContext, sessionConfig);

      // Prepare conversation for API
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      // Call the enhanced edge function
      const { data, error } = await supabase.functions.invoke('competitive-intelligence-chat', {
        body: {
          messages,
          agentType,
          sessionConfig,
          userContext: {
            userId: user.id,
            sessionId: sessionConfig.sessionId || null
          }
        }
      });

      if (error) throw error;

      // Determine message type based on agent and content
      let messageType: 'text' | 'analysis' | 'report' | 'insight' = 'text';
      if (agentType === 'cdv') messageType = 'analysis';
      else if (agentType === 'cia') messageType = 'insight';
      else if (agentType === 'cir') messageType = 'report';

      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        messageType,
        metadata: {
          agentType,
          tokensUsed: data.tokensUsed || 0,
          cost: data.cost || 0,
          processingTime: data.processingTime || 0
        }
      };

    } catch (error) {
      console.error('Error sending message to agent:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const saveConversationToDatabase = async (
    sessionId: string,
    messages: Message[]
  ) => {
    try {
      // Save conversation state
      const { error: sessionError } = await supabase
        .from('competitive_intelligence_sessions')
        .upsert({
          id: sessionId,
          user_id: user?.id,
          updated_at: new Date().toISOString(),
          status: 'active'
        });

      if (sessionError) throw sessionError;

      // Save individual messages if needed
      // This could be implemented later for message persistence
      
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  return {
    sendMessageToAgent,
    saveConversationToDatabase,
    isProcessing,
  };
}
