
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { costMonitor } from '../_shared/cost-monitor.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = 'https://jzvpgqtobzqbavsillqp.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!openAIApiKey) {
  throw new Error('OPENAI_API_KEY is required');
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  context?: string;
  conversationHistory?: ChatMessage[];
  model?: 'gpt-4o-mini' | 'gpt-4o';
}

// Token counting utility for more accurate estimation
function countTokens(text: string): number {
  // More sophisticated token counting
  // This is a simplified approximation - in production you might want to use tiktoken library
  const words = text.split(/\s+/).length;
  const chars = text.length;
  
  // Rough estimation: 1 token ≈ 0.75 words or 4 characters
  return Math.ceil(Math.max(words * 1.33, chars / 4));
}

function buildMessages(message: string, context?: string, conversationHistory?: ChatMessage[]): ChatMessage[] {
  const systemPrompt = `You are CLIPOGINO, an AI-powered professional development mentor and career coach. You are part of the LAIGENT platform, designed to help professionals advance their careers through personalized guidance.

Your core personality:
- Wise and experienced mentor with deep business acumen
- Encouraging yet realistic in your assessments
- Highly practical with actionable advice
- Professional but approachable tone
- Focus on measurable outcomes and growth

Your expertise areas:
- Career strategy and planning
- Leadership development
- Skill gap analysis
- Interview preparation
- Networking strategies
- Professional communication
- Work-life balance
- Industry insights across sectors

Guidelines:
- Always provide specific, actionable advice
- Ask clarifying questions when context is needed
- Reference relevant frameworks and methodologies
- Encourage continuous learning and development
- Be supportive of career transitions and changes
- Focus on building professional confidence

${context ? `\nAdditional context: ${context}` : ''}

Remember: You're here to accelerate professional growth through intelligent mentoring.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt }
  ];

  // Add conversation history if provided
  if (conversationHistory && conversationHistory.length > 0) {
    // Limit history to last 10 exchanges to manage token usage
    const recentHistory = conversationHistory.slice(-20);
    messages.push(...recentHistory);
  }

  // Add current message
  messages.push({ role: 'user', content: message });

  return messages;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user authentication
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, context, conversationHistory, model = 'gpt-4o-mini' }: ChatRequest = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build the complete message payload
    const messages = buildMessages(message, context, conversationHistory);
    const fullInputText = messages.map(m => m.content).join('\n');

    console.log('CLIPOGINO Chat Request:', {
      userId: user.id,
      model,
      messageLength: message.length,
      contextLength: context?.length || 0,
      historyLength: conversationHistory?.length || 0,
      estimatedTokens: countTokens(fullInputText)
    });

    // Execute with cost control
    const result = await costMonitor.withCostControl(
      user.id,
      model,
      'clipogino-chat',
      fullInputText,
      async () => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: 2048,
            temperature: 0.7,
            top_p: 0.9,
            frequency_penalty: 0.1,
            presence_penalty: 0.1,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        
        if (!data.choices || data.choices.length === 0) {
          throw new Error('No response from OpenAI');
        }

        const aiResponse = data.choices[0].message.content;
        const usage = data.usage;

        return {
          result: {
            response: aiResponse,
            usage: {
              promptTokens: usage?.prompt_tokens || 0,
              completionTokens: usage?.completion_tokens || 0,
              totalTokens: usage?.total_tokens || 0,
            },
            model,
            conversationId: crypto.randomUUID(),
          },
          inputTokens: usage?.prompt_tokens || countTokens(fullInputText),
          outputTokens: usage?.completion_tokens || countTokens(aiResponse || ''),
        };
      }
    );

    console.log('CLIPOGINO Chat Success:', {
      userId: user.id,
      model,
      inputTokens: result.usage.promptTokens,
      outputTokens: result.usage.completionTokens,
      responseLength: result.response.length
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in clipogino-chat function:', error);
    
    // Return appropriate error response based on error type
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
      message: 'An error occurred while processing your request. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
