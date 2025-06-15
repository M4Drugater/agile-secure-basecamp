
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { ElitePromptSystem } from './elite-prompt-system.ts';
import { EnhancedContextBuilder } from './enhanced-context-builder.ts';
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
    const { message, context, conversationHistory, model = 'gpt-4o', currentPage = '/chat' } = await req.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user authentication
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
      currentPage,
      timestamp: new Date().toISOString()
    });

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        response: "I apologize, but my AI services are temporarily unavailable. As your strategic advisor, I recommend contacting support to configure the OpenAI API for our continued collaboration.",
        usage: { totalTokens: 0, promptTokens: 0, completionTokens: 0 },
        model: model,
        contextQuality: 'service-unavailable'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build comprehensive user context
    const contextBuilder = new EnhancedContextBuilder();
    const userContext = await contextBuilder.buildUserContext(user.id, currentPage);

    // Generate elite system prompt
    const elitePromptSystem = new ElitePromptSystem();
    const eliteSystemPrompt = elitePromptSystem.buildEliteSystemPrompt(userContext);

    // Prepare enhanced messages with elite prompt and conversation context
    const messages = [
      { role: 'system', content: eliteSystemPrompt },
      ...(conversationHistory || []).slice(-10), // Include more context for continuity
      { role: 'user', content: message }
    ];

    // Optimized model configuration for elite performance
    const getOptimizedConfig = (model: string) => {
      const configs = {
        'gpt-4o': {
          model: 'gpt-4o',
          max_tokens: 3000,
          temperature: 0.8, // Higher creativity for strategic thinking
          top_p: 0.95,
          frequency_penalty: 0.2,
          presence_penalty: 0.3
        },
        'gpt-4o-mini': {
          model: 'gpt-4o-mini',
          max_tokens: 2500,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.2
        }
      };
      return configs[model] || configs['gpt-4o-mini'];
    };

    const modelConfig = getOptimizedConfig(model);
    const startTime = Date.now();

    // Enhanced OpenAI API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...modelConfig,
        messages: messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    const processingTime = Date.now() - startTime;

    // Enhanced usage tracking
    const usage = data.usage;
    if (usage) {
      const usageLogger = new UsageLogger();
      await usageLogger.logUsage(user.id, model, usage, {
        currentPage,
        contextQuality: 'elite',
        personalFilesCount: userContext.knowledge.personal_files_count,
        processingTime,
        responseLength: reply.length,
        promptVersion: 'elite-v2'
      });
    }

    console.log('Elite CLIPOGINO Response Success:', { 
      userId: user.id, 
      replyLength: reply.length,
      contextQuality: 'elite',
      personalFilesCount: userContext.knowledge.personal_files_count,
      systemKnowledgeCount: userContext.knowledge.system_knowledge_count,
      experienceLevel: userContext.profile.experience_level,
      currentPage: userContext.session.current_page,
      model: model,
      processingTime: `${processingTime}ms`,
      tokensUsed: usage?.total_tokens || 0
    });

    return new Response(JSON.stringify({ 
      response: reply,
      usage: {
        totalTokens: usage?.total_tokens || 0,
        promptTokens: usage?.prompt_tokens || 0,
        completionTokens: usage?.completion_tokens || 0
      },
      model: model,
      contextQuality: 'elite-enhanced',
      processingTime,
      userContext: {
        experienceLevel: userContext.profile.experience_level,
        knowledgeAssets: userContext.knowledge.personal_files_count,
        industryFocus: userContext.profile.industry,
        managementLevel: userContext.profile.management_level,
        conversationCount: userContext.activity.conversation_count
      },
      metadata: {
        promptVersion: 'elite-v2',
        contextBuilder: 'enhanced',
        strategicAdvisoryLevel: 'fortune-500'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in elite clipogino-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Strategic advisory system error',
      response: 'I encountered a temporary disruption while accessing my strategic frameworks. Please try again, and I will provide you with the executive-level guidance you need for your strategic decisions.',
      usage: { totalTokens: 0, promptTokens: 0, completionTokens: 0 },
      model: 'error',
      contextQuality: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
