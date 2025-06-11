
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { costMonitor } from '../_shared/cost-monitor.ts';

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
const supabaseUrl = 'https://jzvpgqtobzqbavsillqp.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!perplexityApiKey) {
  throw new Error('PERPLEXITY_API_KEY is required');
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResearchRequest {
  query: string;
  researchType: 'quick' | 'comprehensive' | 'industry-specific';
  model?: 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online';
  industry?: string;
  sources?: string[];
  depth?: 'surface' | 'detailed' | 'expert';
  sessionId?: string;
}

interface ResearchResponse {
  content: string;
  sources: Array<{
    title: string;
    url: string;
    snippet: string;
    relevance: number;
  }>;
  insights: string[];
  keywords: string[];
  sessionId: string;
  metadata: {
    query: string;
    model: string;
    researchType: string;
    timestamp: string;
    creditsUsed: number;
  };
}

function countTokens(text: string): number {
  const words = text.split(/\s+/).length;
  const chars = text.length;
  return Math.ceil(Math.max(words * 1.33, chars / 4));
}

function buildResearchPrompt(query: string, researchType: string, industry?: string): string {
  const basePrompt = `You are an elite business research analyst conducting research for C-suite executives. Your research must be:
- Comprehensive and data-driven
- Include specific statistics, trends, and market data
- Cite credible sources and recent information
- Provide actionable insights for business leaders
- Maintain executive-level perspective and language

Research Query: ${query}`;

  const typePrompts = {
    'quick': `Provide a focused overview with key facts, recent trends, and 3-5 actionable insights.`,
    'comprehensive': `Conduct an in-depth analysis including market size, key players, recent developments, challenges, opportunities, and strategic recommendations.`,
    'industry-specific': `Focus specifically on ${industry || 'the relevant industry'} context, including sector-specific trends, competitive landscape, regulatory factors, and industry benchmarks.`
  };

  return `${basePrompt}

Research Type: ${typePrompts[researchType as keyof typeof typePrompts]}

Please structure your response with:
1. Executive Summary (2-3 sentences)
2. Key Findings (bulleted insights with data)
3. Market Context (trends, statistics, benchmarks)
4. Strategic Implications (actionable recommendations)
5. Sources and References

Ensure all claims are backed by recent data and credible sources.`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const researchRequest: ResearchRequest = await req.json();

    if (!researchRequest.query) {
      return new Response(JSON.stringify({ error: 'Research query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const model = researchRequest.model || 'llama-3.1-sonar-large-128k-online';
    const researchType = researchRequest.researchType || 'comprehensive';
    const sessionId = researchRequest.sessionId || crypto.randomUUID();

    const prompt = buildResearchPrompt(researchRequest.query, researchType, researchRequest.industry);

    console.log('Perplexity Research Request:', {
      userId: user.id,
      query: researchRequest.query,
      researchType,
      model,
      sessionId,
      estimatedTokens: countTokens(prompt)
    });

    const result = await costMonitor.withCostControl(
      user.id,
      model,
      'perplexity-research',
      prompt,
      async () => {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${perplexityApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: 'You are an elite business research analyst. Provide comprehensive, data-driven research with credible sources and executive-level insights.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.2,
            max_tokens: 4000,
            top_p: 0.9,
            return_images: false,
            return_related_questions: true,
            search_domain_filter: ['bloomberg.com', 'reuters.com', 'wsj.com', 'ft.com', 'harvard.edu', 'mit.edu'],
            search_recency_filter: 'month',
            frequency_penalty: 1,
            presence_penalty: 0
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Perplexity API error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        
        if (!data.choices || data.choices.length === 0) {
          throw new Error('No response from Perplexity');
        }

        const content = data.choices[0].message.content;
        const usage = data.usage;

        // Extract sources and insights from the content
        const sources = extractSources(content);
        const insights = extractInsights(content);
        const keywords = extractKeywords(researchRequest.query, content);

        const researchResponse: ResearchResponse = {
          content,
          sources,
          insights,
          keywords,
          sessionId,
          metadata: {
            query: researchRequest.query,
            model,
            researchType,
            timestamp: new Date().toISOString(),
            creditsUsed: Math.ceil((usage?.total_tokens || countTokens(content)) / 1000) * 2 // Research costs more
          }
        };

        // Save research session
        try {
          await supabase
            .from('research_sessions')
            .insert({
              id: sessionId,
              user_id: user.id,
              query: researchRequest.query,
              research_type: researchType,
              industry: researchRequest.industry,
              content,
              sources: sources,
              insights: insights,
              keywords: keywords,
              credits_used: researchResponse.metadata.creditsUsed,
              model_used: model
            });
        } catch (saveError) {
          console.error('Failed to save research session:', saveError);
        }

        return {
          result: researchResponse,
          inputTokens: usage?.prompt_tokens || countTokens(prompt),
          outputTokens: usage?.completion_tokens || countTokens(content),
        };
      }
    );

    console.log('Perplexity Research Success:', {
      userId: user.id,
      sessionId,
      sourcesFound: result.sources?.length || 0,
      insightsExtracted: result.insights?.length || 0,
      creditsUsed: result.metadata?.creditsUsed
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in perplexity-research function:', error);
    
    if (error instanceof Error && error.message.includes('Cost limit exceeded')) {
      return new Response(JSON.stringify({ 
        error: 'Usage limit reached',
        message: 'You have reached your daily AI usage limit. Please try again tomorrow or upgrade your plan.',
        details: error.message
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'An error occurred while conducting research. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractSources(content: string): Array<{title: string, url: string, snippet: string, relevance: number}> {
  const sources = [];
  const urlRegex = /https?:\/\/[^\s)]+/g;
  const urls = content.match(urlRegex) || [];
  
  for (let i = 0; i < Math.min(urls.length, 5); i++) {
    const url = urls[i];
    const domain = new URL(url).hostname;
    sources.push({
      title: `Research Source ${i + 1}`,
      url: url,
      snippet: `Source from ${domain}`,
      relevance: 1 - (i * 0.1)
    });
  }
  
  return sources;
}

function extractInsights(content: string): string[] {
  const insights = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.includes('insight') || line.includes('finding') || line.includes('trend') || line.includes('%')) {
      const cleaned = line.trim().replace(/^[•\-\*]\s*/, '');
      if (cleaned.length > 20 && cleaned.length < 200) {
        insights.push(cleaned);
      }
    }
  }
  
  return insights.slice(0, 8);
}

function extractKeywords(query: string, content: string): string[] {
  const queryWords = query.toLowerCase().split(' ');
  const contentWords = content.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const frequency: Record<string, number> = {};
  
  for (const word of contentWords) {
    if (!queryWords.includes(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  }
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}
