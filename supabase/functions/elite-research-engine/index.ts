
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const {
      query,
      researchType,
      industry,
      model = 'llama-3.1-sonar-large-128k-online',
      contextLevel = 'elite',
      outputFormat = 'detailed-analysis',
      sourceFilters = [],
      timeFilter = 'month',
      confidenceThreshold = 0.8,
      userId
    } = await req.json();

    console.log('Elite Research Request:', { query, researchType, model, contextLevel });

    const startTime = Date.now();

    // Enhanced prompt based on research type and context level
    const enhancedPrompt = buildElitePrompt(query, researchType, industry, contextLevel, outputFormat);

    // Make request to Perplexity with elite parameters
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an elite research analyst providing Fortune 500-quality insights with strategic depth and actionable intelligence.'
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        return_citations: true,
        search_domain_filter: sourceFilters.length > 0 ? sourceFilters : undefined,
        search_recency_filter: timeFilter
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const result = await response.json();
    const processingTime = Date.now() - startTime;

    // Process and enhance the response
    const processedResult = processEliteResearchResponse(
      result,
      researchType,
      outputFormat,
      processingTime
    );

    // Calculate credits based on research complexity
    const creditsUsed = calculateCreditsUsed(researchType, model, contextLevel);

    // Store the research session
    const { data: sessionData, error: insertError } = await supabase
      .from('research_sessions')
      .insert({
        user_id: userId,
        query,
        research_type: researchType,
        industry,
        content: processedResult.content,
        sources: processedResult.sources,
        insights: processedResult.insights,
        keywords: processedResult.keywords,
        credits_used: creditsUsed,
        model_used: model,
        effectiveness: processedResult.effectiveness,
        context_quality: contextLevel,
        output_format: outputFormat,
        metadata: {
          processingTime,
          sourceCount: processedResult.sources.length,
          confidenceScore: processedResult.confidenceScore,
          strategicValue: processedResult.strategicValue
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing research session:', insertError);
      throw insertError;
    }

    return new Response(JSON.stringify({
      id: sessionData.id,
      query,
      content: processedResult.content,
      sources: processedResult.sources,
      insights: processedResult.insights,
      keywords: processedResult.keywords,
      researchType,
      industry,
      creditsUsed,
      modelUsed: model,
      createdAt: sessionData.created_at,
      effectiveness: processedResult.effectiveness,
      contextQuality: contextLevel,
      outputFormat,
      metadata: {
        processingTime,
        sourceCount: processedResult.sources.length,
        confidenceScore: processedResult.confidenceScore,
        strategicValue: processedResult.strategicValue
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in elite-research-engine function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Research engine error',
      message: error.message || 'Failed to conduct research.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildElitePrompt(query: string, researchType: string, industry?: string, contextLevel?: string, outputFormat?: string): string {
  const basePrompt = `Conduct ${researchType} research on: "${query}"`;
  
  let enhancedPrompt = basePrompt;
  
  if (industry) {
    enhancedPrompt += ` in the ${industry} industry`;
  }
  
  enhancedPrompt += '\n\nProvide:';
  
  switch (researchType) {
    case 'quick-scan':
      enhancedPrompt += '\n- Executive summary with key findings\n- 3-5 critical insights\n- Immediate action items';
      break;
    case 'comprehensive':
      enhancedPrompt += '\n- In-depth analysis with multiple perspectives\n- Strategic implications\n- Market trends and patterns\n- Competitive landscape overview\n- Risk and opportunity assessment';
      break;
    case 'industry-deep-dive':
      enhancedPrompt += '\n- Comprehensive industry analysis\n- Market dynamics and trends\n- Key players and competitive positioning\n- Regulatory environment\n- Future outlook and predictions\n- Investment implications';
      break;
    case 'competitive-analysis':
      enhancedPrompt += '\n- Detailed competitor profiles\n- Market positioning analysis\n- Competitive advantages and weaknesses\n- Strategic moves and initiatives\n- Market share dynamics\n- Competitive threats and opportunities';
      break;
  }
  
  if (contextLevel === 'elite') {
    enhancedPrompt += '\n\nProvide Fortune 500-quality strategic insights with:';
    enhancedPrompt += '\n- Executive-level strategic recommendations';
    enhancedPrompt += '\n- Quantifiable metrics where available';
    enhancedPrompt += '\n- Risk mitigation strategies';
    enhancedPrompt += '\n- Implementation roadmap suggestions';
  }
  
  return enhancedPrompt;
}

function processEliteResearchResponse(result: any, researchType: string, outputFormat: string, processingTime: number) {
  const content = result.choices[0]?.message?.content || '';
  const citations = result.citations || [];
  
  // Extract insights from content
  const insights = extractInsights(content, researchType);
  
  // Extract keywords
  const keywords = extractKeywords(content);
  
  // Process sources from citations
  const sources = citations.map((citation: any, index: number) => ({
    title: citation.title || `Source ${index + 1}`,
    url: citation.url || '',
    snippet: citation.snippet || '',
    relevance: calculateRelevance(citation, content),
    domain: extractDomain(citation.url || ''),
    credibilityScore: calculateCredibilityScore(citation.url || ''),
    sourceType: categorizeSource(citation.url || '')
  }));
  
  // Calculate effectiveness score
  const effectiveness = calculateEffectiveness(content, sources, insights, processingTime);
  
  return {
    content,
    sources,
    insights,
    keywords,
    effectiveness,
    confidenceScore: calculateConfidenceScore(sources, content),
    strategicValue: calculateStrategicValue(insights, researchType)
  };
}

function extractInsights(content: string, researchType: string): string[] {
  // Extract key insights based on content patterns
  const insights: string[] = [];
  
  // Look for bullet points, numbered lists, or key findings
  const patterns = [
    /(?:Key insights?|Main findings?|Critical points?)[:\s]*(.*?)(?:\n\n|\n(?=[A-Z])|\n$)/gis,
    /(?:Strategic implications?|Important considerations?)[:\s]*(.*?)(?:\n\n|\n(?=[A-Z])|\n$)/gis,
    /(?:Recommendations?|Action items?)[:\s]*(.*?)(?:\n\n|\n(?=[A-Z])|\n$)/gis
  ];
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const cleanMatch = match.replace(/(?:Key insights?|Main findings?|Critical points?|Strategic implications?|Important considerations?|Recommendations?|Action items?)[:\s]*/i, '').trim();
        if (cleanMatch.length > 20) {
          insights.push(cleanMatch);
        }
      });
    }
  });
  
  return insights.slice(0, 5); // Limit to top 5 insights
}

