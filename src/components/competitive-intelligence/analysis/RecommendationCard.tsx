
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecommendationCardProps {
  recommendation: {
    action: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
    effort: string;
    timeline: string;
  };
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-sm">{recommendation.action}</h4>
          <Badge variant={
            recommendation.priority === 'high' ? "destructive" : 
            recommendation.priority === 'medium' ? "outline" : "secondary"
          }>
            {recommendation.priority}
          </Badge>
        </div>
        <div className="space-y-2 text-xs">
          <div>
            <span className="font-medium text-muted-foreground">Impact:</span>
            <p>{recommendation.impact}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Effort:</span>
            <p>{recommendation.effort}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Timeline:</span>
            <p>{recommendation.timeline}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
