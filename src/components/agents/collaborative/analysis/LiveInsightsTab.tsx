
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  CheckCircle,
  AlertCircle,
  Zap,
  Activity
} from 'lucide-react';

interface LiveInsightsTabProps {
  insights: any[];
  isSessionActive: boolean;
}

export function LiveInsightsTab({ insights, isSessionActive }: LiveInsightsTabProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'consensus': return CheckCircle;
      case 'divergence': return AlertCircle;
      case 'synthesis': return Brain;
      case 'breakthrough': return Zap;
      default: return Activity;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights Colaborativos en Tiempo Real</CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isSessionActive ? 'Generando insights...' : 'Inicia la sesión para ver insights en tiempo real'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <div key={insight.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${
                        insight.type === 'consensus' ? 'text-green-500' :
                        insight.type === 'divergence' ? 'text-yellow-500' :
                        insight.type === 'breakthrough' ? 'text-purple-500' :
                        'text-blue-500'
                      }`} />
                      <h3 className="font-medium">{insight.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                        {insight.confidence}% confianza
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {insight.impact} impacto
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {insight.agents.map((agent: string) => (
                        <Badge key={agent} variant="outline" className="text-xs">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {insight.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
