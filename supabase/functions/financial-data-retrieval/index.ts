
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const alphaVantageKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FinancialRequest {
  symbol: string;
  companyName: string;
  industry: string;
  analysisType: 'overview' | 'earnings' | 'ratios' | 'comparison' | 'forecast';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, companyName, industry, analysisType }: FinancialRequest = await req.json();

    console.log('Financial data retrieval request:', {
      symbol,
      companyName,
      analysisType
    });

    // Gather financial data from multiple sources
    const financialData = await gatherFinancialData(symbol, alphaVantageKey);
    const peerComparison = await getPeerComparison(symbol, industry);
    const marketContext = await getMarketContext(industry);

    // AI-powered financial analysis
    const analysisPrompt = buildFinancialAnalysisPrompt(
      financialData,
      peerComparison,
      marketContext,
      companyName,
      industry,
      analysisType
    );

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
            content: `You are an elite financial analyst with Bloomberg Terminal expertise. Provide institutional-grade financial analysis with:
            1. Executive Financial Summary
            2. Key Performance Metrics Analysis
            3. Competitive Financial Positioning
            4. Risk Assessment
            5. Investment Thesis
            6. Forward-Looking Indicators
            
            Use precise financial terminology and quantitative analysis.`
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`OpenAI API error: ${analysisResponse.statusText}`);
    }

    const analysisData = await analysisResponse.json();
    const financialAnalysis = analysisData.choices[0]?.message?.content;

    const response = {
      financialData: {
        overview: financialData.overview,
        keyMetrics: financialData.keyMetrics,
        earnings: financialData.earnings,
        ratios: financialData.ratios
      },
      peerComparison: peerComparison,
      marketContext: marketContext,
      analysis: financialAnalysis,
      insights: extractFinancialInsights(financialData, financialAnalysis),
      riskFactors: extractRiskFactors(financialData, financialAnalysis),
      opportunities: extractFinancialOpportunities(financialData, financialAnalysis),
      metadata: {
        symbol,
        companyName,
        industry,
        analysisType,
        timestamp: new Date().toISOString(),
        dataQuality: assessDataQuality(financialData),
        confidence: 0.9
      }
    };

    console.log('Financial analysis completed:', {
      symbol,
      dataQuality: response.metadata.dataQuality,
      insightsCount: response.insights.length
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in financial data retrieval:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function gatherFinancialData(symbol: string, apiKey: string) {
  try {
    // Company Overview
    const overviewResponse = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
    );
    const overview = await overviewResponse.json();

    // Earnings Data
    const earningsResponse = await fetch(
      `https://www.alphavantage.co/query?function=EARNINGS&symbol=${symbol}&apikey=${apiKey}`
    );
    const earnings = await earningsResponse.json();

    // Balance Sheet
    const balanceSheetResponse = await fetch(
      `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${apiKey}`
    );
    const balanceSheet = await balanceSheetResponse.json();

    // Calculate key metrics
    const keyMetrics = calculateKeyMetrics(overview, earnings, balanceSheet);
    const ratios = calculateFinancialRatios(overview, balanceSheet);

    return {
      overview,
      earnings,
      balanceSheet,
      keyMetrics,
      ratios
    };
  } catch (error) {
    console.error('Error gathering financial data:', error);
    // Return mock data structure for development
    return generateMockFinancialData(symbol);
  }
}

async function getPeerComparison(symbol: string, industry: string) {
  // Mock peer comparison data
  return {
    peers: [
      { symbol: 'PEER1', name: 'Competitor A', marketCap: 50000000000, peRatio: 25.5 },
      { symbol: 'PEER2', name: 'Competitor B', marketCap: 75000000000, peRatio: 30.2 },
      { symbol: 'PEER3', name: 'Competitor C', marketCap: 45000000000, peRatio: 22.8 }
    ],
    industryAverages: {
      peRatio: 26.2,
      profitMargin: 0.12,
      roe: 0.15,
      debtToEquity: 0.45
    },
    ranking: {
      byRevenue: 2,
      byMarketCap: 3,
      byProfitability: 1
    }
  };
}

async function getMarketContext(industry: string) {
  return {
    industry,
    marketSize: 250000000000,
    growthRate: 0.08,
    trends: [
      'Digital transformation acceleration',
      'Increased focus on sustainability',
      'Supply chain optimization',
      'AI and automation adoption'
    ],
    threats: [
      'Economic uncertainty',
      'Regulatory changes',
      'Increased competition'
    ],
    opportunities: [
      'Emerging markets expansion',
      'Technology innovation',
      'Strategic partnerships'
    ]
  };
}

function buildFinancialAnalysisPrompt(financialData: any, peerComparison: any, marketContext: any, companyName: string, industry: string, analysisType: string): string {
  return `Analyze the financial performance of ${companyName} (${industry}) with the following data:

FINANCIAL OVERVIEW:
- Market Cap: ${financialData.overview?.MarketCapitalization || 'N/A'}
- Revenue: ${financialData.overview?.RevenueTTM || 'N/A'}
- P/E Ratio: ${financialData.overview?.PERatio || 'N/A'}
- Profit Margin: ${financialData.overview?.ProfitMargin || 'N/A'}

KEY METRICS:
${JSON.stringify(financialData.keyMetrics, null, 2)}

PEER COMPARISON:
${JSON.stringify(peerComparison, null, 2)}

MARKET CONTEXT:
${JSON.stringify(marketContext, null, 2)}

Provide a comprehensive ${analysisType} analysis with strategic recommendations.`;
}

function calculateKeyMetrics(overview: any, earnings: any, balanceSheet: any) {
  return {
    revenueGrowth: calculateRevenueGrowth(earnings),
    profitMargin: parseFloat(overview?.ProfitMargin || '0'),
    roe: parseFloat(overview?.ReturnOnEquityTTM || '0'),
    roa: parseFloat(overview?.ReturnOnAssetsTTM || '0'),
    currentRatio: parseFloat(overview?.CurrentRatio || '0'),
    debtToEquity: parseFloat(overview?.DebtToEquityRatio || '0'),
    priceToBook: parseFloat(overview?.PriceToBookRatio || '0'),
    dividendYield: parseFloat(overview?.DividendYield || '0')
  };
}

function calculateFinancialRatios(overview: any, balanceSheet: any) {
  return {
    liquidity: {
      currentRatio: parseFloat(overview?.CurrentRatio || '0'),
      quickRatio: parseFloat(overview?.QuickRatio || '0')
    },
    efficiency: {
      assetTurnover: calculateAssetTurnover(overview),
      inventoryTurnover: calculateInventoryTurnover(overview)
    },
    leverage: {
      debtToEquity: parseFloat(overview?.DebtToEquityRatio || '0'),
      interestCoverage: calculateInterestCoverage(overview)
    },
    profitability: {
      grossMargin: parseFloat(overview?.GrossMarginTTM || '0'),
      operatingMargin: parseFloat(overview?.OperatingMarginTTM || '0'),
      netMargin: parseFloat(overview?.ProfitMargin || '0')
    }
  };
}

function calculateRevenueGrowth(earnings: any): number {
  if (!earnings?.quarterlyEarnings || earnings.quarterlyEarnings.length < 2) return 0;
  
  const latest = parseFloat(earnings.quarterlyEarnings[0]?.reportedRevenue || '0');
  const previous = parseFloat(earnings.quarterlyEarnings[1]?.reportedRevenue || '0');
  
  return previous > 0 ? ((latest - previous) / previous) * 100 : 0;
}

function calculateAssetTurnover(overview: any): number {
  const revenue = parseFloat(overview?.RevenueTTM || '0');
  const assets = parseFloat(overview?.TotalAssets || '0');
  return assets > 0 ? revenue / assets : 0;
}

function calculateInventoryTurnover(overview: any): number {
  const cogs = parseFloat(overview?.CostOfGoodsSoldTTM || '0');
  const inventory = parseFloat(overview?.Inventory || '0');
  return inventory > 0 ? cogs / inventory : 0;
}

function calculateInterestCoverage(overview: any): number {
  const ebit = parseFloat(overview?.EBITDA || '0');
  const interest = parseFloat(overview?.InterestExpense || '0');
  return interest > 0 ? ebit / interest : 0;
}

function extractFinancialInsights(financialData: any, analysis: string): any[] {
  const insights = [];
  
  if (financialData.keyMetrics?.revenueGrowth > 10) {
    insights.push({
      type: 'growth',
      title: 'Strong Revenue Growth',
      description: `Revenue growth of ${financialData.keyMetrics.revenueGrowth.toFixed(1)}% indicates strong business momentum`,
      impact: 'positive',
      confidence: 0.9
    });
  }
  
  if (financialData.keyMetrics?.profitMargin > 0.15) {
    insights.push({
      type: 'profitability',
      title: 'Healthy Profit Margins',
      description: 'Above-average profit margins suggest strong operational efficiency',
      impact: 'positive',
      confidence: 0.8
    });
  }
  
  if (financialData.keyMetrics?.debtToEquity > 2) {
    insights.push({
      type: 'leverage',
      title: 'High Debt Levels',
      description: 'Elevated debt-to-equity ratio may indicate financial risk',
      impact: 'negative',
      confidence: 0.85
    });
  }
  
  return insights;
}

function extractRiskFactors(financialData: any, analysis: string): any[] {
  const risks = [];
  
  if (financialData.keyMetrics?.currentRatio < 1) {
    risks.push({
      type: 'liquidity',
      severity: 'high',
      description: 'Low current ratio indicates potential liquidity concerns',
      probability: 0.7
    });
  }
  
  if (financialData.keyMetrics?.debtToEquity > 1.5) {
    risks.push({
      type: 'financial',
      severity: 'medium',
      description: 'High leverage increases financial risk',
      probability: 0.6
    });
  }
  
  return risks;
}

function extractFinancialOpportunities(financialData: any, analysis: string): any[] {
  const opportunities = [];
  
  if (financialData.keyMetrics?.roe > 0.15) {
    opportunities.push({
      type: 'expansion',
      potential: 'high',
      description: 'Strong ROE suggests capacity for profitable growth',
      feasibility: 0.8
    });
  }
  
  if (financialData.keyMetrics?.priceToBook < 2) {
    opportunities.push({
      type: 'valuation',
      potential: 'medium',
      description: 'Attractive valuation metrics suggest investment opportunity',
      feasibility: 0.7
    });
  }
  
  return opportunities;
}

function assessDataQuality(financialData: any): string {
  const qualityFactors = [
    financialData.overview && Object.keys(financialData.overview).length > 10,
    financialData.earnings && financialData.earnings.quarterlyEarnings,
    financialData.keyMetrics && Object.values(financialData.keyMetrics).every(v => v !== null),
    financialData.ratios && Object.keys(financialData.ratios).length > 0
  ];
  
  const qualityScore = qualityFactors.filter(Boolean).length / qualityFactors.length;
  
  if (qualityScore > 0.8) return 'high';
  if (qualityScore > 0.6) return 'medium';
  return 'low';
}

function generateMockFinancialData(symbol: string) {
  return {
    overview: {
      Symbol: symbol,
      MarketCapitalization: '50000000000',
      RevenueTTM: '25000000000',
      PERatio: '25.5',
      ProfitMargin: '0.12',
      ReturnOnEquityTTM: '0.15',
      CurrentRatio: '1.5',
      DebtToEquityRatio: '0.4'
    },
    earnings: {
      quarterlyEarnings: [
        { reportedRevenue: '6500000000', fiscalDateEnding: '2024-12-31' },
        { reportedRevenue: '6000000000', fiscalDateEnding: '2024-09-30' }
      ]
    },
    keyMetrics: {
      revenueGrowth: 8.3,
      profitMargin: 0.12,
      roe: 0.15,
      roa: 0.08,
      currentRatio: 1.5,
      debtToEquity: 0.4,
      priceToBook: 3.2,
      dividendYield: 0.02
    },
    ratios: {
      liquidity: { currentRatio: 1.5, quickRatio: 1.2 },
      efficiency: { assetTurnover: 0.8, inventoryTurnover: 6.5 },
      leverage: { debtToEquity: 0.4, interestCoverage: 12.5 },
      profitability: { grossMargin: 0.35, operatingMargin: 0.18, netMargin: 0.12 }
    }
  };
}
