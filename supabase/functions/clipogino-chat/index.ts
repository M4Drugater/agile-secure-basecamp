
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { costMonitor } from '../_shared/cost-monitor.ts';
import { ChatRequest, ChatResponse } from './types.ts';
import { buildMessages } from './prompt-builder.ts';
import { countTokens } from './token-utils.ts';
import { OpenAIClient } from './openai-client.ts';
import { authenticateUser } from './auth-handler.ts';
import { handleError } from './error-handler.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

if (!openAIApiKey) {
  throw new Error('OPENAI_API_KEY is required');
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('authorization');
    const user = await authenticateUser(authHeader);

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

    // Initialize OpenAI client
    const openAIClient = new OpenAIClient(openAIApiKey);

    // Execute with cost control
    const result = await costMonitor.withCostControl(
      user.id,
      model,
      'clipogino-chat',
      fullInputText,
      async () => {
        const openAIResponse = await openAIClient.sendChatRequest(messages, model);
        
        const aiResponse = openAIResponse.choices[0].message.content;
        const usage = openAIResponse.usage;

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
          } as ChatResponse,
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
    const { status, response } = handleError(error);
    
    return new Response(JSON.stringify(response), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
