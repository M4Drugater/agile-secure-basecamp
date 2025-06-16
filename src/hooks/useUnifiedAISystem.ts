
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdvancedTripartiteFlow } from '@/hooks/ai-systems/useAdvancedTripartiteFlow';
import { useTripartiteFlowDecision } from '@/hooks/ai-systems/useTripartiteFlowDecision';
import { useWebSearchProcessor } from '@/hooks/ai-systems/useWebSearchProcessor';
import { useSystemPromptBuilder } from '@/hooks/ai-systems/useSystemPromptBuilder';
import { useAIProcessor } from '@/hooks/ai-systems/useAIProcessor';
import { useContextManager } from '@/hooks/ai-systems/useContextManager';
import { UnifiedRequest, UnifiedResponse } from '@/hooks/ai-systems/types';
import { toast } from 'sonner';

export function useUnifiedAISystem() {
  const { user } = useAuth();
  const { executeAdvancedFlow } = useAdvancedTripartiteFlow();
  const { shouldUseTripartiteFlow } = useTripartiteFlowDecision();
  const { performWebSearch } = useWebSearchProcessor();
  const { buildSystemPrompt } = useSystemPromptBuilder();
  const { processWithAI } = useAIProcessor();
  const { getContextSummary } = useContextManager();
  const [isProcessing, setIsProcessing] = useState(false);

  const sendUnifiedRequest = async (request: UnifiedRequest): Promise<UnifiedResponse> => {
    if (!user) {
      throw new Error('Authentication required');
    }

    setIsProcessing(true);

    try {
      console.log('🔧 SISTEMA UNIFICADO - Analizando solicitud:', {
        query: request.message,
        agent: request.agentType,
        useTripartiteFlow: request.useTripartiteFlow,
        searchEnabled: request.searchEnabled,
        hasSystemPrompt: !!request.systemPrompt
      });

      // Decidir si usar flujo tripartito
      if (shouldUseTripartiteFlow(request)) {
        console.log('🚀 ACTIVANDO FLUJO TRIPARTITO para', request.agentType.toUpperCase());
        
        const tripartiteResult = await executeAdvancedFlow({
          userQuery: request.message,
          agentType: request.agentType,
          sessionConfig: request.sessionConfig,
          config: {
            enableOpenAIInterpretation: true,
            enablePerplexitySearch: true,
            enableClaudeStyled: true,
            fallbackMode: 'graceful',
            qualityThreshold: 0.6
          }
        });

        console.log('✅ FLUJO TRIPARTITO COMPLETADO:', {
          status: tripartiteResult.status,
          qualityScore: tripartiteResult.qualityScore,
          sources: tripartiteResult.metadata.webSources.length
        });

        return {
          response: tripartiteResult.finalResponse,
          model: 'tripartite-flow-openai-perplexity-claude',
          tokensUsed: tripartiteResult.metadata.totalTokens,
          cost: tripartiteResult.metadata.totalCost,
          hasWebData: tripartiteResult.metadata.webSources.length > 0,
          webSources: tripartiteResult.metadata.webSources,
          validationScore: Math.round(tripartiteResult.qualityScore * 100),
          searchEngine: 'tripartite-system',
          contextQuality: 'elite',
          tripartiteMetrics: tripartiteResult.advancedMetrics
        };
      }

      // FLUJO ESTÁNDAR
      console.log('🔧 Usando flujo estándar unificado');
      
      // Step 1: Web search
      const webSearchResults = await performWebSearch(request);

      // Step 2: Build system prompt
      const enhancedPrompt = await buildSystemPrompt(request, webSearchResults);

      // Step 3: Process with AI
      const result = await processWithAI(enhancedPrompt, request.message, webSearchResults);

      return result;

    } catch (error) {
      console.error('🔧 Error en sistema unificado:', error);
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
