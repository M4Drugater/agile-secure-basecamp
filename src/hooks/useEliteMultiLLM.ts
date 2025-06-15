
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EliteRequest {
  messages: any[];
  model: string;
  systemPrompt?: string;
  searchEnabled?: boolean;
  searchQuery?: string;
  contextLevel?: 'basic' | 'enhanced' | 'elite';
}

interface EliteResponse {
  response: string;
  model: string;
  tokensUsed: number;
  cost: string;
  webSearchData?: any;
  searchEnabled: boolean;
  contextLevel: string;
  timestamp: string;
}

export function useEliteMultiLLM() {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<EliteResponse | null>(null);

  const sendEliteRequest = async (request: EliteRequest): Promise<EliteResponse> => {
    if (!user) {
      throw new Error('Authentication required for Elite AI access');
    }

    setIsProcessing(true);
    
    try {
      console.log('Elite Multi-LLM Request:', {
        model: request.model,
        searchEnabled: request.searchEnabled,
        contextLevel: request.contextLevel,
        messagesCount: request.messages.length
      });

      const { data, error } = await supabase.functions.invoke('elite-multi-llm-engine', {
        body: {
          ...request,
          userId: user.id,
          sessionId: `session-${Date.now()}`
        }
      });

      if (error) {
        console.error('Elite Multi-LLM Error:', error);
        throw new Error(`Elite AI system error: ${error.message}`);
      }

      if (!data) {
        throw new Error('No response from Elite AI system');
      }

      setLastResponse(data);
      
      // Show success notification
      const searchStatus = data.webSearchData ? 'with live web data' : 'with AI intelligence';
      toast.success(`Elite AI response generated ${searchStatus}`, {
        description: `Model: ${data.model} | Tokens: ${data.tokensUsed} | Cost: $${data.cost}`
      });

      return data;

    } catch (error) {
      console.error('Elite Multi-LLM Request Failed:', error);
      toast.error('Elite AI system error', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const sendWithOpenAI = async (messages: any[], model: string = 'gpt-4o-mini', options?: Partial<EliteRequest>) => {
    return sendEliteRequest({
      messages,
      model,
      ...options
    });
  };

  const sendWithClaude = async (messages: any[], model: string = 'claude-3-5-sonnet-20241022', options?: Partial<EliteRequest>) => {
    return sendEliteRequest({
      messages,
      model,
      ...options
    });
  };

  const sendWithWebSearch = async (messages: any[], searchQuery: string, model?: string, options?: Partial<EliteRequest>) => {
    return sendEliteRequest({
      messages,
      model: model || 'gpt-4o',
      searchEnabled: true,
      searchQuery,
      ...options
    });
  };

  const getAvailableModels = () => ({
    openai: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', cost: 'low', speed: 'fast' },
      { id: 'gpt-4o', name: 'GPT-4o', cost: 'high', speed: 'medium' }
    ],
    claude: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', cost: 'medium', speed: 'fast' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', cost: 'high', speed: 'slow' }
    ]
  });

  return {
    isProcessing,
    lastResponse,
    sendEliteRequest,
    sendWithOpenAI,
    sendWithClaude,
    sendWithWebSearch,
    getAvailableModels
  };
}
