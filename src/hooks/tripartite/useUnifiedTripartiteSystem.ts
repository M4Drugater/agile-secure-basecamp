
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useOpenAIContextStage } from './stages/useOpenAIContextStage';
import { usePerplexityResearchStage } from './stages/usePerplexityResearchStage';
import { useClaudeSynthesisStage } from './stages/useClaudeSynthesisStage';
import { calculateQualityScore } from './utils/qualityCalculator';
import type { TripartiteRequest, TripartiteResponse } from './types';

export function useUnifiedTripartiteSystem() {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { executeContextAnalysis } = useOpenAIContextStage();
  const { executeWebResearch } = usePerplexityResearchStage();
  const { executeSynthesis } = useClaudeSynthesisStage();

  const executeTripartiteFlow = async (request: TripartiteRequest): Promise<TripartiteResponse> => {
    if (!user) {
      throw new Error('Authentication required for tripartite flow');
    }

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      console.log('🚀 TRIPARTITE FLOW - Iniciando para', request.agentType.toUpperCase());

      // Stage 1: OpenAI Context Analysis
      const openaiStart = Date.now();
      toast.info('Tripartite Stage 1: OpenAI Context Analysis', {
        description: 'Analyzing query and building search context...'
      });

      const openaiResult = await executeContextAnalysis(
        request.userQuery,
        request.agentType,
        request.contextLevel
      );
      const openaiTime = Date.now() - openaiStart;

      console.log('✅ Stage 1 Complete - OpenAI Context:', {
        time: openaiTime,
        contextLength: openaiResult.searchContext.length
      });

      // Stage 2: Perplexity Web Research
      const perplexityStart = Date.now();
      toast.info('Tripartite Stage 2: Perplexity Research', {
        description: 'Performing web research with real-time data...'
      });

      const webData = await executeWebResearch(
        openaiResult.searchContext,
        request.userQuery,
        request.agentType,
        request.sessionConfig
      );
      const perplexityTime = Date.now() - perplexityStart;

      console.log('✅ Stage 2 Complete - Perplexity Research:', {
        time: perplexityTime,
        status: webData?.status || 'failed',
        sources: webData.sources?.length || 0
      });

      // Stage 3: Claude Synthesis
      const claudeStart = Date.now();
      toast.info('Tripartite Stage 3: Claude Synthesis', {
        description: 'Creating executive-grade response...'
      });

      const claudeResult = await executeSynthesis(
        request.userQuery,
        openaiResult.searchContext,
        webData,
        request.agentType,
        request.contextLevel
      );
      const claudeTime = Date.now() - claudeStart;

      console.log('✅ Stage 3 Complete - Claude Synthesis:', {
        time: claudeTime,
        responseLength: claudeResult.finalResponse.length
      });

      const totalTime = Date.now() - startTime;
      const totalTokens = openaiResult.tokensUsed + claudeResult.tokensUsed;
      const totalCost = (openaiResult.cost + claudeResult.cost).toFixed(6);
      const qualityScore = calculateQualityScore(webData, claudeResult.finalResponse);

      toast.success('Tripartite Flow Complete', {
        description: `Quality: ${Math.round(qualityScore * 100)}% | Time: ${Math.round(totalTime / 1000)}s | Sources: ${webData.sources?.length || 0}`
      });

      return {
        finalResponse: claudeResult.finalResponse,
        metadata: {
          totalTokens,
          totalCost,
          webSources: webData.sources || [],
          searchEngine: webData.searchEngine || 'perplexity',
          qualityScore,
          processingTime: totalTime,
          stages: {
            openaiTime,
            perplexityTime,
            claudeTime
          }
        },
        status: 'success'
      };

    } catch (error) {
      console.error('❌ Tripartite flow error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    executeTripartiteFlow,
    isProcessing
  };
}
