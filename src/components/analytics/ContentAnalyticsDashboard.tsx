
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useContentAnalytics } from '@/hooks/useContentAnalytics';
import { AnalyticsMetricsCards } from './AnalyticsMetricsCards';
import { EngagementChart } from './EngagementChart';
import { PlatformPerformanceChart } from './PlatformPerformanceChart';
import { TopPerformingContent } from './TopPerformingContent';
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { format, subDays } from 'date-fns';

export function ContentAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  
  const startDate = subDays(new Date(), parseInt(timeRange));
  const { 
    analytics, 
    metricsOverview, 
    platformStats, 
    topContent, 
    isLoading 
  } = useContentAnalytics(startDate, selectedPlatform);

  const timeRangeOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' },
  ];

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'blog', label: 'Blog' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Content Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your content performance across platforms
          </p>
        </div>
        
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {platforms.map(platform => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Metrics */}
      <AnalyticsMetricsCards 
        metrics={metricsOverview} 
        isLoading={isLoading} 
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementChart 
          data={analytics} 
          timeRange={timeRange}
          isLoading={isLoading} 
        />
        <PlatformPerformanceChart 
          data={platformStats} 
          isLoading={isLoading} 
        />
      </div>

      {/* Top Performing Content */}
      <TopPerformingContent 
        content={topContent} 
        isLoading={isLoading} 
      />

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analytics Summary
          </CardTitle>
          <CardDescription>
            Period: {format(startDate, 'MMM d, yyyy')} - {format(new Date(), 'MMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Content</div>
              <div className="text-2xl font-bold">{analytics.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg Engagement Rate</div>
              <div className="text-2xl font-bold">
                {metricsOverview?.avgEngagementRate?.toFixed(1) || 0}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Best Platform</div>
              <div className="text-lg font-semibold">
                <Badge variant="secondary">
                  {platformStats[0]?.platform || 'N/A'}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Active Platforms</div>
              <div className="text-2xl font-bold">{platformStats.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
