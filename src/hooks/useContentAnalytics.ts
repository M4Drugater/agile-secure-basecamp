
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ContentAnalytic {
  id: string;
  content_item_id: string;
  platform: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagement_rate: number;
  click_through_rate: number;
  recorded_at: string;
  content_item: {
    title: string;
    content_type: string;
    published_at: string;
  };
}

export interface MetricsOverview {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  avgEngagementRate: number;
  avgClickThroughRate: number;
}

export interface PlatformStats {
  platform: string;
  totalViews: number;
  totalEngagements: number;
  avgEngagementRate: number;
  contentCount: number;
}

export function useContentAnalytics(startDate: Date, platform: string = 'all') {
  const { user } = useAuth();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['content-analytics', startDate.toISOString(), platform],
    queryFn: async () => {
      // Return empty array for now since table may not exist
      return [] as ContentAnalytic[];
    },
    enabled: !!user,
  });

  // Calculate metrics overview
  const metricsOverview: MetricsOverview | undefined = analytics ? {
    totalViews: analytics.reduce((sum, item) => sum + (item.views || 0), 0),
    totalLikes: analytics.reduce((sum, item) => sum + (item.likes || 0), 0),
    totalShares: analytics.reduce((sum, item) => sum + (item.shares || 0), 0),
    totalComments: analytics.reduce((sum, item) => sum + (item.comments || 0), 0),
    avgEngagementRate: analytics.length > 0 
      ? analytics.reduce((sum, item) => sum + (item.engagement_rate || 0), 0) / analytics.length 
      : 0,
    avgClickThroughRate: analytics.length > 0 
      ? analytics.reduce((sum, item) => sum + (item.click_through_rate || 0), 0) / analytics.length 
      : 0,
  } : undefined;

  // Calculate platform stats
  const platformStats: PlatformStats[] = analytics ? 
    Object.values(
      analytics.reduce((acc, item) => {
        const platform = item.platform;
        if (!acc[platform]) {
          acc[platform] = {
            platform,
            totalViews: 0,
            totalEngagements: 0,
            avgEngagementRate: 0,
            contentCount: 0,
          };
        }
        
        acc[platform].totalViews += item.views || 0;
        acc[platform].totalEngagements += (item.likes || 0) + (item.shares || 0) + (item.comments || 0);
        acc[platform].contentCount += 1;
        
        return acc;
      }, {} as Record<string, PlatformStats>)
    ).map(stat => ({
      ...stat,
      avgEngagementRate: stat.totalViews > 0 ? (stat.totalEngagements / stat.totalViews) * 100 : 0
    })).sort((a, b) => b.totalViews - a.totalViews)
    : [];

  // Get top performing content
  const topContent = analytics ? 
    [...analytics]
      .sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0))
      .slice(0, 10)
    : [];

  return {
    analytics: analytics || [],
    metricsOverview,
    platformStats,
    topContent,
    isLoading,
  };
}
