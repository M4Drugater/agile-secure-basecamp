
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

    // Perplexity search for real-time web data and financial information
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
            content: `You are an elite competitive intelligence analyst with access to real-time web data. Provide comprehensive analysis including:
            
            FOR ALL SEARCH TYPES:
            1. Executive Summary (3-4 sentences)
            2. Key Findings (5-7 bullet points with specific data)
            3. Strategic Implications (business impact analysis)
            4. Competitive Landscape Assessment
            5. Market Context and Trends
            6. Risk Factors and Opportunities
            7. Recommended Actions
            8. Data Sources and Confidence Level
            
            FOR FINANCIAL SEARCHES, ALSO INCLUDE:
            - Stock price movements and trading volume
            - Financial metrics and ratios
            - Earnings reports and revenue data
            - Market capitalization changes
            - Analyst ratings and price targets
            - Peer comparison data
            - Financial news and events
            
            Use specific numbers, dates, and sources wherever possible. Format as a comprehensive intelligence report.`
          },
          {
            role: 'user',
            content: enhancedQuery
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 3000,
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

    // OpenAI analysis for strategic insights if available
    let strategicAnalysis = '';
    if (openAIApiKey) {
      try {
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

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          strategicAnalysis = analysisData.choices[0]?.message?.content;
        }
      } catch (error) {
        console.log('OpenAI analysis failed, using Perplexity results only:', error);
        strategicAnalysis = 'Strategic analysis powered by Perplexity intelligence.';
      }
    } else {
      strategicAnalysis = 'Strategic analysis powered by Perplexity intelligence.';
    }

    // Extract insights and metrics from the comprehensive search results
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
    'news': `latest news, announcements, press releases about ${companyName} and competitors in ${industry}`,
    'financial': `financial performance, earnings, revenue, stock price, market cap, financial ratios, analyst ratings for ${companyName} and ${industry} sector companies`,
    'competitive': `competitive moves, partnerships, product launches, market share changes by ${companyName} competitors in ${industry}`,
    'market': `market trends, industry analysis, market size, growth rates, disruptions in ${industry} sector`,
    'regulatory': `regulatory changes, compliance, legal issues, policy changes affecting ${companyName} and ${industry}`
  };

  return `${query} ${searchTypeMap[searchType]} in the ${timeframeMap[timeframe]}. Provide comprehensive analysis with specific data, numbers, and strategic implications for ${companyName} operating in ${industry} industry.`;
}

