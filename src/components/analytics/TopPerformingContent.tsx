
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentAnalytic } from '@/hooks/useContentAnalytics';
import { Trophy, Eye, Heart, Share2, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TopPerformingContentProps {
  content: ContentAnalytic[];
  isLoading: boolean;
}

export function TopPerformingContent({ content, isLoading }: TopPerformingContentProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!content.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Top Performing Content
          </CardTitle>
          <CardDescription>No content analytics available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Start tracking your content performance by adding analytics data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top Performing Content
        </CardTitle>
        <CardDescription>
          Content ranked by engagement rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {content.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={index < 3 ? 'default' : 'secondary'}>
                    #{index + 1}
                  </Badge>
                  <h4 className="font-semibold line-clamp-1">
                    {item.content_item.title}
                  </h4>
                  <Badge variant="outline">
                    {item.content_item.content_type}
                  </Badge>
                  <Badge variant="outline">
                    {item.platform}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.views?.toLocaleString() || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {item.likes?.toLocaleString() || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-3 w-3" />
                    {item.shares?.toLocaleString() || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {item.comments?.toLocaleString() || 0}
                  </div>
                  <div className="text-xs">
                    {format(parseISO(item.recorded_at), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {(item.engagement_rate || 0).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Engagement Rate
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
