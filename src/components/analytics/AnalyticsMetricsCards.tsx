
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Heart, Share2, MessageSquare, TrendingUp, MousePointer } from 'lucide-react';
import { MetricsOverview } from '@/hooks/useContentAnalytics';

interface AnalyticsMetricsCardsProps {
  metrics?: MetricsOverview;
  isLoading: boolean;
}

export function AnalyticsMetricsCards({ metrics, isLoading }: AnalyticsMetricsCardsProps) {
  const metricCards = [
    {
      title: 'Total Views',
      value: metrics?.totalViews || 0,
      icon: Eye,
      color: 'text-blue-600',
    },
    {
      title: 'Total Likes',
      value: metrics?.totalLikes || 0,
      icon: Heart,
      color: 'text-red-600',
    },
    {
      title: 'Total Shares',
      value: metrics?.totalShares || 0,
      icon: Share2,
      color: 'text-green-600',
    },
    {
      title: 'Total Comments',
      value: metrics?.totalComments || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
    },
    {
      title: 'Avg Engagement Rate',
      value: `${(metrics?.avgEngagementRate || 0).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
    },
    {
      title: 'Avg CTR',
      value: `${(metrics?.avgClickThroughRate || 0).toFixed(1)}%`,
      icon: MousePointer,
      color: 'text-indigo-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metricCards.map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metricCards.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
