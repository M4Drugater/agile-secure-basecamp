
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  context: string;
  searchType: 'competitive' | 'financial' | 'market' | 'comprehensive';
  timeframe: 'hour' | 'day' | 'week' | 'month' | 'quarter';
  companyName?: string;
  industry?: string;
}

interface SearchResult {
  content: string;
  sources: string[];
  insights: Array<{
    title: string;
    description: string;
    confidence: number;
  }>;
  metrics: {
    confidence: number;
    sourceCount: number;
    relevanceScore: number;
  };
  timestamp: string;
  searchEngine: string;
  status: 'success' | 'partial' | 'fallback' | 'error';
  errorMessage?: string;
}

serve(async (req) => {
  console.log('🔧 Unified Web Search - Request received:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let searchRequest: SearchRequest;
  let searchResult: SearchResult;

  try {
    searchRequest = await req.json();
    console.log('📋 Search request parsed:', {
      query: searchRequest.query?.substring(0, 50) + '...',
      searchType: searchRequest.searchType,
      companyName: searchRequest.companyName
    });

    // Validate required fields
    if (!searchRequest.query || !searchRequest.context) {
      throw new Error('Missing required fields: query and context');
    }

    // Get API keys from environment
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    console.log('🔑 API Keys availability:', {
      perplexity: !!perplexityKey,
      openai: !!openaiKey
    });

    // Try Perplexity first (best for real-time web search)
    if (perplexityKey) {
      try {
        console.log('🌐 Attempting Perplexity search...');
        searchResult = await performPerplexitySearch(perplexityKey, searchRequest);
        console.log('✅ Perplexity search successful');
      } catch (error) {
        console.warn('⚠️ Perplexity search failed:', error.message);
        searchResult = null;
      }
    }

    // Fallback to OpenAI if Perplexity fails
    if (!searchResult && openaiKey) {
      try {
        console.log('🔄 Fallback to OpenAI analysis...');
        searchResult = await performOpenAIAnalysis(openaiKey, searchRequest);
        console.log('✅ OpenAI analysis successful');
      } catch (error) {
        console.warn('⚠️ OpenAI analysis failed:', error.message);
        searchResult = null;
      }
    }

    // Final fallback with structured response
    if (!searchResult) {
      console.log('📋 Using structured fallback...');
      searchResult = createStructuredFallback(searchRequest);
    }

    // Log successful search
    await logSearchAttempt(searchRequest, searchResult);

    // Return successful response
    return new Response(JSON.stringify(searchResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('❌ Critical error in unified search:', error);
    
    // Create error response
    const errorResult: SearchResult = {
      content: `Error en búsqueda: ${error.message}. El sistema mantendrá funcionalidad básica.`,
      sources: [],
      insights: [{
        title: 'Error de Sistema',
        description: `Problema técnico: ${error.message}`,
        confidence: 0.1
      }],
      metrics: {
        confidence: 0.1,
        sourceCount: 0,
        relevanceScore: 0.1
      },
      timestamp: new Date().toISOString(),
      searchEngine: 'error',
      status: 'error',
      errorMessage: error.message
    };

    return new Response(JSON.stringify(errorResult), {
      status: 200, // Return 200 to prevent agent failures
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function performPerplexitySearch(apiKey: string, request: SearchRequest): Promise<SearchResult> {
  const optimizedQuery = buildOptimizedQuery(request);
  console.log('🔍 Perplexity query built:', optimizedQuery.substring(0, 100) + '...');

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: `Eres un analista de inteligencia competitiva experto. Proporciona análisis detallado y factual con datos específicos y fuentes. Enfócate en inteligencia ${request.searchType}.`
        },
        {
          role: 'user',
          content: optimizedQuery
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
      return_citations: true,
      search_recency_filter: mapTimeframeToRecency(request.timeframe)
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';
  const citations = data.citations || [];

  if (!content) {
    throw new Error('Empty response from Perplexity API');
  }

  return {
    content,
    sources: extractSourcesFromPerplexity(citations),
    insights: extractInsightsFromContent(content, request),
    metrics: {
      confidence: 0.9,
      sourceCount: citations.length,
      relevanceScore: 0.85
    },
    timestamp: new Date().toISOString(),
    searchEngine: 'perplexity',
    status: 'success'
  };
}

async function performOpenAIAnalysis(apiKey: string, request: SearchRequest): Promise<SearchResult> {
  const analysisPrompt = buildAnalysisPrompt(request);
  console.log('🤖 OpenAI analysis prompt built');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un analista de negocio experto. Proporciona análisis estratégico detallado con insights accionables.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.2,
      max_tokens: 2000
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';

  if (!content) {
    throw new Error('Empty response from OpenAI API');
  }

  return {
    content,
    sources: ['OpenAI Knowledge Base'],
    insights: extractInsightsFromContent(content, request),
    metrics: {
      confidence: 0.7,
      sourceCount: 1,
      relevanceScore: 0.7
    },
    timestamp: new Date().toISOString(),
    searchEngine: 'openai',
    status: 'partial'
  };
}

function createStructuredFallback(request: SearchRequest): SearchResult {
  const companyContext = request.companyName || 'la empresa objetivo';
  const industryContext = request.industry || 'el sector correspondiente';

  const fallbackAnalysis = `Análisis estratégico para ${companyContext} en ${industryContext}:

**Contexto de Análisis:**
- Consulta: ${request.query}
- Enfoque: ${request.searchType}
- Marco temporal: ${request.timeframe}

**Análisis General:**
1. **Posicionamiento Competitivo**: Es fundamental evaluar la posición actual en el mercado mediante análisis de fortalezas, debilidades y diferenciación competitiva.

2. **Tendencias del Sector**: ${industryContext} presenta dinámicas específicas que requieren monitoreo continuo de innovaciones, regulaciones y cambios en preferencias del consumidor.

3. **Oportunidades Estratégicas**: Identificación de nichos de mercado, expansión geográfica, alianzas estratégicas y desarrollo de nuevos productos/servicios.

4. **Gestión de Riesgos**: Evaluación de amenazas competitivas, riesgos regulatorios, cambios tecnológicos y volatilidad del mercado.

**Recomendaciones Inmediatas:**
- Realizar investigación primaria con datos actuales del mercado
- Establecer sistema de monitoreo competitivo continuo
- Desarrollar métricas de performance específicas del sector
- Implementar análisis FODA actualizado

*Nota: Este análisis se basa en patrones generales del sector. Para insights más específicos, se recomienda acceso a datos de mercado en tiempo real.*`;

  return {
    content: fallbackAnalysis,
    sources: ['Base de Conocimiento Estratégico'],
    insights: [
      {
        title: 'Análisis Competitivo Requerido',
        description: 'Necesidad de datos actuales del mercado para análisis profundo',
        confidence: 0.6
      },
      {
        title: 'Oportunidad de Investigación',
        description: 'Potencial para investigación primaria especializada',
        confidence: 0.7
      },
      {
        title: 'Marco Estratégico',
        description: 'Aplicación de metodologías de análisis competitivo estándar',
        confidence: 0.8
      }
    ],
    metrics: {
      confidence: 0.6,
      sourceCount: 1,
      relevanceScore: 0.5
    },
    timestamp: new Date().toISOString(),
    searchEngine: 'fallback',
    status: 'fallback'
  };
}

function buildOptimizedQuery(request: SearchRequest): string {
  const { query, companyName, industry, searchType, timeframe } = request;
  
  const timeframeMap = {
    'hour': 'última hora',
    'day': 'últimas 24 horas', 
    'week': 'última semana',
    'month': 'último mes',
    'quarter': 'últimos 3 meses'
  };

  const searchFocus = {
    'financial': 'rendimiento financiero, ingresos, métricas clave, precio de acciones',
    'competitive': 'análisis competitivo, posición de mercado, movimientos estratégicos',
    'market': 'tendencias de mercado, análisis de industria, dinámicas del sector',
    'comprehensive': 'análisis integral, estrategia empresarial, inteligencia de mercado'
  };

  let optimizedQuery = `Analiza ${companyName || 'empresa'} en la industria ${industry || 'correspondiente'}. `;
  optimizedQuery += `Enfócate en ${searchFocus[searchType]} durante ${timeframeMap[timeframe]}. `;
  optimizedQuery += `Consulta específica: ${query}. `;
  optimizedQuery += `Proporciona datos específicos con fuentes verificables.`;

  return optimizedQuery;
}

function buildAnalysisPrompt(request: SearchRequest): string {
  return `Proporciona análisis estratégico detallado sobre: ${request.query}

Contexto:
- Empresa: ${request.companyName || 'No especificada'}
- Industria: ${request.industry || 'General'}
- Tipo de análisis: ${request.searchType}
- Marco temporal: ${request.timeframe}

Incluye:
1. Análisis de situación actual
2. Identificación de tendencias clave
3. Oportunidades y amenazas
4. Recomendaciones estratégicas
5. Métricas de seguimiento sugeridas

Proporciona insights accionables y específicos.`;
}

function mapTimeframeToRecency(timeframe: string): string {
  const recencyMap = {
    'hour': 'hour',
    'day': 'day', 
    'week': 'week',
    'month': 'month',
    'quarter': 'month'
  };
  return recencyMap[timeframe] || 'month';
}

function extractSourcesFromPerplexity(citations: any[]): string[] {
  if (!Array.isArray(citations)) return ['Perplexity Search'];
  
  return citations.map(citation => 
    citation.url || citation.title || citation.source || 'Fuente Web'
  ).slice(0, 5); // Limit to 5 sources
}

function extractInsightsFromContent(content: string, request: SearchRequest): Array<{title: string, description: string, confidence: number}> {
  const insights = [];
  const lines = content.split('\n').filter(line => line.trim().length > 20);
  
  // Extract key insights based on content analysis
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim();
    if (line.includes(':') && line.length > 30) {
      const parts = line.split(':');
      if (parts.length >= 2) {
        insights.push({
          title: parts[0].replace(/^\d+\.\s*/, '').trim(),
          description: parts.slice(1).join(':').trim(),
          confidence: 0.8 - (i * 0.1)
        });
      }
    }
  }
  
  // Ensure at least one insight
  if (insights.length === 0) {
    insights.push({
      title: 'Análisis Competitivo',
      description: 'Análisis estratégico basado en información disponible',
      confidence: 0.7
    });
  }
  
  return insights;
}

async function logSearchAttempt(request: SearchRequest, result: SearchResult) {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabase.from('web_search_logs').insert({
      query: request.query,
      search_type: request.searchType,
      search_engine: result.searchEngine,
      success: result.status === 'success',
      confidence: result.metrics.confidence,
      company_name: request.companyName,
      industry: request.industry,
      error_message: result.errorMessage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log search attempt:', error);
    // Don't throw - logging shouldn't break the main flow
  }
}
