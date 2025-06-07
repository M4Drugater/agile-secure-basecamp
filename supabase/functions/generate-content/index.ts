
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

interface ContentRequest {
  type: string;
  topic: string;
  style?: string;
  length?: string;
  additionalInstructions?: string;
  targetAudience?: string;
  businessContext?: string;
  model?: 'gpt-4o-mini' | 'gpt-4o';
  tone?: string;
  industry?: string;
  purpose?: string;
}

function countTokens(text: string): number {
  const words = text.split(/\s+/).length;
  const chars = text.length;
  return Math.ceil(Math.max(words * 1.33, chars / 4));
}

function buildEnhancedSystemPrompt(): string {
  return `You are CLIPOGINO, an elite executive content strategist and communication specialist with deep expertise in C-suite level business communication. 

Your mission is to create premium, sophisticated content that demonstrates:
- Strategic business thinking and executive presence
- Deep industry knowledge and market intelligence
- Data-driven insights and analytical rigor
- Professional credibility and thought leadership
- Actionable recommendations with clear business impact

You understand that your content will be consumed by senior executives, board members, investors, and other sophisticated business audiences who expect:
- Concise, impactful communication that respects their time
- Strategic insights that drive business value
- Professional tone with appropriate gravitas
- Evidence-based recommendations and conclusions
- Clear articulation of business implications and next steps

Your content should position the author as a strategic business leader with executive presence and deep expertise in their field.

Always maintain the highest standards of business communication, ensuring content is board-room ready and suitable for C-suite consumption.`;
}

function getMaxTokensForLength(length: string): number {
  const tokenLimits = {
    'executive-summary': 512,
    'short': 1024,
    'medium': 2048,
    'comprehensive': 4096,
  };
  return tokenLimits[length as keyof typeof tokenLimits] || 2048;
}

function getTemperatureForStyle(style: string): number {
  const temperatureMap = {
    'executive': 0.3,
    'strategic': 0.4,
    'analytical': 0.2,
    'professional': 0.3,
    'authoritative': 0.2,
    'visionary': 0.7,
    'consultative': 0.5,
  };
  return temperatureMap[style as keyof typeof temperatureMap] || 0.4;
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

    const contentRequest: ContentRequest = await req.json();

    if (!contentRequest.type || !contentRequest.topic) {
      return new Response(JSON.stringify({ error: 'Type and topic are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const model = contentRequest.model || 'gpt-4o';
    const systemPrompt = buildEnhancedSystemPrompt();
    const userPrompt = contentRequest.topic; // This now contains the enhanced prompt from the frontend
    
    const maxTokens = getMaxTokensForLength(contentRequest.length || 'medium');
    const temperature = getTemperatureForStyle(contentRequest.style || 'executive');

    console.log('Enhanced Content Generation Request:', {
      userId: user.id,
      type: contentRequest.type,
      model,
      maxTokens,
      temperature,
      targetAudience: contentRequest.targetAudience,
      estimatedTokens: countTokens(systemPrompt + userPrompt)
    });

    const result = await costMonitor.withCostControl(
      user.id,
      model,
      'generate-content',
      systemPrompt + userPrompt,
      async () => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: maxTokens,
            temperature,
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

        const generatedContent = data.choices[0].message.content;
        const usage = data.usage;

        return {
          result: {
            content: generatedContent,
            type: contentRequest.type,
            usage: {
              promptTokens: usage?.prompt_tokens || 0,
              completionTokens: usage?.completion_tokens || 0,
              totalTokens: usage?.total_tokens || 0,
            },
            model,
            metadata: {
              style: contentRequest.style,
              length: contentRequest.length,
              targetAudience: contentRequest.targetAudience,
              businessContext: contentRequest.businessContext,
              tone: contentRequest.tone,
              industry: contentRequest.industry,
              purpose: contentRequest.purpose,
              generatedAt: new Date().toISOString(),
              enhanced: true,
            }
          },
          inputTokens: usage?.prompt_tokens || countTokens(systemPrompt + userPrompt),
          outputTokens: usage?.completion_tokens || countTokens(generatedContent || ''),
        };
      }
    );

    console.log('Enhanced Content Generation Success:', {
      userId: user.id,
      type: contentRequest.type,
      model,
      inputTokens: result.usage.promptTokens,
      outputTokens: result.usage.completionTokens,
      contentLength: result.content.length,
      enhanced: true
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced generate-content function:', error);
    
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
      message: 'An error occurred while generating enhanced content. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
