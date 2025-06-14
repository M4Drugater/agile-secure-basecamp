
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

    // Get agent-specific model configuration
    const getModelConfig = (agentType: string) => {
      switch (agentType) {
        case 'cdv':
          return {
            model: 'gpt-4o',
            temperature: 0.3,
            max_tokens: 2000
          };
        case 'cia':
          return {
            model: 'gpt-4o',
            temperature: 0.2,
            max_tokens: 2500
          };
        case 'cir':
          return {
            model: 'gpt-4o',
            temperature: 0.1,
            max_tokens: 3000
          };
        default:
          return {
            model: 'gpt-4o-mini',
            temperature: 0.3,
            max_tokens: 1500
          };
      }
    };

    const modelConfig = getModelConfig(agentType);
    const startTime = Date.now();

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...modelConfig,
        messages,
        stream: false,
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
    
    // Calculate cost (approximate)
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    const cost = calculateCost(modelConfig.model, inputTokens, outputTokens);

    // Log usage
    await logUsage(supabase, {
      userId: userContext.userId,
      agentType,
      model: modelConfig.model,
      inputTokens,
      outputTokens,
      totalCost: cost,
      processingTime,
      sessionId: userContext.sessionId
    });

    // Save insight if this is a significant analysis
    if (agentResponse && (agentType === 'cia' || agentType === 'cir')) {
      await saveInsight(supabase, {
        sessionId: userContext.sessionId,
        userId: userContext.userId,
        agentType,
        insightTitle: `${agentType.toUpperCase()} Analysis`,
        insightDescription: assistantResponse.substring(0, 500),
        confidenceScore: 85,
        tags: [agentType, sessionConfig.industry, sessionConfig.analysisFocus].filter(Boolean)
      });
    }

    return new Response(JSON.stringify({
      response: assistantResponse,
      tokensUsed,
      cost,
      processingTime,
      agentType,
      metadata: {
        model: modelConfig.model,
        sessionId: userContext.sessionId
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in competitive-intelligence-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      agentType: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = {
    'gpt-4o': { input: 0.000005, output: 0.000015 },
    'gpt-4o-mini': { input: 0.000001, output: 0.000003 }
  };
  
  const rates = pricing[model] || pricing['gpt-4o-mini'];
  return (inputTokens * rates.input) + (outputTokens * rates.output);
}

async function logUsage(supabase: any, params: any) {
  try {
    await supabase.from('ai_usage_logs').insert({
      user_id: params.userId,
      function_name: `competitive-intelligence-${params.agentType}`,
      model_name: params.model,
      input_tokens: params.inputTokens,
      output_tokens: params.outputTokens,
      total_cost: params.totalCost,
      request_duration: params.processingTime,
      status: 'success'
    });
  } catch (error) {
    console.error('Error logging usage:', error);
  }
}

async function saveInsight(supabase: any, params: any) {
  try {
    await supabase.from('competitive_intelligence_insights').insert({
      session_id: params.sessionId,
      user_id: params.userId,
      agent_type: params.agentType,
      insight_category: 'analysis',
      insight_title: params.insightTitle,
      insight_description: params.insightDescription,
      confidence_score: params.confidenceScore,
      tags: params.tags
    });
  } catch (error) {
    console.error('Error saving insight:', error);
  }
}
