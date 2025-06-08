
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { EnhancedKnowledgeContextBuilder } from './knowledge-context-builder.ts';
import { buildSystemPrompt, buildMessages, ChatMessage } from './prompt-system.ts';
import { UsageLogger } from './usage-logger.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, conversationHistory, model = 'gpt-4o-mini' } = await req.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Enhanced CLIPOGINO Chat Request:', { 
      userId: user.id, 
      message: message.substring(0, 100),
      model: model 
    });

    // Build comprehensive enhanced knowledge context
    const contextBuilder = new EnhancedKnowledgeContextBuilder();
    let knowledgeContext = await contextBuilder.buildEnhancedContext(message, user.id);

    // Add any additional context passed from the frontend
    if (context) {
      knowledgeContext += '\n\n=== ADDITIONAL FRONTEND CONTEXT ===\n';
      knowledgeContext += context;
    }

    // Build the enhanced system prompt with comprehensive context
    const systemPrompt = buildSystemPrompt(knowledgeContext);

    // Prepare messages for OpenAI
    const messages = buildMessages(systemPrompt, message, conversationHistory);

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        response: "Lo siento, pero el servicio de IA no está disponible actualmente. Por favor contacta a soporte para configurar la clave de OpenAI API.",
        usage: { totalTokens: 0, promptTokens: 0, completionTokens: 0 },
        model: model
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call OpenAI API with enhanced prompting
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: model === 'gpt-4o' ? 2000 : 1500,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Log usage if needed
    const usage = data.usage;
    if (usage) {
      const usageLogger = new UsageLogger();
      await usageLogger.logUsage(user.id, model, usage);
    }

    console.log('Enhanced CLIPOGINO Response generated:', { 
      userId: user.id, 
      replyLength: reply.length,
      contextLength: knowledgeContext.length,
      hasPersonalFiles: knowledgeContext.includes('PERSONAL KNOWLEDGE'),
      hasSystemKnowledge: knowledgeContext.includes('SYSTEM KNOWLEDGE'),
      hasContentContext: knowledgeContext.includes('CONTENT CREATION'),
      hasLearningContext: knowledgeContext.includes('LEARNING PROGRESS'),
      hasActivityContext: knowledgeContext.includes('RECENT ACTIVITY'),
      hasConversationHistory: knowledgeContext.includes('CONVERSATION HISTORY'),
      model: model
    });

    return new Response(JSON.stringify({ 
      response: reply,
      usage: {
        totalTokens: usage?.total_tokens || 0,
        promptTokens: usage?.prompt_tokens || 0,
        completionTokens: usage?.completion_tokens || 0
      },
      model: model
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced clipogino-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      response: 'Lo siento, encontré un error al procesar tu solicitud. Por favor intenta de nuevo más tarde.',
      usage: { totalTokens: 0, promptTokens: 0, completionTokens: 0 },
      model: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
