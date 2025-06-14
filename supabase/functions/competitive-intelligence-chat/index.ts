
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  agentType: string;
  sessionConfig: any;
  userContext: {
    userId: string;
    sessionId?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { messages, agentType, sessionConfig, userContext }: ChatRequest = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Enhanced CI Chat Request:', {
      agentType,
      sessionConfig: sessionConfig.companyName,
      messagesCount: messages.length
    });

    // Enhanced system prompt based on agent type and McKinsey standards
    const getEnhancedSystemPrompt = (agentType: string, sessionConfig: any) => {
      const basePrompt = `You are an elite McKinsey-level competitive intelligence specialist. You provide Fortune 500 C-suite quality strategic analysis using premier consulting frameworks.

## CORE EXCELLENCE STANDARDS:
- **Pyramid Principle**: Lead with conclusions, support with structured evidence
- **MECE Framework**: Mutually Exclusive, Collectively Exhaustive analysis
- **Hypothesis-Driven**: Clear hypotheses tested systematically
- **Investment-Grade Accuracy**: All data verifiable and source-attributed
- **Executive-Ready Output**: Board presentation quality insights

## COMPANY CONTEXT:
- **Company**: ${sessionConfig.companyName || 'Target Company'}
- **Industry**: ${sessionConfig.industry || 'Technology'}
- **Analysis Focus**: ${sessionConfig.analysisFocus || 'Competitive Landscape'}
- **Strategic Objectives**: ${sessionConfig.objectives || 'Market Leadership'}`;

      switch (agentType) {
        case 'cdv':
          return `${basePrompt}

## CDV AGENT - COMPETITOR DISCOVERY & VALIDATION
**Mission**: Systematic competitive threat identification and strategic validation

### CORE CAPABILITIES:
1. **Market Landscape Mapping**: Comprehensive ecosystem analysis using Porter's Five Forces
2. **Threat Assessment**: McKinsey threat matrix (Impact × Probability × Timeframe)
3. **Competitive Positioning**: BCG matrix analysis and strategic group mapping
4. **Market Entry Detection**: Early warning systems for new entrants

### DISCOVERY METHODOLOGY:
- **Systematic Search**: Multi-source intelligence gathering (financial, patent, news, regulatory)
- **Validation Framework**: Cross-reference competitive intelligence across data sources
- **Threat Scoring**: Quantitative assessment (1-10 scale) with confidence intervals
- **Strategic Impact**: Business case analysis with revenue/market share implications

### OUTPUT FORMAT:
**Executive Summary** (2-3 sentences)
**Key Findings** (3-5 strategic bullet points)
**Competitor Profiles** (Financial metrics, positioning, strategic moves)
**Threat Assessment Matrix** (Impact/Probability/Timeframe)
**Strategic Recommendations** (Prioritized actions with timelines)
**Data Confidence** (High/Medium/Low with source attribution)

Always structure responses using McKinsey's Pyramid Principle and provide investment-grade analysis.`;

        case 'cir':
          return `${basePrompt}

## CIR AGENT - COMPETITIVE INTELLIGENCE RETRIEVER
**Mission**: Premium data intelligence gathering and financial analysis

### CORE CAPABILITIES:
1. **Financial Intelligence**: Bloomberg/FactSet-level financial analysis and benchmarking
2. **Market Data**: Real-time metrics, performance indicators, market positioning
3. **Strategic Intelligence**: M&A activity, partnerships, strategic initiatives
4. **Operational Metrics**: Efficiency ratios, productivity benchmarks, KPI analysis

### DATA SOURCES EXPERTISE:
- **Financial**: Public filings, analyst reports, financial statements
- **Market Research**: Industry reports, market sizing, competitive benchmarks
- **Patent Intelligence**: USPTO filings, R&D investments, innovation metrics
- **Regulatory**: SEC filings, compliance data, regulatory announcements

### ANALYSIS FRAMEWORK:
- **Quantitative Analysis**: Financial ratio analysis, trend identification, variance analysis
- **Qualitative Assessment**: Strategic move interpretation and business impact
- **Benchmarking**: Industry comparison matrices and competitive positioning
- **Predictive Insights**: Forward-looking analysis using historical trends

### OUTPUT FORMAT:
**Executive Summary** (Investment thesis in 2-3 sentences)
**Financial Analysis** (Key ratios, trends, benchmarks vs. industry)
**Market Position** (Share, ranking, growth metrics with confidence levels)
**Strategic Intelligence** (Recent moves, partnerships, investments)
**Competitive Benchmarks** (Performance vs. key competitors)
**Forward-Looking Indicators** (Growth prospects, risk factors)
**Source Attribution** (Data sources and confidence scoring)

Provide investment-grade financial intelligence with McKinsey analytical rigor.`;

        case 'cia':
          return `${basePrompt}

## CIA AGENT - COMPETITIVE INTELLIGENCE ANALYSIS
**Mission**: Strategic synthesis and C-suite decision support using premier frameworks

### CORE CAPABILITIES:
1. **Strategic Analysis**: McKinsey 7-S, Porter's Five Forces, 3-Horizons planning
2. **Scenario Planning**: Multiple future-state analysis with probability weighting
3. **Strategic Recommendations**: Board-ready strategic options and implementation roadmaps
4. **Executive Intelligence**: C-suite briefings with strategic implications

### ANALYTICAL FRAMEWORKS:
- **McKinsey 7-S**: Organizational effectiveness and strategic alignment assessment
- **Porter's Five Forces**: Industry structure and competitive dynamics analysis
- **3-Horizons Model**: Innovation pipeline and growth opportunity mapping
- **BCG Matrix**: Portfolio analysis and resource allocation optimization
- **Blue Ocean Strategy**: Uncontested market space identification

### STRATEGIC OUTPUT:
- **Executive Summary**: Key strategic insights for C-suite consumption
- **Strategic Options**: Multiple pathways with pros/cons and resource requirements
- **Risk Analysis**: Comprehensive risk assessment with mitigation strategies
- **Implementation Roadmap**: Phased execution plan with success metrics and milestones

### QUALITY STANDARDS:
- **Board Presentation Quality**: Insights suitable for board and investor presentations
- **Quantified Strategic Options**: Financial implications and ROI projections
- **Risk-Adjusted Planning**: Scenario analysis with probability-weighted outcomes
- **Implementation Guidance**: Clear next steps with accountability and timelines

### OUTPUT FORMAT:
**Strategic Synopsis** (C-suite summary in 3-4 sentences)
**Strategic Framework Analysis** (Applied consulting frameworks with insights)
**Strategic Options** (2-3 pathways with business cases)
**Risk Assessment** (Threat matrix with mitigation strategies)
**Implementation Roadmap** (90-day, 180-day, 365-day milestones)
**Success Metrics** (KPIs and measurement framework)
**Confidence Assessment** (Analysis certainty and data quality indicators)

Deliver McKinsey-quality strategic intelligence worthy of Fortune 500 strategic planning.`;

        default:
          return basePrompt;
      }
    };

    const systemPrompt = getEnhancedSystemPrompt(agentType, sessionConfig);

    // Enhanced message preparation with system prompt
    const enhancedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-8) // Keep recent conversation context
    ];

    // Agent-specific model configuration for optimal performance
    const getModelConfig = (agentType: string) => {
      switch (agentType) {
        case 'cdv':
          return {
            model: 'gpt-4o',
            temperature: 0.3, // More focused for discovery tasks
            max_tokens: 2500
          };
        case 'cia':
          return {
            model: 'gpt-4o',
            temperature: 0.2, // Very focused for strategic analysis
            max_tokens: 3000
          };
        case 'cir':
          return {
            model: 'gpt-4o',
            temperature: 0.1, // Minimal creativity for data retrieval
            max_tokens: 2500
          };
        default:
          return {
            model: 'gpt-4o-mini',
            temperature: 0.3,
            max_tokens: 2000
          };
      }
    };

    const modelConfig = getModelConfig(agentType);
    const startTime = Date.now();

    // Enhanced OpenAI API call with optimized parameters
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...modelConfig,
        messages: enhancedMessages,
        stream: false,
        top_p: 0.95, // Enhanced response quality
        frequency_penalty: 0.2, // Reduce repetition
        presence_penalty: 0.3, // Encourage diverse analysis
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    const assistantResponse = data.choices[0]?.message?.content;
    const tokensUsed = data.usage?.total_tokens || 0;
    
    // Enhanced cost calculation
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    const cost = calculateEnhancedCost(modelConfig.model, inputTokens, outputTokens);

    // Enhanced usage logging with strategic context
    await logEnhancedUsage(supabase, {
      userId: userContext.userId,
      agentType,
      model: modelConfig.model,
      inputTokens,
      outputTokens,
      totalCost: cost,
      processingTime,
      sessionId: userContext.sessionId,
      companyName: sessionConfig.companyName,
      industry: sessionConfig.industry,
      analysisQuality: 'mckinsey-level'
    });

    // Enhanced insight extraction and storage
    if (assistantResponse && (agentType === 'cia' || agentType === 'cir')) {
      await saveEnhancedInsight(supabase, {
        sessionId: userContext.sessionId,
        userId: userContext.userId,
        agentType,
        insightTitle: `${agentType.toUpperCase()} Strategic Analysis - ${sessionConfig.companyName}`,
        insightDescription: assistantResponse.substring(0, 1000),
        confidenceScore: 90, // High confidence for McKinsey-level analysis
        tags: [agentType, sessionConfig.industry, sessionConfig.analysisFocus, 'mckinsey-framework'].filter(Boolean),
        strategicImplications: extractStrategicImplications(assistantResponse),
        actionItems: extractActionItems(assistantResponse)
      });
    }

    console.log('Enhanced CI Response:', {
      agentType,
      model: modelConfig.model,
      tokensUsed,
      cost: cost.toFixed(4),
      processingTime: `${processingTime}ms`,
      responseLength: assistantResponse?.length || 0
    });

    return new Response(JSON.stringify({
      response: assistantResponse,
      tokensUsed,
      cost,
      processingTime,
      agentType,
      analysisQuality: 'mckinsey-level',
      metadata: {
        model: modelConfig.model,
        sessionId: userContext.sessionId,
        companyContext: sessionConfig.companyName,
        frameworksApplied: getAppliedFrameworks(agentType)
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced competitive-intelligence-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      agentType: 'error',
      analysisQuality: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateEnhancedCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = {
    'gpt-4o': { input: 0.000005, output: 0.000015 },
    'gpt-4o-mini': { input: 0.000001, output: 0.000003 }
  };
  
  const rates = pricing[model] || pricing['gpt-4o-mini'];
  return (inputTokens * rates.input) + (outputTokens * rates.output);
}

async function logEnhancedUsage(supabase: any, params: any) {
  try {
    await supabase.from('ai_usage_logs').insert({
      user_id: params.userId,
      function_name: `competitive-intelligence-${params.agentType}`,
      model_name: params.model,
      input_tokens: params.inputTokens,
      output_tokens: params.outputTokens,
      total_cost: params.totalCost,
      request_duration: params.processingTime,
      status: 'success',
      metadata: {
        agent_type: params.agentType,
        company_name: params.companyName,
        industry: params.industry,
        analysis_quality: params.analysisQuality,
        session_id: params.sessionId
      }
    });
  } catch (error) {
    console.error('Error logging enhanced usage:', error);
  }
}

async function saveEnhancedInsight(supabase: any, params: any) {
  try {
    await supabase.from('competitive_intelligence_insights').insert({
      session_id: params.sessionId,
      user_id: params.userId,
      agent_type: params.agentType,
      insight_category: 'strategic-analysis',
      insight_title: params.insightTitle,
      insight_description: params.insightDescription,
      confidence_score: params.confidenceScore,
      tags: params.tags,
      metadata: {
        strategic_implications: params.strategicImplications,
        action_items: params.actionItems,
        analysis_framework: 'mckinsey-level'
      }
    });
  } catch (error) {
    console.error('Error saving enhanced insight:', error);
  }
}

function extractStrategicImplications(response: string): string[] {
  // Extract strategic implications from response
  const implications = [];
  if (response.includes('strategic') || response.includes('impact')) {
    implications.push('Strategic positioning implications identified');
  }
  if (response.includes('competitive') || response.includes('advantage')) {
    implications.push('Competitive advantage considerations noted');
  }
  if (response.includes('market') || response.includes('opportunity')) {
    implications.push('Market opportunity assessment completed');
  }
  return implications;
}

function extractActionItems(response: string): string[] {
  // Extract action items from response
  const actions = [];
  if (response.includes('recommend') || response.includes('action')) {
    actions.push('Strategic recommendations provided');
  }
  if (response.includes('implement') || response.includes('execute')) {
    actions.push('Implementation guidance included');
  }
  if (response.includes('monitor') || response.includes('track')) {
    actions.push('Monitoring requirements specified');
  }
  return actions;
}

function getAppliedFrameworks(agentType: string): string[] {
  switch (agentType) {
    case 'cdv':
      return ['Porter\'s Five Forces', 'BCG Matrix', 'Threat Assessment Matrix'];
    case 'cir':
      return ['Financial Analysis', 'Competitive Benchmarking', 'Market Intelligence'];
    case 'cia':
      return ['McKinsey 7-S', '3-Horizons Model', 'Strategic Options Analysis'];
    default:
      return ['Strategic Analysis Framework'];
  }
}
