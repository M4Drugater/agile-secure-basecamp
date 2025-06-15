
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TripartiteRequest {
  userQuery: string;
  agentType: string;
  sessionConfig?: any;
  contextLevel?: 'standard' | 'elite';
}

interface TripartiteResponse {
  finalResponse: string;
  metadata: {
    totalTokens: number;
    totalCost: string;
    webSources: string[];
    searchEngine: string;
    qualityScore: number;
    processingTime: number;
    stages: {
      openaiTime: number;
      perplexityTime: number;
      claudeTime: number;
    };
  };
  status: 'success' | 'partial' | 'error';
}

export function useUnifiedTripartiteSystem() {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

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

      const { data: openaiData, error: openaiError } = await supabase.functions.invoke('elite-multi-llm-engine', {
        body: {
          messages: [
            {
              role: 'system',
              content: getOpenAIContextPrompt(request.agentType)
            },
            {
              role: 'user',
              content: request.userQuery
            }
          ],
          model: 'gpt-4.1-2025-04-14',
          contextLevel: request.contextLevel || 'elite',
          userId: user.id
        }
      });

      if (openaiError) {
        throw new Error(`OpenAI stage failed: ${openaiError.message}`);
      }

      const openaiTime = Date.now() - openaiStart;
      const searchContext = openaiData.response;

      console.log('✅ Stage 1 Complete - OpenAI Context:', {
        time: openaiTime,
        contextLength: searchContext.length
      });

      // Stage 2: Perplexity Web Research
      const perplexityStart = Date.now();
      toast.info('Tripartite Stage 2: Perplexity Research', {
        description: 'Performing web research with real-time data...'
      });

      const { data: perplexityData, error: perplexityError } = await supabase.functions.invoke('unified-web-search', {
        body: {
          query: searchContext,
          context: `Tripartite research for ${request.agentType}: ${request.userQuery}`,
          searchType: 'comprehensive',
          timeframe: 'month',
          companyName: request.sessionConfig?.companyName || '',
          industry: request.sessionConfig?.industry || 'technology'
        }
      });

      if (perplexityError) {
        console.warn('⚠️ Perplexity stage warning:', perplexityError);
      }

      const perplexityTime = Date.now() - perplexityStart;
      const webData = perplexityData || { content: 'No web data available', sources: [] };

      console.log('✅ Stage 2 Complete - Perplexity Research:', {
        time: perplexityTime,
        status: perplexityData?.status || 'failed',
        sources: webData.sources?.length || 0
      });

      // Stage 3: Claude Synthesis
      const claudeStart = Date.now();
      toast.info('Tripartite Stage 3: Claude Synthesis', {
        description: 'Creating executive-grade response...'
      });

      const { data: claudeData, error: claudeError } = await supabase.functions.invoke('elite-multi-llm-engine', {
        body: {
          messages: [
            {
              role: 'system',
              content: getClaudeSynthesisPrompt(request.agentType, webData)
            },
            {
              role: 'user',
              content: `Original Query: ${request.userQuery}

OpenAI Context Analysis:
${searchContext}

Web Research Data:
${webData.content || 'No web data available'}

Sources: ${webData.sources?.join(', ') || 'None'}

Please synthesize this into a comprehensive, executive-grade response.`
            }
          ],
          model: 'claude-sonnet-4-20250514',
          contextLevel: request.contextLevel || 'elite',
          userId: user.id
        }
      });

      if (claudeError) {
        throw new Error(`Claude stage failed: ${claudeError.message}`);
      }

      const claudeTime = Date.now() - claudeStart;
      const finalResponse = claudeData.response;

      console.log('✅ Stage 3 Complete - Claude Synthesis:', {
        time: claudeTime,
        responseLength: finalResponse.length
      });

      const totalTime = Date.now() - startTime;
      const totalTokens = (openaiData.tokensUsed || 0) + (claudeData.tokensUsed || 0);
      const totalCost = ((parseFloat(openaiData.cost || '0') + parseFloat(claudeData.cost || '0'))).toFixed(6);

      // Calculate quality score based on completeness
      const qualityScore = calculateQualityScore(webData, finalResponse);

      toast.success('Tripartite Flow Complete', {
        description: `Quality: ${Math.round(qualityScore * 100)}% | Time: ${Math.round(totalTime / 1000)}s | Sources: ${webData.sources?.length || 0}`
      });

      return {
        finalResponse,
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

function getOpenAIContextPrompt(agentType: string): string {
  return `You are the CONTEXT ANALYSIS stage of a tripartite AI system.

Your role: Analyze the user's query and create an optimized search context for the Perplexity research stage.

Agent Type: ${agentType.toUpperCase()}

Instructions:
1. Understand the user's intent and information needs
2. Identify key search terms and concepts
3. Consider industry context and competitive factors
4. Generate specific, searchable questions
5. Output a clear search context for web research

Keep your response focused and under 200 words. This will be used as input for the web research stage.`;
}

function getClaudeSynthesisPrompt(agentType: string, webData: any): string {
  const agentSpecializations = {
    'enhanced-content-generator': 'Create executive-grade content with web data integration',
    'clipogino': 'Provide strategic mentoring with current market context',
    'research-engine': 'Synthesize research findings into actionable insights',
    'cdv': 'Competitive discovery and validation with verified data',
    'cir': 'Competitive intelligence retrieval with metrics',
    'cia': 'Strategic competitive analysis with executive recommendations'
  };

  return `You are the SYNTHESIS stage of a tripartite AI system.

Your role: Create the final, executive-grade response using all available data.

Agent Specialization: ${agentSpecializations[agentType as keyof typeof agentSpecializations] || 'Strategic analysis'}

Available Data:
- OpenAI context analysis
- Perplexity web research (${webData.sources?.length || 0} sources)
- Real-time market data: ${webData.status === 'success' ? 'Available' : 'Limited'}

Requirements:
1. Synthesize all information into a coherent response
2. Cite specific data points and sources
3. Provide executive-level insights
4. Include actionable recommendations
5. Maintain professional, strategic tone

Format: Executive summary → Key findings → Analysis → Recommendations → Sources

Quality target: C-suite presentation ready.`;
}

function calculateQualityScore(webData: any, response: string): number {
  let score = 0.4; // Base score

  // Web data availability
  if (webData.sources && webData.sources.length > 0) {
    score += 0.3;
  }

  // Response completeness
  if (response.length > 500) {
    score += 0.2;
  }

  // Source citations in response
  if (webData.sources && webData.sources.some((source: string) => response.includes(source))) {
    score += 0.1;
  }

  return Math.min(score, 1.0);
}
