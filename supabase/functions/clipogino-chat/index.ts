
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { message, conversationId } = await req.json();
    
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

    console.log('CLIPOGINO Chat Request:', { userId: user.id, message: message.substring(0, 100) });

    // Build comprehensive knowledge context
    let knowledgeContext = '';

    try {
      // Get user profile for personalization
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        knowledgeContext += '\n=== USER PROFILE ===\n';
        knowledgeContext += `Name: ${profile.full_name || 'User'}\n`;
        knowledgeContext += `Position: ${profile.current_position || 'Not specified'}\n`;
        knowledgeContext += `Company: ${profile.company || 'Not specified'}\n`;
        knowledgeContext += `Industry: ${profile.industry || 'Not specified'}\n`;
        knowledgeContext += `Experience: ${profile.experience_level || 'Not specified'}`;
        if (profile.years_of_experience) knowledgeContext += ` (${profile.years_of_experience} years)`;
        knowledgeContext += `\n`;
        if (profile.current_skills?.length) {
          knowledgeContext += `Skills: ${profile.current_skills.join(', ')}\n`;
        }
        if (profile.career_goals?.length) {
          knowledgeContext += `Goals: ${profile.career_goals.join(', ')}\n`;
        }
        knowledgeContext += `Communication Style: ${profile.communication_style || 'adaptive'}\n`;
      }

      // Get personal knowledge files (including all uploaded documents)
      const { data: personalFiles } = await supabase
        .from('user_knowledge_files')
        .select('*')
        .eq('user_id', user.id)
        .eq('processing_status', 'completed')
        .order('updated_at', { ascending: false });

      if (personalFiles && personalFiles.length > 0) {
        // Search for relevant files
        const searchTerms = message.toLowerCase().split(' ').filter(term => term.length > 3);
        const relevantFiles = personalFiles.filter(file => 
          searchTerms.some(term => 
            file.title.toLowerCase().includes(term) ||
            file.content?.toLowerCase().includes(term) ||
            file.extracted_content?.toLowerCase().includes(term) ||
            file.ai_summary?.toLowerCase().includes(term) ||
            file.description?.toLowerCase().includes(term) ||
            file.tags?.some(tag => tag.toLowerCase().includes(term)) ||
            file.ai_key_points?.some(point => point.toLowerCase().includes(term))
          )
        ).slice(0, 5);

        if (relevantFiles.length > 0) {
          knowledgeContext += '\n=== RELEVANT PERSONAL KNOWLEDGE ===\n';
          relevantFiles.forEach(file => {
            knowledgeContext += `\n**${file.title}**\n`;
            if (file.ai_summary) {
              knowledgeContext += `Summary: ${file.ai_summary}\n`;
            }
            if (file.description) {
              knowledgeContext += `Description: ${file.description}\n`;
            }
            if (file.extracted_content) {
              knowledgeContext += `Content: ${file.extracted_content.substring(0, 1000)}...\n`;
            } else if (file.content) {
              knowledgeContext += `Content: ${file.content.substring(0, 1000)}...\n`;
            }
            if (file.ai_key_points?.length) {
              knowledgeContext += `Key Points: ${file.ai_key_points.join('; ')}\n`;
            }
            if (file.tags?.length) {
              knowledgeContext += `Tags: ${file.tags.join(', ')}\n`;
            }
            knowledgeContext += `Source: ${file.source_type || 'manual'} | File: ${file.original_file_name || 'manual entry'}\n`;
          });
        }

        // Also include context from recent uploads even if not directly relevant
        const recentUploads = personalFiles
          .filter(file => file.file_url && file.is_ai_processed)
          .filter(file => !relevantFiles.includes(file))
          .slice(0, 2);

        if (recentUploads.length > 0) {
          knowledgeContext += '\n=== RECENT UPLOADS CONTEXT ===\n';
          recentUploads.forEach(file => {
            knowledgeContext += `${file.title}: ${file.ai_summary || file.description || 'Uploaded document'}\n`;
          });
        }
      }

      // Get system knowledge
      const { data: systemKnowledge } = await supabase
        .from('system_knowledge_base')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .limit(10);

      if (systemKnowledge && systemKnowledge.length > 0) {
        const searchTerms = message.toLowerCase().split(' ').filter(term => term.length > 3);
        const relevantSystemDocs = systemKnowledge.filter(doc =>
          searchTerms.some(term =>
            doc.title.toLowerCase().includes(term) ||
            doc.content.toLowerCase().includes(term) ||
            doc.category.toLowerCase().includes(term) ||
            doc.tags?.some(tag => tag.toLowerCase().includes(term))
          )
        ).slice(0, 3);

        if (relevantSystemDocs.length > 0) {
          knowledgeContext += '\n=== RELEVANT SYSTEM KNOWLEDGE ===\n';
          relevantSystemDocs.forEach(doc => {
            knowledgeContext += `\n**${doc.title}** (${doc.category})\n`;
            knowledgeContext += `${doc.content.substring(0, 800)}...\n`;
            if (doc.tags?.length) {
              knowledgeContext += `Tags: ${doc.tags.join(', ')}\n`;
            }
          });
        }
      }

    } catch (contextError) {
      console.error('Error building knowledge context:', contextError);
      // Continue without context if there's an error
    }

    // Get conversation history
    let conversationHistory = [];
    if (conversationId) {
      try {
        const { data: messages } = await supabase
          .from('chat_messages')
          .select('role, content')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(10);

        if (messages) {
          conversationHistory = messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }));
        }
      } catch (historyError) {
        console.error('Error fetching conversation history:', historyError);
      }
    }

    // Build the system prompt with comprehensive context
    const systemPrompt = `You are CLIPOGINO, an advanced AI mentor specializing in professional development and career advancement. You provide personalized, actionable guidance based on the user's profile and knowledge base.

PERSONALITY & APPROACH:
- Professional yet approachable
- Data-driven and evidence-based
- Encouraging and supportive
- Focused on practical, actionable advice
- Adapt communication style to user preferences

PERSONALIZATION INSTRUCTIONS:
${knowledgeContext ? `
AVAILABLE CONTEXT:
${knowledgeContext}

