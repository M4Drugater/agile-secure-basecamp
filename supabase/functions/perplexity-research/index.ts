
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
  sessionId?: string;
}

interface ResearchResponse {
  content: string;
  sources: Array<{
    title: string;
    url: string;
    snippet: string;
    relevance: number;
    domain: string;
    publishDate?: string;
    author?: string;
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
    totalSources: number;
  };
}

function countTokens(text: string): number {
  const words = text.split(/\s+/).length;
  const chars = text.length;
  return Math.ceil(Math.max(words * 1.33, chars / 4));
}

function buildSourceFocusedPrompt(query: string, researchType: string, industry?: string): string {
  const basePrompt = `You are a specialized research assistant focused on finding and organizing credible sources. Your task is to:

1. Find the most relevant and recent sources for the query
2. Provide direct links to each source
3. Extract key insights from each source with specific data points
4. Organize findings by source credibility and relevance
5. Focus on actionable information rather than narrative content

Research Query: ${query}`;

  const typePrompts = {
    'quick': `Find 5-8 high-quality sources with quick insights and direct links. Focus on recent data and statistics.`,
    'comprehensive': `Find 10-15 comprehensive sources including academic papers, industry reports, news articles, and expert opinions. Provide detailed source analysis.`,
    'industry-specific': `Focus specifically on ${industry || 'the relevant industry'} sources including trade publications, industry reports, expert analyses, and recent developments.`
  };

  return `${basePrompt}

Research Type: ${typePrompts[researchType as keyof typeof typePrompts]}

Structure your response as:

SOURCES FOUND:
For each source, provide:
- Title: [Source Title]
- URL: [Direct Link]
- Domain: [Website Domain]
- Key Finding: [Specific data point or insight]
- Relevance: [Why this source is important]

KEY INSIGHTS:
- List 3-5 specific, actionable insights with data
- Include statistics, trends, or expert opinions
- Reference the source for each insight

Prioritize sources published in the last 12 months and focus on providing working links to the actual content.`;
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

    const prompt = buildSourceFocusedPrompt(researchRequest.query, researchType, researchRequest.industry);

    console.log('Source-Focused Research Request:', {
      userId: user.id,
      query: researchRequest.query,
      researchType,
      model,
      sessionId
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
                content: 'You are a research specialist focused on finding and organizing credible sources with working links. Always prioritize source quality and provide direct access to information.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.1,
            max_tokens: 3000,
            top_p: 0.9,
            return_images: false,
            return_related_questions: false,
            search_domain_filter: ['reuters.com', 'bloomberg.com', 'wsj.com', 'ft.com', 'techcrunch.com', 'harvard.edu', 'mit.edu', 'nature.com', 'sciencedirect.com'],
            search_recency_filter: 'month',
            frequency_penalty: 0.5,
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

        // Extract enhanced sources with better parsing
        const sources = extractEnhancedSources(content);
        const insights = extractSourcedInsights(content);
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
            creditsUsed: Math.ceil((usage?.total_tokens || countTokens(content)) / 1000) * 2,
            totalSources: sources.length
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

    console.log('Source Research Success:', {
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

function extractEnhancedSources(content: string): Array<{title: string, url: string, snippet: string, relevance: number, domain: string, publishDate?: string, author?: string}> {
  const sources = [];
  const lines = content.split('\n');
  
  // Look for URL patterns and extract surrounding context
  const urlRegex = /https?:\/\/[^\s)]+/g;
  const urls = content.match(urlRegex) || [];
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      
      // Find the title and context around this URL
      let title = `Source ${i + 1}`;
      let snippet = '';
      
      // Look for title patterns in surrounding text
      const urlIndex = content.indexOf(url);
      const surroundingText = content.substring(Math.max(0, urlIndex - 200), urlIndex + 200);
      
      // Extract title from patterns like "Title: [text]" or "- [text]"
      const titleMatch = surroundingText.match(/(?:Title:|-)?\s*([A-Z][^.!?]*[.!?]?)/);
      if (titleMatch) {
        title = titleMatch[1].trim().substring(0, 100);
      }
      
      // Extract snippet from the context
      const sentences = surroundingText.split(/[.!?]+/);
      snippet = sentences.find(s => s.length > 30 && s.length < 200)?.trim() || `Source from ${domain}`;
      
      sources.push({
        title: title,
        url: url,
        snippet: snippet,
        relevance: 1 - (i * 0.1), // Decrease relevance for later sources
        domain: domain,
        publishDate: extractDateFromContent(surroundingText),
        author: extractAuthorFromContent(surroundingText)
      });
    } catch (error) {
      console.error('Error parsing URL:', url, error);
    }
  }
  
  return sources.slice(0, 15); // Limit to 15 sources
}

function extractSourcedInsights(content: string): string[] {
  const insights = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Look for lines that contain insights with data or statistics
    if (line.includes('%') || 
        line.includes('$') || 
        line.includes('million') || 
        line.includes('billion') || 
        line.includes('growth') ||
        line.includes('increase') ||
        line.includes('decrease') ||
        line.match(/\d+/)) {
      
      const cleaned = line.trim().replace(/^[•\-\*\d\.]+\s*/, '');
      if (cleaned.length > 30 && cleaned.length < 250) {
        insights.push(cleaned);
      }
    }
  }
  
  return insights.slice(0, 10); // Limit to 10 key insights
}

function extractDateFromContent(text: string): string | undefined {
  const dateMatch = text.match(/(\d{4}|\w+ \d{1,2}, \d{4}|\d{1,2}\/\d{1,2}\/\d{4})/);
  return dateMatch ? dateMatch[1] : undefined;
}

function extractAuthorFromContent(text: string): string | undefined {
  const authorMatch = text.match(/(?:by|author|written by)\s+([A-Z][a-z]+ [A-Z][a-z]+)/i);
  return authorMatch ? authorMatch[1] : undefined;
}

function extractKeywords(query: string, content: string): string[] {
  const queryWords = query.toLowerCase().split(' ');
  const contentWords = content.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const frequency: Record<string, number> = {};
  
  for (const word of contentWords) {
    if (!queryWords.includes(word) && word.length > 3) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  }
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}
