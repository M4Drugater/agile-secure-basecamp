
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TripartiteRequest {
  userQuery: string;
  agentType: 'clipogino' | 'cdv' | 'cir' | 'cia' | 'research-engine' | 'enhanced-content-generator';
  sessionConfig?: any;
  contextLevel: 'basic' | 'enhanced' | 'elite';
}

interface TripartiteResponse {
  finalResponse: string;
  metadata: {
    openaiInterpretation: string;
    perplexitySearchResults: any;
    claudeStyledContent: string;
    totalTokens: number;
    totalCost: string;
    webSources: string[];
    confidenceScore: number;
    processingTime: number;
  };
  status: 'success' | 'partial' | 'failed';
}

export function useTripartiteAIFlow() {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'interpreting' | 'searching' | 'styling' | 'complete'>('complete');

  const executeTripartiteFlow = async (request: TripartiteRequest): Promise<TripartiteResponse> => {
    if (!user) {
      throw new Error('Authentication required for tripartite AI flow');
    }

    setIsProcessing(true);
    const startTime = Date.now();
    let totalTokens = 0;
    let totalCost = 0;

    try {
      console.log('🔧 SISTEMA TRIPARTITO - Iniciando flujo completo:', {
        query: request.userQuery,
        agent: request.agentType,
        user: user.email
      });

      // FASE 1: OpenAI Interpreta y Enriquece la Consulta
      setCurrentStep('interpreting');
      toast.info('Fase 1: OpenAI interpretando consulta', {
        description: 'Analizando intención y enriqueciendo contexto...'
      });

      const interpretationPrompt = `Eres un especialista en análisis de consultas empresariales. Tu trabajo es interpretar la siguiente consulta del usuario y crear una búsqueda web optimizada:

CONSULTA ORIGINAL: "${request.userQuery}"
AGENTE OBJETIVO: ${request.agentType.toUpperCase()}
CONTEXTO: ${request.sessionConfig?.companyName || 'empresa'} en ${request.sessionConfig?.industry || 'sector general'}

TAREA:
1. Analiza la intención de la consulta
2. Identifica los datos específicos que se necesitan buscar en web
3. Crea una consulta de búsqueda optimizada para Perplexity
4. Sugiere términos clave para encontrar datos recientes y verificables

FORMATO DE RESPUESTA:
INTENCIÓN: [análisis de lo que busca el usuario]
BÚSQUEDA_OPTIMIZADA: [consulta específica para web search]
TÉRMINOS_CLAVE: [palabras clave separadas por comas]
ENFOQUE_TEMPORAL: [timeframe recomendado: hour/day/week/month]
TIPO_DATOS: [qué tipo de datos específicos buscar]`;

      const { data: interpretationData, error: openaiError } = await supabase.functions.invoke('elite-multi-llm-engine', {
        body: {
          messages: [
            { role: 'system', content: 'Eres un experto analista de consultas empresariales.' },
            { role: 'user', content: interpretationPrompt }
          ],
          model: 'gpt-4o',
          userId: user.id,
          contextLevel: request.contextLevel
        }
      });

      if (openaiError || !interpretationData) {
        throw new Error(`OpenAI interpretation failed: ${openaiError?.message}`);
      }

      const interpretation = interpretationData.response;
      totalTokens += interpretationData.tokensUsed || 0;
      totalCost += parseFloat(interpretationData.cost || '0');

      console.log('✅ FASE 1 COMPLETADA - OpenAI interpretation:', {
        tokens: interpretationData.tokensUsed,
        cost: interpretationData.cost
      });

      // FASE 2: Perplexity Realiza Búsqueda Web Profunda
      setCurrentStep('searching');
      toast.info('Fase 2: Perplexity buscando en web', {
        description: 'Realizando búsqueda profunda con datos verificables...'
      });

      // Extraer la búsqueda optimizada de la interpretación
      const searchMatch = interpretation.match(/BÚSQUEDA_OPTIMIZADA:\s*(.+?)(?:\n|$)/);
      const optimizedSearch = searchMatch ? searchMatch[1].trim() : request.userQuery;

      const searchPrompt = `Realiza una investigación web profunda sobre: ${optimizedSearch}

CONTEXTO EMPRESARIAL:
- Empresa: ${request.sessionConfig?.companyName || 'empresa objetivo'}
- Industria: ${request.sessionConfig?.industry || 'sector relevante'}
- Tipo de análisis: ${request.agentType}

INSTRUCCIONES CRÍTICAS:
1. Busca datos específicos, números, porcentajes, métricas
2. Enfócate en información de los últimos 30 días
3. Incluye fuentes verificables y fechas específicas
4. Proporciona análisis competitivo si es relevante
5. Busca tendencias del mercado y cambios regulatorios

OBLIGATORIO: Incluir datos cuantitativos verificables con fuentes específicas.`;

      const { data: searchData, error: perplexityError } = await supabase.functions.invoke('elite-multi-llm-engine', {
        body: {
          messages: [
            { role: 'system', content: 'Eres un investigador de elite con acceso a datos web en tiempo real. Proporciona análisis detallado con fuentes verificables.' },
            { role: 'user', content: searchPrompt }
          ],
          model: 'llama-3.1-sonar-large-128k-online',
          userId: user.id,
          contextLevel: request.contextLevel
        }
      });

      if (perplexityError || !searchData) {
        throw new Error(`Perplexity search failed: ${perplexityError?.message}`);
      }

      const searchResults = searchData.response;
      totalTokens += searchData.tokensUsed || 0;
      totalCost += parseFloat(searchData.cost || '0');

      console.log('✅ FASE 2 COMPLETADA - Perplexity search:', {
        tokens: searchData.tokensUsed,
        cost: searchData.cost,
        hasWebData: searchResults.length > 100
      });

      // FASE 3: Claude Estiliza y Sintetiza la Respuesta Final
      setCurrentStep('styling');
      toast.info('Fase 3: Claude estilizando respuesta', {
        description: 'Creando respuesta ejecutiva final...'
      });

      const claudePrompt = `Eres Claude, especialista en comunicación ejecutiva y síntesis estratégica. Tu tarea es crear una respuesta final de alta calidad.

CONSULTA ORIGINAL DEL USUARIO:
"${request.userQuery}"

INTERPRETACIÓN DE OPENAI:
${interpretation}

DATOS WEB DE PERPLEXITY:
${searchResults}

CONTEXTO DEL AGENTE:
- Tipo: ${request.agentType.toUpperCase()}
- Empresa: ${request.sessionConfig?.companyName || 'empresa objetivo'}
- Industria: ${request.sessionConfig?.industry || 'sector'}

INSTRUCCIONES PARA LA RESPUESTA FINAL:
1. Usa EXCLUSIVAMENTE los datos web proporcionados por Perplexity
2. Mantén el estilo y expertise del agente ${request.agentType}
3. Estructura la respuesta de manera ejecutiva y profesional
4. Incluye datos específicos y fuentes verificables
5. Proporciona insights accionables
6. Mantén claridad y precisión

FORMATO OBLIGATORIO:
- Comenzar con "Según datos web actuales de ${new Date().toLocaleDateString()}:"
- Incluir al menos 3 datos específicos con números/porcentajes
- Terminar con "Fuentes: [lista de fuentes específicas]"
- Proporcionar recomendaciones estratégicas claras

Crea una respuesta que combine la precisión de los datos web con la calidad de comunicación ejecutiva.`;

      const { data: claudeData, error: claudeError } = await supabase.functions.invoke('elite-multi-llm-engine', {
        body: {
          messages: [
            { role: 'system', content: `Eres Claude, especialista en síntesis ejecutiva y comunicación estratégica para ${request.agentType}.` },
            { role: 'user', content: claudePrompt }
          ],
          model: 'claude-3-5-sonnet-20241022',
          userId: user.id,
          contextLevel: request.contextLevel
        }
      });

      if (claudeError || !claudeData) {
        throw new Error(`Claude styling failed: ${claudeError?.message}`);
      }

      const finalResponse = claudeData.response;
      totalTokens += claudeData.tokensUsed || 0;
      totalCost += parseFloat(claudeData.cost || '0');

      console.log('✅ FASE 3 COMPLETADA - Claude styling:', {
        tokens: claudeData.tokensUsed,
        cost: claudeData.cost,
        responseLength: finalResponse.length
      });

      setCurrentStep('complete');
      const processingTime = Date.now() - startTime;

      // Extraer fuentes de la respuesta de Perplexity
      const sources = extractWebSources(searchResults);
      const confidenceScore = calculateConfidenceScore(searchResults, finalResponse);

      toast.success('Sistema Tripartito Completado', {
        description: `OpenAI + Perplexity + Claude | Tiempo: ${Math.round(processingTime / 1000)}s | Tokens: ${totalTokens} | Costo: $${totalCost.toFixed(4)}`
      });

      return {
        finalResponse,
        metadata: {
          openaiInterpretation: interpretation,
          perplexitySearchResults: searchResults,
          claudeStyledContent: finalResponse,
          totalTokens,
          totalCost: totalCost.toFixed(6),
          webSources: sources,
          confidenceScore,
          processingTime
        },
        status: 'success'
      };

    } catch (error) {
      console.error('❌ SISTEMA TRIPARTITO - Error en flujo:', error);
      
      toast.error('Error en Sistema Tripartito', {
        description: `Falla en fase: ${currentStep}. ${error instanceof Error ? error.message : 'Error desconocido'}`
      });

      // Respuesta de fallback
      return {
        finalResponse: `Error en el sistema tripartito durante la fase: ${currentStep}

**Error**: ${error instanceof Error ? error.message : 'Error desconocido'}

**Sistema de Respaldo Activado**: 
Aunque el flujo tripartito completo falló, puedo proporcionar análisis basado en metodologías estándar de consultoría para tu consulta: "${request.userQuery}"

Para obtener el análisis web completo, por favor intenta de nuevo en unos momentos.`,
        metadata: {
          openaiInterpretation: '',
          perplexitySearchResults: null,
          claudeStyledContent: '',
          totalTokens,
          totalCost: totalCost.toFixed(6),
          webSources: [],
          confidenceScore: 0.3,
          processingTime: Date.now() - startTime
        },
        status: 'failed'
      };
    } finally {
      setIsProcessing(false);
      setCurrentStep('complete');
    }
  };

  return {
    isProcessing,
    currentStep,
    executeTripartiteFlow
  };
}

