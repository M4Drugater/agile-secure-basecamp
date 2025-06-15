
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Use the new enhanced analytics function
    const { data, error } = await supabase.rpc('get_enhanced_research_analytics', {
      user_uuid: user.id
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({
        totalSessions: 0,
        totalSourcesFound: 0,
        averageEffectiveness: 0,
        topIndustries: [],
        creditsUsed: 0,
        timeSpent: 0,
        favoriteResearchTypes: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = data[0];
    const analytics = {
      totalSessions: result.total_sessions,
      totalSourcesFound: result.total_sources_found,
      averageEffectiveness: result.average_effectiveness,
      topIndustries: result.top_industries || [],
      creditsUsed: result.credits_used,
      timeSpent: result.time_spent_minutes,
      favoriteResearchTypes: result.favorite_research_types || []
    };

    return new Response(JSON.stringify(analytics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-research-analytics function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Analytics error',
      message: 'Failed to calculate research analytics.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