Use this context to:
1. Personalize responses based on user's profile, experience, and goals
2. Reference relevant knowledge from their uploaded documents
3. Connect advice to their specific industry and role
4. Build upon previous conversations and shared materials
5. Provide examples relevant to their situation
` : 'No specific context available - provide general professional development guidance.'}

RESPONSE GUIDELINES:
- Always provide actionable advice
- Reference specific knowledge when relevant
- Ask clarifying questions when needed
- Suggest next steps and resources
- Be encouraging and supportive
- Maintain professional tone while being personable

Remember: You have access to the user's complete knowledge base including all uploaded documents. Use this information to provide highly personalized and relevant responses.`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-8), // Include recent conversation history
      { role: 'user', content: message }
    ];

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        reply: "I apologize, but the AI service is currently unavailable. Please contact support to configure the OpenAI API key."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 1000,
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
      try {
        await supabase.from('ai_usage_logs').insert({
          user_id: user.id,
          model_name: 'gpt-4o',
          function_name: 'clipogino-chat',
          input_tokens: usage.prompt_tokens,
          output_tokens: usage.completion_tokens,
          total_cost: (usage.prompt_tokens * 0.0025 + usage.completion_tokens * 0.01) / 1000,
          status: 'success'
        });
      } catch (logError) {
        console.error('Error logging usage:', logError);
      }
    }

    console.log('CLIPOGINO Response generated:', { 
      userId: user.id, 
      replyLength: reply.length,
      contextLength: knowledgeContext.length,
      hasPersonalFiles: knowledgeContext.includes('PERSONAL KNOWLEDGE'),
      hasSystemKnowledge: knowledgeContext.includes('SYSTEM KNOWLEDGE')
    });

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in clipogino-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'An error occurred while processing your request. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
