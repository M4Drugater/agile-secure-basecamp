
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

interface AILearningRequest {
  action: 'generate_recommendations' | 'analyze_difficulty' | 'generate_learning_path' | 'enhance_module_content';
  userId: string;
  learningPathId?: string;
  moduleId?: string;
  goals?: string[];
  skillLevel?: string;
  userContext?: any;
  context?: any;
}

// Token counting utility
function countTokens(text: string): number {
  const words = text.split(/\s+/).length;
  const chars = text.length;
  return Math.ceil(Math.max(words * 1.33, chars / 4));
}

async function getUserLearningContext(userId: string, learningPathId?: string) {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Get learning progress
    const { data: progress } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId);

    // Get completed modules
    const { data: completedModules } = await supabase
      .from('learning_progress')
      .select('learning_path_id, module_id, completion_date, score')
      .eq('user_id', userId)
      .eq('status', 'completed');

    // Get user's knowledge files
    const { data: knowledgeFiles } = await supabase
      .from('user_knowledge_files')
      .select('title, tags, summary')
      .eq('user_id', userId)
      .eq('processing_status', 'completed')
      .limit(5);

    return {
      profile,
      progress,
      completedModules,
      knowledgeFiles,
      learningPathId
    };
  } catch (error) {
    console.error('Error fetching user context:', error);
    return null;
  }
}

async function generateRecommendations(userId: string, learningPathId?: string, context?: any) {
  const userContext = await getUserLearningContext(userId, learningPathId);
  
  if (!userContext) {
    throw new Error('Unable to fetch user context');
  }

  const prompt = `
As an AI learning enhancement system, analyze the user's learning context and generate personalized recommendations.

User Context:
- Profile: ${JSON.stringify(userContext.profile, null, 2)}
- Learning Progress: ${JSON.stringify(userContext.progress, null, 2)}
- Completed Modules: ${JSON.stringify(userContext.completedModules, null, 2)}
- Knowledge Files: ${JSON.stringify(userContext.knowledgeFiles, null, 2)}
- Current Learning Path ID: ${learningPathId || 'None'}

Context Options:
- Include Personal Interests: ${context?.includePersonalInterests || false}
- Include Progress History: ${context?.includeProgressHistory || false}
- Include Skill Gaps: ${context?.includeSkillGaps || false}

Generate 3-5 personalized recommendations in the following JSON format:
{
  "recommendations": [
    {
      "id": "unique-id",
      "type": "learning_path|module|resource",
      "title": "Recommendation title",
      "description": "Brief description",
      "confidence": 0.85,
      "reasoning": "Why this is recommended",
      "metadata": {
        "tags": ["tag1", "tag2"],
        "difficulty": "beginner|intermediate|advanced|expert",
        "estimatedDuration": "2 hours"
      }
    }
  ]
}

Focus on:
1. Identifying skill gaps based on completed vs. missing modules
2. Recommending next logical steps in learning progression
3. Suggesting resources that match the user's interests and learning style
4. Providing adaptive recommendations based on performance patterns
`;

  return prompt;
}

async function analyzeDifficulty(userId: string, learningPathId: string, moduleId?: string) {
  const userContext = await getUserLearningContext(userId, learningPathId);
  
  if (!userContext) {
    throw new Error('Unable to fetch user context');
  }

  const prompt = `
As an AI learning enhancement system, analyze the user's performance and recommend difficulty adjustments.

User Context:
- Profile: ${JSON.stringify(userContext.profile, null, 2)}
- Learning Progress: ${JSON.stringify(userContext.progress, null, 2)}
- Completed Modules: ${JSON.stringify(userContext.completedModules, null, 2)}
- Target Learning Path ID: ${learningPathId}
- Target Module ID: ${moduleId || 'Entire path'}

Analyze performance patterns and recommend difficulty adjustments in this JSON format:
{
  "difficultyAnalysis": {
    "currentDifficulty": "beginner|intermediate|advanced|expert",
    "recommendedDifficulty": "beginner|intermediate|advanced|expert",
    "confidence": 0.85,
    "reasoning": "Detailed explanation of the recommendation",
    "adjustmentFactors": {
      "completionRate": 0.75,
      "timeSpent": 0.85,
      "assessmentScores": 0.70,
      "strugglingAreas": ["area1", "area2"]
    }
  }
}

Consider:
1. Completion rates vs. time spent
2. Assessment scores and patterns
3. Areas where the user struggles
4. Learning velocity compared to expectations
5. User's self-reported confidence levels
`;

  return prompt;
}

