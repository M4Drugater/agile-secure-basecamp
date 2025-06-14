
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ThreatCardProps {
  threat: {
    threat: string;
    impact: number;
    probability: number;
    timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
    mitigationStrategies: string[];
  };
}

export function ThreatCard({ threat }: ThreatCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-sm">{threat.threat}</h4>
          <Badge variant={threat.impact > 7 ? "destructive" : threat.impact > 5 ? "outline" : "secondary"}>
            Impact: {threat.impact}/10
          </Badge>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Probability:</span>
            <Progress value={threat.probability * 10} className="w-16 h-2" />
            <span className="text-xs">{threat.probability}/10</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {threat.timeframe}
          </Badge>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Mitigation Strategies:</span>
          {threat.mitigationStrategies.map((strategy: string, index: number) => (
            <div key={index} className="text-xs bg-muted p-2 rounded">
              • {strategy}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
