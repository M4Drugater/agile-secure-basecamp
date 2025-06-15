
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EliteResearchRequest {
  query: string;
  researchType: 'quick-scan' | 'comprehensive' | 'industry-deep-dive' | 'competitive-analysis';
  industry?: string;
  model?: 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online';
  contextLevel?: 'basic' | 'enhanced' | 'elite';
  outputFormat?: 'executive-brief' | 'detailed-analysis' | 'data-points' | 'strategic-insights';
  sourceFilters?: string[];
  timeFilter?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  confidenceThreshold?: number;
  userId: string;
}

interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
  domain: string;
  publishDate?: string;
  author?: string;
  credibilityScore: number;
  sourceType: 'academic' | 'news' | 'industry' | 'government' | 'corporate';
}

interface ResearchResponse {
  id: string;
  query: string;
  content: string;
  sources: ResearchSource[];
  insights: string[];
  keywords: string[];
  researchType: string;
  industry?: string;
  creditsUsed: number;
  modelUsed: string;
  createdAt: string;
  effectiveness: number;
  contextQuality: string;
  outputFormat: string;
  metadata: {
    processingTime: number;
    sourceCount: number;
    confidenceScore: number;
    strategicValue: number;
  };
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

    if (!perplexityApiKey) {
      return new Response(JSON.stringify({ 
        error: 'Research service not configured',
        message: 'Please contact support to configure the research engine.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const request: EliteResearchRequest = await req.json();
    const sessionId = crypto.randomUUID();
    const startTime = Date.now();

    console.log('Elite Research Request:', {
      userId: user.id,
      query: request.query,
      researchType: request.researchType,
      contextLevel: request.contextLevel,
      sessionId
    });

    // Build elite research prompt
    const prompt = buildEliteResearchPrompt(request);
    
    // Configure model settings based on research type
    const modelConfig = getModelConfiguration(request);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...modelConfig,
        messages: [
          {
            role: 'system',
            content: buildSystemPrompt(request)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        return_images: false,
        return_related_questions: false,
        search_domain_filter: request.sourceFilters || ['reuters.com', 'bloomberg.com', 'wsj.com', 'ft.com', 'harvard.edu', 'mit.edu'],
        search_recency_filter: request.timeFilter || 'month',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    const usage = data.usage || {};
    
    if (!content) {
      throw new Error('No content returned from research API');
    }

    const processingTime = Date.now() - startTime;

    // Extract enhanced data
    const sources = extractEliteSources(content);
    const insights = extractStrategicInsights(content, request.outputFormat);
    const keywords = extractKeywords(request.query, content);
    
    // Calculate effectiveness and strategic value
    const effectiveness = calculateEffectiveness(sources, insights, request);
    const strategicValue = calculateStrategicValue(content, sources, request);
    const confidenceScore = calculateConfidenceScore(sources, content);

    // Calculate credits used
    const creditsUsed = calculateCreditsUsed(request, usage);

    const researchResponse: ResearchResponse = {
      id: sessionId,
      query: request.query,
      content,
      sources,
      insights,
      keywords,
      researchType: request.researchType,
      industry: request.industry,
      creditsUsed,
      modelUsed: request.model || 'llama-3.1-sonar-large-128k-online',
      createdAt: new Date().toISOString(),
      effectiveness,
      contextQuality: request.contextLevel || 'elite',
      outputFormat: request.outputFormat || 'detailed-analysis',
      metadata: {
        processingTime,
        sourceCount: sources.length,
        confidenceScore,
        strategicValue
      }
    };

    // Save research session
    try {
      await supabase
        .from('research_sessions')
        .insert({
          id: sessionId,
          user_id: user.id,
          query: request.query,
          research_type: request.researchType,
          industry: request.industry,
          content,
          sources: sources,
          insights: insights,
          keywords: keywords,
          credits_used: creditsUsed,
          model_used: request.model || 'llama-3.1-sonar-large-128k-online',
          effectiveness,
          context_quality: request.contextLevel || 'elite',
          output_format: request.outputFormat || 'detailed-analysis',
          metadata: researchResponse.metadata
        });
    } catch (saveError) {
      console.error('Failed to save research session:', saveError);
    }

    // Log usage for cost tracking
    try {
      await supabase.from('ai_usage_logs').insert({
        user_id: user.id,
        function_name: 'elite-research-engine',
        model_name: request.model || 'llama-3.1-sonar-large-128k-online',
        input_tokens: usage.prompt_tokens || 0,
        output_tokens: usage.completion_tokens || 0,
        total_cost: calculateCost(request.model || 'llama-3.1-sonar-large-128k-online', usage),
        request_duration: processingTime,
        status: 'success',
        metadata: {
          research_type: request.researchType,
          context_level: request.contextLevel,
          effectiveness,
          strategic_value: strategicValue,
          sources_found: sources.length
        }
      });
    } catch (logError) {
      console.error('Failed to log usage:', logError);
    }

    console.log('Elite Research Success:', {
      userId: user.id,
      sessionId,
      sourcesFound: sources.length,
      effectiveness,
      strategicValue,
      processingTime: `${processingTime}ms`
    });

    return new Response(JSON.stringify(researchResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in elite-research-engine function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Research engine error',
      message: 'An error occurred while conducting research. Please try again.',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildSystemPrompt(request: EliteResearchRequest): string {
  const basePrompt = `You are an elite Fortune 500-grade research analyst with expertise in strategic intelligence and competitive analysis. Your task is to conduct ${request.researchType} research that meets C-suite standards.`;

  const contextPrompts = {
    'quick-scan': 'Provide rapid but comprehensive insights focusing on key data points and immediate strategic implications.',
    'comprehensive': 'Conduct thorough analysis with multiple perspectives, detailed source validation, and strategic recommendations.',
    'industry-deep-dive': 'Focus on industry-specific trends, competitive dynamics, regulatory environment, and market opportunities.',
    'competitive-analysis': 'Analyze competitive positioning, market share dynamics, strategic moves, and competitive advantages.'
  };

  const outputFormatPrompts = {
    'executive-brief': 'Structure as executive briefing: Executive Summary, Key Findings, Strategic Implications, Recommendations.',
    'detailed-analysis': 'Provide comprehensive analysis with detailed sourcing, methodology, and multi-faceted insights.',
    'data-points': 'Focus on quantified metrics, statistics, financial data, and measurable trends.',
    'strategic-insights': 'Emphasize strategic implications, market opportunities, and actionable intelligence.'
  };

  return `${basePrompt}

${contextPrompts[request.researchType]}

Output Requirements:
${outputFormatPrompts[request.outputFormat || 'detailed-analysis']}

Quality Standards:
- Use only high-credibility sources (academic, established news, industry reports)
- Provide specific, quantified insights where possible
- Include source attribution and publication dates
- Focus on actionable intelligence
- Maintain objective, analytical tone
${request.industry ? `- Emphasize ${request.industry} industry context` : ''}

Always structure your response with clear sections and provide direct links to sources.`;
}

function buildEliteResearchPrompt(request: EliteResearchRequest): string {
  const industryContext = request.industry ? `Industry Context: ${request.industry}` : '';
  
  return `Research Query: ${request.query}

${industryContext}

Research Scope: ${request.researchType}
Output Format: ${request.outputFormat || 'detailed-analysis'}
Context Level: ${request.contextLevel || 'elite'}

Please conduct comprehensive research focusing on:
1. Current market state and recent developments
2. Key data points, statistics, and trends
3. Expert opinions and industry insights
4. Strategic implications and opportunities
5. Future outlook and predictions

Requirements:
- Find 8-15 high-quality sources with working links
- Include publication dates and author credibility
- Provide specific data points and metrics
- Focus on recent developments (last ${request.timeFilter || 'month'})
- Maintain Fortune 500 analytical standards`;
}

function getModelConfiguration(request: EliteResearchRequest) {
  const baseConfig = {
    model: request.model || 'llama-3.1-sonar-large-128k-online',
    temperature: 0.1,
    top_p: 0.9,
    frequency_penalty: 0.1,
    presence_penalty: 0.1
  };

  const typeConfigs = {
    'quick-scan': { ...baseConfig, max_tokens: 2000 },
    'comprehensive': { ...baseConfig, max_tokens: 4000 },
    'industry-deep-dive': { ...baseConfig, max_tokens: 5000 },
    'competitive-analysis': { ...baseConfig, max_tokens: 4500 }
  };

  return typeConfigs[request.researchType] || typeConfigs.comprehensive;
}

function extractEliteSources(content: string): ResearchSource[] {
  const sources: ResearchSource[] = [];
  const urlRegex = /https?:\/\/[^\s)]+/g;
  const urls = [...new Set(content.match(urlRegex) || [])];
  
  for (let i = 0; i < Math.min(urls.length, 15); i++) {
    const url = urls[i];
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      
      const urlIndex = content.indexOf(url);
      const contextStart = Math.max(0, urlIndex - 200);
      const contextEnd = Math.min(content.length, urlIndex + 200);
      const context = content.substring(contextStart, contextEnd);
      
      const sentences = context.split(/[.!?]+/);
      const meaningfulSentence = sentences.find(s => s.length > 30 && s.length < 200);
      
      const credibilityScore = calculateSourceCredibility(domain);
      const sourceType = determineSourceType(domain);
      
      sources.push({
        title: extractTitleFromContext(context) || `Research Source ${i + 1}`,
        url: url,
        snippet: meaningfulSentence?.trim() || `Quality source from ${domain}`,
        relevance: 1 - (i * 0.05),
        domain: domain,
        publishDate: extractDateFromContext(context),
        author: extractAuthorFromContext(context),
        credibilityScore,
        sourceType
      });
    } catch (error) {
      console.warn('Failed to parse URL:', url);
    }
  }
  
  return sources.sort((a, b) => b.credibilityScore - a.credibilityScore);
}

function extractStrategicInsights(content: string, outputFormat?: string): string[] {
  const insights: string[] = [];
  const lines = content.split('\n');
  
  const insightIndicators = [
    /key findings?:/i,
    /strategic implications?:/i,
    /opportunities?:/i,
    /trends?:/i,
    /insights?:/i,
    /conclusions?:/i,
    /recommendations?:/i
  ];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for lines that contain strategic insights
    if (trimmed.length > 50 && trimmed.length < 300) {
      if (insightIndicators.some(pattern => pattern.test(trimmed)) ||
          trimmed.includes('%') || 
          trimmed.includes('$') || 
          trimmed.includes('growth') ||
          trimmed.includes('market') ||
          /\d+/.test(trimmed)) {
        
        const cleaned = trimmed.replace(/^[•\-\*\d\.]+\s*/, '');
        if (cleaned.length > 30) {
          insights.push(cleaned);
        }
      }
    }
  }
  
  return insights.slice(0, 8);
}

function extractKeywords(query: string, content: string): string[] {
  const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 3);
  const contentWords = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const frequency: Record<string, number> = {};
  
  const stopWords = new Set(['that', 'this', 'with', 'from', 'they', 'have', 'will', 'been', 'said', 'each', 'which', 'their', 'time', 'more', 'very', 'what', 'know', 'just', 'first', 'into', 'over', 'think', 'also', 'your', 'work', 'life', 'only', 'new', 'years', 'way', 'may', 'say']);
  
  for (const word of contentWords) {
    if (!queryWords.includes(word) && !stopWords.has(word) && word.length > 3) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  }
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

function calculateEffectiveness(sources: ResearchSource[], insights: string[], request: EliteResearchRequest): number {
  let score = 50; // Base score
  
  // Source quality bonus
  const avgCredibility = sources.reduce((sum, s) => sum + s.credibilityScore, 0) / sources.length;
  score += avgCredibility * 20;
  
  // Source quantity bonus
  score += Math.min(sources.length * 2, 20);
  
  // Insights quality bonus
  score += Math.min(insights.length * 3, 15);
  
  // Research type complexity bonus
  const complexityBonus = {
    'quick-scan': 0,
    'comprehensive': 5,
    'industry-deep-dive': 8,
    'competitive-analysis': 10
  };
  score += complexityBonus[request.researchType] || 0;
  
  return Math.min(Math.round(score), 100);
}

function calculateStrategicValue(content: string, sources: ResearchSource[], request: EliteResearchRequest): number {
  let value = 60; // Base value
  
  // Content depth
  value += Math.min(content.length / 100, 15);
  
  // Source diversity
  const uniqueDomains = new Set(sources.map(s => s.domain)).size;
  value += uniqueDomains * 2;
  
  // Industry relevance
  if (request.industry && content.toLowerCase().includes(request.industry.toLowerCase())) {
    value += 10;
  }
  
  return Math.min(Math.round(value), 100);
}

function calculateConfidenceScore(sources: ResearchSource[], content: string): number {
  const avgCredibility = sources.reduce((sum, s) => sum + s.credibilityScore, 0) / sources.length;
  const contentQuality = Math.min(content.length / 50, 100);
  const sourceCount = Math.min(sources.length * 5, 50);
  
  return Math.round((avgCredibility * 40 + contentQuality * 30 + sourceCount * 30) / 100);
}

function calculateCreditsUsed(request: EliteResearchRequest, usage: any): number {
  const baseCredits = {
    'quick-scan': 2,
    'comprehensive': 5,
    'industry-deep-dive': 8,
    'competitive-analysis': 10
  };
  
  const modelMultiplier = request.model === 'llama-3.1-sonar-large-128k-online' ? 1.5 : 1;
  const contextMultiplier = request.contextLevel === 'elite' ? 1.3 : 1;
  
  return Math.ceil(baseCredits[request.researchType] * modelMultiplier * contextMultiplier);
}

function calculateCost(model: string, usage: any): number {
  const pricing = {
    'llama-3.1-sonar-large-128k-online': { input: 0.000005, output: 0.000015 },
    'llama-3.1-sonar-small-128k-online': { input: 0.000001, output: 0.000003 }
  };
  
  const rates = pricing[model] || pricing['llama-3.1-sonar-large-128k-online'];
  return (usage.prompt_tokens || 0) * rates.input + (usage.completion_tokens || 0) * rates.output;
}

function calculateSourceCredibility(domain: string): number {
  const highCredibility = ['reuters.com', 'bloomberg.com', 'wsj.com', 'ft.com', 'harvard.edu', 'mit.edu', 'nature.com'];
  const mediumCredibility = ['techcrunch.com', 'forbes.com', 'businessinsider.com', 'economist.com'];
  
  if (highCredibility.includes(domain)) return 95;
  if (mediumCredibility.includes(domain)) return 80;
  if (domain.includes('.edu')) return 90;
  if (domain.includes('.gov')) return 95;
  
  return 70;
}

function determineSourceType(domain: string): 'academic' | 'news' | 'industry' | 'government' | 'corporate' {
  if (domain.includes('.edu')) return 'academic';
  if (domain.includes('.gov')) return 'government';
  if (['reuters.com', 'bloomberg.com', 'wsj.com', 'ft.com'].includes(domain)) return 'news';
  if (['techcrunch.com', 'forbes.com', 'businessinsider.com'].includes(domain)) return 'industry';
  
  return 'corporate';
}

function extractTitleFromContext(context: string): string | undefined {
  const titlePatterns = [
    /title:\s*([^\.!\?]+)/i,
    /headline:\s*([^\.!\?]+)/i,
    /"([^"]{20,80})"/,
    /^([A-Z][^\.!\?]{20,80})/
  ];
  
  for (const pattern of titlePatterns) {
    const match = context.match(pattern);
    if (match) return match[1].trim();
  }
  
  return undefined;
}

function extractDateFromContext(context: string): string | undefined {
  const dateMatch = context.match(/(\d{4}[-\/]\d{1,2}[-\/]\d{1,2}|\w+ \d{1,2}, \d{4})/);
  return dateMatch ? dateMatch[1] : undefined;
}

function extractAuthorFromContext(context: string): string | undefined {
  const authorMatch = context.match(/(?:by|author|written by)\s+([A-Z][a-z]+ [A-Z][a-z]+)/i);
  return authorMatch ? authorMatch[1] : undefined;
}
