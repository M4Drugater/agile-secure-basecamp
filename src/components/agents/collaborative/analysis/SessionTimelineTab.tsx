
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface SessionTimelineTabProps {
  insights: any[];
}

export function SessionTimelineTab({ insights }: SessionTimelineTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline de la Sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.slice().reverse().map((insight, index) => (
            <div key={insight.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  insight.type === 'synthesis' ? 'bg-blue-500' :
                  insight.type === 'consensus' ? 'bg-green-500' :
                  insight.type === 'breakthrough' ? 'bg-purple-500' :
                  'bg-yellow-500'
                }`} />
                {index < insights.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{insight.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {insight.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
          
          {insights.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                El timeline se poblará durante la sesión activa
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
