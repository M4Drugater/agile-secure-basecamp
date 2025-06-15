
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RedditTrend {
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
  trend_score: number;
  engagement_rate: number;
  domain?: string;
}

export interface TrendsMetadata {
  subreddits: string[];
  timeframe: string;
  sortBy: string;
  total_results: number;
  generated_at: string;
  success_rate: string;
  api_method: string;
  successful_subreddits: number;
  cache_enabled: boolean;
  data_quality: string;
  rate_limit_status?: string;
}

interface RedditTrendsParams {
  subreddits: string[];
  timeframe: 'hour' | 'day' | 'week' | 'month' | 'year';
  limit: number;
  sortBy: 'hot' | 'new' | 'top' | 'rising';
}

export function useRedditTrends(enabled: boolean = true) {
  const { user } = useAuth();
  const [params, setParams] = useState<RedditTrendsParams>({
    subreddits: ['entrepreneur', 'business', 'marketing', 'startups'],
    timeframe: 'day',
    limit: 25,
    sortBy: 'hot'
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reddit-trends', params],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching Reddit trends with params:', params);

      const { data, error } = await supabase.functions.invoke('reddit-trends', {
        body: params
      });

      if (error) {
        console.error('Reddit trends error:', error);
        
        // Handle specific error types
        if (error.message?.includes('credentials') || error.message?.includes('REDDIT_CLIENT')) {
          throw new Error('Reddit API credentials not configured. Please contact your administrator to set up REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET.');
        } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          throw new Error('Reddit API authentication failed. Please verify the API credentials are correct.');
        } else if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          throw new Error('Reddit API rate limit exceeded. Please try again in a few minutes.');
        } else {
          throw new Error(error.message || 'Failed to fetch Reddit trends');
        }
      }

      if (!data) {
        throw new Error('No data returned from Reddit trends API');
      }

      console.log('Reddit trends response:', {
        trendsCount: data.trends?.length || 0,
        metadata: data.metadata,
        apiMethod: data.metadata?.api_method
      });

      return data as { trends: RedditTrend[]; metadata: TrendsMetadata };
    },
    enabled: enabled && !!user && params.subreddits.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      console.log(`Query retry attempt ${failureCount}:`, error);
      
      // Don't retry on credential errors
      if (error.message?.includes('credentials') || error.message?.includes('REDDIT_CLIENT')) {
        return false;
      }
      
      // Don't retry on authentication errors after first attempt
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        return failureCount < 1;
      }
      
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const updateParams = (newParams: Partial<RedditTrendsParams>) => {
    console.log('Updating Reddit trends params:', newParams);
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const addSubreddit = (subreddit: string) => {
    const cleanSubreddit = subreddit.trim().toLowerCase();
    if (cleanSubreddit && !params.subreddits.includes(cleanSubreddit)) {
      console.log('Adding subreddit:', cleanSubreddit);
      setParams(prev => ({
        ...prev,
        subreddits: [...prev.subreddits, cleanSubreddit]
      }));
    }
  };

  const removeSubreddit = (subreddit: string) => {
    console.log('Removing subreddit:', subreddit);
    setParams(prev => ({
      ...prev,
      subreddits: prev.subreddits.filter(s => s !== subreddit)
    }));
  };

  return {
    trends: data?.trends || [],
    metadata: data?.metadata,
    isLoading,
    error,
    refetch,
    params,
    updateParams,
    addSubreddit,
    removeSubreddit,
  };
}
