
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  score: number;
  num_comments: number;
  created_utc: number;
  subreddit: string;
  author: string;
  url: string;
  permalink: string;
  upvote_ratio: number;
}

interface RedditResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subreddits, timeframe = 'day', limit = 25, sortBy = 'hot' } = await req.json();
    
    if (!subreddits || !Array.isArray(subreddits) || subreddits.length === 0) {
      return new Response(JSON.stringify({ error: 'Subreddits array is required' }), {
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

    console.log('Reddit Trends Request:', { 
      userId: user.id, 
      subreddits,
      timeframe,
      sortBy,
      limit
    });

    const allTrends: RedditPost[] = [];

    // Fetch trends from each subreddit
    for (const subreddit of subreddits) {
      try {
        const redditUrl = `https://www.reddit.com/r/${subreddit}/${sortBy}.json?limit=${limit}&t=${timeframe}`;
        
        const response = await fetch(redditUrl, {
          headers: {
            'User-Agent': 'LAIGENT-TrendsBot/1.0 (Reddit Trends Discovery)',
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch from r/${subreddit}:`, response.status);
          continue;
        }

        const data: RedditResponse = await response.json();
        
        const posts = data.data.children.map(child => ({
          ...child.data,
          subreddit,
          trend_score: calculateTrendScore(child.data),
          engagement_rate: child.data.num_comments / Math.max(child.data.score, 1)
        }));

        allTrends.push(...posts);
      } catch (error) {
        console.error(`Error fetching r/${subreddit}:`, error);
      }
    }

    // Sort by trend score and limit results
    const sortedTrends = allTrends
      .sort((a, b) => (b as any).trend_score - (a as any).trend_score)
      .slice(0, limit * 2); // Allow for more results when combining subreddits

    // Log usage
    try {
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: 'reddit_trends_discovery',
          resource_type: 'trends',
          details: {
            subreddits,
            results_count: sortedTrends.length,
            timeframe,
            sortBy
          }
        });
    } catch (logError) {
      console.error('Failed to log usage:', logError);
    }

    console.log('Reddit Trends Response:', { 
      userId: user.id, 
      trendsFound: sortedTrends.length,
      topTrendScore: sortedTrends[0]?.trend_score || 0
    });

    return new Response(JSON.stringify({ 
      trends: sortedTrends,
      metadata: {
        subreddits,
        timeframe,
        sortBy,
        total_results: sortedTrends.length,
        generated_at: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in reddit-trends function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'Failed to fetch Reddit trends. Please try again later.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateTrendScore(post: RedditPost): number {
  const hoursAge = (Date.now() / 1000 - post.created_utc) / 3600;
  const baseScore = post.score * post.upvote_ratio;
  const commentMultiplier = Math.log(Math.max(post.num_comments, 1));
  const timeDecay = Math.exp(-hoursAge / 24); // Decay over 24 hours
  
  return baseScore * commentMultiplier * timeDecay;
}
