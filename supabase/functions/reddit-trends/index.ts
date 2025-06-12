
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://jzvpgqtobzqbavsillqp.supabase.co';
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
  thumbnail?: string;
  post_hint?: string;
  domain?: string;
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

    const allTrends: (RedditPost & { trend_score: number; engagement_rate: number })[] = [];

    // Fetch trends from each subreddit with better error handling and User-Agent rotation
    for (const subreddit of subreddits) {
      try {
        const redditUrl = `https://www.reddit.com/r/${subreddit}/${sortBy}.json?limit=${limit}&t=${timeframe}`;
        
        // Use a more realistic User-Agent that mimics a browser
        const userAgents = [
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
        
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        
        console.log(`Fetching from r/${subreddit} with URL: ${redditUrl}`);
        
        const response = await fetch(redditUrl, {
          headers: {
            'User-Agent': randomUserAgent,
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
        });

        console.log(`Response status for r/${subreddit}: ${response.status}`);

        if (!response.ok) {
          console.error(`Failed to fetch from r/${subreddit}: ${response.status} ${response.statusText}`);
          
          // Try alternative approach with old.reddit.com
          if (response.status === 403 || response.status === 429) {
            console.log(`Trying old.reddit.com for r/${subreddit}`);
            const oldRedditUrl = `https://old.reddit.com/r/${subreddit}/${sortBy}.json?limit=${limit}&t=${timeframe}`;
            
            const oldResponse = await fetch(oldRedditUrl, {
              headers: {
                'User-Agent': randomUserAgent,
                'Accept': 'application/json',
              },
            });
            
            if (oldResponse.ok) {
              const oldData: RedditResponse = await oldResponse.json();
              const posts = oldData.data.children.map(child => ({
                ...child.data,
                subreddit,
                trend_score: calculateTrendScore(child.data),
                engagement_rate: child.data.num_comments / Math.max(child.data.score, 1)
              }));
              allTrends.push(...posts);
              console.log(`Successfully fetched ${posts.length} posts from old.reddit.com r/${subreddit}`);
            } else {
              console.error(`Old Reddit also failed for r/${subreddit}: ${oldResponse.status}`);
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
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
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
        permalink: post.permalink.startsWith('/') ? `https://reddit.com${post.permalink}` : post.permalink,
        url: post.url.startsWith('/') ? `https://reddit.com${post.url}` : post.url
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
            success_rate: `${(sortedTrends.length / (subreddits.length * limit) * 100).toFixed(1)}%`
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
        success_rate: `${(sortedTrends.length / (subreddits.length * limit) * 100).toFixed(1)}%`
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
