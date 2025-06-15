
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
        agentType: request.agentType || 'clipogino',
        currentPage: request.currentPage || '/chat',
        searchEnabled: request.searchEnabled || false,
        model: request.model || 'gpt-4o-mini',
        userId: user.id
      });

      // 1. Build comprehensive user context
      let userContext = '';
      let contextSummary = { quality: 'basic', knowledgeCount: 0, contentCount: 0, activityCount: 0, hasProfile: false };
      
      try {
        userContext = await buildFullContextString(request.message);
        contextSummary = getContextSummary();
        console.log('📊 Context Built:', contextSummary);
      } catch (error) {
        console.warn('⚠️ Context building failed, continuing without:', error);
      }

      // 2. Perform web search if enabled
      let webSearchData = null;
      if (request.searchEnabled) {
        try {
          const searchQuery = `${request.message} ${request.sessionConfig?.companyName || ''} ${request.sessionConfig?.industry || ''}`.trim();
          
          console.log('🔍 Performing web search:', searchQuery);
          
          const searchResults = await performUniversalSearch({
            query: searchQuery,
            context: `${request.agentType || 'clipogino'} agent search for user query`,
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
        }
      }

      // 3. Build elite system prompt with all context
      let systemPrompt = '';
      try {
        systemPrompt = await buildEliteSystemPrompt({
          agentType: request.agentType || 'clipogino',
          currentPage: request.currentPage || '/chat',
          sessionConfig: request.sessionConfig,
          analysisDepth: 'comprehensive',
          outputFormat: 'conversational',
          contextLevel: 'elite'
        });
      } catch (error) {
        console.warn('⚠️ Prompt building failed, using fallback:', error);
        systemPrompt = `You are CLIPOGINO, an AI business mentor and strategic advisor. 
        Provide professional, actionable advice based on the user's query: "${request.message}"
        Be conversational, helpful, and strategic in your responses.`;
      }

      // 4. Enhance system prompt with web data if available
      let enhancedSystemPrompt = systemPrompt;
      if (webSearchData) {
        enhancedSystemPrompt += `\n\n=== REAL-TIME INTELLIGENCE ===\n`;
        enhancedSystemPrompt += `Live Web Research Results:\n${webSearchData.content}\n\n`;
        
        if (webSearchData.insights && webSearchData.insights.length > 0) {
          enhancedSystemPrompt += `Strategic Insights:\n`;
          webSearchData.insights.forEach((insight: any, index: number) => {
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

  const getContextSummaryWithFallback = () => {
    try {
      return getContextSummary();
    } catch (error) {
      console.warn('Context summary failed:', error);
      return { quality: 'basic', knowledgeCount: 0, contentCount: 0, activityCount: 0, hasProfile: false };
    }
  };

  return {
    isProcessing,
    sendUnifiedRequest,
    getContextSummary: getContextSummaryWithFallback
  };
}
