
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { ElitePromptSystem } from './elite-prompt-system.ts';
import { EnhancedContextBuilder } from './enhanced-context-builder.ts';
import { buildMessages, ChatMessage } from './prompt-system.ts';
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
    const { message, context, conversationHistory, model = 'gpt-4o-mini', currentPage = '/chat' } = await req.json();
    
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

    console.log('Elite CLIPOGINO Request:', { 
      userId: user.id, 
      message: message.substring(0, 100),
      model,
      currentPage
    });

    // Build enhanced user context
    const contextBuilder = new EnhancedContextBuilder();
    const userContext = await contextBuilder.buildUserContext(user.id, currentPage);

    // Generate elite system prompt
    const elitePromptSystem = new ElitePromptSystem();
    const eliteSystemPrompt = elitePromptSystem.buildEliteSystemPrompt(userContext);

    // Prepare enhanced messages with elite prompt
    const messages: ChatMessage[] = [
      { role: 'system', content: eliteSystemPrompt },
      ...(conversationHistory || []).slice(-8), // Include recent conversation history
      { role: 'user', content: message }
    ];

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        response: "I apologize, but my AI services are temporarily unavailable. Please contact support for assistance with configuring the OpenAI API.",
        usage: { totalTokens: 0, promptTokens: 0, completionTokens: 0 },
        model: model,
        contextQuality: 'elite'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call OpenAI API with elite configuration
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: model === 'gpt-4o' ? 2500 : 2000,
        temperature: 0.8, // Higher creativity for strategic thinking
        top_p: 0.95, // Enhanced response quality
        frequency_penalty: 0.2, // Reduce repetition
        presence_penalty: 0.3, // Encourage diverse thinking
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Log elite usage metrics
    const usage = data.usage;
    if (usage) {
      const usageLogger = new UsageLogger();
      await usageLogger.logUsage(user.id, model, usage);
    }

    console.log('Elite CLIPOGINO Response:', { 
      userId: user.id, 
      replyLength: reply.length,
      contextQuality: 'elite',
      personalFilesCount: userContext.knowledge.personal_files_count,
      systemKnowledgeCount: userContext.knowledge.system_knowledge_count,
      experienceLevel: userContext.profile.experience_level,
      currentPage: userContext.session.current_page,
      model: model
    });

    return new Response(JSON.stringify({ 
      response: reply,
      usage: {
        totalTokens: usage?.total_tokens || 0,
        promptTokens: usage?.prompt_tokens || 0,
        completionTokens: usage?.completion_tokens || 0
      },
      model: model,
      contextQuality: 'elite',
      userContext: {
        experienceLevel: userContext.profile.experience_level,
        knowledgeAssets: userContext.knowledge.personal_files_count,
        industryFocus: userContext.profile.industry
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in elite clipogino-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      response: 'I encountered an error while processing your request. Please try again, and I will provide you with the strategic guidance you need.',
      usage: { totalTokens: 0, promptTokens: 0, completionTokens: 0 },
      model: 'error',
      contextQuality: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
