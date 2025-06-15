
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getClaudeSynthesisPrompt } from '../utils/promptGenerators';

export function useClaudeSynthesisStage() {
  const { user } = useAuth();

  const executeSynthesis = async (
    userQuery: string,
    searchContext: string,
    webData: any,
    agentType: string,
    contextLevel: 'standard' | 'elite' = 'elite'
  ) => {
    if (!user) {
      throw new Error('Authentication required for Claude synthesis stage');
    }

    const { data: claudeData, error: claudeError } = await supabase.functions.invoke('elite-multi-llm-engine', {
      body: {
        messages: [
          {
            role: 'system',
            content: getClaudeSynthesisPrompt(agentType, webData)
          },
          {
            role: 'user',
            content: `Original Query: ${userQuery}

OpenAI Context Analysis:
${searchContext}

Web Research Data:
${webData.content || 'No web data available'}

Sources: ${webData.sources?.join(', ') || 'None'}

Please synthesize this into a comprehensive, executive-grade response.`
          }
        ],
        model: 'claude-sonnet-4-20250514',
        contextLevel,
        userId: user.id
      }
    });

    if (claudeError) {
      throw new Error(`Claude stage failed: ${claudeError.message}`);
    }

    return {
      finalResponse: claudeData.response,
      tokensUsed: claudeData.tokensUsed || 0,
      cost: parseFloat(claudeData.cost || '0')
    };
  };

  return {
    executeSynthesis
  };
}
