
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const searchRequest: SearchRequest = await req.json();
    console.log('🔍 Unified Web Search Request:', searchRequest);

    // Get API keys from environment
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    let searchResult = null;
    let searchEngine = 'none';

    // Try Perplexity first (best for real-time web search)
    if (perplexityKey) {
      try {
        console.log('Attempting Perplexity search...');
        searchResult = await performPerplexitySearch(perplexityKey, searchRequest);
        searchEngine = 'perplexity';
        console.log('✅ Perplexity search successful');
      } catch (error) {
        console.warn('⚠️ Perplexity search failed:', error.message);
      }
    }

    // Fallback to OpenAI if Perplexity fails
    if (!searchResult && openaiKey) {
      try {
        console.log('Fallback to OpenAI analysis...');
        searchResult = await performOpenAIAnalysis(openaiKey, searchRequest);
        searchEngine = 'openai';
        console.log('✅ OpenAI analysis successful');
      } catch (error) {
        console.warn('⚠️ OpenAI analysis failed:', error.message);
      }
    }

    // Ultimate fallback
    if (!searchResult) {
      console.log('Using knowledge-based fallback...');
      searchResult = createFallbackResult(searchRequest);
      searchEngine = 'fallback';
    }

    // Log successful search
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await logSearchRequest(supabase, {
      ...searchRequest,
      searchEngine,
      success: true,
      confidence: searchResult.metrics.confidence
    });

    return new Response(JSON.stringify({
      ...searchResult,
      searchEngine,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Unified search error:', error);
    
    return new Response(JSON.stringify({
      content: 'Search system temporarily unavailable. Analysis provided from knowledge base.',
      sources: [],
      insights: [{
        title: 'System Status',
        description: 'Search capabilities are being restored.',
        confidence: 0.3
      }],
      metrics: {
        confidence: 0.3,
        sourceCount: 0,
        relevanceScore: 0.2
      },
      searchEngine: 'error',
      timestamp: new Date().toISOString()
    }), {
      status: 200, // Return 200 to prevent agent failures
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function performPerplexitySearch(apiKey: string, request: SearchRequest) {
  const searchQuery = buildOptimizedQuery(request);
  
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
          content: `You are a professional research analyst. Provide detailed, factual analysis with specific data points and sources. Focus on ${request.searchType} intelligence.`
        },
        {
          role: 'user',
          content: searchQuery
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
      return_citations: true,
      search_recency_filter: mapTimeframeToRecency(request.timeframe)
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';
  
  return {
    content,
    sources: extractSourcesFromPerplexity(data),
    insights: extractInsightsFromContent(content),
    metrics: {
      confidence: 0.9,
      sourceCount: data.citations?.length || 0,
      relevanceScore: 0.8
    }
  };
}

async function performOpenAIAnalysis(apiKey: string, request: SearchRequest) {
  const analysisPrompt = `Provide detailed analysis about: ${request.query}
Context: ${request.context}
Focus on ${request.searchType} insights for ${request.companyName || 'the industry'}.
Include specific recommendations and strategic insights.`;

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
          content: 'You are an expert business analyst. Provide detailed, strategic analysis with actionable insights.'
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
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';
  
  return {
    content,
    sources: ['OpenAI Knowledge Base'],
    insights: extractInsightsFromContent(content),
    metrics: {
      confidence: 0.7,
      sourceCount: 1,
      relevanceScore: 0.7
    }
  };
}

function createFallbackResult(request: SearchRequest) {
  const fallbackContent = `Analysis for "${request.query}" in ${request.industry || 'the market'}:

Based on general market knowledge and industry patterns:

1. Market Position: Companies in this sector typically focus on competitive differentiation through innovation and customer experience.

2. Strategic Considerations: Key factors include market timing, competitive landscape, and operational efficiency.

3. Growth Opportunities: Consider expansion strategies, partnership opportunities, and technology adoption.

Note: This analysis is based on general knowledge patterns. For real-time market data, please ensure search connectivity is restored.`;

  return {
    content: fallbackContent,
    sources: ['Knowledge Base'],
    insights: [
      {
        title: 'Strategic Focus',
        description: 'Emphasis on competitive positioning and market differentiation',
        confidence: 0.6
      },
      {
        title: 'Growth Strategy',
        description: 'Opportunities in expansion and partnerships',
        confidence: 0.5
      }
    ],
    metrics: {
      confidence: 0.5,
      sourceCount: 1,
      relevanceScore: 0.4
    }
  };
}

function buildOptimizedQuery(request: SearchRequest): string {
  let query = request.query;
  
  if (request.companyName) {
    query += ` ${request.companyName}`;
  }
  
  if (request.industry) {
    query += ` ${request.industry} industry`;
  }

  // Add search type specific terms
  switch (request.searchType) {
    case 'competitive':
      query += ' competitive analysis market share positioning';
      break;
    case 'financial':
      query += ' financial performance revenue earnings stock price';
      break;
    case 'market':
      query += ' market trends industry analysis growth forecast';
      break;
    default:
      query += ' analysis insights trends';
  }

  return query;
}

function mapTimeframeToRecency(timeframe: string): string {
  switch (timeframe) {
    case 'hour': return 'hour';
    case 'day': return 'day';
    case 'week': return 'week';
    case 'month': return 'month';
    default: return 'month';
  }
}

function extractSourcesFromPerplexity(data: any): string[] {
  if (data.citations && Array.isArray(data.citations)) {
    return data.citations.map((citation: any) => citation.url || citation.title || 'Web Source');
  }
  return ['Perplexity Search'];
}

function extractInsightsFromContent(content: string): Array<{title: string, description: string, confidence: number}> {
  const insights = [];
  
  // Simple extraction logic - can be enhanced
  const lines = content.split('\n').filter(line => line.trim().length > 20);
  
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim();
    if (line.includes(':')) {
      const [title, ...rest] = line.split(':');
      insights.push({
        title: title.trim(),
        description: rest.join(':').trim(),
        confidence: 0.8
      });
    }
  }
  
  if (insights.length === 0) {
    insights.push({
      title: 'Market Analysis',
      description: 'Comprehensive analysis provided based on available data',
      confidence: 0.7
    });
  }
  
  return insights;
}

async function logSearchRequest(supabase: any, searchData: any) {
  try {
    await supabase.from('web_search_logs').insert({
      query: searchData.query,
      search_type: searchData.searchType,
      search_engine: searchData.searchEngine,
      success: searchData.success,
      confidence: searchData.confidence,
      company_name: searchData.companyName,
      industry: searchData.industry,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log search request:', error);
  }
}
