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

      const { data, error } = await supabase.functions.invoke('reddit-trends', {
        body: params
      });

      if (error) throw error;
      return data as { trends: RedditTrend[]; metadata: TrendsMetadata };
    },
    enabled: enabled && !!user && params.subreddits.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });

  const updateParams = (newParams: Partial<RedditTrendsParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const addSubreddit = (subreddit: string) => {
    if (!params.subreddits.includes(subreddit)) {
      setParams(prev => ({
        ...prev,
        subreddits: [...prev.subreddits, subreddit]
      }));
    }
  };

  const removeSubreddit = (subreddit: string) => {
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
