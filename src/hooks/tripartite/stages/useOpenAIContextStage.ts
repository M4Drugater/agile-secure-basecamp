
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getOpenAIContextPrompt } from '../utils/promptGenerators';

export function useOpenAIContextStage() {
  const { user } = useAuth();

  const executeContextAnalysis = async (userQuery: string, agentType: string, contextLevel: 'standard' | 'elite' = 'elite') => {
    if (!user) {
      throw new Error('Authentication required for OpenAI context stage');
    }

    const { data: openaiData, error: openaiError } = await supabase.functions.invoke('elite-multi-llm-engine', {
      body: {
        messages: [
          {
            role: 'system',
            content: getOpenAIContextPrompt(agentType)
          },
          {
            role: 'user',
            content: userQuery
          }
        ],
        model: 'gpt-4.1-2025-04-14',
        contextLevel,
        userId: user.id
      }
    });

    if (openaiError) {
      throw new Error(`OpenAI stage failed: ${openaiError.message}`);
    }

    return {
      searchContext: openaiData.response,
      tokensUsed: openaiData.tokensUsed || 0,
      cost: parseFloat(openaiData.cost || '0')
    };
  };

  return {
    executeContextAnalysis
  };
}
