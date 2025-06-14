
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { costMonitor } from '../_shared/cost-monitor.ts';

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
const supabaseUrl = 'https://jzvpgqtobzqbavsillqp.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!perplexityApiKey || !supabaseServiceKey) {
  throw new Error('Required environment variables are missing');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Optimized prompt builder with caching
const promptCache = new Map<string, string>();

function buildOptimizedPrompt(query: string, researchType: string, industry?: string): string {
  const cacheKey = `${query}-${researchType}-${industry || 'none'}`;
  
  if (promptCache.has(cacheKey)) {
    return promptCache.get(cacheKey)!;
  }

  const basePrompt = `Research Query: ${query}

Focus on finding 5-8 high-quality, recent sources with:
- Direct working links
- Key statistics and data points
- Expert insights and analysis
- Actionable takeaways

${industry ? `Industry focus: ${industry}` : ''}

Prioritize sources from the last 6 months and provide specific, measurable insights.`;

  promptCache.set(cacheKey, basePrompt);
  return basePrompt;
}

// Optimized source extraction with better performance
function extractSourcesOptimized(content: string): Array<{
  title: string;
  url: string;
  snippet: string;
  relevance: number;
  domain: string;
}> {
  const sources = [];
  const urlRegex = /https?:\/\/[^\s)]+/g;
  const urls = [...new Set(content.match(urlRegex) || [])]; // Remove duplicates
  
  for (let i = 0; i < Math.min(urls.length, 8); i++) {
    const url = urls[i];
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      
      // Extract context more efficiently
      const urlIndex = content.indexOf(url);
      const contextStart = Math.max(0, urlIndex - 150);
      const contextEnd = Math.min(content.length, urlIndex + 150);
      const context = content.substring(contextStart, contextEnd);
      
      // Find title and snippet
      const sentences = context.split(/[.!?]+/);
      const meaningfulSentence = sentences.find(s => s.length > 20 && s.length < 150);
      
      sources.push({
        title: `Research Source ${i + 1}`,
        url: url,
        snippet: meaningfulSentence?.trim() || `Source from ${domain}`,
        relevance: 1 - (i * 0.1),
        domain: domain
      });
    } catch (error) {
      console.warn('Failed to parse URL:', url);
    }
  }
  
  return sources;
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

    const { query, researchType = 'comprehensive', model = 'llama-3.1-sonar-large-128k-online', industry } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: 'Research query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sessionId = crypto.randomUUID();
    const prompt = buildOptimizedPrompt(query, researchType, industry);

    console.log('Optimized Research Request:', {
      userId: user.id,
      sessionId,
      queryLength: query.length,
      model
    });

    const result = await costMonitor.withCostControl(
      user.id,
      model,
      'optimized-research',
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
                content: 'You are a research assistant focused on finding credible, recent sources with working links. Prioritize quality over quantity.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.1,
            max_tokens: 2000,
            top_p: 0.9,
            search_recency_filter: 'month',
            return_images: false,
            return_related_questions: false
          }),
        });

        if (!response.ok) {
          throw new Error(`Perplexity API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const usage = data.usage;

        // Optimized extraction
        const sources = extractSourcesOptimized(content);
        const insights = content.split('\n')
          .filter(line => line.includes('%') || line.includes('$') || /\d+/.test(line))
          .slice(0, 5)
          .map(line => line.trim());

        const researchResponse = {
          content,
          sources,
          insights,
          keywords: [],
          sessionId,
          metadata: {
            query,
            model,
            researchType,
            timestamp: new Date().toISOString(),
            creditsUsed: Math.ceil((usage?.total_tokens || 1000) / 1000) * 2,
            totalSources: sources.length
          }
        };

        // Background save (non-blocking)
        EdgeRuntime.waitUntil(
          supabase
            .from('research_sessions')
            .insert({
              id: sessionId,
              user_id: user.id,
              query,
              research_type: researchType,
              industry,
              content,
              sources,
              insights,
              keywords: [],
              credits_used: researchResponse.metadata.creditsUsed,
              model_used: model
            })
            .then(() => console.log('Research session saved'))
            .catch(err => console.error('Save failed:', err))
        );

        return {
          result: researchResponse,
          inputTokens: usage?.prompt_tokens || 500,
          outputTokens: usage?.completion_tokens || 500,
        };
      }
    );

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Optimized research error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Research failed',
      message: 'Please try again with a simpler query.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