function getSearchDomains(searchType: string): string[] {
  const domainMap = {
    'news': ['reuters.com', 'bloomberg.com', 'wsj.com', 'ft.com', 'cnbc.com', 'marketwatch.com'],
    'financial': ['sec.gov', 'bloomberg.com', 'marketwatch.com', 'yahoo.com', 'morningstar.com', 'finviz.com'],
    'competitive': ['techcrunch.com', 'venturebeat.com', 'crunchbase.com', 'businesswire.com'],
    'market': ['gartner.com', 'forrester.com', 'idc.com', 'mckinsey.com', 'bcg.com'],
    'regulatory': ['sec.gov', 'fda.gov', 'ftc.gov', 'europa.eu']
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
  const insights = [];
  const combinedText = webResults + ' ' + analysis;
  
  // Financial insights
  if (combinedText.includes('earnings') || combinedText.includes('revenue') || combinedText.includes('profit')) {
    insights.push({
      type: 'financial_performance',
      title: 'Financial Performance Update',
      description: 'Recent financial data and performance metrics identified',
      impact: 'high',
      confidence: 0.85
    });
  }
  
  // Product/service launches
  if (combinedText.includes('launch') || combinedText.includes('announce') || combinedText.includes('release')) {
    insights.push({
      type: 'product_launch',
      title: 'New Product/Service Launch Detected',
      description: 'Recent product or service announcements identified',
      impact: 'medium',
      confidence: 0.8
    });
  }
  
  // Strategic moves
  if (combinedText.includes('partnership') || combinedText.includes('acquisition') || combinedText.includes('merger')) {
    insights.push({
      type: 'strategic_move',
      title: 'Strategic Partnership/M&A Activity',
      description: 'M&A or partnership activity in the competitive landscape',
      impact: 'high',
      confidence: 0.9
    });
  }
  
  // Market trends
  if (combinedText.includes('growth') || combinedText.includes('trend') || combinedText.includes('market share')) {
    insights.push({
      type: 'market_trend',
      title: 'Market Trend Analysis',
      description: 'Significant market trends and growth patterns identified',
      impact: 'medium',
      confidence: 0.75
    });
  }
  
  // Regulatory changes
  if (combinedText.includes('regulation') || combinedText.includes('compliance') || combinedText.includes('policy')) {
    insights.push({
      type: 'regulatory',
      title: 'Regulatory Environment Changes',
      description: 'Regulatory changes that may impact business operations',
      impact: 'high',
      confidence: 0.8
    });
  }
  
  return insights;
}

function extractMetrics(webResults: string): any {
  return {
    marketMovement: extractMarketData(webResults),
    competitorMentions: extractCompetitorMentions(webResults),
    sentimentScore: calculateSentiment(webResults),
    newsVolume: extractNewsVolume(webResults),
    financialMetrics: extractFinancialMetrics(webResults)
  };
}

function extractThreats(webResults: string): any[] {
  const threats = [];
  const lowerResults = webResults.toLowerCase();
  
  if (lowerResults.includes('competition') || lowerResults.includes('rival') || lowerResults.includes('compete')) {
    threats.push({
      type: 'competitive',
      severity: 'medium',
      description: 'Increased competitive pressure detected in market analysis',
      probability: 0.7
    });
  }
  
  if (lowerResults.includes('regulation') || lowerResults.includes('compliance') || lowerResults.includes('ban')) {
    threats.push({
      type: 'regulatory',
      severity: 'high',
      description: 'Regulatory changes may create compliance challenges',
      probability: 0.6
    });
  }
  
  if (lowerResults.includes('decline') || lowerResults.includes('decrease') || lowerResults.includes('fall')) {
    threats.push({
      type: 'market_decline',
      severity: 'medium',
      description: 'Market decline indicators identified in analysis',
      probability: 0.5
    });
  }
  
  return threats;
}

function extractOpportunities(webResults: string): any[] {
  const opportunities = [];
  const lowerResults = webResults.toLowerCase();
  
  if (lowerResults.includes('growth') || lowerResults.includes('expansion') || lowerResults.includes('increase')) {
    opportunities.push({
      type: 'market_expansion',
      potential: 'high',
      description: 'Market growth and expansion opportunities identified',
      feasibility: 0.8
    });
  }
  
  if (lowerResults.includes('partnership') || lowerResults.includes('collaboration') || lowerResults.includes('alliance')) {
    opportunities.push({
      type: 'strategic_partnership',
      potential: 'medium',
      description: 'Strategic partnership opportunities available in market',
      feasibility: 0.7
    });
  }
  
  if (lowerResults.includes('innovation') || lowerResults.includes('technology') || lowerResults.includes('digital')) {
    opportunities.push({
      type: 'innovation',
      potential: 'high',
      description: 'Technology and innovation opportunities in the market',
      feasibility: 0.75
    });
  }
  
  return opportunities;
}

function calculateConfidence(webResults: string): number {
  const qualityFactors = [
    webResults.includes('$'),
    webResults.includes('%'),
    webResults.includes('million') || webResults.includes('billion'),
    webResults.length > 1500,
    webResults.includes('source:') || webResults.includes('according to'),
    /\d{4}/.test(webResults) // Contains year
  ].filter(Boolean).length;
  
  return Math.min(0.6 + (qualityFactors * 0.08), 0.95);
}

function extractSources(webResults: string): string[] {
  const sources = [];
  const commonSources = [
    'reuters', 'bloomberg', 'wsj', 'financial times', 'cnbc', 
    'marketwatch', 'yahoo finance', 'sec.gov', 'techcrunch', 
    'crunchbase', 'gartner', 'forrester'
  ];
  
  commonSources.forEach(source => {
    if (webResults.toLowerCase().includes(source)) {
      sources.push(source);
    }
  });
  
  return sources.length > 0 ? sources : ['web_search'];
}

function extractMarketData(results: string): any {
  return {
    trend: results.includes('up') || results.includes('growth') || results.includes('increase') ? 'positive' : 'neutral',
    volatility: results.includes('volatile') || results.includes('fluctuat') ? 'high' : 'low'
  };
}

function extractCompetitorMentions(results: string): number {
  const commonTerms = ['competitor', 'rival', 'versus', 'compared to', 'market leader'];
  return commonTerms.filter(term => results.toLowerCase().includes(term)).length;
}

function calculateSentiment(results: string): number {
  const positiveWords = ['growth', 'success', 'launch', 'innovation', 'expansion', 'profit', 'gain'];
  const negativeWords = ['decline', 'loss', 'challenges', 'issues', 'problems', 'fall', 'decrease'];
  
  const positive = positiveWords.filter(word => results.toLowerCase().includes(word)).length;
  const negative = negativeWords.filter(word => results.toLowerCase().includes(word)).length;
  
  return (positive - negative) / Math.max(positive + negative, 1);
}

function extractNewsVolume(results: string): string {
  if (results.length > 3000) return 'high';
  if (results.length > 1500) return 'medium';
  return 'low';
}

function extractFinancialMetrics(results: string): any {
  const metrics = {};
  
  // Extract stock price mentions
  const stockPriceMatch = results.match(/\$[\d,]+\.?\d*/g);
  if (stockPriceMatch) {
    metrics.stockPrices = stockPriceMatch.slice(0, 3);
  }
  
  // Extract percentage changes
  const percentageMatch = results.match(/[\+\-]?\d+\.?\d*%/g);
  if (percentageMatch) {
    metrics.percentageChanges = percentageMatch.slice(0, 3);
  }
  
  return metrics;
}
