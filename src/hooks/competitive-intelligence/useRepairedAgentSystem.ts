
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedWebSearch } from '@/hooks/web-search/useUnifiedWebSearch';
import { useEliteMultiLLM } from '@/hooks/useEliteMultiLLM';
import { useForceWebDataPrompt } from '@/hooks/prompts/useForceWebDataPrompt';
import { useWebDataValidator } from '@/hooks/web-search/useWebDataValidator';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType?: string;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    cost?: number;
    hasValidWebData?: boolean;
    validationScore?: number;
    webSources?: string[];
    searchEngine?: string;
  };
  hasError?: boolean;
  canRetry?: boolean;
}

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

export function useRepairedAgentSystem(agentId: string, sessionConfig: SessionConfig) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const { performUnifiedSearch, isSearching } = useUnifiedWebSearch();
  const { sendEliteRequest } = useEliteMultiLLM();
  const { buildWebDataPrompt, buildFallbackPrompt } = useForceWebDataPrompt();
  const { validateResponse } = useWebDataValidator();

  const getBaseSystemPrompt = (agentType: string): string => {
    const agentPrompts = {
      cdv: `Eres un especialista ELITE en Descubrimiento y Validación Competitiva.
MISIÓN: Proporcionar inteligencia competitiva usando EXCLUSIVAMENTE datos web en tiempo real.
ESPECIALIZACIÓN: Análisis de competidores, brechas de mercado, oportunidades estratégicas.`,

      cir: `Eres un investigador ELITE de Inteligencia Competitiva.
MISIÓN: Investigación profunda usando EXCLUSIVAMENTE datos web actuales.
ESPECIALIZACIÓN: Datos financieros, benchmarks industriales, análisis regulatorio.`,

      cia: `Eres un analista ELITE de Inteligencia Competitiva Avanzada.
MISIÓN: Análisis estratégico de nivel ejecutivo usando EXCLUSIVAMENTE datos web actuales.
ESPECIALIZACIÓN: Síntesis estratégica, opciones de negocio, recomendaciones C-suite.`
    };

    return agentPrompts[agentType as keyof typeof agentPrompts] || agentPrompts.cia;
  };

  const processMessage = async (userInput: string, sessionId: string) => {
    if (!userInput.trim() || isProcessing || !sessionId || !user) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      console.log(`🎯 SISTEMA REPARADO - Iniciando proceso para ${agentId.toUpperCase()}`);

      // PASO 1: Búsqueda web obligatoria
      const webResults = await performUnifiedSearch({
        query: userInput.trim(),
        context: `Análisis ${agentId} para ${sessionConfig.companyName}`,
        searchType: agentId === 'cir' ? 'financial' : agentId === 'cdv' ? 'competitive' : 'comprehensive',
        timeframe: 'month',
        companyName: sessionConfig.companyName,
        industry: sessionConfig.industry
      });

      console.log(`🔍 Búsqueda completada:`, {
        engine: webResults.searchEngine,
        status: webResults.status,
        hasContent: !!webResults.content,
        sourcesCount: webResults.sources?.length || 0
      });

      // PASO 2: Construir prompt forzado
      const basePrompt = getBaseSystemPrompt(agentId);
      
      let finalPrompt: string;
      if (webResults.status === 'success' && webResults.content) {
        finalPrompt = buildWebDataPrompt(basePrompt, webResults, userInput, agentId);
        console.log('✅ Usando prompt con datos web forzados');
      } else {
        finalPrompt = buildFallbackPrompt(basePrompt, userInput);
        console.log('⚠️ Usando prompt de respaldo sin datos web');
      }

      // PASO 3: Solicitud AI con prompt forzado
      const aiResponse = await sendEliteRequest({
        messages: [
          { role: 'system', content: finalPrompt },
          { role: 'user', content: userInput.trim() }
        ],
        model: 'gpt-4o',
        contextLevel: 'elite'
      });

      console.log('🤖 Respuesta AI recibida:', {
        length: aiResponse.response.length,
        model: aiResponse.model
      });

      // PASO 4: Validación de respuesta
      let validationResult = null;
      let finalResponse = aiResponse.response;

      if (webResults.status === 'success' && webResults.content) {
        validationResult = validateResponse(aiResponse.response, webResults);
        console.log('🔍 Validación de respuesta:', validationResult);

        // Si la validación falla, forzar regeneración
        if (validationResult.score < 50) {
          console.log('❌ Respuesta rechazada por no usar datos web. Regenerando...');
          
          const forcePrompt = `${finalPrompt}

ATENCIÓN: Tu respuesta anterior fue RECHAZADA por no usar los datos web.

PROBLEMAS DETECTADOS:
${validationResult.issues.join('\n')}

REGENERA la respuesta siguiendo EXACTAMENTE estas reglas:
1. Cita textualmente al menos 3 datos específicos de la búsqueda web
2. Menciona las fechas y fuentes exactas
3. Comienza con "Según los datos web actuales de ${webResults.searchEngine}..."
4. Incluye números, porcentajes o métricas específicas de los datos
5. NO uses conocimiento general - SOLO datos web actuales`;

          const retryResponse = await sendEliteRequest({
            messages: [
              { role: 'system', content: forcePrompt },
              { role: 'user', content: userInput.trim() }
            ],
            model: 'gpt-4o',
            contextLevel: 'elite'
          });

          finalResponse = retryResponse.response;
          validationResult = validateResponse(retryResponse.response, webResults);
          console.log('🔄 Respuesta regenerada. Nueva validación:', validationResult);
        }
      }

      // PASO 5: Crear mensaje final
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: finalResponse,
        timestamp: new Date(),
        agentType: agentId,
        metadata: {
          model: aiResponse.model,
          tokensUsed: aiResponse.tokensUsed,
          cost: parseFloat(aiResponse.cost),
          hasValidWebData: webResults.status === 'success',
          validationScore: validationResult?.score || 0,
          webSources: webResults.sources,
          searchEngine: webResults.searchEngine
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setRetryCount(0);

      // PASO 6: Notificación de éxito
      if (validationResult && validationResult.score >= 75) {
        toast.success(`${agentId.toUpperCase()} - Datos Web Verificados`, {
          description: `Validación: ${validationResult.score}% | Fuentes: ${webResults.sources?.length || 0}`
        });
      } else if (webResults.status === 'success') {
        toast.warning(`${agentId.toUpperCase()} - Datos Web Parciales`, {
          description: `Validación: ${validationResult?.score || 0}% | Puede necesitar refinamiento`
        });
      } else {
        toast.info(`${agentId.toUpperCase()} - Modo Respaldo`, {
          description: 'Funcionando sin datos web actuales'
        });
      }

    } catch (error) {
      console.error(`❌ Error en sistema reparado ${agentId}:`, error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Error en el sistema reparado: ${error instanceof Error ? error.message : 'Error desconocido'}. 

El sistema está configurado para usar datos web en tiempo real, pero ha encontrado un problema técnico. Intenta de nuevo en unos momentos.`,
        timestamp: new Date(),
        agentType: agentId,
        hasError: true,
        canRetry: retryCount < 3
      };

      setMessages(prev => [...prev, errorMessage]);
      setRetryCount(prev => prev + 1);
      
      toast.error(`Error en ${agentId.toUpperCase()} Agent`, {
        description: 'Sistema de respaldo activado'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const retryLastMessage = async (sessionId: string) => {
    if (!sessionId) return;
    
    const lastUserMessage = messages
      .filter(msg => msg.role === 'user')
      .pop();
    
    if (lastUserMessage) {
      setMessages(prev => prev.filter(msg => !msg.hasError));
      await processMessage(lastUserMessage.content, sessionId);
    }
  };

  return {
    messages,
    isProcessing: isProcessing || isSearching,
    processMessage,
    retryLastMessage,
    canRetry: retryCount < 3
  };
}
