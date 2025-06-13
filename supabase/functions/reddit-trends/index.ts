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

// Enhanced cache for Reddit data and access tokens
const cache = new Map<string, { data: any; timestamp: number }>();
const tokenCache = new Map<string, { token: string; expires: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const TOKEN_CACHE_DURATION = 3600 * 1000; // 1 hour

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100;
const RATE_LIMIT_WINDOW = 60 * 1000;

async function getRedditAccessToken(): Promise<string> {
  const cacheKey = 'reddit_access_token';
  const cached = tokenCache.get(cacheKey);
  
  if (cached && Date.now() < cached.expires) {
    console.log('Using cached Reddit access token');
    return cached.token;
  }

  try {
    console.log('Requesting new Reddit access token...');
    console.log(`Client ID exists: ${!!redditClientId}`);
    console.log(`Client Secret exists: ${!!redditClientSecret}`);
    console.log(`Client ID length: ${redditClientId?.length || 0}`);
    
    if (!redditClientId || !redditClientSecret) {
      throw new Error('Reddit credentials not found in environment variables');
    }
    
    const credentials = btoa(`${redditClientId}:${redditClientSecret}`);
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'LAIGENT-TrendsDiscovery/1.0 (Web Application for Business Insights)',
      },
      body: 'grant_type=client_credentials',
    });

    console.log(`Reddit OAuth response status: ${response.status}`);
    const responseText = await response.text();
    console.log(`Reddit OAuth response: ${responseText.substring(0, 200)}`);

    if (!response.ok) {
      throw new Error(`Reddit OAuth failed: ${response.status} ${response.statusText} - ${responseText}`);
    }

    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Failed to parse Reddit OAuth response: ${parseError.message}`);
    }
    
    if (!tokenData.access_token) {
      throw new Error(`No access token received from Reddit. Response: ${JSON.stringify(tokenData)}`);
    }

    console.log('Successfully obtained Reddit access token');
    console.log(`Token type: ${tokenData.token_type}, expires in: ${tokenData.expires_in} seconds`);
    
    // Cache the token
    const expiresAt = Date.now() + (tokenData.expires_in * 1000) - 60000;
    tokenCache.set(cacheKey, {
      token: tokenData.access_token,
      expires: expiresAt
    });

    return tokenData.access_token;
  } catch (error) {
    console.error('Failed to get Reddit access token:', error);
    console.error('Error details:', {
      message: error.message,
      clientIdPresent: !!redditClientId,
      clientSecretPresent: !!redditClientSecret,
      clientIdPrefix: redditClientId ? redditClientId.substring(0, 4) + '...' : 'not found'
    });
    throw new Error(`Reddit authentication failed: ${error.message}`);
  }
}

function checkRateLimit(): boolean {
  const now = Date.now();
  const key = 'reddit_api';
  const current = rateLimitMap.get(key) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > current.resetTime) {
    current.count = 0;
    current.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  if (current.count >= RATE_LIMIT) {
    return false;
  }
  
  current.count++;
  rateLimitMap.set(key, current);
  return true;
}

async function fetchFromRedditAPI(subreddit: string, sortBy: string, timeframe: string, limit: number): Promise<RedditPost[]> {
  const cacheKey = `${subreddit}-${sortBy}-${timeframe}-${limit}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log(`Using cached data for r/${subreddit}`);
    return cached.data;
  }

  // Check rate limit
  if (!checkRateLimit()) {
    console.warn('Rate limit exceeded, using cached data if available');
    return cached?.data || [];
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const accessToken = await getRedditAccessToken();
      
      let url = `https://oauth.reddit.com/r/${subreddit}/${sortBy}?limit=${limit}`;
      
      if (sortBy === 'top') {
        url += `&t=${timeframe}`;
      }

      console.log(`Attempt ${attempt}: Fetching from ${url}`);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'LAIGENT-TrendsDiscovery/1.0 (Web Application for Business Insights)',
          'Accept': 'application/json',
        },
      });

      console.log(`Response status for r/${subreddit}: ${response.status}`);
      const responseText = await response.text();
      console.log(`Response headers: ${JSON.stringify([...response.headers.entries()])}`);

      if (response.status === 401) {
        console.log('Token expired, clearing cache...');
        tokenCache.delete('reddit_access_token');
        if (attempt < maxRetries) {
          console.log('Will retry with new token...');
          continue;
        }
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
        console.log(`Rate limited, waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        console.error(`HTTP error for r/${subreddit}: ${response.status} ${response.statusText}`);
        console.error(`Response body: ${responseText.substring(0, 500)}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${responseText.substring(0, 200)}`);
      }

      let data: RedditResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(`Failed to parse JSON response for r/${subreddit}:`, parseError);
        console.error(`Response text: ${responseText.substring(0, 500)}`);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }
      
      if (!data?.data?.children) {
        console.error(`Invalid response structure for r/${subreddit}:`, data);
        throw new Error('Invalid response structure from Reddit API');
      }

      const posts = data.data.children.map(child => ({
        ...child.data,
        subreddit: subreddit
      }));

      cache.set(cacheKey, { data: posts, timestamp: Date.now() });
      
      console.log(`Successfully fetched ${posts.length} posts from r/${subreddit}`);
      return posts;

    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed for r/${subreddit}:`, {
        error: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      });
      
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt - 1) * 1000;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error(`All ${maxRetries} attempts failed for r/${subreddit}:`, lastError?.message);
  
  const fallbackData = cache.get(cacheKey);
  if (fallbackData) {
    console.log(`Using stale cached data for r/${subreddit}`);
    return fallbackData.data;
  }
  
  return [];
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
      timestamp: new Date().toISOString(),
      credentialsCheck: {
        clientId: !!redditClientId,
        clientSecret: !!redditClientSecret,
        clientIdLength: redditClientId?.length || 0
      }
    });

    // Validate Reddit credentials with detailed logging
    if (!redditClientId || !redditClientSecret) {
      console.error('Reddit credentials missing:', {
        clientId: !!redditClientId,
        clientSecret: !!redditClientSecret,
        envVars: Object.keys(Deno.env.toObject()).filter(key => key.includes('REDDIT'))
      });
      
      return new Response(JSON.stringify({ 
        error: 'Reddit API credentials not configured',
        message: 'Please configure REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in Supabase secrets',
        debug: {
          clientIdPresent: !!redditClientId,
          clientSecretPresent: !!redditClientSecret,
          availableEnvVars: Object.keys(Deno.env.toObject()).filter(key => key.includes('REDDIT'))
        }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    // Test Reddit API connection first
    console.log('Testing Reddit API connection...');
    try {
      const testToken = await getRedditAccessToken();
      console.log('Reddit API connection test successful');
    } catch (testError) {
      console.error('Reddit API connection test failed:', testError);
      return new Response(JSON.stringify({ 
        error: 'Reddit API connection failed',
        message: 'Unable to authenticate with Reddit API. Please check your credentials.',
        debug: {
          error: testError.message,
          credentials: {
            clientIdPresent: !!redditClientId,
            clientSecretPresent: !!redditClientSecret,
            clientIdPrefix: redditClientId ? redditClientId.substring(0, 4) + '...' : 'missing'
          }
        }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch trends from all subreddits concurrently
    const fetchPromises = subreddits.map(subreddit => 
      fetchFromRedditAPI(subreddit.toLowerCase().trim(), sortBy, timeframe, limit)
    );

    console.log(`Starting concurrent fetch for ${subreddits.length} subreddits using Reddit OAuth API...`);
    const allResults = await Promise.allSettled(fetchPromises);
    
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
          result.status === 'rejected' ? result.reason?.message : 'Empty result');
      }
    });

    const sortedTrends = allTrends
      .sort((a, b) => b.trend_score - a.trend_score)
      .slice(0, Math.min(limit * 2, 100))
      .map(post => ({
        ...post,
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
            api_method: 'reddit_oauth_api',
            successful_subreddits: successfulFetches,
            total_subreddits: subreddits.length,
            cache_hits: Array.from(cache.keys()).length,
            rate_limited: !checkRateLimit()
          }
        });
    } catch (logError) {
      console.error('Failed to log usage:', logError);
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
        api_method: 'reddit_oauth_api',
        successful_subreddits: successfulFetches,
        cache_enabled: true,
        data_quality: 'filtered_and_validated',
        rate_limit_status: checkRateLimit() ? 'ok' : 'limited'
      }
    };

    console.log('Reddit Trends Response Summary:', { 
      userId: user.id, 
      trendsFound: sortedTrends.length,
      topTrendScore: sortedTrends[0]?.trend_score || 0,
      successRate: `${successRate}%`,
      subredditsProcessed: `${successfulFetches}/${subreddits.length}`,
      apiMethod: 'reddit_oauth_api'
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
