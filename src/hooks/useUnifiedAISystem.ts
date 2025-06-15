import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useElitePromptEngine } from '@/hooks/prompts/useElitePromptEngine';
import { useWebDataValidator } from '@/hooks/web-search/useWebDataValidator';
import { useTripartiteAIFlow } from '@/hooks/ai-systems/useTripartiteAIFlow';
import { useAdvancedTripartiteFlow } from '@/hooks/ai-systems/useAdvancedTripartiteFlow';
import { toast } from 'sonner';

interface UnifiedRequest {
  message: string;
  agentType: 'clipogino' | 'cdv' | 'cir' | 'cia' | 'research-engine' | 'enhanced-content-generator';
  currentPage: string;
  sessionConfig?: any;
  searchEnabled?: boolean;
  model?: string;
  useTripartiteFlow?: boolean; // NEW: Enable tripartite flow
}

interface UnifiedResponse {
  response: string;
  model: string;
  tokensUsed: number;
  cost: string;
  hasWebData: boolean;
  webSources: string[];
  validationScore: number;
  searchEngine: string;
  contextQuality?: string;
  tripartiteMetrics?: any; // NEW: Tripartite flow metrics
}

interface ContextSummary {
  hasProfile: boolean;
  knowledgeCount: number;
  contentCount: number;
  activityCount: number;
  quality: string;
}

