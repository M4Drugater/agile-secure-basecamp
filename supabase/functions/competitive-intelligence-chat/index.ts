
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { EnhancedPromptEngine } from './enhanced-prompt-engine.ts';

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
      return new Response(JSON.stringify({ 
        error: 'OpenAI API not configured',
        response: 'I apologize, but my analysis services are temporarily unavailable. Please contact support for assistance.',
        agentType,
        analysisQuality: 'error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Enhanced CI Chat Request:', {
      agentType,
      companyName: sessionConfig.companyName,
      industry: sessionConfig.industry,
      messagesCount: messages.length,
      userId: userContext.userId
    });

    // Build optimized system prompt using enhanced prompt engine
    const systemPrompt = EnhancedPromptEngine.buildOptimizedPrompt(agentType, sessionConfig, userContext);

    // Prepare optimized messages with enhanced context
    const enhancedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-8) // Keep recent conversation context for continuity
    ];

    // Agent-specific model optimization for cost and performance
    const getOptimizedModelConfig = (agentType: string) => {
      const baseConfig = {
        model: 'gpt-4o',
        temperature: 0.2, // Low temperature for analytical precision
        top_p: 0.95,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      };

      const agentConfigs = {
        cdv: { ...baseConfig, max_tokens: 2500, temperature: 0.3 }, // Discovery needs some creativity
        cir: { ...baseConfig, max_tokens: 2000, temperature: 0.1 }, // Data retrieval needs precision
        cia: { ...baseConfig, max_tokens: 3000, temperature: 0.2 }, // Analysis needs balance
      };

      return agentConfigs[agentType] || { ...baseConfig, max_tokens: 2000 };
    };

    const modelConfig = getOptimizedModelConfig(agentType);
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
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    const assistantResponse = data.choices[0]?.message?.content;
    const usage = data.usage || {};
    
    // Enhanced cost calculation
    const cost = calculateOptimizedCost(modelConfig.model, usage.prompt_tokens || 0, usage.completion_tokens || 0);

    // Log enhanced usage with strategic context
    await logEnhancedUsage(supabase, {
      userId: userContext.userId,
      agentType,
      model: modelConfig.model,
      inputTokens: usage.prompt_tokens || 0,
      outputTokens: usage.completion_tokens || 0,
      totalCost: cost,
      processingTime,
      sessionId: userContext.sessionId,
      companyName: sessionConfig.companyName,
      industry: sessionConfig.industry,
      analysisQuality: 'mckinsey-enhanced'
    });

    // Save strategic insights for high-value analysis
    if (assistantResponse && usage.completion_tokens > 1000) {
      await saveStrategicInsight(supabase, {
        sessionId: userContext.sessionId,
        userId: userContext.userId,
        agentType,
        insightContent: assistantResponse,
        confidenceScore: 95, // High confidence for enhanced prompts
        tags: [agentType, sessionConfig.industry, sessionConfig.analysisFocus, 'mckinsey-enhanced'].filter(Boolean),
        metadata: {
          model: modelConfig.model,
          tokensUsed: usage.total_tokens,
          processingTime,
          cost,
          companyContext: sessionConfig.companyName,
          frameworksApplied: getAppliedFrameworks(agentType)
        }
      });
    }

    console.log('Enhanced CI Response Success:', {
      agentType,
      model: modelConfig.model,
      tokensUsed: usage.total_tokens || 0,
      cost: cost.toFixed(4),
      processingTime: `${processingTime}ms`,
      responseLength: assistantResponse?.length || 0,
      analysisQuality: 'mckinsey-enhanced'
    });

    return new Response(JSON.stringify({
      response: assistantResponse,
      tokensUsed: usage.total_tokens || 0,
      cost,
      processingTime,
      agentType,
      analysisQuality: 'mckinsey-enhanced',
      model: modelConfig.model,
      metadata: {
        sessionId: userContext.sessionId,
        companyContext: sessionConfig.companyName,
        industry: sessionConfig.industry,
        frameworksApplied: getAppliedFrameworks(agentType),
        promptOptimization: 'enhanced'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced competitive-intelligence-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'I encountered an error while conducting the strategic analysis. Please try again, and I will provide you with the comprehensive intelligence you need.',
      agentType: 'error',
      analysisQuality: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateOptimizedCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = {
    'gpt-4o': { input: 0.000005, output: 0.000015 },
    'gpt-4o-mini': { input: 0.000001, output: 0.000003 }
  };
  
  const rates = pricing[model] || pricing['gpt-4o'];
  return (inputTokens * rates.input) + (outputTokens * rates.output);
}

async function logEnhancedUsage(supabase: any, params: any) {
  try {
    await supabase.from('ai_usage_logs').insert({
      user_id: params.userId,
      function_name: `ci-enhanced-${params.agentType}`,
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
        session_id: params.sessionId,
        prompt_optimization: 'enhanced-v2'
      }
    });
  } catch (error) {
    console.error('Error logging enhanced usage:', error);
  }
}

async function saveStrategicInsight(supabase: any, params: any) {
  try {
    await supabase.from('competitive_intelligence_insights').insert({
      session_id: params.sessionId,
      user_id: params.userId,
      agent_type: params.agentType,
      insight_category: 'strategic-analysis-enhanced',
      insight_title: `Enhanced ${params.agentType.toUpperCase()} Analysis - ${params.metadata.companyContext}`,
      insight_description: params.insightContent.substring(0, 1000),
      confidence_score: params.confidenceScore,
      tags: params.tags,
      metadata: {
        ...params.metadata,
        prompt_version: 'enhanced-v2',
        analysis_framework: 'mckinsey-enhanced'
      }
    });
  } catch (error) {
    console.error('Error saving strategic insight:', error);
  }
}

function getAppliedFrameworks(agentType: string): string[] {
  const frameworks = {
    cdv: ['Porter\'s Five Forces', 'Threat Assessment Matrix', 'Competitive Landscape Mapping', 'Strategic Group Analysis'],
    cir: ['Financial Ratio Analysis', 'Competitive Benchmarking', 'Market Intelligence Framework', 'Performance Gap Analysis'],
    cia: ['McKinsey 7-S Model', '3-Horizons Framework', 'Strategic Options Analysis', 'BCG Growth-Share Matrix', 'Blue Ocean Strategy']
  };
  
  return frameworks[agentType] || ['Strategic Analysis Framework'];
}
