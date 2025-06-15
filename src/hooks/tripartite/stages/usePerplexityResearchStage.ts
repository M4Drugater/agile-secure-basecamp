
import { supabase } from '@/integrations/supabase/client';

export function usePerplexityResearchStage() {
  const executeWebResearch = async (searchContext: string, userQuery: string, agentType: string, sessionConfig?: any) => {
    const { data: perplexityData, error: perplexityError } = await supabase.functions.invoke('unified-web-search', {
      body: {
        query: searchContext,
        context: `Tripartite research for ${agentType}: ${userQuery}`,
        searchType: 'comprehensive',
        timeframe: 'month',
        companyName: sessionConfig?.companyName || '',
        industry: sessionConfig?.industry || 'technology'
      }
    });

    if (perplexityError) {
      console.warn('⚠️ Perplexity stage warning:', perplexityError);
    }

    return perplexityData || { content: 'No web data available', sources: [] };
  };

  return {
    executeWebResearch
  };
}