export function useUnifiedAISystem() {
  const { user } = useAuth();
  const { buildEliteSystemPrompt } = useElitePromptEngine();
  const { validateResponse } = useWebDataValidator();
  const { executeTripartiteFlow } = useTripartiteAIFlow();
  const { executeAdvancedFlow } = useAdvancedTripartiteFlow();
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
        searchEnabled: request.searchEnabled
      });

      // NUEVO: Decidir si usar flujo tripartito
      const shouldUseTripartite = request.useTripartiteFlow || 
                                 request.agentType === 'research-engine' ||
                                 request.agentType === 'enhanced-content-generator' ||
                                 (request.searchEnabled && ['cdv', 'cir', 'cia'].includes(request.agentType));

      if (shouldUseTripartite) {
        console.log('🚀 ACTIVANDO FLUJO TRIPARTITO para', request.agentType.toUpperCase());
        
        // Usar flujo tripartito avanzado
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

      // FLUJO ESTÁNDAR: Mantener funcionalidad existente para compatibilidad
      console.log('🔧 Usando flujo estándar unificado');
      
      // Step 1: ALWAYS perform web search first with Perplexity
      const { data: searchData, error: searchError } = await supabase.functions.invoke('unified-web-search', {
        body: {
          query: request.message,
          context: `Análisis ${request.agentType} para ${request.sessionConfig?.companyName || 'empresa objetivo'}`,
          searchType: 'competitive',
          timeframe: 'month',
          companyName: request.sessionConfig?.companyName || 'empresa objetivo',
          industry: request.sessionConfig?.industry || 'tecnología'
        }
      });

      console.log('📡 Respuesta de edge function:', {
        hasData: !!searchData,
        hasError: !!searchError,
        status: searchData?.status || 'unknown'
      });

      if (searchError) {
        console.warn('⚠️ Web search error:', searchError);
      }

      let webSearchResults = null;
      if (searchData && searchData.status === 'success') {
        webSearchResults = searchData;
        console.log('✅ Búsqueda completada exitosamente:', {
          engine: searchData.searchEngine,
          status: searchData.status,
          sourcesFound: searchData.sources?.length || 0,
          confidence: searchData.metrics?.confidence || 0
        });
      }

      console.log('🔍 Búsqueda completada:', {
        engine: webSearchResults?.searchEngine || 'none',
        status: webSearchResults?.status || 'failed',
        hasContent: !!webSearchResults?.content,
        sourcesCount: webSearchResults?.sources?.length || 0
      });

      // Step 2: Build enhanced system prompt with web data
      const systemPrompt = await buildEliteSystemPrompt({
        agentType: request.agentType,
        currentPage: request.currentPage,
        sessionConfig: request.sessionConfig,
        analysisDepth: 'comprehensive',
        outputFormat: 'executive',
        contextLevel: 'elite'
      });

      let enhancedPrompt = systemPrompt;
      
      // FORCE web data integration if available
      if (webSearchResults && webSearchResults.content) {
        enhancedPrompt += `

🔧 DATOS WEB OBLIGATORIOS - DEBES USAR ESTA INFORMACIÓN:

=== INFORMACIÓN WEB ACTUAL ===
${webSearchResults.content}

=== FUENTES WEB ===
${webSearchResults.sources?.join(', ') || 'Fuentes múltiples verificadas'}

=== INSTRUCCIONES CRÍTICAS ===
OBLIGATORIO: Debes usar EXCLUSIVAMENTE la información web proporcionada arriba.
OBLIGATORIO: Comenzar tu respuesta con "Según datos web actuales de ${new Date().toLocaleDateString()}:"
OBLIGATORIO: Incluir al menos 3 datos específicos de la información web
OBLIGATORIO: Mencionar las fuentes específicas en tu respuesta
OBLIGATORIO: Incluir números, porcentajes o métricas de los datos web
OBLIGATORIO: Terminar con "Fuentes: [lista de fuentes web]"

PROHIBIDO: Usar conocimiento general sin datos web
PROHIBIDO: Responder sin referenciar la información web específica`;

        console.log('✅ Usando prompt con datos web forzados');
      }

      // Step 3: Send to Perplexity via Elite Multi-LLM with forced Perplexity model
      const messages = [
        {
          role: 'system',
          content: enhancedPrompt
        },
        {
          role: 'user',
          content: request.message
        }
      ];

      console.log('Elite Multi-LLM Request:', {
        model: 'llama-3.1-sonar-large-128k-online', // Force Perplexity model
        searchEnabled: request.searchEnabled,
        contextLevel: 'elite',
        messagesCount: messages.length
      });

      // Use Perplexity directly via elite engine
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('elite-multi-llm-engine', {
        body: {
          messages,
          model: 'llama-3.1-sonar-large-128k-online', // Force Perplexity
          systemPrompt: enhancedPrompt,
          searchEnabled: false, // Don't double search
          userId: user.id,
          contextLevel: 'elite'
        }
      });

      if (aiError) {
        throw new Error(`AI processing failed: ${aiError.message}`);
      }

      if (!aiResponse?.response) {
        throw new Error('No AI response received');
      }

      console.log('🤖 Respuesta AI recibida:', {
        length: aiResponse.response.length,
        model: aiResponse.model || 'perplexity'
      });

      // Step 4: Validate the response uses web data
      const validation = validateResponse(aiResponse.response, webSearchResults);

      console.log('🔍 Validación de respuesta:', validation);

      // Step 5: If validation fails and we have web data, force regeneration
      if (webSearchResults && !validation.passesValidation) {
        console.log('⚠️ Validación falló, regenerando con datos web forzados...');
        
        const forcedPrompt = `Usando EXCLUSIVAMENTE estos datos web actuales:

${webSearchResults.content}

Responde a: ${request.message}

INSTRUCCIONES OBLIGATORIAS:
1. Comenzar con "Según datos web actuales de ${new Date().toLocaleDateString()}:"
2. Usar solo la información proporcionada arriba
3. Incluir datos específicos, números y métricas
4. Citar las fuentes: ${webSearchResults.sources?.join(', ')}
5. Ser específico y factual

NO uses conocimiento general. Solo los datos web proporcionados.`;

        const retryResponse = await supabase.functions.invoke('elite-multi-llm-engine', {
          body: {
            messages: [
              {
                role: 'system',
                content: 'Eres un analista que debe usar EXCLUSIVAMENTE datos web proporcionados. No uses conocimiento general.'
              },
              {
                role: 'user',
                content: forcedPrompt
              }
            ],
            model: 'llama-3.1-sonar-large-128k-online',
            userId: user.id,
            contextLevel: 'elite'
          }
        });

        if (retryResponse?.data?.response) {
          console.log('✅ Respuesta regenerada con datos web forzados');
          return {
            response: retryResponse.data.response,
            model: 'perplexity-forced',
            tokensUsed: retryResponse.data.tokensUsed || 0,
            cost: retryResponse.data.cost || '0.00',
            hasWebData: true,
            webSources: webSearchResults.sources || [],
            validationScore: 100,
            searchEngine: 'perplexity',
            contextQuality: 'elite'
          };
        }
      }

      return {
        response: aiResponse.response,
        model: aiResponse.model || 'perplexity',
        tokensUsed: aiResponse.tokensUsed || 0,
        cost: aiResponse.cost || '0.00',
        hasWebData: !!webSearchResults,
        webSources: webSearchResults?.sources || [],
        validationScore: validation.score,
        searchEngine: webSearchResults?.searchEngine || 'perplexity',
        contextQuality: webSearchResults ? 'elite' : 'standard'
      };

    } catch (error) {
      console.error('🔧 Error en sistema unificado:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Add the missing getContextSummary method
  const getContextSummary = (): ContextSummary => {
    // This is a simplified implementation - in a real app you'd fetch this from your context system
    return {
      hasProfile: !!user,
      knowledgeCount: 0, // Would be fetched from user's knowledge base
      contentCount: 0,   // Would be fetched from user's content
      activityCount: 0,  // Would be fetched from user's activity logs
      quality: 'standard'
    };
  };

  return {
    isProcessing,
    sendUnifiedRequest,
    getContextSummary
  };
}