function extractKeywords(content: string): string[] {
  // Extract important keywords and phrases
  const keywords = new Set<string>();
  
  // Common business and research terms
  const importantTerms = content.match(/\b(?:market|strategy|competitive|growth|trend|innovation|technology|digital|transformation|revenue|profit|customer|industry|sector|analysis|forecast|opportunity|risk|challenge|solution)\w*\b/gi);
  
  if (importantTerms) {
    importantTerms.forEach(term => keywords.add(term.toLowerCase()));
  }
  
  return Array.from(keywords).slice(0, 10);
}

function calculateRelevance(citation: any, content: string): number {
  // Calculate relevance based on citation usage in content
  if (!citation.url) return 0.5;
  
  const domain = extractDomain(citation.url);
  const mentions = (content.match(new RegExp(domain, 'gi')) || []).length;
  
  return Math.min(0.3 + (mentions * 0.2), 1.0);
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

function calculateCredibilityScore(url: string): number {
  const domain = extractDomain(url);
  
  // High credibility domains
  const highCredibility = ['bloomberg.com', 'reuters.com', 'wsj.com', 'ft.com', 'harvard.edu', 'mit.edu', 'mckinsey.com'];
  const mediumCredibility = ['forbes.com', 'businessinsider.com', 'techcrunch.com', 'wired.com'];
  
  if (highCredibility.some(d => domain.includes(d))) return 0.9;
  if (mediumCredibility.some(d => domain.includes(d))) return 0.7;
  if (domain.includes('.edu') || domain.includes('.gov')) return 0.8;
  
  return 0.6;
}

function categorizeSource(url: string): 'academic' | 'news' | 'industry' | 'government' | 'corporate' {
  const domain = extractDomain(url);
  
  if (domain.includes('.edu')) return 'academic';
  if (domain.includes('.gov')) return 'government';
  if (['bloomberg.com', 'reuters.com', 'wsj.com', 'ft.com'].some(d => domain.includes(d))) return 'news';
  if (['mckinsey.com', 'bcg.com', 'bain.com'].some(d => domain.includes(d))) return 'industry';
  
  return 'corporate';
}

function calculateEffectiveness(content: string, sources: any[], insights: string[], processingTime: number): number {
  let score = 50; // Base score
  
  // Content quality (40 points)
  if (content.length > 1000) score += 10;
  if (content.length > 2000) score += 10;
  if (insights.length >= 3) score += 10;
  if (insights.length >= 5) score += 10;
  
  // Source quality (30 points)
  const avgCredibility = sources.reduce((sum, s) => sum + s.credibilityScore, 0) / sources.length;
  score += Math.round(avgCredibility * 30);
  
  // Processing efficiency (20 points)
  if (processingTime < 30000) score += 20;
  else if (processingTime < 60000) score += 10;
  
  return Math.min(score, 100);
}

function calculateConfidenceScore(sources: any[], content: string): number {
  const sourceQuality = sources.reduce((sum, s) => sum + s.credibilityScore, 0) / sources.length;
  const contentDepth = Math.min(content.length / 2000, 1);
  
  return Math.round((sourceQuality * 0.6 + contentDepth * 0.4) * 100);
}

function calculateStrategicValue(insights: string[], researchType: string): number {
  let value = 60; // Base strategic value
  
  // Insight quality
  value += insights.length * 5;
  
  // Research type complexity
  const typeMultipliers = {
    'quick-scan': 1.0,
    'comprehensive': 1.2,
    'industry-deep-dive': 1.3,
    'competitive-analysis': 1.4
  };
  
  value *= typeMultipliers[researchType as keyof typeof typeMultipliers] || 1.0;
  
  return Math.min(Math.round(value), 100);
}

function calculateCreditsUsed(researchType: string, model: string, contextLevel: string): number {
  const baseCredits = {
    'quick-scan': 2,
    'comprehensive': 5,
    'industry-deep-dive': 8,
    'competitive-analysis': 10
  };
  
  const modelMultiplier = model === 'llama-3.1-sonar-large-128k-online' ? 1.5 : 1;
  const contextMultiplier = contextLevel === 'elite' ? 1.3 : 1;
  
  return Math.ceil(baseCredits[researchType as keyof typeof baseCredits] * modelMultiplier * contextMultiplier);
}
