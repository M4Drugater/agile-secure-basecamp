
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

// Cache for Reddit data to reduce API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchFromPublicRedditAPI(subreddit: string, sortBy: string, timeframe: string, limit: number): Promise<RedditPost[]> {
  const cacheKey = `${subreddit}-${sortBy}-${timeframe}-${limit}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log(`Using cached data for r/${subreddit}`);
    return cached.data;
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Use public Reddit JSON API
      let url = `https://www.reddit.com/r/${subreddit}/${sortBy}.json?limit=${limit}`;
      
      // Add time parameter for 'top' sorting
      if (sortBy === 'top') {
        url += `&t=${timeframe}`;
      }

      console.log(`Attempt ${attempt}: Fetching from ${url}`);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'LAIGENT-TrendsDiscovery/1.0 (Web Application for Business Insights)',
          'Accept': 'application/json',
        },
      });

      console.log(`Response status for r/${subreddit}: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: RedditResponse = await response.json();
      
      if (!data?.data?.children) {
        throw new Error('Invalid response structure from Reddit API');
      }

      const posts = data.data.children.map(child => ({
        ...child.data,
        subreddit: subreddit // Ensure subreddit is set correctly
      }));

      // Cache the successful result
      cache.set(cacheKey, { data: posts, timestamp: Date.now() });
      
      console.log(`Successfully fetched ${posts.length} posts from r/${subreddit}`);
      return posts;

    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed for r/${subreddit}:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff: wait 1s, then 2s, then 4s
        const waitTime = Math.pow(2, attempt - 1) * 1000;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error(`All ${maxRetries} attempts failed for r/${subreddit}:`, lastError);
  return []; // Return empty array instead of throwing to avoid breaking the entire request
}

function validateAndCleanPost(post: RedditPost): boolean {
  // Data validation rules
  if (!post.id || !post.title || typeof post.score !== 'number') {
    return false;
  }
  
  // Filter out removed/deleted posts
  if (post.title.toLowerCase().includes('[removed]') || 
      post.title.toLowerCase().includes('[deleted]') ||
      post.author === '[deleted]') {
    return false;
  }
  
  // Filter out NSFW content
  if (post.over_18) {
    return false;
  }
  
  // Filter out very low quality posts
  if (post.score < 1 || post.title.length < 5) {
    return false;
  }
  
  return true;
}

function calculateTrendScore(post: RedditPost): number {
  const hoursAge = (Date.now() / 1000 - post.created_utc) / 3600;
  
  // Base score calculation with logarithmic scaling
  const baseScore = Math.log(Math.max(post.score, 1)) * Math.max(post.upvote_ratio, 0.5);
  
  // Comment engagement multiplier
  const commentMultiplier = Math.log(Math.max(post.num_comments, 1)) * 0.3;
  
  // Time decay factor - newer posts get higher scores
  const timeDecay = Math.exp(-hoursAge / 24); // Slower decay than before
  
  // Boost for posts with external links (potential news/sources)
  const linkBoost = post.url && !post.url.includes('reddit.com') && !post.url.includes('i.redd.it') ? 1.3 : 1;
  
  // Boost for posts with good engagement ratios
  const engagementBoost = post.num_comments > 0 && post.score > 0 ? 
    Math.min(post.num_comments / post.score, 0.5) + 1 : 1;
  
  const trendScore = baseScore * (1 + commentMultiplier) * timeDecay * linkBoost * engagementBoost;
  
  return Math.max(0, trendScore);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { subreddits, timeframe = 'day', limit = 25, sortBy = 'hot' } = requestBody;
    
    console.log('Reddit Trends Request:', { 
      subreddits,
      timeframe,
      sortBy,
      limit,
      timestamp: new Date().toISOString()
    });

    // Validate input parameters
    if (!subreddits || !Array.isArray(subreddits) || subreddits.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request',
        message: 'Subreddits array is required and must not be empty' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate subreddit names (basic check)
    const invalidSubreddits = subreddits.filter(sub => 
      !sub || typeof sub !== 'string' || sub.length < 1 || sub.length > 50
    );
    
    if (invalidSubreddits.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Invalid subreddit names',
        message: `Invalid subreddits: ${invalidSubreddits.join(', ')}` 
      }), {
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

    // Fetch trends from all subreddits concurrently
    const fetchPromises = subreddits.map(subreddit => 
      fetchFromPublicRedditAPI(subreddit.toLowerCase().trim(), sortBy, timeframe, limit)
    );

    console.log(`Starting concurrent fetch for ${subreddits.length} subreddits...`);
    const allResults = await Promise.allSettled(fetchPromises);
    
    // Collect all successful results
    const allTrends: (RedditPost & { trend_score: number; engagement_rate: number })[] = [];
    let successfulFetches = 0;
    
    allResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        const posts = result.value
          .filter(validateAndCleanPost)
          .map(post => ({
            ...post,
            trend_score: calculateTrendScore(post),
            engagement_rate: post.num_comments / Math.max(post.score, 1)
          }));
        
        allTrends.push(...posts);
        successfulFetches++;
        console.log(`Successfully processed ${posts.length} posts from r/${subreddits[index]}`);
      } else {
        console.error(`Failed to fetch from r/${subreddits[index]}:`, 
          result.status === 'rejected' ? result.reason : 'Empty result');
      }
    });

    // Sort by trend score and limit results
    const sortedTrends = allTrends
      .sort((a, b) => b.trend_score - a.trend_score)
      .slice(0, Math.min(limit * 2, 100)) // Cap at 100 total results
      .map(post => ({
        ...post,
        // Ensure proper URL formatting
        permalink: post.permalink.startsWith('http') ? post.permalink : `https://reddit.com${post.permalink}`,
        url: post.url || `https://reddit.com${post.permalink}`
      }));

    const successRate = (successfulFetches / subreddits.length * 100).toFixed(1);

    // Log usage to audit table
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
            success_rate: `${successRate}%`,
            api_method: 'public_reddit_json_api',
            successful_subreddits: successfulFetches,
            total_subreddits: subreddits.length,
            cache_hits: Array.from(cache.keys()).length
          }
        });
    } catch (logError) {
      console.error('Failed to log usage:', logError);
      // Don't fail the request for logging errors
    }

    const responseData = {
      trends: sortedTrends,
      metadata: {
        subreddits,
        timeframe,
        sortBy,
        total_results: sortedTrends.length,
        generated_at: new Date().toISOString(),
        success_rate: `${successRate}%`,
        api_method: 'public_reddit_json_api',
        successful_subreddits: successfulFetches,
        cache_enabled: true,
        data_quality: 'filtered_and_validated'
      }
    };

    console.log('Reddit Trends Response Summary:', { 
      userId: user.id, 
      trendsFound: sortedTrends.length,
      topTrendScore: sortedTrends[0]?.trend_score || 0,
      successRate: `${successRate}%`,
      subredditsProcessed: `${successfulFetches}/${subreddits.length}`
    });

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error in reddit-trends function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'Failed to fetch Reddit trends. Please try again later.',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
