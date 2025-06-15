
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

    const { userId } = await req.json();

    // Get research sessions
    const { data: sessions, error } = await supabase
      .from('research_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate analytics
    const analytics = {
      totalSessions: sessions.length,
      totalSourcesFound: sessions.reduce((sum, s) => sum + (s.sources?.length || 0), 0),
      averageEffectiveness: sessions.length > 0 ? 
        Math.round(sessions.reduce((sum, s) => sum + (s.effectiveness || 75), 0) / sessions.length) : 0,
      topIndustries: calculateTopIndustries(sessions),
      creditsUsed: sessions.reduce((sum, s) => sum + (s.credits_used || 0), 0),
      timeSpent: sessions.reduce((sum, s) => sum + (s.metadata?.processingTime || 60000), 0) / 1000 / 60, // Convert to minutes
      favoriteResearchTypes: calculateFavoriteResearchTypes(sessions)
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

function calculateTopIndustries(sessions: any[]): Array<{ industry: string; count: number }> {
  const industryCount: Record<string, number> = {};
  
  sessions.forEach(session => {
    if (session.industry) {
      industryCount[session.industry] = (industryCount[session.industry] || 0) + 1;
    }
  });
  
  return Object.entries(industryCount)
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function calculateFavoriteResearchTypes(sessions: any[]): Array<{ type: string; count: number }> {
  const typeCount: Record<string, number> = {};
  
  sessions.forEach(session => {
    if (session.research_type) {
      typeCount[session.research_type] = (typeCount[session.research_type] || 0) + 1;
    }
  });
  
  return Object.entries(typeCount)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}