async function generateLearningPath(userId: string, goals: string[], skillLevel: string) {
  const userContext = await getUserLearningContext(userId);
  
  const prompt = `
As an AI learning path generator, create a comprehensive, personalized learning path.

User Context:
- Profile: ${JSON.stringify(userContext?.profile, null, 2)}
- Goals: ${goals.join(', ')}
- Skill Level: ${skillLevel}
- Previous Learning: ${JSON.stringify(userContext?.completedModules, null, 2)}

Generate a complete learning path in this JSON format:
{
  "learningPath": {
    "title": "Personalized Learning Path Title",
    "description": "Comprehensive description",
    "difficulty": "beginner|intermediate|advanced|expert",
    "estimatedDuration": "6 weeks",
    "learningObjectives": [
      "Objective 1",
      "Objective 2"
    ],
    "prerequisites": ["prereq1", "prereq2"],
    "tags": ["tag1", "tag2"],
    "modules": [
      {
        "title": "Module 1",
        "description": "Module description",
        "moduleType": "text|video|interactive|quiz|assignment|discussion",
        "estimatedDuration": "2 hours",
        "content": "Detailed content outline",
        "resources": []
      }
    ]
  }
}

Requirements:
1. Create 4-8 modules with logical progression
2. Match the user's skill level and goals
3. Include variety in module types
4. Provide realistic time estimates
5. Consider the user's learning history
`;

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

    const request: AILearningRequest = await req.json();

    if (!request.action || !request.userId) {
      return new Response(JSON.stringify({ error: 'Action and userId are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let prompt = '';
    
    switch (request.action) {
      case 'generate_recommendations':
        prompt = await generateRecommendations(request.userId, request.learningPathId, request.context);
        break;
      case 'analyze_difficulty':
        prompt = await analyzeDifficulty(request.userId, request.learningPathId!, request.moduleId);
        break;
      case 'generate_learning_path':
        prompt = await generateLearningPath(request.userId, request.goals!, request.skillLevel!);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    console.log('AI Learning Enhancement Request:', {
      userId: user.id,
      action: request.action,
      estimatedTokens: countTokens(prompt)
    });

    // Execute with cost control
    const result = await costMonitor.withCostControl(
      user.id,
      'gpt-4o-mini',
      'ai-learning-enhancement',
      prompt,
      async () => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are an expert AI learning enhancement system. Always respond with valid JSON in the exact format requested.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 2048,
            temperature: 0.7,
            response_format: { type: "json_object" }
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

        let parsedResponse;
        try {
          parsedResponse = JSON.parse(aiResponse);
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          throw new Error('Invalid JSON response from AI');
        }

        return {
          result: {
            ...parsedResponse,
            usage: {
              promptTokens: usage?.prompt_tokens || 0,
              completionTokens: usage?.completion_tokens || 0,
              totalTokens: usage?.total_tokens || 0,
            },
            model: 'gpt-4o-mini',
          },
          inputTokens: usage?.prompt_tokens || countTokens(prompt),
          outputTokens: usage?.completion_tokens || countTokens(aiResponse || ''),
        };
      }
    );

    console.log('AI Learning Enhancement Success:', {
      userId: user.id,
      action: request.action,
      inputTokens: result.usage.promptTokens,
      outputTokens: result.usage.completionTokens
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-learning-enhancement function:', error);
    
    // Return appropriate error response
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
      message: 'An error occurred while processing AI learning enhancement. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
