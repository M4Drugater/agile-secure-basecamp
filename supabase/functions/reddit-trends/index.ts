
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://jzvpgqtobzqbavsillqp.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const redditClientId = Deno.env.get('REDDIT_CLIENT_ID')!;
const redditClientSecret = Deno.env.get('REDDIT_CLIENT_SECRET')!;

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
  domain?: string;
  thumbnail?: string;
  post_hint?: string;
  is_video: boolean;
  over_18: boolean;
}

interface RedditResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

// Global variable to store access token and expiry
let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getRedditAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  console.log('Getting new Reddit access token...');
  
  const credentials = btoa(`${redditClientId}:${redditClientSecret}`);
  
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'LAIGENT:1.0 (by /u/laigent_app)',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get Reddit access token: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early
  
  console.log('Successfully obtained Reddit access token');
  return accessToken;
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

    // Get Reddit access token
    const token = await getRedditAccessToken();
    const allTrends: (RedditPost & { trend_score: number; engagement_rate: number })[] = [];

    // Fetch trends from each subreddit using authenticated Reddit API
    for (const subreddit of subreddits) {
      try {
        const redditUrl = `https://oauth.reddit.com/r/${subreddit}/${sortBy}?limit=${limit}&t=${timeframe}`;
        
        console.log(`Fetching from r/${subreddit} with authenticated API`);
        
        const response = await fetch(redditUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'LAIGENT:1.0 (by /u/laigent_app)',
            'Accept': 'application/json',
          },
        });

        console.log(`Response status for r/${subreddit}: ${response.status}`);

        if (!response.ok) {
          console.error(`Failed to fetch from r/${subreddit}: ${response.status} ${response.statusText}`);
          
          // Try to get a new token if we get a 401
          if (response.status === 401) {
            console.log('Token expired, getting new token...');
            accessToken = null; // Force token refresh
            const newToken = await getRedditAccessToken();
            
            const retryResponse = await fetch(redditUrl, {
              headers: {
                'Authorization': `Bearer ${newToken}`,
                'User-Agent': 'LAIGENT:1.0 (by /u/laigent_app)',
                'Accept': 'application/json',
              },
            });
            
            if (retryResponse.ok) {
              const retryData: RedditResponse = await retryResponse.json();
              const posts = retryData.data.children.map(child => ({
                ...child.data,
                subreddit,
                trend_score: calculateTrendScore(child.data),
                engagement_rate: child.data.num_comments / Math.max(child.data.score, 1)
              }));
              allTrends.push(...posts);
              console.log(`Successfully fetched ${posts.length} posts from r/${subreddit} after retry`);
            }
          }
          continue;
        }

        const data: RedditResponse = await response.json();
        
        if (!data.data || !data.data.children) {
          console.error(`Invalid data structure from r/${subreddit}`);
          continue;
        }

        const posts = data.data.children.map(child => ({
          ...child.data,
          subreddit,
          trend_score: calculateTrendScore(child.data),
          engagement_rate: child.data.num_comments / Math.max(child.data.score, 1)
        }));

        allTrends.push(...posts);
        console.log(`Successfully fetched ${posts.length} posts from r/${subreddit}`);
        
        // Add a small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`Error fetching r/${subreddit}:`, error);
      }
    }

    // Filter out NSFW content and low-quality posts
    const filteredTrends = allTrends.filter(post => 
      !post.over_18 && 
      post.score > 5 && 
      post.title.length > 10 &&
      !post.title.toLowerCase().includes('[removed]') &&
      !post.title.toLowerCase().includes('[deleted]')
    );

    // Sort by trend score and limit results
    const sortedTrends = filteredTrends
      .sort((a, b) => b.trend_score - a.trend_score)
      .slice(0, limit * 2) // Allow for more results when combining subreddits
      .map(post => ({
        ...post,
        // Ensure we have working Reddit links
        permalink: post.permalink.startsWith('/') ? post.permalink : post.permalink,
        url: post.url
      }));

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
            sortBy,
            success_rate: `${(sortedTrends.length / (subreddits.length * limit) * 100).toFixed(1)}%`,
            api_method: 'authenticated_reddit_api'
          }
        });
    } catch (logError) {
      console.error('Failed to log usage:', logError);
    }

    console.log('Reddit Trends Response:', { 
      userId: user.id, 
      trendsFound: sortedTrends.length,
      topTrendScore: sortedTrends[0]?.trend_score || 0,
      subredditsProcessed: subreddits.length
    });

    return new Response(JSON.stringify({ 
      trends: sortedTrends,
      metadata: {
        subreddits,
        timeframe,
        sortBy,
        total_results: sortedTrends.length,
        generated_at: new Date().toISOString(),
        success_rate: `${(sortedTrends.length / (subreddits.length * limit) * 100).toFixed(1)}%`,
        api_method: 'authenticated_reddit_api'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in reddit-trends function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'Failed to fetch Reddit trends. Please try again later.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateTrendScore(post: RedditPost): number {
  const hoursAge = (Date.now() / 1000 - post.created_utc) / 3600;
  const baseScore = Math.log(Math.max(post.score, 1)) * post.upvote_ratio;
  const commentMultiplier = Math.log(Math.max(post.num_comments, 1)) * 0.5;
  const timeDecay = Math.exp(-hoursAge / 12); // Faster decay for Reddit trends
  
  // Boost score for posts with external links (potential sources)
  const linkBoost = post.url && !post.url.includes('reddit.com') ? 1.2 : 1;
  
  return baseScore * (1 + commentMultiplier) * timeDecay * linkBoost;
}
