
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  companyName: string;
  industry: string;
  searchType: 'news' | 'financial' | 'competitive' | 'market' | 'regulatory';
  timeframe: 'hour' | 'day' | 'week' | 'month' | 'quarter';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, companyName, industry, searchType, timeframe }: SearchRequest = await req.json();

    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured');
    }

    // Enhanced search query based on type and context
    const enhancedQuery = buildEnhancedQuery(query, companyName, industry, searchType, timeframe);
    
    console.log('Real-time web search request:', {
      originalQuery: query,
      enhancedQuery,
      companyName,
      searchType,
      timeframe
    });

    // Perplexity search for real-time web data
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are an elite competitive intelligence analyst. Provide precise, actionable intelligence with:
            1. Executive Summary (2-3 sentences)
            2. Key Findings (3-5 bullet points)
            3. Strategic Implications (business impact)
            4. Competitive Threats/Opportunities
            5. Recommended Actions
            6. Data Sources and Confidence Level`
          },
          {
            role: 'user',
            content: enhancedQuery
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: true,
        search_domain_filter: getSearchDomains(searchType),
        search_recency_filter: getRecencyFilter(timeframe),
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!perplexityResponse.ok) {
      throw new Error(`Perplexity API error: ${perplexityResponse.statusText}`);
    }

    const perplexityData = await perplexityResponse.json();
    const webSearchResults = perplexityData.choices[0]?.message?.content;
    const relatedQuestions = perplexityData.related_questions || [];

    // OpenAI analysis for strategic insights
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a McKinsey-level strategic analyst. Analyze the web search results and provide:
            1. Strategic Analysis using Porter's Five Forces
            2. Competitive Positioning Assessment
            3. Market Opportunity Identification
            4. Risk Assessment Matrix
            5. Implementation Roadmap
            
            Focus on ${companyName} in the ${industry} industry.`
          },
          {
            role: 'user',
            content: `Web Search Results: ${webSearchResults}\n\nProvide strategic analysis for competitive intelligence.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`OpenAI API error: ${analysisResponse.statusText}`);
    }

    const analysisData = await analysisResponse.json();
    const strategicAnalysis = analysisData.choices[0]?.message?.content;

    // Extract insights and metrics
    const insights = extractInsights(webSearchResults, strategicAnalysis);
    const metrics = extractMetrics(webSearchResults);
    const threats = extractThreats(webSearchResults);
    const opportunities = extractOpportunities(webSearchResults);

    const response = {
      searchResults: {
        webData: webSearchResults,
        strategicAnalysis: strategicAnalysis,
        relatedQuestions: relatedQuestions
      },
      insights: insights,
      metrics: metrics,
      threats: threats,
      opportunities: opportunities,
      metadata: {
        searchType,
        timeframe,
        companyName,
        industry,
        timestamp: new Date().toISOString(),
        dataConfidence: calculateConfidence(webSearchResults),
        sources: extractSources(webSearchResults)
      }
    };

    console.log('Real-time search completed:', {
      insightsCount: insights.length,
      threatsCount: threats.length,
      opportunitiesCount: opportunities.length,
      confidence: response.metadata.dataConfidence
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in real-time web search:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildEnhancedQuery(query: string, companyName: string, industry: string, searchType: string, timeframe: string): string {
  const timeframeMap = {
    'hour': 'last hour',
    'day': 'last 24 hours',
    'week': 'last week',
    'month': 'last month',
    'quarter': 'last 3 months'
  };

  const searchTypeMap = {
    'news': `latest news and announcements about ${companyName} and competitors in ${industry}`,
    'financial': `financial performance, earnings, revenue, market cap updates for ${companyName} and ${industry} sector`,
    'competitive': `competitive moves, partnerships, product launches by ${companyName} competitors in ${industry}`,
    'market': `market trends, industry analysis, market share changes in ${industry} sector`,
    'regulatory': `regulatory changes, compliance, legal issues affecting ${companyName} and ${industry}`
  };

  return `${query} ${searchTypeMap[searchType]} in the ${timeframeMap[timeframe]}. Focus on strategic implications for ${companyName} operating in ${industry} industry.`;
}

function getSearchDomains(searchType: string): string[] {
  const domainMap = {
    'news': ['reuters.com', 'bloomberg.com', 'wsj.com', 'ft.com'],
    'financial': ['sec.gov', 'bloomberg.com', 'marketwatch.com', 'yahoo.com'],
    'competitive': ['techcrunch.com', 'venturebeat.com', 'crunchbase.com'],
    'market': ['gartner.com', 'forrester.com', 'idc.com'],
    'regulatory': ['sec.gov', 'fda.gov', 'ftc.gov']
  };
  
  return domainMap[searchType] || [];
}

function getRecencyFilter(timeframe: string): string {
  const recencyMap = {
    'hour': 'hour',
    'day': 'day',
    'week': 'week',
    'month': 'month',
    'quarter': 'month'
  };
  
  return recencyMap[timeframe] || 'week';
}

function extractInsights(webResults: string, analysis: string): any[] {
  // Extract key insights from the combined results
  const insights = [];
  
  if (webResults.includes('launch') || webResults.includes('announce')) {
    insights.push({
      type: 'product_launch',
      title: 'New Product/Service Launch Detected',
      description: 'Recent product or service announcements identified',
      impact: 'medium',
      confidence: 0.8
    });
  }
  
  if (webResults.includes('partnership') || webResults.includes('acquisition')) {
    insights.push({
      type: 'strategic_move',
      title: 'Strategic Partnership/Acquisition Activity',
      description: 'M&A or partnership activity in the competitive landscape',
      impact: 'high',
      confidence: 0.9
    });
  }
  
  if (webResults.includes('funding') || webResults.includes('investment')) {
    insights.push({
      type: 'funding',
      title: 'Investment/Funding Activity',
      description: 'New funding rounds or investment activity detected',
      impact: 'medium',
      confidence: 0.7
    });
  }
  
  return insights;
}

function extractMetrics(webResults: string): any {
  // Extract quantitative metrics
  return {
    marketMovement: extractMarketData(webResults),
    competitorCount: extractCompetitorMentions(webResults),
    sentimentScore: calculateSentiment(webResults),
    newsVolume: extractNewsVolume(webResults)
  };
}

function extractThreats(webResults: string): any[] {
  const threats = [];
  
  if (webResults.toLowerCase().includes('competition') || webResults.toLowerCase().includes('rival')) {
    threats.push({
      type: 'competitive',
      severity: 'medium',
      description: 'Increased competitive activity detected',
      probability: 0.7
    });
  }
  
  if (webResults.toLowerCase().includes('regulation') || webResults.toLowerCase().includes('compliance')) {
    threats.push({
      type: 'regulatory',
      severity: 'high',
      description: 'Regulatory changes may impact business',
      probability: 0.6
    });
  }
  
  return threats;
}

function extractOpportunities(webResults: string): any[] {
  const opportunities = [];
  
  if (webResults.toLowerCase().includes('market growth') || webResults.toLowerCase().includes('expansion')) {
    opportunities.push({
      type: 'market_expansion',
      potential: 'high',
      description: 'Market expansion opportunities identified',
      feasibility: 0.8
    });
  }
  
  if (webResults.toLowerCase().includes('partnership') || webResults.toLowerCase().includes('collaboration')) {
    opportunities.push({
      type: 'strategic_partnership',
      potential: 'medium',
      description: 'Strategic partnership opportunities available',
      feasibility: 0.7
    });
  }
  
  return opportunities;
}

function calculateConfidence(webResults: string): number {
  // Simple confidence calculation based on data richness
  const factorCount = [
    webResults.includes('$'),
    webResults.includes('%'),
    webResults.includes('million'),
    webResults.includes('billion'),
    webResults.length > 1000
  ].filter(Boolean).length;
  
  return Math.min(0.6 + (factorCount * 0.1), 0.95);
}

function extractSources(webResults: string): string[] {
  // Extract source domains mentioned in results
  const sources = [];
  const commonSources = ['reuters', 'bloomberg', 'wsj', 'techcrunch', 'sec.gov'];
  
  commonSources.forEach(source => {
    if (webResults.toLowerCase().includes(source)) {
      sources.push(source);
    }
  });
  
  return sources.length > 0 ? sources : ['web_search'];
}

function extractMarketData(results: string): any {
  return {
    trend: results.includes('up') || results.includes('growth') ? 'positive' : 'neutral',
    volatility: results.includes('volatile') ? 'high' : 'low'
  };
}

function extractCompetitorMentions(results: string): number {
  const commonCompetitors = ['Apple', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Tesla', 'Netflix'];
  return commonCompetitors.filter(comp => results.includes(comp)).length;
}

function calculateSentiment(results: string): number {
  const positiveWords = ['growth', 'success', 'launch', 'innovation', 'expansion'];
  const negativeWords = ['decline', 'loss', 'challenges', 'issues', 'problems'];
  
  const positive = positiveWords.filter(word => results.toLowerCase().includes(word)).length;
  const negative = negativeWords.filter(word => results.toLowerCase().includes(word)).length;
  
  return (positive - negative) / Math.max(positive + negative, 1);
}

function extractNewsVolume(results: string): string {
  if (results.length > 2000) return 'high';
  if (results.length > 1000) return 'medium';
  return 'low';
}
