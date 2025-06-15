
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock,
  FileText,
  Users,
  Zap,
  Star
} from 'lucide-react';

export function ContentAnalyticsTab() {
  const metrics = [
    {
      title: 'Content Generated',
      value: '47',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-500'
    },
    {
      title: 'Average Quality Score',
      value: '92%',
      change: '+5%',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      title: 'Time Saved',
      value: '24h',
      change: '+8h',
      icon: Clock,
      color: 'text-green-500'
    },
    {
      title: 'Personalization Rate',
      value: '85%',
      change: '+15%',
      icon: Target,
      color: 'text-purple-500'
    }
  ];

  const topContent = [
    {
      title: 'Q3 Strategic Review Presentation',
      type: 'Board Presentation',
      quality: 95,
      engagement: 'High',
      created: '2 days ago'
    },
    {
      title: 'Market Expansion Analysis',
      type: 'Executive Memo',
      quality: 92,
      engagement: 'High',
      created: '1 week ago'
    },
    {
      title: 'Competitive Intelligence Report',
      type: 'Strategic Report',
      quality: 88,
      engagement: 'Medium',
      created: '2 weeks ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Content Analytics
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your content generation performance and insights
          </p>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      {metric.change}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Content</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your highest quality generated content
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{content.title}</h4>
                    <p className="text-xs text-muted-foreground">{content.type} • {content.created}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{content.quality}%</Badge>
                    <Badge variant={content.engagement === 'High' ? 'default' : 'secondary'}>
                      {content.engagement}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Insights</CardTitle>
            <p className="text-sm text-muted-foreground">
              Patterns and recommendations for better content
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Most Popular Audience</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  C-Suite Executives (68% of content)
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">Best Performing Style</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Executive style (avg. 94% quality score)
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-sm">Optimization Tip</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Content with business context scores 15% higher
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Types Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Content Generation by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'Executive Memos', count: 18, percentage: 38 },
              { type: 'Strategic Reports', count: 12, percentage: 26 },
              { type: 'Board Presentations', count: 8, percentage: 17 },
              { type: 'Industry Insights', count: 9, percentage: 19 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                  <span className="text-sm font-medium">{item.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