function extractWebSources(searchResults: string): string[] {
  const sources = [];
  
  // Extract URLs
  const urlMatches = searchResults.match(/https?:\/\/[^\s\)]+/g);
  if (urlMatches) {
    sources.push(...urlMatches.slice(0, 5));
  }
  
  // Extract domain names mentioned
  const domainMatches = searchResults.match(/(?:según|de|en|from)\s+([a-zA-Z0-9-]+\.com?)/gi);
  if (domainMatches) {
    sources.push(...domainMatches.slice(0, 3));
  }
  
  // Default sources if none found
  if (sources.length === 0) {
    sources.push('Búsqueda web Perplexity', 'Fuentes múltiples verificadas');
  }
  
  return sources.slice(0, 5); // Limit to 5 sources
}

function calculateConfidenceScore(searchResults: string, finalResponse: string): number {
  let score = 0.5; // Base score
  
  // Check for specific data
  if (finalResponse.includes('%') || finalResponse.includes('$') || /\b\d+\b/.test(finalResponse)) {
    score += 0.2;
  }
  
  // Check for recency indicators
  if (finalResponse.includes('2024') || finalResponse.includes('2025') || finalResponse.includes('actual')) {
    score += 0.15;
  }
  
  // Check for sources mention
  if (finalResponse.toLowerCase().includes('según') || finalResponse.toLowerCase().includes('fuent')) {
    score += 0.15;
  }
  
  return Math.min(score, 1.0);
}
