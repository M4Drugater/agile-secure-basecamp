
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PerplexityClient } from './perplexity-client.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface EliteRequest {
  messages: any[];
  model: string;
  systemPrompt?: string;
  searchEnabled?: boolean;
  searchQuery?: string;
  userId?: string;
  sessionId?: string;
  contextLevel?: 'basic' | 'enhanced' | 'elite';
}

// Enhanced model pricing with Perplexity models
const MODEL_PRICING = {
  'gpt-4o': { input: 0.00250, output: 0.01000 },
  'gpt-4o-mini': { input: 0.00015, output: 0.00060 },
  'claude-3-5-sonnet-20241022': { input: 0.00300, output: 0.01500 },
  'claude-3-opus-20240229': { input: 0.01500, output: 0.07500 },
  'llama-3.1-sonar-small-128k-online': { input: 0.00200, output: 0.00200 },
  'llama-3.1-sonar-large-128k-online': { input: 0.00600, output: 0.00600 },
  'llama-3.1-sonar-huge-128k-online': { input: 0.01200, output: 0.01200 }
};

async function performWebSearch(query: string, type: string = 'comprehensive') {
  if (!perplexityApiKey) {
    return {
      success: false,
      data: null,
      fallback: 'Web search unavailable - API key not configured'
    };
  }

  try {
    console.log('🔍 Performing web search with Perplexity:', query);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
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
            content: `You are an elite research analyst. Provide comprehensive, investment-grade intelligence with specific data points, sources, and strategic insights. Focus on: competitive analysis, market trends, financial data, regulatory changes, and strategic implications.`
          },
          {
            role: 'user',
            content: `Research query: ${query}

Provide a structured response with:
1. Executive Summary (2-3 sentences)
2. Key Data Points (quantified metrics)
3. Strategic Implications
4. Competitive Intelligence
5. Market Context
6. Source Attribution

Make this suitable for C-suite decision making.`
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: true,
        search_recency_filter: 'month'
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ Web search completed successfully');
    
    return {
      success: true,
      data: {
        content: data.choices[0].message.content,
        relatedQuestions: data.related_questions || [],
        sources: ['Perplexity AI Research', 'Live Web Data'],
        confidence: 0.85,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('❌ Web search error:', error);
    return {
      success: false,
      data: null,
      fallback: `Web search temporarily unavailable: ${error.message}`
    };
  }
}

async function callOpenAI(messages: any[], model: string) {
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('🤖 Calling OpenAI API:', model);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  console.log('✅ OpenAI response received');
  return data;
}

async function callClaude(messages: any[], model: string) {
  if (!claudeApiKey) {
    throw new Error('Claude API key not configured');
  }

  console.log('🧠 Calling Claude API:', model);

  // Convert messages to Claude format
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': claudeApiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      system: systemMessage?.content || '',
      messages: conversationMessages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  
  // Convert Claude response to OpenAI format
  console.log('✅ Claude response received');
  return {
    choices: [{
      message: {
        content: data.content[0].text
      }
    }],
    usage: data.usage
  };
}

function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = MODEL_PRICING[model as keyof typeof MODEL_PRICING];
  if (!pricing) {
    return 0; // Unknown model, return 0 cost
  }
  
  const inputCost = (inputTokens / 1000) * pricing.input;
  const outputCost = (outputTokens / 1000) * pricing.output;
  return inputCost + outputCost;
}

async function logUsage(userId: string, model: string, tokensUsed: number, cost: number) {
  try {
    const { error } = await supabase.from('ai_usage_logs').insert({
      user_id: userId,
      model,
      tokens_used: tokensUsed,
      cost,
      timestamp: new Date().toISOString()
    });
    
    if (error) {
      console.error('Usage logging error:', error);
    }
  } catch (error) {
    console.error('Usage logging failed:', error);
  }
}

async function callPerplexity(messages: any[], model: string) {
  if (!perplexityApiKey) {
    throw new Error('Perplexity API key not configured');
  }

  const perplexityClient = new PerplexityClient(perplexityApiKey);
  
  const response = await perplexityClient.sendChatRequest({
    messages,
    model,
    temperature: 0.1,
    max_tokens: 2000,
    search_recency_filter: 'month'
  });

  // Convert to standard format
  return {
    choices: [{
      message: {
        content: response.choices[0].message.content
      }
    }],
    usage: {
      total_tokens: response.usage?.total_tokens || 0,
      prompt_tokens: response.usage?.prompt_tokens || 0,
      completion_tokens: response.usage?.completion_tokens || 0
    }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      messages,
      model,
      systemPrompt,
      searchEnabled,
      searchQuery,
      userId,
      sessionId,
      contextLevel = 'elite'
    }: EliteRequest = await req.json();

    console.log('🚀 Elite Multi-LLM Engine Request (Perplexity-First):', {
      model,
      searchEnabled,
      contextLevel,
      userId,
      messagesCount: messages.length
    });

    // Prepare enhanced messages
    const enhancedMessages = systemPrompt ? 
      [{ role: 'system', content: systemPrompt }, ...messages.filter(m => m.role !== 'system')] :
      messages;

    let response;
    let tokensUsed = 0;
    let cost = 0;

    // Route to appropriate LLM - PRIORITIZE PERPLEXITY
    if (model.includes('sonar') || model.includes('llama-3.1')) {
      console.log('🔍 Using Perplexity engine for:', model);
      response = await callPerplexity(enhancedMessages, model);
      const inputTokens = response.usage?.prompt_tokens || 0;
      const outputTokens = response.usage?.completion_tokens || 0;
      tokensUsed = inputTokens + outputTokens;
      cost = calculateCost(model, inputTokens, outputTokens);
    } else if (model.startsWith('claude')) {
      console.log('🧠 Using Claude engine for:', model);
      response = await callClaude(enhancedMessages, model);
      const inputTokens = response.usage?.input_tokens || 0;
      const outputTokens = response.usage?.output_tokens || 0;
      tokensUsed = inputTokens + outputTokens;
      cost = calculateCost(model, inputTokens, outputTokens);
    } else {
      console.log('🤖 Using OpenAI engine for:', model);
      response = await callOpenAI(enhancedMessages, model);
      tokensUsed = response.usage?.total_tokens || 0;
      const promptTokens = response.usage?.prompt_tokens || 0;
      const completionTokens = response.usage?.completion_tokens || 0;
      cost = calculateCost(model, promptTokens, completionTokens);
    }

    // Log usage
    if (userId) {
      await logUsage(userId, model, tokensUsed, cost);
    }

    const result = {
      response: response.choices[0].message.content,
      model,
      tokensUsed,
      cost: cost.toFixed(6),
      searchEnabled,
      contextLevel,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Elite Multi-LLM Engine Success (Perplexity-First):', {
      userId,
      model,
      tokensUsed,
      cost: cost.toFixed(6),
      responseLength: result.response.length
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Elite Multi-LLM Engine Error:', error);
    
    const errorResponse = {
      error: error.message,
      fallback: 'Elite AI system temporarily unavailable. Core functionality continues.',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
