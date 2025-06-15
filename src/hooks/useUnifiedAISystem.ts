
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEliteMultiLLM } from './useEliteMultiLLM';
import { useElitePromptEngine } from './prompts/useElitePromptEngine';
import { useUniversalWebSearch } from './competitive-intelligence/useUniversalWebSearch';
import { useContextBuilder } from './context/useContextBuilder';
import { toast } from 'sonner';

interface UnifiedRequest {
  message: string;
  agentType?: 'clipogino' | 'cdv' | 'cir' | 'cia';
  currentPage?: string;
  sessionConfig?: any;
  searchEnabled?: boolean;
  model?: string;
}

interface UnifiedResponse {
  response: string;
  model: string;
  tokensUsed: number;
  cost: string;
  hasWebData: boolean;
  webSources: string[];
  contextQuality: string;
  timestamp: string;
}

export function useUnifiedAISystem() {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { sendEliteRequest } = useEliteMultiLLM();
  const { buildEliteSystemPrompt } = useElitePromptEngine();
  const { performUniversalSearch } = useUniversalWebSearch();
  const { buildFullContextString, getContextSummary } = useContextBuilder();

  const sendUnifiedRequest = async (request: UnifiedRequest): Promise<UnifiedResponse> => {
    if (!user) {
      throw new Error('Authentication required for AI access');
    }

    setIsProcessing(true);

    try {
      console.log('🚀 Unified AI System Request:', {
        agentType: request.agentType,
        currentPage: request.currentPage,
        searchEnabled: request.searchEnabled,
        model: request.model,
        userId: user.id
      });

      // 1. Build comprehensive user context
      const userContext = await buildFullContextString(request.message);
      const contextSummary = getContextSummary();

      console.log('📊 Context Built:', {
        knowledgeCount: contextSummary.knowledgeCount,
        contentCount: contextSummary.contentCount,
        activityCount: contextSummary.activityCount,
        quality: contextSummary.quality
      });

      // 2. Perform web search if enabled
      let webSearchData = null;
      if (request.searchEnabled) {
        try {
          const searchQuery = `${request.message} ${request.sessionConfig?.companyName || ''} ${request.sessionConfig?.industry || ''}`.trim();
          
          console.log('🔍 Performing web search:', searchQuery);
          
          const searchResults = await performUniversalSearch({
            query: searchQuery,
            context: `${request.agentType} agent search for user query`,
            searchType: 'comprehensive',
            timeframe: 'month'
          });

          webSearchData = searchResults;
          console.log('✅ Web search completed:', {
            sourcesFound: searchResults.sources.length,
            confidence: searchResults.metrics.confidence
          });
        } catch (searchError) {
          console.warn('⚠️ Web search failed, continuing without:', searchError);
          // Continue without web search rather than failing
        }
      }

      // 3. Build elite system prompt with all context
      const systemPrompt = await buildEliteSystemPrompt({
        agentType: request.agentType || 'clipogino',
        currentPage: request.currentPage || '/chat',
        sessionConfig: request.sessionConfig,
        analysisDepth: 'comprehensive',
        outputFormat: 'conversational',
        contextLevel: 'elite'
      });

      // 4. Enhance system prompt with web data if available
      let enhancedSystemPrompt = systemPrompt;
      if (webSearchData) {
        enhancedSystemPrompt += `\n\n=== REAL-TIME INTELLIGENCE ===\n`;
        enhancedSystemPrompt += `Live Web Research Results:\n${webSearchData.content}\n\n`;
        
        if (webSearchData.insights.length > 0) {
          enhancedSystemPrompt += `Strategic Insights:\n`;
          webSearchData.insights.forEach((insight, index) => {
            enhancedSystemPrompt += `${index + 1}. ${insight.title}: ${insight.description} (Confidence: ${Math.round(insight.confidence * 100)}%)\n`;
          });
        }
        
        enhancedSystemPrompt += `\nCRITICAL: Use this real-time intelligence in your response. Reference specific data points and provide source-attributed insights.\n`;
      }

      // 5. Add user context to system prompt
      if (userContext) {
        enhancedSystemPrompt += `\n\n=== USER CONTEXT ===\n${userContext}\n`;
        enhancedSystemPrompt += `\nIMPORTANT: Use this personal context to provide highly personalized and relevant advice. Reference the user's knowledge, experience, and goals.\n`;
      }

      // 6. Send request to Elite Multi-LLM
      const response = await sendEliteRequest({
        messages: [
          { role: 'system', content: enhancedSystemPrompt },
          { role: 'user', content: request.message }
        ],
        model: request.model || 'gpt-4o-mini',
        searchEnabled: false, // Already performed search
        contextLevel: 'elite'
      });

      console.log('✅ Unified AI Response Generated:', {
        model: response.model,
        tokensUsed: response.tokensUsed,
        cost: response.cost,
        hasWebData: !!webSearchData,
        responseLength: response.response.length
      });

      // Show success notification
      const capabilities = [];
      if (webSearchData) capabilities.push('web intelligence');
      if (userContext) capabilities.push('personal context');
      capabilities.push('elite AI');

      toast.success(`Response generated with ${capabilities.join(', ')}`, {
        description: `Model: ${response.model} | Tokens: ${response.tokensUsed} | Cost: $${response.cost}`
      });

      return {
        response: response.response,
        model: response.model,
        tokensUsed: response.tokensUsed,
        cost: response.cost,
        hasWebData: !!webSearchData,
        webSources: webSearchData?.sources || [],
        contextQuality: contextSummary.quality,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Unified AI System Error:', error);
      toast.error('AI system error', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    sendUnifiedRequest,
    getContextSummary
  };
}
