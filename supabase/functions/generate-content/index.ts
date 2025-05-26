
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
  type: 'resume' | 'cover-letter' | 'linkedin-post' | 'email' | 'presentation' | 'article';
  topic: string;
  style?: 'professional' | 'casual' | 'formal' | 'creative';
  length?: 'short' | 'medium' | 'long';
  additionalInstructions?: string;
  targetAudience?: string;
  model?: 'gpt-4o-mini' | 'gpt-4o';
}

// Token counting utility
function countTokens(text: string): number {
  const words = text.split(/\s+/).length;
  const chars = text.length;
  return Math.ceil(Math.max(words * 1.33, chars / 4));
}

function buildContentPrompt(request: ContentRequest): string {
  const { type, topic, style = 'professional', length = 'medium', additionalInstructions, targetAudience } = request;

  const basePrompts = {
    'resume': `Create a professional resume section or content for: ${topic}`,
    'cover-letter': `Write a compelling cover letter for: ${topic}`,
    'linkedin-post': `Create an engaging LinkedIn post about: ${topic}`,
    'email': `Draft a professional email regarding: ${topic}`,
    'presentation': `Create presentation content/outline for: ${topic}`,
    'article': `Write an informative article about: ${topic}`
  };

  const lengthGuidelines = {
    'short': 'Keep it concise and to the point (100-300 words)',
    'medium': 'Provide a balanced level of detail (300-600 words)',
    'long': 'Include comprehensive detail and examples (600-1200 words)'
  };

  const styleGuidelines = {
    'professional': 'Use professional, business-appropriate language',
    'casual': 'Use a conversational, approachable tone',
    'formal': 'Use formal, academic-style language',
    'creative': 'Use creative, engaging language with personality'
  };

  let prompt = `You are an expert content creator specializing in professional development and career advancement.

Task: ${basePrompts[type]}

Style: ${styleGuidelines[style]}
Length: ${lengthGuidelines[length]}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}

Requirements:
- Make it highly relevant and actionable
- Use industry best practices
- Include specific examples when appropriate
- Ensure professional quality and accuracy
- Focus on value and impact

${additionalInstructions ? `Additional Instructions: ${additionalInstructions}` : ''}

Topic: ${topic}

Please create the content now:`;

  return prompt;
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

    const contentRequest: ContentRequest = await req.json();

    if (!contentRequest.type || !contentRequest.topic) {
      return new Response(JSON.stringify({ error: 'Type and topic are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const model = contentRequest.model || 'gpt-4o-mini';
    const prompt = buildContentPrompt(contentRequest);

    console.log('Generate Content Request:', {
      userId: user.id,
      type: contentRequest.type,
      model,
      topicLength: contentRequest.topic.length,
      estimatedTokens: countTokens(prompt)
    });

    // Execute with cost control
    const result = await costMonitor.withCostControl(
      user.id,
      model,
      'generate-content',
      prompt,
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
              { role: 'user', content: prompt }
            ],
            max_tokens: contentRequest.length === 'long' ? 2048 : contentRequest.length === 'medium' ? 1024 : 512,
            temperature: contentRequest.style === 'creative' ? 0.9 : 0.7,
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
              generatedAt: new Date().toISOString(),
            }
          },
          inputTokens: usage?.prompt_tokens || countTokens(prompt),
          outputTokens: usage?.completion_tokens || countTokens(generatedContent || ''),
        };
      }
    );

    console.log('Generate Content Success:', {
      userId: user.id,
      type: contentRequest.type,
      model,
      inputTokens: result.usage.promptTokens,
      outputTokens: result.usage.completionTokens,
      contentLength: result.content.length
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-content function:', error);
    
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
      message: 'An error occurred while generating content. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
