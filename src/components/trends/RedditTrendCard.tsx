
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUp, 
  MessageSquare, 
  ExternalLink, 
  TrendingUp,
  Clock,
  User
} from 'lucide-react';
import { RedditTrend } from '@/hooks/useRedditTrends';

interface RedditTrendCardProps {
  trend: RedditTrend;
}

export function RedditTrendCard({ trend }: RedditTrendCardProps) {
  const getTimeAgo = (timestamp: number) => {
    const hours = Math.floor((Date.now() / 1000 - timestamp) / 3600);
    if (hours < 1) return 'menos de 1h';
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const getTrendScoreColor = (score: number) => {
    if (score > 1000) return 'text-red-500';
    if (score > 500) return 'text-orange-500';
    if (score > 100) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatTrendScore = (score: number) => {
    if (score > 1000) return `${(score / 1000).toFixed(1)}k`;
    return Math.round(score).toString();
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Badge variant="outline" className="text-xs">
              r/{trend.subreddit}
            </Badge>
            <div className={`flex items-center gap-1 ${getTrendScoreColor(trend.trend_score)}`}>
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-semibold">
                {formatTrendScore(trend.trend_score)}
              </span>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
            <a 
              href={`https://reddit.com${trend.permalink}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Ver en Reddit"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
        
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
          {trend.title}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {trend.selftext && (
            <p className="text-xs text-muted-foreground line-clamp-3">
              {trend.selftext.substring(0, 150)}
              {trend.selftext.length > 150 && '...'}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>u/{trend.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{getTimeAgo(trend.created_utc)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUp className="h-4 w-4" />
                <span className="text-sm font-medium">{trend.score}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">{trend.num_comments}</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {Math.round(trend.upvote_ratio * 100)}% upvoted
            </div>
          </div>
          
          <div className="pt-2">
            <div className="text-xs text-muted-foreground">
              Engagement: {trend.engagement_rate.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
